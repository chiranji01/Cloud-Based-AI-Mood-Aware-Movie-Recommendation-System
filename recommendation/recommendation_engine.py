import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

movies = pd.read_csv("data/movies.csv")

movies["genres_clean"] = movies["genres"].str.replace("|", " ", regex=False)

tfidf = TfidfVectorizer()
tfidf_matrix = tfidf.fit_transform(movies["genres_clean"])

cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

print("MovieLens dataset loaded successfully!")
print(movies.head())

print("\nTF-IDF successfully created!")
print("TF-IDF matrix shape:", tfidf_matrix.shape)

print("\nCosine similarity matrix created!")
print("Cosine similarity matrix shape:", cosine_sim.shape)

# Mood-to-genre mapping
mood_genre_map = {
    "Happy": ["Comedy", "Animation", "Adventure"],
    "Sad": ["Drama", "Romance"],
    "Relaxed": ["Comedy", "Romance", "Fantasy"],
    "Excited": ["Action", "Adventure", "Thriller"],
    "Romantic": ["Romance", "Drama"],
    "Stressed": ["Comedy", "Animation", "Fantasy"]
}

print("\nMood to Genre Mapping:")
print(mood_genre_map)

# Select a mood
selected_mood = "Happy"

# Get genres linked to that mood
selected_genres = mood_genre_map[selected_mood]

# Find movies that match at least one of those genres
recommended_movies = movies[
    movies["genres"].apply(
        lambda genre_text: any(
            genre in genre_text for genre in selected_genres
        )
    )
]

print(f"\nMovies for mood: {selected_mood}")
print(recommended_movies.head(10))