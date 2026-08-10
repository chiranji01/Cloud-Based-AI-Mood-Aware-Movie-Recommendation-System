import pandas as pd

movies = pd.read_csv("data/movies.csv")

print("MovieLens dataset loaded successfully!")
print(movies.head())

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