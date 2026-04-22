# Waygood Study Abroad Platform

A comprehensive, production-ready study abroad platform designed to help students discover universities, plan budgets, receive personalized recommendations, and manage their application lifecycle. Built with a modern MERN stack, Redis caching, and Generative AI integration.

## 🚀 Key Features

### 1. Secure Authentication & Authorization
- **JWT-Based Auth**: Secure endpoints with robust token verification.
- **Role-Based Access Control**: Differentiates between `student` and `counselor` accounts, restricting sensitive operations.
- **Password Security**: Uses `bcrypt` for secure hashing.

### 2. Advanced Discovery Engine
- **Robust Searching**: Explore universities and programs with exact match, regex searches, and range-based filters (e.g., tuition budget, IELTS score).
- **Optimized Pagination**: Built with skip-limit cursor pagination for high-performance data retrieval.

### 3. Recommendation Engine
- **MongoDB Aggregation Pipeline**: Uses an advanced aggregation pipeline to dynamically calculate a `matchScore` for a student by comparing their profile preferences (preferred countries, budget, target field, IELTS) against the entire program catalog.
- Returns personalized program matches instantly.

### 4. Application Workflow & State Machine
- **Application Lifecycle**: Enforces strict transitions from `draft` ➔ `submitted` ➔ `under-review`.
- **History Tracking**: Automatically generates comprehensive timeline history logs for all status updates.
- **Duplicate Prevention**: Uses Mongoose compound indexes and manual pre-flight checks to prevent users from applying to the same program/intake twice.

### 5. Redis Edge Caching
- Integrates **Redis** to cache heavy API responses such as the Dashboard Overview and Popular Universities.
- Drastically reduces database load and speeds up application TTFB (Time to First Byte).
- Fault-tolerant design: API bypasses the cache seamlessly if Redis is unreachable.

### 6. AI Study Plan Assistant
- Deep integration with `@google/genai` (Gemini 2.5 Flash).
- Generates dynamic, personalized study-abroad plans based on natural language prompts from the student.

### 7. Premium Frontend Interface
- **Tailwind CSS v4**: Built with a stunning dark-mode glassmorphic aesthetic.
- **Client-Side Routing**: Utilizes `react-router-dom` to protect the dashboard behind a global `AuthContext`.
- **Axios Interceptors**: Automatically injects JWT session tokens into backend requests.

### 8. Modern ES Modules
- The entire backend is built using modern Node.js ES Modules (`import/export`) for cleaner, forward-compatible architecture.

---

## 🛠️ Tech Stack
- **Database**: MongoDB (Mongoose) + Redis
- **Backend**: Node.js (ESM), Express
- **Frontend**: React (Vite), Tailwind CSS v4, React Router
- **Testing**: Jest, Supertest, MongoDB Memory Server
- **AI**: Google GenAI API

---

## ⚙️ Local Development Setup

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally (default: `mongodb://127.0.0.1:27017/waygood-evaluation`)
- Redis running locally (default: `redis://127.0.0.1:6379`)
- Gemini API Key

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env 
```

**Configure Environment Variables** in `backend/.env`:
```env
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/waygood-evaluation
REDIS_URL=redis://127.0.0.1:6379
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=1d
CACHE_TTL_SECONDS=300
GEMINI_API_KEY=your_actual_google_gemini_api_key
```

**Seed Database & Run:**
```bash
npm run seed  # Populates sample students, universities, and programs
npm run dev   # Starts the backend server on port 4000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev   # Starts the Vite development server
```

Navigate to `http://localhost:5173` in your browser.

---

## 🧪 Testing

The backend includes a comprehensive integration test suite using an isolated ephemeral MongoDB database to prevent pollution.

```bash
cd backend
npm test
```

## 🔐 Sample Seed Credentials
If you ran the seed script, you can log in with:
- **Student**: `aarav@example.com` / `Candidate123!`
- **Student**: `sara@example.com` / `Candidate123!`
- **Counselor**: `counselor@example.com` / `Candidate123!`

*(Or simply use the frontend registration page to create a new account!)*
