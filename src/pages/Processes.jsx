// src/pages/Processes.jsx
import React, { useEffect, useState, useContext } from 'react'
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  doc,
  getDoc
} from 'firebase/firestore'
import { db, auth } from '../firebase'
import { Link, useNavigate } from 'react-router-dom'
import { logAudit } from '../components/AuditLogger'
import { AuthContext } from '../contexts/AuthContext'
import BarStatusCard from '../components/BarStatusCard'

export default function Processes() {
  const [processes, setProcesses] = useState([])
  const [creating, setCreating] = useState(false)
  const navigate = useNavigate()
  const { role } = useContext(AuthContext)

  useEffect(() => {
    const q = query(collection(db, 'processes'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        setProcesses(docs)
      },
      (err) => {
        console.error('Erro ao ler processes:', err)
      }
    )
    return () => unsub()
  }, [])

  const canCreate = role === 'comex' || role === 'admin'

  const createProcess = async () => {
    try {
      setCreating(true)

      if (!auth.currentUser) {
        alert('Você precisa estar logado para criar um processo.')
        setCreating(false)
        return
      }

      const userRef = doc(db, 'users', auth.currentUser.uid)
      const userSnap = await getDoc(userRef)
      if (!userSnap.exists()) {
        alert('Seu perfil não está configurado no Firestore (users/{uid} ausente).')
        setCreating(false)
        return
      }

      const roleFromDoc = userSnap.data().role
      if (!(roleFromDoc === 'comex' || roleFromDoc === 'admin')) {
        alert(`Permissão insuficiente: seu role é ${roleFromDoc}`)
        setCreating(false)
        return
      }

      const data = {
        processo: `P-${Date.now()}`,
        status: 'novo',
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser.uid,
        owners: [auth.currentUser.uid],
        team: []
      }

      const docRef = await addDoc(collection(db, 'processes'), data)

      await logAudit({
        entity: `processes/${docRef.id}`,
        action: 'create',
        userId: auth.currentUser.uid,
        diff: data
      })

      navigate(`/processes/${docRef.id}`)
    } catch (err) {
      console.error('Erro ao criar processo:', err)
      alert('Erro ao criar processo: ' + (err.message || err))
    } finally {
      setCreating(false)
    }
  }

  return (
    <div>
      {/* Card da condição da barra */}
      <BarStatusCard />

      <div className="flex items-center justify-between">
        <h2 className="text-xl">Processos</h2>
        {canCreate && (
          <button
            onClick={createProcess}
            className="ml-4 p-2 bg-green-600 text-white rounded"
            title="Criar novo processo"
            disabled={creating}
          >
            {creating ? 'Criando...' : 'Novo processo'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 mt-4">
        {processes.map((p) => (
          <Link key={p.id} to={`/processes/${p.id}`} className="p-4 bg-white rounded shadow block">
            <div className="font-bold">{p.processo || p.po}</div>
            <div className="text-sm">Status: {p.status}</div>
          </Link>
        ))}

        {processes.length === 0 && (
          <div className="p-4 bg-white rounded shadow text-gray-600">Nenhum processo encontrado.</div>
        )}
      </div>
    </div>
  )
}
