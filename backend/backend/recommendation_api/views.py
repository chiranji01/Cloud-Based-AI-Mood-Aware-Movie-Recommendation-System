import json

from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def mood_recommendations(request):

    # Only allow POST requests
    if request.method != "POST":
        return JsonResponse(
            {
                "error": "Only POST requests are allowed."
            },
            status=405
        )

    try:
        # Read JSON data sent from frontend
        data = json.loads(request.body)

        # Get selected mood
        mood = data.get("mood", "").strip().title()

        # Check if mood was provided
        if not mood:
            return JsonResponse(
                {
                    "error": "Mood is required."
                },
                status=400
            )

        # Load AI engine only when recommendation API is called
        from recommendation.recommendation_engine import get_mood_recommendations

        # Get recommendations from AI engine
        recommendations = get_mood_recommendations(mood)

        # Check if mood is valid
        if not recommendations:
            return JsonResponse(
                {
                    "error": "Invalid mood.",
                    "available_moods": [
                        "Happy",
                        "Sad",
                        "Relaxed",
                        "Excited",
                        "Romantic",
                        "Stressed"
                    ]
                },
                status=400
            )

        # Return recommendations
        return JsonResponse(
            {
                "mood": mood,
                "recommendation_count": len(recommendations),
                "recommendations": recommendations
            },
            status=200
        )

    # Handle invalid JSON
    except json.JSONDecodeError:
        return JsonResponse(
            {
                "error": "Invalid JSON data."
            },
            status=400
        )

    # Handle unexpected errors
    except Exception as error:
        return JsonResponse(
            {
                "error": str(error)
            },
            status=500
        )


# Temporary user-facing page for demonstrating the AI system
def recommendation_demo(request):
    return render(
        request,
        "recommendation_api/demo.html"
    )