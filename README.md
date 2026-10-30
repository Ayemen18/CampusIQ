# CampusIQ – AI-Powered University Student Support and Academic Intelligence Platform

[![React](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript%20%2B%20Tailwind-blue)](https://react.dev/)
[![Express](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green)](https://expressjs.com/)
[![FastAPI](https://img.shields.io/badge/AI%20Service-Python%20%2B%20FastAPI%20%2B%20RAG-teal)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20v8.2-brightgreen)](https://www.mongodb.com/)

**Major Project Domain:** Artificial Intelligence • **Area:** Education  
**Department:** Computer Science & Engineering – Data Science  
**Institution:** Marri Laxman Reddy Institute of Technology (MLRIT - Autonomous)  

**Project Team (Batch A20):**
- **23R21A6754** – Shaik Abdul Kareem Ayemen *(Lead Presenter)*
- **23R21A6704** – Sai Krishna
- **23R21A6755** – Shaik Sameer Basha  

**Project Supervisor & Guide:**
- **Mrs. Arshiya Begum**, Assistant Professor, Dept. of CSE - Data Science, MLRIT

---

## 1. Executive Summary & Problem Statement

Students frequently encounter significant difficulties in locating verified university academic and administrative information scattered across fragmented PDF circulars, college portals, and notice boards. Conventional university inquiry portals lack natural language understanding, while public generative AI models often hallucinate inaccurate institutional policies.

**CampusIQ** resolves this challenge through an end-to-end, multi-tier academic intelligence system combining:
1. **Retrieval-Augmented Generation (RAG):** Context-aware question answering grounded strictly in verified university circulars with source citations, page numbers, and passage snippets.
2. **Personalized Academic Intelligence:** Automated rule-based evaluation of individual attendance compliance, condonation eligibility, exam clearance, and three-tier campus placement eligibility.
3. **Integrated Student & Administrator Portals:** Real-time grievance tracking and redressal with administrative resolutions, notice management, document ingestion, and analytics.

---

## 2. System Architecture & Tech Stack

```
                                  [ User Browser ]
                                         │
                   ┌─────────────────────┴─────────────────────┐
                   ▼                                           ▼
          [ Student Portal ]                          [ Admin Portal ]
    React 18 + TypeScript + Tailwind CSS        React 18 + TypeScript + Tailwind CSS
    Port: 5173                                  Port: 5173
                   │                                           │
                   └─────────────────────┬─────────────────────┘
                                         ▼ (REST / JWT Auth)
                        [ Express.js Backend Server ]
                        Node.js v24 • Port: 5001
                                         │
                   ┌─────────────────────┴─────────────────────┐
                   ▼                                           ▼
      [ MongoDB Database ]                      [ Python FastAPI AI Service ]
      Local Port: 27017                         FastAPI • Uvicorn • Port: 8000
      • Users & Credentials                     • RAG Engine & Vector Retrieval
      • Student Profiles & Records              • 190 Chunks across 10 JSON Files
      • Notices & Grievances                    • Cosine Semantic Matching
      • Audit Trails & Transcripts              • LLM / Synthesized Fallback
```

- **Frontend:** React.js 18, TypeScript, Tailwind CSS, Lucide Icons, Vite.
- **Backend:** Node.js, Express.js, Mongoose, JWT (JSON Web Tokens), Multer.
- **AI Service:** Python 3.9, FastAPI, LangChain abstractions, Scikit-learn Cosine Vector Retrieval, PyPDF.
- **Database:** MongoDB Community Server (v8.2.1).

---

## 3. Implemented Modules

### MODULE 1 – Intelligent Knowledge Base & RAG Engine (Primary Module)
- **Comprehensive Knowledge Dataset:** Exactly **190 verified records** distributed across 10 official categories:
  1. `faculty_information.json` (25 records)
  2. `course_information.json` (20 records)
  3. `examination_schedules.json` (20 records)
  4. `academic_calendar.json` (15 records)
  5. `attendance_policies.json` (15 records)
  6. `placement_policies.json` (15 records)
  7. `campus_services.json` (15 records)
  8. `holidays.json` (15 records)
  9. `hostel_information.json` (20 records)
  10. `faqs.json` (30 records)
  - Also includes **110 labelled training queries** (`training_queries.csv`) and **50 benchmark test queries** (`test_queries.csv`).
- **Semantic Retrieval Engine:** TF-IDF & dense n-gram semantic vector representation with sublinear scaling and keyword boosting for course codes, dates, and names.
- **Grounded Responses with Citations:** Returns direct answers along with document name, page number, relevance score percentage, and excerpted passage.
- **Intelligent Fallback Synthesizer:** If no third-party LLM key is configured, the local verified RAG synthesizer formulates factual answers directly from the top-scoring records with zero hallucinations.
- **Document Management Interface:** Upload academic PDFs and circulars with real-time text chunking and vector index updates.

### MODULE 2 – Personalized Student Intelligence
- **Academic Profiles:** Verified records for final-year students (CGPA, SGPA history across semesters 1–6, active backlogs).
- **Attendance Tracking & Simulator:** Aggregate percentage tracking, subject-wise breakdown table, safe/warning/critical status indicators, and an interactive **Attendance Target Calculator**.
- **Automated Exam Eligibility Engine:**
  - `Aggregate >= 75%`: Regular Hall Ticket Clearance Granted.
  - `65% <= Aggregate < 75%`: Medical Condonation Required (Rs. 1,500 fee + Medical Certificate).
  - `Aggregate < 65%`: Detained for Want of Attendance.
- **Three-Tier Placement Eligibility Engine:**
  - `Tier-1 (Dream > 10 LPA)`: CGPA &ge; 7.5 and 0 active backlogs (Amazon, ServiceNow).
  - `Tier-2 (Core 6–10 LPA)`: CGPA &ge; 6.75 and 0 active backlogs (Epam, Virtusa, TCS Digital).
  - `Tier-3 (Mass 3.5–6 LPA)`: CGPA &ge; 6.0 and &le; 1 active backlog (TCS, Wipro, Cognizant).
- **Personalized Recommendations:** Automated alerts regarding supplementary exam registration, project milestones, and LeetCode preparation.

### MODULE 3 – Student Portal, Administration & Integration
- **Role-Based Access Control (RBAC):** JWT authentication with distinct Student and Administrator views.
- **Grievance Redressal Workflow:** Students submit categorized grievances (Academic, Attendance, Hostel, etc.); Administrators triage submissions, assign handling committees, and publish official remarks that appear directly on the student portal.
- **Official Notice Board:** Create, filter, and broadcast urgent academic circulars.
- **Admin Analytics Dashboard:** System KPIs, attendance risk distribution, knowledge category telemetry, and student roster auditing.

---

## 4. Required Pages Implemented

| Portal | Page Name | Route | Key Features |
|---|---|---|---|
| **Student** | Login / Demo Switcher | `/login` | 1-Click demo credentials fill, role switcher |
| **Student** | Student Dashboard | `/dashboard` | Attendance gauge, CGPA, clearance pills, recommendations |
| **Student** | Ask CampusIQ (AI) | `/ask` | RAG Chatbot, document citations, suggested queries |
| **Student** | Document Search | `/documents` | Category filters, semantic search, record inspection |
| **Student** | Academic Assistance | `/academic-assistance` | Project A20 info, grading scale, MOOC guidelines |
| **Student** | Attendance & Academics | `/attendance` | Subject-wise ledger, attendance goal simulator |
| **Student** | Exam Schedules | `/exams` | Semester VII theory & practical timetable, hall ticket status |
| **Student** | Placements | `/placements` | 3-tier eligibility, recruiter listings, One Job policy |
| **Student** | Notifications | `/notifications` | Circulars, priority badges, category filtering |
| **Student** | Grievances | `/grievances` | Grievance submission form, status tracker with admin remarks |
| **Student** | My Profile | `/profile` | Full academic record, SGPA history across semesters 1–6 |
| **Admin** | Admin Dashboard | `/admin/dashboard` | Executive KPIs, attendance distribution, grievance triage |
| **Admin** | Document Management | `/admin/documents` | Upload PDF/text, chunking status, live vector index |
| **Admin** | Student Management | `/admin/students` | Cohort roster, CGPA/backlog audits, rule recalculation |
| **Admin** | User & Role Management | `/admin/users` | RBAC management, role toggle (Student &harr; Admin) |
| **Admin** | Grievance Management | `/admin/grievances` | Resolution modal, status updates, official remark authoring |
| **Admin** | Academic Notices | `/admin/notices` | Publish, categorize, and delete university notices |
| **Admin** | Analytics & Reports | `/admin/analytics` | Knowledge base category telemetry, placement analytics |
| **Admin** | System Settings | `/admin/settings` | Configure institutional attendance, condonation, and CGPA cutoffs |

---

## 5. Presentation Demo Credentials

The platform is pre-seeded with realistic demonstration accounts. On the **Login Page (`/login`)**, click any of the top **1-Click Presentation Demo Login** buttons:

| Role | Account Name | Email | Password | Details |
|---|---|---|---|---|
| **Student 1** | Shaik Abdul Kareem Ayemen | `student@campusiq.edu` | `student123` | Roll: `23R21A6754`, CGPA: 8.78, Att: 86.4% (Tier-1 Eligible) |
| **Student 2** | Sai Krishna | `krishna@campusiq.edu` | `student123` | Roll: `23R21A6704`, CGPA: 7.62, Att: 68.5% (Condonation Eligible) |
| **Student 3** | Shaik Sameer Basha | `basha@campusiq.edu` | `student123` | Roll: `23R21A6755`, CGPA: 6.95, Att: 78.1% (1 Active Backlog) |
| **Administrator** | Dr. Arshiya Begum (Admin) | `admin@campusiq.edu` | `admin123` | Dean of Academic Affairs & System Administrator |

---

## 6. Setup & Execution Instructions

### Option A: Launch All Services with One Command (Recommended)
From the project root folder:
```bash
./start_all.sh
```

### Option B: Manual Step-by-Step Launch

#### 1. MongoDB Service
Ensure MongoDB is running locally on port 27017:
```bash
mkdir -p data/db
mongod --dbpath ./data/db --bind_ip 127.0.0.1 --port 27017
```

#### 2. Python AI & RAG Engine
```bash
cd ai_service
# Virtual environment is pre-installed at ai_service/venv
./venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
```

#### 3. Express Backend Server
```bash
cd backend
# Seed database (if needed): node seeds/seedData.js
node server.js
# Runs on http://localhost:5001
```

#### 4. React Frontend Web Application
```bash
cd frontend
npm run dev
# Open http://localhost:5173 in any modern browser
```

---

## 7. Verifying Required Demonstration Queries

In the **Ask CampusIQ** interface (`/ask`), test the exact core queries:
1. *"What is the minimum attendance required for semester examinations?"*
   - Cites `faqs.json` / `attendance_policies.json` (75% aggregate requirement, condonation 65%–74.99%, below 65% detention).
2. *"What are the placement eligibility criteria?"*
   - Cites `faqs.json` / `placement_policies.json` (Tier-1 Dream: CGPA &ge; 7.5, zero backlogs).
3. *"When are the upcoming examinations?"*
   - Cites `examination_schedules.json` (VII semester end theory exams from Nov 16 to Nov 28, 2026).
4. *"Explain the attendance policy."*
   - Cites `attendance_policies.json` (Detention rule, medical condonation fee Rs. 1,500, HOD/CoE approval).
5. *"What is the minimum CGPA required for placements?"*
   - Cites `faqs.json` / `placement_policies.json` (Mass recruiters: CGPA &ge; 6.0 with up to 1 backlog permitted).
