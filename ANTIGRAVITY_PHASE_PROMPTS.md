# ANTIGRAVITY — Sun Baby English Student Management System
## 15 Copy-Paste-Ready Development Phase Prompts

> Run these prompts **one at a time and in order** in Antigravity.
>
> **Stack:** Spring Boot + React + MySQL + Flyway
>
> **Critical payment requirement:** There is **NO online payment gateway**. Payments are recorded manually by the teacher/admin, with optional receipt image/PDF upload.

---

# GLOBAL RULES — APPLY TO EVERY PHASE

Every prompt below must follow these rules:

1. Work **only on the requested phase**.
2. Do not implement future-phase business features unless a strict technical dependency is required.
3. Before changing code, inspect the existing repository, architecture, Git status, database migrations, APIs, tests, and package versions.
4. Preserve all completed functionality from previous phases.
5. Do not blindly recreate, overwrite, or delete working code.
6. Follow `Controller → Service → Repository` and use DTOs for API contracts.
7. Keep backend business rules authoritative; do not duplicate them in React.
8. Use Flyway for database schema changes.
9. Do not modify already-applied migrations unnecessarily.
10. Do not hard-code passwords, JWT secrets, database credentials, or production configuration.
11. Never store passwords in plaintext.
12. Never expose uploaded receipts through a public static directory.
13. Add validation at API boundaries.
14. Handle frontend loading, empty, success, validation, and error states.
15. Keep the UI responsive.
16. Do **not** add Stripe, PayPal, card processing, bank-payment APIs, crypto payments, checkout pages, or any online payment gateway.
17. Payments mean manually recorded class-fee payments plus optional receipt upload.
18. After implementation, always:
   - build backend;
   - run backend tests;
   - build frontend;
   - run frontend tests/lint/type checks;
   - fix every error;
   - manually verify the feature;
   - inspect Git diff/status;
   - create a meaningful Git commit;
   - report the exact commit hash.
19. **Do not start the next phase.**
20. If a future feature is discovered, document it and leave it for that phase.

---

# PHASE 1 — PROJECT AUDIT, ARCHITECTURE & BASE SETUP

## Copy-paste this prompt

```text
Implement ONLY PHASE 1: PROJECT AUDIT, ARCHITECTURE & BASE SETUP for the Sun Baby English Student Management System.

TECH STACK
- Backend: Spring Boot
- Frontend: React
- Database: MySQL
- Database migrations: Flyway
- Future authentication: Spring Security + JWT + BCrypt

IMPORTANT PRODUCT RULE
There is NO online payment gateway.
Future payments will be manually recorded by the teacher/admin and may have a receipt image/PDF attached.

FIRST — INSPECT THE REPOSITORY
Before changing anything:
1. Inspect the entire repository structure.
2. Identify frontend/backend directories.
3. Inspect pom.xml/build.gradle and package.json.
4. Inspect Java, React, configuration, database and test files.
5. Inspect existing Git branch/status/history.
6. Determine whether previous implementation exists.
7. Preserve useful existing code.

ARCHITECTURE
Normalize the project into a maintainable structure where necessary.

Backend:
- config
- controller
- dto
- entity
- repository
- service
- exception
- security
- mapper/util where appropriate

Frontend:
- components
- pages
- layouts
- routes
- services/api
- hooks/context/store
- types
- utils
- assets

Do not create meaningless empty structures.

BASE CONFIGURATION
Set up/verify:
- Spring Boot configuration
- MySQL datasource using environment variables
- Flyway
- CORS for local development
- React environment configuration
- centralized API base URL
- logging
- development/test configuration

Do not hard-code secrets.

API FOUNDATION
Create or normalize:
- consistent success response structure
- consistent error response structure
- centralized exception handling
- validation error handling
- resource-not-found handling
- bad-request handling
- unauthorized/forbidden handling
- generic server errors

DATABASE
Verify MySQL connectivity and Flyway configuration.
Do not create all future business tables yet unless required by existing code.

README
Document:
- project purpose
- stack
- prerequisites
- local setup
- environment variables
- MySQL setup
- migration commands
- frontend/backend run commands
- test commands
- project structure

Do not implement authentication, students, attendance, payments, exams, reports or dashboard in this phase.

ACCEPTANCE
- Backend starts and compiles.
- Frontend starts/builds.
- MySQL configuration is externalized.
- Flyway works.
- Base API/error handling works.
- Existing functionality remains intact.

FINALIZATION
Run backend build and all backend tests.
Run frontend build and all available frontend checks.
Fix all errors.
Manually verify startup.
Review Git diff/status.
Commit:
"feat: establish project architecture and base configuration"
Return the exact commit hash and a concise test summary.
STOP. Do not start Phase 2.
```

---

# PHASE 2 — DATABASE FOUNDATION & CORE DOMAIN MODEL

## Copy-paste this prompt

```text
Implement ONLY PHASE 2: DATABASE FOUNDATION & CORE DOMAIN MODEL.

Previous Phase 1 is complete and committed.

FIRST
Inspect the current repository, latest Git commit, architecture, migrations, tests and configuration.
Preserve all previous work.

Prepare a clean domain/database foundation for:
- users
- students
- parents/guardians
- academic years
- school grades
- English levels
- class groups
- enrollments
- attendance
- payments
- receipt metadata
- exams
- marks
- audit logs

Do not implement complete business workflows yet.

CORE TABLES

users:
- id
- username/email
- password_hash
- role
- active
- created_at
- updated_at

students:
- id
- student_code
- first_name
- last_name
- full_name
- date_of_birth
- gender where appropriate
- school_grade_id
- address
- phone
- email
- notes
- active
- created_at
- updated_at

parents/guardians:
- id
- name
- relationship
- phone
- email
- address

Support a student having one or more guardians.

academic_years:
- id
- name
- start_date
- end_date
- active

school_grades:
- id
- name
- display_order
- active

english_levels:
- id
- name
- description
- display_order
- active

class_groups:
- id
- name
- academic_year_id
- school_grade_id and/or english_level_id
- day_of_week
- start_time
- end_time
- room/location
- active

enrollments:
- id
- student_id
- class_group_id
- enrollment_date
- status
- notes

attendance:
Prepare a suitable schema but do not build the complete UI workflow.

payments:
- id
- student_id/enrollment_id as appropriate
- payment_date
- payment_period
- amount
- payment_method
- reference_number
- status
- notes
- created_by
- created_at
- updated_at

receipt metadata:
- payment_id
- original_file_name
- stored_file_name/key
- content_type
- file_size
- storage_key/path
- uploaded_at
- uploaded_by

Do not implement actual receipt uploading in this phase.

exams/marks:
Prepare the domain foundation only.

audit_logs:
Prepare a generic structure if appropriate.

RELATIONSHIPS
Use proper foreign keys and useful indexes.
Use sensible unique constraints.
Use appropriate nullable/non-nullable fields.
Prevent obvious duplicates.

MIGRATIONS
Use versioned Flyway migrations.
Do not unnecessarily rewrite already-applied migrations.

JPA
Use relationships carefully.
Avoid unnecessary eager loading.
Keep persistence concerns separate from API DTOs.

TESTS
Add repository/database tests for important constraints and relationships.

ACCEPTANCE
- Schema migrates successfully.
- Foreign keys and constraints work.
- Core entities compile.
- Repository tests pass.
- Phase 1 remains working.
- No online payment functionality exists.
- Receipt metadata is ready for future Phase 7.

FINALIZATION
Build backend.
Run all backend tests.
Build frontend.
Run all frontend checks.
Fix all errors.
Review Git diff/status.
Commit:
"feat: establish core student management data model"
Return exact commit hash and test summary.
STOP. Do not start Phase 3.
```

---

# PHASE 3 — JWT AUTHENTICATION, SPRING SECURITY & USER MANAGEMENT

## Copy-paste this prompt

```text
Implement ONLY PHASE 3: JWT AUTHENTICATION, SPRING SECURITY & USER MANAGEMENT.

Previous phases are complete and committed.

SECURITY REQUIREMENTS
- Spring Security
- JWT access tokens
- BCrypt password hashing
- No plaintext passwords
- No password hashes in API responses
- No secrets committed to Git
- Roles: ADMIN and TEACHER

FIRST
Inspect current architecture, user schema, APIs and tests.
Preserve all previous functionality.

IMPLEMENT
1. User entity/repository/service as required.
2. BCrypt password hashing.
3. Login endpoint.
4. JWT generation.
5. JWT validation filter.
6. Spring Security configuration.
7. Role-based authorization.
8. GET /api/auth/me
9. Appropriate logout/session strategy.
10. User activation/deactivation.
11. Admin user-management APIs.

Possible endpoints:
POST /api/auth/login
GET /api/auth/me
GET /api/users
GET /api/users/{id}
POST /api/users
PUT /api/users/{id}
PATCH /api/users/{id}/status

Never expose password hashes.

JWT configuration must use environment/configuration variables for:
- JWT secret
- expiration

FRONTEND
Implement:
- login page
- auth context/store
- protected routes
- centralized authenticated API handling
- login redirect
- role-aware navigation

Do not put passwords or tokens into logs.

AUTHORIZATION
ADMIN:
- full administrative access

TEACHER:
- normal teaching functionality
- no sensitive admin-only user-management actions

VALIDATION
- unique username/email
- required password
- sensible password policy
- valid role
- inactive users cannot login

TESTS
Backend:
- BCrypt
- successful login
- invalid credentials
- inactive user
- JWT validation
- protected endpoint
- role authorization

Frontend:
- login
- protected routes
- authentication state

Development seed users may be provided only through a configurable development mechanism. Never commit production credentials.

ACCEPTANCE
JWT works.
BCrypt works.
Protected APIs reject unauthenticated users.
Role restrictions work.
Passwords are never returned.
Secrets are externalized.

FINALIZATION
Build backend.
Run all backend tests.
Build frontend.
Run frontend checks.
Fix errors.
Manually verify login and role access.
Commit:
"feat: implement jwt authentication and role-based security"
Return exact commit hash and test summary.
STOP. Do not start Phase 4.
```

---

# PHASE 4 — MASTER DATA: YEARS, GRADES, LEVELS & CLASSES

## Copy-paste this prompt

```text
Implement ONLY PHASE 4: MASTER DATA MANAGEMENT.

Previous phases are complete and committed.

Manage:
- Academic Years
- School Grades
- English Levels
- Class Groups

FIRST
Inspect existing database/API/security design.
Do not break authentication.

ACADEMIC YEARS
CRUD:
- name
- start date
- end date
- active/current

Rules:
- end date >= start date
- avoid conflicting current/active years
- prevent destructive deletion when referenced
- prefer deactivate/archive

SCHOOL GRADES
CRUD:
- name
- display order
- active

Do not hard-code grades into business logic.

ENGLISH LEVELS
CRUD:
- name
- description
- display order
- active

Allow teacher/admin configuration.

CLASS GROUPS
CRUD:
- name
- academic year
- school grade and/or English level
- day
- start time
- end time
- room/location
- active

Rules:
- valid time range
- referenced records must exist
- prevent obvious duplicates
- filters by year/grade/level

BACKEND
Use Controller → Service → Repository → DTO.
Add pagination/filtering where useful.

FRONTEND
Create clean management pages:
- tables
- add/edit forms
- search/filter
- validation
- active/inactive
- confirmation dialogs
- loading/empty/error states

AUTHORIZATION
ADMIN has full management access.
TEACHER can use relevant master data according to permissions.

Do not implement enrollment yet.

TESTS
Test CRUD, validation, duplicate prevention, relationships, authorization and filters.

ACCEPTANCE
Master data is stable and ready for student/enrollment features.

FINALIZATION
Build/test backend.
Build/test frontend.
Fix all issues.
Manually verify key workflows.
Commit:
"feat: add academic and class master data management"
Return exact commit hash.
STOP. Do not start Phase 5.
```

---

# PHASE 5 — STUDENTS, GUARDIANS & ENROLLMENT

## Copy-paste this prompt

```text
Implement ONLY PHASE 5: STUDENT, PARENT/GUARDIAN & ENROLLMENT MANAGEMENT.

Previous phases are complete and committed.

FIRST
Inspect existing student/master-data/security/database contracts.
Preserve compatibility.

STUDENT
Implement:
- create
- view
- edit
- deactivate/archive
- search
- filtering
- pagination
- profile

Fields:
- student code
- first name
- last name
- full name
- date of birth
- gender where appropriate
- school grade
- address
- phone
- email
- notes
- active

STUDENT CODE
Use a maintainable unique student-code strategy.
Do not expose internal database IDs as the primary human-facing code.

GUARDIANS
Implement:
- create/edit
- relationship
- phone
- email
- address
- attach to student
- multiple guardians where supported

ENROLLMENT
Implement:
- student
- class
- enrollment date
- status
- notes
- active enrollment
- enrollment history

Rules:
- student must exist
- class must exist
- prevent duplicate active enrollment in same class
- preserve history
- do not destroy historical records unnecessarily

SEARCH/FILTER
Support:
- student code
- name
- phone
- class
- grade
- English level
- active status

FRONTEND
Create:
- student list
- student form
- profile
- guardian management
- enrollment form
- history

Do not implement attendance, payments, receipts, exams, marks or reports.

TESTS
Student CRUD.
Unique code.
Guardian relationships.
Enrollment.
Duplicate enrollment.
Authorization.
Filtering.

ACCEPTANCE
Teacher can create a student, add a guardian, enroll the student, and view the profile/history.

FINALIZATION
Build/test backend and frontend.
Fix all errors.
Manually test the complete workflow.
Commit:
"feat: implement student guardian and enrollment management"
Return exact commit hash.
STOP. Do not start Phase 6.
```

---

# PHASE 6 — ATTENDANCE

## Copy-paste this prompt

```text
Implement ONLY PHASE 6: ATTENDANCE MANAGEMENT.

Previous phases are complete and committed.

FIRST
Inspect students, enrollments, classes, security and database.
Do not redesign completed modules unnecessarily.

ATTENDANCE STATUSES
- PRESENT
- ABSENT
- LATE
- EXCUSED

WORKFLOW
Teacher selects:
1. academic year
2. class
3. date

Display enrolled students.
Teacher can mark status and save.

Implement:
- create
- edit
- history
- filters by date/student/class/status
- bulk marking

RULES
- only enrolled students appear
- prevent duplicate attendance for same student/class/date
- valid attendance date
- preserve history
- role authorization

SUMMARY
For each student:
- total sessions
- present
- absent
- late
- excused
- attendance percentage

Choose and document one denominator rule for EXCUSED and use it consistently.

FRONTEND
Create:
- attendance page
- class/date selectors
- student table
- bulk marking
- save
- history
- summary

Support:
- mark all present
- reset before save
- unsaved-change warning if practical

Do not implement payments, receipts, exams, marks or reports.

TESTS
Creation.
Editing.
Duplicate prevention.
Statuses.
Enrollment filtering.
Percentage calculation.
Authorization.

ACCEPTANCE
Teacher can mark, save, edit and review attendance.

FINALIZATION
Build/test backend and frontend.
Fix all errors.
Manually test attendance.
Commit:
"feat: implement attendance management"
Return exact commit hash.
STOP. Do not start Phase 7.
```

---

# PHASE 7 — MANUAL PAYMENTS + SECURE RECEIPT UPLOAD

## Copy-paste this prompt

```text
Implement ONLY PHASE 7: MANUAL PAYMENTS + RECEIPT UPLOAD.

THIS IS A CRITICAL PRODUCT REQUIREMENT:

DO NOT IMPLEMENT ANY ONLINE PAYMENT GATEWAY.

Do NOT add:
- Stripe
- PayPal
- card checkout
- automatic card charging
- bank API payment processing
- crypto payment
- online payment links
- payment gateway callbacks

Payments are manually recorded by the teacher/admin. A receipt image/PDF may be attached.

FIRST
Inspect:
- students
- enrollments
- authentication
- database
- existing storage configuration
- API conventions

PAYMENT RECORD
Implement:
- student
- enrollment where appropriate
- payment date
- payment period/month
- amount
- payment method
- reference number
- status
- notes
- created by
- timestamps

Suggested methods:
- CASH
- BANK_TRANSFER
- OTHER

BANK_TRANSFER is only a manually recorded method; it is NOT online payment processing.

Suggested statuses:
- RECORDED
- CANCELLED

RECEIPT UPLOAD
Allowed:
- PDF
- JPG/JPEG
- PNG
- WEBP only if safely supported

Maximum size:
- configurable, default around 10 MB

Do not trust file extension alone.

Validate:
- extension
- declared MIME type
- actual file signature/magic bytes where practical
- file size
- non-empty content

Reject:
- executables
- scripts
- unsupported archives
- HTML disguised as an image
- dangerous file types

STORAGE
Create a storage abstraction such as:
ReceiptStorageService

Initial implementation may use local filesystem storage.

Requirements:
- configurable storage directory
- unique generated storage name
- original filename stored only as metadata
- no path traversal
- no user-controlled filesystem path
- physical files outside React public/static directory

Do not store receipt bytes in MySQL unless there is a strong documented reason.

RECEIPT METADATA
Store:
- payment id
- original file name
- stored file name/key
- content type
- file size
- storage key/path
- uploaded by
- uploaded timestamp

SECURE ACCESS
Do NOT create public URLs such as:
GET /uploads/receipt.pdf

Instead use authenticated endpoints such as:
GET /api/payments/{id}/receipt
or
GET /api/receipts/{receiptId}/download

Verify authorization before returning a receipt.
Never expose server filesystem paths.

PAYMENT WORKFLOW
1. Select student.
2. Select payment period.
3. Enter amount.
4. Select payment method.
5. Enter optional reference.
6. Add notes.
7. Upload receipt.
8. Preview when practical.
9. Save.
10. Backend validates.
11. Payment and receipt metadata persist.
12. File is stored securely.
13. Payment history shows receipt availability.
14. Authorized user can view/download receipt.

TRANSACTION/ROLLBACK
Avoid:
- database payment with missing receipt
- receipt file with no payment

Filesystem and DB are not automatically atomic, so implement safe cleanup/rollback behavior and document it.

RECEIPT REPLACEMENT
Allow authorized users to replace receipts.
Store the new file safely before removing the old one where practical.
Clean orphaned files safely.

PAYMENT HISTORY
Implement:
- student history
- date filter
- payment period filter
- method filter
- amount
- receipt availability
- created by

FRONTEND
Create:
- payment list
- record payment form
- receipt upload
- file validation
- image preview
- PDF indicator
- payment detail
- secure receipt view/download
- replace receipt

Display clearly:
"Online payment is not supported. Payments are recorded manually."

VALIDATION
- amount > 0
- valid payment date
- valid student
- valid payment period
- valid file

SECURITY TESTS
Test:
- unauthorized download
- authorized download
- invalid type
- fake MIME type
- oversized file
- path traversal
- missing file
- replacement
- orphan cleanup
- payment validation

Never log receipt contents.

ACCEPTANCE
Teacher/admin can manually record a payment, upload a receipt, see it attached, securely access it later, and replace it.

There is NO online payment gateway.

FINALIZATION
Build backend.
Run all backend tests including upload/security tests.
Build frontend.
Run frontend checks.
Manually test valid and invalid receipt uploads, secure access, replacement and payment history.
Fix every error.
Review Git diff/status.
Commit:
"feat: add manual payments and secure receipt uploads"
Return exact commit hash and test summary.
STOP. Do not start Phase 8.
```

---

# PHASE 8 — EXAMS, MARKS & AUTOMATIC GRADING

## Copy-paste this prompt

```text
Implement ONLY PHASE 8: EXAMS, MARKS & AUTOMATIC GRADING.

Previous phases are complete and committed.

FIRST
Inspect students, classes, enrollments, security, database and API conventions.

EXAMS
Implement:
- exam name
- exam date
- academic year
- class/grade/level
- maximum marks
- description
- status

Statuses:
- DRAFT
- PUBLISHED
- CLOSED

MARKS
Implement:
- exam
- student
- marks obtained
- remarks
- entered by
- timestamps

Rules:
- marks >= 0
- marks <= maximum
- student must be eligible
- no duplicate mark for same exam/student

GRADING
Implement centralized/configurable grading logic.
Do not put grading rules only in React.

Support grades such as:
A+
A
B
C
S
W

The actual ranges must be configurable or centralized and documented.

Backend calculates:
- percentage
- grade
- pass/fail where applicable

FRONTEND
Create:
- exam list
- create/edit exam
- mark entry
- bulk mark entry
- student results
- grade display
- validation

PERMISSIONS
Teacher can manage exams/marks within allowed scope.
Admin has full access.

Do not implement full reports yet.

TESTS
Exam CRUD.
Mark validation.
Duplicate prevention.
Grade calculation.
Permissions.
Bulk save.

ACCEPTANCE
Teacher can create an exam, enter marks, save them, and receive automatic results.

FINALIZATION
Build/test backend.
Build/test frontend.
Fix errors.
Manually test exam and marks.
Commit:
"feat: implement exams marks and grading"
Return exact commit hash.
STOP. Do not start Phase 9.
```

---

# PHASE 9 — STUDENT PERFORMANCE & PROGRESS

## Copy-paste this prompt

```text
Implement ONLY PHASE 9: STUDENT PERFORMANCE & PROGRESS.

Previous phases are complete and committed.

Use existing student, enrollment, attendance, exam, mark and grading data.
Do not duplicate business logic.

PERFORMANCE PROFILE
Show:
- student details
- current class
- attendance percentage
- exam history
- marks
- percentages
- grades
- performance trend

ENGLISH LEVEL PROGRESS
Show:
- current English level
- level history
- level changes
- change date
- teacher notes where appropriate

SUMMARY
Calculate:
- average exam percentage
- highest result
- lowest result
- latest result
- attendance percentage
- number of exams

TEACHER NOTES
If needed, implement:
- student
- note
- teacher
- date
- active status

Do not store unnecessary sensitive information.

FRONTEND
Create:
- performance page
- result table
- attendance summary
- progress visualization if useful
- English-level history
- teacher notes

BACKEND
Provide efficient summary endpoints rather than loading all records into React.

Example:
GET /api/students/{id}/performance

TEST:
- no exams
- one exam
- multiple exams
- no attendance
- partial data
- level history
- authorization

ACCEPTANCE
Teacher can understand a student's attendance, exam results, grades and English-level progress from one area.

FINALIZATION
Build/test backend and frontend.
Fix all issues.
Manually verify realistic students.
Commit:
"feat: add student performance and progress tracking"
Return exact commit hash.
STOP. Do not start Phase 10.
```

---

# PHASE 10 — DASHBOARD

## Copy-paste this prompt

```text
Implement ONLY PHASE 10: DASHBOARD.

Previous phases are complete and committed.

FIRST
Inspect existing APIs and calculations.
Do not duplicate expensive calculations.

ADMIN DASHBOARD
Show useful summaries such as:
- active students
- active classes
- users/teachers
- current academic year
- today's attendance
- recent manually recorded payments
- upcoming exams
- recent exam activity

TEACHER DASHBOARD
Show:
- accessible classes
- active students
- today's attendance tasks
- upcoming exams
- recent marks
- useful recent activity

PAYMENTS
Payments are manual records only.
Do not show or implement online payment gateway functionality.

PERFORMANCE
Use efficient aggregate/summary endpoints.
Avoid loading thousands of records into React.

SECURITY
Dashboard data must respect role permissions.

FRONTEND
Create:
- responsive dashboard
- summary cards
- recent activity
- upcoming items
- quick actions
- useful empty states

Do not overload the dashboard.

TEST:
- admin
- teacher
- role restrictions
- empty database
- realistic database
- important queries

ACCEPTANCE
Dashboard is useful, fast and does not replace detailed module pages.

FINALIZATION
Build/test backend and frontend.
Fix errors.
Manually test both roles.
Commit:
"feat: add role based management dashboard"
Return exact commit hash.
STOP. Do not start Phase 11.
```

---

# PHASE 11 — REPORTS, PRINTING & EXPORT

## Copy-paste this prompt

```text
Implement ONLY PHASE 11: REPORTS, PRINTING & EXPORT.

Previous phases are complete and committed.

REPORTS

Student:
- student list
- profile
- class roster
- enrollment history

Attendance:
- daily attendance
- date-range attendance
- student summary
- class summary

Payments:
- payment history
- date-range payments
- student payment history
- payment period summary
- receipt availability

IMPORTANT:
Payment reporting is for manually recorded payments only.
Do not add online payment gateway reporting.

Exams:
- exam results
- class results
- student results
- grade distribution
- performance summary

FILTERS
Support where relevant:
- academic year
- class
- grade
- English level
- student
- date range
- payment period
- exam

EXPORT
Implement suitable:
- CSV
- Excel where appropriate
- print-friendly pages
- PDF only if a reliable existing/project-compatible strategy is available

Do not add unnecessary dependencies.

SECURITY
Reports must respect role permissions.
Receipts are never public.
Do not expose filesystem paths, JWTs, passwords or internal metadata.

PRINT
Use:
- Sun Baby English branding where appropriate
- report title
- generated date/time
- filter summary
- clean tables
- footer/page information

TEST:
- filters
- empty results
- date ranges
- exports
- role restrictions

ACCEPTANCE
Teacher/admin can generate, filter, print and export useful reports.

FINALIZATION
Build/test backend and frontend.
Fix all errors.
Manually verify representative reports.
Commit:
"feat: add reporting printing and export"
Return exact commit hash.
STOP. Do not start Phase 12.
```

---

# PHASE 12 — SECURITY HARDENING, VALIDATION & AUDIT

## Copy-paste this prompt

```text
Implement ONLY PHASE 12: SECURITY HARDENING, VALIDATION & AUDIT.

Previous phases are complete and committed.

Do not change business behavior unnecessarily.

AUTH SECURITY
Verify:
- BCrypt
- JWT validation
- secret configuration
- token expiration
- protected endpoints
- role authorization
- inactive-user handling
- no password leakage
- no token leakage in logs

VALIDATION
Review all APIs for:
- required fields
- lengths
- numeric ranges
- dates
- enums
- IDs
- file uploads
- pagination
- search parameters

DATABASE
Review:
- foreign keys
- constraints
- indexes
- transaction boundaries
- N+1 queries
- unsafe queries
- injection risks

RECEIPT SECURITY
Specifically review:
- allowed formats
- file signatures
- size limit
- unique storage names
- path traversal
- secure download
- authorization
- orphan cleanup
- no public static exposure

WEB SECURITY
Review:
- CORS
- CSRF strategy appropriate for JWT architecture
- security headers
- stack trace leakage
- sensitive logs
- login brute-force/rate protection where practical
- error responses

AUDIT LOGGING
Important actions should be auditable:
- login success/failure where appropriate
- user creation/deactivation
- student changes
- enrollment changes
- payment create/update/cancel
- receipt upload/replacement
- exam creation
- mark changes

Never log:
- passwords
- JWT tokens
- receipt contents
- unnecessary personal data

FRONTEND
Review:
- protected routes
- role navigation
- XSS
- unsafe HTML
- file previews
- API errors
- token handling

DEPENDENCIES
Review obvious security issues in dependencies.
Avoid risky major upgrades that destabilize the project.

TESTS
Add security-focused regression tests.

ACCEPTANCE
No obvious plaintext passwords, committed secrets, public receipts, unauthorized access, dangerous upload handling, or sensitive error leakage.

FINALIZATION
Run all backend tests.
Run frontend checks/build.
Fix every issue.
Perform manual security smoke testing.
Commit:
"security: harden authentication validation uploads and audit logging"
Return exact commit hash.
STOP. Do not start Phase 13.
```

---

# PHASE 13 — COMPLETE INTEGRATION TESTING & BUG FIXING

## Copy-paste this prompt

```text
Implement ONLY PHASE 13: COMPLETE SYSTEM TESTING, INTEGRATION & BUG FIXING.

All major features are already implemented.

Do NOT add new business features unless required to fix a defect.

TEST THE COMPLETE SYSTEM.

BACKEND
Run:
- unit tests
- service tests
- repository tests
- controller tests
- security tests
- integration tests

FRONTEND
Run:
- unit tests
- component tests
- route tests
- form validation tests
- lint/type checks
- production build

ADMIN USER JOURNEY
Test:
1. login
2. users
3. academic year
4. grades
5. English levels
6. classes
7. student
8. guardian
9. enrollment
10. attendance
11. manual payment
12. receipt upload
13. secure receipt view/download
14. exam
15. marks
16. grade
17. performance
18. dashboard
19. reports
20. logout/session expiration

TEACHER USER JOURNEY
Test:
- login
- allowed classes/students
- forbidden admin actions
- attendance
- manual payments
- receipt upload/download
- exams
- marks
- performance
- permitted reports

PAYMENT REQUIREMENT
Explicitly confirm:
- no online payment gateway
- no card processing
- no checkout
- no automatic bank verification
- manual payment recording works
- receipt upload works

FILE TESTS
Test:
- JPG
- PNG
- PDF
- invalid extension
- fake MIME
- oversized file
- path traversal
- unauthorized access
- missing file
- replacement

DATA INTEGRITY
Test:
- duplicate student code
- duplicate enrollment
- duplicate attendance
- duplicate exam marks
- invalid marks
- invalid dates
- deactivated records
- rollback behavior

UI/UX
Check:
- loading
- empty
- validation
- errors
- responsive layout
- keyboard usability
- mobile layout
- confirmation dialogs

PERFORMANCE
Check:
- N+1 queries
- excessive API calls
- huge browser payloads
- slow dashboard
- slow lists

BUG PROCESS
For every issue:
1. reproduce
2. identify root cause
3. implement minimal safe fix
4. add regression test
5. rerun affected tests

Do not perform unrelated refactoring.

ACCEPTANCE
All critical user journeys pass.
No compilation/test errors.
No critical authorization/security bugs.
No payment gateway.
Receipt upload is secure.

FINALIZATION
Run the complete test suite again after all fixes.
Build backend and frontend.
Review Git.
Commit:
"test: complete integration testing and fix system defects"
Return:
- exact commit hash
- tests run
- bugs fixed
- remaining non-critical issues
STOP. Do not start Phase 14.
```

---

# PHASE 14 — PRODUCTION READINESS, DEPLOYMENT & DOCUMENTATION

## Copy-paste this prompt

```text
Implement ONLY PHASE 14: PRODUCTION READINESS, DEPLOYMENT & DOCUMENTATION.

All application features are implemented and tested.

Do NOT add new business features.

PRODUCTION CONFIG
Verify/create:
- production Spring profile
- production React environment
- MySQL configuration
- CORS
- JWT secret
- JWT expiration
- receipt storage configuration
- upload size limit
- production logging

SECRETS
Ensure:
- no secrets in Git
- no hard-coded DB password
- no hard-coded JWT secret
- no production credentials in source
- .env.example contains placeholders only

DATABASE
Document:
- MySQL setup
- Flyway migrations
- backup
- restore

RECEIPT STORAGE
Document:
- storage directory
- permissions
- backup
- retention considerations
- future migration to object storage

Receipts may contain financial/personal information.
They must not be public.

DEPLOYMENT
Document practical deployment for:
- backend
- frontend
- MySQL
- environment variables
- API/domain
- HTTPS
- receipt storage

If Docker already exists or is clearly appropriate, improve it without unnecessarily replacing the architecture.

HEALTH/LOGGING
Verify health checks and production-friendly logging.
Do not log passwords, JWTs or receipt contents.

README
Document:
- architecture
- setup
- development
- tests
- production config
- deployment
- database
- receipt storage
- security
- troubleshooting

API DOCUMENTATION
Complete OpenAPI/Swagger if already used.
Add only if it fits cleanly.

ACCEPTANCE
A developer can understand how to run, test, configure, deploy, secure, back up and restore the system.

FINALIZATION
Run production-style builds.
Run all tests.
Verify configuration.
Fix all errors.
Review Git status.
Commit:
"chore: prepare application for production deployment"
Return exact commit hash and deployment checklist.
STOP. Do not start Phase 15.
```

---

# PHASE 15 — FINAL ACCEPTANCE TEST, CLEANUP & RELEASE

## Copy-paste this prompt

```text
Implement ONLY PHASE 15: FINAL ACCEPTANCE TEST, CLEANUP & RELEASE.

This is the final phase.
Do not introduce new business features.

GOAL
Prepare the Sun Baby English Student Management System for stable release.

VERIFY EVERYTHING

AUTH:
- login
- JWT
- BCrypt
- roles
- inactive users
- session expiration

MASTER DATA:
- academic years
- grades
- English levels
- classes

STUDENTS:
- CRUD
- unique student code
- guardians
- enrollment
- history
- search/filter

ATTENDANCE:
- daily attendance
- statuses
- editing
- summaries
- percentage

PAYMENTS:
- manual payment entry
- history
- payment period
- payment method
- reference
- cancellation where supported

RECEIPTS:
- JPG/JPEG/PNG/PDF
- size validation
- MIME/signature validation
- secure storage
- authenticated access
- replacement
- orphan cleanup
- authorization

CRITICAL:
Confirm there is NO online payment gateway.

EXAMS:
- creation
- mark entry
- bulk entry
- validation
- grading

PERFORMANCE:
- attendance
- exam history
- grades
- English-level progress
- notes

DASHBOARD:
- admin
- teacher
- permissions

REPORTS:
- filters
- student
- attendance
- payments
- exams
- export
- printing

SECURITY:
- no plaintext passwords
- no secrets
- no public receipt files
- no filesystem path leakage
- role authorization
- validation
- audit logs
- safe errors

QUALITY REVIEW
Check:
- dead code
- unused imports
- debug console output
- production TODOs
- unnecessary dependencies
- broken routes
- inconsistent labels
- inconsistent API responses
- mobile layout
- accessibility
- accidental generated files

GIT CLEANUP
Review:
- git status
- .gitignore
- accidental secrets
- accidental receipts
- node_modules
- target
- local DB files
- IDE files

Do not commit:
- production secrets
- uploaded receipts
- node_modules
- target
- local databases

FINAL TEST
Run:
1. backend clean build
2. backend full tests
3. frontend checks
4. frontend full tests
5. frontend production build
6. integration/E2E tests where available
7. security smoke test
8. receipt upload/download smoke test

Fix all issues.
Run final tests AGAIN after fixes.

RELEASE
Update:
- README
- CHANGELOG/release notes if appropriate
- version information if the project uses versioning

FINAL COMMIT
Create:
"release: finalize sun baby english student management system"

Return:
- exact commit hash
- final test results
- build results
- security verification
- receipt verification
- remaining non-critical issues
- release readiness

If stable, state:
"READY FOR RELEASE"

STOP. Do not create another phase.
```

---

# PHASE DEPENDENCY MAP

```text
PHASE 1
Project Audit & Base Setup
        ↓
PHASE 2
Database & Core Domain
        ↓
PHASE 3
JWT + Spring Security + BCrypt
        ↓
PHASE 4
Academic Years + Grades + Levels + Classes
        ↓
PHASE 5
Students + Guardians + Enrollment
        ↓
PHASE 6
Attendance
        ↓
PHASE 7
Manual Payments + Receipt Upload
        ↓
PHASE 8
Exams + Marks + Grading
        ↓
PHASE 9
Student Performance
        ↓
PHASE 10
Dashboard
        ↓
PHASE 11
Reports + Export + Printing
        ↓
PHASE 12
Security Hardening + Audit
        ↓
PHASE 13
Full Testing + Bug Fixing
        ↓
PHASE 14
Production Readiness + Deployment
        ↓
PHASE 15
Final Acceptance + Release
```

---

# REQUIRED END-OF-PHASE WORKFLOW

Every phase must follow:

```text
IMPLEMENT
   ↓
BUILD
   ↓
TEST
   ↓
FIX ERRORS
   ↓
REBUILD
   ↓
RETEST
   ↓
MANUAL VERIFY
   ↓
REVIEW GIT DIFF
   ↓
COMMIT
   ↓
REPORT EXACT COMMIT HASH
   ↓
STOP
```

Never skip the build/test/commit process.

---

# RECOMMENDED COMMIT HISTORY

```text
feat: establish project architecture and base configuration
feat: establish core student management data model
feat: implement jwt authentication and role-based security
feat: add academic and class master data management
feat: implement student guardian and enrollment management
feat: implement attendance management
feat: add manual payments and secure receipt uploads
feat: implement exams marks and grading
feat: add student performance and progress tracking
feat: add role based management dashboard
feat: add reporting printing and export
security: harden authentication validation uploads and audit logging
test: complete integration testing and fix system defects
chore: prepare application for production deployment
release: finalize sun baby english student management system
```

---

# FINAL PRODUCT CHECKLIST

- [x] Spring Boot backend
- [x] React frontend
- [x] MySQL
- [x] Flyway
- [x] JWT authentication
- [x] BCrypt password hashing
- [x] ADMIN role
- [x] TEACHER role
- [x] Student management
- [x] Parent/guardian management
- [x] Academic years
- [x] School grades
- [x] English levels
- [x] Classes
- [x] Enrollment
- [x] Attendance
- [x] Manual payments
- [x] Payment history
- [x] Receipt image/PDF upload
- [x] Secure receipt access
- [x] Receipt replacement
- [x] Exams
- [x] Marks
- [x] Automatic grading
- [x] Student performance
- [x] Dashboard
- [x] Reports
- [x] Export/printing
- [x] Audit logging
- [x] Security hardening
- [x] Automated testing
- [x] Production configuration
- [x] Documentation
- [x] Git commit after every phase
- [x] Final release verification

## Explicitly NOT included

- [ ] Online payment gateway
- [ ] Stripe
- [ ] PayPal
- [ ] Card payment processing
- [ ] Automatic bank verification
- [ ] Cryptocurrency payment
- [ ] Public receipt URLs

---

# FUTURE FEATURE RULE

If a new feature is requested after Phase 15:

1. Identify the module that owns the feature.
2. Do not modify unrelated modules unnecessarily.
3. Add database changes through a new migration.
4. Preserve existing APIs where possible.
5. Add tests.
6. Build and test the affected system.
7. Commit the change separately.
8. Never delete student/payment/receipt history just to simplify a new feature.

---

# END
