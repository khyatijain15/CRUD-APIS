# Scalable REST API with Auth & Role-Based Access Control

A production-ready full-stack application with a Node.js/Express backend and React/Vite frontend.

## Features

- RESTful API design
- Authentication with JWT and bcrypt
- Role-based Access Control (User, Admin)
- PostgreSQL Database using Sequelize ORM
- Swagger API Documentation
- Global Error Handling
- Secure Headers (Helmet), CORS, Rate Limiting ready
- React frontend with Context API state management

## Prerequisites

- Node.js (v18+)
- PostgreSQL (v14+)
- npm or yarn

## Backend Setup

1. `cd backend`
2. `npm install`
3. Create a `.env` file from `.env.example`
4. Update `DB_PASSWORD` and `DB_NAME` in `.env`
5. `npm run dev` to start the server at http://localhost:5000

*Swagger Docs are available at http://localhost:5000/api/docs*

## Frontend Setup

1. `cd frontend`
2. `npm install`
3. `npm run dev` to start the client at http://localhost:5173

## Folder Structure

\`\`\`
backend/
├── src/        # Core application logic (routes, controllers, models)
├── .env        # Configuration
frontend/
├── src/        # React components, pages, api and context
\`\`\`

## API Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | /api/v1/auth/register | Public | Register a new user |
| POST | /api/v1/auth/login | Public | Login and get token |
| GET | /api/v1/auth/me | Protected | Get current user profile |
| GET | /api/v1/tasks | Protected | Get own tasks |
| POST | /api/v1/tasks | Protected | Create a task |
| PUT | /api/v1/tasks/:id | Protected | Update own task |
| DELETE | /api/v1/tasks/:id | Protected | Delete own task |
| GET | /api/v1/tasks/all | Admin | Get all users' tasks |# CRUD-APIS
