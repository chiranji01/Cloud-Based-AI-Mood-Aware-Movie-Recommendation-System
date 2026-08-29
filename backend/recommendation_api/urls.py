from django.urls import path
from . import views


app_name = "recommendation_api"


urlpatterns = [

    # AI recommendation API
    path(
        "recommendations/",
        views.mood_recommendations,
        name="mood_recommendations"
    ),

    # Temporary AI demonstration page
    path(
        "demo/",
        views.recommendation_demo,
        name="recommendation_demo"
    ),
]