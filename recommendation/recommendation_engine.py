import os
import sys
from pathlib import Path

import django
import numpy as np
import pandas as pd
from django.apps import apps
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


# ============================================================
# 1. DJANGO CONFIGURATION
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parent.parent  # Resolve the main project directory.
BACKEND_DIR = PROJECT_ROOT / "backend"  # Define the Django backend directory.

if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))  # Add the backend directory to the Python module path.

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "settings")  # Configure the Django settings module.

if not apps.ready:
    django.setup()  # Initialise Django before accessing database models.

from moviesapp.models import Movie, MovieTag, Rating, MoodGenreMapping


# ============================================================
# 2. LOAD MOVIE DATA
# ============================================================

movies = pd.DataFrame(
    list(Movie.objects.values("movie_id", "title", "genres"))
)  # Load movie records from the database.

movies.rename(columns={"movie_id": "movieId"}, inplace=True)  # Standardise the movie ID column name.


# ============================================================
# 3. LOAD MOVIE TAGS
# ============================================================

tags = pd.DataFrame(
    list(
        MovieTag.objects
        .select_related("movie", "tag")
        .values("movie_id", "tag__tag")
    )
)  # Load movie tags with related movie and tag data efficiently.

tags.rename(
    columns={
        "movie_id": "movieId",
        "tag__tag": "tag"
    },
    inplace=True
)  # Standardise movie tag column names.


# ============================================================
# 4. LOAD RATINGS
# ============================================================

ratings = pd.DataFrame(
    list(Rating.objects.values("movie_id", "rating"))
)  # Load movie rating records from the database.

ratings.rename(columns={"movie_id": "movieId"}, inplace=True)  # Standardise the rating movie ID column.


# ============================================================
# 5. PREPARE MOVIE DATA
# ============================================================

movie_tags = (
    tags.groupby("movieId")["tag"]
    .apply(lambda x: " ".join(x.astype(str)))
    .reset_index()
)  # Combine all tags belonging to each movie into a single text feature.

rating_summary = (
    ratings.groupby("movieId")["rating"]
    .agg(["mean", "count"])
    .reset_index()
)  # Calculate the average rating and total rating count for each movie.

rating_summary.columns = [
    "movieId",
    "average_rating",
    "rating_count"
]  # Assign descriptive names to the aggregated rating columns.

movies = movies.merge(movie_tags, on="movieId", how="left")  # Merge movie tags into the movie dataset.
movies = movies.merge(rating_summary, on="movieId", how="left")  # Merge rating statistics into the movie dataset.

movies["tag"] = movies["tag"].fillna("")  # Replace missing tags with empty text.
movies["genres"] = movies["genres"].fillna("")  # Replace missing genres with empty text.
movies["average_rating"] = movies["average_rating"].fillna(0)  # Replace missing average ratings with zero.
movies["rating_count"] = movies["rating_count"].fillna(0)  # Replace missing rating counts with zero.

movies["year"] = pd.to_numeric(
    movies["title"].str.extract(r"\((\d{4})\)$")[0],
    errors="coerce"
).fillna(1900)  # Extract the release year from each movie title.


# ============================================================
# 6. PREPARE CONTENT FEATURES
# ============================================================

movies["genres_clean"] = movies["genres"].str.replace("|", " ", regex=False)  # Convert genre separators into spaces for text processing.
movies["combined_features"] = movies["genres_clean"] + " " + movies["tag"]  # Combine genres and tags into a single content feature.


# ============================================================
# 7. TF-IDF FEATURE EXTRACTION
# ============================================================

tfidf = TfidfVectorizer(stop_words="english")  # Initialise TF-IDF while excluding common English stop words.
tfidf_matrix = tfidf.fit_transform(movies["combined_features"])  # Generate TF-IDF vectors for all movie content features.


# ============================================================
# 8. GENRE MATCH CALCULATION
# ============================================================

def calculate_genre_match(movie_genres, selected_genres):
    """Calculate genre relevance between a movie and the selected mood profile."""

    if not selected_genres:
        return 0.0  # Return zero when no mood genres are available.

    movie_genres = movie_genres.split("|")  # Convert the movie genre string into individual genres.

    matches = sum(
        genre in movie_genres
        for genre in selected_genres
    )  # Count genres shared between the movie and selected mood.

    if matches == 0:
        return 0.0  # Return zero when there are no matching genres.

    mood_coverage = matches / len(selected_genres)  # Measure how much of the mood genre profile is covered.
    genre_focus = matches / len(movie_genres)  # Measure how strongly the movie focuses on matching genres.

    return mood_coverage * genre_focus  # Combine mood coverage and genre focus into one relevance score.


# ============================================================
# 9. MOOD-BASED RECOMMENDATION ENGINE
# ============================================================

def get_mood_recommendations(mood, number_of_movies=10):
    """Generate ranked movie recommendations based on the user's selected mood."""

    # --------------------------------------------------------
    # STEP 1: NORMALISE USER INPUT
    # --------------------------------------------------------

    mood = mood.strip().title()  # Normalise the selected mood for consistent database matching.


    # --------------------------------------------------------
    # STEP 2: RETRIEVE MOOD PROFILE
    # --------------------------------------------------------

    try:
        mood_profile = MoodGenreMapping.objects.get(
            mood_name__iexact=mood
        )  # Retrieve the selected mood profile from the database.

    except MoodGenreMapping.DoesNotExist:
        return []  # Return an empty result when the selected mood is unavailable.

    selected_genres = [
        x.strip()
        for x in mood_profile.genres.split(",")
        if x.strip()
    ]  # Convert the stored mood genres into a clean Python list.

    selected_keywords = [
        x.strip()
        for x in mood_profile.keywords.split(",")
        if x.strip()
    ]  # Convert the stored mood keywords into a clean Python list.


    # --------------------------------------------------------
    # STEP 3: BUILD MOOD CONTENT
    # --------------------------------------------------------

    mood_text = " ".join(selected_genres + selected_keywords)  # Combine mood genres and keywords into one text profile.


    # --------------------------------------------------------
    # STEP 4: CREATE MOOD TF-IDF VECTOR
    # --------------------------------------------------------

    mood_vector = tfidf.transform([mood_text])  # Convert the mood profile using the existing TF-IDF vocabulary.


    # --------------------------------------------------------
    # STEP 5: CALCULATE COSINE SIMILARITY
    # --------------------------------------------------------

    mood_similarity = cosine_similarity(
        mood_vector,
        tfidf_matrix
    ).flatten()  # Calculate cosine similarity between the selected mood and all movies.


    # --------------------------------------------------------
    # STEP 6: CALCULATE GENRE MATCH
    # --------------------------------------------------------

    genre_match = movies["genres"].apply(
        lambda x: calculate_genre_match(x, selected_genres)
    )  # Calculate genre relevance between each movie and the selected mood.


    # --------------------------------------------------------
    # STEP 7: CALCULATE RELIABLE RATING
    # --------------------------------------------------------

    rating_score = movies["average_rating"] / 5.0  # Normalise average ratings to a 0–1 scale.

    rating_reliability = (
        movies["rating_count"] / (movies["rating_count"] + 20)
    )  # Estimate rating reliability using the number of available ratings.

    reliable_rating = rating_score * rating_reliability  # Combine rating quality with rating reliability.


    # --------------------------------------------------------
    # STEP 8: CALCULATE POPULARITY
    # --------------------------------------------------------

    popularity = np.log1p(movies["rating_count"])  # Calculate popularity using logarithmically scaled rating counts.

    if popularity.max() > 0:
        popularity = popularity / popularity.max()  # Normalise popularity values to approximately 0–1.


    # --------------------------------------------------------
    # STEP 9: CALCULATE RECENCY
    # --------------------------------------------------------

    movie_age = (2026 - movies["year"]).clip(lower=0)  # Calculate movie age while preventing negative values.
    recency = np.exp(-movie_age / 12.0)  # Apply exponential decay to favour more recent movies.


    # --------------------------------------------------------
    # STEP 10: CALCULATE FINAL RANKING SCORE
    # --------------------------------------------------------

    final_score = (
        0.60 * mood_similarity
        + 0.20 * genre_match
        + 0.10 * reliable_rating
        + 0.05 * popularity
        + 0.05 * recency
    )  # Combine mood relevance and quality signals using weighted ranking.


    # --------------------------------------------------------
    # STEP 11: RANK MOVIES
    # --------------------------------------------------------

    ranked_indices = final_score.argsort()[::-1]  # Rank movie indexes from highest to lowest final score.
    recommendations = []  # Store movies that pass the recommendation filters.


    # --------------------------------------------------------
    # STEP 12: APPLY YEAR PREFERENCE
    # --------------------------------------------------------

    for minimum_year in [2022, 2020, 2015, 2010]:  # Gradually expand the release-year range when necessary.

        for index in ranked_indices:
            movie = movies.iloc[index]  # Retrieve the current movie using its ranked index.

            if movie["year"] < minimum_year:
                continue  # Skip movies older than the current preferred release year.

            if any(
                item["movieId"] == int(movie["movieId"])
                for item in recommendations
            ):
                continue  # Prevent duplicate movies across year-selection passes.

            mood_score = float(mood_similarity[index])  # Retrieve the movie's mood similarity score.
            genre_score = float(genre_match.iloc[index])  # Retrieve the movie's genre relevance score.


            # ------------------------------------------------
            # STEP 13: APPLY RELEVANCE FILTER
            # ------------------------------------------------

            if mood_score < 0.05 and genre_score <= 0.5:
                continue  # Exclude movies with insufficient mood and genre relevance.


            # ------------------------------------------------
            # STEP 14: APPLY QUALITY FILTER
            # ------------------------------------------------

            if movie["rating_count"] < 10 or movie["average_rating"] < 3.0:
                continue  # Exclude movies that do not meet minimum rating quality requirements.


            # ------------------------------------------------
            # STEP 15: ADD QUALIFIED MOVIE
            # ------------------------------------------------

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
            })  # Store the movie and its calculated recommendation metrics.

        if len(recommendations) >= number_of_movies:
            break  # Stop expanding the year range once enough recommendations are available.


    # --------------------------------------------------------
    # STEP 16: SORT FINAL RECOMMENDATIONS
    # --------------------------------------------------------

    recommendations = sorted(
        recommendations,
        key=lambda x: x["final_score"],
        reverse=True
    )  # Sort qualified recommendations from highest to lowest final score.


    # --------------------------------------------------------
    # STEP 17: RETURN RESULTS
    # --------------------------------------------------------

    return recommendations[:number_of_movies]  # Return the requested number of highest-ranked recommendations.