# Personal Finance & Budget Tracker

A production-ready full-stack web application to track your income, expenses, and budgets — with beautiful charts and a clean, modern UI.

## Tech Stack

### Frontend
- **React 18** (Vite)
- **Tailwind CSS** — utility-first styling
- **Recharts** — interactive charts
- **Axios** — HTTP client with JWT interceptor
- **React Router DOM v6** — client-side routing
- **Lucide React** — icon library

### Backend
- **Node.js + Express.js** — REST API
- **Mongoose** — MongoDB ODM
- **JWT (jsonwebtoken)** — authentication
- **bcryptjs** — password hashing
- **express-validator** — request validation
- **cors, helmet** — security headers

### Database
- **MongoDB** — document database

---

## Prerequisites

- Node.js v18+
- MongoDB running locally **or** a MongoDB Atlas connection URI

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd fullstack
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure backend `.env`

Create `backend/.env` with:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/financeapp
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### 4. Install frontend dependencies

```bash
cd ../frontend
npm install
```

### 5. Configure frontend `.env`

Create `frontend/.env` with:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 6. Run MongoDB

Make sure MongoDB is running locally:

```bash
# On Windows (if installed as a service)
net start MongoDB

# Or start manually
mongod --dbpath C:\data\db
```

### 7. Run the backend

```bash
cd backend
npm run dev
```

Server starts at: **http://localhost:5000**

### 8. Run the frontend

```bash
cd frontend
npm run dev
```

App opens at: **http://localhost:5173**

---

## First-Time Use

1. Visit **http://localhost:5173/register** and create an account.
2. Default categories (Salary, Food, Rent, etc.) are auto-seeded on registration.
3. Add transactions, create budgets, and view your dashboard charts.

---

## API Documentation

### Auth — `/api/auth`

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register new user, seeds default categories |
| POST | `/api/auth/login` | Login and receive JWT token |
| GET | `/api/auth/me` | Get current authenticated user |

### Transactions — `/api/transactions` *(protected)*

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/transactions` | Get paginated transactions (supports filters: type, categoryId, startDate, endDate, page, limit) |
| POST | `/api/transactions` | Create a new transaction |
| PUT | `/api/transactions/:id` | Update a transaction |
| DELETE | `/api/transactions/:id` | Delete a transaction |

### Budgets — `/api/budgets` *(protected)*

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/budgets?month=&year=` | Get budgets with spent/remaining for given period |
| POST | `/api/budgets` | Create a new monthly budget |
| PUT | `/api/budgets/:id` | Update budget amount |
| DELETE | `/api/budgets/:id` | Delete a budget |

### Categories — `/api/categories` *(protected)*

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/categories?type=` | Get all categories (optionally filter by income/expense) |
| POST | `/api/categories` | Create a new category |
| PUT | `/api/categories/:id` | Update category name/color |
| DELETE | `/api/categories/:id` | Delete category (fails if in use by transactions) |

### Dashboard — `/api/dashboard` *(protected)*

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/dashboard/summary?month=&year=` | Total income, expenses, balance, budget usage % |
| GET | `/api/dashboard/charts?year=` | Data for all 3 charts (pie, bar, budget vs actual) |
| GET | `/api/dashboard/recent-transactions` | Last 5 transactions |

---

## Features

- ✅ **Secure Authentication**: JWT-based session handling using **HttpOnly cookies** (XSS protection).
- ✅ **Transaction Management**: Full CRUD with pagination and advanced filtering (date range, type, category).
- ✅ **Budget Management**: Monthly budget tracking with real-time spending progress and over-budget indicators.
- ✅ **Category Management**: Customizable income and expense categories with color coding.
- ✅ **Dynamic Dashboard**: Financial summaries and interactive charts (Recharts).
- ✅ **Premium UI**: Glassmorphism, smooth transitions, and responsive design tailored for all devices.
- ✅ **Robust Validation**: Server-side request validation using `express-validator` and client-side form logic.
- ✅ **ER Diagram**: Documented database structure for clear architectural understanding.
