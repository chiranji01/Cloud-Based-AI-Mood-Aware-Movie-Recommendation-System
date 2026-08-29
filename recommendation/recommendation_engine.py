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

# Import database models after Django has been started.
from moviesapp.models import Movie, MovieTag, Rating, MoodGenreMapping


# LOAD MOVIES - Get movie ID, title and genres from MySQL
movies = pd.DataFrame(list(Movie.objects.values("movie_id", "title", "genres")))
movies.rename(columns={"movie_id": "movieId"}, inplace=True)


# LOAD MOVIE TAGS - Tags provide additional information about movie content
tags = pd.DataFrame(list(
    MovieTag.objects.select_related("movie", "tag").values("movie_id", "tag__tag")
))
tags.rename(columns={"movie_id": "movieId", "tag__tag": "tag"}, inplace=True)


# LOAD RATINGS - Used to calculate rating quality and popularity
ratings = pd.DataFrame(list(Rating.objects.values("movie_id", "rating")))
ratings.rename(columns={"movie_id": "movieId"}, inplace=True)


# COMBINE MOVIE TAGS - Combine multiple tags for each movie into one text value for TF-IDF  
movie_tags = tags.groupby("movieId")["tag"].apply(
    lambda x: " ".join(x.astype(str))
).reset_index()


# RATING SUMMARY - Calculate the average rating and rating count for each movie
rating_summary = ratings.groupby("movieId")["rating"].agg(["mean", "count"]).reset_index()
rating_summary.columns = ["movieId", "average_rating", "rating_count"]


# MERGE MOVIE INFORMATION - Combine movies, tags and rating information into one DataFrame
movies = movies.merge(movie_tags, on="movieId", how="left")
movies = movies.merge(rating_summary, on="movieId", how="left")

# Replace missing values so they do not cause errors
movies["tag"] = movies["tag"].fillna("")
movies["genres"] = movies["genres"].fillna("")
movies["average_rating"] = movies["average_rating"].fillna(0)
movies["rating_count"] = movies["rating_count"].fillna(0)


# Extract the release year from the movie title, e.g. "Inside Out (2015)" -> 2015
movies["year"] = pd.to_numeric(
    movies["title"].str.extract(r"\((\d{4})\)$")[0],
    errors="coerce"
).fillna(1900)


# PREPARE CONTENT FEATURES - Convert genres into text format for TF-IDF
movies["genres_clean"] = movies["genres"].str.replace("|", " ", regex=False)

# Combine genres and tags because both describe movie content
movies["combined_features"] = movies["genres_clean"] + " " + movies["tag"]

# TF-IDF MODEL - Convert movie content into numerical vectors
tfidf = TfidfVectorizer(stop_words="english")
tfidf_matrix = tfidf.fit_transform(movies["combined_features"])

# GENRE MATCH - Calculate how well a movie's genres match the selected mood genres
def calculate_genre_match(movie_genres, selected_genres):
    if not selected_genres:
        return 0.0

    movie_genres = movie_genres.split("|")
    matches = sum(genre in movie_genres for genre in selected_genres)

    return matches / len(selected_genres)

# MAIN RECOMMENDATION FUNCTION - Generate Top 10 movies based on the user's selected mood
def get_mood_recommendations(mood, number_of_movies=10):

    # Clean the user's mood input; Example: " happy " becomes "Happy"
    mood = mood.strip().title()

    # Get the genres and keywords stored for this mood in MySQL
    try:
        mood_profile = MoodGenreMapping.objects.get(mood_name__iexact=mood)
    except MoodGenreMapping.DoesNotExist:
        return []

    # Convert database genre and keyword text into Python lists
    selected_genres = [x.strip() for x in mood_profile.genres.split(",") if x.strip()]
    selected_keywords = [x.strip() for x in mood_profile.keywords.split(",") if x.strip()]

    # MOOD SIMILARITY
    mood_text = " ".join(selected_genres + selected_keywords) # Create the mood profile
    mood_vector = tfidf.transform([mood_text])   # Convert it using the existing TF-IDF model
    mood_similarity = cosine_similarity(mood_vector, tfidf_matrix).flatten() # Compare the selected mood with all movies using cosine similarity

    # GENRE MATCH - Check how well each movie's genres match the selected mood
    genre_match = movies["genres"].apply(
        lambda x: calculate_genre_match(x, selected_genres)
    )

    # RELIABLE RATING - Use movie rating quality while reducing the influence of movies with few ratings
    rating_score = movies["average_rating"] / 5.0

    # Reduce the effect of ratings when only a few users rated the movie
    rating_reliability = movies["rating_count"] / (movies["rating_count"] + 20) 
    reliable_rating = rating_score * rating_reliability

    # POPULARITY - More ratings indicate greater popularity. Log scaling prevents very popular movies from dominating the recommendations.
    popularity = np.log1p(movies["rating_count"])
    if popularity.max() > 0:
        popularity = popularity / popularity.max()

    # RECENCY - Newer movies receive a higher recency score. The score gradually decreases as a movie gets older.
    movie_age = (2026 - movies["year"]).clip(lower=0)
    recency = np.exp(-movie_age / 12.0)

    # FINAL SCORE - Combine all scores.
    # Mood similarity is the MAIN factor.
    # Genre match also comes from the selected mood.
    # Recency gives newer movies a stronger preference.
    # Rating and popularity are supporting factors.
    # Total = 100%
    final_score = (
        0.55 * mood_similarity
        + 0.15 * genre_match
        + 0.05 * reliable_rating
        + 0.05 * popularity
        + 0.20 * recency
    )

    # Rank movies from highest score to lowest score
    ranked_indices = final_score.argsort()[::-1]

    recommendations = []

    # Try newer movies first. If there are not enough results, gradually allow slightly older movies.
    for minimum_year in [2022, 2020, 2015, 2010]:
        for index in ranked_indices:

            movie = movies.iloc[index] 

            # Skip movies older than the current preferred year
            if movie["year"] < minimum_year:
                continue

            # Avoid adding the same movie again during fallback
            if any(x["movieId"] == int(movie["movieId"]) for x in recommendations):
                continue

            mood_score = float(mood_similarity[index])
            genre_score = float(genre_match.iloc[index])

            
            # RELEVANCE FILTER - Skip a movie if it does not match the mood or genres
            # Movie must have either: a genre match, OR sufficient TF-IDF mood similarity.
            if genre_score <= 0 and mood_score < 0.15:
                continue

            # QUALITY FILTER - Skip movies with both fewer than 10 ratings and an average below 3.0
            if movie["rating_count"] < 10 and movie["average_rating"] < 3.0: #OR look into the conditional statement 
                continue

            # Add the suitable movie to the recommendation list
            recommendations.append({
                "movieId": int(movie["movieId"]),
                "title": movie["title"],
                "genres": movie["genres"],
                "year": int(movie["year"]),
                "mood_similarity": round(mood_score, 3),
                "genre_match_score": round(genre_score, 3),
                "average_rating": round(float(movie["average_rating"]), 2),
                "rating_count": int(movie["rating_count"]),
                "recency_score": round(float(recency.iloc[index]), 3),
                "final_score": round(float(final_score.iloc[index]), 3)
            })

            # Stop as soon as 10 suitable movies are found
            if len(recommendations) == number_of_movies:
                return recommendations

    return recommendations