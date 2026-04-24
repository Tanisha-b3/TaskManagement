# 🚀 Task Management System - Mini SaaS Application

A production-ready task management application with secure authentication and multi-user functionality built using a full-stack architecture (React + Node.js + PostgreSQL).

---

## 🌐 Live Demo

🔗 https://taskmanagementfrontend-levm.onrender.com/
---

## 📦 Tech Stack

### 🔹 Backend

* Node.js + Express (REST API)
* PostgreSQL + Sequelize (ORM)
* JWT (Authentication)
* bcryptjs (Password hashing)
* express-validator (Validation)
* Helmet (Security)
* Rate Limiting & CORS

### 🔹 Frontend

* React + Vite
* Tailwind CSS
* React Router v6
* Axios
* React Hot Toast
* Lucide React Icons

---

## ✨ Features Implemented

### 🔐 Authentication

* User Signup with validation
* Secure Login using JWT
* Protected Routes
* Password hashing using bcrypt
* Session handling

---

### 📝 Task Management

* Create tasks (title, description, priority, due date)
* View only the logged-in user’s tasks
* Update task status (Pending → In Progress → Completed)
* Edit task details
* Delete tasks
* Filter by status & priority
* Search tasks (title/description)
* Task statistics dashboard

---

### 🔒 Security Features

* JWT authentication middleware
* Input validation & sanitization
* SQL Injection protection (Sequelize)
* XSS protection (Helmet)
* Rate limiting
* CORS configuration

---

## ⚙️ Installation & Setup

---

### 📌 Prerequisites

* Node.js (v14+)
* PostgreSQL (v12+)
* npm or yarn

---

## 🔧 Backend Setup

### 1. Clone Repository

```bash
git clone https://github.com/Tanisha-b3/TaskManagement.git
cd TaskManagement/backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create `.env` file:

```env
PORT=5000
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=localhost
JWT_SECRET=your_jwt_secret_key
```

---

### 4. Setup Database

* Create PostgreSQL database
* Run migrations (if applicable):

```bash
npx sequelize-cli db:migrate
```

---

### 5. Run Backend

```bash
npm run dev
```

👉 Backend runs on: `http://localhost:5000`

---

## 🎨 Frontend Setup

### 1. Navigate to Frontend

```bash
cd ../frotend
```

> ⚠️ Note: Folder name is `frotend` in repo. Rename to `frontend` if needed.

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Configure Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

---

### 4. Run Frontend

```bash
npm run dev
```

👉 Frontend runs on: `http://localhost:5173`

---

## 🚀 Running the Full Application

* Ensure PostgreSQL is running
* Start backend → `http://localhost:5000`
* Start frontend → `http://localhost:5173`

---

## 📂 Project Structure

```
TaskManagement/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── config/
│
├── frotend/ (frontend)
│   ├── src/
│   │   ├── components/
│   │   ├── Tasks/
│   │   ├── services/
│   │   └── pages/ 
│   │   └── components/
|       └── context/
│
└── README.md
```

---

## 🌍 Deployment

* Backend → Render
* Database → Render PostgreSQL
* Frontend → Vercel

---

## 📌 Future Improvements

* 📅 Task reminders & deadlines
* 🔔 Notification system
* 📊 Advanced analytics dashboard
* 🌙 Dark mode

---

## 👩‍💻 Author

**Tanisha Borana**
GitHub: https://github.com/Tanisha-b3

---

## ⭐ Support

If you like this project, please give it a ⭐ on GitHub!
