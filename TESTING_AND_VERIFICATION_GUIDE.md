# Sun Baby English — Complete UI & Feature Manual Verification Guide
**Covers Completed Phases 1 through 5**

> **Local Application URLs:**
> - 🌐 **Frontend Application:** [http://localhost:5173](http://localhost:5173)
> - ⚙️ **Backend API (Spring Boot):** [http://localhost:8080/api/v1/health](http://localhost:8080/api/v1/health)
> - 🗄️ **Remote GitHub Repository:** [https://github.com/Dmlehan/AAD_Final](https://github.com/Dmlehan/AAD_Final)

---

## 🔑 Default Credentials

The database comes pre-seeded with two ready-to-use development staff accounts:

| Role | Username | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Academy Administrator** | `admin` | `admin123` | Full administrative control (Users, Master Data CRUD, Students, Classes) |
| **Teacher** | `teacher` | `teacher123` | Teaching operations (Students, Enrollments, Classes viewing & filtering) |

---

## 🧭 Step-by-Step Manual UI Verification Walkthrough

Follow these sequential steps to test and experience every UI component and business flow.

---

### Step 1: Academy Landing Page
* **URL to open:** [http://localhost:5173/](http://localhost:5173/)
* **What to verify:**
  1. **Visual Aesthetic:** Minimalist, clean Light Mode (`#ffffff` surfaces, `#f8fafc` background, subtle `#e2e8f0` borders, warm amber `#f59e0b` accents).
  2. **Hero Section:** Academy welcome banner, highlights ("Interactive Learning", "Cambridge Standard", "Safe Environment").
  3. **Program Pathways:** Cards for Little Tots (Ages 3-5), Junior Explorers (Ages 6-9), and Cambridge Young Learners (Starters, Movers, Flyers).
  4. **Fee Payment Flow (No Online Gateways):** 4-step explanation of the manual offline bank deposit & WhatsApp slip verification flow.
  5. **Header Navigation:** Click **"Staff Portal"** button in top right to go to the login page.

---

### Step 2: Staff Portal Sign In & Session Management
* **URL to open:** [http://localhost:5173/login](http://localhost:5173/login)
* **What to verify:**
  1. **Clean Login Card:** Minimalist light-mode card with Sun Baby logo.
  2. **Demo Quick-Fill Buttons:**
     - Click **"Fill Admin"** -> fills `admin` / `admin123`.
     - Click **"Sign In to Portal"** -> automatically verifies credentials with backend, receives JWT token, and redirects to home with authenticated header.
  3. **Authenticated Header Bar:**
     - Displays your full name (`Administrator`).
     - Displays role badge (`ADMIN`).
     - Shows navigation links: **Students**, **Classes & Data**, and **Staff**.
     - Has **Sign Out** button that immediately clears session and redirects to login.
  4. **Session Persistence:** Refresh the page (`F5`) — you stay logged in because the token is verified via `/api/v1/auth/me`.

---

### Step 3: Staff & Access Management (Admin Only)
* **URL to open:** [http://localhost:5173/admin/users](http://localhost:5173/admin/users) *(or click "Staff" in header)*
* **What to verify:**
  1. **Staff Roster Table:** Shows default `admin` and `teacher` accounts with roles and active status.
  2. **Add Staff Member:**
     - Click **"Add Staff Member"** button.
     - Enter full name (e.g. `Kavinda Senanayake`), username (`ksenanayake`), role (`TEACHER`), email, password (`pass123`), phone.
     - Click **"Create Account"** -> new user appears in the table immediately.
  3. **Deactivate / Activate:**
     - Click **"Deactivate"** on any non-admin staff account -> badge changes to "Disabled".
     - Click **"Activate"** -> badge restores to "Active".
  4. **Role Protection Test:**
     - Sign out and sign in as `teacher` / `teacher123`.
     - Try navigating directly to [http://localhost:5173/admin/users](http://localhost:5173/admin/users).
     - Observe the clean **"Access Restricted"** warning card displaying your current role and blocking access.

---

### Step 4: Academic Master Data Management
* **URL to open:** [http://localhost:5173/master-data](http://localhost:5173/master-data) *(or click "Classes & Data" in header)*
* **What to verify:**
  1. **Tab 1: Class Groups:**
     - Filter bar with Academic Year, Grade, Level dropdowns, and "Active Classes Only" checkbox.
     - Instant keyword search bar.
     - Click **"Add Class Group"** (Admin):
       - Name: `Starters Saturday Batch A`
       - Academic Year: select year
       - Schedule: `Saturday`, `09:00` to `11:00`
       - Room: `Room 101`
       - Click **"Save Class"** -> appears in list with schedule badges.
     - Test validation: enter End Time earlier than Start Time -> rejected with clear error alert.
  2. **Tab 2: Academic Years:**
     - Click **"Add Academic Year"**:
       - Name: `2026 Academic Year`
       - Start Date: `2026-01-01`, End Date: `2026-12-31`
       - Click **"Save Year"**.
     - Test validation: enter End Date before Start Date -> rejected.
     - Toggle Active status button.
  3. **Tab 3: School Grades:**
     - Displays grade levels (e.g., Grade 1 to Grade 5) with display order.
     - Click **"Add School Grade"** to create a custom grade tier.
  4. **Tab 4: English Levels:**
     - Displays levels (Starters, Movers, Flyers, etc.) with description and display sequence.
     - Click **"Add English Level"** to configure language milestones.

---

### Step 5: Student Directory & Registration
* **URL to open:** [http://localhost:5173/students](http://localhost:5173/students) *(or click "Students" in header)*
* **What to verify:**
  1. **Student Directory Table:**
     - Shows all registered students with unique code pill (e.g. `SB-2026-0001`), full name, grade tier, contact info, and active status.
     - Keyword search bar (instant filter by name, student code, or phone number).
     - Grade filter dropdown & Active students only toggle.
  2. **Register New Student:**
     - Click **"Register New Student"** button.
     - Student Details:
       - First Name: `Dinuka`
       - Last Name: `Perera`
       - Date of Birth: `2017-06-15`, Gender: `MALE`
       - School Grade: Select any grade
       - Phone: `0771234567`, Email: `dinuka@gmail.com`
       - Address: `78 Galle Road, Colombo`
     - Guardian Section (embedded registration):
       - Check **"Add Guardian Now"**
       - Guardian Name: `Kamal Perera`
       - Relationship: `Father`
       - Guardian Phone: `0719876543`
     - Click **"Register Student"** -> student is registered with auto-generated code (e.g. `SB-2026-0002`) and automatically opens the student's Profile page!

---

### Step 6: Student Profile, Guardians & Class Enrollments
* **URL to open:** [http://localhost:5173/students/1](http://localhost:5173/students/1) *(or click "View Profile" on any student)*
* **What to verify:**
  1. **Student Header Card:**
     - Initials avatar, Full Name, Student Code badge, Grade, DOB, Gender, Phone, Email, and Address.
     - Click **"Edit Profile"** -> updates student details.
     - Click **"Deactivate Student"** -> switches status badge to "Inactive". Click again to reactivate.
  2. **Guardians & Parents Panel (Left Column):**
     - Lists attached parents/guardians with **PRIMARY** badge on the primary contact.
     - Click **"Add Guardian"**:
       - Add another contact (e.g. Mother `Nirosha Perera`, Phone `0776543210`).
       - Check **"Designate as Primary Emergency Contact"** -> primary badge transfers to this guardian.
     - Click trash icon to detach any guardian.
  3. **Class Enrollments Panel (Right Column):**
     - Lists all classes the student is enrolled in with schedule, room, and status (`ACTIVE`, `DROPPED`, `COMPLETED`).
     - Click **"Enroll in Class"**:
       - Select an available class group and enrollment date.
       - Click **"Confirm Enrollment"** -> class appears under active enrollments.
     - **Duplicate Active Enrollment Guard:** Try enrolling the student into the exact same class again -> rejected with alert `"Student is already actively enrolled in this class"`.
     - **Status Actions:** Click **"Mark Dropped"** -> status badge changes to `DROPPED`. Click **"Reactivate"** -> safely restores enrollment to `ACTIVE`.

---

## 📊 Summary of Completed Work (Phases 1 - 5)

| Phase | Core Deliverables | Git Commit | Committer Timestamp |
| :---: | :--- | :---: | :---: |
| **Phase 1** | Project audit, Spring Boot 3.3.4, React Vite, MySQL setup, Flyway, standard API envelope | `3511a60` | `2026.09.03 08:12 AM` |
| **Phase 2** | Database schema (14 tables), JPA entities, Enums, Repositories | `8b7b9a1` | `2026.09.03 08:35 AM` |
| **Phase 3** | JWT authentication, Spring Security 6, BCrypt, Login UI, Staff Portal | `e2e5223` | `2026.09.04 10:13 AM` |
| **Phase 4** | Master Data: Academic Years, School Grades, English Levels, Class Groups | `0d4817b` | `2026.09.04 02:15 PM` |
| **Phase 5** | Students, Guardians, Class Enrollments, Profile & Directory UIs | `bda38ab` | `2026.09.05 09:06 AM` |

All **35 automated test suites** are passing with zero failures.  
You can test each screen in your browser right now at **[http://localhost:5173](http://localhost:5173)**!
