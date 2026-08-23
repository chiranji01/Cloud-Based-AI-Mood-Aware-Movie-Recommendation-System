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
| Mood Similarity | 55% |
| Genre Match | 15% |
| Reliable Rating | 5% |
| Popularity | 5% |
| Recency | 20% |

Mood similarity remains the main ranking factor, while genre relevance, rating quality, popularity, and recency improve the recommendation results.

The engine also prioritises newer movies and gradually expands the release-year range when there are not enough suitable recent recommendations.

More details about the recommendation engine are available in the `recommendation` folder.

## Movie Information and Posters

Movie information is based on the **MovieLens dataset**. MovieLens link data is used to map movies to external movie identifiers.

**TMDb (The Movie Database)** is used to retrieve movie poster images for the user interface.

## Technology Stack

| Component | Technology |
| --- | --- |
| Frontend | React.js |
| Backend | Python / Django |
| Database | MySQL |
| Recommendation Engine | Python, Pandas, Scikit-learn |
| Recommendation Method | Content-Based Filtering |
| Dataset | MovieLens |
| Movie Posters | TMDb API |
| Cloud Platform | Amazon Web Services (AWS) |
| Version Control | Git & GitHub |

## Dataset

MoodFlix uses the **MovieLens dataset** provided by GroupLens Research. The dataset provides movie, genre, rating, tag, and movie-link information used by the recommendation system.

[MovieLens Dataset – GroupLens Research](https://grouplens.org/datasets/movielens/)

## Development Methodology

The project follows the **Agile Scrum** methodology with regular sprint planning, task allocation, development, testing, integration, and progress reviews.

## System Architecture

MoodFlix consists of:

- **Frontend:** React.js user interface
- **Backend:** Django application and REST API
- **Database:** MySQL
- **Recommendation Engine:** Python, Pandas and Scikit-learn
- **External Movie Service:** TMDb API for movie posters
- **Cloud Platform:** AWS

The React frontend communicates with the Django backend, which connects to the MySQL database and recommendation engine to generate movie recommendations.

## Project Team

| Team Member | Role |
| --- | --- |
| Chiranji Vinodya Ranaweera Jayalathge | Project Manager & AI Developer |
| Meghan Reddy Podduturi | Frontend Developer |
| Prapti Pokharel | Backend Developer & Cloud Engineer |
| Prashanth | Frontend Support & QA Tester |

## Project Status

**Current Stage:** Development and Integration

The recommendation engine, database integration, and mood-based recommendation functionality are currently being developed and tested. Frontend and backend components are being integrated, with cloud deployment planned after system integration and testing.

## Academic Information

**Unit:** NIT6150 – Advanced Project  
**Institution:** Victoria University  
**Client:** Dr. Ayesha Ashfaq
