import React, { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const handle = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      nav('/processes')
    } catch (err) {
      alert('Erro ao logar: ' + (err.message || err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl mb-4">Login</h2>
      <form onSubmit={handle}>
        <input className="w-full p-2 border mb-3" placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" className="w-full p-2 border mb-3" placeholder="senha" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="w-full p-2 bg-blue-600 text-white rounded" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
      </form>
      <div className="mt-3 text-sm">
        <Link to="/register" className="text-blue-600">Criar conta</Link>
      </div>
    </div>
  )
}
