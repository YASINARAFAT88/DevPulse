# DevPulse API

A collaborative issue tracking platform for software teams to report bugs, suggest features, and manage issue resolution workflows.

## Live API

https://dev-pulse-ieh6.vercel.app/

## GitHub Repository

https://github.com/YASINARAFAT88/DevPulse/tree/main

---

## Features

### Authentication & Authorization

* User Registration
* User Login
* JWT Authentication
* Role-Based Authorization
* Password Hashing using bcrypt

### Issue Management

* Create Issue
* Get All Issues
* Get Single Issue
* Update Issue
* Delete Issue
* Filter Issues by Type
* Filter Issues by Status
* Sort Issues by Newest or Oldest

### Roles

#### Contributor

* Register and Login
* Create Issues
* View Issues
* Update Own Open Issues

#### Maintainer

* All Contributor Permissions
* Update Any Issue
* Delete Any Issue
* Change Issue Status

---

## Technology Stack

* Node.js
* TypeScript
* Express.js
* PostgreSQL (NeonDB)
* bcrypt
* jsonwebtoken
* Raw SQL (pg driver)

---

## Project Structure

```text
src/
│
├── config/
├── middleware/
├── modules/
│   ├── auth/
│   └── issues/
├── utils/
├── app.ts
└── server.ts
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/YASINARAFAT88/DevPulse.git
```
---

## Database Schema

### Users Table

| Field      | Type                     |
| ---------- | ------------------------ |
| id         | Serial                   |
| name       | VARCHAR                  |
| email      | VARCHAR (Unique)         |
| password   | VARCHAR                  |
| role       | contributor / maintainer |
| created_at | TIMESTAMP                |
| updated_at | TIMESTAMP                |

### Issues Table

| Field       | Type                          |
| ----------- | ----------------------------- |
| id          | Serial                        |
| title       | VARCHAR(150)                  |
| description | TEXT                          |
| type        | bug / feature_request         |
| status      | open / in_progress / resolved |
| reporter_id | INTEGER                       |
| created_at  | TIMESTAMP                     |
| updated_at  | TIMESTAMP                     |

---

## API Endpoints

### Authentication

#### Register User

```http
POST /api/auth/signup
```

#### Login User

```http
POST /api/auth/login
```

---

### Issues

#### Create Issue

```http
POST /api/issues
```

#### Get All Issues

```http
GET /api/issues
```

#### Get Single Issue

```http
GET /api/issues/:id
```

#### Update Issue

```http
PATCH /api/issues/:id
```

#### Delete Issue

```http
DELETE /api/issues/:id
```

---

## Query Parameters

### Filter By Type

```http
GET /api/issues?type=bug
```

```http
GET /api/issues?type=feature_request
```

### Filter By Status

```http
GET /api/issues?status=open
```

```http
GET /api/issues?status=in_progress
```

```http
GET /api/issues?status=resolved
```

### Sort

```http
GET /api/issues?sort=newest
```

```http
GET /api/issues?sort=oldest
```

---

## Deployment

* Backend: Vercel
* Database: Neon PostgreSQL

---

## Author

Yasin Arafat
