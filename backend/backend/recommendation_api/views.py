import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def mood_recommendations(request):

    if request.method != "POST":
        return JsonResponse(
            {
                "error": "Only POST requests are allowed."
            },
            status=405
        )

    try:
        data = json.loads(request.body)

        mood = data.get("mood", "").strip().title()

        if not mood:
            return JsonResponse(
                {
                    "error": "Mood is required."
                },
                status=400
            )

        # Load the AI engine only when recommendation API is called
        from recommendation.recommendation_engine import get_mood_recommendations

        recommendations = get_mood_recommendations(mood)

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

        return JsonResponse(
            {
                "mood": mood,
                "recommendation_count": len(recommendations),
                "recommendations": recommendations
            },
            status=200
        )

    except json.JSONDecodeError:
        return JsonResponse(
            {
                "error": "Invalid JSON data."
            },
            status=400
        )

    except Exception as error:
        return JsonResponse(
            {
                "error": str(error)
            },
            status=500
        )