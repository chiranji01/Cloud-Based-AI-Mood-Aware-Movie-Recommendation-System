from django.urls import path
from . import views


app_name = "recommendation_api"


urlpatterns = [

    # =====================================================
    # AI RECOMMENDATION API
    # =====================================================

    path(
        "recommendations/",
        views.mood_recommendations,
        name="mood_recommendations"
    ),


    # =====================================================
    # MOVIE DETAILS API
    # =====================================================

    # Example:
    # /api/movies/115617/

    path(
        "movies/<int:movie_id>/",
        views.movie_details,
        name="movie_details"
    ),


    # =====================================================
    # NEW: SIMILAR MOVIES API
    # =====================================================

    # Example:
    # /api/movies/115617/similar/

    path(
        "movies/<int:movie_id>/similar/",
        views.similar_movies,
        name="similar_movies"
    ),

    # =====================================================
    # USER RATINGS API
    # =====================================================

    # GET:
    # /api/ratings/?user_id=6
    #
    # POST:
    # /api/ratings/
    # DELETE:
    # /api/ratings/123/

    path(
        "ratings/",
        views.user_ratings,
        name="ratings"
    ),

    path(
    "ratings/<int:rating_id>/",
    views.delete_rating,
    name="delete_rating"
    ),




    # =====================================================
    # TEMPORARY AI DEMONSTRATION PAGE
    # =====================================================

    path(
        "demo/",
        views.recommendation_demo,
        name="recommendation_demo"
    ),

    path("movies/popular/", views.popular_movies, name="popular_movies"),

    path(
    "movies/search/",
    views.search_movies,
    name="search_movies"
    ),

]