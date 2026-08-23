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

# Read the TMDb API key from an environment variable.
# Do NOT hard-code the real API key into GitHub.
TMDB_API_KEY = os.getenv("TMDB_API_KEY")

TMDB_API_URL = "https://api.themoviedb.org/3/movie"

TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"


# =========================================================
# GET MOVIE POSTER FROM TMDB
# =========================================================

def get_movie_poster(movie_id):

    try:
        # Find the MovieLens -> TMDb mapping from MySQL
        movie_link = MovieLink.objects.get(
            movie_id=movie_id
        )

        # Movie does not have a TMDb ID
        if not movie_link.tmdb_id:
            return None

        # If no TMDb API key is configured,
        # simply return no poster rather than crashing.
        if not TMDB_API_KEY:
            return None

        # Request movie information from TMDb
        response = requests.get(
            f"{TMDB_API_URL}/{movie_link.tmdb_id}",
            params={
                "api_key": TMDB_API_KEY,
                "language": "en-US"
            },
            timeout=5
        )

        # TMDb request failed
        if response.status_code != 200:
            return None

        # Convert TMDb JSON response
        tmdb_data = response.json()

        # Get poster path
        poster_path = tmdb_data.get("poster_path")

        # Some movies may not have a poster
        if not poster_path:
            return None

        # Example:
        #
        # poster_path:
        # /abc123.jpg
        #
        # final:
        # https://image.tmdb.org/t/p/w500/abc123.jpg
        return (
            TMDB_IMAGE_BASE_URL
            + poster_path
        )

    except MovieLink.DoesNotExist:
        # No link exists for this MovieLens movie
        return None

    except requests.RequestException:
        # Internet/API connection error
        return None

    except Exception:
        # Poster failure should never break
        # the recommendation system.
        return None


# =========================================================
# MOOD RECOMMENDATION API
# =========================================================

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

        # =================================================
        # READ FRONTEND REQUEST
        # =================================================

        data = json.loads(request.body)

        # Example input:
        #
        # {
        #     "mood": "Happy"
        # }
        mood = (
            data
            .get("mood", "")
            .strip()
            .title()
        )


        # =================================================
        # VALIDATE MOOD INPUT
        # =================================================

        if not mood:

            return JsonResponse(
                {
                    "error": "Mood is required."
                },
                status=400
            )


        # =================================================
        # LOAD AI RECOMMENDATION ENGINE
        # =================================================

        # Import only when the endpoint is called.
        from recommendation.recommendation_engine import (
            get_mood_recommendations
        )


        # =================================================
        # GENERATE TOP 10
        # =================================================

        recommendations = (
            get_mood_recommendations(
                mood
            )
        )


        # =================================================
        # VALIDATE SELECTED MOOD
        # =================================================

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


        # =================================================
        # ADD TMDB POSTER INFORMATION
        # =================================================

        for movie in recommendations:

            # Get poster using MovieLens movieId
            poster_url = get_movie_poster(
                movie["movieId"]
            )

            # Add poster_url to the existing AI result
            movie["poster_url"] = poster_url


        # =================================================
        # RETURN JSON TO REACT
        # =================================================

        return JsonResponse(
            {
                "mood": mood,

                "recommendation_count":
                    len(recommendations),

                "recommendations":
                    recommendations
            },
            status=200
        )


    # =====================================================
    # INVALID JSON
    # =====================================================

    except json.JSONDecodeError:

        return JsonResponse(
            {
                "error": "Invalid JSON data."
            },
            status=400
        )


    # =====================================================
    # UNEXPECTED ERROR
    # =====================================================

    except Exception as error:

        return JsonResponse(
            {
                "error": str(error)
            },
            status=500
        )


# =========================================================
# TEMPORARY AI DEMO PAGE
# =========================================================

def recommendation_demo(request):

    return render(
        request,
        "recommendation_api/demo.html"
    )