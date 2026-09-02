# MoodFlix AI Recommendation Engine

The **MoodFlix AI Recommendation Engine** is the mood-aware recommendation component of the MoodFlix movie recommendation system.

It uses **Content-Based Filtering**, **TF-IDF**, and **Cosine Similarity** to generate personalised movie recommendations based on the user's selected mood. Movie genres, tags, ratings, popularity, and release information are used to improve recommendation relevance and quality.

## Recommendation Approach

The recommendation engine uses:

- MovieLens movies, ratings, and tags
- Mood-to-Genre and Keyword Mapping
- TF-IDF Vectorization
- Cosine Similarity
- Genre relevance
- Rating reliability
- Movie popularity
- Movie recency
- Quality and relevance filtering

Movie genres and tags are combined as content features. The selected mood is represented using associated genres and keywords, allowing Cosine Similarity to measure how closely each movie matches the user's mood.

## Supported Moods

| Mood | Main Genres |
| --- | --- |
| Happy | Comedy, Animation, Adventure |
| Sad | Drama |
| Relaxed | Comedy, Animation |
| Excited | Action, Adventure, Thriller |
| Romantic | Romance |
| Stressed | Animation, Children, Comedy |

## Recommendation Ranking

The final recommendation score combines five factors:

| Factor | Weight |
| --- | ---: |
| Mood Similarity | 60% |
| Genre Match | 20% |
| Reliable Rating | 10% |
| Popularity | 5% |
| Recency | 5% |

```text
Final Score =
(0.60 × Mood Similarity)
+ (0.20 × Genre Match)
+ (0.10 × Reliable Rating)
+ (0.05 × Popularity)
+ (0.05 × Recency)
```

Mood similarity and genre relevance contribute **80% of the final score**, keeping recommendations focused primarily on the user's selected mood.

Quality and relevance filters are applied before returning the **Top 10 recommendations**.

## How It Works

1. The user selects a mood.
2. Django retrieves the associated mood profile from MySQL.
3. Movie genres and tags are prepared as content features.
4. TF-IDF converts the movie and mood features into numerical vectors.
5. Cosine Similarity calculates the mood-to-movie similarity.
6. Genre relevance, rating reliability, popularity, and recency are calculated.
7. A weighted final recommendation score is generated.
8. Quality and relevance filters are applied.
9. The Top 10 ranked movies are returned.

## Django API Integration

The recommendation engine is integrated with the **Django backend** through a recommendation API.

Example request:

```json
{
  "mood": "Happy"
}
```

The API returns recommendation information including the movie ID, title, genres, ratings, recommendation score, and poster information.

## Movie Details & Similar Recommendations

Users can open a recommended movie on the **Movie Details** page, where additional information such as posters, overview, runtime, cast, director, and certification is retrieved using the **TMDb API**.

The **You Might Also Like** feature also recommends up to six related movies using genre-based **Jaccard Similarity** with rating-quality filtering.

## AWS Integration

The recommendation-engine environment has been deployed and tested using:

- **Amazon EC2** – Django and recommendation-engine environment
- **Amazon RDS MySQL** – Cloud database

The Django environment on EC2 has been successfully connected to the RDS database, and the recommendation engine has successfully generated mood-based recommendations using the cloud environment.

## Testing

The recommendation engine has been tested across all six supported moods:

**Happy · Sad · Relaxed · Excited · Romantic · Stressed**

Testing also covers recommendation ranking, Django API requests, validation, database connectivity, and AWS execution.

## Main Files

- `recommendation_engine.py` – Main recommendation algorithm
- `test_recommendation.py` – Individual recommendation testing
- `test_all_moods.py` – Testing across all supported moods
- `recommendation_api/views.py` – Django recommendation API
- `recommendation_api/tests.py` – API tests

## Current Status

### Completed

- MovieLens data integration
- Mood-to-Genre and Keyword Mapping
- TF-IDF and Cosine Similarity
- Multi-factor recommendation ranking
- Quality and relevance filtering
- MySQL database integration
- Django recommendation API
- Top 10 mood recommendations
- TMDb integration
- Similar movie recommendations
- Amazon EC2 and RDS integration
- Cloud recommendation testing

### In Progress

- Recommendation quality improvements
- Performance optimisation
- Full system integration and testing
