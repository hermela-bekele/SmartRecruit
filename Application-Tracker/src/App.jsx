//import { useState } from 'react'

import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LoginForm } from './components/auth/login-form'
import { SignupForm } from './components/auth/signup-form'

function App() {

  return (
    <>
  <BrowserRouter>
  <Routes>
    <Route path="/login" element={<LoginForm />} />
    <Route path="/signup" element={<SignupForm />} />
    <Route path="/" element={<LoginForm />} />
  </Routes>
  </BrowserRouter>
    </>
  )
}

export default App
