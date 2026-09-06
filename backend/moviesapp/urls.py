
from django.urls import path

from . import views


urlpatterns = [

    # =====================================================
    # MOVIES
    # =====================================================

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


    # =====================================================
    # IMPORT MOVIES
    # =====================================================

    path(
        "movies/import/",
        views.import_movies,
        name="import-movies"
    ),


    # =====================================================
    # IMPORT TAGS
    # =====================================================

    path(
        "tags/import/",
        views.import_tags,
        name="import-tags"
    ),


    # =====================================================
    # IMPORT RATINGS
    # =====================================================

    path(
        "ratings/import/",
        views.import_ratings,
        name="import-ratings"
    ),


    # =====================================================
    # USER RATINGS
    # =====================================================

    # POST
    # Create a new rating OR update an existing rating
    path(
        "ratings/",
        views.add_rating,
        name="add-rating"
    ),

    # GET
    # Get all application ratings for a user
    path(
        "ratings/user/<int:user_id>/",
        views.user_ratings,
        name="user-ratings"
    ),

    # DELETE
    # Delete one application rating
    path(
        "ratings/<int:rating_id>/",
        views.delete_rating,
        name="delete-rating"
    ),


    # =====================================================
    # IMPORT LINKS
    # =====================================================

    path(
        "links/import/",
        views.import_links,
        name="import-links"
    ),


    # =====================================================
    # MOVIE LINKS
    # =====================================================

    path(
        "links/",
        views.link_list,
        name="link-list"
    ),


    # =====================================================
    # AUTHENTICATION
    # =====================================================

    path(
        "login/",
        views.login_view,
        name="login"
    ),

    path(
        "register/",
        views.register_user,
        name="register"
    ),


    # =====================================================
    # PROFILE
    # =====================================================

    path(
        "profile/<int:user_id>/",
        views.user_profile,
        name="user-profile"
    ),

]
