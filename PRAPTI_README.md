# Cloud-Based AI Mood-Aware Movie Recommendation System

## 📌 Project Overview

The **Cloud-Based AI Mood-Aware Movie Recommendation System** is a web-based movie recommendation application that provides personalized movie recommendations based on the user's mood and available rating information.

The system combines a React frontend, Django backend, MySQL database, recommendation logic, and cloud deployment on AWS.

The application allows users to register and log in, browse and search for movies, view movie details, provide ratings, select their mood, and receive movie recommendations.

The project was developed collaboratively. The user interface and visual design were developed by other team members, while the functional implementation of key features, including **Login, Registration, the complete Rating System, database integration, and full AWS deployment**, was implemented as part of my contribution.

---

# 🎯 Project Objectives

The main objectives of the project are:

* To develop a web-based movie recommendation system.
* To provide mood-aware movie recommendations.
* To allow users to create accounts and securely log in.
* To allow users to rate movies.
* To dynamically store and retrieve movie ratings.
* To integrate existing movie and rating datasets.
* To use rating information as part of the recommendation process.
* To retrieve movie poster information using the TMDB API.
* To deploy the complete application using AWS cloud services.
* To provide a functional cloud-based application accessible through the internet.

---

# ✨ Main Features

## 👤 User Registration

Users can create an account through the registration page.

The registration functionality:

* Accepts user information.
* Sends registration data to the Django backend.
* Creates the user in the database.
* Allows the newly registered user to log in.

---

## 🔐 User Login

Registered users can log in using their credentials.

The login functionality:

* Accepts user credentials from the React frontend.
* Sends the information to the Django backend.
* Validates the credentials.
* Connects the authenticated user with the application's user-specific functionality.

---

## 🎬 Movie Browsing

Users can browse the available movie collection.

The application retrieves movie information dynamically from the Django backend rather than relying entirely on hardcoded frontend data.

---

## 🔎 Movie Search

Users can search for movies by title.

The search functionality:

* Sends the search request from React to Django.
* Retrieves matching movies from the database.
* Displays the search results dynamically.
* Displays available movie poster information.

---

## 🎞️ Movie Details

Users can select a movie and view its details.

Movie information can include:

* Movie title
* Genres
* Rating information
* Movie poster
* Similar/recommended movies

---

# ⭐ Rating System

The **Rating System was one of my main contributions to the project.**

The original rating interface contained hardcoded functionality. I converted the existing design into a **fully functional dynamic rating system** connected to the Django backend and MySQL database.

## Rating Functionality

The rating system allows authenticated users to:

* Select a movie.
* Provide a rating.
* Submit the rating.
* Store the rating in the database.
* Associate the rating with the correct user.
* Associate the rating with the correct movie.
* Retrieve rating information dynamically.

## Rating Backend

The Django backend handles:

* Rating submission.
* Rating storage.
* User-rating relationships.
* Movie-rating relationships.
* Rating retrieval.
* Database persistence.
* Integration with recommendation functionality.

## Dataset Ratings

The system also contains existing ratings imported from the MovieLens dataset.

The `is_dataset_rating` field is used to distinguish between:

* Existing MovieLens dataset ratings.
* New ratings submitted by application users.

This allows the system to maintain both historical dataset ratings and new user-generated ratings.

---

# 😊 Mood-Based Recommendations

Users can select their current mood and receive movie recommendations.

The system supports mood-based recommendation functionality using moods such as:

* Happy
* Sad
* Excited
* Relaxed
* Scared

The selected mood is sent to the backend, where recommendation logic is used to generate appropriate movie suggestions.

---

# 🤖 Recommendation System

The recommendation system uses movie and rating information to generate recommendations.

The system can use:

* Movie information
* Genres
* Existing dataset ratings
* User ratings
* Selected mood
* Rating information

The goal is to provide more personalized movie recommendations based on the user's preferences and mood.

---

# 🖼️ TMDB Movie Posters

The application integrates the **TMDB API** to retrieve movie poster images.

When a movie does not already have a stored poster URL:

1. The backend obtains the movie's TMDB ID.
2. Django sends a request to TMDB.
3. TMDB returns the movie poster information.
4. The poster URL is generated.
5. The URL is stored in the database.
6. The frontend displays the poster.

Poster URLs are cached in the database so that already retrieved posters do not need to be requested repeatedly.

---

# 🏗️ System Architecture

The application uses a cloud-based architecture.

```text
                         ┌──────────────────────┐
                         │      User Browser    │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │      Elastic IP      │
                         │   32.236.217.28      │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │        Nginx         │
                         │      Port 80         │
                         └──────────┬───────────┘
                                    │
                       ┌────────────┴────────────┐
                       │                         │
                       ▼                         ▼
              ┌─────────────────┐       ┌─────────────────┐
              │ React Frontend   │       │ Django Backend  │
              │     Vite        │       │    Port 8000    │
              └─────────────────┘       └────────┬────────┘
                                                  │
                                    ┌─────────────┴─────────────┐
                                    │                           │
                                    ▼                           ▼
                           ┌─────────────────┐       ┌─────────────────┐
                           │    AWS RDS      │       │    TMDB API     │
                           │     MySQL       │       │ Movie Posters   │
                           └─────────────────┘       └─────────────────┘
```

---

# ☁️ AWS Deployment

The complete application was deployed to AWS.

## AWS Services Used

### Amazon EC2

EC2 is used to host:

* Django backend
* React production application
* Nginx web server

---

### Amazon RDS

Amazon RDS MySQL is used as the production database.

The database stores information such as:

* Users
* Movies
* Ratings
* Movie links
* Recommendation-related data
* Django application data

---

### Elastic IP

An Elastic IP was associated with the EC2 instance to provide a stable public IP address for the deployed application.

Application access:

```text
http://32.236.217.28
```

---

### Nginx

Nginx is configured as the web server and reverse proxy.

Nginx:

* Serves the React production build.
* Handles HTTP requests.
* Routes `/api/` requests to Django.
* Allows the frontend and backend to operate through the same public address.

---

# 🔗 API Architecture

The React frontend communicates with the Django backend through API endpoints.

Examples include:

```text
/api/movies/
/api/movies/<movie_id>/
/api/recommendations/
/api/ratings/
/api/register/
/api/login/
```

The production frontend uses:

```text
/api
```

as the API base path.

This allows Nginx to route API requests to the Django backend.

---

# 🗄️ Database

The project uses **MySQL** as the relational database.

The production database is hosted using **Amazon RDS**.

Important application data includes:

```text
Users
Movies
Ratings
Movie Links
Movie Tags
Mood Genre Mappings
Django Authentication Data
```

---

# 📊 Dataset

The system uses movie and rating information from the MovieLens dataset.

The dataset provides:

* Movie information
* Movie genres
* Historical ratings

The existing dataset ratings are imported into the application's database.

Dataset ratings are identified using:

```text
is_dataset_rating = 1
```

while new application-generated ratings can be distinguished from the imported dataset ratings.

---

# 🛠️ Technologies Used

## Frontend

* React
* Vite
* JavaScript
* HTML
* CSS

## Backend

* Python
* Django
* Django REST/API functionality

## Database

* MySQL
* Amazon RDS

## Cloud & Deployment

* Amazon EC2
* Amazon RDS
* Elastic IP
* Nginx
* AWS Security Groups

## External API

* TMDB API

## Dataset

* MovieLens Dataset

## Version Control

* Git
* GitHub

---

# 📁 Project Structure

A simplified project structure is:

```text
Cloud-Based-AI-Mood-Aware-Movie-Recommendation-System/
│
├── backend/
│   ├── manage.py
│   ├── settings.py
│   ├── urls.py
│   ├── requirements.txt
│   ├── .env
│   │
│   ├── moviesapp/
│   ├── recommendation_api/
│   └── ...
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.production
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   │
│   └── dist/
│
└── README.md
```

---

# 👩‍💻 My Contribution

The project was developed collaboratively, with the UI and visual design being developed by other team members.

My main responsibility was to take the existing designs and make the important functionality **fully operational and connected to the backend and database**.

## 1. Login and Registration

I implemented the functional Login and Registration flow.

This included:

* Connecting the React forms to Django.
* Implementing backend API communication.
* Creating users in the database.
* Validating login credentials.
* Connecting authenticated users with application functionality.
* Testing user records in the production database.

---

## 2. Complete Rating System

The rating system was one of my primary contributions.

The initial rating interface was largely hardcoded.

I converted it into a fully functional system by:

* Implementing the frontend rating logic.
* Connecting the rating interface to Django APIs.
* Implementing backend rating logic.
* Storing ratings in MySQL.
* Associating ratings with users and movies.
* Retrieving rating information dynamically.
* Integrating existing MovieLens ratings.
* Distinguishing dataset ratings from new user ratings.
* Connecting rating information with recommendation functionality.

---

## 3. Database Integration

I worked on the database integration required for the functional features.

This included:

* Creating/configuring the required databases.
* Running Django migrations.
* Importing movie data.
* Importing rating data.
* Creating user records.
* Connecting Django to MySQL.
* Migrating the application database to AWS RDS.
* Verifying database records using MySQL.

---

## 4. Full AWS Deployment

I also handled the **full deployment of the application to AWS**.

This included:

* Creating/configuring the EC2 instance.
* Deploying the Django backend.
* Configuring the Python virtual environment.
* Installing backend dependencies.
* Creating/configuring the RDS MySQL database.
* Connecting EC2 to RDS.
* Configuring security groups.
* Configuring HTTP access.
* Installing Nginx.
* Configuring Nginx as a reverse proxy.
* Building the React frontend for production.
* Serving the React production build through Nginx.
* Configuring the Elastic IP.
* Connecting the frontend, backend, and database.
* Testing the deployed APIs.
* Testing the complete application through the public IP.

---

# 🔒 Security Considerations

The project includes several security-related configurations.

* Database credentials are stored separately from application source code.
* API keys are stored using environment variables.
* The TMDB API key is not hardcoded into the frontend.
* Database access is handled through AWS RDS.
* EC2 Security Groups control network access.
* The application separates frontend, backend, and database responsibilities.
* Sensitive configuration files such as `.env` are excluded from version control.

---

# ⚙️ Local Development Setup

## Backend

Navigate to the backend directory:

```bash
cd backend
```

Create and activate a virtual environment:

```bash
python -m venv venv
```

Linux/macOS:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run migrations:

```bash
python manage.py migrate
```

Start the Django development server:

```bash
python manage.py runserver
```

The backend will normally be available at:

```text
http://127.0.0.1:8000
```

---

# 💻 Frontend Setup

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

---

# 🏭 Production Build

The React frontend can be built using:

```bash
npm run build
```

The production files are generated in:

```text
frontend/dist/
```

Nginx serves these production files in the AWS deployment.

---

# 🌐 Production Application

The deployed application is accessible at:

```text
http://32.236.217.28
```

The public application provides access to the deployed React frontend and Django backend.

---

# 🧪 Testing Performed

The deployed system was tested across multiple components.

### Authentication Testing

* User registration tested.
* User login tested.
* User records verified in MySQL.

### Rating Testing

* Rating submission tested.
* Rating data verified in the database.
* User and movie relationships verified.
* Dataset ratings verified.
* New user rating functionality tested.

### API Testing

Examples:

```bash
curl http://127.0.0.1/api/movies/
```

Search testing:

```bash
curl "http://127.0.0.1/api/movies/?search=Toy"
```

Production API testing:

```bash
curl "http://32.236.217.28/api/movies/"
```

### TMDB Testing

Movie poster retrieval was tested through Django and the production API.

For example, movie poster retrieval for Toy Story and Toy Story 2 was successfully verified.

### Deployment Testing

The following were verified:

* EC2 server
* Django backend
* RDS MySQL connectivity
* Nginx configuration
* React production build
* Public HTTP access
* API routing
* Database connectivity
* TMDB poster retrieval

---

# 📋 Functional Requirements

The system provides the following functional requirements:

1. Users can register.
2. Registered users can log in.
3. The system authenticates users.
4. Users can browse movies.
5. Users can search for movies.
6. Users can view movie details.
7. Users can select their mood.
8. The system can generate mood-aware recommendations.
9. Users can rate movies.
10. Ratings are stored in the database.
11. Ratings are associated with users and movies.
12. Existing MovieLens ratings can be stored and used.
13. Dataset ratings can be distinguished from user ratings.
14. The system can retrieve movie ratings.
15. Movie posters can be retrieved from TMDB.
16. Poster URLs can be cached in the database.
17. The frontend communicates with the Django backend through APIs.
18. The application can operate as a cloud-deployed web application.

---

# 📋 Non-Functional Requirements

## Performance

The system should provide reasonable response times for normal movie browsing, searching, authentication, and rating operations.

## Security

User and database information should be protected from unauthorized access.

## Reliability

The system should reliably perform core functions such as registration, login, movie search, rating submission, and recommendations.

## Scalability

The cloud architecture allows the application to be expanded to support additional users, movies, and ratings.

## Maintainability

The application is separated into frontend, backend, and database components, making it easier to maintain and update.

## Usability

The system should provide an understandable interface for browsing, searching, rating, and discovering movies.

## Availability

The deployed application can be accessed publicly while the AWS infrastructure is running.

## Extensibility

The system can be extended with additional moods, recommendation techniques, movies, and user features.

---

# 🚀 Deployment Architecture Summary

```text
Frontend:
React + Vite
        │
        ▼
Nginx
        │
        ▼
AWS EC2
        │
        ├──────────────► Django Backend
        │                     │
        │                     ▼
        │                 AWS RDS
        │                  MySQL
        │
        └──────────────► TMDB API
                         Movie Posters
```

---

# 🎓 Project Outcome

The project successfully demonstrates a cloud-based movie recommendation platform that integrates:

* User authentication
* Movie browsing
* Movie searching
* Movie ratings
* Dataset ratings
* Mood-based recommendations
* TMDB movie posters
* React frontend
* Django backend
* MySQL database
* AWS EC2
* AWS RDS
* Nginx
* Elastic IP

The application has been deployed and tested as a working cloud-based system.

---

# 👥 Team Contribution

The project was completed collaboratively.

### UI / Design

The visual design and user interface were developed by other team members.

### Functional Implementation

My contribution focused on transforming the existing designs into working application functionality, particularly:

* Login
* Registration
* Complete Rating System
* Rating backend
* Rating database integration
* Dataset/user rating handling
* API integration
* AWS database integration
* Full AWS deployment
* Production configuration
* Deployment testing

---

# 📌 Conclusion

The **Cloud-Based AI Mood-Aware Movie Recommendation System** combines mood-based recommendation techniques, user ratings, movie data, and cloud infrastructure into a single web application.

The final system is fully deployed and accessible through AWS, with the React frontend served through Nginx, the Django backend running on EC2, and the MySQL database hosted on Amazon RDS.

The implementation demonstrates the integration of **frontend development, backend development, database management, API integration, authentication, rating functionality, and cloud deployment** in a complete software system.
