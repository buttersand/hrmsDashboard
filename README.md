# 🧑‍💼HRMS Dashboard (MERN Stack)

This is a **Human Resource Management System (HRMS)** The project demonstrates a complete MERN stack implementation including **authentication, candidate and employee management, attendance, and leave tracking**.

---

## 🚀 Live Link
> **Hosted on:** (
> **Demo Video:** 

---

## 📂 Tech Stack

- **Frontend:** React.js (with React Router), Vanilla CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT Tokens

---

## ✅ Features

### 1. 🔐 Authentication & Authorization
- Secure login system using JWT tokens (2-hour session expiry)
- Auto logout after session timeout
- Input validation for login & registration

### 2. 📋 Candidate Management
- HR can create candidate profiles
- Download candidate resumes as PDFs
- Move selected candidates to employee list with details preserved
- Filter/Search functionality (as per Figma)

### 3. 👥 Employee Management
- Edit, delete, assign roles to employees
- Search and filter employees easily

### 4. 📅 Attendance Management
- Show only current employees
- Add and view daily attendance
- Filter/Search as per Figma

### 5. 📝 Leave Management
- Only “Present” employees can apply for leave
- HR can approve/reject leave requests
- Calendar view for “Approved” leaves
- Downloadable leave documents
- Filter/Search support

### 6. 🎨 Design Guidelines
- 100% Responsive layout
- Matches color and layout per provided **Figma design**
- Built using **Vanilla CSS only** (no frameworks like Tailwind or Bootstrap)

---

## 🧠 What You'll See in This Project

- ✅ State Management (React Hooks)
- ✅ RESTful API Integration
- ✅ Error Handling (Frontend & Backend)
- ✅ Modular and Scalable Folder Structure
- ✅ Reusable Components
- ✅ Clean HTML/CSS structure
- ✅ Protected Routing

---

## 🗂 Folder Structure

/client /components /pages /styles App.jsx index.jsx

/server /controllers /models /routes server.js

yaml
Copy
Edit

---

## 🛠️ Setup Instructions (Local)

1. Clone the repo:
```bash
git clone https://github.com/buttersand/hrmsDashboard.git
Setup backend:

bash
Copy
Edit
cd server
npm install
npm run dev
Setup frontend:

bash
Copy
Edit
cd client
npm install
npm start
📦 Deployment
Frontend: Vercel

Backend: Render

Database: MongoDB Atlas

📌 Notes
Vanilla CSS only 

Session expires after 2 hours using JWT

Fully functional CRUD for all modules

Resume and leave docs downloadable


