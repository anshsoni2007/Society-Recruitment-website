# 🚀 CrewDeck — Campus Society Recruitment & Talent Pipeline

> **Where campus talent finds its crew — streamlined, structured, and transparent.**

CrewDeck transforms chaotic college society recruitments into an end-to-end talent pipeline with dynamic per-club forms, multi-round Kanban boards, structured panel rubric evaluations, self-serve interview booking, real-time stage notifications, and recruitment intelligence analytics.

---

## 🌟 Key Standout Features

- 🎯 **Dynamic Form Engine & Strict Server-Side Deadline Guard**: Custom society questions with strict backend validation. Any submission after the society deadline is rejected (`403 Forbidden: Deadline Expired`), regardless of client-side state.
- 📋 **Multi-Round Applicant Kanban Board**: Drag-and-drop / stage advancement board for Society Leads (*Screening → Technical Task → Panel Interview → Accepted / Rejected*).
- ⚖️ **Standardized Panel Rubric Scoring**: Reviewers grade applicants on 1-10 sliders across *Technical Competence*, *Communication*, *Cultural Fit*, and *Problem Solving* with composite average calculation and recommendation flags (*Strong Yes*, *Yes*, *Maybe*, *No*).
- 📅 **Self-Serve Interview Booking (Calendly-style)**: Shortlisted applicants browse published interview slots and reserve their time window with instant confirmation.
- 📬 **Mock Transactional Email Outbox Drawer**: Built-in developer/admin drawer to preview actual rendered HTML emails (*Application Confirmed*, *Interview Call*, *Official Offer*, *Rejection*).
- 📊 **Recruitment Intelligence Dashboard**: Interactive Recharts analytics covering conversion funnels, category breakdowns, and application velocity.
- 🛡️ **Ironclad RBAC & Security**: Bcrypt password hashing, JWT stateless session cookies with `httpOnly` flags, parameterized queries via Prisma, and server-side role middleware.

---

## 👥 Demo Personas & Test Credentials

The platform includes a **1-Click Demo Persona Switcher** in the top navigation bar, or you can log in with:

| Role | Email | Password | Responsibilities |
| :--- | :--- | :--- | :--- |
| **Student** | `student.ayaan@campus.edu` | `Student@123` | Browse societies, submit applications, track rounds, book interview slots |
| **Student** | `student.priya@campus.edu` | `Student@123` | Multi-club applicant with accepted offer |
| **Society Lead** | `lead.gdg@campus.edu` | `Lead@123` | Manage GDG pipeline, advance Kanban stages, publish interview slots |
| **Panel Reviewer** | `reviewer.tech@campus.edu` | `Reviewer@123` | Grade candidates with multi-criteria rubric scorecard |
| **Super Admin** | `admin@campus.edu` | `Admin@123` | Campus-wide governance, global metrics & analytics |

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14+ (App Router), React 18, TypeScript
- **Database & ORM**: SQLite / PostgreSQL with Prisma ORM (Relational schemas with foreign keys and cascade rules)
- **Styling**: Tailwind CSS, Glassmorphism, Lucide Icons, Recharts
- **Validation**: Zod (Client and Server)
- **Authentication**: JWT + Bcrypt + `httpOnly` secure cookies

---

## 🚀 Running the Project Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Setup Database & Seed Data**:
   ```bash
   npx prisma db push
   node prisma/seed.js
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Run Automated Test Suite**:
   ```bash
   node scripts/test-recruitment-flow.js
   ```
