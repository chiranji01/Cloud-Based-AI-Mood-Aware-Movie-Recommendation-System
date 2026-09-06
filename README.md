# MoodFlix

## Cloud-Based AI Mood-Aware Movie Recommendation System

**MoodFlix** is a cloud-based movie recommendation system that provides personalised movie recommendations based on a user's current mood and movie content.

The system combines a **React frontend**, **Django backend**, **MySQL database**, **MovieLens dataset**, **TMDb API**, and a **content-based recommendation engine**. AWS services are used for cloud hosting, database management, and application delivery.

This project was developed as part of **NIT6150 – Advanced Project** at **Victoria University**.

---

## Key Features

- User registration and login
- Browse and search movies
- Mood selection
- Top 10 mood-aware movie recommendations
- Detailed movie information
- TMDb movie posters and metadata
- IMDb links
- Similar movie recommendations
- Movie rating functionality
- User profile and rating history
- Admin movie and user management
- AWS cloud integration and deployment

---

## Mood-Aware Recommendation Engine

MoodFlix uses a **Content-Based Filtering** approach to recommend movies based on the user's selected mood.

The recommendation engine combines:

- Mood-to-Genre and Keyword Mapping
- Movie genres and tags
- TF-IDF feature representation
- Cosine Similarity
- Genre relevance
- Rating quality
- Popularity
- Movie recency

When a mood is selected, the system retrieves the associated genres and keywords from the database. **TF-IDF** converts the mood profile and movie content into numerical vectors, while **Cosine Similarity** measures how closely each movie matches the selected mood.

### Recommendation Score

| Factor | Weight |
| --- | ---: |
| Mood Similarity | 60% |
| Genre Match | 20% |
| Reliable Rating | 10% |
| Popularity | 5% |
| Recency | 5% |
| **Total** | **100%** |

Quality and relevance filters are applied before returning the **Top 10 ranked recommendations**.

### Supported Moods

- 😀 Happy
- 😢 Sad
- 😌 Relaxed
- 🤩 Excited
- 💗 Romantic
- 😰 Stressed

---

## Recommendation Flow

```text
User Selects Mood
        │
        ▼
Mood-to-Genre & Keyword Mapping
        │
        ▼
Movie Genres + Tags
        │
        ▼
TF-IDF
        │
        ▼
Cosine Similarity
        │
        ▼
Multi-Factor Ranking
        │
        ▼
Quality & Relevance Filtering
        │
        ▼
Top 10 Recommendations
```

---

## Movie Details & Similar Movies

Users can select a movie to view its **Movie Details** page.

MovieLens provides the core movie information, while the **TMDb API** provides additional metadata where available, including:

- Movie posters
- Overview
- Runtime
- Release date
- Director
- Writers
- Cast
- Certification

Movie links are also used to provide access to IMDb.

The Movie Details page includes a **You Might Also Like** feature that recommends up to **6 similar movies**.

This feature uses **Jaccard Similarity** to compare movie genres, together with rating-quality filtering.

```text
Jaccard Similarity =
Common Genres / Total Unique Genres
```

Therefore:

- **TF-IDF + Cosine Similarity** → Mood-to-Movie recommendations
- **Jaccard Similarity** → Movie-to-Movie recommendations

---

## Technology Stack

| Component | Technology |
| --- | --- |
| Frontend | React.js, Vite |
| Backend | Python, Django |
| Database | MySQL |
| Recommendation Engine | Python, Pandas, NumPy, Scikit-learn |
| Recommendation Method | Content-Based Filtering |
| Feature Representation | TF-IDF |
| Mood Similarity | Cosine Similarity |
| Similar Movie Method | Jaccard Similarity |
| Dataset | MovieLens |
| External Movie Data | TMDb API |
| Backend Hosting | Amazon EC2 |
| Cloud Database | Amazon RDS MySQL |
| Frontend Hosting | Amazon S3 |
| Content Delivery | Amazon CloudFront |
| Version Control | Git, GitHub |

---

## Dataset

MoodFlix uses the **MovieLens dataset** provided by **GroupLens Research**.

The dataset provides:

- Movie titles
- Genres
- Ratings
- Tags
- Movie links

Genres and tags are used by the recommendation engine. Ratings support quality and popularity calculations, while movie links connect MovieLens records with TMDb and IMDb information.

**MovieLens Dataset:**  
https://grouplens.org/datasets/movielens/

---

## System Architecture

```text
                         User
                           │
                           ▼
                  Amazon CloudFront
                       (HTTPS)
                     /         \
                    /           \
                   ▼             ▼
           Amazon S3          /api/*
        React Frontend           │
                                ▼
                          Amazon EC2
                         Django Backend
                                │
                    ┌───────────┴───────────┐
                    ▼                       ▼
             Amazon RDS              Recommendation
                MySQL                   Engine
                                           │
                                           ▼
                                  Top 10 Recommendations
                                           │
                                           ▼
                                      React Frontend
                                           │
                                           ▼
                                      Movie Details
                                           │
                                           ▼
                                        TMDb API
```

---

## AWS Cloud Deployment

MoodFlix uses multiple AWS services for cloud deployment and integration.

### Amazon EC2

**Amazon EC2** hosts the Django backend and mood-aware recommendation engine.

### Amazon RDS

**Amazon RDS MySQL** hosts the cloud database used by the Django application and recommendation engine.

EC2-to-RDS database connectivity has been successfully configured and tested.

### Amazon S3

The production build of the React/Vite frontend is hosted using **Amazon S3**.

### Amazon CloudFront

**Amazon CloudFront** provides HTTPS delivery and connects the frontend and backend through a single cloud distribution.

CloudFront uses separate origins for the application:

```text
Default requests → Amazon S3 → React frontend
/api/*           → Amazon EC2 → Django backend
```

The cloud environment has successfully been tested for:

- EC2-to-RDS connectivity
- Django database migrations
- Recommendation-engine execution on EC2
- Top 10 mood recommendation generation
- TMDb poster integration and caching
- Django recommendation API
- CloudFront `/api/*` routing
- HTTPS recommendation API requests
- React frontend delivery through S3 and CloudFront
- Mood recommendations displayed through the deployed frontend

Final end-to-end integration testing will be completed as the remaining team components are finalised.

---

## API Example

### Mood Recommendation

**Endpoint**

```http
POST /api/recommendations/
```

**Example Request**

```json
{
  "mood": "Happy"
}
```

**Example Response**

```json
{
  "mood": "Happy",
  "recommendation_count": 10,
  "recommendations": [
    {
      "movieId": 157296,
      "title": "Finding Dory (2016)",
      "genres": "Adventure|Animation|Comedy"
    }
  ]
}
```

The complete API response contains additional movie and recommendation information used by the frontend.

---

## Performance Optimisation

The system includes several improvements to recommendation quality and application performance:

- Weighted multi-factor recommendation ranking
- Genre relevance scoring
- Recommendation quality filtering
- Reliable-rating calculations
- Popularity and recency consideration
- TMDb poster caching
- Reduced repeated external API requests

---

## Project Structure

```text
Cloud-Based-AI-Mood-Aware-Movie-Recommendation-System/
│
├── backend/
│   ├── moviesapp/
│   ├── recommendation_api/
│   └── manage.py
│
├── data/
│   ├── movies.csv
│   ├── ratings.csv
│   ├── tags.csv
│   └── links.csv
│
├── frontend/
│   └── src/
│
├── recommendation/
│   └── recommendation_engine.py
│
├── test_recommendation.py
│
└── README.md
```

---

## Development Methodology

The project follows the **Agile Scrum** development methodology.

Development activities include:

- Sprint planning and task allocation
- Frontend and backend development
- Recommendation-engine development
- Database and API integration
- System integration
- Testing and debugging
- Performance optimisation
- AWS deployment and testing

**Git and GitHub** are used for version control, team collaboration, branch management, and code integration.

---

## Project Team

| Team Member | Role |
| --- | --- |
| Chiranji Vinodya Ranaweera Jayalathge | Project Manager & Recommendation Engine Developer |
| Meghan Reddy Podduturi | Frontend Developer |
| Prapti Pokharel | Backend Developer |
| Prashanth | Frontend Support & QA Tester |

---

## Project Status

**Current Stage: Final Integration, Cloud Deployment & Testing**

### Completed / Integrated

- React frontend
- Django backend and APIs
- MySQL database integration
- MovieLens dataset integration
- Mood-to-Genre and keyword mapping
- Mood-aware recommendation engine
- TF-IDF and Cosine Similarity
- Multi-factor recommendation ranking
- Top 10 mood recommendations
- TMDb metadata and poster integration
- Movie Details functionality
- Jaccard-based similar movie recommendations
- Ratings and profile interfaces
- GitHub team-code integration
- Amazon EC2 backend deployment
- Amazon RDS MySQL integration
- Amazon S3 frontend deployment
- Amazon CloudFront integration
- HTTPS recommendation API routing
- Successful cloud-based recommendation testing

### Final Integration & Testing

Before final submission, the team will complete:

- Integration of final team components
- Remaining frontend and backend fixes
- Full user-flow testing
- Search, ratings, profile, and admin testing
- Full end-to-end cloud testing
- Recommendation quality testing
- Performance and security checks
- Final AWS deployment configuration
- Final documentation and demonstration

---

## Future Enhancements

Future improvements may include:

- Hybrid content-based and collaborative filtering
- More advanced user personalisation
- Additional mood categories
- Automatic mood detection
- Machine-learning-based mood classification
- Improved recommendation diversity
- Enhanced caching and performance
- Production-grade backend configuration
- CI/CD deployment
- AWS monitoring and scaling

---

## Academic Information

**Project:** MoodFlix – Cloud-Based AI Mood-Aware Movie Recommendation System  
**Unit:** NIT6150 – Advanced Project  
**Institution:** Victoria University

---

## Acknowledgements

MoodFlix uses the **MovieLens dataset** provided by GroupLens Research and movie metadata provided through **The Movie Database (TMDb) API**.

This system was developed for academic purposes as part of the **NIT6150 Advanced Project at Victoria University**.
