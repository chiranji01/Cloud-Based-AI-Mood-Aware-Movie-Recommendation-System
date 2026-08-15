# MoodFlix

### Cloud-Based AI Mood-Aware Movie Recommendation System

**MoodFlix** is a cloud-based movie recommendation system that provides personalised movie suggestions based on user preferences and their current mood.

This project is developed for the **NIT6150 Advanced Project** at **Victoria University**.

## Key Features

- User registration and login
- Browse and search movies
- View movie details
- Select current mood
- Mood-aware movie recommendations
- Rate movies and view ratings
- User profile management
- Admin movie and user management

## Recommendation System

MoodFlix uses **Content-Based Filtering** with:

- Mood-to-Genre and Keyword Mapping
- TF-IDF
- Cosine Similarity
- Movie rating information

The system uses the selected mood and movie features to generate and rank suitable movie recommendations.

More details about the recommendation engine are available in the `recommendation` folder.

## Technology Stack

| Component | Technology |
| --- | --- |
| Frontend | React.js |
| Backend | Python / Django |
| Database | MySQL |
| Recommendation Engine | Python, Pandas, Scikit-learn |
| Dataset | MovieLens |
| Cloud | Amazon Web Services (AWS) |
| Version Control | Git & GitHub |

## Dataset

MoodFlix uses the **MovieLens dataset** provided by GroupLens Research for movie, genre, rating, and tag data.

[MovieLens Dataset – GroupLens Research](https://grouplens.org/datasets/movielens/)

## Development Methodology

The project follows the **Agile Scrum** methodology with regular sprint planning, task allocation, development, testing, and progress reviews.

## System Architecture

MoodFlix consists of:

- **Frontend:** React.js
- **Backend:** Django
- **Database:** MySQL
- **Recommendation Engine:** Python and Scikit-learn
- **Cloud Platform:** AWS

## Project Team

| Team Member | Role |
| --- | --- |
| Chiranji Vinodya Ranaweera Jayalathge | Project Manager & AI Developer |
| Meghan Reddy Podduturi | Frontend Developer |
| Prapti Pokharel | Backend Developer & Cloud Engineer |
| Prashanth | Frontend Support & QA Tester |

## Project Status

**Current Stage:** Development and Integration

The team is currently developing and integrating the frontend, backend, database, and recommendation components. AWS deployment will follow after system integration and testing.

## Academic Information

**Unit:** NIT6150 – Advanced Project  
**Institution:** Victoria University  
**Client:** Dr. Ayesha Ashfaq
