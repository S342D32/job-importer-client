# Job Importer System

Scalable job import system with Redis queue processing and MongoDB storage.

## Live Demo
- Frontend: https://job-importer-client.vercel.app
- Backend API: https://job-importer-api.onrender.com

## Features
- Fetches jobs from 9 external APIs
- Bull + Redis queue system
- MongoDB storage
- Automated cron job (every 1 minute)
- Import history tracking
- Next.js admin dashboard

## Tech Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, Mongoose
- **Queue**: Bull, Redis
- **Database**: MongoDB Atlas
- **Deployment**: Vercel (Frontend), Render (Backend)

## API Endpoints
- `GET /api/import-logs` - Get import history
- `POST /api/trigger-import` - Manually trigger import
- `GET /api/queue-stats` - Get queue statistics
- `GET /health` - Health check

## Environment Variables
See `.env.example` files in `/server` and `/client` directories.

## Local Development
