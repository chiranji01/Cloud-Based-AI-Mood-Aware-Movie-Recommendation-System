import os
import sys
from pathlib import Path

import django
import numpy as np
import pandas as pd
from django.apps import apps
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


# Connect recommendation engine to Django
PROJECT_ROOT = Path(__file__).resolve().parent.parent
BACKEND_DIR = PROJECT_ROOT / "backend"

if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "settings")

if not apps.ready:
    django.setup()


from moviesapp.models import Movie, MovieTag, Rating, MoodGenreMapping


# Load movies
movies = pd.DataFrame(list(Movie.objects.values("movie_id", "title", "genres")))
movies.rename(columns={"movie_id": "movieId"}, inplace=True)


# Load movie tags
tags = pd.DataFrame(list(
    MovieTag.objects.select_related("movie", "tag").values("movie_id", "tag__tag")
))
tags.rename(columns={"movie_id": "movieId", "tag__tag": "tag"}, inplace=True)


# Load ratings
ratings = pd.DataFrame(list(Rating.objects.values("movie_id", "rating")))
ratings.rename(columns={"movie_id": "movieId"}, inplace=True)


# Combine tags for each movie
movie_tags = tags.groupby("movieId")["tag"].apply(
    lambda x: " ".join(x.astype(str))
).reset_index()


# Calculate average rating and rating count
rating_summary = ratings.groupby("movieId")["rating"].agg(["mean", "count"]).reset_index()
rating_summary.columns = ["movieId", "average_rating", "rating_count"]


# Merge movie information
movies = movies.merge(movie_tags, on="movieId", how="left")
movies = movies.merge(rating_summary, on="movieId", how="left")

movies["tag"] = movies["tag"].fillna("")
movies["genres"] = movies["genres"].fillna("")
movies["average_rating"] = movies["average_rating"].fillna(0)
movies["rating_count"] = movies["rating_count"].fillna(0)


# Extract release year
movies["year"] = pd.to_numeric(
    movies["title"].str.extract(r"\((\d{4})\)$")[0],
    errors="coerce"
).fillna(1900)


# Prepare movie features
movies["genres_clean"] = movies["genres"].str.replace("|", " ", regex=False)
movies["combined_features"] = movies["genres_clean"] + " " + movies["tag"]


# Create TF-IDF vectors
tfidf = TfidfVectorizer(stop_words="english")
tfidf_matrix = tfidf.fit_transform(movies["combined_features"])


def calculate_genre_match(movie_genres, selected_genres):
    if not selected_genres:
        return 0.0

    movie_genres = movie_genres.split("|")
    matches = sum(genre in movie_genres for genre in selected_genres)

    return matches / len(selected_genres)


def get_mood_recommendations(mood, number_of_movies=10):

    mood = mood.strip().title()

    try:
        mood_profile = MoodGenreMapping.objects.get(mood_name__iexact=mood)
    except MoodGenreMapping.DoesNotExist:
        return []

    selected_genres = [x.strip() for x in mood_profile.genres.split(",") if x.strip()]
    selected_keywords = [x.strip() for x in mood_profile.keywords.split(",") if x.strip()]

    # Mood similarity
    mood_text = " ".join(selected_genres + selected_keywords)
    mood_vector = tfidf.transform([mood_text])
    mood_similarity = cosine_similarity(mood_vector, tfidf_matrix).flatten()

    # Genre match
    genre_match = movies["genres"].apply(
        lambda x: calculate_genre_match(x, selected_genres)
    )

    # Rating quality
    rating_score = movies["average_rating"] / 5.0
    rating_reliability = movies["rating_count"] / (movies["rating_count"] + 20)
    reliable_rating = rating_score * rating_reliability

    # Popularity
    popularity = np.log1p(movies["rating_count"])
    if popularity.max() > 0:
        popularity = popularity / popularity.max()

    # Recency - newer movies get higher scores
    movie_age = (2026 - movies["year"]).clip(lower=0)
    recency = np.exp(-movie_age / 12.0)

    # Final score
    final_score = (
        0.55 * mood_similarity
        + 0.15 * genre_match
        + 0.05 * reliable_rating
        + 0.05 * popularity
        + 0.20 * recency
    )

    ranked_indices = final_score.argsort()[::-1]

    recommendations = []

    # First try movies from 2015 onwards
    for minimum_year in [2022, 2020, 2015, 2010]:
        for index in ranked_indices:

            movie = movies.iloc[index]

            if movie["year"] < minimum_year:
                continue

            # Avoid duplicates when fallback runs
            if any(x["movieId"] == int(movie["movieId"]) for x in recommendations):
                continue

            mood_score = float(mood_similarity[index])
            genre_score = float(genre_match.iloc[index])

            # Skip unrelated movies
            if genre_score <= 0 and mood_score < 0.15:
                continue

            # Skip unreliable low-rated movies
            if movie["rating_count"] < 10 and movie["average_rating"] < 3.0:
                continue

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

            if len(recommendations) == number_of_movies:
                return recommendations

    return recommendations