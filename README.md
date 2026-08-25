# MoodFlix – Frontend Development

## Cloud-Based AI Mood-Aware Movie Recommendation System

This repository contains my **frontend development work** for the MoodFlix project. MoodFlix is a cloud-based AI mood-aware movie recommendation system designed to provide personalised movie recommendations based on the user's selected mood and preferences.

My main responsibility in the project is the **design and development of the React.js frontend**, including user interface design, page navigation, mood selection, movie recommendation interfaces, and reusable frontend components.

## My Role

**Role:** Frontend Developer

My main frontend responsibilities include:

* Designing and developing the React.js user interface
* Creating and styling frontend pages
* Implementing page-to-page navigation
* Developing the mood selection interface
* Creating reusable components such as the Sidebar
* Designing movie recommendation cards
* Connecting frontend buttons and navigation to application routes
* Improving the overall user experience and visual consistency
* Integrating frontend pages with the team's backend when required

## Frontend Features Developed

### 1. Login Page

The login page provides users with an interface to enter their:

* Email
* Password

The page also provides navigation to the registration page and other relevant parts of the application.

### 2. Registration Page

The registration page allows new users to create an account by providing the required information.

### 3. Home Page

The Home page provides the main entry point to the MoodFlix application.

It includes:

* Navigation sidebar
* Movie browsing interface
* Search functionality interface
* Movie information
* User profile section
* Navigation to other pages

### 4. Mood Selection Page

I developed the Mood page where users can select their current emotional state.

The available moods include:

* Happy 😀
* Sad 😢
* Relaxed 😌
* Excited 🤩
* Romantic 💗
* Stressed 😰

The selected mood is stored using React state and can be passed to the movie recommendation page.

### 5. Movie Recommendation Interface

The Mood page displays movie recommendation cards containing:

* Movie title
* Genre
* Rating
* Movie poster

The **Show Recommendations** button uses React Router navigation to send the selected mood to the movie recommendation page.

### 6. Sidebar Navigation

I worked with a reusable Sidebar component for consistent navigation across the frontend.

The navigation includes:

* Home
* Mood
* My Ratings
* Profile
* Logout

React Router is used to navigate between different pages.

## Frontend Project Structure

```text
frontend/
│
├── src/
│   │
│   ├── assets/
│   │
│   ├── components/
│   │   ├── Sidebar.jsx
│   │   └── Sidebar.css
│   │
│   ├── pages/
│   │   │
│   │   ├── home/
│   │   │   ├── home.jsx
│   │   │   └── home.css
│   │   │
│   │   ├── login/
│   │   │   ├── Login.jsx
│   │   │   └── Login.css
│   │   │
│   │   ├── moodPage/
│   │   │   ├── mood.jsx
│   │   │   └── mood.css
│   │   │
│   │   ├── movie details/
│   │   ├── ratings/
│   │   └── register/
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── package.json
└── ...
```

## Technologies Used

| Technology   | Purpose                                    |
| ------------ | ------------------------------------------ |
| React.js     | Frontend development                       |
| JavaScript   | Application functionality                  |
| CSS          | Page styling and responsive UI             |
| React Router | Page navigation                            |
| Vite         | Frontend development server and build tool |
| Git          | Version control                            |
| GitHub       | Source code management                     |

## React Concepts Used

The frontend uses several important React concepts:

### React Components

The application is divided into reusable components and pages such as:

* `Sidebar`
* `Home`
* `Login`
* `Register`
* `Mood`

### React State

The Mood page uses `useState` to store the currently selected mood.

Example:

```javascript
const [selectedMood, setSelectedMood] = useState("Happy");
```

When the user selects another mood, the state is updated.

### React Router

`useNavigate()` is used to navigate users between pages.

For example:

```javascript
const navigate = useNavigate();

navigate("/home");
```

The selected mood can also be passed to another page:

```javascript
navigate("/movies", {
  state: {
    mood: selectedMood,
  },
});
```

## Mood Selection Workflow

The frontend mood selection process works as follows:

```text
User opens Mood page
        ↓
User selects a mood
        ↓
React stores selected mood
        ↓
User clicks "Show Recommendations"
        ↓
Selected mood is passed to Movies page
        ↓
Movie recommendations can be displayed
```

## User Interface Design

The frontend follows a movie-themed visual design using:

* Mood-based cards
* Movie posters
* Ratings
* Search interface
* Navigation sidebar
* Profile section
* Recommendation buttons
* Responsive page layouts

The aim is to provide a simple and visually engaging interface that allows users to interact with the recommendation system easily.

## Navigation

The frontend uses React Router for navigation between pages.

Current navigation structure:

```text
/login
   ↓
/register
   ↓
/home
   ↓
/mood
   ↓
/movies
   ↓
/ratings
   ↓
/profile
```

The exact available routes depend on the pages currently implemented in the project.

## Running the Frontend

Open the frontend directory in VS Code:

```bash
cd frontend
```

Install the required dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will provide a local development URL, normally similar to:

```text
http://localhost:5173
```

## Version Control

Git and GitHub are used to manage the frontend development work.

Typical workflow:

```bash
git status
git add .
git commit -m "Update frontend"
git push origin frontendPrashanth
```

When working with the team's frontend branch, changes can be retrieved using:

```bash
git pull origin frontendPrashanth
```

## Current Frontend Status

The frontend is currently under development and integration.

Completed or developed areas include:

* React project structure
* Login interface
* Registration interface
* Home page
* Mood selection page
* Sidebar component
* Frontend navigation
* Movie recommendation interface
* Movie cards
* Profile navigation
* Ratings navigation

Further integration with the backend and recommendation engine will allow the frontend to display dynamically generated movie recommendations.

## My Contribution Summary

My contribution to MoodFlix focuses on creating the **frontend user experience using React.js**. I developed and structured multiple pages, implemented navigation using React Router, created the mood selection interface, designed movie recommendation cards, and worked on reusable components such as the Sidebar.

The frontend provides the user-facing interface through which users can log in, register, browse the system, select their mood, and access personalised movie recommendations.

## Academic Project

**Unit:** NIT6150 – Advanced Project
**Institution:** Victoria University
**Project:** Cloud-Based AI Mood-Aware Movie Recommendation System
**Role:** Frontend Developer

## Future Frontend Improvements

Planned improvements include:

* Connecting the frontend to the backend APIs
* Displaying real-time movie recommendations
* Implementing movie search functionality
* Improving responsive design for different screen sizes
* Completing ratings and profile functionality
* Adding loading and error states
* Improving accessibility
* Connecting user authentication with the backend
* Integrating the final recommendation engine
