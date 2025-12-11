// src/App.jsx
import React, { useContext } from 'react'
import { Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom'

import { AuthProvider, AuthContext } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import { signOut } from 'firebase/auth'
import { auth } from './firebase'

// pages
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyEmail from './pages/VerifyEmail'
import Dashboard from './pages/Dashboard'
import Processes from './pages/Processes'
import ProcessDetail from './pages/ProcessDetail'
import AdminPanel from './pages/AdminPanel'

function AppShell({ children }) {
  const { user, role } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigate('/login')
    } catch (err) {
      console.error('Erro ao deslogar:', err)
      alert('Erro ao deslogar: ' + (err.message || err))
    }
  }

  const navClass = ({ isActive }) =>
    isActive ? 'px-3 text-blue-600 font-semibold' : 'px-3 text-gray-700 hover:text-blue-600'

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <NavLink to="/" className="text-xl font-bold">SQ COMEX UPDATES</NavLink>

            <nav className="flex items-center gap-3">
              <NavLink to="/processes" className={navClass}>Processos</NavLink>
              {(role === 'admin' || role === 'comex') && <NavLink to="/admin" className={navClass}>Admin</NavLink>}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="text-sm text-gray-700">{user.email}</div>
                <button onClick={handleLogout} className="px-3 py-1 border rounded">Logout</button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navClass}>Login</NavLink>
                <NavLink to="/register" className={navClass}>Cadastrar</NavLink>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">{children}</main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell>
        <Routes>
          {/* public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* protected */}
          <Route path="/processes" element={<ProtectedRoute><Processes /></ProtectedRoute>} />
          <Route path="/processes/:id" element={<ProtectedRoute><ProcessDetail /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />

          {/* root redirect to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AppShell>
    </AuthProvider>
  )
}
