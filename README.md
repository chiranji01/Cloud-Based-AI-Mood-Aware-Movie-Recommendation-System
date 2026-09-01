# MoodFlix

## Cloud-Based AI Mood-Aware Movie Recommendation System

**MoodFlix** is a cloud-based movie recommendation system that provides personalised movie recommendations based on a user's current mood and movie content.

The system combines a **React.js frontend, Django backend, MySQL database, MovieLens dataset, TMDb API, and a content-based recommendation engine** to provide mood-aware movie recommendations and an interactive movie discovery experience.

The project is currently in the **system integration, cloud integration, and testing stage**. As part of the cloud implementation, the Django backend and recommendation-engine environment have been deployed and tested using **Amazon EC2** with an **Amazon RDS MySQL** cloud database.

This project is developed as part of the **NIT6150 – Advanced Project** at **Victoria University**.

---

## Key Features

- User registration and login
- Browse movies
- Search movies
- View detailed movie information
- Select a current mood
- Generate Top 10 mood-aware movie recommendations
- View movie posters and additional movie information
- View similar movie recommendations
- Rate movies and view ratings
- User profile management
- Admin movie and user management
- Cloud-based backend and recommendation-engine testing
- Cloud database integration using Amazon RDS

---

## Mood-Aware Recommendation System

MoodFlix uses a **Content-Based Filtering** approach to generate movie recommendations based on the user's selected mood.

The recommendation engine uses:

- Mood-to-Genre and Keyword Mapping
- Movie genres and tags
- TF-IDF feature representation
- Cosine Similarity
- Genre relevance
- Movie rating quality
- Popularity based on rating count
- Movie recency

Mood profiles are stored in the MySQL database using associated genres and descriptive keywords.

When a user selects a mood, the system creates a mood profile using its associated genres and keywords.

Movie genres and tags are combined to create movie content features. **TF-IDF** converts the movie features and selected mood profile into numerical feature vectors.

**Cosine Similarity** is then used to measure how closely each movie matches the selected mood.

Additional ranking factors are applied to improve the quality and relevance of the final recommendations.

---

## Recommendation Score

The final recommendation score combines several factors:

| Factor | Weight |
| --- | ---: |
| Mood Similarity | 60% |
| Genre Match | 20% |
| Reliable Rating | 10% |
| Popularity | 5% |
| Recency | 5% |

Mood similarity and genre relevance are given the highest importance because the main purpose of MoodFlix is to recommend movies that are relevant to the user's current mood.

Together, **Mood Similarity and Genre Match contribute 80% of the final recommendation score**.

Rating quality, popularity, and recency provide additional signals to improve the overall quality of the recommendations.

The system also applies quality and relevance filters before returning the final **Top 10 recommendations**.

---

## Recommendation Quality and Relevance

MoodFlix applies additional calculations and filtering to improve recommendation quality.

### Genre Relevance

Genre matching considers both:

- Whether a movie contains genres associated with the selected mood
- How strongly those genres represent the movie

This prevents a movie from receiving an unnecessarily high genre score simply because one mood-related genre appears among several unrelated genres.

### Reliable Rating

Movie quality is considered using both:

- Average rating
- Number of ratings

This reduces the influence of movies that have a high average rating based on only a very small number of user ratings.

### Popularity

The number of ratings received by a movie is used as a popularity signal.

Popularity receives a relatively small weight because MoodFlix focuses primarily on mood relevance rather than simply recommending the most popular movies.

### Recency

Movie release year is used to provide a small recency contribution.

Recency has a small weight so that older but highly relevant and highly rated movies can still appear in the recommendations.

### Quality Filtering

The recommendation engine applies minimum rating and rating-count requirements before returning the final recommendations.

Movies with insufficient rating information or low average ratings can therefore be removed before final ranking.

---

## Supported Moods

MoodFlix currently supports six mood categories:

- 😀 Happy
- 😢 Sad
- 😌 Relaxed
- 🤩 Excited
- 💗 Romantic
- 😰 Stressed

Each mood is mapped to relevant movie genres and descriptive keywords.

These mood profiles are used by the recommendation engine to represent the user's selected emotional preference and compare it with movie content.

---

## Recommendation Process

The main mood-aware recommendation process is:

1. The user selects a mood.
2. The React frontend sends the selected mood to the Django API.
3. The Django backend retrieves the mood profile from MySQL.
4. Movie genres and tags are retrieved as movie content features.
5. The selected mood's genres and keywords are combined into a mood profile.
6. TF-IDF converts the movie features and mood profile into numerical vectors.
7. Cosine Similarity measures the similarity between the selected mood and each movie.
8. Genre relevance is calculated.
9. Reliable rating, popularity, and recency are calculated.
10. The factors are combined into a final recommendation score.
11. Quality and relevance filters are applied.
12. Candidate movies are ranked by their final recommendation score.
13. The Top 10 recommendations are returned to the React frontend.

---

## Movie Details

Users can select a movie from the recommendation results to open its **Movie Details** page.

Core movie information is based on the **MovieLens dataset**, while MovieLens link data is used to connect movies with external movie identifiers.

The Django backend uses the **TMDb API** to retrieve additional movie information, including:

- Movie poster
- Overview
- Runtime
- Release date
- Director
- Writers
- Cast
- Certification
- IMDb link

This allows MoodFlix to combine MovieLens recommendation data with richer movie information for the user interface.

### Movie Details Flow

```text
Selected Movie
      │
      ▼
MovieLens Movie ID
      │
      ▼
Django Movie Details API
      │
      ├──────────────► MySQL Database
      │
      ├──────────────► MovieLens Links
      │
      ▼
TMDb API
      │
      ▼
Additional Movie Information
      │
      ▼
React Movie Details Page
```

---

## Similar Movie Recommendations

The Movie Details page includes a **You Might Also Like** recommendation feature.

This feature recommends up to **6 similar movies** based primarily on the genres of the currently selected movie.

The similar-movie recommendation process includes:

1. Retrieving the genres of the selected movie.
2. Comparing the selected movie with other movies in the database.
3. Calculating genre similarity.
4. Applying minimum average-rating requirements.
5. Applying minimum rating-count requirements.
6. Ranking candidate movies using similarity and rating information.
7. Selecting the Top 6 similar movies.
8. Retrieving poster images from TMDb.
9. Returning the recommendations to the Movie Details page.

Users can select a similar movie to open its Movie Details page and receive another set of related recommendations.

### Jaccard Genre Similarity

The similar-movie feature uses **Jaccard Similarity** to compare the genre sets of movies.

The calculation is:

```text
Jaccard Similarity =
Number of Common Genres / Total Number of Unique Genres
```

Movies that share more genres with the selected movie receive a higher similarity score.

Rating and rating-count quality filters are also applied so that recommendations are not based only on genre similarity.

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
| Mood Similarity Method | Cosine Similarity |
| Similar Movie Method | Jaccard Genre Similarity |
| Dataset | MovieLens |
| External Movie Data | TMDb API |
| Cloud Platform | Amazon Web Services (AWS) |
| Cloud Compute | Amazon EC2 |
| Cloud Database | Amazon RDS MySQL |
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

Rating data is used to evaluate movie quality and popularity.

Movie-link data is used to connect MovieLens movies with external services such as **TMDb and IMDb**.

[MovieLens Dataset – GroupLens Research](https://grouplens.org/datasets/movielens/)

---

## System Architecture

MoodFlix consists of several connected components.

### Frontend

**React.js** provides the user interface and communicates with the Django backend through API requests.

The frontend includes interfaces for:

- Registration and login
- Home/dashboard
- Movie browsing
- Movie searching
- Mood selection
- Mood recommendations
- Movie Details
- Similar movie recommendations
- Ratings
- User profile management
- Administration functionality

### Backend

**Django** provides the backend application and API endpoints used by the frontend.

The backend connects the:

- React frontend
- MySQL database
- Recommendation engine
- MovieLens data
- TMDb API

### Database

**MySQL** is used as the main relational database technology.

The database stores application information including:

- Movies
- Ratings
- Tags
- Movie-tag relationships
- Mood-to-Genre mappings
- Mood history
- Movie links
- Recommendation information
- User and application-related data

For cloud integration and testing, a copy of the project MySQL database has been migrated to **Amazon RDS MySQL**.

### Recommendation Engine

The mood-aware recommendation engine is developed using:

- Python
- Pandas
- NumPy
- Scikit-learn

The engine performs recommendation calculations using:

- TF-IDF
- Cosine Similarity
- Genre relevance
- Reliable rating
- Popularity
- Recency

### External Movie Service

The **TMDb API** provides additional movie metadata and poster images.

MovieLens link information is used to connect MovieLens movies with external movie identifiers.

### Cloud Platform

**Amazon Web Services (AWS)** is used for cloud integration and deployment testing.

The current AWS implementation includes:

- Amazon EC2
- Amazon RDS MySQL
- EC2-to-RDS database connectivity
- Cloud-based Django environment
- Cloud-based recommendation-engine testing

The remaining cloud work includes complete frontend deployment and full end-to-end system deployment.

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
  │
  ├──────────────► TMDb API
  │
  ▼
Mood-Aware Recommendation Engine
  │
  ├── TF-IDF
  ├── Cosine Similarity
  ├── Genre Matching
  ├── Reliable Rating
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
You Might Also Like
  │
  ├── Genre Comparison
  ├── Jaccard Similarity
  ├── Rating Quality Filters
  └── Top 6 Similar Movies
```

---

## AWS Cloud Integration

MoodFlix uses **Amazon Web Services (AWS)** for cloud deployment and testing.

The current cloud implementation covers the **Django backend, recommendation-engine environment, and MySQL database**.

### Amazon EC2

An **Amazon EC2** instance has been configured to provide a cloud environment for the Django backend and recommendation engine.

The EC2 environment includes the required application and recommendation dependencies, including:

- Python
- Django
- Pandas
- NumPy
- Scikit-learn
- Django REST Framework
- Django CORS Headers
- MySQL client support
- Git

The MoodFlix project source code is available on the EC2 environment through the team's GitHub repository.

The recommendation engine has been successfully executed in the EC2 environment.

### Amazon RDS MySQL

**Amazon RDS MySQL** is being used as the cloud database.

A copy of the project's MySQL database has been migrated to Amazon RDS.

The RDS database contains the required project and Django application tables, including data related to:

- Movies
- Ratings
- Tags
- Movie links
- Mood mappings
- Mood history
- Recommendations
- Django application data

The database migration was verified after import.

### EC2-to-RDS Integration

The Django backend running in the EC2 environment has been successfully connected to the Amazon RDS MySQL database.

The cloud database flow is:

```text
Amazon EC2
     │
     ▼
Django Backend
     │
     ▼
Amazon RDS MySQL
     │
     ▼
MoodFlix Project Data
```

The RDS database is configured without public database access.

The EC2 environment communicates with the RDS database using the AWS network and security configuration.

### Database Configuration

The Django backend uses environment variables for AWS database configuration rather than storing the cloud database password directly in the project source code.

The configuration uses:

```text
DB_NAME
DB_USER
DB_PASSWORD
DB_HOST
DB_PORT
```

This allows sensitive database credentials to remain separate from the GitHub source code.

### Cloud Testing

The AWS environment has been successfully tested.

Django system configuration was verified using:

```bash
python3 backend/manage.py check
```

The configuration check completed successfully without Django system issues.

Database connectivity between the Django application on EC2 and Amazon RDS was also tested successfully.

The mood-aware recommendation engine was then executed directly in the EC2 environment.

It successfully generated Top 10 mood recommendations while using project data stored in Amazon RDS.

The tested cloud recommendation flow is:

```text
Selected Mood
      │
      ▼
Recommendation Engine
      │
      ▼
Django Environment on EC2
      │
      ▼
Amazon RDS MySQL
      │
      ▼
Movie / Rating / Mood Data
      │
      ▼
Recommendation Ranking
      │
      ▼
Top 10 Recommendations
```

This demonstrates that the backend/recommendation component can operate in the AWS environment with a cloud-hosted database.

The **complete MoodFlix system is not yet considered fully deployed**, as frontend deployment and complete end-to-end cloud integration are still in progress.

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
│   ├── __init__.py
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

- Sprint planning
- Task allocation
- Frontend development
- Backend development
- Recommendation engine development
- Database development
- Database integration
- API development
- System integration
- Cloud integration
- Testing
- Progress evaluation
- Version control

**Git and GitHub** are used for:

- Source code management
- Team collaboration
- Branch management
- Code integration
- Development tracking
- Version control

Team members work on their assigned components while the completed components are progressively integrated into the main MoodFlix system.

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

The project has progressed from individual component development toward integration and cloud testing.

### Developed and Integrated Components

The following major components have been developed or integrated:

- React frontend interfaces
- Django backend
- Django REST API integration
- MySQL database
- MovieLens dataset integration
- Mood-to-Genre and Keyword Mapping
- Content-Based Filtering recommendation engine
- TF-IDF feature representation
- Cosine Similarity
- Multi-factor recommendation scoring
- Genre relevance calculation
- Reliable rating calculation
- Popularity consideration
- Movie recency consideration
- Recommendation quality filtering
- Recommendation relevance filtering
- React mood selection interface
- Top 10 mood-aware recommendations
- TMDb poster integration
- Dynamic Movie Details page
- Additional TMDb movie information
- Similar movie recommendation API
- Jaccard genre similarity
- You Might Also Like recommendations
- Similar-movie quality filtering
- Shared frontend interface development
- Amazon EC2 backend/recommendation environment
- Amazon RDS MySQL cloud database
- Database migration to Amazon RDS
- EC2-to-RDS database integration
- Environment-variable-based cloud database configuration
- Successful Django cloud configuration testing
- Successful RDS connectivity testing
- Successful recommendation-engine testing on Amazon EC2

### Current Development

Current development is focused on:

- Completing remaining frontend and backend integration
- Completing user-related functionality
- Maintaining a consistent user interface
- Completing rating functionality
- Completing profile functionality
- Completing administration functionality
- Recommendation quality testing
- System testing
- Integration testing
- API performance improvements
- Recommendation performance improvements
- Completing frontend cloud deployment
- Completing full end-to-end AWS integration
- Preparing the complete application for final demonstration

---

## Current Cloud Deployment Status

The MoodFlix project has begun its AWS cloud deployment and testing stage.

### Completed Cloud Work

- Amazon EC2 environment configured
- MoodFlix project available on EC2
- Required backend and recommendation dependencies installed
- Django environment configured
- Amazon RDS MySQL database configured
- Project database migrated to RDS
- Required cloud database tables verified
- EC2-to-RDS database connectivity configured
- Django successfully connected to RDS
- Cloud database credentials separated from source code
- Django system configuration successfully checked
- Recommendation engine successfully executed on EC2
- Mood-based recommendations successfully generated using the RDS-hosted database

### Remaining Cloud Work

- Complete frontend cloud deployment
- Complete full frontend-to-backend cloud integration
- Complete end-to-end system deployment
- Configure the final production environment
- Perform complete cloud integration testing
- Perform final security testing
- Perform final performance testing

Therefore, the project is currently considered **partially deployed and undergoing cloud integration**, rather than fully deployed in production.

---

## Future Development

Planned development includes:

- Complete remaining user authentication integration
- Complete movie rating functionality
- Complete user profile functionality
- Complete admin functionality
- Improve recommendation accuracy
- Continue recommendation quality evaluation
- Improve backend API performance
- Improve recommendation-engine performance
- Cache TMDb movie information where appropriate
- Reduce unnecessary external API requests
- Complete system testing
- Complete integration testing
- Complete frontend cloud deployment
- Complete full-system AWS integration
- Configure the final production environment
- Improve cloud security and configuration management
- Perform final performance testing
- Monitor application performance after deployment
- Explore richer movie content features
- Explore semantic embeddings or other advanced recommendation approaches in future versions
- Explore additional personalisation techniques in future versions

---

## Academic Information

**Unit:** NIT6150 – Advanced Project  
**Institution:** Victoria University
