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
    # UPDATED: MOVIE DETAILS API
    # =====================================================

    # Example:
    # /api/movies/115617/
    #
    # movie_id is the MovieLens movie ID selected
    # from the Mood recommendation page.

    path(
        "movies/<int:movie_id>/",
        views.movie_details,
        name="movie_details"
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