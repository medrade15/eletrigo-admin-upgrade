<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1QODkB9RDDFvaiIZlip0eC8OcUKZHM5GB

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Backend (MongoDB API)

To enable persistence with MongoDB, a simple Node/Express API is included under `server/`.

- Create `server/.env` based on `server/.env.example` and set `MONGODB_URI`.
- Install backend dependencies: `cd server && npm install`
- Start the API: `npm run dev`
- Health check: open `http://localhost:3001/health` (it reports DB status).

You can then wire the frontend to call endpoints like `GET /electricians`, `POST /services`, etc.
