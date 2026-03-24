# Taskora

Taskora is a full-stack **freelance management platform** that helps freelancers manage clients, projects, tasks, and invoices from a single dashboard.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Spring Boot 3.2.3, Java 17, Spring Security (JWT), Spring Data JPA |
| Database | MySQL 8.0 |
| Frontend | React 19, TypeScript, Vite, TailwindCSS 4, Redux Toolkit |
| Containerisation | Docker, Docker Compose |

---

## Project Structure

```
Taskora/
├── backend/          # Spring Boot REST API
├── frontend/         # React + Vite SPA
├── docker-compose.yml
└── README.md
```

---

## Prerequisites

### Local development

| Tool | Minimum version |
|---|---|
| Java (JDK) | 17 |
| Maven | 3.9 (or use the included `mvnw` wrapper) |
| MySQL | 8.0 |
| Node.js | 22 |
| npm | 10+ |

### Docker

| Tool | Notes |
|---|---|
| Docker | 24+ recommended |
| Docker Compose | v2 (`docker compose`) |

---

## Running Locally (without Docker)

### 1. Database

Start a local MySQL 8 server and create the database:

```sql
CREATE DATABASE taskora_db;
```

The default credentials expected by the application are:

| Setting | Default |
|---|---|
| Host | `localhost:3306` |
| Database | `taskora_db` |
| Username | `root` |
| Password | `root` |

To use different credentials, update `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/taskora_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
```

### 2. Backend

```bash
cd backend

# Using the Maven wrapper (no Maven installation required)
./mvnw spring-boot:run

# Or with a system Maven installation
mvn spring-boot:run
```

The API starts on **http://localhost:8080**.

**Swagger UI** is available at: http://localhost:8080/swagger-ui.html  
**OpenAPI JSON** is available at: http://localhost:8080/api-docs

#### Running backend tests

```bash
# Unit + integration tests (uses in-memory H2 — no MySQL needed)
./mvnw test
```

### 3. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server (defaults to http://localhost:5173)
npm run dev
```

The frontend expects the backend API at `http://localhost:8080/api` by default.  
To override this, create a `.env.local` file inside the `frontend/` directory:

```env
VITE_API_URL=http://localhost:8080/api
```

#### Useful frontend scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Production build (TypeScript check + Vite build) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run type-check` | TypeScript type checking without emitting files |
| `npm run cy:open` | Open Cypress for interactive E2E testing |
| `npm run cy:run` | Run all Cypress E2E tests headlessly |

---

## Running with Docker Compose

Docker Compose starts all three services — MySQL, the Spring Boot backend, and the Nginx-served frontend — in a single command.

### 1. (Optional) Configure environment variables

Create a `.env` file in the **project root** to override defaults:

```env
# MySQL
MYSQL_ROOT_PASSWORD=root
MYSQL_ROOT_USERNAME=root

# JWT
JWT_SECRET=your_very_long_random_secret_here
JWT_EXPIRATION=86400000

# Frontend API URL (must be reachable from the browser)
VITE_API_URL=http://localhost:8080/api
```

All variables have sensible defaults so the `.env` file is optional for local use.

### 2. Build and start

```bash
# From the project root
docker compose up --build
```

This will:
1. Build the backend JAR inside a Maven Docker stage and package it into a lean JRE image.
2. Build the frontend with Vite and serve it via Nginx.
3. Start MySQL 8, wait for it to be healthy, then start the backend, then the frontend.

### 3. Access the application

| Service | URL |
|---|---|
| Frontend | http://localhost |
| Backend API | http://localhost:8080 |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| OpenAPI JSON | http://localhost:8080/api-docs |

### 4. Useful Docker Compose commands

```bash
# Start in detached (background) mode
docker compose up --build -d

# View logs for all services
docker compose logs -f

# View logs for a specific service
docker compose logs -f backend

# Stop all services
docker compose down

# Stop all services AND remove the database volume (full reset)
docker compose down -v

# Rebuild a single service image
docker compose build backend
```

---

## Environment Variables Reference

### Backend

| Variable | Default | Description |
|---|---|---|
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://db:3306/taskora_db?...` | JDBC connection string |
| `SPRING_DATASOURCE_USERNAME` | `root` | Database username |
| `SPRING_DATASOURCE_PASSWORD` | `root` | Database password |
| `JWT_SECRET` | (see docker-compose.yml) | Secret key used to sign JWT tokens |
| `JWT_EXPIRATION` | `86400000` | Token expiry in milliseconds (default: 24 h) |

### Frontend (build-time)

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8080/api` | Base URL of the backend REST API |

---

## API Overview

All REST endpoints are prefixed with `/api`. Authentication uses **Bearer JWT tokens**.

| Resource | Base path | Roles |
|---|---|---|
| Auth (register / login) | `/api/auth` | Public |
| Dashboard stats | `/api/dashboard` | Authenticated |
| Clients | `/api/clients` | ROLE_FREELANCER |
| Projects | `/api/projects` | ROLE_FREELANCER |
| Tasks | `/api/tasks` | ROLE_FREELANCER |
| Invoices | `/api/invoices` | ROLE_FREELANCER |
| Users (admin) | `/api/users` | ROLE_ADMIN |

Full interactive documentation is available at the Swagger UI once the backend is running.

---

## Application Roles

| Role | Access |
|---|---|
| `ROLE_FREELANCER` | Dashboard, Clients, Projects, Tasks, Invoices |
| `ROLE_ADMIN` | Dashboard, User management, Analytics |

---