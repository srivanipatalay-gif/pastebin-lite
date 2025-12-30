# Pastebin Lite

A simple, self-hosted pastebin service built with Next.js, allowing users to share code snippets with optional TTL (time-to-live) and view limits.

## Features

- Create and share code pastes
- Optional TTL for automatic expiration
- Optional view limits
- Deterministic expiry for testing (TEST_MODE)
- Responsive UI with Tailwind CSS
- MongoDB for data persistence

## How to Run Locally

1. **Prerequisites**:
   - Node.js (v18+)
   - MongoDB (local or MongoDB Atlas)

2. **Clone and Install**:
   ```bash
   git clone <your-repo-url>
   cd pastebin-lite
   npm install
   ```

3. **Environment Setup**:
   Create `.env.local`:
   ```
   MONGODB_URI=mongodb://localhost:27017/pastebin-lite
   TEST_MODE=1
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. **Start MongoDB** (if local):
   ```bash
   mongod
   ```

5. **Run the App**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## API Endpoints

- `GET /api/healthz` - Health check
- `POST /api/pastes` - Create a paste (body: content, title?, language?, ttl_seconds?, max_views?)
- `GET /api/pastes/:id` - Get paste JSON
- `GET /p/:id` - View paste in HTML

## Persistence Layer

Uses MongoDB with Mongoose for data storage. Pastes are stored with:
- Content, title, language
- expires_at (Date) for TTL
- remaining_views (Number) for view limits
- Timestamps for creation/update

Data persists across server restarts and supports serverless environments.

## Important Design Decisions

- **TTL and View Limits**: Implemented at the API level with database updates on each view.
- **Deterministic Testing**: TEST_MODE uses x-test-now-ms header for predictable expiry testing.
- **Error Handling**: 404 responses for expired or view-limit exceeded pastes.
- **Frontend**: Client-side form for creation, server-side rendering for paste viewing.
- **Security**: Basic input handling; no authentication implemented.
- **Deployment**: Designed for Vercel with environment variables for URLs.

## Deployment

Deploy to Vercel:
1. Push to GitHub
2. Connect repo to Vercel
3. Set environment variables (MONGODB_URI, TEST_MODE, NEXT_PUBLIC_BASE_URL)
4. Deploy

No manual migrations required - Mongoose handles schema.
