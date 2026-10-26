import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/public/Home'
import Login from './pages/public/Login'
import Register from './pages/public/Register'

import ClientDashboard from './pages/client/ClientDashboard'
import CreateProject from './pages/client/CreateProject'
import MyProjects from './pages/client/MyProjects'
import ProjectDetails from './pages/client/ProjectDetails'
import EditProject from './pages/client/EditProject'
import ClientProfile from './pages/client/ClientProfile'
import ClientNotifications from './pages/client/ClientNotifications'
import ClientReviews from './pages/client/ClientReviews'

import FreelancerDashboard from './pages/freelancer/FreelancerDashboard'
import BrowseProjects from './pages/freelancer/BrowseProjects'
import FreelancerProjectDetails from './pages/freelancer/FreelancerProjectDetails'
import MyApplications from './pages/freelancer/MyApplications'
import FreelancerMyProjects from './pages/freelancer/FreelancerMyProjects'
import TaskManagement from './pages/freelancer/TaskManagement'
import FreelancerProfile from './pages/freelancer/FreelancerProfile'
import FreelancerNotifications from './pages/freelancer/FreelancerNotifications'
import FreelancerReviews from './pages/freelancer/FreelancerReviews'

import AdminDashboard from './pages/admin/AdminDashboard'
import ManageUsers from './pages/admin/ManageUsers'
import ManageProjects from './pages/admin/ManageProjects'
import AdminReports from './pages/admin/AdminReports'

export default function App() {
  return (
    <>
      <Navbar />
      <main className="main-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Client routes */}
          <Route path="/client/dashboard" element={<ProtectedRoute allowedRoles={['ROLE_CLIENT']}><ClientDashboard /></ProtectedRoute>} />
          <Route path="/client/projects/new" element={<ProtectedRoute allowedRoles={['ROLE_CLIENT']}><CreateProject /></ProtectedRoute>} />
          <Route path="/client/projects" element={<ProtectedRoute allowedRoles={['ROLE_CLIENT']}><MyProjects /></ProtectedRoute>} />
          <Route path="/client/projects/:id" element={<ProtectedRoute allowedRoles={['ROLE_CLIENT']}><ProjectDetails /></ProtectedRoute>} />
          <Route path="/client/projects/:id/edit" element={<ProtectedRoute allowedRoles={['ROLE_CLIENT']}><EditProject /></ProtectedRoute>} />
          <Route path="/client/profile" element={<ProtectedRoute allowedRoles={['ROLE_CLIENT']}><ClientProfile /></ProtectedRoute>} />
          <Route path="/client/notifications" element={<ProtectedRoute allowedRoles={['ROLE_CLIENT']}><ClientNotifications /></ProtectedRoute>} />
          <Route path="/client/reviews" element={<ProtectedRoute allowedRoles={['ROLE_CLIENT']}><ClientReviews /></ProtectedRoute>} />

          {/* Freelancer routes */}
          <Route path="/freelancer/dashboard" element={<ProtectedRoute allowedRoles={['ROLE_FREELANCER']}><FreelancerDashboard /></ProtectedRoute>} />
          <Route path="/freelancer/browse" element={<ProtectedRoute allowedRoles={['ROLE_FREELANCER']}><BrowseProjects /></ProtectedRoute>} />
          <Route path="/freelancer/projects/:id" element={<ProtectedRoute allowedRoles={['ROLE_FREELANCER']}><FreelancerProjectDetails /></ProtectedRoute>} />
          <Route path="/freelancer/projects/:id/tasks" element={<ProtectedRoute allowedRoles={['ROLE_FREELANCER']}><TaskManagement /></ProtectedRoute>} />
          <Route path="/freelancer/applications" element={<ProtectedRoute allowedRoles={['ROLE_FREELANCER']}><MyApplications /></ProtectedRoute>} />
          <Route path="/freelancer/projects" element={<ProtectedRoute allowedRoles={['ROLE_FREELANCER']}><FreelancerMyProjects /></ProtectedRoute>} />
          <Route path="/freelancer/profile" element={<ProtectedRoute allowedRoles={['ROLE_FREELANCER']}><FreelancerProfile /></ProtectedRoute>} />
          <Route path="/freelancer/notifications" element={<ProtectedRoute allowedRoles={['ROLE_FREELANCER']}><FreelancerNotifications /></ProtectedRoute>} />
          <Route path="/freelancer/reviews" element={<ProtectedRoute allowedRoles={['ROLE_FREELANCER']}><FreelancerReviews /></ProtectedRoute>} />

          {/* Admin routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']}><ManageUsers /></ProtectedRoute>} />
          <Route path="/admin/projects" element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']}><ManageProjects /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']}><AdminReports /></ProtectedRoute>} />

          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </>
  )
}
