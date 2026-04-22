# SmartSeason – Field Monitoring System

A web application for tracking crop progress across multiple fields during a growing season. Admins coordinate field assignments and monitor all activity, while Field Agents manage and update their assigned fields.

---

## Tech Stack

- **Backend:** Laravel 11 (PHP) + Sanctum for API authentication
- **Frontend:** React 19 + Vite + Tailwind CSS v4
- **Database:** MySQL

---

## Project Structure

```
smartseason/
├── backend/        # Laravel API
└── src/            # React frontend
```

---

## Setup Instructions

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- MySQL

### Backend Setup

```bash
cd backend
composer install
cp .env.example .env
```

Edit `.env` and set your database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=smartseason
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
```

Then run:

```bash
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

The API will be available at `http://127.0.0.1:8000`.

### Frontend Setup

```bash
# From project root
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

> **Note:** Update `src/api/axios.js` `baseURL` to match the port Laravel is running on.

---

## Demo Credentials

| Role  | Email                     | Password |
|-------|---------------------------|----------|
| Admin | admin@smartseason.com     | password |
| Agent | agent@smartseason.com     | password |

---

## Features

### Admin
- Dashboard with total fields, agents, unassigned fields, and at-risk summary
- Create, edit, and delete fields
- Assign fields to agents
- Monitor all field updates across agents

### Field Agent
- Dashboard showing only assigned fields
- View fields with current stage and status
- Post stage updates and observations/notes

---

## Field Lifecycle

Fields progress through four stages:

```
Planted → Growing → Ready → Harvested
```

---

## Field Status Logic

Each field has a computed status based on its current data:

| Status      | Logic |
|-------------|-------|
| `active`    | Field is in `planted` or `growing` stage |
| `ready`     | Field stage is `ready` |
| `completed` | Field has been `harvested` |
| `at_risk`   | Field has been in the ground for more than 90 days and has not been harvested |

**At Risk reasoning:** A field that has exceeded 90 days without reaching harvest is considered at risk — this threshold is a reasonable default for most common crop cycles and flags fields that may be stalled or neglected. This can be adjusted in `routes/api.php` and `app/Models/Field.php`.

---

## API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/login` | Public | Authenticate and get token |
| POST | `/api/logout` | Auth | Invalidate token |
| GET | `/api/dashboard` | Auth | Admin dashboard data |
| GET | `/api/dashboard/agent` | Auth | Agent dashboard data |
| GET | `/api/fields` | Auth | List all fields |
| POST | `/api/fields` | Admin | Create a field |
| GET | `/api/fields/{id}` | Auth | Get field detail |
| PUT | `/api/fields/{id}` | Admin | Update a field |
| DELETE | `/api/fields/{id}` | Admin | Delete a field |
| GET | `/api/fields/my` | Auth | Agent's assigned fields |
| POST | `/api/fields/{id}/updates` | Auth | Post a field update |
| GET | `/api/agents` | Admin | List all agents |

---

## Design Decisions

- **Sanctum token auth** — simple and well-suited for SPA + API setups without the overhead of OAuth
- **Role-based access via middleware** — a custom `AdminOnly` middleware handles admin-only routes cleanly
- **Computed attributes on the model** — `status` and `days_since_planting` are computed on the `Field` model so the logic lives in one place
- **SQLite → MySQL** — started with SQLite for speed, switched to MySQL to meet production-grade expectations
- **Monorepo structure** — frontend and backend live in the same repo for simplicity given the scope of the project

---

## Assumptions

- A field can only be assigned to one agent at a time
- Only admins can create, edit, or delete fields
- Agents can only view and update their own assigned fields
- The 90-day at-risk threshold applies universally across all crop types
- No email verification is required for demo purposes