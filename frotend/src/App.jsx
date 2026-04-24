// frontend/src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import ProtectedRoute from './components/ProtectedRoutes';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Dashboard from './Pages/dashboard';
import Tasks from './Pages/Tasks';
import Calendar from './Pages/Calendar';
import Analytics from './Pages/Analytics';
import Settings from './Pages/Settings';
import Help from './Pages/Help';
import TaskForm from './Tasks/TaskForm';
import TaskFormDialog from './Tasks/TaskFormDialog';
import { Toaster } from 'react-hot-toast';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const openNewTaskDialog = () => {
    setEditingTaskId(null);
    setTaskDialogOpen(true);
  };

  const openEditTaskDialog = (taskId) => {
    setEditingTaskId(taskId);
    setTaskDialogOpen(true);
  };

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="flex h-screen">
                  <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <Header
                      sidebarOpen={sidebarOpen}
                      setSidebarOpen={setSidebarOpen}
                      onNewTask={openNewTaskDialog}
                    />
                    <main className="flex-1 overflow-y-auto bg-background">
                      <Routes>
                        <Route path="/dashboard" element={<Dashboard onEditTask={openEditTaskDialog} />} />
                        <Route path="/tasks" element={<Tasks onEditTask={openEditTaskDialog} onNewTask={openNewTaskDialog} />} />
                        <Route path="/calendar" element={<Calendar />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/help" element={<Help />} />
                        <Route path="/tasks/new" element={<TaskForm />} />
                        <Route path="/tasks/edit/:id" element={<TaskForm />} />
                        <Route path="/" element={<Dashboard onEditTask={openEditTaskDialog} />} />
                      </Routes>
                    </main>
                  </div>
                </div>
                <TaskFormDialog
                  open={taskDialogOpen}
                  onOpenChange={setTaskDialogOpen}
                  taskId={editingTaskId}
                />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;