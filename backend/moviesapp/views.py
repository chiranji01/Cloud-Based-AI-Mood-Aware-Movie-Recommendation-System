import csv
import io

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
# 1. GET MOVIES
# =========================================================

@api_view(["GET"])
def movie_list(request):

    movies = Movie.objects.all()

    data = []

    for movie in movies:
        data.append({
            "movie_id": movie.movie_id,
            "title": movie.title,
            "genres": movie.genres
        })

    return Response(data)


# =========================================================
# 2. GET SINGLE MOVIE
# =========================================================

@api_view(["GET"])
def movie_detail(request, movie_id):

    try:
        movie = Movie.objects.get(movie_id=movie_id)

    except Movie.DoesNotExist:

        return Response(
            {"error": "Movie not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    return Response({
        "movie_id": movie.movie_id,
        "title": movie.title,
        "genres": movie.genres
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
            {"error": "Please upload movies.csv"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:

        decoded_file = file.read().decode("utf-8-sig")

        reader = csv.DictReader(
            io.StringIO(decoded_file)
        )

        created_count = 0
        updated_count = 0

        with transaction.atomic():

            for row in reader:

                movie_id = int(row["movieId"])

                movie, created = Movie.objects.update_or_create(

                    movie_id=movie_id,

                    defaults={
                        "title": row["title"],
                        "genres": row["genres"]
                    }
                )

                if created:
                    created_count += 1
                else:
                    updated_count += 1

        return Response({

            "message": "Movies imported successfully",

            "created": created_count,

            "updated": updated_count

        })

    except Exception as e:

        return Response(

            {"error": str(e)},

            status=status.HTTP_400_BAD_REQUEST
        )


# =========================================================
# 4. IMPORT TAGS.CSV
# =========================================================
#
# tags.csv:
#
# userId,movieId,tag,timestamp
#
# Example:
#
# 1,1,"funny",1260759144
#
# We:
#
# 1. Find Movie
# 2. Find/Create Tag
# 3. Create MovieTag relationship
#
# =========================================================

@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def import_tags(request):

    file = request.FILES.get("file")

    if not file:

        return Response(
            {"error": "Please upload tags.csv"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:

        decoded_file = file.read().decode("utf-8-sig")

        reader = csv.DictReader(
            io.StringIO(decoded_file)
        )

        tags_created = 0
        movie_tags_created = 0
        skipped = 0

        with transaction.atomic():

            for row in reader:

                movie_id = int(row["movieId"])

                tag_name = row["tag"].strip()

                # -----------------------------------------
                # Find movie
                # -----------------------------------------

                try:

                    movie = Movie.objects.get(
                        movie_id=movie_id
                    )

                except Movie.DoesNotExist:

                    skipped += 1
                    continue

                # -----------------------------------------
                # Find or create tag
                # -----------------------------------------

                tag, created = Tag.objects.get_or_create(
                    tag=tag_name
                )

                if created:

                    tags_created += 1

                # -----------------------------------------
                # Create MovieTag relationship
                # -----------------------------------------

                movie_tag, created = MovieTag.objects.get_or_create(

                    movie=movie,

                    tag=tag
                )

                if created:

                    movie_tags_created += 1

        return Response({

            "message": "Tags imported successfully",

            "tags_created": tags_created,

            "movie_tags_created": movie_tags_created,

            "skipped": skipped

        })

    except Exception as e:

        return Response(

            {"error": str(e)},

            status=status.HTTP_400_BAD_REQUEST
        )


# =========================================================
# 5. IMPORT RATINGS.CSV
# =========================================================
#
# ratings.csv:
#
# userId,movieId,rating,timestamp
#
# =========================================================

@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def import_ratings(request):

    file = request.FILES.get("file")

    if not file:

        return Response(

            {"error": "Please upload ratings.csv"},

            status=status.HTTP_400_BAD_REQUEST
        )

    try:

        decoded_file = file.read().decode("utf-8-sig")

        reader = csv.DictReader(
            io.StringIO(decoded_file)
        )

        created_count = 0
        skipped = 0

        with transaction.atomic():

            for row in reader:

                movie_id = int(row["movieId"])

                # -----------------------------------------
                # Find movie
                # -----------------------------------------

                try:

                    movie = Movie.objects.get(
                        movie_id=movie_id
                    )

                except Movie.DoesNotExist:

                    skipped += 1
                    continue

                # -----------------------------------------
                # Create rating
                # -----------------------------------------

                Rating.objects.create(

                    user_id=int(row["userId"]),

                    movie=movie,

                    rating=float(row["rating"]),

                    timestamp=int(row["timestamp"])
                )

                created_count += 1

        return Response({

            "message": "Ratings imported successfully",

            "created": created_count,

            "skipped": skipped

        })

    except Exception as e:

        return Response(

            {"error": str(e)},

            status=status.HTTP_400_BAD_REQUEST
        )


# =========================================================
# 6. IMPORT LINKS.CSV
# =========================================================
#
# links.csv:
#
# movieId,imdbId,tmdbId
#
# =========================================================

@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def import_links(request):

    file = request.FILES.get("file")

    if not file:

        return Response(

            {"error": "Please upload links.csv"},

            status=status.HTTP_400_BAD_REQUEST
        )

    try:

        decoded_file = file.read().decode("utf-8-sig")

        reader = csv.DictReader(
            io.StringIO(decoded_file)
        )

        created_count = 0
        updated_count = 0
        skipped = 0

        with transaction.atomic():

            for row in reader:

                movie_id = int(row["movieId"])

                # -----------------------------------------
                # Find movie
                # -----------------------------------------

                try:

                    movie = Movie.objects.get(
                        movie_id=movie_id
                    )

                except Movie.DoesNotExist:

                    skipped += 1
                    continue

                # -----------------------------------------
                # Convert IDs
                # -----------------------------------------

                imdb_id = row.get("imdbId")

                tmdb_id = row.get("tmdbId")

                if imdb_id:
                    imdb_id = int(imdb_id)

                else:
                    imdb_id = None

                if tmdb_id:
                    tmdb_id = int(float(tmdb_id))

                else:
                    tmdb_id = None

                # -----------------------------------------
                # Create or update link
                # -----------------------------------------

                link, created = MovieLink.objects.update_or_create(

                    movie=movie,

                    defaults={

                        "imdb_id": imdb_id,

                        "tmdb_id": tmdb_id
                    }
                )

                if created:
                    created_count += 1

                else:
                    updated_count += 1

        return Response({

            "message": "Links imported successfully",

            "created": created_count,

            "updated": updated_count,

            "skipped": skipped

        })

    except Exception as e:

        return Response(

            {"error": str(e)},

            status=status.HTTP_400_BAD_REQUEST
        )



@api_view(["GET"])
def link_list(request):

    links = MovieLink.objects.select_related("movie").all()

    data = []

    for link in links:
        data.append({
            "movie_id": link.movie.movie_id,
            "movie_title": link.movie.title,
            "imdb_id": link.imdb_id,
            "tmdb_id": link.tmdb_id
        })

    return Response(data)

@api_view(["GET"])
def mood_recommendations(request):

    mood = request.GET.get("mood")

    if not mood:
        return Response(
            {"error": "Please provide a mood"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        mood_mapping = MoodGenreMapping.objects.get(
            mood_name__iexact=mood
        )

    except MoodGenreMapping.DoesNotExist:
        return Response(
            {"error": "Mood not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    # Convert:
    # "Comedy,Adventure,Romance"
    # into:
    # ["comedy", "adventure", "romance"]

    recommended_genres = [
        genre.strip().lower()
        for genre in mood_mapping.genres.split(",")
    ]

    movies = Movie.objects.all()

    recommended_movies = []

    for movie in movies:

        # MovieLens stores genres like:
        # "Comedy|Drama"

        movie_genres = [
            genre.strip().lower()
            for genre in movie.genres.split("|")
        ]

        # Check whether at least one genre matches
        if any(
            genre in recommended_genres
            for genre in movie_genres
        ):

            recommended_movies.append({
                "movie_id": movie.movie_id,
                "title": movie.title,
                "genres": movie.genres
            })

    return Response({
        "mood": mood,
        "movies": recommended_movies[:20]
    })




# =========================================================
# USER REGISTRATION
# =========================================================

@api_view(["POST"])
def register_user(request):

    User = get_user_model()

    name = request.data.get("name")
    email = request.data.get("email")
    password = request.data.get("password")

    # -----------------------------------------
    # Check required fields
    # -----------------------------------------

    if not name or not email or not password:
        return Response(
            {
                "error": "Name, email and password are required."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Remove unnecessary spaces from email
    email = email.strip().lower()

    # -----------------------------------------
    # Check password length
    # -----------------------------------------

    if len(password) < 8:
        return Response(
            {
                "error": "Password must be at least 8 characters long."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # -----------------------------------------
    # Check whether email already exists
    # -----------------------------------------

    if User.objects.filter(email=email).exists():
        return Response(
            {
                "error": "An account with this email already exists."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # -----------------------------------------
    # Create user
    # -----------------------------------------

    user = User.objects.create_user(
        username=email,
        email=email,
        password=password,
        first_name=name
    )

    return Response(
        {
            "message": "Registration successful!",
            "user": {
                "id": user.id,
                "name": user.first_name,
                "email": user.email
            }
        },
        status=status.HTTP_201_CREATED
    )


# =========================================================
# USER LOGIN
# =========================================================

@api_view(["POST"])
def login_view(request):

    User = get_user_model()

    email = request.data.get("email")
    password = request.data.get("password")

    # -----------------------------------------
    # Check required fields
    # -----------------------------------------

    if not email or not password:
        return Response(
            {
                "message": "Email and password are required."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Remove unnecessary spaces from email
    email = email.strip().lower()

    # -----------------------------------------
    # Find user
    # -----------------------------------------

    try:

        user = User.objects.get(
            email=email
        )

    except User.DoesNotExist:

        return Response(
            {
                "message": "Invalid email or password."
            },
            status=status.HTTP_401_UNAUTHORIZED
        )

    # -----------------------------------------
    # Verify password
    # -----------------------------------------

    authenticated_user = authenticate(
        username=user.username,
        password=password
    )

    # -----------------------------------------
    # Login successful
    # -----------------------------------------

    if authenticated_user is not None:

        return Response(
            {
                "message": "Login successful!",

                "user": {
                    "id": user.id,
                    "username": user.username,
                    "name": user.first_name,
                    "email": user.email
                }
            },
            status=status.HTTP_200_OK
        )

    # -----------------------------------------
    # Wrong password
    # -----------------------------------------

    return Response(
        {
            "message": "Invalid email or password."
        },
        status=status.HTTP_401_UNAUTHORIZED
    )

# =========================================================
# USER RATINGS
# =========================================================

@api_view(["POST"])
def add_rating(request):

    user_id = request.data.get("user_id")
    movie_id = request.data.get("movie_id")
    rating_value = request.data.get("rating")

    # Check required fields
    if not user_id or not movie_id or rating_value is None:
        return Response(
            {
                "error": "user_id, movie_id and rating are required."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Check user
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response(
            {
                "error": "User not found."
            },
            status=status.HTTP_404_NOT_FOUND
        )

    # Check movie
    try:
        movie = Movie.objects.get(movie_id=movie_id)
    except Movie.DoesNotExist:
        return Response(
            {
                "error": "Movie not found."
            },
            status=status.HTTP_404_NOT_FOUND
        )

    # Convert rating
    try:
        rating_value = float(rating_value)
    except (ValueError, TypeError):
        return Response(
            {
                "error": "Rating must be a number."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Rating must be between 0.5 and 5
    if rating_value < 0.5 or rating_value > 5:
        return Response(
            {
                "error": "Rating must be between 0.5 and 5."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Check whether this user already rated this movie
    existing_rating = Rating.objects.filter(
        user_id=user.id,
        movie=movie
    ).first()

    if existing_rating:

        existing_rating.rating = rating_value
        existing_rating.timestamp = int(
            __import__("time").time()
        )

        existing_rating.save()

        return Response(
            {
                "message": "Rating updated successfully.",
                "rating": {
                    "movie_id": movie.movie_id,
                    "movie_title": movie.title,
                    "rating": existing_rating.rating
                }
            },
            status=status.HTTP_200_OK
        )

    # Create new rating
    rating = Rating.objects.create(
        user_id=user.id,
        movie=movie,
        rating=rating_value,
        timestamp=int(__import__("time").time())
    )

    return Response(
        {
            "message": "Rating submitted successfully.",
            "rating": {
                "movie_id": movie.movie_id,
                "movie_title": movie.title,
                "rating": rating.rating
            }
        },
        status=status.HTTP_201_CREATED
    )


# =========================================================
# GET USER RATINGS
# =========================================================

@api_view(["GET"])
def user_ratings(request, user_id):

    # Check user
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response(
            {
                "error": "User not found."
            },
            status=status.HTTP_404_NOT_FOUND
        )

    ratings = Rating.objects.filter(
        user_id=user.id
    ).select_related("movie").order_by("-id")

    data = []

    for rating in ratings:

        data.append({
            "movie_id": rating.movie.movie_id,
            "movie_title": rating.movie.title,
            "genres": rating.movie.genres,
            "rating": rating.rating,
            "timestamp": rating.timestamp
        })

    return Response({
        "user_id": user.id,
        "user_name": user.first_name,
        "rating_count": len(data),
        "ratings": data
    })


# =========================================================
# USER PROFILE
# =========================================================

@api_view(["GET"])
def user_profile(request, user_id):

    # Check user
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response(
            {
                "error": "User not found."
            },
            status=status.HTTP_404_NOT_FOUND
        )

    ratings = Rating.objects.filter(
        user_id=user.id
    )

    rating_count = ratings.count()

    if rating_count > 0:
        total_rating = sum(
            rating.rating
            for rating in ratings
        )

        average_rating = round(
            total_rating / rating_count,
            2
        )
    else:
        average_rating = 0

    return Response({
        "id": user.id,
        "name": user.first_name,
        "email": user.email,
        "rating_count": rating_count,
        "average_rating": average_rating
    })