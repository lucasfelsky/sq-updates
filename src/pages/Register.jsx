import React, { useState } from 'react'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import { auth, db } from '../firebase'
import { setDoc, doc, serverTimestamp } from 'firebase/firestore'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const isCorporate = (em) => em && em.toLowerCase().endsWith('@sqquimica.com')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !email || !password) return alert('Preencha todos os campos.')
    if (!isCorporate(email)) return alert('Somente e-mails @sqquimica.com são aceitos.')

    setLoading(true)
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      await setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid,
        email,
        name,
        role: 'user',
        emailVerified: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      await sendEmailVerification(cred.user)
      nav('/verify-email')
    } catch (err) {
      alert('Erro ao criar conta: ' + (err.message || err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Criar conta</h2>
      <form onSubmit={handleSubmit}>
        <input className="w-full p-2 border mb-3" placeholder="Nome completo" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="w-full p-2 border mb-3" placeholder="email @sqquimica.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full p-2 border mb-3" type="password" placeholder="senha" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" disabled={loading} className="w-full p-2 bg-green-600 text-white rounded">
          {loading ? 'Criando...' : 'Criar conta'}
        </button>
      </form>
      <div className="mt-4 text-sm">
        <Link to="/login" className="text-blue-600 underline">Voltar ao login</Link>
      </div>
    </div>
  )
}
