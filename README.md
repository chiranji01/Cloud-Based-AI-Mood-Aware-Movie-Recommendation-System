# MoodFlix

## Cloud-Based AI Mood-Aware Movie Recommendation System

**MoodFlix** is a cloud-based movie recommendation system that provides personalised movie recommendations based on a user's current mood and movie content.

The system combines a React frontend, Django backend, MySQL database, MovieLens dataset, TMDb API, and a content-based recommendation engine to generate mood-aware movie suggestions.

The recommendation-engine/backend environment has also been deployed and tested using **Amazon EC2** and **Amazon RDS MySQL**.

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
- Cloud-based recommendation-engine deployment
- Cloud database integration using Amazon RDS

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

Together, mood similarity and genre relevance contribute **80% of the final recommendation score**.

Rating quality, popularity, and recency are also considered to improve the overall quality of the recommendations.

The system applies additional quality and relevance filters before returning the **Top 10 recommendations**.

Movies with insufficient rating information or low average ratings can be filtered before the final ranking.

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

The mood profiles help represent the emotional preference of the user in a format that can be compared with movie content.

---

## Recommendation Process

The main recommendation process is:

1. The user selects a mood.
2. The frontend sends the selected mood to the Django API.
3. The backend retrieves the mood profile from MySQL.
4. Movie genres and tags are used as content features.
5. TF-IDF converts movie features and the mood profile into numerical vectors.
6. Cosine Similarity calculates the similarity between the mood and each movie.
7. Genre relevance is calculated.
8. Rating quality, popularity, and recency are calculated.
9. The factors are combined into a final recommendation score.
10. Quality and relevance filters are applied.
11. The movies are ranked using their final recommendation scores.
12. The Top 10 ranked movies are returned to the React frontend.

---

## Recommendation Quality and Relevance

MoodFlix applies additional filtering and ranking techniques to improve recommendation quality.

### Genre Relevance

Genre matching considers both whether the movie contains genres associated with the selected mood and how strongly those genres represent the movie.

This prevents a movie from receiving an unnecessarily high genre score simply because one mood-related genre appears among several unrelated genres.

### Reliable Rating

Average movie rating is combined with rating-count information.

This reduces the influence of movies that have high average ratings but only a very small number of ratings.

### Popularity

Movie rating counts are used as a popularity signal.

Popularity receives a relatively small weight because the primary purpose of MoodFlix is to recommend movies based on mood rather than simply recommending the most popular movies.

### Recency

Movie release year is used to provide a small recency contribution to the final recommendation score.

Recency also receives a small weight so that older but highly relevant movies can still be recommended.

### Quality Filtering

The recommendation engine applies minimum rating-quality requirements before returning the final recommendations.

This helps prevent low-quality or insufficiently rated movies from dominating the recommendation results.

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

### Movie Details Flow

```text
Recommended Movie
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

The Movie Details page also includes a **You Might Also Like** recommendation feature.

This feature recommends up to **6 similar movies** based on the genres of the currently selected movie.

The process includes:

1. Retrieving the genres of the selected movie.
2. Comparing the selected movie with other movies in the database.
3. Calculating genre similarity.
4. Applying minimum rating and rating-count quality filters.
5. Ranking candidate movies by similarity and rating information.
6. Returning the Top 6 similar movies.
7. Retrieving poster images from TMDb.
8. Displaying the recommendations on the Movie Details page.

Users can select a similar movie to open its Movie Details page and receive another set of related movie recommendations.

### Jaccard Genre Similarity

The similar-movie feature uses **Jaccard Similarity** to compare the genre sets of two movies.

The calculation is based on:

```text
Jaccard Similarity =
Common Genres / Total Unique Genres
```

For example, movies that share several genres receive a higher similarity score than movies with very few genres in common.

The similar-movie recommendation feature also applies rating-quality requirements so that the results are not based only on genre similarity.

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
| Similar Movie Method | Jaccard Genre Similarity |
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

Movie genres and tags are used as content features by the recommendation engine.

Rating data is used to evaluate movie quality and popularity, while movie-link data is used to connect MovieLens movies with external services such as TMDb and IMDb.

[MovieLens Dataset – GroupLens Research](https://grouplens.org/datasets/movielens/)

---

## System Architecture

MoodFlix consists of the following main components:

### Frontend

**React.js** provides the user interface and communicates with the backend through API requests.

The frontend includes interfaces for:

- User authentication
- Movie browsing
- Movie searching
- Mood selection
- Mood recommendations
- Movie Details
- Similar movie recommendations
- Ratings
- User profile management

### Backend

**Django** provides the backend application and API endpoints used by the frontend.

The backend connects:

- React frontend
- MySQL database
- Recommendation engine
- MovieLens data
- TMDb API

### Database

**MySQL** stores application data including:

- Movies
- Ratings
- Tags
- Mood mappings
- Movie links
- Mood history
- Recommendation information
- Application-related data

A cloud copy of the project database has been deployed using **Amazon RDS MySQL** for AWS testing and recommendation-engine deployment.

### Recommendation Engine

The recommendation engine is developed using:

- Python
- Pandas
- NumPy
- Scikit-learn

It performs the mood-aware recommendation calculations using:

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

**Amazon Web Services (AWS)** is currently used to deploy and test the recommendation-engine/backend environment.

The current cloud implementation uses:

- **Amazon EC2** for the Django and recommendation-engine environment
- **Amazon RDS MySQL** for the cloud database
- AWS networking and security configuration for EC2-to-RDS connectivity
- Environment variables for database configuration

The recommendation engine has been successfully tested on EC2 while using project data stored in Amazon RDS.

Full frontend and complete production deployment remain future system-integration tasks.

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
  ├──────────────► MySQL Database / Amazon RDS
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
  ├── Rating Quality Filter
  └── Top 6 Similar Movies
```

---

## AWS Deployment

The MoodFlix recommendation-engine environment has been deployed and tested using **Amazon Web Services (AWS)**.

The current deployment focuses on the recommendation-engine/backend environment and cloud database.

### Amazon EC2

An **Amazon EC2** instance is used to host and run the Django backend environment and mood-aware recommendation engine.

The EC2 environment includes the required technologies and dependencies for the recommendation component, including:

- Python
- Django
- Pandas
- NumPy
- Scikit-learn
- MySQL client support
- Django REST Framework
- Django CORS Headers
- Git

The MoodFlix source code was cloned from the project's GitHub repository to the EC2 environment.

The recommendation engine can be executed directly on EC2 to generate mood-aware movie recommendations.

### Amazon RDS MySQL

An **Amazon RDS MySQL** instance is used as the cloud database for the deployed recommendation-engine environment.

A copy of the existing project MySQL database was migrated to Amazon RDS.

The cloud database contains project data and Django application tables, including:

- Movies
- Ratings
- Tags
- Movie tags
- Movie links
- Mood-to-Genre mappings
- Mood history
- Recommendation data
- Django application tables

The database migration was verified after import to ensure that the required project tables were available in RDS.

### EC2-to-RDS Integration

The Django backend running on EC2 has been successfully connected to the Amazon RDS MySQL database.

The cloud connection follows this structure:

```text
Amazon EC2
    │
    ▼
Django Backend
    │
    ▼
AWS Database Connection
    │
    ▼
Amazon RDS MySQL
    │
    ▼
MoodFlix Project Data
```

The RDS database is configured without public database access, while the EC2 environment is allowed to communicate with the database through the AWS network configuration.

### Environment Variable Configuration

Database credentials are not hardcoded directly into the Django source code.

Django reads the database configuration from environment variables:

```python
'NAME': os.getenv('DB_NAME', 'movie_recommendation_db'),
'USER': os.getenv('DB_USER', 'root'),
'PASSWORD': os.getenv('DB_PASSWORD', ''),
'HOST': os.getenv('DB_HOST', 'localhost'),
'PORT': os.getenv('DB_PORT', '3306'),
```

The AWS database configuration uses:

- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `DB_HOST`
- `DB_PORT`

This keeps the AWS database password separate from the project source code and prevents the password from being committed to GitHub.

The EC2 environment has also been configured so that the required database environment settings can be loaded again when reconnecting to the server.

### AWS Testing

The AWS recommendation environment has been successfully tested.

Django configuration was checked using:

```bash
python3 backend/manage.py check
```

The successful result was:

```text
System check identified no issues (0 silenced).
```

Django-to-RDS connectivity was also successfully tested from the EC2 environment.

The recommendation engine was then executed directly on EC2 using:

```bash
python3 test_recommendation.py
```

The engine successfully generated Top 10 mood-aware movie recommendations while running in the EC2 environment and using the RDS-hosted project data.

The cloud recommendation flow is:

```text
Selected Mood
      │
      ▼
Recommendation Engine
      │
      ▼
Amazon EC2
      │
      ▼
Django Backend
      │
      ▼
Amazon RDS MySQL
      │
      ▼
Movie / Rating / Mood Data
      │
      ▼
Recommendation Scoring
      │
      ▼
Top 10 Recommendations
```

The current AWS implementation demonstrates successful deployment and cloud testing of the **recommendation-engine/backend environment and database**.

Full frontend and complete production deployment remain future integration activities.

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
- Database integration
- System integration
- Cloud deployment
- Testing
- Progress evaluation
- Version control

**Git and GitHub** are used for source code management, collaboration, integration, and tracking development progress.

Development work is divided among team members according to their assigned project roles while shared components are integrated into the main project repository.

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

**Current Stage: System Integration, Cloud Deployment and Testing**

The following core components have been developed and integrated:

- Mood-aware recommendation engine
- Content-Based Filtering approach
- TF-IDF feature representation
- Cosine Similarity implementation
- Mood-to-Genre and Keyword Mapping
- Multi-factor recommendation scoring
- Genre relevance calculation
- Reliable rating calculation
- Popularity consideration
- Movie recency consideration
- Recommendation quality and relevance filtering
- MySQL database integration
- Django recommendation API
- React mood selection interface
- Top 10 mood-based movie recommendations
- TMDb poster integration
- Dynamic Movie Details page
- Additional TMDb movie information
- Similar movie recommendation API
- You Might Also Like recommendations
- Genre-based Jaccard similarity
- Similar-movie quality filtering
- Amazon EC2 recommendation-engine deployment
- Amazon RDS MySQL database deployment
- Project database migration to Amazon RDS
- EC2-to-RDS database integration
- Environment-variable-based database configuration
- Persistent EC2 database environment configuration
- Successful Django cloud configuration testing
- Successful Django-to-RDS connectivity testing
- Successful recommendation-engine testing on Amazon EC2

Current development is focused on:

- Completing frontend and backend integration
- Maintaining a consistent user interface across the application
- Completing remaining user functionality
- Testing recommendation quality
- System testing
- Integration testing
- API performance improvements
- Recommendation performance improvements
- Completing remaining AWS integration activities
- Preparing the complete application for final deployment and demonstration

---

## Current AWS Deployment Status

The recommendation-engine component has successfully progressed from local development to cloud testing.

### Completed

- Amazon EC2 instance configured
- MoodFlix project cloned to EC2
- Recommendation dependencies installed
- Django backend environment configured
- Amazon RDS MySQL instance configured
- Project database migrated to RDS
- Required database tables verified
- Django connected to RDS
- Database credentials separated from source code
- Environment configuration made persistent
- Django system check passed
- Recommendation engine successfully executed on EC2
- Cloud-based mood recommendations successfully generated

### Remaining

- Complete full frontend/backend cloud integration
- Deploy the frontend
- Configure the final production application environment
- Complete end-to-end cloud testing
- Perform final performance and security checks

Therefore, the project should not yet be described as **fully deployed in production**.

The accurate current status is:

> **The MoodFlix recommendation-engine/backend environment has been deployed and tested using Amazon EC2 and Amazon RDS. Full-system cloud deployment remains in progress.**

---

## Future Development

Planned development includes:

- Complete user authentication integration
- Complete movie rating functionality
- Complete user profile functionality
- Complete admin functionality
- Improve recommendation accuracy
- Improve API performance
- Cache TMDb movie information where appropriate
- Reduce unnecessary external API requests
- Complete system testing
- Complete integration testing
- Complete frontend cloud deployment
- Complete full-system AWS integration
- Configure production-ready application hosting
- Improve cloud security and configuration management
- Monitor application performance after full deployment
- Explore richer movie features for recommendation
- Explore semantic embeddings or other advanced recommendation techniques
- Improve recommendation personalisation using additional user information in future versions

---

## Academic Information

**Unit:** NIT6150 – Advanced Project  
**Institution:** Victoria University
