// src/pages/AdminPanel.jsx
import React, { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  query,
  orderBy,
  getDocs,
  serverTimestamp
} from 'firebase/firestore'
import { db, auth } from '../firebase'
import { Navigate } from 'react-router-dom'
import { sendPasswordResetEmail } from 'firebase/auth'

export default function AdminPanel() {
  const { user, loading } = useAuth()
  const [users, setUsers] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('email'))
    const unsub = onSnapshot(q, (snap) => {
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return () => unsub()
  }, [])

  if (loading) return <div>Carregando...</div>
  if (!user) return <Navigate to="/login" replace />

  const [meRole, setMeRole] = useState(null)
  useEffect(() => {
    if (!user) return
    const unsub = onSnapshot(doc(db, 'users', user.uid), (snap) => {
      setMeRole(snap.exists() ? snap.data().role : null)
    })
    return () => unsub()
  }, [user])

  if (meRole !== 'admin') {
    return <div>Você não tem permissão para acessar esta página.</div>
  }

  const changeRole = async (uid, newRole) => {
    try {
      await updateDoc(doc(db, 'users', uid), { role: newRole, updatedAt: new Date().toISOString() })
      alert('Role atualizada.')
    } catch (err) {
      console.error('Erro ao atualizar role', err)
      alert('Erro ao atualizar role: ' + err.message)
    }
  }

  const sendReset = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email)
      alert('E-mail de recuperação enviado para ' + email)
    } catch (err) {
      console.error('Erro ao enviar reset:', err)
      alert('Erro ao enviar reset: ' + (err.message || err))
    }
  }

  const filtered = users.filter(u => !filter || (u.email && u.email.toLowerCase().includes(filter.toLowerCase())))

  // helper to list invites if needed
  const listInvites = async () => {
    const snaps = await getDocs(collection(db, 'invites'))
    const arr = snaps.docs.map(d => ({ id: d.id, ...d.data() }))
    console.log('invites:', arr.slice(0, 20))
    alert(`Existem ${arr.length} invites (veja console).`)
  }

  return (
    <div>
      <h2 className="text-2xl mb-4">Painel Admin</h2>

      {/* Admin user management */}
      <div className="mb-4 p-4 bg-white rounded shadow">
        <h3 className="font-semibold mb-3">Gerenciar usuários</h3>
        <div className="mb-3 text-sm text-gray-600">Busque por email e atualize roles (user / comex / admin).</div>
        <div className="mb-2">
          <input placeholder="buscar por email..." value={filter} onChange={e => setFilter(e.target.value)} className="p-2 border w-full" />
        </div>

        <div className="space-y-2">
          {filtered.map(u => (
            <div key={u.uid || u.id} className="p-3 bg-gray-50 rounded flex items-center justify-between">
              <div>
                <div className="font-bold">{u.email}</div>
                <div className="text-sm text-gray-600">role: {u.role} — uid: {u.uid || u.id}</div>
              </div>
              <div className="flex gap-2 items-center">
                <select value={u.role} onChange={e => changeRole(u.uid || u.id, e.target.value)} className="p-1 border">
                  <option value="user">user</option>
                  <option value="comex">comex</option>
                  <option value="admin">admin</option>
                </select>
                <button onClick={() => sendReset(u.email)} className="p-1 border rounded">Reset senha</button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="p-3 bg-white rounded shadow text-gray-600">Nenhum usuário encontrado.</div>}
        </div>
      </div>

      <div className="mt-6">
        <button onClick={listInvites} className="p-2 bg-gray-200 rounded">Listar invites</button>
      </div>
    </div>
  )
}
