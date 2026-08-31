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
    # TEMPORARY AI DEMONSTRATION PAGE
    # =====================================================

    path(
        "demo/",
        views.recommendation_demo,
        name="recommendation_demo"
    ),
]