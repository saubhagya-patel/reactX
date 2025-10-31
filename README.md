# 🚀 reactX: The Cognitive Hub

A full-stack app to test and track your cognitive performance via multiple games, user accounts, and a global leaderboard.

## 🛠️ Tech Stack

| Area | Technology |
| :--- | :--- |
| **Frontend** | React, Vite, React Router, Tailwind CSS, Zustand |
| **Backend** | Node.js, Express |
| **Database** | PostgreSQL |
| **Authentication** | JWT (jsonwebtoken), bcrypt |
| **API Client** | Axios |

## ⚙️ Getting Started Locally

This is a full-stack project and requires running two servers in two separate terminals.

### 1. Backend (Terminal 1)

```bash
# Navigate to the backend folder
cd new_app/backend

# Install dependencies
npm install

# Setup your .env file (based on .env.example) with your DB credentials
psql -U YOUR_USER -d reactx -f sql/db_init.sql

# Start the server
npm run dev
# API will be running on http://localhost:3000
````

### 2\. Frontend (Terminal 2)

```bash
# Navigate to the frontend folder
cd new_app/frontend

# Install dependencies
npm install

# Start the client
npm run dev
# App will be running on http://localhost:5173
```
