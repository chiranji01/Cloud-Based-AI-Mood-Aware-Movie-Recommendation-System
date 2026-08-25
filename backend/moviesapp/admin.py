from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import (
    Movie,
    Rating,
    MovieTag,
    MoodGenreMapping,
    Recommendation,
)

admin.site.register(Movie)
admin.site.register(Rating)
admin.site.register(MovieTag)
admin.site.register(MoodGenreMapping)
admin.site.register(Recommendation)