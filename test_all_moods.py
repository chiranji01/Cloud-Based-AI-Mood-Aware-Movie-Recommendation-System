from recommendation.recommendation_engine import get_mood_recommendations

moods = [
    "Happy",
    "Sad",
    "Relaxed",
    "Excited",
    "Romantic",
    "Stressed"
]

print("Testing AI Recommendation Engine\n")

for mood in moods:

    recommendations = get_mood_recommendations(mood)

    print(f"Mood: {mood}")

    if len(recommendations) == 10:
        print("Status: PASS")
    else:
        print("Status: FAIL")

    print(
        "Recommendations returned:",
        len(recommendations)
    )

    if recommendations:
        print(
            "Top recommendation:",
            recommendations[0]["title"]
        )

    print()