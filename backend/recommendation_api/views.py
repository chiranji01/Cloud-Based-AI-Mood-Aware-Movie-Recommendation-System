import json
import os
import requests

from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from moviesapp.models import MovieLink


# =========================================================
# TMDB CONFIGURATION
# =========================================================

# Load the TMDb API key securely from the environment
TMDB_API_KEY = os.getenv("TMDB_API_KEY")

# TMDb API and poster image URLs
TMDB_API_URL = "https://api.themoviedb.org/3/movie"
TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"


# =========================================================
# GET MOVIE POSTER FROM TMDB
# =========================================================

# Retrieve the TMDb poster URL using a MovieLens movie ID
def get_movie_poster(movie_id):

    try:
        # Find the corresponding TMDb ID from the MovieLink table
        movie_link = MovieLink.objects.get(movie_id=movie_id)

        # Return no poster if the TMDb ID or API key is unavailable
        if not movie_link.tmdb_id:
            return None

        if not TMDB_API_KEY:
            return None

        # Request movie information from TMDb
        response = requests.get(
            f"{TMDB_API_URL}/{movie_link.tmdb_id}",
            params={"api_key": TMDB_API_KEY, "language": "en-US"},
            timeout=5
        )

        # Continue without a poster if the request fails
        if response.status_code != 200:
            return None

        # Convert the response to Python data
        tmdb_data = response.json()

        # Extract the poster path
        poster_path = tmdb_data.get("poster_path")

        # Some movies may not have a poster
        if not poster_path:
            return None

        # Build and return the complete poster URL
        return TMDB_IMAGE_BASE_URL + poster_path

    except MovieLink.DoesNotExist:
        # No MovieLens-to-TMDb mapping was found
        return None

    except requests.RequestException:
        # Handle TMDb API or network errors
        return None

    except Exception:
        # Poster errors should not stop recommendations
        return None


# =========================================================
# MOOD RECOMMENDATION API
# =========================================================

# Receive the selected mood from React and return recommendations
@csrf_exempt
def mood_recommendations(request):

    # Only accept POST requests
    if request.method != "POST":
        return JsonResponse({"error": "Only POST requests are allowed."}, status=405)

    try:
        # Convert the JSON request from React into Python data
        data = json.loads(request.body)

        # Read and standardise the selected mood
        mood = data.get("mood", "").strip().title()

        # Ensure that a mood was provided
        if not mood:
            return JsonResponse({"error": "Mood is required."}, status=400)

        # Import the recommendation function
        from recommendation.recommendation_engine import get_mood_recommendations

        # Generate the Top 10 recommendations
        recommendations = get_mood_recommendations(mood)

        # Return an error if the mood is unsupported
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

        # Add a TMDb poster URL to each recommended movie
        for movie in recommendations:
            poster_url = get_movie_poster(movie["movieId"])
            movie["poster_url"] = poster_url

        # Return the final recommendation results to React
        return JsonResponse(
            {
                "mood": mood,
                "recommendation_count": len(recommendations),
                "recommendations": recommendations
            },
            status=200
        )

    # Handle incorrectly formatted JSON requests
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON data."}, status=400)

    # Handle unexpected backend errors
    except Exception as error:
        return JsonResponse({"error": str(error)}, status=500)


# =========================================================
# TEMPORARY AI DEMO PAGE
# =========================================================

# Render the temporary recommendation testing page
def recommendation_demo(request):
    return render(request, "recommendation_api/demo.html")