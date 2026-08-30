import json
import os
import requests

from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Avg, Count

from moviesapp.models import Movie, MovieLink, Rating


# =========================================================
# TMDB CONFIGURATION
# =========================================================

TMDB_API_KEY = os.getenv("TMDB_API_KEY")
TMDB_API_URL = "https://api.themoviedb.org/3/movie"
TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"


# =========================================================
# GET MOVIE POSTER FROM TMDB
# =========================================================

def get_movie_poster(movie_id):
    try:
        movie_link = MovieLink.objects.get(movie_id=movie_id)

        if not movie_link.tmdb_id or not TMDB_API_KEY:
            return None

        response = requests.get(
            f"{TMDB_API_URL}/{movie_link.tmdb_id}",
            params={"api_key": TMDB_API_KEY, "language": "en-US"},
            timeout=5
        )

        if response.status_code != 200:
            return None

        poster_path = response.json().get("poster_path")

        if not poster_path:
            return None

        return TMDB_IMAGE_BASE_URL + poster_path

    except MovieLink.DoesNotExist:
        return None
    except requests.RequestException:
        return None
    except Exception:
        return None


# =========================================================
# FORMAT MOVIE RUNTIME
# =========================================================

def format_runtime(runtime_minutes):
    if not runtime_minutes:
        return None

    hours = runtime_minutes // 60
    minutes = runtime_minutes % 60

    if hours > 0:
        return f"{hours}h {minutes}m"

    return f"{minutes}m"


# =========================================================
# GET FULL MOVIE DETAILS FROM TMDB
# =========================================================

def get_tmdb_movie_details(movie_link):
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

    if not movie_link or not movie_link.tmdb_id or not TMDB_API_KEY:
        return details

    try:
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

        # Poster
        poster_path = tmdb_data.get("poster_path")
        if poster_path:
            details["poster_url"] = TMDB_IMAGE_BASE_URL + poster_path

        # Description
        details["overview"] = tmdb_data.get("overview") or None

        # Runtime
        details["runtime"] = format_runtime(tmdb_data.get("runtime"))

        # Release date
        details["release_date"] = tmdb_data.get("release_date") or None

        # Cast and crew
        credits = tmdb_data.get("credits", {})
        crew = credits.get("crew", [])
        cast = credits.get("cast", [])

        # Directors
        directors = []
        for person in crew:
            if person.get("job") == "Director":
                name = person.get("name")
                if name and name not in directors:
                    directors.append(name)

        if directors:
            details["director"] = ", ".join(directors)

        # Writers
        writers = []
        writer_jobs = {"Writer", "Screenplay", "Story"}

        for person in crew:
            if person.get("job") in writer_jobs:
                name = person.get("name")
                if name and name not in writers:
                    writers.append(name)

        if writers:
            details["writers"] = ", ".join(writers[:4])

        # Main stars
        stars = []
        for person in cast[:4]:
            name = person.get("name")
            if name:
                stars.append(name)

        if stars:
            details["stars"] = ", ".join(stars)

        # Age certification
        release_dates = tmdb_data.get("release_dates", {}).get("results", [])
        certification = None

        for country in release_dates:
            if country.get("iso_3166_1") == "US":
                for release in country.get("release_dates", []):
                    current_certification = release.get("certification")

                    if current_certification:
                        certification = current_certification
                        break

            if certification:
                break

        details["certification"] = certification

        # IMDb URL
        imdb_id = tmdb_data.get("imdb_id")

        if not imdb_id and movie_link.imdb_id:
            imdb_value = str(movie_link.imdb_id)
            imdb_id = f"tt{imdb_value.zfill(7)}"

        if imdb_id:
            if not str(imdb_id).startswith("tt"):
                imdb_id = f"tt{imdb_id}"

            details["imdb_url"] = f"https://www.imdb.com/title/{imdb_id}/"

        return details

    except requests.RequestException:
        return details
    except Exception:
        return details


# =========================================================
# MOVIE DETAILS API
# =========================================================

def movie_details(request, movie_id):
    if request.method != "GET":
        return JsonResponse({"error": "Only GET requests are allowed."}, status=405)

    try:
        try:
            movie = Movie.objects.get(movie_id=movie_id)
        except Movie.DoesNotExist:
            return JsonResponse({"error": "Movie not found."}, status=404)

        # MovieLens ratings
        rating_data = Rating.objects.filter(movie_id=movie_id).aggregate(
            average_rating=Avg("rating"),
            rating_count=Count("rating")
        )

        average_rating = rating_data.get("average_rating")
        rating_count = rating_data.get("rating_count") or 0

        # MovieLink
        try:
            movie_link = MovieLink.objects.get(movie_id=movie_id)
        except MovieLink.DoesNotExist:
            movie_link = None

        # TMDb information
        tmdb_details = get_tmdb_movie_details(movie_link)

        # Extract year from MovieLens title
        year = None
        movie_title = movie.title

        if movie_title and len(movie_title) >= 6 and movie_title[-1] == ")" and movie_title[-6] == "(":
            possible_year = movie_title[-5:-1]

            if possible_year.isdigit():
                year = int(possible_year)

        response_data = {
            "movieId": movie.movie_id,
            "title": movie.title,
            "genres": movie.genres,
            "year": year,
            "average_rating": round(float(average_rating), 2) if average_rating is not None else None,
            "rating_count": rating_count,
            "poster_url": tmdb_details["poster_url"],
            "overview": tmdb_details["overview"],
            "description": tmdb_details["overview"],
            "runtime": tmdb_details["runtime"],
            "release_date": tmdb_details["release_date"],
            "director": tmdb_details["director"],
            "writers": tmdb_details["writers"],
            "stars": tmdb_details["stars"],
            "certification": tmdb_details["certification"],
            "imdb_url": tmdb_details["imdb_url"],
        }

        return JsonResponse(response_data, status=200)

    except Exception as error:
        return JsonResponse({"error": str(error)}, status=500)


# =========================================================
# NEW: SIMILAR MOVIES API - "YOU MIGHT ALSO LIKE"
# =========================================================

def similar_movies(request, movie_id):
    if request.method != "GET":
        return JsonResponse({"error": "Only GET requests are allowed."}, status=405)

    try:
        # Find currently selected movie
        try:
            selected_movie = Movie.objects.get(movie_id=movie_id)
        except Movie.DoesNotExist:
            return JsonResponse({"error": "Movie not found."}, status=404)

        # Get selected movie genres
        selected_genres = {
            genre.strip()
            for genre in selected_movie.genres.split("|")
            if genre.strip()
        }

        # Get all other movies with rating information
        candidate_movies = Movie.objects.exclude(movie_id=movie_id).annotate(
            average_rating=Avg("ratings__rating"),
            rating_count=Count("ratings")
        )

        recommendations = []

        for movie in candidate_movies:
            movie_genres = {
                genre.strip()
                for genre in movie.genres.split("|")
                if genre.strip()
            }

            common_genres = selected_genres.intersection(movie_genres)

            # Skip movies with no matching genres
            if not common_genres:
                continue

            average_rating = movie.average_rating
            rating_count = movie.rating_count or 0

            # Quality filter
            if average_rating is None or average_rating < 3.0 or rating_count < 10:
                continue

            # Jaccard genre similarity
            all_genres = selected_genres.union(movie_genres)
            genre_similarity = len(common_genres) / len(all_genres) if all_genres else 0

            recommendations.append({
                "movieId": movie.movie_id,
                "title": movie.title,
                "genres": movie.genres,
                "average_rating": round(float(average_rating), 2),
                "rating_count": rating_count,
                "genre_similarity": round(genre_similarity, 3),
            })

        # Rank by similarity, rating and popularity
        recommendations.sort(
            key=lambda movie: (
                movie["genre_similarity"],
                movie["average_rating"],
                movie["rating_count"]
            ),
            reverse=True
        )

        # Return Top 6
        recommendations = recommendations[:6]

        # Add TMDb posters
        for movie in recommendations:
            movie["poster_url"] = get_movie_poster(movie["movieId"])

        return JsonResponse({
            "movieId": selected_movie.movie_id,
            "recommendation_count": len(recommendations),
            "recommendations": recommendations
        }, status=200)

    except Exception as error:
        return JsonResponse({"error": str(error)}, status=500)


# =========================================================
# MOOD RECOMMENDATION API
# =========================================================

@csrf_exempt
def mood_recommendations(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST requests are allowed."}, status=405)

    try:
        data = json.loads(request.body)
        mood = data.get("mood", "").strip().title()

        if not mood:
            return JsonResponse({"error": "Mood is required."}, status=400)

        # Import recommendation engine
        from recommendation.recommendation_engine import get_mood_recommendations

        recommendations = get_mood_recommendations(mood)

        if not recommendations:
            return JsonResponse({
                "error": "Invalid mood.",
                "available_moods": [
                    "Happy",
                    "Sad",
                    "Relaxed",
                    "Excited",
                    "Romantic",
                    "Stressed"
                ]
            }, status=400)

        # Add TMDb posters
        for movie in recommendations:
            movie["poster_url"] = get_movie_poster(movie["movieId"])

        return JsonResponse({
            "mood": mood,
            "recommendation_count": len(recommendations),
            "recommendations": recommendations
        }, status=200)

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON data."}, status=400)

    except Exception as error:
        return JsonResponse({"error": str(error)}, status=500)


# =========================================================
# TEMPORARY AI DEMO PAGE
# =========================================================

def recommendation_demo(request):
    return render(request, "recommendation_api/demo.html")