# Backend - Personal Productivity Hub

## Notes
- Node.js + Express + MongoDB (Mongoose)
- JWT auth (register/login)
- Images are optional: `imageUrl` is just a string. Frontend will render a generated cover if empty.

## Setup
1. Copy `.env.example` to `.env` and fill `MONGODB_URI` and `JWT_SECRET`.
2. `cd backend`
3. `npm install`
4. `npm run dev` (requires nodemon) or `npm start`

## Deploying to Render
- Create a new Web Service, connect repo, set `PORT` and environment variables in Render dashboard.

