# Task Management System - Mini SaaS Application

A production-ready task management application with secure authentication and multi-user functionality built with the MERN stack (PostgreSQL instead of MongoDB).

## 🚀 Live Demo

[Insert your deployed link here]

## 📦 Tech Stack

### Backend
- **Node.js** + **Express** - REST API server
- **PostgreSQL** + **Sequelize** - Database and ORM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Frontend
- **React** + **Vite** - UI framework
- **Tailwind CSS** - Styling
- **React Router v6** - Routing
- **Axios** - API calls
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

## ✨ Features Implemented

### Authentication
- ✅ User Signup with validation
- ✅ User Login with JWT
- ✅ Protected routes
- ✅ Password hashing (bcrypt)
- ✅ Session management

### Task Management
- ✅ Create tasks with title, description, priority, due date
- ✅ View only user's own tasks
- ✅ Update task status (pending → in-progress → completed)
- ✅ Edit task details
- ✅ Delete tasks
- ✅ Filter tasks by status and priority
- ✅ Search tasks by title/description
- ✅ Task statistics dashboard

### Security
- ✅ JWT authentication middleware
- ✅ Input validation and sanitization
- ✅ SQL injection prevention (Sequelize ORM)
- ✅ XSS protection (Helmet)
- ✅ Rate limiting
- ✅ CORS configuration

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Backend Setup

1. Clone the repository
```bash
git clone <your-repo-url>
cd task-management-app/backend