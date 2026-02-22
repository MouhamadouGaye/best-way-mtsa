# MoneyTransfer – Full-Stack Application

This repository contains a **dockerized full-stack application** consisting of:

- **Backend**: Spring Boot (Java)
- **Frontend**: Angular (served via Nginx)
- **Database**: PostgreSQL

The goal of this setup is to allow **any developer** to run the entire system locally with **one command**, and to clearly communicate the current state of the project.

---

## 🧱 Architecture Overview

```
┌──────────────┐     HTTP      ┌──────────────────┐
│  Frontend    │ ───────────▶  │  Spring Boot API │
│  (Angular)   │               │  (Backend)       │
│  Nginx :80   │               │  :8080           │
└──────────────┘               └──────────┬───────┘
                                          │
                                          │ JDBC
                                          ▼
                                   ┌──────────────┐
                                   │ PostgreSQL   │
                                   │ :5432        │
                                   └──────────────┘
```

------------

---

## 📦 Services

| Service   | Tech        | Port (Host → Container) |
|----------|-------------|--------------------------|
| frontend | Angular + Nginx | 4200 → 80 |
| backend  | Spring Boot  | 8080 → 8080 |
| db       | PostgreSQL 15| 5434 → 5432 |

---

## 🚀 Running the Project

### Prerequisites

- Docker
- Docker Compose

### Start everything

```bash
docker compose up --build
```

This will:
- build the backend image
- build the frontend Angular app
- serve the frontend via Nginx
- start PostgreSQL with persisted data

---

## 🌐 Accessing the App

From the **same machine**:

- Frontend: http://localhost:4200
- Backend API: http://localhost:8080

From **another device on the same network**:

Replace `localhost` with your host IP:

- Frontend: http://<HOST_IP>:4200
- Backend: http://<HOST_IP>:8080

> Example: `http://192.168.1.42:4200`

---

## ⚙️ Environment Configuration

Environment variables are managed via `.env`.

Example:

```env
SPRING_PROFILES_ACTIVE=docker
SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/moneytransfer
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres
```

### Environment meaning

| Profile | Purpose |
|-------|--------|
| local | Local dev without Docker |
| docker | Local Docker environment |
| prod | Real production (not enabled yet) |

⚠️ **Important**: This setup is **production-like**, but **not production**.

---

## 🧪 Current State of the Project

- ✅ Backend API running
- ✅ Database schema auto-managed by Hibernate
- ✅ Frontend built and served via Nginx
- ✅ Multi-container orchestration with Docker Compose
- ⚠️ No HTTPS yet
- ⚠️ No CI/CD yet
- ⚠️ No real production deployment yet

This represents a **stable development / demo milestone**.

---

## 🛑 Stopping the App

```bash
docker compose down
```

To remove volumes (database reset):

```bash
docker compose down -v
```

---

## 🧭 Why this setup exists

This project is structured to:

- make onboarding effortless
- show architectural maturity
- allow easy demos on other devices
- serve as a solid base for production hardening

If you can run this project, you can understand where it stands.

---

## 📌 Next Logical Steps

- Add reverse proxy (Traefik / Nginx) with HTTPS
- Separate `docker-compose.dev.yml` and `docker-compose.prod.yml`
- Add CI pipeline (GitHub Actions)
- Externalize secrets
- Add monitoring/log aggregation

---

## 👤 Author

**MoneyTransfer** – full-stack system in active development
