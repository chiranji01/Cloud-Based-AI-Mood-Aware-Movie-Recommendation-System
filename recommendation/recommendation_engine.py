import os
import sys
from pathlib import Path

import django
import numpy as np
import pandas as pd
from django.apps import apps
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


# DJANGO CONNECTION
# Connect the recommendation engine to Django so it can access the MySQL database models

PROJECT_ROOT = Path(__file__).resolve().parent.parent
BACKEND_DIR = PROJECT_ROOT / "backend"

if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "settings")

if not apps.ready:
    django.setup()


# Import database models after Django has been started
from moviesapp.models import Movie, MovieTag, Rating, MoodGenreMapping


# LOAD MOVIES
# Get movie ID, title and genres from MySQL

movies = pd.DataFrame(
    list(
        Movie.objects.values(
            "movie_id",
            "title",
            "genres"
        )
    )
)

movies.rename(
    columns={"movie_id": "movieId"},
    inplace=True
)


# LOAD MOVIE TAGS
# Tags provide additional information about movie content

tags = pd.DataFrame(
    list(
        MovieTag.objects
        .select_related("movie", "tag")
        .values("movie_id", "tag__tag")
    )
)

tags.rename(
    columns={
        "movie_id": "movieId",
        "tag__tag": "tag"
    },
    inplace=True
)


# LOAD RATINGS
# Used to calculate rating quality and popularity

ratings = pd.DataFrame(
    list(
        Rating.objects.values(
            "movie_id",
            "rating"
        )
    )
)

ratings.rename(
    columns={"movie_id": "movieId"},
    inplace=True
)


# COMBINE MOVIE TAGS
# Combine multiple tags for each movie into one text value for TF-IDF

movie_tags = (
    tags.groupby("movieId")["tag"]
    .apply(lambda x: " ".join(x.astype(str)))
    .reset_index()
)


# RATING SUMMARY
# Calculate the average rating and rating count for each movie

rating_summary = (
    ratings.groupby("movieId")["rating"]
    .agg(["mean", "count"])
    .reset_index()
)

rating_summary.columns = [
    "movieId",
    "average_rating",
    "rating_count"
]


# MERGE MOVIE INFORMATION
# Combine movies, tags and rating information into one DataFrame

movies = movies.merge(
    movie_tags,
    on="movieId",
    how="left"
)

movies = movies.merge(
    rating_summary,
    on="movieId",
    how="left"
)


# Replace missing values so they do not cause errors

movies["tag"] = movies["tag"].fillna("")
movies["genres"] = movies["genres"].fillna("")
movies["average_rating"] = movies["average_rating"].fillna(0)
movies["rating_count"] = movies["rating_count"].fillna(0)


# Extract release year from movie title
# Example: "Inside Out (2015)" -> 2015

movies["year"] = pd.to_numeric(
    movies["title"].str.extract(r"\((\d{4})\)$")[0],
    errors="coerce"
).fillna(1900)


# PREPARE CONTENT FEATURES
# Convert genres into text format for TF-IDF

movies["genres_clean"] = movies["genres"].str.replace(
    "|",
    " ",
    regex=False
)


# Combine genres and tags because both describe movie content

movies["combined_features"] = (
    movies["genres_clean"]
    + " "
    + movies["tag"]
)


# TF-IDF MODEL
# Convert movie content into numerical vectors

tfidf = TfidfVectorizer(
    stop_words="english"
)

tfidf_matrix = tfidf.fit_transform(
    movies["combined_features"]
)


# GENRE MATCH
# Calculate how strongly the movie focuses on the genres associated with the selected mood

def calculate_genre_match(movie_genres, selected_genres):

    if not selected_genres:
        return 0.0

    movie_genres = movie_genres.split("|")
    matches = sum(
        genre in movie_genres
        for genre in selected_genres
    )

    if matches == 0:
        return 0.0

    # How many of the mood genres are covered by this movie
    mood_coverage = matches / len(selected_genres)

    # How focused the movie is on those matching genres
    # This prevents one matching genre among many genres
    # from receiving a full genre score
    genre_focus = matches / len(movie_genres)

    return mood_coverage * genre_focus


# MAIN RECOMMENDATION FUNCTION
# Generate Top 10 movies based on the user's selected mood

def get_mood_recommendations(
    mood,
    number_of_movies=10
):

    # Clean the user's mood input
    # Example: " happy " -> "Happy"

    mood = mood.strip().title()


    # Get genres and keywords stored for this mood in MySQL

    try:
        mood_profile = MoodGenreMapping.objects.get(
            mood_name__iexact=mood
        )

    except MoodGenreMapping.DoesNotExist:
        return []


    # Convert database genre and keyword text into Python lists

    selected_genres = [
        x.strip()
        for x in mood_profile.genres.split(",")
        if x.strip()
    ]

    selected_keywords = [
        x.strip()
        for x in mood_profile.keywords.split(",")
        if x.strip()
    ]


    # MOOD SIMILARITY
    # Create a mood profile using selected genres and mood keywords

    mood_text = " ".join(
        selected_genres
        + selected_keywords
    )


    # Convert the mood profile into the same TF-IDF vector space
    # used for movies

    mood_vector = tfidf.transform(
        [mood_text]
    )


    # Compare the selected mood with every movie using cosine similarity

    mood_similarity = cosine_similarity(
        mood_vector,
        tfidf_matrix
    ).flatten()


    # GENRE MATCH
    # Check how strongly each movie's genres match the selected mood

    genre_match = movies["genres"].apply(
        lambda x: calculate_genre_match(
            x,
            selected_genres
        )
    )


    # RELIABLE RATING
    # Convert average rating to a value between 0 and 1

    rating_score = (
        movies["average_rating"]
        / 5.0
    )


    # Reduce the influence of ratings when a movie has only a few ratings

    rating_reliability = (
        movies["rating_count"]
        / (movies["rating_count"] + 20)
    )


    reliable_rating = (
        rating_score
        * rating_reliability
    )


    # POPULARITY
    # More ratings indicate greater popularity
    # Log scaling prevents very popular movies from dominating

    popularity = np.log1p(
        movies["rating_count"]
    )

    if popularity.max() > 0:
        popularity = (
            popularity
            / popularity.max()
        )


    # RECENCY
    # Newer movies receive a small preference
    # but recency is only a supporting factor

    movie_age = (
        2026 - movies["year"]
    ).clip(lower=0)

    recency = np.exp(
        -movie_age / 12.0
    )


    # FINAL SCORE
    #
    # 60% = TF-IDF mood similarity
    # 20% = genre relevance
    # 10% = reliable user rating
    # 5%  = popularity
    # 5%  = recency
    #
    # Mood-related factors therefore make up 80%
    # of the final recommendation score

    final_score = (
        0.60 * mood_similarity
        + 0.20 * genre_match
        + 0.10 * reliable_rating
        + 0.05 * popularity
        + 0.05 * recency
    )


    # Rank all movies by final score

    ranked_indices = (
        final_score.argsort()[::-1]
    )


    recommendations = []


    # Try newer movies first.
    # If there are not enough suitable movies,
    # gradually allow older movies.

    for minimum_year in [
        2022,
        2020,
        2015,
        2010
    ]:

        for index in ranked_indices:

            movie = movies.iloc[index]


            # Skip movies older than the current preferred year

            if movie["year"] < minimum_year:
                continue


            # Avoid duplicate movies during fallback

            if any(
                item["movieId"]
                == int(movie["movieId"])
                for item in recommendations
            ):
                continue


            mood_score = float(
                mood_similarity[index]
            )

            genre_score = float(
                genre_match.iloc[index]
            )


            # RELEVANCE FILTER
            # A movie must have a meaningful mood or genre relationship.
            #
            # Movies with very weak mood similarity and weak genre focus
            # are removed.

            if (
                mood_score < 0.05
                and genre_score <= 0.5
            ):
                continue


            # QUALITY FILTER
            # Skip a movie if it has too few ratings
            # OR if its average rating is below 3.0.
            #
            # Therefore the movie must satisfy both quality requirements:
            # enough ratings AND an acceptable average rating.

            if (
                movie["rating_count"] < 10
                or movie["average_rating"] < 3.0
            ):
                continue


            # Add suitable movie to candidate recommendation list

            recommendations.append({

                "movieId":
                    int(movie["movieId"]),

                "title":
                    movie["title"],

                "genres":
                    movie["genres"],

                "year":
                    int(movie["year"]),

                "mood_similarity":
                    round(
                        mood_score,
                        3
                    ),

                "genre_match_score":
                    round(
                        genre_score,
                        3
                    ),

                "average_rating":
                    round(
                        float(
                            movie["average_rating"]
                        ),
                        2
                    ),

                "rating_count":
                    int(
                        movie["rating_count"]
                    ),

                "recency_score":
                    round(
                        float(
                            recency.iloc[index]
                        ),
                        3
                    ),

                "final_score":
                    round(
                        float(
                            final_score.iloc[index]
                        ),
                        3
                    )
            })


        # Once enough candidate movies are available,
        # stop expanding the allowed year range

        if len(recommendations) >= number_of_movies:
            break


    # Sort selected candidate movies again using final score.
    # This guarantees that the results shown to the user are
    # ordered from highest recommendation score to lowest.

    recommendations = sorted(
        recommendations,
        key=lambda x: x["final_score"],
        reverse=True
    )


    # Return only the requested number of movies

    return recommendations[
        :number_of_movies
    ]
