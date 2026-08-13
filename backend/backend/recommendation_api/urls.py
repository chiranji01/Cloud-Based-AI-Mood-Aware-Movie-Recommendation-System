from django.urls import path
from . import views

app_name = "recommendation_api"

urlpatterns = [
    path(
        "recommendations/",
        views.mood_recommendations,
        name="mood_recommendations"
    ),
]