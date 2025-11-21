## Overview

StreamBox is a deliberately lightweight full-stack application intended to demonstrate:

- A React SPA consuming a RESTful API
- A simple Node/Express backend backed by static JSON data
- Clean separation of concerns between UI, data access, and routing

The app mimics the browsing experience of streaming platforms like Netflix or Prime Video but focuses on core behaviors: category browsing, video details, and search.

## Frontend Architecture (React + Vite)

### Framework & Tooling

**React** - Building the component-based UI |
**React Router** - Client-side routing (`/`, `/videos/:id`, `/search?q=`) |
**Vite** - Dev server and bundler for fast local development |
**Tailwind CSS** - Utility-first styling for layout, spacing, and responsiveness |

### Key Components & Pages

#### `App.jsx`

- Defines routes and the global layout (header with search bar + main content)
- Uses React Router for navigation

#### `HomePage.jsx`

- Fetches categories and videos from the backend
- Groups videos by category and renders multiple `CategoryRow`s

#### `CategoryRow.jsx`

- Renders a horizontal scrollable list of `VideoCard` components for a single category

#### `VideoCard.jsx`

- Displays the thumbnail, title, duration, and category
- Wraps content in a `Link` to the video detail page

#### `VideoDetailPage.jsx`

- Fetches a single video by ID
- Shows details and a mock "Play" interaction
- Fetches related videos in the same category to render a "More like this" horizontal list

#### `SearchResultsPage.jsx`

- Reads the `q` query parameter from the URL
- Fetches all videos once from the backend, then filters client-side by title and category

### Design Decision: Client-Side Search

Two options were considered:

**Backend search** (`GET /videos?search=`):
PROS - Less data over the wire, more scalable
CONS - More complex backend logic for a small demo app |
**Client-side search**:
PROS - Simple API, flexible filtering, fast for <500 videos
CONS - Not ideal for large datasets

**Decision:** Client-side search was chosen because:

- The backend exposes a simple `GET /videos` endpoint
- The client performs flexible filtering in JavaScript
- For the exercise's scope (even with 300 videos), this is performant and keeps the API small and easy to understand

## Backend Architecture (Node + Express)

### Tech Stack

- **Express** for handling HTTP requests
- **CORS** enabled to allow the React frontend (Vite dev server) to communicate with the API during development
- **Local JSON** for persistence (`server/data/videos.json`)

### API Endpoints

#### `GET /`

- **Purpose:** Health check endpoint
- **Use:** Verify that the backend is running

#### `GET /categories`

- **Returns:** Array of unique category names from the data file
- **Benefit:** Keeps the frontend flexible and decoupled from hard-coded categories

#### `GET /videos`

- **Returns:** All videos from the JSON file as an array
- **Optional Query Parameter:** `category`
  - Example: `GET /videos?category=Comedy`
  - Performs a case-insensitive filter by `video.category`
- **Design Goal:** Keep the API small and predictable

#### `GET /videos/:id`

- **Returns:** Single video object by ID (string comparison)
- **Error Handling:** Returns `404` with `{ message: "Video not found" }` if missing
- **Use:** Powers the detail page and future expansion

### Design Decision: JSON vs Database

**Why JSON?**

- Keeps setup extremely simple
- Avoids additional infrastructure (e.g., Postgres, MongoDB)
- Still allows realistic modeling of categories and videos

**Future Consideration:**

If this evolved into a production app, the JSON file could be replaced by a database with minimal changes (mainly in the data-access layer).

## Data Model

Each video is represented by:

```javascript
 Video = {
  id: string;
  title: string;
  description: string;
  duration: number;  // minutes
  category: "Action" | "Comedy" | "Drama" | "Sci-Fi" | "Documentary";
  thumbnailUrl: string;
};
```

## Key Technical Challenges & Solutions

Although StreamBox looks simple on the surface, several real-world UI/UX bugs emerged while building it. These issues and their solutions demonstrate the architectural decisions made along the way.

### 1. Horizontal Carousel Overflowing the Page

**Issue:** Rows of videos inside `CategoryRow` caused the entire page to horizontally scroll.

**Cause:** `flex` + gaps + fixed item width made the row wider than the viewport.

**Solution:** Encapsulated rows in a scrollable container:

```jsx
<div className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide">
```

Also added:

- `max-w-full`
- Hidden scrollbars
- Gradient fade edges

**Outcome:** A clean Netflix-style horizontal carousel without breaking page layout.

### 2. Hover State Triggering on Entire Category Row

**Issue:** Hovering over any video made the entire row animate (brightness, shadows, ring effects).

**Cause:** Tailwind's `group-hover` propagated to the row level unintentionally.

**Solution:** Introduced named groups:

```jsx
<div className="group/row">  // For row-level
  <div className="group">     // For each card
```

**Outcome:** Only the hovered card animates. Arrows fade in at row-level without affecting cards.

### 3. Black Flash When Navigating Back to Home

**Issue:** Clicking "Back to Browse" briefly displayed a blank screen before the homepage mounted.

**Cause:** Calling `navigate("/")` forces a full remount, refetching categories → visible flash.

**Solution:** Implemented smart back navigation:

```javascript
const handleBackToBrowse = () => {
  if (window.history.length > 1) navigate(-1);
  else navigate("/");
};
```

**Outcome:** Back navigation now feels instant and native—no flicker or re-render flash.

### 4. Search Results Grid Left-Aligned With Large Right-Side Empty Space

**Issue:** On large screens, the search grid hugged the left side with huge unused space on the right.

**Cause:** CSS grid auto-fill + uneven item count distributed by left-alignment.

**Solution:** Replaced grid with flexbox:

```jsx
<div className="flex flex-wrap gap-6 justify-center">
```

**Outcome:** Search results remain centered and visually balanced across all screen sizes.

### 5. "More Like This" Looked Weak Horizontally on the Detail Page

**Issue:** A small horizontal strip of related videos did not fill the page or feel cinematic.

**Cause:** Horizontal layout didn't scale well on desktop.

**Solution:** Use a responsive auto-fill grid:

```jsx
grid-cols-[repeat(auto-fill,minmax(220px,1fr))]
```

**Outcome:** A professional streaming-style recommendations grid.

### 6. Inconsistent Backend Response Shapes (Array vs Object)

**Issue:** Some endpoints returned arrays, others returned `{ videos: [...] }`.

**Cause:** Different API experiments during development.

**Solution:** Normalized all fetch handlers:

```javascript
const list = Array.isArray(data) ? data : data.videos || [];
```

**Outcome:** Frontend works reliably regardless of response shape and is resilient to backend changes.

### 7. Search Input Jumping Layout on Page Transitions

**Issue:** The search bar shifted position slightly when navigating pages.

**Cause:** Mixed padding and alignment rules around page content.

**Solution:** Pinned the header:

```jsx
<header className="sticky top-0 z-20 bg-gradient-to-b ...">
```

**Outcome:** Zero movement — snappy, consistent UI across navigation.

### 8. VideoDetailPage Back Button Behavior and History Edge Cases

**Issue:** If the user opened a video from direct URL, `navigate(-1)` would lead to a blank page.

**Solution:** Added history-depth fallback (see solution #3).

**Outcome:** Stable navigation across reloads, deep links, and direct visits.

## Assumptions

The following constraints were applied to keep the scope focused:

- **No authentication** or user profiles
- **No "continue watching"** or playback progress tracking
- **All videos are always available** (no region locks, expiry, or DRM)
- **Back to Browse** functionality should return to the back page if it we are in too deep.
- **Network failures** are handled with simple error messages rather than retries
- **Accessibility** is considered (semantic HTML, focusable controls) but not exhaustively audited for WCAG compliance due to time constraints

## Possible Extensions

If given more time, logical next steps would include:

### Testing

- **React components:** Jest + React Testing Library
- **Express routes:** Jest + Supertest

### Features

- **Pagination or infinite scrolling** for very large catalogs
- **Filter chips** for duration range and category filters on search results
- **User accounts** with favorites and watchlists, creating accounts
- **Top 5 or 10 Movies** showing up like a banner

### Infrastructure

- **Database integration:** Hook the backend to a database and/or external media catalog API
- **Enhanced error handling:** Implement retry logic and better error boundaries

## Summary

StreamBox demonstrates clean full-stack architecture principles while maintaining simplicity. The deliberate choice of client-side search and JSON storage keeps the project accessible for demonstration purposes, while the modular structure allows for easy expansion into a production-ready application.
