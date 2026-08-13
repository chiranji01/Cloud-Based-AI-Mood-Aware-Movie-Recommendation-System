from recommendation.recommendation_engine import get_mood_recommendations

mood = input(
    "Enter your mood "
    "(Happy, Sad, Relaxed, Excited, Romantic, Stressed): "
)

recommendations = get_mood_recommendations(mood)

if not recommendations:
    print("\nInvalid mood.")

else:
    print(f"\nTop recommendations for mood: {mood.title()}\n")

    for number, movie in enumerate(
        recommendations,
        start=1
    ):
        print(f"{number}. {movie['title']}")
        print(f"   Movie ID: {movie['movieId']}")
        print(f"   Genres: {movie['genres']}")
        print(
            f"   Mood Similarity: "
            f"{movie['mood_similarity']}"
        )
        print(
            f"   Average Rating: "
            f"{movie['average_rating']}"
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