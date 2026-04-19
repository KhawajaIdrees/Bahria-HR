import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import AcademicQualifications from './pages/AcademicQualifications';
import WorkExperience from './pages/WorkExperience';
import ResearchPublications from './pages/ResearchPublications';
import Dashboard from './pages/Dashboard';
import ScoreCard from './pages/ScoreCard';
import AdminDashboard from './pages/AdminDashboard';
import AdminApplicationDetail from './pages/AdminApplicationDetail';

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-[100vw] overflow-x-hidden">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/academic-qualifications" element={<PrivateRoute><AcademicQualifications /></PrivateRoute>} />
              <Route path="/work-experience" element={<PrivateRoute><WorkExperience /></PrivateRoute>} />
              <Route path="/research-publications" element={<PrivateRoute><ResearchPublications /></PrivateRoute>} />
              <Route path="/score-card" element={<PrivateRoute><ScoreCard /></PrivateRoute>} />
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/applications/:id" element={<AdminRoute><AdminApplicationDetail /></AdminRoute>} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;