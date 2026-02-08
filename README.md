# 🚀 Deployment & Repository Links

-   Deployed demo link
    - link - jayaram.karunakaran@yahoo.com
    - 
-   GitHub repository links
    - FE Repo - https://github.com/jayaram-karunakaran/next-task-app
    - BE Repo - https://github.com/jayaram-karunakaran/node-deploy-lab

------------------------------------------------------------------------

# Project Overview

This project is a full MERN stack application implementing:

-   JWT Authentication (HTTP-only cookies)
-   Task CRUD operations
-   Redis caching with 5-minute TTL
-   Cache invalidation strategy
-   Docker containerization
-   MongoDB persistence
-   Pagination support
-   Secure API proxy via Next.js route handlers

------------------------------------------------------------------------


# 🛠️ Tech Stack

Frontend: - Next.js 16 (App Router) - MUI - HTTP-only cookie auth

Backend: - Node.js - Express - MongoDB + Mongoose - Redis (node-redis
v4) - JWT + bcrypt

DevOps: - Docker - Docker Compose

------------------------------------------------------------------------

# 📦 How To Run The Full MERN App (Local)

## 1️⃣ Clone Repository

``` bash
git clone <your-repo-url>
cd project-root
```

------------------------------------------------------------------------

# 🐳 2️⃣ Start MongoDB + Redis via Docker

Ensure Docker Desktop is running.

``` bash
docker-compose up -d
```

Verify containers:

``` bash
docker ps
```

You should see: - local-mongo - local-redis

------------------------------------------------------------------------

# 🔧 3️⃣ Backend Setup

Go to backend folder:

``` bash
cd backend
```

Create `.env` file:

``` env
PORT=5000
MONGO_URI=mongodb://localhost:27017/task-app
JWT_SECRET=supersecretkey
REDIS_URL=redis://localhost:6379
```

Install dependencies:

``` bash
npm install
```

Start backend:

``` bash
npm run dev
```

You should see: - MongoDB connected - Redis connected - Server running
on port 5000

------------------------------------------------------------------------

# 🌐 4️⃣ Frontend Setup (Next.js)

Open new terminal:

``` bash
git clone https://github.com/jayaram-karunakaran/next-task-app.git
cd frontend
```

Create `.env`:

``` env
BACKEND_URL=http://localhost:5000
```

Install dependencies:

``` bash
npm install
```

Start frontend:

``` bash
npm run dev
```

Visit:

    http://localhost:3000

------------------------------------------------------------------------

# 🔐 Authentication Flow

-   Signup → backend `/api/auth/register`
-   Login → backend `/api/auth/login`
-   JWT stored in HTTP-only cookie
-   All task APIs protected via middleware

------------------------------------------------------------------------

# 📄 Pagination

Backend supports:

    GET /api/tasks?page=1&limit=5

Redis cache key pattern:

    tasks:{userId}:page:{page}:limit:{limit}

TTL: 300 seconds (5 minutes)

------------------------------------------------------------------------

# 🧠 Redis Cache Strategy

✔ Cache task list per user (5 min TTL)\
✔ Cache individual tasks separately\
✔ Invalidate cache on create/update/delete\
✔ LRU eviction handled by Redis maxmemory-policy

To configure LRU in Redis:

``` bash
CONFIG SET maxmemory-policy allkeys-lru
```

------------------------------------------------------------------------

# 🧹 Clear Cache API

Endpoint:

    POST /api/clear-cache

Example curl:

``` bash
curl -X POST http://localhost:5000/api/clear-cache
```

------------------------------------------------------------------------

# 🐳 Backend Dockerfile Example

``` dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

------------------------------------------------------------------------

# 🐳 Frontend Dockerfile Example

``` dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

------------------------------------------------------------------------

# 📊 Evaluation Coverage

✔ Code quality\
✔ JWT authentication\
✔ CRUD correctness\
✔ Redis caching with invalidation\
✔ Docker containerization\
✔ Pagination\
✔ Secure cookies

------------------------------------------------------------------------

# ✅ Project Status

Fully functional MERN stack app with advanced Redis caching and
Dockerized local environment.

