
import json
import os
import time
import requests
from concurrent.futures import ThreadPoolExecutor

from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Avg, Count

from moviesapp.models import Movie, MovieLink, Rating
from recommendation.recommendation_engine import get_mood_recommendations


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

        movie_link = MovieLink.objects.get(
            movie_id=movie_id
        )

        # Use cached poster URL if already saved
        if movie_link.poster_url:
            return movie_link.poster_url

        if not movie_link.tmdb_id or not TMDB_API_KEY:
            return None

        # Only call TMDb when poster is not already cached
        response = requests.get(
            f"{TMDB_API_URL}/{movie_link.tmdb_id}",
            params={
                "api_key": TMDB_API_KEY,
                "language": "en-US"
            },
            timeout=5
        )

        if response.status_code != 200:
            return None

        poster_path = response.json().get(
            "poster_path"
        )

        if not poster_path:
            return None

        poster_url = TMDB_IMAGE_BASE_URL + poster_path

        # Save poster URL so future requests do not call TMDb again
        movie_link.poster_url = poster_url
        movie_link.save(update_fields=["poster_url"])

        return poster_url

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

    if (
        not movie_link
        or not movie_link.tmdb_id
        or not TMDB_API_KEY
    ):
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

        # =====================================================
        # POSTER
        # =====================================================

        poster_path = tmdb_data.get(
            "poster_path"
        )

        if poster_path:

            details["poster_url"] = (
                TMDB_IMAGE_BASE_URL
                + poster_path
            )

        # =====================================================
        # DESCRIPTION
        # =====================================================

        details["overview"] = (
            tmdb_data.get("overview")
            or None
        )

        # =====================================================
        # RUNTIME
        # =====================================================

        details["runtime"] = format_runtime(
            tmdb_data.get("runtime")
        )

        # =====================================================
        # RELEASE DATE
        # =====================================================

        details["release_date"] = (
            tmdb_data.get("release_date")
            or None
        )

        # =====================================================
        # CAST AND CREW
        # =====================================================

        credits = tmdb_data.get(
            "credits",
            {}
        )

        crew = credits.get(
            "crew",
            []
        )

        cast = credits.get(
            "cast",
            []
        )

        # =====================================================
        # DIRECTORS
        # =====================================================

        directors = []

        for person in crew:

            if person.get("job") == "Director":

                name = person.get("name")

                if (
                    name
                    and name not in directors
                ):
                    directors.append(name)

        if directors:

            details["director"] = ", ".join(
                directors
            )

        # =====================================================
        # WRITERS
        # =====================================================

        writers = []

        writer_jobs = {
            "Writer",
            "Screenplay",
            "Story"
        }

        for person in crew:

            if person.get("job") in writer_jobs:

                name = person.get("name")

                if (
                    name
                    and name not in writers
                ):
                    writers.append(name)

        if writers:

            details["writers"] = ", ".join(
                writers[:4]
            )

        # =====================================================
        # MAIN STARS
        # =====================================================

        stars = []

        for person in cast[:4]:

            name = person.get("name")

            if name:
                stars.append(name)

        if stars:

            details["stars"] = ", ".join(
                stars
            )

        # =====================================================
        # AGE CERTIFICATION
        # =====================================================

        release_dates = (
            tmdb_data
            .get("release_dates", {})
            .get("results", [])
        )

        certification = None

        for country in release_dates:

            if country.get(
                "iso_3166_1"
            ) == "US":

                for release in country.get(
                    "release_dates",
                    []
                ):

                    current_certification = (
                        release.get(
                            "certification"
                        )
                    )

                    if current_certification:

                        certification = (
                            current_certification
                        )

                        break

            if certification:
                break

        details["certification"] = (
            certification
        )

        # =====================================================
        # IMDb URL
        # =====================================================

        imdb_id = tmdb_data.get(
            "imdb_id"
        )

        if (
            not imdb_id
            and movie_link.imdb_id
        ):

            imdb_value = str(
                movie_link.imdb_id
            )

            imdb_id = (
                f"tt{imdb_value.zfill(7)}"
            )

        if imdb_id:

            if not str(imdb_id).startswith("tt"):

                imdb_id = (
                    f"tt{imdb_id}"
                )

            details["imdb_url"] = (
                f"https://www.imdb.com/title/"
                f"{imdb_id}/"
            )

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

        return JsonResponse(
            {
                "error":
                    "Only GET requests are allowed."
            },
            status=405
        )

    try:

        # =====================================================
        # FIND MOVIE
        # =====================================================

        try:

            movie = Movie.objects.get(
                movie_id=movie_id
            )

        except Movie.DoesNotExist:

            return JsonResponse(
                {
                    "error":
                        "Movie not found."
                },
                status=404
            )

        # =====================================================
        # MOVIELENS RATINGS
        # =====================================================

        rating_data = (
            Rating.objects
            .filter(
                movie_id=movie_id
            )
            .aggregate(
                average_rating=Avg("rating"),
                rating_count=Count("rating")
            )
        )

        average_rating = (
            rating_data.get(
                "average_rating"
            )
        )

        rating_count = (
            rating_data.get(
                "rating_count"
            )
            or 0
        )

        # =====================================================
        # MOVIELINK
        # =====================================================

        try:

            movie_link = MovieLink.objects.get(
                movie_id=movie_id
            )

        except MovieLink.DoesNotExist:

            movie_link = None

        # =====================================================
        # TMDB INFORMATION
        # =====================================================

        tmdb_details = (
            get_tmdb_movie_details(
                movie_link
            )
        )

        # =====================================================
        # EXTRACT YEAR FROM MOVIELENS TITLE
        # =====================================================

        year = None

        movie_title = movie.title

        if (
            movie_title
            and len(movie_title) >= 6
            and movie_title[-1] == ")"
            and movie_title[-6] == "("
        ):

            possible_year = (
                movie_title[-5:-1]
            )

            if possible_year.isdigit():

                year = int(
                    possible_year
                )

        # =====================================================
        # RESPONSE
        # =====================================================

        response_data = {

            "movieId":
                movie.movie_id,

            "title":
                movie.title,

            "genres":
                movie.genres,

            "year":
                year,

            "average_rating":
                (
                    round(
                        float(average_rating),
                        2
                    )
                    if average_rating is not None
                    else None
                ),

            "rating_count":
                rating_count,

            "poster_url":
                tmdb_details["poster_url"],

            "overview":
                tmdb_details["overview"],

            "description":
                tmdb_details["overview"],

            "runtime":
                tmdb_details["runtime"],

            "release_date":
                tmdb_details["release_date"],

            "director":
                tmdb_details["director"],

            "writers":
                tmdb_details["writers"],

            "stars":
                tmdb_details["stars"],

            "certification":
                tmdb_details["certification"],

            "imdb_url":
                tmdb_details["imdb_url"],
        }

        return JsonResponse(
            response_data,
            status=200
        )

    except Exception as error:

        return JsonResponse(
            {
                "error": str(error)
            },
            status=500
        )


# =========================================================
# SIMILAR MOVIES API
# =========================================================

def similar_movies(request, movie_id):

    if request.method != "GET":

        return JsonResponse(
            {
                "error":
                    "Only GET requests are allowed."
            },
            status=405
        )

    try:

        # =====================================================
        # FIND SELECTED MOVIE
        # =====================================================

        try:

            selected_movie = Movie.objects.get(
                movie_id=movie_id
            )

        except Movie.DoesNotExist:

            return JsonResponse(
                {
                    "error":
                        "Movie not found."
                },
                status=404
            )

        # =====================================================
        # SELECTED MOVIE GENRES
        # =====================================================

        selected_genres = {

            genre.strip()

            for genre
            in selected_movie.genres.split("|")

            if genre.strip()

        }

        # =====================================================
        # CANDIDATE MOVIES
        # =====================================================

        candidate_movies = (

            Movie.objects

            .exclude(
                movie_id=movie_id
            )

            .annotate(

                average_rating=Avg(
                    "ratings__rating"
                ),

                rating_count=Count(
                    "ratings"
                )

            )

        )

        recommendations = []

        # =====================================================
        # FIND SIMILAR MOVIES
        # =====================================================

        for movie in candidate_movies:

            movie_genres = {

                genre.strip()

                for genre
                in movie.genres.split("|")

                if genre.strip()

            }

            # Find common genres between both movies (movie_genre = Another candidate movie)
            common_genres = selected_genres.intersection(movie_genres)

            if not common_genres:
                continue

            average_rating = (
                movie.average_rating
            )

            rating_count = (
                movie.rating_count
                or 0
            )

            # =================================================
            # QUALITY FILTER
            # =================================================

            if (
                average_rating is None
                or average_rating < 3.0
                or rating_count < 10
            ):
                continue

            # Jaccard genre similarity 
            # Find all unique genres from both movies
            all_genres = selected_genres.union(movie_genres)

            # Calculate Jaccard Similarity: common genres / total unique genres (Dividing the number of common genres by the total number of unique genre)
            genre_similarity = len(common_genres) / len(all_genres) if all_genres else 0

            recommendations.append({

                "movieId":
                    movie.movie_id,

                "title":
                    movie.title,

                "genres":
                    movie.genres,

                "average_rating":
                    round(
                        float(
                            average_rating
                        ),
                        2
                    ),

                "rating_count":
                    rating_count,

                "genre_similarity":
                    round(
                        genre_similarity,
                        3
                    ),

            })

        # =====================================================
        # SORT
        # =====================================================

        recommendations.sort(

            key=lambda movie: (

                movie["genre_similarity"],

                movie["average_rating"],

                movie["rating_count"]

            ),

            reverse=True

        )

        # =====================================================
        # TOP 6
        # =====================================================

        recommendations = (
            recommendations[:6]
        )

        # =====================================================
        # ADD POSTERS
        # =====================================================

        for movie in recommendations:

            movie["poster_url"] = (
                get_movie_poster(
                    movie["movieId"]
                )
            )

        return JsonResponse(
            {
                "movieId":
                    selected_movie.movie_id,

                "recommendation_count":
                    len(recommendations),

                "recommendations":
                    recommendations
            },
            status=200
        )

    except Exception as error:

        return JsonResponse(
            {
                "error": str(error)
            },
            status=500
        )


# =========================================================
# SEARCH AND FILTER MOVIES API
# =========================================================

def search_movies(request):

    if request.method != "GET":

        return JsonResponse(
            {
                "error":
                    "Only GET requests are allowed."
            },
            status=405
        )

    try:

        search = request.GET.get(
            "search",
            ""
        ).strip()

        genre = request.GET.get(
            "genre",
            ""
        ).strip()

        min_rating = request.GET.get(
            "min_rating",
            ""
        ).strip()

        movies = Movie.objects.all()

        # =====================================================
        # SEARCH BY TITLE
        # =====================================================

        if search:

            movies = movies.filter(
                title__icontains=search
            )

        # =====================================================
        # FILTER BY GENRE
        # =====================================================

        if genre:

            movies = movies.filter(
                genres__icontains=genre
            )

        # =====================================================
        # ADD RATING INFORMATION
        # =====================================================

        movies = movies.annotate(

            average_rating=Avg(
                "ratings__rating"
            ),

            rating_count=Count(
                "ratings"
            )

        )

        # =====================================================
        # FILTER BY MINIMUM RATING
        # =====================================================

        if min_rating:

            try:

                min_rating_value = float(
                    min_rating
                )

                movies = movies.filter(
                    average_rating__gte=
                        min_rating_value
                )

            except ValueError:

                return JsonResponse(
                    {
                        "error":
                            "min_rating must be a valid number."
                    },
                    status=400
                )

        # =====================================================
        # LIMIT RESULTS
        # =====================================================

        movies = (

            movies

            .order_by(
                "-average_rating",
                "-rating_count"
            )

            [:20]

        )

        movie_list = []

        for movie in movies:

            movie_list.append({

                "movieId":
                    movie.movie_id,

                "title":
                    movie.title,

                "genres":
                    movie.genres,

                "average_rating":
                    (
                        round(
                            float(
                                movie.average_rating
                            ),
                            2
                        )
                        if movie.average_rating is not None
                        else None
                    ),

                "rating_count":
                    movie.rating_count or 0,

                "poster_url":
                    get_movie_poster(
                        movie.movie_id
                    ),

            })

        return JsonResponse(
            {
                "count":
                    len(movie_list),

                "movies":
                    movie_list
            },
            status=200
        )

    except Exception as error:

        return JsonResponse(
            {
                "error": str(error)
            },
            status=500
        )


# =========================================================
# POPULAR MOVIES API
# =========================================================

# =========================================================
# POPULAR MOVIES API
# =========================================================

def popular_movies(request):

    if request.method != "GET":
        return JsonResponse(
            {
                "error": "Only GET requests are allowed."
            },
            status=405
        )

    try:

        # -------------------------------------------------
        # Build a large pool of well-rated movies first.
        # We filter modern movies and poster availability
        # before limiting the final response.
        # -------------------------------------------------

        candidate_movies = (
            Movie.objects
            .annotate(
                average_rating=Avg(
                    "ratings__rating"
                ),
                rating_count=Count(
                    "ratings"
                )
            )
            .filter(
                average_rating__isnull=False,
                rating_count__gte=10,
                average_rating__gte=3.5
            )
            .order_by(
                "-average_rating",
                "-rating_count"
            )[:1500]
        )

        modern_movies = []

        # -------------------------------------------------
        # Keep only:
        # - movies from 2016 onwards
        # - movies with a valid poster
        # -------------------------------------------------

        for movie in candidate_movies:

            title = movie.title or ""

            year = 0

            try:
                if (
                    title.endswith(")")
                    and "(" in title
                ):
                    year_text = (
                        title
                        .rsplit("(", 1)[1]
                        .replace(")", "")
                        .strip()
                    )

                    if year_text.isdigit():
                        year = int(year_text)

            except (
                ValueError,
                IndexError
            ):
                year = 0

            if year < 2016:
                continue

            poster_url = get_movie_poster(
                movie.movie_id
            )

            # Skip movies with no real poster.
            if not poster_url:
                continue

            modern_movies.append(
                {
                    "movie": movie,
                    "poster_url": poster_url,
                    "year": year,
                }
            )

            # We only need enough data for
            # Recommended + Popular sections.
            if len(modern_movies) >= 30:
                break

        # -------------------------------------------------
        # RECOMMENDED
        # Highest-rated modern movies
        # -------------------------------------------------

        recommended_candidates = sorted(
            modern_movies,
            key=lambda item: (
                float(
                    item["movie"].average_rating
                    or 0
                ),
                item["movie"].rating_count or 0,
            ),
            reverse=True
        )

        recommended_movies = (
            recommended_candidates[:6]
        )

        recommended_ids = {
            item["movie"].movie_id
            for item in recommended_movies
        }

        # -------------------------------------------------
        # POPULAR
        # Different movies, prioritised by rating count
        # and then rating.
        # -------------------------------------------------

        popular_candidates = [
            item
            for item in modern_movies
            if item["movie"].movie_id
            not in recommended_ids
        ]

        popular_candidates.sort(
            key=lambda item: (
                item["movie"].rating_count or 0,
                float(
                    item["movie"].average_rating
                    or 0
                ),
                item["year"],
            ),
            reverse=True
        )

        popular_movies_result = (
            popular_candidates[:6]
        )

        # -------------------------------------------------
        # SERIALIZER HELPER
        # -------------------------------------------------

        def serialize_movie(item):

            movie = item["movie"]

            return {
                "movieId":
                    movie.movie_id,

                "title":
                    movie.title,

                "genres":
                    movie.genres,

                "year":
                    item["year"],

                "average_rating":
                    (
                        round(
                            float(
                                movie.average_rating
                            ),
                            2
                        )
                        if movie.average_rating
                        is not None
                        else None
                    ),

                "rating_count":
                    movie.rating_count or 0,

                "poster_url":
                    item["poster_url"],
            }

        recommended_list = [
            serialize_movie(item)
            for item in recommended_movies
        ]

        popular_list = [
            serialize_movie(item)
            for item in popular_movies_result
        ]

        # Also provide a combined list for backwards
        # compatibility if frontend still expects "movies".
        combined_movies = (
            recommended_list +
            popular_list
        )

        return JsonResponse(
            {
                "count":
                    len(combined_movies),

                "movies":
                    combined_movies,

                "recommended_movies":
                    recommended_list,

                "popular_movies":
                    popular_list,
            },
            status=200
        )

    except Exception as error:

        return JsonResponse(
            {
                "error": str(error)
            },
            status=500
        )

    if request.method != "GET":

        return JsonResponse(
            {
                "error":
                    "Only GET requests are allowed."
            },
            status=405
        )

    try:

        movies = (

            Movie.objects

            .annotate(

                average_rating=Avg(
                    "ratings__rating"
                ),

                rating_count=Count(
                    "ratings"
                )

            )

            .filter(

                average_rating__isnull=False,

                rating_count__gte=10,

                average_rating__gte=3.5

            )

            .order_by(

                "-average_rating",

                "-rating_count"

            )[:6]

        )

        popular_list = []

        for movie in movies:

            poster_url = (
                get_movie_poster(
                    movie.movie_id
                )
            )

            popular_list.append({

                "movieId":
                    movie.movie_id,

                "title":
                    movie.title,

                "genres":
                    movie.genres,

                "average_rating":
                    (
                        round(
                            float(
                                movie.average_rating
                            ),
                            2
                        )
                        if movie.average_rating is not None
                        else None
                    ),

                "rating_count":
                    movie.rating_count or 0,

                "poster_url":
                    poster_url,

            })

        return JsonResponse(
            {
                "count":
                    len(popular_list),

                "movies":
                    popular_list
            },
            status=200
        )

    except Exception as error:

        return JsonResponse(
            {
                "error": str(error)
            },
            status=500
        )


# =========================================================
# MOOD RECOMMENDATION API
# =========================================================

@csrf_exempt
def mood_recommendations(request):

    if request.method != "POST":
        return JsonResponse(
            {"error": "Only POST requests are allowed."},
            status=405
        )

    try:
        # Measure total API processing time
        total_start = time.time()

        data = json.loads(request.body)
        mood = data.get("mood", "").strip().title()

        if not mood:
            return JsonResponse(
                {"error": "Mood is required."},
                status=400
            )

        # -------------------------------------------------
        # 1. Measure recommendation engine time
        # -------------------------------------------------

        recommendation_start = time.time()

        recommendations = get_mood_recommendations(mood)

        recommendation_time = time.time() - recommendation_start

        print(
            f"Recommendation engine: "
            f"{recommendation_time:.2f} seconds"
        )

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

        # -------------------------------------------------
        # 2. Measure TMDb poster loading time
        # -------------------------------------------------

        poster_start = time.time()

        # Fetch poster URLs concurrently
        with ThreadPoolExecutor(max_workers=10) as executor:
            poster_urls = list(
                executor.map(
                    get_movie_poster,
                    [
                        movie["movieId"]
                        for movie in recommendations
                    ]
                )
            )

        poster_time = time.time() - poster_start

        print(
            f"TMDb posters: "
            f"{poster_time:.2f} seconds"
        )

        # Add poster URLs to recommendation results
        for movie, poster_url in zip(
            recommendations,
            poster_urls
        ):
            movie["poster_url"] = poster_url

        # -------------------------------------------------
        # 3. Measure total backend API time
        # -------------------------------------------------

        total_time = time.time() - total_start

        print(
            f"Total mood API time: "
            f"{total_time:.2f} seconds"
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
            {"error": "Invalid JSON data."},
            status=400
        )

    except Exception as error:
        return JsonResponse(
            {"error": str(error)},
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


# =========================================================
# USER RATINGS API
# =========================================================

@csrf_exempt
def user_ratings(request):
    """
    GET:
        /api/ratings/?user_id=8

    POST:
        /api/ratings/

    Only application ratings are returned and modified.

    MovieLens dataset ratings:
        is_dataset_rating=True

    User/application ratings:
        is_dataset_rating=False
    """

    # =====================================================
    # GET USER RATINGS
    # =====================================================

    if request.method == "GET":

        try:

            user_id = request.GET.get(
                "user_id"
            )

            if not user_id:

                return JsonResponse(
                    {
                        "error":
                            "user_id is required."
                    },
                    status=400
                )

            user_id = int(user_id)

            # =================================================
            # IMPORTANT:
            # Only show ratings submitted by the application.
            # Dataset ratings are NOT included.
            # =================================================

            ratings = (

                Rating.objects

                .filter(
                    user_id=user_id,
                    is_dataset_rating=False
                )

                .select_related(
                    "movie"
                )

                .order_by(
                    "-timestamp"
                )

            )

            rating_list = []

            for index, user_rating in enumerate(
                ratings
            ):

                movie = user_rating.movie

                genres = (
                    movie.genres
                    or ""
                )

                first_genre = (

                    genres.split("|")[0]

                    if genres

                    else "Movie"

                )

                # =================================================
                # POSTER OPTIMIZATION
                # =================================================

                poster_url = None

                if index < 20:

                    poster_url = (
                        get_movie_poster(
                            movie.movie_id
                        )
                    )

                rating_list.append({

                    "id":
                        user_rating.id,

                    "movieId":
                        movie.movie_id,

                    "title":
                        movie.title,

                    "genres":
                        genres,

                    "genre":
                        first_genre,

                    "rating":
                        float(
                            user_rating.rating
                        ),

                    "timestamp":
                        user_rating.timestamp,

                    "poster_url":
                        poster_url,

                })

            return JsonResponse(
                {
                    "user_id":
                        user_id,

                    "count":
                        len(rating_list),

                    "ratings":
                        rating_list
                },
                status=200
            )

        except ValueError:

            return JsonResponse(
                {
                    "error":
                        "Invalid user_id."
                },
                status=400
            )

        except Exception as error:

            return JsonResponse(
                {
                    "error":
                        str(error)
                },
                status=500
            )

    # =====================================================
    # POST: CREATE OR UPDATE USER RATING
    # =====================================================

    elif request.method == "POST":

        try:

            data = json.loads(
                request.body
            )

            user_id = data.get(
                "user_id"
            )

            movie_id = data.get(
                "movie_id"
            )

            rating_value = data.get(
                "rating"
            )

            # =================================================
            # VALIDATE USER ID
            # =================================================

            if user_id is None:

                return JsonResponse(
                    {
                        "error":
                            "user_id is required."
                    },
                    status=400
                )

            # =================================================
            # VALIDATE MOVIE ID
            # =================================================

            if movie_id is None:

                return JsonResponse(
                    {
                        "error":
                            "movie_id is required."
                    },
                    status=400
                )

            # =================================================
            # VALIDATE RATING
            # =================================================

            if rating_value is None:

                return JsonResponse(
                    {
                        "error":
                            "rating is required."
                    },
                    status=400
                )

            user_id = int(
                user_id
            )

            movie_id = int(
                movie_id
            )

            rating_value = float(
                rating_value
            )

            # =================================================
            # RATING MUST BE 1 TO 5
            # =================================================

            if (
                rating_value < 1
                or rating_value > 5
            ):

                return JsonResponse(
                    {
                        "error":
                            "Rating must be between 1 and 5."
                    },
                    status=400
                )

            # =================================================
            # FIND MOVIE
            # =================================================

            try:

                movie = Movie.objects.get(
                    movie_id=movie_id
                )

            except Movie.DoesNotExist:

                return JsonResponse(
                    {
                        "error":
                            "Movie not found."
                    },
                    status=404
                )

            # =================================================
            # CURRENT TIMESTAMP
            # =================================================

            current_timestamp = int(
                time.time()
            )

            # =================================================
            # IMPORTANT:
            # Find ONLY an application rating.
            #
            # We do NOT modify MovieLens dataset ratings.
            # =================================================

            existing_rating = (

                Rating.objects

                .filter(

                    user_id=user_id,

                    movie=movie,

                    is_dataset_rating=False

                )

                .first()

            )

            # =================================================
            # UPDATE EXISTING APPLICATION RATING
            # =================================================

            if existing_rating:

                existing_rating.rating = (
                    rating_value
                )

                existing_rating.timestamp = (
                    current_timestamp
                )

                existing_rating.is_dataset_rating = (
                    False
                )

                existing_rating.save()

                saved_rating = (
                    existing_rating
                )

                action = "updated"

                message = (
                    "Rating updated successfully."
                )

                response_status = 200

            # =================================================
            # CREATE NEW APPLICATION RATING
            # =================================================

            else:

                saved_rating = (
                    Rating.objects.create(

                        user_id=user_id,

                        movie=movie,

                        rating=rating_value,

                        timestamp=current_timestamp,

                        # =====================================
                        # VERY IMPORTANT
                        # This rating was submitted by the user.
                        # =====================================

                        is_dataset_rating=False

                    )
                )

                action = "created"

                message = (
                    "Rating submitted successfully."
                )

                response_status = 201

            # =================================================
            # SUCCESS RESPONSE
            # =================================================

            return JsonResponse(

                {

                    "message":
                        message,

                    "action":
                        action,

                    "rating": {

                        "id":
                            saved_rating.id,

                        "user_id":
                            saved_rating.user_id,

                        "movie_id":
                            movie.movie_id,

                        "movie_title":
                            movie.title,

                        "rating":
                            float(
                                saved_rating.rating
                            ),

                        "timestamp":
                            saved_rating.timestamp,

                        "is_dataset_rating":
                            saved_rating.is_dataset_rating

                    }

                },

                status=response_status

            )

        # =====================================================
        # INVALID JSON
        # =====================================================

        except json.JSONDecodeError:

            return JsonResponse(
                {
                    "error":
                        "Invalid JSON data."
                },
                status=400
            )

        # =====================================================
        # INVALID VALUE
        # =====================================================

        except (
            ValueError,
            TypeError
        ):

            return JsonResponse(
                {
                    "error":
                        "Invalid user_id, movie_id or rating."
                },
                status=400
            )

        # =====================================================
        # OTHER ERROR
        # =====================================================

        except Exception as error:

            return JsonResponse(
                {
                    "error":
                        str(error)
                },
                status=500
            )

    # =====================================================
    # INVALID HTTP METHOD
    # =====================================================

    return JsonResponse(
        {
            "error":
                "Only GET and POST requests are allowed."
        },
        status=405
    )


# =========================================================
# DELETE USER RATING API
# =========================================================

@csrf_exempt
def delete_rating(request, rating_id):

    if request.method != "DELETE":

        return JsonResponse(
            {
                "error":
                    "Only DELETE requests are allowed."
            },
            status=405
        )

    try:

        # =====================================================
        # IMPORTANT:
        # Only delete application ratings.
        #
        # MovieLens dataset ratings are protected.
        # =====================================================

        rating = Rating.objects.get(

            id=rating_id,

            is_dataset_rating=False

        )

        rating.delete()

        return JsonResponse(
            {
                "message":
                    "Rating deleted successfully."
            },
            status=200
        )

    except Rating.DoesNotExist:

        return JsonResponse(
            {
                "error":
                    "Rating not found."
            },
            status=404
        )

    except Exception as error:

        return JsonResponse(
            {
                "error":
                    str(error)
            },
            status=500
        )

