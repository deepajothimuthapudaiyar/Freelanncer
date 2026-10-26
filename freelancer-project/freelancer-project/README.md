# Freelancer Project Management System

A full-stack web application connecting **Clients** who post projects with **Freelancers** who bid on and complete them, with a full **Admin** panel for platform oversight.

## Features

### Client
- Register / Login / Logout
- Dashboard with project stats
- Create, edit, delete projects
- View applications, bid amount, delivery days, proposal
- Accept / reject freelancers
- Track project progress (task completion %)
- Approve completed projects
- Rate & review freelancers
- Upload project requirement files
- Notifications

### Freelancer
- Register / Login / Logout
- Dashboard with application/rating stats
- Create/update profile (skills, bio, portfolio)
- Browse & search open projects
- Apply with bid amount, delivery days, proposal
- View application status
- Manage tasks (create/update/delete, mark TODO/IN_PROGRESS/COMPLETED)
- Upload completed work files
- View client reviews & ratings
- Notifications

### Admin
- Login
- Dashboard: total users, clients, freelancers, projects, active/completed projects
- View & delete any user
- View & delete any project

## Technologies

| Layer     | Tech |
|-----------|------|
| Frontend  | React 18, React Router 6, Axios, Context API, Hooks, plain CSS |
| Backend   | Java 21, Spring Boot 3.3, Spring Security, JWT (jjwt), Spring Data JPA |
| Database  | MySQL 8 |
| Build     | Maven (backend), Vite (frontend) |

## Requirements

- Java 21 (JDK)
- Maven 3.9+
- Node.js 18+ and npm
- MySQL 8+ running locally

## MySQL Setup

1. Make sure MySQL is running.
2. Hibernate will auto-create the database (`createDatabaseIfNotExist=true`) and all tables (`spring.jpa.hibernate.ddl-auto=update`) the first time you start the backend — **you do not need to manually create tables**.
3. (Optional) If you want sample data, run `database/setup.sql` in MySQL **after** starting the backend once (so tables exist):
   ```bash
   mysql -u root -p < database/setup.sql
   ```
   Sample users all use the password **Password123** (stored as a BCrypt hash — never plain text).

## Backend Setup

```bash
cd backend
```

1. Open `src/main/resources/application.properties` and set your MySQL password:
   ```
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```
2. Build and run:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```
3. Backend runs at **http://localhost:8080**.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:5173**.

## How to Run (Full Flow)

1. Start MySQL.
2. Start the backend (`mvn spring-boot:run` in `backend/`) — tables are created automatically.
3. Start the frontend (`npm run dev` in `frontend/`).
4. Open http://localhost:5173 in your browser.
5. Register as a Client and as a Freelancer (two separate accounts, e.g. two browser tabs/incognito windows) to try the full flow.
6. For an Admin account, register a user then manually update its `role` column to `ROLE_ADMIN` in MySQL (there is no public admin self-registration, by design):
   ```sql
   UPDATE users SET role = 'ROLE_ADMIN' WHERE email = 'your@email.com';
   ```

## API Overview

Base URL: `http://localhost:8080/api`

| Resource | Endpoints |
|----------|-----------|
| Auth | `POST /auth/register`, `POST /auth/login` |
| Users | `GET /users`, `GET /users/{id}`, `PUT /users/{id}`, `DELETE /users/{id}`, `GET/PUT /users/me/profile` |
| Projects | `POST /projects`, `GET /projects`, `GET /projects/{id}`, `PUT /projects/{id}`, `DELETE /projects/{id}`, `GET /projects/my`, `PUT /projects/{id}/complete`, `PUT /projects/{id}/cancel`, `GET /projects/dashboard/client` |
| Applications | `POST /applications`, `GET /applications/project/{projectId}`, `GET /applications/freelancer/{freelancerId}`, `PUT /applications/{id}/accept`, `PUT /applications/{id}/reject` |
| Tasks | `POST /tasks`, `GET /tasks/project/{projectId}`, `PUT /tasks/{id}`, `DELETE /tasks/{id}`, `GET /tasks/project/{projectId}/progress` |
| Reviews | `POST /reviews`, `GET /reviews/user/{userId}` |
| Notifications | `GET /notifications`, `PUT /notifications/{id}/read` |
| Files | `POST /files/upload`, `GET /files/{id}`, `GET /files/project/{projectId}`, `DELETE /files/{id}` |
| Admin | `GET /admin/dashboard`, `GET /admin/users`, `GET /admin/projects`, `DELETE /admin/users/{id}`, `DELETE /admin/projects/{id}` |

All endpoints except `/auth/**` and `GET /projects/**` require a `Authorization: Bearer <token>` header, obtained from login/register.

## Default Roles

- `ROLE_CLIENT` — set at registration by choosing "Client"
- `ROLE_FREELANCER` — set at registration by choosing "Freelancer"
- `ROLE_ADMIN` — not self-registrable; promote a user manually in MySQL (see above)

## Testing Instructions

1. Register a Client and a Freelancer account.
2. As the Client: create a project.
3. As the Freelancer: browse projects, view the one just created, submit a bid.
4. As the Client: open the project, view the application, click **Accept**. Project moves to `IN_PROGRESS`.
5. As the Freelancer: open the assigned project → **Manage Tasks** → add a few tasks, mark them `COMPLETED` one by one and watch the progress bar update.
6. Once all tasks are `COMPLETED` (100%), go back as the Client and click **Approve & Complete Project**.
7. As the Client: click **Rate Freelancer**, submit a rating (1–5) and comment.
8. Check the Freelancer's **Reviews** page and **Dashboard** — average rating should update.
9. Check **Notifications** for both users throughout the flow.
10. Log in as an Admin (after promoting a user via SQL) and check the Admin dashboard, Manage Users, Manage Projects, Reports.

## Common Errors & Solutions

| Error | Solution |
|-------|----------|
| `Communications link failure` / can't connect to MySQL | Ensure MySQL is running and the credentials in `application.properties` are correct. |
| `Access denied for user 'root'@'localhost'` | Update `spring.datasource.password` in `application.properties` to your actual MySQL root password. |
| CORS error in browser console | Confirm the backend is running on port 8080 and the frontend on 5173 — `app.cors.allowed-origin=http://localhost:5173` in `application.properties` must match exactly. |
| 401 Unauthorized on every request after login | Token may have expired (24h) or wasn't sent — check `localStorage` has a `token` key and that `api.js` interceptor is attaching it. |
| 403 Forbidden on an action | You're using the wrong role for that action (e.g. a Freelancer trying to create a project). Check the business rules in this README / the `SecurityConfig` role restrictions. |
| File upload fails / 413 | Files over 10MB are rejected (`spring.servlet.multipart.max-file-size=10MB`). Increase the limit in `application.properties` if needed. |
| Port already in use | Something else is using 8080 or 5173 — stop it, or change `server.port` / Vite's `server.port` in `vite.config.js`. |
| `mvn` command not found | Install Maven and ensure it's on your PATH, or use your IDE's built-in Maven runner. |

## Project Structure

```
freelancer-project/
├── backend/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/example/freelancer/
│       │   ├── controller/     (9 REST controllers)
│       │   ├── service/        (9 services)
│       │   ├── repository/     (8 JPA repositories)
│       │   ├── model/          (8 entities + 4 enums)
│       │   ├── dto/            (13 request/response DTOs)
│       │   ├── security/       (JWT filter, util, user details)
│       │   ├── config/         (Security + CORS + static file config)
│       │   ├── exception/      (Global handler + custom exceptions)
│       │   └── FreelancerApplication.java
│       └── resources/application.properties
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── components/  (Navbar, Sidebar, cards, modal, etc.)
│       ├── pages/
│       │   ├── public/    (Home, Login, Register)
│       │   ├── client/    (8 pages)
│       │   ├── freelancer/(9 pages)
│       │   └── admin/     (4 pages)
│       ├── services/    (Axios API modules, one per resource)
│       ├── context/      (AuthContext)
│       ├── App.jsx, main.jsx, index.css
├── database/setup.sql
└── README.md
```
