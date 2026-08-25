from django.urls import path
from .views import register_user

from . import views
from .views import login_view

urlpatterns = [

    # Movies
    path(
        "movies/",
        views.movie_list,
        name="movie-list"
    ),

    path(
        "movies/<int:movie_id>/",
        views.movie_detail,
        name="movie-detail"
    ),

    # Import movies
    path(
        "movies/import/",
        views.import_movies,
        name="import-movies"
    ),

    # Import tags
    path(
        "tags/import/",
        views.import_tags,
        name="import-tags"
    ),

    # Import ratings
    path(
        "ratings/import/",
        views.import_ratings,
        name="import-ratings"
    ),

    # Import links
    path(
        "links/import/",
        views.import_links,
        name="import-links"
    ),

    path(
    "links/",
    views.link_list,
    name="link-list"
    ),

    path(
    "recommendations/",
    views.mood_recommendations,
    name="mood-recommendations"
),

    path("login/", views.login_view, name="login"),

    


    path("register/", views.register_user, name="register"),

    path("movies/<int:movie_id>/", views.movie_detail, name="movie-detail"),

]
