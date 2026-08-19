import pandas as pd
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Find the project and data folders
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"

# Load MovieLens data
movies = pd.read_csv(DATA_DIR / "movies.csv")
tags = pd.read_csv(DATA_DIR / "tags.csv")
ratings = pd.read_csv(DATA_DIR / "ratings.csv")

# Combine all tags for each movie
movie_tags = (
    tags.groupby("movieId")["tag"]
    .apply(lambda x: " ".join(x.astype(str)))
    .reset_index()
)

# Calculate average rating and rating count
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

# Merge movie information
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

# Fill missing values
movies["tag"] = movies["tag"].fillna("")
movies["average_rating"] = movies["average_rating"].fillna(0)
movies["rating_count"] = movies["rating_count"].fillna(0)

# Prepare movie genres
movies["genres_clean"] = movies["genres"].str.replace(
    "|",
    " ",
    regex=False
)

# Combine genres and tags to create the movie features
movies["combined_features"] = (
    movies["genres_clean"]
    + " "
    + movies["tag"]
)

# Create TF-IDF vectors
tfidf = TfidfVectorizer(stop_words="english")

tfidf_matrix = tfidf.fit_transform(
    movies["combined_features"]
)

# Mood profiles
mood_profiles = {
    "Happy": {
        "genres": ["Comedy", "Animation", "Adventure"],
        "keywords": [
            "funny",
            "fun",
            "uplifting",
            "feel good",
            "lighthearted"
        ]
    },

    "Sad": {
        "genres": ["Drama", "Romance"],
        "keywords": [
            "emotional",
            "sad",
            "heartbreaking",
            "touching"
        ]
    },

    "Relaxed": {
        "genres": ["Comedy", "Romance", "Fantasy"],
        "keywords": [
            "calm",
            "relaxing",
            "gentle",
            "feel good",
            "easygoing"
        ]
    },

    "Excited": {
        "genres": ["Action", "Adventure", "Thriller"],
        "keywords": [
            "exciting",
            "fast paced",
            "intense",
            "action",
            "suspense"
        ]
    },

    "Romantic": {
        "genres": ["Romance", "Drama"],
        "keywords": [
            "romantic",
            "love",
            "relationship",
            "heartwarming"
        ]
    },

    "Stressed": {
        "genres": ["Comedy", "Animation", "Fantasy"],
        "keywords": [
            "funny",
            "lighthearted",
            "feel good",
            "comfort",
            "relaxing"
        ]
    }
}
# Main reusable recommendation function (receives only user's selected mood & returns Top 10 recommendations)
def get_mood_recommendations(mood, number_of_movies=10):

    # Clean the mood received from Django or testing
    mood = mood.strip().title()

    if mood not in mood_profiles:
        return []

    selected_genres = mood_profiles[mood]["genres"]
    selected_keywords = mood_profiles[mood]["keywords"]

    # Create the mood profile
    mood_text = " ".join(
        selected_genres + selected_keywords
    )

    # Convert mood profile into TF-IDF
    mood_vector = tfidf.transform([mood_text])

    # Calculate similarity with all movies
    mood_similarity = cosine_similarity(
        mood_vector,
        tfidf_matrix
    ).flatten()

    # Normalise ratings
    rating_score = movies["average_rating"] / 5.0

    # Reduce the influence of ratings with very few users
    rating_reliability = (
        movies["rating_count"]
        / (movies["rating_count"] + 10)
    )

    reliable_rating_score = (
        rating_score * rating_reliability
    )

    # Mood is the main factor
    final_score = (
        0.8 * mood_similarity
        + 0.2 * reliable_rating_score
    )

    # Rank movies
    ranked_indices = final_score.argsort()[::-1]

    recommendations = []

    for movie_index in ranked_indices:

        movie = movies.iloc[movie_index]
        movie_genres = movie["genres"]

        # Movie must match at least one mood genre
        if any(
            genre in movie_genres
            for genre in selected_genres
        ):
            recommendations.append(
                {
                    "movieId": int(movie["movieId"]),
                    "title": movie["title"],
                    "genres": movie_genres,
                    "mood_similarity": round(
                        float(mood_similarity[movie_index]),
                        3
                    ),
                    "average_rating": round(
                        float(movie["average_rating"]),
                        2
                    ),
                    "rating_count": int(
                        movie["rating_count"]
                    ),
                    "final_score": round(
                        float(final_score.iloc[movie_index]),
                        3
                    )
                }
            )

        if len(recommendations) == number_of_movies:
            break

    return recommendations