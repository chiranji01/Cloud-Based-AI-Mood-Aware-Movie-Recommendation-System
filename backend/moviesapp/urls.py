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

    path(
        "ratings/",
        views.add_rating,
        name="add-rating"
    ),

    path(
        "ratings/user/<int:user_id>/",
        views.user_ratings,
        name="user-ratings"
    ),

    # =====================================================
    # IMPORT LINKS
    # =====================================================

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