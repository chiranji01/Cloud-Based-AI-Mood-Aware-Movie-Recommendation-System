import os 
import sys 
from pathlib import Path 
 
import django 
import pandas as pd 
from django.apps import apps 
from sklearn.feature_extraction.text import TfidfVectorizer 
from sklearn.metrics.pairwise import cosine_similarity 
 
 
# ========================================================= 
# 1. CONNECT THE AI ENGINE TO DJANGO 
# ========================================================= 
 
# Main project folder 
PROJECT_ROOT = Path(__file__).resolve().parent.parent 
 
# Django backend folder 
BACKEND_DIR = PROJECT_ROOT 
 
# Allow Python to find backend/settings.py and moviesapp 
if str(BACKEND_DIR) not in sys.path: 
    sys.path.insert(0, str(BACKEND_DIR)) 
 
# Tell Django which settings file to use 
os.environ.setdefault( 
    "DJANGO_SETTINGS_MODULE", 
    "backend.settings" 
) 
 
# Initialise Django only if it has not already been started 
if not apps.ready: 
    django.setup() 
 
 
# ========================================================= 
# 2. IMPORT DATABASE MODELS 
# ========================================================= 
 
from moviesapp.models import ( 
    Movie, 
    MovieTag, 
    Rating, 
    MoodGenreMapping, 
    Recommendation,
) 
 
 
# ========================================================= 
# 3. LOAD MOVIES FROM MYSQL 
# ========================================================= 
 
movie_records = Movie.objects.values( 
    "movie_id", 
    "title", 
    "genres" 
) 
 
movies = pd.DataFrame( 
    list(movie_records) 
) 
 
# Rename database field so the rest of the recommendation 
# code can continue using "movieId" 
movies = movies.rename( 
    columns={ 
        "movie_id": "movieId" 
    } 
) 
 
 
# ========================================================= 
# 4. LOAD MOVIE TAGS FROM MYSQL 
# ========================================================= 
 
movie_tag_records = MovieTag.objects.select_related( 
    "movie", 
    "tag" 
).values( 
    "movie_id", 
    "tag__tag" 
) 
 
tags = pd.DataFrame( 
    list(movie_tag_records) 
) 
 
tags = tags.rename( 
    columns={ 
        "movie_id": "movieId", 
        "tag__tag": "tag" 
    } 
) 
 
 
# ========================================================= 
# 5. LOAD RATINGS FROM MYSQL 
# ========================================================= 
 
rating_records = Rating.objects.values( 
    "movie_id", 
    "rating" 
) 
 
ratings = pd.DataFrame( 
    list(rating_records) 
) 
 
ratings = ratings.rename( 
    columns={ 
        "movie_id": "movieId" 
    } 
) 
 
 
# ========================================================= 
# 6. COMBINE ALL TAGS FOR EACH MOVIE 
# ========================================================= 
 
movie_tags = ( 
    tags.groupby("movieId")["tag"] 
    .apply(lambda x: " ".join(x.astype(str))) 
    .reset_index() 
) 
 
 
# ========================================================= 
# 7. CALCULATE AVERAGE RATING AND RATING COUNT 
# ========================================================= 
 
rating_summary = ( 
    ratings.groupby("movieId")["rating"] 
    .agg(["mean", "count"]) 
    .reset_index() 
) 
 
rating_summary.columns = [ 
    "movieId", 
    "average_rating", 
    "rating_count" 
] 
 
 
# ========================================================= 
# 8. MERGE MOVIE, TAG AND RATING INFORMATION 
# ========================================================= 
 
movies = movies.merge( 
    movie_tags, 
    on="movieId", 
    how="left" 
) 
 
movies = movies.merge( 
    rating_summary, 
    on="movieId", 
    how="left" 
) 
 
 
# ========================================================= 
# 9. FILL MISSING VALUES 
# ========================================================= 
 
movies["tag"] = movies["tag"].fillna("") 
movies["average_rating"] = movies["average_rating"].fillna(0) 
movies["rating_count"] = movies["rating_count"].fillna(0) 
 
 
# ========================================================= 
# 10. PREPARE MOVIE GENRES 
# ========================================================= 
 
movies["genres_clean"] = movies["genres"].str.replace( 
    "|", 
    " ", 
    regex=False 
) 
 
 
# ========================================================= 
# 11. COMBINE GENRES AND TAGS 
# ========================================================= 
 
movies["combined_features"] = ( 
    movies["genres_clean"] 
    + " " 
    + movies["tag"] 
) 
 
 
# ========================================================= 
# 12. CREATE TF-IDF VECTORS 
# ========================================================= 
 
tfidf = TfidfVectorizer( 
    stop_words="english" 
) 
 
tfidf_matrix = tfidf.fit_transform( 
    movies["combined_features"] 
) 
 
 
# ========================================================= 
# 13. MAIN RECOMMENDATION FUNCTION 
# ========================================================= 
 
def get_mood_recommendations( 
    mood, 
    number_of_movies=10 
): 
 
    # Clean mood received from Django/frontend 
    mood = mood.strip().title() 
 
    # ----------------------------------------------------- 
    # Get mood profile from MySQL 
    # ----------------------------------------------------- 
 
    try: 
        mood_profile = MoodGenreMapping.objects.get( 
            mood_name__iexact=mood 
        ) 
 
    except MoodGenreMapping.DoesNotExist: 
        return [] 
 
    # Convert database genre string into Python list 
    selected_genres = [ 
        genre.strip() 
        for genre in mood_profile.genres.split(",") 
    ] 
 
    # Convert database keyword string into Python list 
    selected_keywords = [ 
        keyword.strip() 
        for keyword in mood_profile.keywords.split(",") 
    ] 
 
    # ----------------------------------------------------- 
    # Create mood profile text 
    # ----------------------------------------------------- 
 
    mood_text = " ".join( 
        selected_genres 
        + selected_keywords 
    ) 
 
    # Convert mood profile using the same TF-IDF model 
    mood_vector = tfidf.transform( 
        [mood_text] 
    ) 
 
    # ----------------------------------------------------- 
    # Calculate mood similarity 
    # ----------------------------------------------------- 
 
    mood_similarity = cosine_similarity( 
        mood_vector, 
        tfidf_matrix 
    ).flatten() 
 
    # ----------------------------------------------------- 
    # Normalise average rating 
    # MovieLens ratings are between 0 and 5 
    # ----------------------------------------------------- 
 
    rating_score = ( 
        movies["average_rating"] 
        / 5.0 
    ) 
 
    # ----------------------------------------------------- 
    # Rating reliability 
    # 
    # Movies with very few ratings receive less influence. 
    # As rating_count increases, reliability approaches 1. 
    # ----------------------------------------------------- 
 
    rating_reliability = ( 
        movies["rating_count"] 
        / 
        ( 
            movies["rating_count"] 
            + 10 
        ) 
    ) 
 
    reliable_rating_score = ( 
        rating_score 
        * rating_reliability 
    ) 
 
    # ----------------------------------------------------- 
    # Final ranking 
    # 
    # 80% = mood relevance 
    # 20% = reliable rating score 
    # ----------------------------------------------------- 
 
    final_score = ( 
        0.8 * mood_similarity 
        + 0.2 * reliable_rating_score 
    ) 
 
    # Rank highest score first 
    ranked_indices = ( 
        final_score 
        .argsort()[::-1] 
    ) 
 
    recommendations = [] 
 
    # ----------------------------------------------------- 
    # Select Top 10 appropriate movies 
    # ----------------------------------------------------- 
 
    for movie_index in ranked_indices: 
 
        movie = movies.iloc[ 
            movie_index 
        ] 
 
        movie_genres = movie[ 
            "genres" 
        ] 
 
        # Movie must contain at least one genre 
        # associated with the selected mood 
        if any( 
            genre in movie_genres 
            for genre in selected_genres 
        ): 
 
            recommendations.append( 
                { 
                    "movieId": int( 
                        movie["movieId"] 
                    ), 
 
                    "title": movie[ 
                        "title" 
                    ], 
 
                    "genres": movie_genres, 
 
                    "mood_similarity": round( 
                        float( 
                            mood_similarity[ 
                                movie_index 
                            ] 
                        ), 
                        3 
                    ), 
 
                    "average_rating": round( 
                        float( 
                            movie[ 
                                "average_rating" 
                            ] 
                        ), 
                        2 
                    ), 
 
                    "rating_count": int( 
                        movie[ 
                            "rating_count" 
                        ] 
                    ), 
 
                    "final_score": round( 
                        float( 
                            final_score.iloc[ 
                                movie_index 
                            ] 
                        ), 
                        3 
                    ) 
                } 
            ) 
 
        # Stop when required number is reached 
        if ( 
            len(recommendations) 
            == number_of_movies 
        ): 
            break 
 
   # =====================================================
    # SAVE RECOMMENDATIONS TO DATABASE
    # =====================================================

    Recommendation.objects.filter(
        mood=mood_profile
    ).delete()

    for recommendation in recommendations:

        Recommendation.objects.create(
            movie_id=recommendation["movieId"],
            mood=mood_profile,
            mood_similarity=recommendation["mood_similarity"],
            average_rating=recommendation["average_rating"],
            rating_count=recommendation["rating_count"],
            final_score=recommendation["final_score"]
        )

    return recommendations