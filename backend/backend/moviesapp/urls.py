from django.urls import path

from . import views


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
]
