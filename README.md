# Social Media App

A simple social media application built with:
- **Backend:** NestJS + MongoDB
- **Frontend:** Next.js (App Router) + shadcn/ui

## Features
- User authentication (signup, login) with JWT (access & refresh tokens)
- Protected routes using NestJS AuthGuard
- Post creation (title, description)
- Follow/unfollow users (dedicated page)
- Timeline/feed: see posts from users you follow, sorted by newest first

## UI Layout
- **Header:** Persistent "Social Media App" header on every page
- **Home:** Navigation buttons for Feed, Create Post, and Follow/Unfollow Users
- **Feed:** Only displays posts from users you follow (no user management UI)
- **Follow/Unfollow Users:** Dedicated page with two columns:
  - Left: Users you follow (Unfollow button)
  - Right: Users you can follow (search + Follow button)
- **Login/Signup:** Clean, centered forms with white backgrounds

## Tech Stack
- **Backend:** NestJS, MongoDB, Mongoose, JWT
- **Frontend:** Next.js (App Router), shadcn/ui, Tailwind CSS

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (running locally or in the cloud)

### Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```
   cd Social_Media_App/backend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the backend server:
   ```
   npm run start
   ```
   The backend will connect to MongoDB at `mongodb://localhost/social-media-app` by default and run on port 8080.

### Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```
   cd Social_Media_App/frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the frontend development server:
   ```
   npm run dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000)

## API Endpoints (Backend)
- `POST /auth/signup` — Register a new user
- `POST /auth/login` — Login and receive JWT tokens
- `POST /posts` — Create a new post (auth required)
- `GET /posts/timeline` — Get timeline/feed (auth required)
- `POST /users/:id/follow` — Follow a user (auth required)
- `POST /users/:id/unfollow` — Unfollow a user (auth required)
- `GET /users` — Get all users (auth required)
- `GET /users/:id` — Get a user with following/followers (auth required)

## License
MIT 