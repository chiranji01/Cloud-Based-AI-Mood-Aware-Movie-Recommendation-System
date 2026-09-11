# 🎬 MoodFlix

## Cloud-Based AI Mood-Aware Movie Recommendation System

**MoodFlix** is a cloud-based movie recommendation system that provides personalised movie recommendations based on a user's current mood and movie content.

Instead of relying only on traditional browsing or previous ratings, MoodFlix allows users to select how they currently feel and generates a **Top 10 mood-aware movie recommendation list**.

The system combines a **React frontend**, **Django backend**, **MySQL database**, **MovieLens dataset**, **TMDb API**, and a **content-based recommendation engine**. The application is deployed using **Amazon Web Services (AWS)**.

MoodFlix was developed as part of **NIT6150 – Advanced Project** at **Victoria University**.

---

## ✨ Key Features

- User registration and login
- Home dashboard and movie discovery
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
- Responsive React interface
- AWS cloud deployment

---

## 😊 Supported Moods

MoodFlix currently supports six mood categories:

| Mood | Recommendation Focus |
| --- | --- |
| 😀 Happy | Comedy, Animation, Adventure |
| 😢 Sad | Drama, Romance |
| 😌 Relaxed | Comedy, Romance, Fantasy |
| 🤩 Excited | Action, Adventure, Thriller |
| 💗 Romantic | Romance, Drama |
| 😰 Stressed | Comedy, Animation, Fantasy |

Mood mappings are stored in the database and are used by the recommendation engine to build the mood profile used during recommendation generation.

---

## 🧠 How the Recommendation Engine Works

MoodFlix uses a **Content-Based Filtering** approach.

The recommendation engine analyses movie content and compares it with the user's selected mood.

The main recommendation process combines:

- Mood-to-Genre and Keyword Mapping
- Movie genres
- MovieLens tags
- TF-IDF feature representation
- Cosine Similarity
- Genre relevance
- Rating quality
- Popularity
- Movie recency

### Recommendation Flow

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
TF-IDF Feature Representation
        │
        ▼
Cosine Similarity
        │
        ▼
Genre Match
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

## 🔤 TF-IDF Feature Representation

Movie genres and tags are combined to create textual movie features.

**TF-IDF (Term Frequency–Inverse Document Frequency)** converts this text into numerical vectors that can be processed mathematically.

The selected mood is also converted into a TF-IDF vector using its associated genres and keywords.

This allows MoodFlix to compare the selected mood with the available movies.

---

## 📐 Cosine Similarity

**Cosine Similarity** measures how closely each movie's TF-IDF vector matches the selected mood vector.

A higher similarity score means that the movie's content is more relevant to the selected mood.

In MoodFlix:

```text
Cosine Similarity → Mood-to-Movie comparison
```

Cosine Similarity provides the main mood relevance score used by the recommendation engine.

---

## 📊 Multi-Factor Recommendation Ranking

MoodFlix does not rank movies using Cosine Similarity alone.

The final recommendation score combines five factors:

| Ranking Factor | Weight |
| --- | ---: |
| Mood Similarity | 60% |
| Genre Match | 20% |
| Reliable Rating | 10% |
| Popularity | 5% |
| Recency | 5% |
| **Total** | **100%** |

### Mood Similarity – 60%

Measures how closely the movie's genres and tags match the selected mood profile using TF-IDF and Cosine Similarity.

### Genre Match – 20%

Measures direct overlap between the movie's genres and the genres associated with the selected mood.

### Reliable Rating – 10%

Uses the movie's average rating together with its rating count so that movies with very few ratings do not receive an unfair advantage.

### Popularity – 5%

Uses MovieLens rating counts as a popularity signal.

### Recency – 5%

Provides a small preference towards newer movies without allowing release year to dominate the recommendation.

The final ranking therefore keeps **mood relevance as the main priority**, while movie quality and popularity help refine the results.

---

## ✅ Recommendation Filtering

Before returning recommendations, MoodFlix applies additional relevance and quality checks.

These filters help prevent weak or low-quality movies from appearing simply because of one ranking factor.

The engine checks:

- Mood relevance
- Genre relevance
- Minimum rating count
- Minimum average rating

After scoring and filtering, the movies are ranked from highest to lowest score and the **Top 10 recommendations** are returned to the user.

---

## 🎞️ Movie Details

Users can select any recommended or browsed movie to open its **Movie Details** page.

MovieLens provides the core movie information, while the **TMDb API** enriches the movie information where available.

TMDb integration provides:

- Movie posters
- Overview
- Runtime
- Release date
- Director
- Writers
- Cast
- Certification
- Additional movie metadata

Movie links are also used to provide access to **IMDb**.

---

## 🔗 Similar Movie Recommendations

The Movie Details page includes a **You Might Also Like** section that recommends up to **6 similar movies**.

Unlike the main mood recommendation engine, this feature uses **Jaccard Similarity**.

Jaccard Similarity compares the genres of the selected movie with other movies.

```text
Jaccard Similarity =
Common Genres / Total Unique Genres
```

For example:

```text
Movie A: Action | Adventure | Thriller
Movie B: Action | Adventure

Common Genres = 2
Total Unique Genres = 3

Jaccard Similarity = 2 / 3
```

Therefore, MoodFlix uses two different similarity approaches:

```text
TF-IDF + Cosine Similarity → Mood-to-Movie Recommendations

Jaccard Similarity          → Movie-to-Movie Recommendations
```

---

## 🏗️ System Architecture

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

The user accesses MoodFlix through **Amazon CloudFront using HTTPS**.

CloudFront serves the React frontend from **Amazon S3**.

Requests under:

```text
/api/*
```

are routed to the Django backend hosted on **Amazon EC2**.

The Django application and recommendation engine communicate with the **MySQL database hosted on Amazon RDS**.

TMDb is used when additional movie metadata or poster information is required.

---

## 🛠️ Technology Stack

| Component | Technology |
| --- | --- |
| Frontend | React.js, Vite |
| Backend | Python, Django |
| Database | MySQL |
| Recommendation Engine | Python |
| Data Processing | Pandas, NumPy |
| Machine Learning Library | Scikit-learn |
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

## 📚 Dataset

MoodFlix uses the **MovieLens dataset** provided by **GroupLens Research**.

The dataset provides:

- Movie titles
- Genres
- Ratings
- Tags
- Movie links

### How MoodFlix Uses MovieLens

**Genres and Tags**

Used to create movie features for the recommendation engine.

**Ratings**

Used to calculate movie quality and popularity.

**Movie Links**

Used to connect MovieLens movies with TMDb and IMDb information.

MovieLens Dataset:

https://grouplens.org/datasets/movielens/

---

## 🎥 TMDb Integration

MoodFlix integrates with **The Movie Database (TMDb) API** to provide richer movie information.

TMDb is mainly used for:

- Movie posters
- Movie overview
- Runtime
- Release information
- Cast and crew information
- Certification
- IMDb linking

Poster URLs are cached after retrieval to reduce repeated external API requests and improve application performance.

---

## ☁️ AWS Cloud Deployment

MoodFlix uses several AWS services to host and deliver the application.

### Amazon EC2

Hosts:

- Django backend
- Recommendation APIs
- Mood-aware recommendation engine

### Amazon RDS

Hosts the application's **MySQL cloud database**.

The Django backend and recommendation engine communicate with the database through the EC2-to-RDS connection.

### Amazon S3

Hosts the production build of the **React/Vite frontend**.

### Amazon CloudFront

Provides:

- HTTPS application delivery
- Frontend delivery from S3
- Backend API routing
- A single public entry point for the deployed application

CloudFront routing:

```text
Default requests → Amazon S3 → React Frontend

/api/*           → Amazon EC2 → Django Backend
```

The deployed environment was tested for:

- EC2-to-RDS connectivity
- Django database migrations
- Recommendation engine execution on EC2
- Recommendation API responses
- Top 10 mood recommendation generation
- CloudFront `/api/*` routing
- HTTPS API requests
- S3 frontend delivery
- TMDb poster integration
- End-to-end mood recommendation flow

---

## 🔌 API Example

### Mood Recommendation API

**Endpoint**

```http
POST /api/recommendations/
```

### Example Request

```json
{
  "mood": "Happy"
}
```

### Example Response

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

The full API response contains additional movie and recommendation information used by the React frontend.

---

## ⚡ Performance Optimisation

Several improvements were implemented to improve recommendation quality and application performance.

### Recommendation Optimisation

- Weighted multi-factor ranking
- Genre relevance scoring
- Quality filtering
- Reliable-rating calculation
- Popularity normalisation
- Recency consideration

### TMDb Optimisation

TMDb poster URLs are cached after retrieval.

This reduces repeated external API calls when the same movies are displayed again.

### Concurrent Poster Retrieval

Poster retrieval for recommendation results is processed concurrently, reducing the time required to prepare movie information for the frontend.

Performance testing was carried out on:

- Recommendation engine execution
- TMDb poster retrieval
- Total recommendation API response time

---

## 📁 Project Structure

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

## 🚀 Getting Started

### Prerequisites

Before running MoodFlix locally, install:

- Git
- Python
- Node.js
- npm
- MySQL

---

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Cloud-Based-AI-Mood-Aware-Movie-Recommendation-System
```

---

### 2. Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a Python virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment and install the Python dependencies required by the project.

Configure the required database and API environment variables.

Run Django migrations:

```bash
python manage.py migrate
```

Start the Django backend:

```bash
python manage.py runserver
```

The backend will normally run locally at:

```text
http://127.0.0.1:8000
```

---

### 3. Frontend Setup

Open another terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Configure the frontend API URL for the local Django backend.

Start the Vite development server:

```bash
npm run dev
```

Open the local URL displayed by Vite.

---

## 🔐 Environment Configuration

MoodFlix uses environment-specific configuration for values such as:

- Database host
- Database name
- Database username
- Database password
- TMDb API key
- Frontend API base URL

Sensitive environment values should **never be committed to GitHub**.

Example frontend local configuration:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Database passwords, API keys, AWS credentials and private keys should always remain outside the public repository.

---

## 🧪 Testing

MoodFlix was tested throughout development and system integration.

Testing included:

### Functional Testing

- User registration and login
- Navigation
- Mood selection
- Top 10 recommendation generation
- Movie Details
- Search
- Ratings
- User profile

### Recommendation Engine Testing

- Mood-to-Genre mapping
- TF-IDF feature generation
- Cosine Similarity
- Genre matching
- Multi-factor ranking
- Recommendation filtering
- Jaccard Similarity

### API & Integration Testing

- Django API responses
- Frontend-to-backend communication
- Recommendation engine integration
- MySQL/RDS integration
- TMDb integration

### Cloud Testing

- EC2-to-RDS connectivity
- Django migrations on AWS
- Recommendation engine execution on EC2
- CloudFront API routing
- S3 frontend delivery
- HTTPS API requests
- End-to-end recommendation flow

### UI Testing

- Page navigation
- Layout consistency
- Responsive behaviour
- Cross-page functionality
- Final integrated application validation

---

## 🐞 Development Challenges

Several issues were identified and resolved during development and integration.

### AWS Mood Mapping Format

During AWS deployment testing, the mood genres stored in the cloud database used a comma-separated format.

The recommendation engine initially parsed the value using a different separator, which caused incorrect genre-match scores.

The parsing logic was corrected to handle the database format correctly and the recommendation results were retested.

### External Poster Requests

Repeated TMDb poster requests increased response time.

Poster URLs were cached after retrieval to reduce unnecessary external requests.

### Frontend and Backend Integration

Different local and cloud environments required the frontend API URL to be configurable.

Environment-based API configuration was used so the application could communicate with the appropriate backend.

---

## 🔄 Development Workflow

MoodFlix followed an **Agile Scrum** development approach.

The project workflow used:

```text
Backlog
   ↓
Todo
   ↓
In Progress
   ↓
Review
   ↓
Done
```

Development activities included:

- Sprint planning
- Task allocation
- Frontend development
- Backend development
- Recommendation-engine development
- Database integration
- API integration
- Testing
- Debugging
- Performance optimisation
- AWS deployment
- Final system integration

---

## 🌿 Git & GitHub

Git and GitHub were used throughout the project for:

- Version control
- Individual development branches
- Team collaboration
- Code integration
- Commit history
- Merge management
- Conflict resolution
- Project tracking
- README documentation

The team integrated frontend, backend, recommendation-engine and cloud-related work into the final project repository.

---

## ⚠️ Current Limitations

MoodFlix currently has several areas that could be improved in future versions:

- Users manually select their mood.
- The recommendation engine currently supports six mood categories.
- The main recommendation system is content-based.
- Recommendations depend on the available MovieLens genres and tags.
- Long-term personalised collaborative recommendations are not yet implemented.
- TMDb metadata depends on an external API.
- Recommendation diversity could be improved further.
- Cloud deployment could be extended with additional monitoring and automated deployment.

---

## 🔮 Future Improvements

Future versions of MoodFlix could include:

- Hybrid content-based and collaborative filtering
- Personalised recommendations based on user rating history
- Additional mood categories
- Automatic mood detection with user consent
- Machine-learning-based mood classification
- Improved recommendation diversity
- More detailed recommendation explanations
- Enhanced caching
- Automated testing
- CI/CD deployment
- AWS monitoring and scaling
- Further performance optimisation

---

## 👥 Project Team

| Team Member | Role |
| --- | --- |
| **Chiranji Vinodya Ranaweera Jayalathge** | Project Manager & Recommendation Engine Developer |
| **Prapti Pokharel** | Backend Developer |
| **Meghan Reddy Podduturi** | Frontend Developer |
| **Prashanth Kothi** | Frontend Support & QA Tester |

---

## 🤝 Team Contributions

### Chiranji Vinodya Ranaweera Jayalathge

**Project Manager & Recommendation Engine Developer**

Main contributions:

- Project management and team coordination
- Mood-aware recommendation engine
- Mood-to-Genre and keyword mapping
- TF-IDF feature processing
- Cosine Similarity recommendation
- Multi-factor recommendation ranking
- Recommendation quality filtering
- Jaccard-based similar movie recommendations
- Recommendation API and database integration
- TMDb metadata and poster integration
- Recommendation performance optimisation
- GitHub integration and project workflow management
- AWS recommendation-system deployment and testing

### Prapti Pokharel

**Backend Developer**

Main contributions:

- Login and registration backend functionality
- Rating system backend implementation
- Rating APIs
- Database relationships and data storage
- MySQL/RDS integration
- Backend and database integration
- AWS application deployment and connectivity
- Backend API testing and debugging

### Meghan Reddy Podduturi

**Frontend Developer**

Main contributions:

- React frontend development
- Home page
- Login and Register pages
- Movie Details interface
- My Ratings interface
- Frontend routing and component integration
- Responsive UI styling
- Production frontend build
- CloudFront frontend deployment and validation

### Prashanth Kothi

**Frontend Support & QA Tester**

Main contributions:

- Mood Page interface
- Dashboard development and component integration
- User Profile interface and functionality
- Frontend routing and navigation
- Responsive UI consistency
- Functional and UI testing
- Bug fixing and cross-page validation
- Production build support
- Final project validation

---

## 🎓 Academic Information

**Project:** MoodFlix – Cloud-Based AI Mood-Aware Movie Recommendation System  
**Unit:** NIT6150 – Advanced Project  
**Institution:** Victoria University  
**Project Group:** Group 3

---

## 🙏 Acknowledgements

MoodFlix uses the **MovieLens dataset** provided by **GroupLens Research** and movie metadata provided through **The Movie Database (TMDb) API**.

The project was developed for academic purposes as part of the **NIT6150 Advanced Project at Victoria University**.
