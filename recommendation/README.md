# MoodFlix AI Recommendation Engine

This folder contains the **mood-aware movie recommendation engine** developed for the MoodFlix project.

The recommendation engine generates movie suggestions based on the user's selected mood using movie genres, tags and rating information from the **MovieLens dataset**.

## Recommendation Approach

The recommendation engine uses a **Content-Based Filtering** approach with:

- MovieLens movie, rating and tag data
- Mood-to-Genre and Keyword Mapping
- TF-IDF Vectorization
- Cosine Similarity
- Movie average ratings
- Rating reliability
- Weighted recommendation ranking

TF-IDF is used to represent movie genres, tags and mood keywords as numerical features. Cosine Similarity is then used to measure how closely each movie matches the selected mood profile.

## Supported Moods

| Mood | Main Genres |
| --- | --- |
| Happy | Comedy, Animation, Adventure |
| Sad | Drama, Romance |
| Relaxed | Comedy, Romance, Fantasy |
| Excited | Action, Adventure, Thriller |
| Romantic | Romance, Drama |
| Stressed | Comedy, Animation, Fantasy |

Each mood also contains related keywords to provide additional information when calculating the mood match.

## How It Works

1. The user selects their current mood.
2. The selected mood is mapped to suitable genres and keywords.
3. Movie genres and tags are combined as movie features.
4. TF-IDF converts the movie features into numerical vectors.
5. The mood profile is converted using the same TF-IDF model.
6. Cosine Similarity calculates how closely each movie matches the selected mood.
7. Movie average ratings and rating counts are considered.
8. Rating reliability is calculated to reduce the influence of movies with very few ratings.
9. A final weighted ranking score is calculated.
10. The Top 10 ranked movies are returned.

## Ranking Method

Mood similarity is the main factor used when ranking movies.

The final score is calculated as:

```text
Final Score =
(0.8 × Mood Similarity)
+
(0.2 × Reliable Rating Score)
```

This gives:

- **80% weight** to mood similarity
- **20% weight** to reliable movie rating information

The rating reliability calculation helps prevent movies with only a small number of ratings from being ranked too highly because of an unreliable average rating.

## Django Integration

The recommendation engine is connected to the Django backend through a recommendation API.

The API receives the selected mood using a **POST request**, passes it to the recommendation engine and returns the ranked recommendations.

Example request:

```json
{
  "mood": "Happy"
}
```

The API response includes information such as:

- Movie title
- Genres
- Mood similarity
- Average rating
- Rating count
- Final ranking score

The API also includes validation and error handling for invalid requests and unsupported moods.

## Testing

The recommendation engine has been tested with all six supported moods:

- Happy
- Sad
- Relaxed
- Excited
- Romantic
- Stressed

Django API testing has also been implemented to test recommendation requests, validation and error handling.

An interactive MoodFlix demo has been created to test and demonstrate the complete recommendation flow through the Django API.

## Main Files

- `recommendation_engine.py` – Contains the mood profiles, MovieLens processing, TF-IDF, Cosine Similarity and ranking logic.
- `test_recommendation.py` – Tests individual recommendation results.
- `test_all_moods.py` – Tests recommendations across all supported moods.
- `recommendation_api/views.py` – Connects the recommendation engine with the Django API.
- `recommendation_api/tests.py` – Contains Django recommendation API tests.
- `templates/recommendation_api/demo.html` – Provides the interactive MoodFlix recommendation demo.

## Current Status

### Completed

- MovieLens movies, tags and ratings integration
- Mood-to-Genre and Keyword Mapping
- TF-IDF feature extraction
- Cosine Similarity mood matching
- Average rating calculation
- Rating reliability calculation
- Weighted final ranking
- Top 10 recommendation generation
- Testing across all supported moods
- Django recommendation API
- API validation and error handling
- Django API testing
- Interactive recommendation demo

### In Progress

- MySQL database integration
- Integration with the main Django backend
- Integration with the final React frontend
- Full system integration and testing