# PROJECT_SPECIFICATION.md
# Sun Baby English Student Management System

> **Purpose:** This document is a complete, implementation-oriented specification and modular prompt for Antigravity to design and develop the **Sun Baby English Student Management System** using **Spring Boot, React, MySQL, Spring Security, JWT, and BCrypt**.
>
> **Primary user:** English teacher / administrator managing students, classes, attendance, payments, examinations, marks, grades, and English levels.
>
> **Important:** Build the system as a clean, maintainable full-stack application. Do not put frontend code inside the Spring Boot project. Keep `frontend/` and `backend/` as separate top-level applications.

---

# 1. PROJECT OBJECTIVE

Develop a secure, responsive web-based student management system for **Sun Baby English**.

The system must allow a teacher/administrator to:

- Register and manage students.
- Store parent/guardian information.
- Organize students into classes.
- Maintain school grade and English level separately.
- Record daily attendance.
- Record monthly/class payments.
- Create examinations.
- Enter and update student marks.
- Automatically calculate percentages and result grades where appropriate.
- Track student performance over time.
- Search, filter, and view student profiles.
- Generate useful reports.
- View important information from a dashboard.
- Authenticate securely using JWT.
- Store passwords securely using BCrypt.
- Validate all input.
- Handle errors consistently.
- Provide role-based authorization so protected operations cannot be accessed by unauthorized users.

The application should be suitable for future expansion to multiple teachers, classes, branches, and academic years.

---

# 2. DEVELOPMENT PRINCIPLES

Antigravity must follow these principles:

1. Use a clean layered architecture.
2. Keep frontend and backend completely separate.
3. Use REST APIs between React and Spring Boot.
4. Never expose database credentials to React.
5. Never store plain-text passwords.
6. Never store JWT secrets in source code.
7. Use environment/configuration variables for secrets and deployment-specific settings.
8. Use DTOs rather than exposing JPA entities directly from controllers.
9. Validate request data on the backend.
10. Add frontend validation for good user experience, but never rely on frontend validation alone.
11. Use global exception handling.
12. Use meaningful HTTP status codes.
13. Use database constraints for important integrity rules.
14. Use transactions for multi-step database operations.
15. Use pagination for large lists.
16. Use search and filtering on list screens.
17. Make the UI responsive for desktop, tablet, and mobile.
18. Keep naming consistent and professional.
19. Avoid unnecessary complexity.
20. Write code that another developer can maintain.

---

# 3. TECHNOLOGY STACK

## 3.1 Frontend

Use:

- React.js
- React Router
- Axios
- Modern JavaScript or TypeScript
- Bootstrap or another professional responsive UI framework
- React Hook Form or equivalent form-management library
- A chart library such as Recharts for dashboard/report charts
- Browser local storage or secure cookie strategy for authentication according to the chosen JWT architecture

Recommended frontend structure:

```text
frontend/
├── public/
├── src/
│   ├── api/
│   ├── assets/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   ├── hooks/
│   ├── context/
│   ├── services/
│   ├── utils/
│   ├── validations/
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── package.json
└── README.md
```

## 3.2 Backend

Use:

- Java 17 or newer LTS
- Spring Boot
- Spring Web
- Spring Data JPA
- Hibernate
- Spring Security
- JWT library
- Bean Validation
- MySQL Driver
- Lombok if desired
- Maven

Recommended backend structure:

```text
backend/
├── src/
│   ├── main/
│   │   ├── java/com/sunbaby/english/
│   │   │   ├── config/
│   │   │   ├── controller/
│   │   │   ├── dto/
│   │   │   │   ├── auth/
│   │   │   │   ├── student/
│   │   │   │   ├── parent/
│   │   │   │   ├── classgroup/
│   │   │   │   ├── attendance/
│   │   │   │   ├── payment/
│   │   │   │   ├── exam/
│   │   │   │   ├── mark/
│   │   │   │   └── report/
│   │   │   ├── entity/
│   │   │   ├── repository/
│   │   │   ├── service/
│   │   │   ├── security/
│   │   │   ├── exception/
│   │   │   ├── mapper/
│   │   │   └── util/
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-dev.yml
│   │       ├── application-prod.yml
│   │       └── db/
│   └── test/
├── pom.xml
└── README.md
```

---

# 4. USER ROLES

The first version should support at least:

## ADMIN

Can:

- Log in.
- Create/update/deactivate users.
- Create students.
- Edit students.
- Delete/archive students.
- Manage classes.
- Manage academic years.
- Manage English levels.
- Manage attendance.
- Manage payments.
- Create exams.
- Enter/edit marks.
- View reports.
- View dashboard.

## TEACHER

Can:

- Log in.
- View assigned classes.
- View students.
- Record attendance.
- View student profiles.
- Enter marks.
- View examinations.
- View reports allowed by permissions.
- View payment information if the administrator permits it.

Implement authorization using roles such as:

```text
ROLE_ADMIN
ROLE_TEACHER
```

Do not hard-code authorization rules only in React. The backend must enforce them.

---

# 5. CORE FUNCTIONAL MODULES

Build the system as the following modules:

1. Authentication
2. User Management
3. Student Management
4. Parent/Guardian Management
5. Academic Year Management
6. Grade Management
7. English Level Management
8. Class Management
9. Enrollment Management
10. Attendance Management
11. Payment Management
12. Examination Management
13. Marks/Results Management
14. Student Performance
15. Dashboard
16. Reports
17. Search and Filtering
18. System Settings
19. Audit/logging foundation

---

# 6. AUTHENTICATION AND SECURITY

## 6.1 Login

Create:

```text
POST /api/auth/login
```

Request:

```json
{
  "username": "admin",
  "password": "password"
}
```

Response:

```json
{
  "accessToken": "JWT_TOKEN",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {
    "id": 1,
    "username": "admin",
    "displayName": "Sun Baby Admin",
    "role": "ADMIN"
  }
}
```

## 6.2 JWT

Implement:

- JWT authentication filter.
- JWT token generation.
- JWT token validation.
- Expiration checking.
- User identity extraction.
- Role/authority extraction.
- Protected API endpoints.

Every protected request should use:

```text
Authorization: Bearer <JWT>
```

Do not trust a role sent from the frontend.

The backend must determine the authenticated user's roles from the validated JWT/security context.

## 6.3 JWT secret

Do not place the production secret directly in Git.

Use an environment variable, for example:

```text
JWT_SECRET
```

Use a sufficiently strong random secret.

## 6.4 BCrypt

Use Spring Security's `BCryptPasswordEncoder`.

When creating a user:

```text
plain password
      ↓
BCryptPasswordEncoder
      ↓
password hash
      ↓
database
```

Never:

- Store plain passwords.
- Log passwords.
- Return password hashes in DTOs.
- Send passwords back to the React frontend.

## 6.5 Logout

If using stateless JWT access tokens, frontend logout should remove the locally stored authentication state/token.

For stronger production security, prefer short-lived access tokens and a refresh-token strategy where appropriate.

If refresh tokens are implemented:

- Store refresh tokens securely.
- Rotate/revoke refresh tokens.
- Never expose refresh-token secrets unnecessarily.

---

# 7. BACKEND SECURITY PACKAGE

Recommended:

```text
security/
├── JwtService.java
├── JwtAuthenticationFilter.java
├── CustomUserDetailsService.java
├── SecurityConfig.java
└── AuthenticationEntryPoint.java
```

Configuration responsibilities:

### SecurityConfig

- Configure Spring Security.
- Disable CSRF for a stateless REST API where appropriate.
- Configure session policy as stateless if using stateless access tokens.
- Configure endpoint authorization.
- Register JWT filter.
- Register BCrypt password encoder.
- Configure CORS carefully.

Never use:

```text
permitAll()
```

for protected business endpoints merely to make development easier.

---

# 8. DATABASE DESIGN

Use MySQL.

Suggested database:

```text
sunbaby_english
```

Use UTF-8 compatible encoding.

Recommended naming convention:

- Tables: `snake_case`
- Columns: `snake_case`
- Java entities: PascalCase
- Java fields: camelCase

---

# 9. MYSQL SCHEMA

The following is the logical schema. Antigravity may adjust technical details while preserving the business relationships.

## 9.1 users

```text
users
-----
id BIGINT PK
username VARCHAR(100) UNIQUE NOT NULL
password_hash VARCHAR(255) NOT NULL
display_name VARCHAR(150) NOT NULL
email VARCHAR(150)
role VARCHAR(30) NOT NULL
enabled BOOLEAN NOT NULL DEFAULT TRUE
created_at DATETIME
updated_at DATETIME
```

## 9.2 students

```text
students
--------
id BIGINT PK
student_code VARCHAR(50) UNIQUE NOT NULL
first_name VARCHAR(100) NOT NULL
last_name VARCHAR(100)
date_of_birth DATE
gender VARCHAR(30)
address VARCHAR(500)
telephone VARCHAR(30)
email VARCHAR(150)
admission_date DATE
school_grade_id BIGINT FK
english_level_id BIGINT FK
status VARCHAR(30) NOT NULL
photo_url VARCHAR(500)
notes TEXT
created_at DATETIME
updated_at DATETIME
```

Possible statuses:

```text
ACTIVE
INACTIVE
COMPLETED
TRANSFERRED
ARCHIVED
```

## 9.3 parents

```text
parents
-------
id BIGINT PK
student_id BIGINT FK NOT NULL
full_name VARCHAR(150) NOT NULL
relationship VARCHAR(50)
telephone VARCHAR(30)
secondary_telephone VARCHAR(30)
email VARCHAR(150)
address VARCHAR(500)
is_primary BOOLEAN DEFAULT FALSE
```

## 9.4 academic_years

```text
academic_years
--------------
id BIGINT PK
name VARCHAR(50) UNIQUE NOT NULL
start_date DATE
end_date DATE
active BOOLEAN DEFAULT FALSE
```

Example:

```text
2026
2027
```

## 9.5 school_grades

```text
school_grades
-------------
id BIGINT PK
name VARCHAR(50) UNIQUE NOT NULL
grade_number INT UNIQUE
description VARCHAR(255)
```

Example:

```text
Grade 1
Grade 2
...
Grade 13
```

## 9.6 english_levels

```text
english_levels
--------------
id BIGINT PK
name VARCHAR(100) UNIQUE NOT NULL
level_order INT
description VARCHAR(255)
```

Example:

```text
Beginner
Elementary
Pre-Intermediate
Intermediate
Upper-Intermediate
Advanced
```

## 9.7 class_groups

```text
class_groups
------------
id BIGINT PK
name VARCHAR(100) NOT NULL
academic_year_id BIGINT FK
school_grade_id BIGINT FK
english_level_id BIGINT FK
teacher_id BIGINT FK
day_of_week VARCHAR(20)
start_time TIME
end_time TIME
room VARCHAR(100)
monthly_fee DECIMAL(10,2)
active BOOLEAN DEFAULT TRUE
```

## 9.8 enrollments

```text
enrollments
-----------
id BIGINT PK
student_id BIGINT FK NOT NULL
class_group_id BIGINT FK NOT NULL
enrollment_date DATE NOT NULL
end_date DATE
status VARCHAR(30) NOT NULL
```

Prevent duplicate active enrollment for the same student/class where appropriate.

## 9.9 attendance

```text
attendance
----------
id BIGINT PK
student_id BIGINT FK NOT NULL
class_group_id BIGINT FK NOT NULL
attendance_date DATE NOT NULL
status VARCHAR(20) NOT NULL
remarks VARCHAR(500)
recorded_by BIGINT FK
created_at DATETIME
```

Statuses:

```text
PRESENT
ABSENT
LATE
EXCUSED
```

Add a uniqueness rule such as:

```text
(student_id, class_group_id, attendance_date)
```

so the same attendance record is not accidentally duplicated.

## 9.10 payments

```text
payments
--------
id BIGINT PK
student_id BIGINT FK NOT NULL
class_group_id BIGINT FK
payment_month DATE NOT NULL
amount DECIMAL(10,2) NOT NULL
payment_date DATE NOT NULL
payment_method VARCHAR(30)
reference_number VARCHAR(100)
status VARCHAR(30) NOT NULL
remarks VARCHAR(500)
recorded_by BIGINT FK
created_at DATETIME
updated_at DATETIME
```

Possible payment statuses:

```text
PAID
PARTIAL
PENDING
WAIVED
REFUNDED
```

## 9.11 exams

```text
exams
-----
id BIGINT PK
name VARCHAR(150) NOT NULL
description VARCHAR(500)
exam_date DATE NOT NULL
academic_year_id BIGINT FK
class_group_id BIGINT FK
max_marks DECIMAL(6,2) NOT NULL
pass_marks DECIMAL(6,2)
active BOOLEAN DEFAULT TRUE
created_at DATETIME
```

## 9.12 marks

```text
marks
-----
id BIGINT PK
exam_id BIGINT FK NOT NULL
student_id BIGINT FK NOT NULL
marks_obtained DECIMAL(6,2) NOT NULL
percentage DECIMAL(6,2)
result_grade VARCHAR(20)
rank_position INT
remarks VARCHAR(500)
created_at DATETIME
updated_at DATETIME
```

Add uniqueness:

```text
(exam_id, student_id)
```

## 9.13 Optional audit_logs

```text
audit_logs
----------
id BIGINT PK
user_id BIGINT FK
action VARCHAR(100)
entity_type VARCHAR(100)
entity_id BIGINT
description VARCHAR(1000)
created_at DATETIME
```

Use this for important operations such as:

- Login.
- Student creation.
- Student update.
- Payment creation.
- Mark modification.
- User changes.

---

# 10. ENTITY RELATIONSHIPS

Logical relationships:

```text
User
 ├── records Attendance
 ├── records Payments
 └── may teach ClassGroup

Student
 ├── has many Parents
 ├── belongs to SchoolGrade
 ├── belongs to EnglishLevel
 ├── has many Enrollments
 ├── has many Attendance records
 ├── has many Payments
 └── has many Marks

AcademicYear
 └── has many ClassGroups / Exams

SchoolGrade
 ├── has many Students
 └── has many ClassGroups

EnglishLevel
 ├── has many Students
 └── has many ClassGroups

ClassGroup
 ├── belongs to AcademicYear
 ├── belongs to SchoolGrade
 ├── belongs to EnglishLevel
 ├── has a Teacher
 ├── has many Enrollments
 ├── has many Attendance records
 ├── has many Payments
 └── has many Exams

Exam
 ├── belongs to ClassGroup
 ├── belongs to AcademicYear
 └── has many Marks

Mark
 ├── belongs to Exam
 └── belongs to Student
```

---

# 11. JPA ENTITY REQUIREMENTS

Create entities approximately:

```text
User
Student
Parent
AcademicYear
SchoolGrade
EnglishLevel
ClassGroup
Enrollment
Attendance
Payment
Exam
Mark
AuditLog
```

Use:

- `@Entity`
- `@Table`
- `@Id`
- `@GeneratedValue`
- `@ManyToOne`
- `@OneToMany`
- `@JoinColumn`
- appropriate indexes and unique constraints.

Avoid blindly using `CascadeType.ALL` on every relationship.

Avoid exposing bidirectional entity graphs directly through JSON because of recursion problems.

Use DTOs.

---

# 12. DTO ARCHITECTURE

Do not return entities directly from REST controllers.

Recommended DTOs:

## Authentication

```text
LoginRequest
LoginResponse
UserSummaryResponse
```

## Student

```text
StudentCreateRequest
StudentUpdateRequest
StudentResponse
StudentSummaryResponse
```

## Parent

```text
ParentCreateRequest
ParentUpdateRequest
ParentResponse
```

## Class

```text
ClassGroupCreateRequest
ClassGroupUpdateRequest
ClassGroupResponse
```

## Attendance

```text
AttendanceCreateRequest
AttendanceUpdateRequest
AttendanceResponse
AttendanceSummaryResponse
```

## Payment

```text
PaymentCreateRequest
PaymentUpdateRequest
PaymentResponse
PaymentSummaryResponse
```

## Exam

```text
ExamCreateRequest
ExamUpdateRequest
ExamResponse
```

## Mark

```text
MarkCreateRequest
MarkUpdateRequest
MarkResponse
BulkMarkRequest
```

## Reports

```text
StudentPerformanceResponse
AttendanceReportResponse
PaymentReportResponse
ExamResultReportResponse
DashboardSummaryResponse
```

DTO validation examples:

```java
@NotBlank
@Size
@Email
@NotNull
@Positive
@DecimalMin
@Past
```

---

# 13. REPOSITORIES

Create Spring Data repositories:

```text
UserRepository
StudentRepository
ParentRepository
AcademicYearRepository
SchoolGradeRepository
EnglishLevelRepository
ClassGroupRepository
EnrollmentRepository
AttendanceRepository
PaymentRepository
ExamRepository
MarkRepository
AuditLogRepository
```

Examples of useful query methods:

```text
findByUsername(...)
findByStudentCode(...)
findByStatus(...)
findByClassGroupId(...)
findByStudentId(...)
findByAttendanceDate(...)
findByPaymentMonth(...)
findByExamId(...)
existsByExamIdAndStudentId(...)
```

For reports, use suitable JPQL/native queries or projections.

Use pagination:

```text
Page<Student>
Page<Payment>
Page<Attendance>
Page<Exam>
```

when appropriate.

---

# 14. SERVICE LAYER

Create services:

```text
AuthService
UserService
StudentService
ParentService
AcademicYearService
SchoolGradeService
EnglishLevelService
ClassGroupService
EnrollmentService
AttendanceService
PaymentService
ExamService
MarkService
ReportService
DashboardService
AuditLogService
```

Services must contain business logic.

Controllers should not contain complex business rules.

---

# 15. CONTROLLERS

Recommended controllers:

```text
AuthController
UserController
StudentController
ParentController
AcademicYearController
SchoolGradeController
EnglishLevelController
ClassGroupController
EnrollmentController
AttendanceController
PaymentController
ExamController
MarkController
ReportController
DashboardController
```

Base API path:

```text
/api
```

---

# 16. REST API SPECIFICATION

## Authentication

```text
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
```

## Users

```text
GET    /api/users
GET    /api/users/{id}
POST   /api/users
PUT    /api/users/{id}
PATCH  /api/users/{id}/status
DELETE /api/users/{id}
```

Restrict user-management endpoints to ADMIN unless explicitly authorized otherwise.

## Students

```text
GET    /api/students
GET    /api/students/{id}
POST   /api/students
PUT    /api/students/{id}
PATCH  /api/students/{id}/status
DELETE /api/students/{id}
GET    /api/students/search?query=
GET    /api/students/{id}/performance
GET    /api/students/{id}/attendance
GET    /api/students/{id}/payments
GET    /api/students/{id}/marks
```

Support query parameters:

```text
page
size
sort
search
status
gradeId
englishLevelId
classGroupId
```

## Parents

```text
GET    /api/students/{studentId}/parents
POST   /api/students/{studentId}/parents
PUT    /api/parents/{id}
DELETE /api/parents/{id}
```

## Academic years

```text
GET    /api/academic-years
POST   /api/academic-years
PUT    /api/academic-years/{id}
PATCH  /api/academic-years/{id}/active
```

## Grades

```text
GET    /api/grades
POST   /api/grades
PUT    /api/grades/{id}
DELETE /api/grades/{id}
```

## English levels

```text
GET    /api/english-levels
POST   /api/english-levels
PUT    /api/english-levels/{id}
DELETE /api/english-levels/{id}
```

## Classes

```text
GET    /api/classes
GET    /api/classes/{id}
POST   /api/classes
PUT    /api/classes/{id}
DELETE /api/classes/{id}
GET    /api/classes/{id}/students
POST   /api/classes/{id}/students/{studentId}
DELETE /api/classes/{id}/students/{studentId}
```

## Attendance

```text
GET    /api/attendance
GET    /api/attendance/{id}
POST   /api/attendance
PUT    /api/attendance/{id}
DELETE /api/attendance/{id}
POST   /api/attendance/bulk
GET    /api/attendance/student/{studentId}
GET    /api/attendance/class/{classId}
```

Useful filters:

```text
date
from
to
studentId
classId
status
```

## Payments

```text
GET    /api/payments
GET    /api/payments/{id}
POST   /api/payments
PUT    /api/payments/{id}
DELETE /api/payments/{id}
GET    /api/payments/student/{studentId}
GET    /api/payments/monthly
GET    /api/payments/outstanding
```

## Exams

```text
GET    /api/exams
GET    /api/exams/{id}
POST   /api/exams
PUT    /api/exams/{id}
DELETE /api/exams/{id}
GET    /api/exams/{id}/marks
```

## Marks

```text
GET    /api/marks
GET    /api/marks/{id}
POST   /api/marks
PUT    /api/marks/{id}
DELETE /api/marks/{id}
POST   /api/marks/bulk
GET    /api/marks/student/{studentId}
GET    /api/marks/exam/{examId}
```

## Reports

```text
GET /api/reports/students
GET /api/reports/attendance
GET /api/reports/payments
GET /api/reports/exams
GET /api/reports/performance
```

## Dashboard

```text
GET /api/dashboard/summary
GET /api/dashboard/attendance
GET /api/dashboard/payments
GET /api/dashboard/performance
```

---

# 17. STANDARD API RESPONSE FORMAT

Use consistent response formats.

Successful response:

```json
{
  "success": true,
  "message": "Student created successfully",
  "data": {}
}
```

Error response:

```json
{
  "success": false,
  "message": "Validation failed",
  "timestamp": "2026-09-05T12:00:00",
  "path": "/api/students",
  "errors": {
    "firstName": "First name is required"
  }
}
```

For paginated responses:

```json
{
  "success": true,
  "data": {
    "content": [],
    "page": 0,
    "size": 20,
    "totalElements": 100,
    "totalPages": 5
  }
}
```

---

# 18. EXCEPTION HANDLING

Create:

```text
exception/
├── GlobalExceptionHandler.java
├── ResourceNotFoundException.java
├── BadRequestException.java
├── DuplicateResourceException.java
├── UnauthorizedException.java
└── ApiErrorResponse.java
```

Use:

```java
@RestControllerAdvice
```

Handle at least:

- Resource not found.
- Validation errors.
- Duplicate records.
- Invalid business rules.
- Authentication failures.
- Authorization failures.
- Malformed requests.
- Database constraint violations.
- Unexpected server errors.

Never return stack traces to the frontend in production.

Log technical details on the server while returning safe messages to clients.

---

# 19. VALIDATION AND BUSINESS RULES

## Student

Rules:

- Student code required and unique.
- First name required.
- Email must be valid if provided.
- Date of birth cannot be in the future.
- Admission date should not be invalid.
- Status must be a valid enum.
- Grade must reference an existing grade.
- English level must reference an existing level.

## Attendance

Rules:

- Student must exist.
- Class must exist.
- Student should be enrolled in the class for the attendance date.
- One attendance record per student/class/date.
- Status must be valid.

## Payment

Rules:

- Student must exist.
- Amount must be greater than zero unless the business rule explicitly allows zero.
- Payment date required.
- Payment month required.
- Payment status valid.
- Reference number should be unique when provided if the business requires it.

## Exam

Rules:

- Exam name required.
- Exam date required.
- Maximum marks must be positive.
- Pass marks cannot exceed maximum marks.
- Class must exist.

## Marks

Rules:

```text
0 <= marksObtained <= maxMarks
```

Calculate:

```text
percentage = (marksObtained / maxMarks) * 100
```

Round consistently, e.g. two decimal places.

Prevent duplicate marks for the same student and exam.

---

# 20. RESULT GRADE CALCULATION

Do not hard-code one country's grading scheme without making it configurable.

Create a configurable result-grade strategy.

Example default:

```text
75 - 100 = A
65 - 74  = B
55 - 64  = C
35 - 54  = S
0  - 34  = W
```

Make the grading thresholds configurable in the future.

The system should store the calculated result grade with the mark if that is the selected business design, while retaining the original marks and maximum marks.

---

# 21. REACT APPLICATION

Create:

```text
frontend/src/
├── api/
│   ├── axiosClient.js
│   ├── authApi.js
│   ├── studentApi.js
│   ├── classApi.js
│   ├── attendanceApi.js
│   ├── paymentApi.js
│   ├── examApi.js
│   ├── markApi.js
│   └── reportApi.js
│
├── components/
│   ├── common/
│   ├── dashboard/
│   ├── students/
│   ├── classes/
│   ├── attendance/
│   ├── payments/
│   ├── exams/
│   ├── marks/
│   └── reports/
│
├── layouts/
│   ├── MainLayout.jsx
│   ├── AuthLayout.jsx
│   └── Sidebar.jsx
│
├── pages/
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   ├── students/
│   ├── classes/
│   ├── attendance/
│   ├── payments/
│   ├── exams/
│   ├── marks/
│   ├── reports/
│   └── settings/
│
├── routes/
│   ├── AppRoutes.jsx
│   ├── ProtectedRoute.jsx
│   └── RoleRoute.jsx
│
├── context/
│   └── AuthContext.jsx
│
├── hooks/
├── services/
├── utils/
├── validations/
├── App.jsx
└── main.jsx
```

---

# 22. REACT PAGES

## Authentication

```text
/login
```

Login page:

- Sun Baby English branding.
- Username field.
- Password field.
- Show/hide password.
- Validation.
- Loading state.
- Error message.
- Login button.

## Dashboard

```text
/dashboard
```

Display:

- Total active students.
- Total classes.
- Today's attendance.
- Monthly payments.
- Outstanding payments.
- Upcoming exams.
- Recent student results.
- Attendance chart.
- Payment chart.
- Performance chart.

## Students

```text
/students
/students/new
/students/:id
/students/:id/edit
```

Student list:

- Search.
- Pagination.
- Filters.
- Add student button.
- View.
- Edit.
- Archive/deactivate.

Student profile should show tabs:

```text
Overview
Parents
Class
Attendance
Payments
Exams & Marks
Performance
```

## Classes

```text
/classes
/classes/new
/classes/:id
/classes/:id/edit
```

Display:

- Class name.
- Academic year.
- Grade.
- English level.
- Teacher.
- Schedule.
- Monthly fee.
- Student count.

## Attendance

```text
/attendance
/attendance/take
/attendance/reports
```

Provide a convenient class/date attendance screen:

```text
Student       Present  Absent  Late  Excused
------------------------------------------------
Student 01      ●
Student 02             ●
Student 03                    ●
```

Support bulk saving.

## Payments

```text
/payments
/payments/new
/payments/:id
```

Features:

- Search student.
- Select month.
- Enter amount.
- Payment date.
- Payment method.
- Reference number.
- Status.
- Receipt/reference display.
- Payment history.
- Outstanding payments.

## Exams

```text
/exams
/exams/new
/exams/:id
```

Create an exam and enter marks.

## Marks

```text
/marks
/marks/entry/:examId
```

Bulk mark-entry table:

```text
Student | Max | Obtained | Percentage | Grade | Remarks
```

Allow keyboard-friendly data entry.

## Reports

```text
/reports
/reports/students
/reports/attendance
/reports/payments
/reports/exams
/reports/performance
```

---

# 23. REACT COMPONENT REQUIREMENTS

Reusable components:

```text
Navbar
Sidebar
PageHeader
DataTable
Pagination
SearchBar
FilterPanel
Modal
ConfirmDialog
LoadingSpinner
ErrorAlert
SuccessAlert
EmptyState
StatusBadge
FormInput
FormSelect
DatePicker
CurrencyInput
StudentCard
StudentProfileHeader
AttendanceTable
PaymentTable
MarksTable
StatCard
ChartCard
```

Do not duplicate identical UI logic across pages.

---

# 24. FRONTEND AUTHENTICATION FLOW

Expected flow:

```text
User opens application
        ↓
Login page
        ↓
POST /api/auth/login
        ↓
Backend validates credentials
        ↓
BCrypt password verification
        ↓
JWT generated
        ↓
React receives authentication result
        ↓
Auth state established
        ↓
User redirected to dashboard
        ↓
Axios adds Bearer token to protected requests
        ↓
Backend validates JWT
        ↓
Response returned
```

If the token expires:

```text
API returns 401
        ↓
Clear authentication state
        ↓
Redirect to /login
```

Do not silently ignore 401 errors.

---

# 25. AXIOS CONFIGURATION

Create an Axios instance.

Responsibilities:

- Base URL from environment configuration.
- JSON headers.
- JWT authorization.
- Centralized error handling.
- 401 handling.

Example environment variable:

```text
VITE_API_BASE_URL=http://localhost:8080/api
```

Never commit production secrets.

---

# 26. DASHBOARD REQUIREMENTS

The dashboard should be useful at a glance.

## Top cards

```text
Active Students
Classes
Today's Attendance
This Month's Income
Outstanding Payments
Upcoming Exams
```

## Attendance chart

Show:

- Present.
- Absent.
- Late.
- Excused.

Filter:

```text
Today
This Week
This Month
Custom
```

## Payment chart

Show monthly payment totals.

## Performance

Show:

- Average exam mark.
- Highest-performing students.
- Recent exams.
- Class average.

## Recent activity

Display recent:

- Student registrations.
- Payments.
- Exams.
- Mark entries.

---

# 27. STUDENT MANAGEMENT WORKFLOW

## Create student

```text
Open Students
   ↓
Add Student
   ↓
Enter personal details
   ↓
Enter parent/guardian details
   ↓
Select school grade
   ↓
Select English level
   ↓
Select class
   ↓
Save
   ↓
Backend validation
   ↓
Student created
   ↓
Show success message
```

## Student profile

The profile should clearly display:

```text
Student ID
Full Name
Photo
School Grade
English Level
Class
Status
Parent Contact
Attendance %
Payment Status
Latest Exam Result
Average Mark
```

---

# 28. ATTENDANCE WORKFLOW

Teacher selects:

```text
Class
Date
```

System loads enrolled students.

Teacher selects:

```text
Present
Absent
Late
Excused
```

Optional remarks.

Click:

```text
Save Attendance
```

Backend:

1. Validate class.
2. Validate students.
3. Verify enrollment.
4. Check duplicates.
5. Save transactionally.
6. Return summary.

Attendance percentage:

```text
attendancePercentage =
presentEquivalent / totalRecordedSessions * 100
```

Define clearly how `LATE` and `EXCUSED` are treated. Prefer making this a configurable rule.

---

# 29. PAYMENT WORKFLOW

Teacher/admin:

```text
Select student
      ↓
Select class
      ↓
Select payment month
      ↓
Enter amount
      ↓
Select payment method
      ↓
Enter reference number
      ↓
Save
```

System:

- Validates amount.
- Checks student.
- Checks class/enrollment where applicable.
- Saves payment.
- Updates payment summary.
- Shows receipt/reference information.

Payment methods:

```text
CASH
BANK_TRANSFER
CARD
ONLINE
OTHER
```

Do not store bank/card credentials or sensitive card details.

---

# 30. OUTSTANDING PAYMENT LOGIC

Monthly fee can be taken from the student's class.

Example:

```text
Monthly fee = 5,000
Paid        = 3,000
Outstanding = 2,000
```

Status:

```text
PARTIAL
```

If:

```text
Paid >= Monthly fee
```

then:

```text
PAID
```

Allow administrator override for:

- Waived fees.
- Special discounts.
- Special arrangements.

The exact financial rules should remain configurable.

---

# 31. EXAM WORKFLOW

Admin/teacher:

```text
Create Exam
    ↓
Select Academic Year
    ↓
Select Class
    ↓
Enter Exam Date
    ↓
Set Maximum Marks
    ↓
Set Pass Marks
    ↓
Save
```

Then:

```text
Open Exam
    ↓
System loads enrolled students
    ↓
Enter marks
    ↓
Validate marks
    ↓
Calculate percentage
    ↓
Calculate grade
    ↓
Save marks
```

Support bulk mark submission.

---

# 32. PERFORMANCE WORKFLOW

Student performance page should combine:

- Exam history.
- Average percentage.
- Best result.
- Latest result.
- Attendance.
- Class.
- English level.
- Grade progression.

Example:

```text
Exam              Marks       %       Grade
------------------------------------------------
Term Test 01      72/100      72%     B
Mid Test          81/100      81%     A
Term Test 02      76/100      76%     A
```

Add a performance chart showing percentage by exam/date.

---

# 33. REPORTS

## Student report

Filters:

```text
Grade
English Level
Class
Status
Academic Year
```

Show:

- Student ID.
- Name.
- Grade.
- English level.
- Class.
- Status.

## Attendance report

Filters:

```text
Date range
Class
Student
Status
```

Show:

```text
Total sessions
Present
Absent
Late
Excused
Attendance %
```

## Payment report

Filters:

```text
Month
Class
Student
Payment status
```

Show:

```text
Expected
Paid
Outstanding
```

## Exam report

Show:

```text
Student
Exam
Marks
Percentage
Grade
Rank
```

## Performance report

Show:

```text
Student
Average
Highest
Lowest
Attendance %
English level
```

---

# 34. REPORT EXPORT

The first version should support browser-friendly printable reports.

If PDF/Excel export is implemented:

- PDF export may be generated by the backend.
- Excel export may be generated by the backend.
- Never expose database credentials.

Suggested endpoints:

```text
GET /api/reports/attendance/export
GET /api/reports/payments/export
GET /api/reports/exams/export
GET /api/reports/performance/export
```

---

# 35. SEARCH AND FILTERING

Students:

```text
Search by:
- Student ID
- First name
- Last name
- Telephone
- Email
```

Filters:

```text
Grade
English Level
Class
Status
```

Payments:

```text
Student
Month
Status
Date range
```

Attendance:

```text
Student
Class
Date range
Status
```

Marks:

```text
Student
Exam
Class
Grade
```

---

# 36. UI/UX REQUIREMENTS

Design should look like a modern educational management dashboard.

Use:

- Clean sidebar navigation.
- Responsive tables.
- Cards.
- Consistent buttons.
- Clear status badges.
- Form validation messages.
- Confirmation dialogs before destructive actions.
- Loading states.
- Empty states.
- Success/error notifications.
- Mobile-friendly layout.

Sun Baby English branding should be visible but professional.

Avoid:

- Excessive animation.
- Difficult navigation.
- Tiny text.
- Unnecessary popups.
- Huge forms without sections.

---

# 37. ACCESSIBILITY

Implement reasonable accessibility:

- Labels for form controls.
- Keyboard navigation.
- Visible focus states.
- Good contrast.
- Accessible buttons.
- Semantic HTML where practical.
- Meaningful error messages.

---

# 38. CONFIGURATION

Backend configuration must support environment variables.

Example:

```text
DB_URL
DB_USERNAME
DB_PASSWORD
JWT_SECRET
JWT_EXPIRATION
CORS_ALLOWED_ORIGINS
```

Example development configuration:

```text
spring:
  datasource:
    url: ${DB_URL:jdbc:mysql://localhost:3306/sunbaby_english}
    username: ${DB_USERNAME:root}
    password: ${DB_PASSWORD:password}
```

Do not commit actual production passwords.

Create:

```text
.env.example
```

and document required variables.

---

# 39. DATABASE MIGRATIONS

Prefer a migration system such as:

```text
Flyway
```

Use migrations for:

- Initial schema.
- Constraints.
- Indexes.
- Seed/reference data.

Avoid relying exclusively on:

```text
spring.jpa.hibernate.ddl-auto=create
```

for production.

Development may use:

```text
ddl-auto=validate
```

when migrations are authoritative.

---

# 40. SAMPLE / SEED DATA

Provide development seed data.

Example users:

```text
Admin
username: admin
password: Admin@123
role: ADMIN

Teacher
username: teacher
password: Teacher@123
role: TEACHER
```

**Important:** These are development-only credentials. Force changing/removing them before production.

Sample grades:

```text
Grade 1
Grade 2
Grade 3
Grade 4
Grade 5
Grade 6
Grade 7
Grade 8
Grade 9
Grade 10
Grade 11
Grade 12
Grade 13
```

Sample English levels:

```text
Beginner
Elementary
Pre-Intermediate
Intermediate
Upper-Intermediate
Advanced
```

Create realistic sample:

- 10–20 students.
- Multiple classes.
- Attendance records.
- Payments.
- Exams.
- Marks.

Use fictional data only.

---

# 41. TESTING STRATEGY

Testing is mandatory.

## Backend unit tests

Test:

- Services.
- Validation.
- Grade calculation.
- Payment calculation.
- Attendance calculation.
- Authorization logic.

Use:

```text
JUnit
Mockito
```

## Backend integration tests

Test:

- Authentication.
- Student CRUD.
- Attendance.
- Payments.
- Exams.
- Marks.
- Protected endpoints.

Use:

```text
Spring Boot Test
MockMvc
```

Prefer Testcontainers for database integration tests where practical.

## Frontend tests

Test:

- Login.
- Protected routes.
- Student form.
- Attendance form.
- Payment form.
- Exam mark entry.
- Error states.

Use an appropriate React testing framework such as:

```text
Vitest
React Testing Library
```

## Manual testing

Create a checklist:

```text
[ ] Login works
[ ] Invalid login rejected
[ ] Protected pages require authentication
[ ] Admin-only pages reject teachers
[ ] Student creation works
[ ] Student editing works
[ ] Student search works
[ ] Attendance saves
[ ] Duplicate attendance rejected
[ ] Payment saves
[ ] Payment status correct
[ ] Exam creation works
[ ] Marks validation works
[ ] Percentage calculation correct
[ ] Grade calculation correct
[ ] Reports load
[ ] Logout works
```

---

# 42. API SECURITY TESTS

Verify:

- No protected endpoint is accessible without authentication.
- Invalid JWT returns 401.
- Expired JWT returns 401.
- Insufficient role returns 403.
- User cannot modify another resource where authorization forbids it.
- Password hash is never returned.
- JWT secret is not exposed.
- SQL injection attempts are not directly concatenated into SQL.
- Validation prevents invalid values.

---

# 43. DATABASE INDEXES

Add indexes where useful, especially:

```text
students.student_code
students.first_name
students.status
attendance.attendance_date
attendance.student_id
attendance.class_group_id
payments.payment_month
payments.student_id
payments.status
marks.exam_id
marks.student_id
enrollments.student_id
enrollments.class_group_id
```

Use unique constraints for business identifiers.

---

# 44. TRANSACTION MANAGEMENT

Use `@Transactional` where multiple related changes must succeed or fail together.

Examples:

### Bulk attendance

```text
Validate all
   ↓
Save all
   ↓
Commit
```

If a critical failure occurs:

```text
Rollback
```

### Bulk marks

Validate all marks before committing where practical.

---

# 45. LOGGING

Use structured, useful application logging.

Log:

- Authentication success/failure at appropriate levels.
- Important business operations.
- Exceptions.
- Integration/database problems.

Never log:

- Passwords.
- JWT secrets.
- Sensitive authentication tokens.
- Payment-card data.

---

# 46. CORS

Configure CORS to allow only known frontend origins.

Development example:

```text
http://localhost:5173
```

Production should use the actual deployed frontend origin.

Do not use:

```text
allowedOrigins("*")
```

with credentialed authentication without understanding the security implications.

---

# 47. ERROR STATES IN REACT

Every API-driven page should handle:

```text
Loading
Success
Empty
Validation Error
Unauthorized
Forbidden
Server Error
Network Error
```

Example:

```text
No students found.

Try changing your search or filters.
```

---

# 48. RESPONSIVE DESIGN

The system must work on:

- Desktop.
- Laptop.
- Tablet.
- Mobile.

Tables should become horizontally scrollable or transform into mobile-friendly cards where necessary.

The dashboard should adapt to smaller screens.

---

# 49. AUDIT REQUIREMENTS

For sensitive operations, record:

```text
who
what
when
which entity
```

Examples:

```text
ADMIN created student SB-00012
TEACHER recorded attendance for Class A
ADMIN recorded payment for SB-00012
TEACHER updated marks for Exam 02
```

Do not store unnecessary sensitive data in audit descriptions.

---

# 50. PROJECT DIRECTORY

The final GitHub repository should look approximately like:

```text
sunbaby-english-student-management/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── backend/
│   ├── src/
│   ├── pom.xml
│   ├── .env.example
│   └── README.md
│
├── database/
│   ├── migrations/
│   └── seed/
│
├── docs/
│   ├── PROJECT_SPECIFICATION.md
│   ├── API.md
│   ├── DATABASE.md
│   └── USER_GUIDE.md
│
├── screenshots/
│
├── .gitignore
├── README.md
└── LICENSE
```

---

# 51. README.md REQUIREMENTS

The root README must include:

## Project title

```text
Sun Baby English Student Management System
```

## Description

Explain:

- What the system does.
- Who uses it.
- Main modules.
- Technologies.

## Features

List:

- JWT authentication.
- BCrypt password security.
- Student management.
- Class management.
- Attendance.
- Payments.
- Exams.
- Marks.
- Reports.
- Dashboard.

## Architecture

Explain:

```text
React → REST API → Spring Boot → MySQL
```

## Prerequisites

Example:

```text
Java 17+
Node.js 20+
npm
MySQL 8+
Maven
Git
```

## Installation

Document backend and frontend separately.

## Environment variables

Explain all required variables.

## Database setup

Explain:

- Database creation.
- Migration.
- Seed data.

## Running backend

Example:

```text
cd backend
mvn spring-boot:run
```

## Running frontend

Example:

```text
cd frontend
npm install
npm run dev
```

## Default development login

Document sample credentials but clearly label them as development-only.

## API documentation

Document API location and authentication.

## Testing

```text
mvn test
npm test
```

## Build

Explain production builds.

---

# 52. API DOCUMENTATION

If possible, generate OpenAPI/Swagger documentation.

Suggested:

```text
springdoc-openapi
```

Expose Swagger only as appropriate for development/testing and secure it in production.

Document:

- Endpoint.
- Method.
- Authentication.
- Parameters.
- Request body.
- Response.
- Error responses.

---

# 53. GIT REQUIREMENTS

Use Git from the beginning.

Recommended branches:

```text
main
develop
feature/auth
feature/students
feature/attendance
feature/payments
feature/exams
feature/reports
```

Commit messages should be meaningful:

```text
feat: add student management
feat: implement JWT authentication
feat: add attendance module
fix: prevent duplicate attendance records
test: add payment service tests
docs: update installation instructions
```

Do not commit:

```text
.env
target/
node_modules/
IDE files
production credentials
JWT secrets
database passwords
```

---

# 54. .GITIGNORE

Include at least:

```text
node_modules/
dist/
build/
target/
.idea/
.vscode/
*.log
.env
.env.*
!.env.example
```

Adjust appropriately for the chosen tooling.

---

# 55. DEPLOYMENT ARCHITECTURE

Recommended production architecture:

```text
User Browser
     ↓
React Frontend
     ↓
HTTPS
     ↓
Spring Boot REST API
     ↓
MySQL Database
```

Possible deployment:

```text
Frontend → Static hosting/CDN
Backend  → Java application server/container
Database → Managed MySQL
```

Use HTTPS in production.

---

# 56. BACKEND DEPLOYMENT

Production steps:

1. Set environment variables.
2. Configure production database.
3. Run migrations.
4. Build Spring Boot application.

Example:

```text
mvn clean package
```

Run:

```text
java -jar target/sunbaby-english-backend.jar
```

Configure:

```text
DB_URL
DB_USERNAME
DB_PASSWORD
JWT_SECRET
JWT_EXPIRATION
CORS_ALLOWED_ORIGINS
```

Never place production secrets in GitHub.

---

# 57. FRONTEND DEPLOYMENT

Create production build:

```text
npm install
npm run build
```

Configure:

```text
VITE_API_BASE_URL
```

Deploy the generated build using an appropriate static web host.

Ensure React routing is configured so direct navigation to routes such as:

```text
/students
/attendance
/payments
/reports
```

does not incorrectly return a 404 from the hosting platform.

---

# 58. MYSQL PRODUCTION

Use:

- Strong database password.
- Restricted database access.
- Regular backups.
- Least-privilege database user.
- Encrypted connections where supported.
- Separate development and production databases.

Do not expose MySQL publicly unless absolutely necessary.

---

# 59. BACKUP AND RECOVERY

Provide a documented backup procedure.

Minimum recommendation:

```text
Daily database backup
Weekly backup retention
Regular restore testing
```

Document how to restore a backup.

---

# 60. PERFORMANCE REQUIREMENTS

The first version should support at least:

- Thousands of student records.
- Thousands of attendance records.
- Thousands of payment records.
- Large exam/mark datasets.

Use:

- Pagination.
- Database indexes.
- Efficient queries.
- Lazy loading where appropriate.
- Avoid N+1 query problems.
- Avoid loading all students when only a page is required.

---

# 61. DATA INTEGRITY

Important rules:

```text
Student code must be unique.
Username must be unique.
Exam/student mark must be unique.
Attendance student/class/date must be unique.
Relationships must reference valid records.
```

Use both:

- Application validation.
- Database constraints.

---

# 62. DEVELOPMENT PHASES

Antigravity should implement the system in phases.

## Phase 1 — Project setup

Create:

```text
frontend/
backend/
database/
docs/
```

Configure:

- Spring Boot.
- React.
- MySQL.
- Git.
- Environment configuration.

## Phase 2 — Authentication

Implement:

- User entity.
- BCrypt.
- JWT.
- Login.
- Security filter.
- Role authorization.
- Protected React routes.

Do not proceed until authentication works.

## Phase 3 — Master data

Implement:

- Academic years.
- Grades.
- English levels.
- Users.
- Classes.

## Phase 4 — Students

Implement:

- Student CRUD.
- Parent management.
- Enrollment.
- Search/filter.
- Student profile.

## Phase 5 — Attendance

Implement:

- Daily attendance.
- Bulk attendance.
- Attendance reports.
- Attendance percentage.

## Phase 6 — Payments

Implement:

- Payment entry.
- Payment history.
- Monthly status.
- Outstanding balance.
- Payment reports.

## Phase 7 — Exams and marks

Implement:

- Exam CRUD.
- Bulk mark entry.
- Validation.
- Percentage calculation.
- Grade calculation.
- Performance history.

## Phase 8 — Dashboard and reports

Implement:

- Dashboard cards.
- Charts.
- Reports.
- Filters.
- Printable reports.

## Phase 9 — Testing

Implement:

- Unit tests.
- Integration tests.
- Frontend tests.
- Security tests.
- Manual test checklist.

## Phase 10 — Documentation and deployment

Create:

- README.
- API documentation.
- Database documentation.
- Screenshots.
- Deployment documentation.
- Demo instructions.

---

# 63. DEFINITION OF DONE

The project is not complete until:

### Authentication

- [ ] Login works.
- [ ] BCrypt is used.
- [ ] JWT works.
- [ ] Protected APIs reject unauthenticated users.
- [ ] Roles work.
- [ ] Logout works.

### Students

- [ ] Create student.
- [ ] View student.
- [ ] Edit student.
- [ ] Archive/deactivate student.
- [ ] Search/filter.
- [ ] Parent details.
- [ ] Class enrollment.

### Classes

- [ ] Create class.
- [ ] Assign teacher.
- [ ] Assign grade.
- [ ] Assign English level.
- [ ] Assign students.
- [ ] Schedule information.

### Attendance

- [ ] Record attendance.
- [ ] Bulk attendance.
- [ ] Prevent duplicates.
- [ ] Attendance history.
- [ ] Attendance percentage.
- [ ] Attendance reports.

### Payments

- [ ] Record payment.
- [ ] Payment history.
- [ ] Monthly status.
- [ ] Outstanding amount.
- [ ] Payment reports.

### Exams

- [ ] Create exam.
- [ ] Assign class.
- [ ] Enter marks.
- [ ] Bulk mark entry.
- [ ] Validate marks.
- [ ] Calculate percentage.
- [ ] Calculate grade.
- [ ] View performance.

### Dashboard

- [ ] Student statistics.
- [ ] Attendance statistics.
- [ ] Payment statistics.
- [ ] Upcoming exams.
- [ ] Performance summary.

### Quality

- [ ] Backend tests.
- [ ] Frontend tests.
- [ ] Validation.
- [ ] Global exception handling.
- [ ] Responsive UI.
- [ ] README.
- [ ] Deployment instructions.
- [ ] No secrets committed.
- [ ] Production configuration documented.

---

# 64. ANTIGRAVITY IMPLEMENTATION INSTRUCTIONS

Antigravity must treat this document as the primary software specification.

## Rule 1 — Do not build everything in one step

Implement incrementally.

After each phase:

1. Build.
2. Run tests.
3. Fix errors.
4. Verify API behavior.
5. Verify UI behavior.
6. Update documentation.
7. Commit changes.

## Rule 2 — Backend first for each module

For every business module:

```text
Entity
  ↓
Repository
  ↓
DTO
  ↓
Mapper
  ↓
Service
  ↓
Controller
  ↓
Security
  ↓
Tests
  ↓
React API service
  ↓
React page/components
  ↓
Frontend tests
```

## Rule 3 — Do not expose entities

Always use DTOs at API boundaries.

## Rule 4 — Security is mandatory

Do not bypass authentication to make development easier.

## Rule 5 — Validate on backend

Never assume React validation is enough.

## Rule 6 — Keep business rules centralized

Calculations such as:

```text
percentage
grade
outstanding payment
attendance percentage
```

must be implemented in the service/domain layer rather than duplicated across multiple controllers/components.

## Rule 7 — Maintainability

Use meaningful names and small focused classes.

Avoid giant:

```text
StudentController
```

containing all business logic.

## Rule 8 — Documentation

Whenever an API, database table, configuration variable, or major workflow changes, update the appropriate documentation.

---

# 65. EXPECTED FINAL DELIVERABLES

Antigravity must produce:

```text
1. Complete React frontend
2. Complete Spring Boot backend
3. MySQL database schema/migrations
4. JWT authentication
5. BCrypt password security
6. Role-based authorization
7. Student management
8. Parent management
9. Class management
10. Enrollment management
11. Attendance management
12. Payment management
13. Exam management
14. Marks/results management
15. Student performance
16. Dashboard
17. Reports
18. Search/filtering
19. Validation
20. Global exception handling
21. Unit tests
22. Integration tests
23. Frontend tests
24. Seed/sample data
25. Swagger/OpenAPI documentation where practical
26. Root README.md
27. Frontend README.md
28. Backend README.md
29. Database documentation
30. Deployment documentation
31. Screenshots
32. Clean GitHub repository structure
```

---

# 66. FUTURE EXTENSIONS

Design the architecture so these can be added later without major restructuring:

- Multiple teachers.
- Multiple branches.
- Student/parent portal.
- SMS notifications.
- WhatsApp notifications.
- Email notifications.
- Online payments.
- Invoice/receipt PDF generation.
- Certificates.
- Homework management.
- Lesson planning.
- Timetable management.
- Teacher payroll.
- Expense tracking.
- Student promotion.
- English-level progression.
- Parent notifications.
- Mobile application.
- Cloud storage for student photos/documents.
- Advanced analytics.

Do not implement all future features in version 1 unless specifically requested.

---

# 67. FINAL QUALITY CHECK

Before declaring the project finished, Antigravity must verify:

```text
[ ] frontend builds successfully
[ ] backend builds successfully
[ ] tests pass
[ ] MySQL schema works
[ ] migrations work from a clean database
[ ] seed data works
[ ] login works
[ ] JWT works
[ ] BCrypt works
[ ] roles work
[ ] protected routes work
[ ] student CRUD works
[ ] class management works
[ ] attendance works
[ ] payments work
[ ] exams work
[ ] marks work
[ ] reports work
[ ] dashboard works
[ ] validation works
[ ] errors are handled
[ ] responsive UI works
[ ] no secrets are committed
[ ] README is complete
[ ] deployment instructions are complete
```

---

# 68. FINAL ANTIGRAVITY PROMPT

Build the **Sun Baby English Student Management System** according to every requirement in this specification.

Use a production-quality architecture based on:

```text
React
   ↓
REST API
   ↓
Spring Boot
   ↓
Spring Security + JWT + BCrypt
   ↓
Spring Data JPA / Hibernate
   ↓
MySQL
```

The system must be secure, modular, responsive, maintainable, testable, and documented.

Start with project scaffolding and authentication. Then implement each module in the development phases specified above.

Do not skip validation, exception handling, authorization, database constraints, testing, documentation, or environment configuration.

Do not use fake frontend-only data for completed features. Connect the React frontend to the real Spring Boot REST API.

Do not expose passwords, password hashes, JWT secrets, database credentials, or other sensitive configuration to the frontend or Git repository.

Use fictional seed data for development.

At every phase, run the application and tests, fix compilation/runtime errors, and verify that existing functionality continues to work.

The final result must be a complete, runnable **Sun Baby English Student Management System**, not merely a UI prototype.

---

# 69. PROJECT SUCCESS CRITERIA

The project will be considered successful when a teacher can perform this complete workflow:

```text
LOGIN
  ↓
OPEN DASHBOARD
  ↓
CREATE / VIEW STUDENT
  ↓
ASSIGN GRADE + ENGLISH LEVEL
  ↓
ASSIGN CLASS
  ↓
RECORD ATTENDANCE
  ↓
RECORD MONTHLY PAYMENT
  ↓
CREATE EXAM
  ↓
ENTER STUDENT MARKS
  ↓
VIEW CALCULATED RESULT
  ↓
VIEW STUDENT PERFORMANCE
  ↓
VIEW ATTENDANCE HISTORY
  ↓
VIEW PAYMENT HISTORY
  ↓
GENERATE / VIEW REPORTS
  ↓
LOGOUT
```

All steps must be backed by the real database and protected REST APIs.

**End of PROJECT_SPECIFICATION.md**
