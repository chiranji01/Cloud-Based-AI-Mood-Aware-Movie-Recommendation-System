# MoodFlix

## Cloud-Based AI Mood-Aware Movie Recommendation System

**MoodFlix** is a cloud-based movie recommendation system that provides personalised movie recommendations based on a user's current mood and movie content.

The system combines a React frontend, Django backend, MySQL database, MovieLens dataset, and a content-based recommendation engine to generate mood-aware movie suggestions.

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

MoodFlix uses a **Content-Based Filtering** approach to generate movie recommendations based on the user's selected mood.

The recommendation engine uses:

- Mood-to-Genre and Keyword Mapping
- Movie genres and tags
- TF-IDF feature representation
- Cosine Similarity
- Genre matching
- Movie rating quality
- Popularity based on rating count
- Movie recency

Mood profiles are stored in the MySQL database using associated genres and descriptive keywords.

When a user selects a mood, the system creates a mood profile using its genres and keywords. TF-IDF converts the mood profile and movie content into numerical feature vectors. Cosine Similarity is then used to measure how closely each movie matches the selected mood.

### Recommendation Score

The final recommendation score combines several factors:

| Factor | Weight |
| --- | ---: |
| Mood Similarity | 60% |
| Genre Match | 20% |
| Reliable Rating | 10% |
| Popularity | 5% |
| Recency | 5% |

Mood similarity and genre relevance are given the highest importance so that recommendations remain strongly related to the user's selected mood.

Rating quality, popularity, and recency are also considered to improve the overall quality of the recommendations.

The system applies additional quality and relevance filters before returning the **Top 10 recommendations**.

---

## Supported Moods

MoodFlix currently supports six mood categories:

- 😀 Happy
- 😢 Sad
- 😌 Relaxed
- 🤩 Excited
- 💗 Romantic
- 😰 Stressed

Each mood is mapped to relevant movie genres and descriptive keywords used by the recommendation engine.

---

## Recommendation Process

The main recommendation process is:

1. The user selects a mood.
2. The frontend sends the selected mood to the Django API.
3. The backend retrieves the mood profile from MySQL.
4. Movie genres and tags are used as content features.
5. TF-IDF converts movie features and the mood profile into numerical vectors.
6. Cosine Similarity calculates the similarity between the mood and each movie.
7. Genre relevance, rating quality, popularity, and recency are calculated.
8. The factors are combined into a final recommendation score.
9. Quality and relevance filters are applied.
10. The Top 10 ranked movies are returned to the React frontend.

---

## Movie Details

Users can select a recommended movie to open its **Movie Details** page.

Core movie information is based on the **MovieLens dataset**, while MovieLens link data is used to connect movies with external movie identifiers.

The backend uses the **TMDb API** to retrieve additional movie information, including:

- Movie poster
- Overview
- Runtime
- Release date
- Director
- Writers
- Cast
- Certification
- IMDb link

This allows the application to combine MovieLens recommendation data with additional movie information for the user interface.

---

## Similar Movie Recommendations

The Movie Details page also includes a **You Might Also Like** recommendation feature.

This feature recommends up to **6 similar movies** based on the genres of the currently selected movie.

The process includes:

1. Retrieving the genres of the selected movie.
2. Comparing them with other movies in the database.
3. Calculating genre similarity.
4. Applying minimum rating and rating-count quality filters.
5. Ranking the candidate movies by similarity and rating information.
6. Returning the Top 6 similar movies.
7. Retrieving their poster images from TMDb.

Users can select a similar movie to open its Movie Details page and receive another set of related movie recommendations.

---

## Technology Stack

| Component | Technology |
| --- | --- |
| Frontend | React.js |
| Backend | Python / Django |
| Database | MySQL |
| Recommendation Engine | Python, Pandas, Scikit-learn |
| Recommendation Method | Content-Based Filtering |
| Feature Representation | TF-IDF |
| Similarity Method | Cosine Similarity |
| Dataset | MovieLens |
| External Movie Data | TMDb API |
| Cloud Platform | Amazon Web Services (AWS) |
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

Movie genres and tags are used as content features by the recommendation engine.

Rating data is used to evaluate movie quality and popularity, while movie-link data is used to connect MovieLens movies with external services such as TMDb and IMDb.

[MovieLens Dataset – GroupLens Research](https://grouplens.org/datasets/movielens/)

---

## System Architecture

MoodFlix consists of the following main components:

### Frontend
**React.js** provides the user interface and communicates with the backend through API requests.

### Backend
**Django** provides the backend application and API endpoints used by the frontend.

### Database
**MySQL** stores movie information, ratings, tags, mood mappings, movie links, and other application data.

### Recommendation Engine
The recommendation engine is developed using **Python, Pandas, and Scikit-learn** and performs the mood-aware recommendation calculations.

### External Movie Service
**TMDb API** provides additional movie metadata and poster images.

### Cloud Platform
**Amazon Web Services (AWS)** is planned for cloud deployment of the completed application.

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
  ├──────────────► MySQL Database
  │
  ▼
Mood-Aware Recommendation Engine
  │
  ├── TF-IDF
  ├── Cosine Similarity
  ├── Genre Matching
  ├── Rating Quality
  ├── Popularity
  └── Recency
  │
  ▼
Top 10 Movie Recommendations
  │
  ▼
React User Interface
  │
  ▼
Movie Details
  │
  ├──────────────► TMDb API
  │
  ▼
Similar Movie Recommendations
```

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
└── README.md
```

---

## Development Methodology

The project follows the **Agile Scrum** development methodology.

Development activities include:

- Sprint planning
- Task allocation
- Frontend development
- Backend development
- Recommendation engine development
- Database integration
- System integration
- Testing
- Progress evaluation
- Version control

**Git and GitHub** are used for source code management, collaboration, integration, and tracking development progress.

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

**Current Stage: Development and System Integration**

The following core components have been developed and integrated:

- Mood-aware recommendation engine
- TF-IDF and Cosine Similarity implementation
- Mood-to-Genre and Keyword Mapping
- MySQL database integration
- Django recommendation API
- React mood selection interface
- Top 10 mood-based movie recommendations
- TMDb poster integration
- Dynamic Movie Details page
- Additional TMDb movie information
- Similar movie recommendation API
- You Might Also Like recommendations

Current development is focused on:

- Completing frontend and backend integration
- Maintaining a consistent user interface across the application
- Completing remaining user functionality
- Testing recommendation quality
- System and integration testing
- Performance improvements
- Preparing the application for AWS deployment

---

## Future Development

Planned development includes:

- Complete user authentication integration
- Complete movie rating functionality
- Complete user profile functionality
- Complete admin functionality
- Improve recommendation accuracy
- Improve API performance
- Cache external movie information where appropriate
- Complete system testing
- Deploy the application using AWS cloud services
- Monitor application performance after deployment

---

## Academic Information

**Unit:** NIT6150 – Advanced Project  
**Institution:** Victoria University
