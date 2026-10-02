# 🚀 CrewDeck — Campus Society Recruitment & Talent Pipeline Platform

> **Where campus talent finds its crew — streamlined, structured, transparent, and intelligent.**

CrewDeck transforms chaotic college society recruitments into an end-to-end talent acquisition and management pipeline. Built for universities, student bodies, and campus organizations, CrewDeck delivers dynamic per-club application forms, multi-round Kanban evaluation boards, standardized panel rubric scoring, self-serve interview booking, real-time in-app notifications, mock email outbox drawers, dark/light theme options, and recruitment intelligence analytics.

---

## 🌟 Key Features & Core Capabilities

### 🎓 1. Dynamic Society Discovery & Application Engine
- **Per-Club Custom Form Builder & Fields**: Societies define custom application questions tailored to their domain (text, long-text, single-select dropdowns, time commitment selectors, portfolio/resume links).
- **Strict Server-Side Deadline Guard**: Dynamic deadline enforcement at both UI (countdown timer) and server API level (`403 Forbidden: Deadline Expired`) to ensure strict fairness.
- **Live Countdown Timers**: Real-time ticker displaying remaining application time per society.
- **Category Filtering & Search**: Filter societies by domain (*Technical*, *Cultural*, *Sports*, *Literary*, *Social Initiative*, *Academic*) and live hiring status (Active vs. Closed deadlines).
- **Application Withdrawal**: Students can withdraw submitted applications at any time, moving the status to `WITHDRAWN`.

### 📋 2. Multi-Round Kanban Applicant Pipeline
- **Drag-and-Drop / Stage Advancement**: Move applicants through custom-defined recruitment stages (e.g., GDG: *Screening → Technical Task → Panel Interview*; DebSoc: *Audition → Live Debate*; Robotics: *CAD Screening → Hardware Lab Challenge → Board Interview*).
- **Stage Management & Quick Actions**: View candidate details, evaluate with rubrics, schedule interview slots, add internal notes, or update statuses in one click.
- **Optimized API Performance**: Parallelized backend data fetching with fast client-side updates.

### ⚖️ 3. Standardized Panel Rubric Evaluation
- **Interactive Multi-Criteria Scorecards**: Standardized scoring on interactive 1–10 sliders across *Technical Competence*, *Communication*, *Cultural Fit*, and *Problem Solving*.
- **Composite Score & Recommendation**: Auto-calculated overall average ratings and qualitative recommendation flags (*Strong Yes*, *Yes*, *Maybe*, *No*).
- **Reviewer Feedback & Notes**: Centralized feedback logs and internal notes accessible by society leads and panel reviewers.

### 📅 4. Self-Serve Interview Booking (Calendly-Style)
- **Time Slot Management**: Society leads create interview slots specifying dates, times, locations (e.g., *Room 402, Student Activity Center (SAC)* or *Google Meet link*), and capacity limits.
- **One-Click Candidate Reservations**: Shortlisted applicants browse available slots and reserve their interview time directly from their dashboard.

### 📬 5. Mock Transactional Email Outbox & In-App Notifications
- **Interactive Email Outbox Drawer**: Slide-out developer/admin drawer to preview rendered HTML email templates (`APPLICATION_SUBMITTED`, `ROUND_ADVANCED`, `INTERVIEW_INVITATION`, `OFFER_LETTER`, `REJECTION`).
- **In-App Notification Center**: Notification dropdown alerting users to round status updates, interview invites, and deadline alerts with unread badges and direct navigation links.

### 📊 6. Recruitment Intelligence Analytics Dashboard
- **Visual Conversion Funnels**: Powered by Recharts to display application throughput from submission to acceptance.
- **Category & Velocity Insights**: Track application volume across society categories and peak submission windows.
- **Campus Governance**: Super Admin overview for managing campus-wide societies, capacity planning, and platform metrics.

### 🎨 7. Modern UI & Theme System
- **1-Click Persona Switcher with Sub-Lead Selector**: Hierarchical switcher in the top navigation bar to test all user roles (Student, Panel Reviewer, Super Admin) and toggle between specific society leads.
- **Light & Dark Theme Engine**: Complete system-wide dark/light mode toggle with glassmorphism styling, custom status badges, initial avatars, confetti triggers on offer acceptance, and responsive navigation.

---

## 👥 Full Demo Personas & Test Credentials

The platform includes a **1-Click Demo Persona Switcher** in the top navigation bar. Alternatively, you can log in manually using any of the following pre-seeded test accounts (Default password for students: `Student@123`, leads: `Lead@123`, reviewer: `Reviewer@123`, admin: `Admin@123`):

### 👑 Super Admin
| Name | Email | Password | Role & Responsibilities |
| :--- | :--- | :--- | :--- |
| **Dr. Rakesh Malhotra** | `admin@campus.edu` | `Admin@123` | Campus-wide governance, global metrics, recruitment analytics, society administration |

### 🛡️ Society Leads
| Name | Email | Password | Assigned Society | Role & Responsibilities |
| :--- | :--- | :--- | :--- | :--- |
| **Arjun Mehta** | `lead.gdg@campus.edu` | `Lead@123` | Google Developer Student Club (GDG) | Lead Organizer & Tech Lead; manages GDG multi-round pipeline & technical tasks |
| **Nandini Kapoor** | `lead.robotics@campus.edu` | `Lead@123` | Autonomous Robotics & AI Guild | President & AI Systems Lead; manages CAD screening, hardware challenge, board interviews |
| **Kabir Sengupta** | `lead.debsoc@campus.edu` | `Lead@123` | The Dialectic Society (DebSoc) | President & Chief Adjudicator; manages speech auditions & parliamentary debates |
| **Aarushi Sethi** | `lead.shutterspeed@campus.edu` | `Lead@123` | ShutterSpeed Visual Arts & Film | President & Creative Director; manages portfolio screening & live photo walk audits |
| **Yuvraj Oberoi** | `lead.crescendo@campus.edu` | `Lead@123` | Crescendo Music Guild | President & Music Director; manages audio screening & live jam auditions |
| **Simran Arora** | `lead.enactus@campus.edu` | `Lead@123` | Enactus Social Enterprise | President & Social Impact Lead; manages social enterprise applications |

### ⚖️ Panel Reviewer
| Name | Email | Password | Role & Responsibilities |
| :--- | :--- | :--- | :--- |
| **Rhea Khanna** | `reviewer.tech@campus.edu` | `Reviewer@123` | Senior Reviewer & Panelist; grades candidate submissions with multi-criteria rubric scorecards |

### 🎓 Students
| Name | Email | Password | Application State & Persona Description |
| :--- | :--- | :--- | :--- |
| **Ayaan Khanna** | `student.ayaan@campus.edu` | `Student@123` | Active applicant with a confirmed interview slot for GDG |
| **Priya Sharma** | `student.priya@campus.edu` | `Student@123` | Multi-club applicant (Accepted into Robotics Guild; Round 2 Advanced for GDG) |
| **Rohan Bhatia** | `student.rohan@campus.edu` | `Student@123` | Submitted applicant undergoing initial screening |

---

## 🏛️ Seeded Campus Societies

| Society Name | Category | Status | Capacity | Description & Recruitment Focus |
| :--- | :--- | :--- | :--- | :--- |
| **Google Developer Student Club (GDG)** | `TECHNICAL` | 🟢 Hiring Active | 30 | Web Dev, Mobile App Dev, AI/ML, Cloud, UI/UX |
| **Autonomous Robotics & AI Guild** | `TECHNICAL` | 🟢 Hiring Active | 28 | Mechanical CAD, Embedded Systems, ROS2, Edge AI |
| **The Dialectic Society (DebSoc)** | `LITERARY` | 🟢 Hiring Active | 26 | Asian & British Parliamentary Debating, Rhetoric |
| **ShutterSpeed Visual Arts & Film** | `CULTURAL` | 🟢 Hiring Active | 27 | Photography, Cinematography, Indie Short Film |
| **Crescendo Music Guild** | `CULTURAL` | 🟢 Hiring Active | 25 | Vocalists, Instrumentalists, Live Jam, Production |
| **Enactus Social Enterprise** | `SOCIAL_INITIATIVE` | 🔴 Deadline Closed | 25 | Sustainable social business models & community impact |

---

## 🛠️ Technology Stack & Architecture

- **Frontend Core**: Next.js 14+ (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons, Recharts, Canvas Confetti
- **Database & ORM**: PostgreSQL (Neon Cloud DB) / SQLite support with Prisma ORM (Relational schema with cascade rules & indexed foreign keys)
- **Security & Authentication**: HTTP-only stateless JWT cookies (`jsonwebtoken`), password hashing (`bcryptjs`), Zod validation schemas, server-side RBAC middleware
- **Automated Tooling**: Custom Node.js database seeding script (200+ realistic student applicants seeded) and end-to-end flow test runner

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/anshsoni2007/Society-Recruitment-website.git
cd Society-Recruitment-website
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
JWT_SECRET="your_jwt_secret_key"
```

### 3. Database Migration & Seeding
Push the database schema and seed all users, societies, custom fields, recruitment rounds, slots, and 200+ applications:
```bash
npx prisma db push
npm run db:seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Automated Testing & Scripts

Run the automated recruitment flow verification script to test authentication, application submission, round progression, evaluation, and interview booking:
```bash
node scripts/test-recruitment-flow.js
```

Available NPM Scripts:
- `npm run dev`: Launch development server.
- `npm run build`: Generate Prisma client and build Next.js application.
- `npm run start`: Start production server.
- `npm run db:push`: Sync Prisma schema with database.
- `npm run db:seed`: Seed database with complete demo dataset.
- `npm run db:studio`: Launch Prisma Studio GUI.

---

## 📁 Repository Structure

```
Society-Recruitment-website/
├── prisma/
│   ├── schema.prisma            # Database models (User, Society, Application, ReviewerScore, etc.)
│   └── seed.js                  # Database seeder (creates 6 societies, 6 leads, 200+ applicants)
├── public/                      # Static branding assets & logos
├── scripts/
│   └── test-recruitment-flow.js # Automated pipeline validation runner
├── src/
│   ├── app/                     # Next.js App Router routes & API endpoints
│   │   ├── admin/               # Super admin governance & recruitment analytics
│   │   ├── api/                 # REST API endpoints (auth, applications, evaluation, interviews, etc.)
│   │   ├── dashboard/           # Student & Society Lead dashboards
│   │   ├── societies/           # Society discovery, filter, & application pages
│   │   ├── login/               # Authentication pages
│   │   └── register/
│   ├── components/              # Reusable UI components
│   │   ├── KanbanBoard.tsx      # Multi-round Kanban candidate pipeline
│   │   ├── RubricScoreModal.tsx # Standardized panel evaluation modal
│   │   ├── InterviewBookingModal.tsx # Candidate interview scheduling modal
│   │   ├── MockEmailDrawer.tsx  # Slide-out HTML email outbox preview
│   │   ├── NotificationDropdown.tsx # In-app notification center
│   │   ├── CountdownTimer.tsx   # Live deadline countdown ticker
│   │   └── Navbar.tsx           # Navigation bar with 1-click persona switcher & theme toggle
│   ├── context/                 # React Context (AuthContext & AppThemeContext)
│   └── lib/                     # Database client & helper utilities
└── README.md
```

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
