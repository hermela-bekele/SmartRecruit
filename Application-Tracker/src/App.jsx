import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './components/features/Home/page'
import Alljobs from './components/features/All-jobs/page'
import Login from './components/auth/Login/page'
import ResetPassword from './components/auth/ResetPassword/page'
//import { SignupForm } from './components/auth/signup/page'
import Dashboard from './components/Admin/dashboard/page'
import Applications from './components/Admin/applications/page'
import Jobs from './components/Admin/jobs/page'
import JobApplicants from './components/Admin/jobs/JobApplicants'
import Settings from './components/Admin/settings/page'
import AddHR from './components/Admin/addHR/page'
import { AuthProvider, ProtectedRoute } from './contexts/AuthContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path="/all-jobs" element={<Alljobs />} />
          {/* <Route path="/job/:id" element={<JobDetailsModal />} /> */}
          {/* <Route path="/apply/:id" element={<ApplicationForm />} /> */}
          <Route 
            path="/login" 
            element={<Login onClose={() => window.history.back()} />} 
          />
          <Route path="/reset-password" element={<ResetPassword />} />
          {/* <Route path="/signup" element={<SignupForm />} /> */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRoles={["SUPER_ADMIN", "HR_ADMIN"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications"
            element={
              <ProtectedRoute requiredRoles={["SUPER_ADMIN", "HR_ADMIN"]}>
                <Applications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs"
            element={
              <ProtectedRoute requiredRoles={["SUPER_ADMIN", "HR_ADMIN"]}>
                <Jobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs/:jobId/applicants"
            element={
              <ProtectedRoute requiredRoles={["SUPER_ADMIN", "HR_ADMIN"]}>
                <JobApplicants />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute requiredRoles={["SUPER_ADMIN", "HR_ADMIN"]}>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-hr"
            element={
              <ProtectedRoute requiredRoles={["SUPER_ADMIN"]}>
                <AddHR />
              </ProtectedRoute>
            }
          />
          {/* Add more routes as needed */}
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <Navigate to="/dashboard" replace />
              </ProtectedRoute>
            }
          />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </Router>
  )
}

export default App
