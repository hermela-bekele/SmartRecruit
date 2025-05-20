import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/features/Home/page'
import Alljobs from './components/features/All-jobs/page'
import  LoginModal  from './components/auth/Login/page'
//import { SignupForm } from './components/auth/signup/page'
import Dashboard from './components/Admin/dashboard/page'
import Applications from './components/Admin/applications/page'
import Jobs from './components/Admin/jobs/page'
import Settings from './components/Admin/settings/page'
import AddHr from './components/Admin/addHR/page'

function App() {

  return (
    <>
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} /> 
    <Route path="/all-jobs" element={<Alljobs />} />
    {/* <Route path="/job/:id" element={<JobDetailsModal />} /> */}
    {/* <Route path="/apply/:id" element={<ApplicationForm />} /> */}
    <Route path="/login" element={<LoginModal />} />
    {/* <Route path="/signup" element={<SignupForm />} /> */}
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/applications" element={<Applications />} />
    <Route path="/jobs" element={<Jobs />} />
    <Route path="/settings" element={<Settings />} />
    <Route path="/add-hr" element={<AddHr />} />
    {/* Add more routes as needed */}
  </Routes>
  </BrowserRouter>
    </>
  )
}

export default App
