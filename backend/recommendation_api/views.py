import json
import os
import requests

from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

# =========================================================
# UPDATED: imports needed for movie details and ratings
# =========================================================

from django.db.models import Avg, Count

from moviesapp.models import Movie, MovieLink, Rating


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
            params={
                "api_key": TMDB_API_KEY,
                "language": "en-US"
            },
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
# UPDATED: HELPER FUNCTION TO FORMAT RUNTIME
# =========================================================

def format_runtime(runtime_minutes):

    # Return None when runtime is unavailable
    if not runtime_minutes:
        return None

    hours = runtime_minutes // 60
    minutes = runtime_minutes % 60

    # Example:
    # 91 minutes -> 1h 31m
    if hours > 0:
        return f"{hours}h {minutes}m"

    return f"{minutes}m"


# =========================================================
# UPDATED: GET MOVIE DETAILS FROM TMDB
# =========================================================

def get_tmdb_movie_details(movie_link):

    # Default values.
    # This allows the page to still work if TMDb is unavailable.
    details = {
        "poster_url": None,
        "overview": None,
        "runtime": None,
        "release_date": None,
        "director": None,
        "writers": None,
        "stars": None,
        "certification": None,
        "imdb_url": None,
    }

    # Cannot call TMDb without both the TMDb ID and API key
    if not movie_link or not movie_link.tmdb_id or not TMDB_API_KEY:
        return details

    try:

        # =====================================================
        # UPDATED:
        # append_to_response lets us retrieve:
        #
        # 1. Basic movie details
        # 2. Cast and crew
        # 3. Movie certification / age rating
        #
        # using one TMDb request
        # =====================================================

        response = requests.get(
            f"{TMDB_API_URL}/{movie_link.tmdb_id}",
            params={
                "api_key": TMDB_API_KEY,
                "language": "en-US",
                "append_to_response": "credits,release_dates"
            },
            timeout=8
        )

        if response.status_code != 200:
            return details

        tmdb_data = response.json()

        # =====================================================
        # UPDATED: POSTER
        # =====================================================

        poster_path = tmdb_data.get("poster_path")

        if poster_path:
            details["poster_url"] = (
                TMDB_IMAGE_BASE_URL + poster_path
            )

        # =====================================================
        # UPDATED: DESCRIPTION / OVERVIEW
        # =====================================================

        details["overview"] = tmdb_data.get("overview") or None

        # =====================================================
        # UPDATED: RUNTIME
        # =====================================================

        runtime_minutes = tmdb_data.get("runtime")

        details["runtime"] = format_runtime(runtime_minutes)

        # =====================================================
        # UPDATED: RELEASE DATE
        # =====================================================

        details["release_date"] = (
            tmdb_data.get("release_date") or None
        )

        # =====================================================
        # UPDATED: CAST AND CREW
        # =====================================================

        credits = tmdb_data.get("credits", {})

        crew = credits.get("crew", [])
        cast = credits.get("cast", [])

        # -------------------------
        # Director
        # -------------------------

        directors = []

        for person in crew:
            if person.get("job") == "Director":
                name = person.get("name")

                if name and name not in directors:
                    directors.append(name)

        if directors:
            details["director"] = ", ".join(directors)

        # -------------------------
        # Writers
        # -------------------------

        writers = []

        writer_jobs = {
            "Writer",
            "Screenplay",
            "Story"
        }

        for person in crew:

            if person.get("job") in writer_jobs:

                name = person.get("name")

                if name and name not in writers:
                    writers.append(name)

        # Limit displayed writers so the page does not become too long
        if writers:
            details["writers"] = ", ".join(writers[:4])

        # -------------------------
        # Main stars
        # -------------------------

        stars = []

        for person in cast[:4]:

            name = person.get("name")

            if name:
                stars.append(name)

        if stars:
            details["stars"] = ", ".join(stars)

        # =====================================================
        # UPDATED: AGE CERTIFICATION
        # =====================================================

        release_dates = tmdb_data.get(
            "release_dates",
            {}
        ).get(
            "results",
            []
        )

        certification = None

        # First try US certification
        for country in release_dates:

            if country.get("iso_3166_1") == "US":

                for release in country.get("release_dates", []):

                    current_certification = release.get(
                        "certification"
                    )

                    if current_certification:
                        certification = current_certification
                        break

            if certification:
                break

        details["certification"] = certification

        # =====================================================
        # UPDATED: IMDb URL
        # =====================================================

        # TMDb sometimes directly provides an IMDb ID
        imdb_id = tmdb_data.get("imdb_id")

        # Otherwise use the MovieLens MovieLink value
        if not imdb_id and movie_link.imdb_id:

            imdb_value = str(movie_link.imdb_id)

            # MovieLens often stores IMDb ID without "tt"
            imdb_id = f"tt{imdb_value.zfill(7)}"

        if imdb_id:

            # If the database somehow already contains "tt",
            # don't add it twice
            if not str(imdb_id).startswith("tt"):
                imdb_id = f"tt{imdb_id}"

            details["imdb_url"] = (
                f"https://www.imdb.com/title/{imdb_id}/"
            )

        return details

    except requests.RequestException:
        return details

    except Exception:
        return details


# =========================================================
# UPDATED: MOVIE DETAILS API
# =========================================================

# Example:
# GET /api/movies/115617/
#
# React sends the MovieLens movie ID through the URL.
# Django finds that movie and returns its full details.
def movie_details(request, movie_id):

    # Only GET is required for viewing movie details
    if request.method != "GET":
        return JsonResponse(
            {"error": "Only GET requests are allowed."},
            status=405
        )

    try:

        # =====================================================
        # UPDATED: FIND SELECTED MOVIE
        # =====================================================

        try:

            movie = Movie.objects.get(
                movie_id=movie_id
            )

        except Movie.DoesNotExist:

            return JsonResponse(
                {"error": "Movie not found."},
                status=404
            )

        # =====================================================
        # UPDATED: GET MOVIELENS RATINGS
        # =====================================================

        rating_data = Rating.objects.filter(
            movie_id=movie_id
        ).aggregate(
            average_rating=Avg("rating"),
            rating_count=Count("rating")
        )

        average_rating = rating_data.get(
            "average_rating"
        )

        rating_count = rating_data.get(
            "rating_count"
        ) or 0

        # =====================================================
        # UPDATED: GET MOVIE LINK
        # =====================================================

        try:

            movie_link = MovieLink.objects.get(
                movie_id=movie_id
            )

        except MovieLink.DoesNotExist:

            movie_link = None

        # =====================================================
        # UPDATED: GET RICHER DETAILS FROM TMDB
        # =====================================================

        tmdb_details = get_tmdb_movie_details(
            movie_link
        )

        # =====================================================
        # UPDATED: EXTRACT YEAR FROM MOVIELENS TITLE
        # =====================================================

        # MovieLens titles normally look like:
        #
        # Minions (2015)
        #
        # We extract 2015 without changing the saved title.

        year = None

        movie_title = movie.title

        if (
            movie_title
            and len(movie_title) >= 6
            and movie_title[-1] == ")"
            and movie_title[-6] == "("
        ):

            possible_year = movie_title[-5:-1]

            if possible_year.isdigit():
                year = int(possible_year)

        # =====================================================
        # UPDATED: CREATE JSON RESPONSE
        # =====================================================

        response_data = {

            # MovieLens information
            "movieId": movie.movie_id,
            "title": movie.title,
            "genres": movie.genres,
            "year": year,

            # Rating information
            "average_rating": (
                round(float(average_rating), 2)
                if average_rating is not None
                else None
            ),

            "rating_count": rating_count,

            # TMDb information
            "poster_url": tmdb_details["poster_url"],
            "overview": tmdb_details["overview"],
            "description": tmdb_details["overview"],
            "runtime": tmdb_details["runtime"],
            "release_date": tmdb_details["release_date"],
            "director": tmdb_details["director"],
            "writers": tmdb_details["writers"],
            "stars": tmdb_details["stars"],
            "certification": tmdb_details["certification"],

            # External IMDb page
            "imdb_url": tmdb_details["imdb_url"],
        }

        return JsonResponse(
            response_data,
            status=200
        )

    except Exception as error:

        return JsonResponse(
            {"error": str(error)},
            status=500
        )


# =========================================================
# MOOD RECOMMENDATION API
# =========================================================

# Receive the selected mood from React and return recommendations
@csrf_exempt
def mood_recommendations(request):

    # Only accept POST requests
    if request.method != "POST":
        return JsonResponse(
            {"error": "Only POST requests are allowed."},
            status=405
        )

    try:

        # Convert the JSON request from React into Python data
        data = json.loads(request.body)

        # Read and standardise the selected mood
        mood = data.get(
            "mood",
            ""
        ).strip().title()

        # Ensure that a mood was provided
        if not mood:

            return JsonResponse(
                {"error": "Mood is required."},
                status=400
            )

        # Import the recommendation function
        from recommendation.recommendation_engine import (
            get_mood_recommendations
        )

        # Generate the Top 10 recommendations
        recommendations = get_mood_recommendations(
            mood
        )

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

            poster_url = get_movie_poster(
                movie["movieId"]
            )

            movie["poster_url"] = poster_url

        # Return final recommendation results to React
        return JsonResponse(
            {
                "mood": mood,
                "recommendation_count": len(
                    recommendations
                ),
                "recommendations": recommendations
            },
            status=200
        )

    # Handle incorrectly formatted JSON
    except json.JSONDecodeError:

        return JsonResponse(
            {"error": "Invalid JSON data."},
            status=400
        )

    # Handle unexpected backend errors
    except Exception as error:

        return JsonResponse(
            {"error": str(error)},
            status=500
        )


# =========================================================
# TEMPORARY AI DEMO PAGE
# =========================================================

# Render the temporary recommendation testing page
def recommendation_demo(request):

    return render(
        request,
        "recommendation_api/demo.html"
    )