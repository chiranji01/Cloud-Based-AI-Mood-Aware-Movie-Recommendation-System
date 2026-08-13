import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Load MovieLens data
movies = pd.read_csv("data/movies.csv")
tags = pd.read_csv("data/tags.csv")
ratings = pd.read_csv("data/ratings.csv")

# Combine all tags for each movie
movie_tags = (
    tags.groupby("movieId")["tag"]
    .apply(lambda x: " ".join(x.astype(str)))
    .reset_index()
)

# Calculate average rating and rating count for each movie
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

# Merge tags and ratings with movie data
movies = movies.merge(movie_tags, on="movieId", how="left")
movies = movies.merge(rating_summary, on="movieId", how="left")

# Fill missing values
movies["tag"] = movies["tag"].fillna("")
movies["average_rating"] = movies["average_rating"].fillna(0)
movies["rating_count"] = movies["rating_count"].fillna(0)

# Prepare genres
movies["genres_clean"] = movies["genres"].str.replace("|", " ", regex=False)

# Combine genres and tags
movies["combined_features"] = (
    movies["genres_clean"] + " " + movies["tag"]
)

# Create TF-IDF vectors
tfidf = TfidfVectorizer(stop_words="english")
tfidf_matrix = tfidf.fit_transform(movies["combined_features"])

print("MovieLens dataset loaded successfully!")
print("\nTF-IDF successfully created!")
print("TF-IDF matrix shape:", tfidf_matrix.shape)

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

# Generate recommendations based on mood
def get_mood_recommendations(mood, number_of_movies=10):

    if mood not in mood_profiles:
        print("\nInvalid mood.")
        print("Please choose from:", ", ".join(mood_profiles.keys()))
        return

    selected_genres = mood_profiles[mood]["genres"]
    selected_keywords = mood_profiles[mood]["keywords"]

    # Create mood text using genres and keywords
    mood_text = " ".join(
        selected_genres + selected_keywords
    )

    # Convert mood into a TF-IDF vector
    mood_vector = tfidf.transform([mood_text])

    # Calculate similarity between mood and movies
    mood_similarity = cosine_similarity(
        mood_vector,
        tfidf_matrix
    ).flatten()

    # Normalise average ratings from 0 to 1
    rating_score = movies["average_rating"] / 5.0

    # Give more confidence to movies with more ratings
    rating_reliability = (
        movies["rating_count"]
        / (movies["rating_count"] + 10)
    )

    # Create a more reliable rating score
    reliable_rating_score = (
        rating_score * rating_reliability
    )

    # Combine mood similarity and reliable movie rating
    final_score = (
        0.8 * mood_similarity
        + 0.2 * reliable_rating_score
    )

    # Rank movies from highest to lowest final score
    ranked_indices = final_score.argsort()[::-1]

    recommendations = []

    for movie_index in ranked_indices:

        movie_genres = movies.iloc[movie_index]["genres"]

        # Keep movies matching at least one mood genre
        if any(
            genre in movie_genres
            for genre in selected_genres
        ):
            recommendations.append(
                {
                    "title":
                        movies.iloc[movie_index]["title"],

                    "genres":
                        movie_genres,

                    "similarity":
                        round(
                            mood_similarity[movie_index],
                            3
                        ),

                    "rating":
                        round(
                            movies.iloc[movie_index][
                                "average_rating"
                            ],
                            2
                        ),

                    "rating_count":
                        int(
                            movies.iloc[movie_index][
                                "rating_count"
                            ]
                        ),

                    "final_score":
                        round(
                            final_score.iloc[movie_index],
                            3
                        )
                }
            )

        if len(recommendations) == number_of_movies:
            break

    print(f"\nTop recommendations for mood: {mood}")
    print(
        "Mood-related genres:",
        ", ".join(selected_genres)
    )
    print()

    for number, movie in enumerate(
        recommendations,
        start=1
    ):
        print(f"{number}. {movie['title']}")
        print(f"   Genres: {movie['genres']}")
        print(
            f"   Mood Similarity: "
            f"{movie['similarity']}"
        )
        print(
            f"   Average Rating: "
            f"{movie['rating']}"
        )
        print(
            f"   Number of Ratings: "
            f"{movie['rating_count']}"
        )
        print(
            f"   Final Score: "
            f"{movie['final_score']}"
        )
        print()


# Ask the user to select a mood
print("\nAvailable moods:")

for mood in mood_profiles:
    print("-", mood)

selected_mood = input(
    "\nEnter your mood: "
).strip().title()

get_mood_recommendations(selected_mood)