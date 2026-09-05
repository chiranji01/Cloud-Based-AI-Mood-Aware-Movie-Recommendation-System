
import csv
import io
import os
import time
import requests

from django.db import transaction
from django.contrib.auth import authenticate, get_user_model

User = get_user_model()

from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status

from .models import (
    Movie,
    Tag,
    MovieTag,
    Rating,
    MovieLink,
    MoodGenreMapping
)


# =========================================================
# TMDB CONFIGURATION
# =========================================================

TMDB_API_KEY = os.getenv("TMDB_API_KEY")

TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"

TMDB_MOVIE_URL = "https://api.themoviedb.org/3/movie"


# =========================================================
# HELPER - GET MOVIE POSTER
# =========================================================

def get_movie_poster(movie):
    """
    Get poster URL using the MovieLink TMDB ID.

    Returns:
        poster URL string or None
    """

    try:

        link = MovieLink.objects.filter(
            movie=movie
        ).first()

        if not link:
            return None

        if not link.tmdb_id:
            return None

        # -------------------------------------------------
        # If TMDB API key exists, ask TMDB for poster path
        # -------------------------------------------------

        if TMDB_API_KEY:

            response = requests.get(
                f"{TMDB_MOVIE_URL}/{link.tmdb_id}",
                params={
                    "api_key": TMDB_API_KEY
                },
                timeout=5
            )

            if response.ok:

                movie_data = response.json()

                poster_path = movie_data.get(
                    "poster_path"
                )

                if poster_path:

                    return (
                        f"{TMDB_IMAGE_BASE_URL}"
                        f"{poster_path}"
                    )

    except Exception as e:

        print(
            "Poster error:",
            e
        )

    return None


# =========================================================
# 1. GET MOVIES
# =========================================================

@api_view(["GET"])
def movie_list(request):

    movies = Movie.objects.all()

    data = []

    for movie in movies:

        poster_url = get_movie_poster(movie)

        data.append({

            "movie_id": movie.movie_id,

            "title": movie.title,

            "genres": movie.genres,

            "poster_url": poster_url

        })

    return Response(data)


# =========================================================
# 2. GET SINGLE MOVIE
# =========================================================

@api_view(["GET"])
def movie_detail(request, movie_id):

    try:

        movie = Movie.objects.get(
            movie_id=movie_id
        )

    except Movie.DoesNotExist:

        return Response(

            {
                "error": "Movie not found"
            },

            status=status.HTTP_404_NOT_FOUND
        )

    poster_url = get_movie_poster(movie)

    return Response({

        "movie_id": movie.movie_id,

        "title": movie.title,

        "genres": movie.genres,

        "poster_url": poster_url

    })


# =========================================================
# 3. IMPORT MOVIES.CSV
# =========================================================

@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def import_movies(request):

    file = request.FILES.get("file")

    if not file:

        return Response(

            {
                "error": "Please upload movies.csv"
            },

            status=status.HTTP_400_BAD_REQUEST
        )

    try:

        decoded_file = file.read().decode(
            "utf-8-sig"
        )

        reader = csv.DictReader(
            io.StringIO(decoded_file)
        )

        created_count = 0
        updated_count = 0

        with transaction.atomic():

            for row in reader:

                movie_id = int(
                    row["movieId"]
                )

                movie, created = (
                    Movie.objects.update_or_create(

                        movie_id=movie_id,

                        defaults={

                            "title": row["title"],

                            "genres": row["genres"]

                        }
                    )
                )

                if created:

                    created_count += 1

                else:

                    updated_count += 1

        return Response({

            "message":
                "Movies imported successfully",

            "created":
                created_count,

            "updated":
                updated_count

        })

    except Exception as e:

        return Response(

            {
                "error": str(e)
            },

            status=status.HTTP_400_BAD_REQUEST
        )


# =========================================================
# 4. IMPORT TAGS.CSV
# =========================================================

@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def import_tags(request):

    file = request.FILES.get("file")

    if not file:

        return Response(

            {
                "error": "Please upload tags.csv"
            },

            status=status.HTTP_400_BAD_REQUEST
        )

    try:

        decoded_file = file.read().decode(
            "utf-8-sig"
        )

        reader = csv.DictReader(
            io.StringIO(decoded_file)
        )

        tags_created = 0

        movie_tags_created = 0

        skipped = 0

        with transaction.atomic():

            for row in reader:

                movie_id = int(
                    row["movieId"]
                )

                tag_name = row[
                    "tag"
                ].strip()

                try:

                    movie = Movie.objects.get(
                        movie_id=movie_id
                    )

                except Movie.DoesNotExist:

                    skipped += 1

                    continue

                tag, created = (
                    Tag.objects.get_or_create(
                        tag=tag_name
                    )
                )

                if created:

                    tags_created += 1

                movie_tag, created = (
                    MovieTag.objects.get_or_create(

                        movie=movie,

                        tag=tag

                    )
                )

                if created:

                    movie_tags_created += 1

        return Response({

            "message":
                "Tags imported successfully",

            "tags_created":
                tags_created,

            "movie_tags_created":
                movie_tags_created,

            "skipped":
                skipped

        })

    except Exception as e:

        return Response(

            {
                "error": str(e)
            },

            status=status.HTTP_400_BAD_REQUEST
        )


# =========================================================
# 5. IMPORT RATINGS.CSV
# =========================================================

@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def import_ratings(request):

    file = request.FILES.get("file")

    if not file:

        return Response(

            {
                "error":
                    "Please upload ratings.csv"
            },

            status=status.HTTP_400_BAD_REQUEST
        )

    try:

        decoded_file = file.read().decode(
            "utf-8-sig"
        )

        reader = csv.DictReader(
            io.StringIO(decoded_file)
        )

        created_count = 0

        skipped = 0

        with transaction.atomic():

            for row in reader:

                movie_id = int(
                    row["movieId"]
                )

                try:

                    movie = Movie.objects.get(
                        movie_id=movie_id
                    )

                except Movie.DoesNotExist:

                    skipped += 1

                    continue

                Rating.objects.create(

                    user_id=int(
                        row["userId"]
                    ),

                    movie=movie,

                    rating=float(
                        row["rating"]
                    ),

                    timestamp=int(
                        row["timestamp"]
                    ),

                    is_dataset_rating=True
                )

                created_count += 1

        return Response({

            "message":
                "Ratings imported successfully",

            "created":
                created_count,

            "skipped":
                skipped

        })

    except Exception as e:

        return Response(

            {
                "error": str(e)
            },

            status=status.HTTP_400_BAD_REQUEST
        )


# =========================================================
# 6. IMPORT LINKS.CSV
# =========================================================

@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def import_links(request):

    file = request.FILES.get("file")

    if not file:

        return Response(

            {
                "error":
                    "Please upload links.csv"
            },

            status=status.HTTP_400_BAD_REQUEST
        )

    try:

        decoded_file = file.read().decode(
            "utf-8-sig"
        )

        reader = csv.DictReader(
            io.StringIO(decoded_file)
        )

        created_count = 0

        updated_count = 0

        skipped = 0

        with transaction.atomic():

            for row in reader:

                movie_id = int(
                    row["movieId"]
                )

                try:

                    movie = Movie.objects.get(
                        movie_id=movie_id
                    )

                except Movie.DoesNotExist:

                    skipped += 1

                    continue

                imdb_id = row.get(
                    "imdbId"
                )

                tmdb_id = row.get(
                    "tmdbId"
                )

                if imdb_id:

                    imdb_id = int(
                        imdb_id
                    )

                else:

                    imdb_id = None

                if tmdb_id:

                    tmdb_id = int(
                        float(tmdb_id)
                    )

                else:

                    tmdb_id = None

                link, created = (
                    MovieLink.objects.update_or_create(

                        movie=movie,

                        defaults={

                            "imdb_id":
                                imdb_id,

                            "tmdb_id":
                                tmdb_id

                        }
                    )
                )

                if created:

                    created_count += 1

                else:

                    updated_count += 1

        return Response({

            "message":
                "Links imported successfully",

            "created":
                created_count,

            "updated":
                updated_count,

            "skipped":
                skipped

        })

    except Exception as e:

        return Response(

            {
                "error": str(e)
            },

            status=status.HTTP_400_BAD_REQUEST
        )


# =========================================================
# 7. GET MOVIE LINKS
# =========================================================

@api_view(["GET"])
def link_list(request):

    links = (
        MovieLink.objects
        .select_related("movie")
        .all()
    )

    data = []

    for link in links:

        data.append({

            "movie_id":
                link.movie.movie_id,

            "movie_title":
                link.movie.title,

            "imdb_id":
                link.imdb_id,

            "tmdb_id":
                link.tmdb_id

        })

    return Response(data)


# =========================================================
# 8. MOOD RECOMMENDATIONS
# =========================================================

@api_view(["GET"])
def mood_recommendations(request):

    mood = request.GET.get(
        "mood"
    )

    if not mood:

        return Response(

            {
                "error":
                    "Please provide a mood"
            },

            status=status.HTTP_400_BAD_REQUEST
        )

    try:

        mood_mapping = (
            MoodGenreMapping.objects.get(
                mood_name__iexact=mood
            )
        )

    except MoodGenreMapping.DoesNotExist:

        return Response(

            {
                "error":
                    "Mood not found"
            },

            status=status.HTTP_404_NOT_FOUND
        )

    recommended_genres = [

        genre.strip().lower()

        for genre in
        mood_mapping.genres.split(",")

    ]

    movies = Movie.objects.all()

    recommended_movies = []

    for movie in movies:

        movie_genres = [

            genre.strip().lower()

            for genre in
            movie.genres.split("|")

        ]

        if any(

            genre in recommended_genres

            for genre in movie_genres

        ):

            recommended_movies.append({

                "movie_id":
                    movie.movie_id,

                "title":
                    movie.title,

                "genres":
                    movie.genres,

                "poster_url":
                    get_movie_poster(movie)

            })

    return Response({

        "mood":
            mood,

        "movies":
            recommended_movies[:20]

    })


# =========================================================
# 9. USER REGISTRATION
# =========================================================

@api_view(["POST"])
def register_user(request):

    name = request.data.get(
        "name"
    )

    email = request.data.get(
        "email"
    )

    password = request.data.get(
        "password"
    )

    if not name or not email or not password:

        return Response(

            {
                "error":
                    "Name, email and password are required."
            },

            status=status.HTTP_400_BAD_REQUEST
        )

    email = email.strip().lower()

    if len(password) < 8:

        return Response(

            {
                "error":
                    "Password must be at least 8 characters long."
            },

            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(
        email=email
    ).exists():

        return Response(

            {
                "error":
                    "An account with this email already exists."
            },

            status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create_user(

        username=email,

        email=email,

        password=password,

        first_name=name

    )

    return Response(

        {

            "message":
                "Registration successful!",

            "user": {

                "id":
                    user.id,

                "name":
                    user.first_name,

                "email":
                    user.email

            }

        },

        status=status.HTTP_201_CREATED
    )


# =========================================================
# 10. USER LOGIN
# =========================================================

@api_view(["POST"])
def login_view(request):

    email = request.data.get(
        "email"
    )

    password = request.data.get(
        "password"
    )

    if not email or not password:

        return Response(

            {
                "message":
                    "Email and password are required."
            },

            status=status.HTTP_400_BAD_REQUEST
        )

    email = email.strip().lower()

    try:

        user = User.objects.get(
            email=email
        )

    except User.DoesNotExist:

        return Response(

            {
                "message":
                    "Invalid email or password."
            },

            status=status.HTTP_401_UNAUTHORIZED
        )

    authenticated_user = authenticate(

        username=user.username,

        password=password

    )

    if authenticated_user is not None:

        return Response(

            {

                "message":
                    "Login successful!",

                "user": {

                    "id":
                        user.id,

                    "username":
                        user.username,

                    "name":
                        user.first_name,

                    "email":
                        user.email

                }

            },

            status=status.HTTP_200_OK
        )

    return Response(

        {
            "message":
                "Invalid email or password."
        },

        status=status.HTTP_401_UNAUTHORIZED
    )


# =========================================================
# 11. ADD / UPDATE USER RATING
# =========================================================

@api_view(["POST"])
def add_rating(request):
    print("========== ADD RATING DEBUG ==========")
    print("REQUEST DATA:", request.data)
    print("user_id:", request.data.get("user_id"))
    print("movie_id:", request.data.get("movie_id"))
    print("rating:", request.data.get("rating"))
    print("======================================")

    user_id = request.data.get(
        "user_id"
    )

    movie_id = request.data.get(
        "movie_id"
    )

    rating_value = request.data.get(
        "rating"
    )

    # -----------------------------------------------------
    # REQUIRED FIELDS
    # -----------------------------------------------------

    if not user_id or not movie_id or rating_value is None:

        return Response(

            {
                "error":
                    "user_id, movie_id and rating are required."
            },

            status=status.HTTP_400_BAD_REQUEST
        )

    # -----------------------------------------------------
    # USER
    # -----------------------------------------------------

    try:

        user = User.objects.get(
            id=user_id
        )

    except User.DoesNotExist:

        return Response(

            {
                "error":
                    "User not found."
            },

            status=status.HTTP_404_NOT_FOUND
        )

    # -----------------------------------------------------
    # MOVIE
    # -----------------------------------------------------

    try:

        movie = Movie.objects.get(
            movie_id=movie_id
        )

    except Movie.DoesNotExist:

        return Response(

            {
                "error":
                    "Movie not found."
            },

            status=status.HTTP_404_NOT_FOUND
        )

    # -----------------------------------------------------
    # CONVERT RATING
    # -----------------------------------------------------

    try:

        rating_value = float(
            rating_value
        )

    except (ValueError, TypeError):

        return Response(

            {
                "error":
                    "Rating must be a number."
            },

            status=status.HTTP_400_BAD_REQUEST
        )

    # -----------------------------------------------------
    # VALIDATE RANGE
    # -----------------------------------------------------

    if (
        rating_value < 0.5
        or
        rating_value > 5
    ):

        return Response(

            {
                "error":
                    "Rating must be between 0.5 and 5."
            },

            status=status.HTTP_400_BAD_REQUEST
        )

    # -----------------------------------------------------
    # FIND EXISTING USER RATING
    #
    # IMPORTANT:
    # Dataset ratings are ignored.
    # -----------------------------------------------------

    existing_rating = Rating.objects.filter(

        user_id=user.id,

        movie=movie,

        is_dataset_rating=False

    ).first()

    # -----------------------------------------------------
    # UPDATE EXISTING RATING
    # -----------------------------------------------------

    if existing_rating:

        existing_rating.rating = (
            rating_value
        )

        existing_rating.timestamp = (
            int(time.time())
        )

        existing_rating.save()

        return Response(

            {

                "message":
                    "Rating updated successfully.",

                "action":
                    "updated",

                "rating": {

                    "id":
                        existing_rating.id,

                    "movie_id":
                        movie.movie_id,

                    "movie_title":
                        movie.title,

                    "genres":
                        movie.genres,

                    "rating":
                        existing_rating.rating,

                    "timestamp":
                        existing_rating.timestamp

                }

            },

            status=status.HTTP_200_OK
        )

    # -----------------------------------------------------
    # CREATE NEW USER RATING
    # -----------------------------------------------------

    rating = Rating.objects.create(

        user_id=user.id,

        movie=movie,

        rating=rating_value,

        timestamp=int(
            time.time()
        ),

        is_dataset_rating=False

    )

    return Response(

        {

            "message":
                "Rating submitted successfully.",

            "action":
                "created",

            "rating": {

                "id":
                    rating.id,

                "movie_id":
                    movie.movie_id,

                "movie_title":
                    movie.title,

                "genres":
                    movie.genres,

                "rating":
                    rating.rating,

                "timestamp":
                    rating.timestamp

            }

        },

        status=status.HTTP_201_CREATED
    )


# =========================================================
# 12. GET USER RATINGS
# =========================================================

@api_view(["GET"])
def user_ratings(request, user_id):

    # -----------------------------------------------------
    # USER
    # -----------------------------------------------------

    try:

        user = User.objects.get(
            id=user_id
        )

    except User.DoesNotExist:

        return Response(

            {
                "error":
                    "User not found."
            },

            status=status.HTTP_404_NOT_FOUND
        )

    # -----------------------------------------------------
    # ONLY APPLICATION RATINGS
    # -----------------------------------------------------

    all_user_ratings = Rating.objects.filter(

        user_id=user.id,

        is_dataset_rating=False

    ).select_related(
        "movie"
    )

    # -----------------------------------------------------
    # LATEST 10 RATINGS
    # -----------------------------------------------------

    ratings = (

        all_user_ratings

        .order_by(
            "-timestamp"
        )[:10]

    )

    data = []

    for rating in ratings:

        # -------------------------------------------------
        # GET POSTER
        # -------------------------------------------------

        poster_url = get_movie_poster(
            rating.movie
        )

        data.append({

            "id":
                rating.id,

            "movie_id":
                rating.movie.movie_id,

            "movie_title":
                rating.movie.title,

            "genres":
                rating.movie.genres,

            "rating":
                rating.rating,

            "timestamp":
                rating.timestamp,

            "poster_url":
                poster_url

        })

    return Response({

        "user_id":
            user.id,

        "user_name":
            user.first_name,

        "rating_count":
            all_user_ratings.count(),

        "ratings":
            data

    })


# =========================================================
# 13. DELETE USER RATING
# =========================================================

@api_view(["DELETE"])
def delete_rating(request, rating_id):

    # -----------------------------------------------------
    # FIND ONLY APPLICATION RATING
    # -----------------------------------------------------

    try:

        rating = Rating.objects.select_related(
            "movie"
        ).get(

            id=rating_id,

            is_dataset_rating=False

        )

    except Rating.DoesNotExist:

        return Response(

            {
                "error":
                    "Rating not found."
            },

            status=status.HTTP_404_NOT_FOUND
        )

    # -----------------------------------------------------
    # SAVE INFORMATION FOR RESPONSE
    # -----------------------------------------------------

    deleted_rating = {

        "id":
            rating.id,

        "movie_id":
            rating.movie.movie_id,

        "movie_title":
            rating.movie.title,

        "rating":
            rating.rating

    }

    # -----------------------------------------------------
    # DELETE
    # -----------------------------------------------------

    rating.delete()

    # -----------------------------------------------------
    # RESPONSE
    # -----------------------------------------------------

    return Response(

        {

            "message":
                "Rating deleted successfully.",

            "rating":
                deleted_rating

        },

        status=status.HTTP_200_OK
    )


# =========================================================
# 14. USER PROFILE
# =========================================================

@api_view(["GET"])
def user_profile(request, user_id):

    try:

        user = User.objects.get(
            id=user_id
        )

    except User.DoesNotExist:

        return Response(

            {
                "error":
                    "User not found."
            },

            status=status.HTTP_404_NOT_FOUND
        )

    ratings = Rating.objects.filter(

        user_id=user.id,

        is_dataset_rating=False

    )

    rating_count = ratings.count()

    if rating_count > 0:

        total_rating = sum(

            rating.rating

            for rating in ratings

        )

        average_rating = round(

            total_rating /
            rating_count,

            2

        )

    else:

        average_rating = 0

    return Response({

        "id":
            user.id,

        "name":
            user.first_name,

        "email":
            user.email,

        "rating_count":
            rating_count,

        "average_rating":
            average_rating

    })
