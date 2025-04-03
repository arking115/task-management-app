# 🧠 Task Manager App (Full Stack Starter)

This is a full-stack boilerplate for a Task Management app using:

- **Frontend:** React + TypeScript + Vite
- **Backend:** ASP.NET Core Web API (.NET 7)
- **Database:** PostgreSQL (via Docker)
- **ORM:** Entity Framework Core
- **Dev Tools:** Docker, DBeaver (optional)

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

### 2. Install Docker
You need [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed to run the PostgreSQL database.

We use a PostgreSQL container, so you do not need to install Postgres manually.

### 3. Start the Database (PostgreSQL)

Run this from the root of the project:
```bash
docker-compose up -d
```

This will start a containerized database at:
```bash
localhost:5432
```

### 4. Start the Backend Server (.NET 7+)

Make sure you have the .NET 7 SDK installed.
```bash
cd server
dotnet restore
dotnet run
```

Runs at:
http://localhost:5232

### 5. Start the Frontend (React + Vite)

Make sure you have Node.js installed.
```bash
cd client
npm install
npm run dev
```

Runs at:
http://localhost:5173

Notes:
1. To have the app working fully, the database, backend, and frontend must all be running at the same time
2. The frontend makes API calls to the backend, and the backend fetches data from the PostgreSQL database

#### Database Migrations

When you create or modify a model (table), you must update the database schema.
If You Create a New Table or Change a Model:
```bash
cd server
dotnet ef migrations add YourMigrationNameHere
dotnet ef database update
```

When Pulling Changes from Another Dev
If another developer added a migration, **you must apply it locally**:
```bash
cd server
dotnet ef database update
```

For the database guy the DBeaver settings:
Host:	localhost
Port:	5432
Database:	taskapp
User:	postgres
Password:	postgres