import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './components/features/Home/page'
import Alljobs from './components/features/All-jobs/page'
import LoginModal from './components/auth/Login/page'
//import { SignupForm } from './components/auth/signup/page'
import Dashboard from './components/Admin/dashboard/page'
import Applications from './components/Admin/applications/page'
import Jobs from './components/Admin/jobs/page'
import Settings from './components/Admin/settings/page'
import AddHR from './components/Admin/addHR/page'
import { AuthProvider, ProtectedRoute } from './contexts/AuthContext'

function App() {

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path="/all-jobs" element={<Alljobs />} />
          {/* <Route path="/job/:id" element={<JobDetailsModal />} /> */}
          {/* <Route path="/apply/:id" element={<ApplicationForm />} /> */}
          <Route path="/login" element={<LoginModal />} />
          {/* <Route path="/signup" element={<SignupForm />} /> */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications"
            element={
              <ProtectedRoute>
                <Applications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs"
            element={
              <ProtectedRoute>
                <Jobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-hr"
            element={
              <ProtectedRoute>
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
      </AuthProvider>
    </Router>
  )
}

export default App
