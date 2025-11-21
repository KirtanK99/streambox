# 📺 StreamBox — Video Streaming Category Browser

StreamBox is a mini streaming-style web application inspired by Netflix and Amazon Prime. Users can browse video categories, scroll through carousels, view video details, and search across the entire catalog.

This project demonstrates a clean full-stack setup using React + Express, backed by a large JSON dataset (~300 movies).

---

## 🚀 Tech Stack

**Frontend**

- React (Vite)
- React Router
- Tailwind CSS

**Backend**

- Node.js
- Express
- CORS
- JSON-based data storage

---

## 📁 Project Structure

```
.
├── client/                  # React frontend
│   ├── src/
│   │   ├── App.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── VideoDetailPage.jsx
│   │   │   └── SearchResultsPage.jsx
│   │   └── components/
│   │       ├── CategoryRow.jsx
│   │       └── VideoCard.jsx
│   └── ...
└── server/                  # Express backend
    ├── data/
    │   └── videos.json      # ~300 videos across 5 categories
    ├── server.js
    └── ...
```

---

## 🛠 Installation & Setup

### 1. Install frontend dependencies

```bash
cd client
npm install
```

### 2. Install backend dependencies

```bash
cd ../server
npm install
```

## ▶️ Running the App

### Start the backend

```bash
cd server
npm run dev   # or: npm start
```

**Runs at:** http://localhost:4000

### Start the frontend

```bash
cd client
npm run dev
```

**Runs at:** http://localhost:5173

> **Note:** Make sure the backend is running so the frontend can fetch categories & videos.

---

## 🔌 Backend API Endpoints

| Endpoint                      | Description                                                                                  |
| ----------------------------- | -------------------------------------------------------------------------------------------- |
| `GET /`                       | Health check                                                                                 |
| `GET /categories`             | Returns an array of category names: `["Action", "Comedy", "Drama", "Sci-Fi", "Documentary"]` |
| `GET /videos`                 | Returns all videos (client-side search/filter will be applied)                               |
| `GET /videos?category=Comedy` | Returns all videos with category "Comedy"                                                    |
| `GET /videos/:id`             | Returns a single video object by ID                                                          |

---

## 🎨 Features

### 1. Home Page (Category Browser)

- Displays a vertical list of categories
- Each category contains a horizontal carousel of videos
- Smooth scroll with gradient fades
- Clicking a video opens its detail page

### 2. Video Detail Page

Shows:

- Title
- Thumbnail
- Category
- Duration
- Description
- Play button (simulated alert — no real playback needed)

**"More like this" section:**

- Pulls videos from the same category
- Excludes the current video
- Fully clickable and scrollable

### 3. Search System

- Search bar in header (global)
- Navigates to `/search?q=query`
- Client-side filtering by title and category
- Results shown in a responsive grid

---

## 📄 Data Format

Each video entry looks like:

```json
{
  "id": "41",
  "title": "Crimson Division",
  "description": "A covert military unit uncovers a conspiracy threatening global security.",
  "duration": 115,
  "category": "Action",
  "thumbnailUrl": "https://picsum.photos/seed/action41/400/225"
}
```

The catalog contains **~300 movies** across **5 categories**.

---

## 🧪 Testing (Optional Future Improvement)

If extended, tests could be added:

- **Frontend:** Jest + React Testing Library
- **Backend:** Jest + Supertest

## 🧠 Architectural Decisions & Assumptions

### Why client-side search?

- The dataset is small enough (<500 items)
- Reduces backend complexity
- Search becomes instant on the client
- Backend remains clean and minimal

### Why JSON instead of a database?

- Perfect for interview/demo
- Zero setup
- Easy to expand or replace with a real DB later

### Assumptions

- No authentication
- All videos are always available
- No "continue watching" or watchlist features
- Performance optimization not required for this project size
