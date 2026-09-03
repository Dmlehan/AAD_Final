# Sun Baby English — Student Management System

A secure, responsive, full-stack Student Management System designed for **Sun Baby English**. Enables teachers and administrators to manage students, guardians, classes, daily attendance, offline payments with WhatsApp receipts, examinations, marks, and progress reports.

---

## 🛠 Technology Stack

- **Backend:** Java 17 / 18, Spring Boot 3.3.4 (Spring Web, Spring Data JPA, Bean Validation)
- **Frontend:** React 18, Vite 5, React Router 6, Axios, Lucide Icons
- **Database:** MySQL 8.x with Flyway schema versioning
- **Styling:** Custom CSS Design System (clean dark-mode aesthetics, responsive grids, card elevation)
- **Testing:** JUnit 5, Spring Boot Test, MockMvc, In-memory H2 test suite

---

## ⚠️ Important Payment Architecture Rule

> [!IMPORTANT]
> **No Online Payment Gateways:**
> Online gateways such as Stripe, PayPal, card processors, bank checkout APIs, or crypto payments are **strictly disabled**.
> All payments are recorded manually by the teacher/admin with WhatsApp receipt verification (uploading receipt image/PDF, tracking transaction reference, payment dates, and approval status).

---

## 📁 Project Architecture

```text
.
├── backend/                             # Spring Boot 3 Backend
│   ├── .mvn/wrapper/                    # Maven Wrapper
│   ├── src/main/java/com/sunbaby/english/
│   │   ├── config/                      # WebMvc & CORS Configuration
│   │   ├── controller/                  # REST API Controllers (Health, etc.)
│   │   ├── dto/                         # Request/Response contracts (ApiResponse, ApiErrorResponse)
│   │   ├── exception/                   # Centralized RestControllerAdvice & Exceptions
│   │   └── SunBabyApplication.java      # Application entrypoint
│   ├── src/main/resources/
│   │   ├── application.yml              # Base Spring Boot & Datasource Configuration
│   │   ├── application-dev.yml          # Development Profile Configuration
│   │   ├── application-test.yml         # In-memory H2 Test Profile Configuration
│   │   └── db/migration/                # Flyway Migrations (V1__init_schema.sql)
│   ├── src/test/java/com/sunbaby/english/ # Unit & Integration Test Suite
│   ├── pom.xml                          # Maven POM with dependencies & plugins
│   └── mvnw.cmd                         # Maven Windows wrapper
│
├── frontend/                            # React + Vite Frontend
│   ├── public/                          # Static assets (sun.svg, favicon)
│   ├── src/
│   │   ├── api/                         # Centralized Axios client & endpoints
│   │   ├── components/                  # Header, Footer, StatusCard
│   │   ├── layouts/                     # MainLayout
│   │   ├── pages/                       # HomePage, NotFoundPage
│   │   ├── styles/                      # Master Design System (index.css)
│   │   ├── App.jsx                      # App Shell & Routes
│   │   └── main.jsx                     # React entrypoint
│   ├── .env                             # Frontend environment variables
│   ├── package.json                     # Frontend dependencies & scripts
│   └── vite.config.js                   # Vite configuration with backend proxy
│
├── ANTIGRAVITY_PHASE_PROMPTS.md         # 15 Phase Prompts Roadmap
├── PROJECT_SPECIFICATION.md             # Full System Specification
└── README.md                            # Documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Java JDK 17+** (Java 18 installed & verified)
- **Node.js 18+ & npm** (Node v22.15.0 verified)
- **MySQL 8.0+**
- **Git**

### Environment Variables

#### Backend (`backend/src/main/resources/application.yml` or OS Environment):
| Variable | Default Value | Description |
|---|---|---|
| `PORT` | `8080` | Server HTTP port |
| `DB_URL` | `jdbc:mysql://localhost:3306/sunbaby_db?useSSL=false` | MySQL Connection URL |
| `DB_USERNAME` | `root` | Database username |
| `DB_PASSWORD` | `root` | Database password |
| `SPRING_PROFILES_ACTIVE` | `dev` | Active Spring profile (`dev` or `test`) |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173,http://127.0.0.1:5173` | Allowed CORS origins |

#### Frontend (`frontend/.env`):
| Variable | Default Value | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8080/api/v1` | Backend REST API base URL |

---

## 💻 Running the Application

### 1. Database Setup
Ensure MySQL is running and create the database:
```sql
CREATE DATABASE IF NOT EXISTS sunbaby_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Start the Backend
From the root or `backend/` directory:
```powershell
cd backend
mvn spring-boot:run
```
Or with Maven Wrapper:
```powershell
.\mvnw.cmd spring-boot:run
```
The REST API will be active at: `http://localhost:8080/api/v1`
Health check: `http://localhost:8080/api/v1/health`

### 3. Start the Frontend
From the `frontend/` directory:
```powershell
cd frontend
npm install
npm run dev
```
The application will be accessible at: `http://localhost:5173`

---

## 🧪 Running Automated Tests

### Backend Unit & Integration Tests
Execute the isolated test suite (uses in-memory H2, no running MySQL required):
```powershell
cd backend
mvn test
```

### Frontend Production Build Test
Verify the React bundle compiles without errors:
```powershell
cd frontend
npm run build
```

---

## 📡 API Response Conventions

### Success Envelope
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "timestamp": "2026-09-06T19:00:00.000"
}
```

### Error Envelope
```json
{
  "success": false,
  "status": 404,
  "error": "Not Found",
  "message": "Resource not found with id: '123'",
  "path": "/api/v1/resource/123",
  "validationErrors": null,
  "timestamp": "2026-09-06T19:00:00.000"
}
```

---

## 🗺 15-Phase Roadmap Status
- [x] **Phase 1:** Project Audit, Architecture & Base Setup
- [ ] **Phase 2:** Database Foundation & Core Domain Model
- [ ] **Phase 3:** Security, Authentication & User Foundation
- [ ] **Phase 4:** Academic Structure & Settings Management
- [ ] **Phase 5:** Student & Guardian Management
- [ ] **Phase 6:** Class Groups & Student Enrollment
- [ ] **Phase 7:** Attendance Management
- [ ] **Phase 8:** Offline / Manual Payment Tracking & Receipt Management
- [ ] **Phase 9:** Examinations & Marks Entry
- [ ] **Phase 10:** Performance Tracking, Grade Calculation & Progress Reports
- [ ] **Phase 11:** Teacher/Admin Dashboard & Analytics
- [ ] **Phase 12:** Search, Filters, Data Export & Backup Readiness
- [ ] **Phase 13:** UI Polish, Error UX & Production Readiness
- [ ] **Phase 14:** Automated Testing & Verification
- [ ] **Phase 15:** Deployment Readiness & Final Audit
