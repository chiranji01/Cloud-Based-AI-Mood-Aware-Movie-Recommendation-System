# MoodFlix

### Cloud-Based AI Mood-Aware Movie Recommendation System

**MoodFlix** is a cloud-based movie recommendation system that provides personalised movie suggestions based on a user's current mood and movie content.

This project is developed for the **NIT6150 Advanced Project** at **Victoria University**.

## Key Features

- User registration and login
- Browse and search movies
- View movie details and posters
- Select current mood
- Generate Top 10 mood-aware movie recommendations
- View similar movie recommendations
- Rate movies and view ratings
- User profile management
- Admin movie and user management

## Recommendation System

MoodFlix uses a **Content-Based Recommendation approach** to generate mood-aware movie recommendations.

The recommendation engine uses:

- Mood-to-Genre and Keyword Mapping
- Movie genres and tags
- TF-IDF feature representation
- Cosine Similarity
- Genre matching
- Movie rating quality
- Popularity based on rating count
- Movie recency

Mood profiles are stored in the MySQL database using genres and descriptive keywords. When a user selects a mood, the system converts the mood profile into a TF-IDF vector and compares it with movie feature vectors using cosine similarity.

The final recommendation score combines:

| Factor | Weight |
| --- | ---: |
| Mood Similarity | 60% |
| Genre Match | 20% |
| Reliable Rating | 10% |
| Popularity | 5% |
| Recency | 5% |

Mood similarity and genre relevance are the main ranking factors, ensuring that recommendations remain strongly related to the user's selected mood. Rating quality, popularity, and recency are also considered to improve the overall recommendation quality.

The recommendation engine also applies quality filters to remove movies with very low ratings or insufficient rating data.

More details about the recommendation engine are available in the `recommendation` folder.

## Mood-Aware Recommendation Process

The mood-aware recommendation process works as follows:

1. The user selects a mood such as Happy, Sad, Relaxed, Excited, Romantic, or Stressed.
2. The selected mood is mapped to related genres and descriptive keywords stored in the MySQL database.
3. Movie genres and tags are combined to create movie content features.
4. TF-IDF converts the movie features and mood profile into numerical vectors.
5. Cosine Similarity measures how closely each movie matches the selected mood.
6. Genre relevance is calculated based on how well the movie genres match the mood genres.
7. Rating quality, popularity, and recency are also calculated.
8. These factors are combined into a final recommendation score.
9. Quality and relevance filters are applied.
10. The Top 10 highest-ranked movies are returned to the user.

This approach allows MoodFlix to provide recommendations based on both the user's mood and the content of each movie.

## Movie Information and Posters

Core movie information is based on the **MovieLens dataset**. MovieLens link data is used to map movies to external movie identifiers.

**TMDb (The Movie Database)** is used to retrieve additional movie information for the user interface, including:

- Movie posters
- Movie overview
- Runtime
- Release date
- Director
- Writers
- Cast
- Certification
- IMDb link

When a user selects a recommended movie, the MovieLens movie ID is passed to the Django backend. The backend retrieves the movie information from the database and uses the MovieLens link information to request additional details from TMDb.

## Similar Movie Recommendations

The Movie Details page includes a **"You might also like"** feature that provides similar movie recommendations.

The backend compares the genres of the selected movie with other movies in the database.

The similar movie recommendation process includes:

- Extracting genres from the selected movie
- Comparing the selected movie with other movies
- Calculating genre similarity
- Applying minimum rating quality requirements
- Applying minimum rating-count requirements
- Ranking movies by genre similarity and rating information
- Returning the Top 6 similar movies
- Retrieving movie posters from TMDb

Genre similarity is calculated using the common genres between the selected movie and candidate movies compared with their total unique genres.

Users can select one of the similar movies to open its Movie Details page. The system then loads the selected movie information and generates a new set of similar movie recommendations.

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

## Dataset

MoodFlix uses the **MovieLens dataset** provided by GroupLens Research.

The dataset provides information used by the recommendation system, including:

- Movies
- Genres
- Ratings
- Tags
- Movie links

Movie genres and tags are used by the recommendation engine to understand movie content.

Rating information is used to calculate movie quality and popularity.

Movie link information is used to connect MovieLens movies with external movie services such as TMDb and IMDb.

[MovieLens Dataset – GroupLens Research](https://grouplens.org/datasets/movielens/)

## Development Methodology

The project follows the **Agile Scrum** methodology.

Development is organised into regular development and evaluation cycles that include:

- Sprint planning
- Task allocation
- System development
- Frontend development
- Backend development
- Recommendation engine development
- Integration
- Testing
- Progress reviews
- GitHub version control

Git and GitHub are used by the project team for source code management, collaboration, integration, and tracking development progress.

## System Architecture

MoodFlix consists of the following main components:

- **Frontend:** React.js user interface
- **Backend:** Django application and REST API
- **Database:** MySQL
- **Recommendation Engine:** Python, Pandas and Scikit-learn
- **Dataset:** MovieLens
- **External Movie Service:** TMDb API
- **Cloud Platform:** Amazon Web Services (AWS)

The React frontend communicates with the Django backend through API requests.

The Django backend connects to the MySQL database to retrieve movie, rating, tag, mood, and movie-link information.

The recommendation engine processes the movie information and generates mood-aware movie recommendations.

TMDb is used by the backend to retrieve additional movie information and poster images for the user interface.

The completed system is planned to be deployed using AWS cloud services.

## System Flow

The main MoodFlix recommendation flow is:

User  
↓  
React Frontend  
↓  
Mood Selection  
↓  
Django REST API  
↓  
Mood-Aware Recommendation Engine  
↓  
MySQL Database / MovieLens Data  
↓  
TF-IDF + Cosine Similarity  
↓  
Final Recommendation Score  
↓  
Top 10 Movie Recommendations  
↓  
React User Interface  
↓  
Movie Details  
↓  
Similar Movie Recommendations

## Project Structure

The main project folders include:

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
