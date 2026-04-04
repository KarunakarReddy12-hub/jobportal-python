# JobPortal — Full Stack (Python FastAPI + React)

## Project Structure
```
jobportal-python/
├── backend/        ← Python FastAPI backend
│   ├── main.py           ← App entry point
│   ├── models.py         ← SQLAlchemy DB models
│   ├── schemas.py        ← Pydantic request/response schemas
│   ├── auth.py           ← JWT + password hashing
│   ├── database.py       ← DB connection (SQLite by default)
│   ├── config.py         ← Settings from .env
│   ├── utils.py          ← File upload + serializers
│   ├── requirements.txt  ← Python dependencies
│   ├── .env              ← Environment variables
│   └── routers/
│       ├── user.py       ← /api/v1/user/*
│       ├── company.py    ← /api/v1/company/*
│       ├── job.py        ← /api/v1/job/*
│       └── application.py← /api/v1/application/*
└── frontend/       ← React + Vite + Tailwind CSS
```

---

## Running the Backend (FastAPI)

### Requirements
- Python 3.10 or higher

### Steps

```bash
cd backend

# 1. Create a virtual environment
python -m venv venv

# Activate it:
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Start the server
uvicorn main:app --reload --port 8000
```

Server runs at: **http://localhost:8000**  
Interactive API docs: **http://localhost:8000/docs**

### Database
Uses **SQLite** by default — the file `jobportal.db` is created automatically. No setup needed.

To use **PostgreSQL** instead, edit `.env`:
```
DATABASE_URL=postgresql://user:password@localhost:5432/jobportal
```
Then install: `pip install psycopg2-binary`

---

## Running the Frontend (React)

### Requirements
- Node.js 18+

### Steps

```bash
cd frontend
npm install
npm run dev
```

App runs at: **http://localhost:5173**

---

## How to Use

| Role | Steps |
|------|-------|
| **Student** | Sign Up → select Student → Login → Browse Jobs → Apply |
| **Recruiter** | Sign Up → select Recruiter → Login → Create Company → Post Job → View Applicants |

---

## Bugs Fixed vs Original Project

| # | Bug | Fix Applied |
|---|-----|-------------|
| 1 | Backend crashed if no profile photo uploaded | File is optional in register & updateProfile |
| 2 | Backend crashed if no logo uploaded | File is optional in updateCompany |
| 3 | `succees: true` typo in applicants response | Fixed to `success` |
| 4 | `withCredentials` doesn't work with JWT | Axios interceptor sends `Authorization: Bearer <token>` |
| 5 | Token lost on page refresh | Stored in Redux authSlice + persisted via redux-persist |
| 6 | Login/Signup `useEffect` had empty deps | Added `user` and `navigate` to dependency array |
| 7 | `singleJob?.postion` typo | Fixed to `position` |
| 8 | No `key` prop on SelectItem in PostJob | Added `key={company._id}` |
| 9 | `user?.profile?.skills` crash | Safe guard `?.length > 0` check |
| 10 | `useGetAllJobs` never refetched on search | Added `searchedQuery` to dependency array |
| 11 | Sign Out button missing | Added working Sign Out that clears token |
| 12 | Applicant ID comparison wrong type | `String()` comparison on both sides |
