from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

# User Model (Extending Django's User)
class User(AbstractUser):
    ROLE_CHOICES = [
        ('User', 'User'),
        ('Admin', 'Admin'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='User')
    is_active = models.BooleanField(default=True)
    
    # Add these lines to fix the conflicts
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='movieapp_user_set',  # Changed from default
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='movieapp_user_set',  # Changed from default
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )
    
    class Meta:
        db_table = 'users'
    
    def __str__(self):
        return self.username

# Admins Model
class Admin(models.Model):
    admin_name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    password_hash = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.DateTimeField()
    
    class Meta:
        db_table = 'admins'
    
    def __str__(self):
        return self.admin_name

# Genres Model
class Genre(models.Model):
    genre_name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    
    class Meta:
        db_table = 'genres'
    
    def __str__(self):
        return self.genre_name

# Mood Genre Mapping
class MoodGenreMapping(models.Model):
    mood_id = models.AutoField(primary_key=True)
    genre = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    
    class Meta:
        db_table = 'mood_genre_mapping'
    
    def __str__(self):
        return self.genre

# Mood History
class MoodHistory(models.Model):
    history_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    mood = models.ForeignKey(MoodGenreMapping, on_delete=models.CASCADE)
    description = models.CharField(max_length=100, blank=True, null=True)
    session_id = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'mood_history'
        unique_together = ['user', 'mood']  # Composite primary key
    
    def __str__(self):
        return f"{self.user.username} - {self.mood.genre}"

# Movies Model
class Movie(models.Model):
    movie_id = models.AutoField(primary_key=True)
    movielens_id = models.IntegerField(unique=True, null=True, blank=True)  # Original ID from the MovieLens dataset (Chiranji)
    title = models.CharField(max_length=255)
    genres = models.CharField(max_length=255, blank=True, null=True) # MovieLens genres, for example: Action|Adventure|Thriller (Chiranji)
    year = models.CharField(max_length=255, blank=True, null=True)
    release_date = models.DateTimeField(blank=True, null=True)
    duration = models.IntegerField(blank=True, null=True)  # in minutes
    average_rating = models.FloatField(blank=True, null=True)
    rating_count = models.IntegerField(blank=True, null=True, default=0)
    popularity = models.FloatField(blank=True, null=True, default=0.0)
    is_favorite = models.BooleanField(default=False)
    is_pending = models.BooleanField(default=False)
    is_cancelled = models.BooleanField(default=False)
    category_id = models.IntegerField(blank=True, null=True)
    category_name = models.CharField(max_length=100, blank=True, null=True)
    description = models.CharField(max_length=100, blank=True, null=True)
    genres_id = models.IntegerField(blank=True, null=True)
    genres_name = models.CharField(max_length=100, blank=True, null=True)
    movies_id = models.IntegerField(blank=True, null=True)
    movies_name = models.CharField(max_length=100, blank=True, null=True)
    movies_description = models.CharField(max_length=100, blank=True, null=True)
    movies_year = models.IntegerField(blank=True, null=True)
    movies_genre = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'movies'
        indexes = [
            models.Index(fields=['title']),
            models.Index(fields=['popularity']),
        ]
    
    def __str__(self):
        return self.title

# Movie Details
class MovieDetail(models.Model):
    detail_id = models.AutoField(primary_key=True)
    movie = models.OneToOneField(Movie, on_delete=models.CASCADE, unique=True)
    cast = models.TextField(blank=True, null=True)
    director = models.CharField(max_length=255, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    runtime = models.IntegerField(blank=True, null=True)  # in minutes
    language = models.CharField(max_length=255, blank=True, null=True)
    production_companies = models.CharField(max_length=255, blank=True, null=True)
    
    class Meta:
        db_table = 'movie_details'
    
    def __str__(self):
        return f"Details for {self.movie.title}"

# Movie Genres (Many-to-Many Relationship)
class MovieGenre(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    genre = models.ForeignKey(Genre, on_delete=models.CASCADE)
    
    class Meta:
        db_table = 'movie_genres'
        unique_together = ['movie', 'genre']
    
    def __str__(self):
        return f"{self.movie.title} - {self.genre.genre_name}"

# Tags Model
class Tag(models.Model):
    tag_name = models.CharField(max_length=100, unique=True)
    
    class Meta:
        db_table = 'tags'
    
    def __str__(self):
        return self.tag_name

# Movie Tags (Many-to-Many Relationship with Audit Fields)
class MovieTag(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)
    tag_name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.DateTimeField()
    modified_at = models.DateTimeField(auto_now=True)
    modified_by = models.DateTimeField()
    
    class Meta:
        db_table = 'movie_tags'
        unique_together = ['movie', 'tag']
    
    def __str__(self):
        return f"{self.movie.title} - {self.tag.tag_name}"

# Ratings Model
class Rating(models.Model):
    ratings_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    rating_value = models.FloatField()
    review = models.TextField(blank=True, null=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'ratings'
        unique_together = ['user', 'movie']
    
    def __str__(self):
        return f"{self.user.username} - {self.movie.title}: {self.rating_value}"

# Links Model
class Link(models.Model):
    link_id = models.AutoField(primary_key=True)
    movie = models.OneToOneField(Movie, on_delete=models.CASCADE, unique=True)
    id = models.CharField(max_length=255, blank=True, null=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    
    class Meta:
        db_table = 'links'
    
    def __str__(self):
        return f"Link for {self.movie.title}"