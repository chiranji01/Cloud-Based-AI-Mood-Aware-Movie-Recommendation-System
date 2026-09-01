# MoodFlix

## Cloud-Based AI Mood-Aware Movie Recommendation System

**MoodFlix** is a cloud-based movie recommendation system that provides personalised movie recommendations based on a user's current mood and movie content.

The system combines a React frontend, Django backend, MySQL database, MovieLens dataset, TMDb API, and a content-based recommendation engine to generate mood-aware movie suggestions.

This project is developed as part of the **NIT6150 – Advanced Project** at **Victoria University**.

---

## Key Features

- User registration and login
- Browse and search movies
- View detailed movie information
- Select a current mood
- Generate Top 10 mood-aware movie recommendations
- View movie posters and additional movie information
- View similar movie recommendations
- Rate movies and view ratings
- User profile management
- Admin movie and user management

---

## Mood-Aware Recommendation System

MoodFlix uses a **Content-Based Filtering** approach to generate recommendations based on the user's selected mood.

The recommendation engine uses:

- Mood-to-Genre and Keyword Mapping
- Movie genres and tags
- TF-IDF
- Cosine Similarity
- Genre relevance
- Rating quality
- Popularity
- Movie recency

When a user selects a mood, the system retrieves the associated genres and keywords from the database. TF-IDF converts the mood profile and movie content into numerical vectors, and Cosine Similarity measures how closely each movie matches the selected mood.

### Recommendation Score

| Factor | Weight |
| --- | ---: |
| Mood Similarity | 60% |
| Genre Match | 20% |
| Reliable Rating | 10% |
| Popularity | 5% |
| Recency | 5% |

Mood similarity and genre relevance receive the highest importance so that recommendations remain strongly related to the user's selected mood.

Quality and relevance filters are applied before returning the **Top 10 recommendations**.

---

## Supported Moods

MoodFlix currently supports six mood categories:

- 😀 Happy
- 😢 Sad
- 😌 Relaxed
- 🤩 Excited
- 💗 Romantic
- 😰 Stressed

Each mood is mapped to relevant genres and descriptive keywords.

---

## Recommendation Process

1. The user selects a mood.
2. The React frontend sends the mood to the Django API.
3. The backend retrieves the mood profile from MySQL.
4. Movie genres and tags are used as content features.
5. TF-IDF converts the movie and mood features into vectors.
6. Cosine Similarity calculates mood similarity.
7. Genre relevance, rating quality, popularity, and recency are calculated.
8. The factors are combined into a final recommendation score.
9. Quality and relevance filters are applied.
10. The Top 10 movies are returned to the frontend.

---

## Movie Details

Users can select a recommended movie to open its **Movie Details** page.

Core movie information is based on the **MovieLens dataset**, while the **TMDb API** provides additional information including:

- Movie poster
- Overview
- Runtime
- Release date
- Director
- Writers
- Cast
- Certification
- IMDb link

---

## Similar Movie Recommendations

The Movie Details page includes a **You Might Also Like** feature that recommends up to **6 similar movies**.

The system compares movie genres using **Jaccard Similarity** and applies rating-quality filters before ranking the results.

```text
Jaccard Similarity =
Common Genres / Total Unique Genres
```

Users can select a similar movie to open its Movie Details page and receive another set of related recommendations.

---

## Technology Stack

| Component | Technology |
| --- | --- |
| Frontend | React.js |
| Backend | Python / Django |
| Database | MySQL |
| Recommendation Engine | Python, Pandas, NumPy, Scikit-learn |
| Recommendation Method | Content-Based Filtering |
| Feature Representation | TF-IDF |
| Mood Similarity | Cosine Similarity |
| Similar Movie Method | Jaccard Similarity |
| Dataset | MovieLens |
| External Movie Data | TMDb API |
| Cloud Platform | AWS – Amazon EC2 & Amazon RDS |
| Version Control | Git & GitHub |

---

## Dataset

MoodFlix uses the **MovieLens dataset** provided by **GroupLens Research**.

The dataset provides:

- Movie titles
- Genres
- User ratings
- Movie tags
- Movie links

Genres and tags are used by the recommendation engine, ratings support quality and popularity calculations, and movie links connect MovieLens movies with TMDb and IMDb.

[MovieLens Dataset – GroupLens Research](https://grouplens.org/datasets/movielens/)

---

## System Architecture

MoodFlix consists of the following main components:

### Frontend
**React.js** provides the user interface and communicates with the backend through API requests.

### Backend
**Django** provides the backend application and API endpoints.

### Database
**MySQL** stores movie information, ratings, tags, mood mappings, movie links, and application data.

### Recommendation Engine
The recommendation engine uses **Python, Pandas, NumPy, and Scikit-learn** to generate mood-aware movie recommendations.

### External Movie Service
The **TMDb API** provides additional movie metadata and poster images.

### Cloud Platform
**Amazon Web Services (AWS)** is used for cloud integration and deployment testing.

The Django backend and recommendation-engine environment have been successfully tested on **Amazon EC2** with the project database hosted on **Amazon RDS MySQL**.

Full end-to-end cloud deployment is still in progress.

---

## System Flow

```text
User
  │
  ▼
React Frontend
  │
  ▼
Django API
  │
  ├──────────────► MySQL / Amazon RDS
  │
  ▼
Mood-Aware Recommendation Engine
  │
  ├── TF-IDF
  ├── Cosine Similarity
  ├── Genre Relevance
  ├── Rating Quality
  ├── Popularity
  └── Recency
  │
  ▼
Top 10 Recommendations
  │
  ▼
Movie Details
  │
  ├──────────────► TMDb API
  │
  ▼
You Might Also Like
```

---

## AWS Cloud Integration

The current AWS integration includes:

- **Amazon EC2** for the Django backend and recommendation-engine environment
- **Amazon RDS MySQL** for the cloud database
- EC2-to-RDS database connectivity
- Environment-variable-based database configuration
- Cloud-based recommendation-engine testing

A copy of the project database has been migrated to Amazon RDS. Django running on EC2 has been successfully connected to RDS, and mood-based recommendations have been successfully generated in the AWS environment.

The remaining cloud work includes frontend deployment and complete end-to-end system integration.

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
- Recommendation engine development
- Database and API integration
- System integration
- Testing
- Cloud integration
- Progress evaluation

**Git and GitHub** are used for version control, collaboration, and code integration.

---

## Project Team

| Team Member | Role |
| --- | --- |
| Chiranji Vinodya Ranaweera Jayalathge | Project Manager & AI Developer |
| Meghan Reddy Podduturi | Frontend Developer |
| Prapti Pokharel | Backend Developer |
| Prashanth | Frontend Support & QA Tester |

---

## Project Status

**Current Stage: System Integration, Cloud Integration and Testing**

Completed or integrated components include:

- React frontend interfaces
- Django backend and APIs
- MySQL database integration
- MovieLens dataset integration
- Mood-aware recommendation engine
- TF-IDF and Cosine Similarity
- Multi-factor recommendation scoring
- Top 10 mood recommendations
- TMDb integration
- Dynamic Movie Details page
- You Might Also Like recommendations
- Amazon EC2 environment
- Amazon RDS MySQL database
- EC2-to-RDS integration
- Successful cloud recommendation testing

Current development is focused on:

- Completing remaining frontend and backend functionality
- User authentication, ratings, profile, and admin functionality
- System and integration testing
- Recommendation quality testing
- Performance improvements
- Completing full AWS deployment

---

## Future Development

Planned development includes:

- Complete remaining user functionality
- Improve recommendation accuracy
- Improve API performance
- Cache external movie information where appropriate
- Complete system and integration testing
- Complete frontend cloud deployment
- Complete end-to-end AWS integration
- Perform final security and performance testing
- Explore more advanced recommendation techniques

---

## Academic Information

**Unit:** NIT6150 – Advanced Project  
**Institution:** Victoria University
