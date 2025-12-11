import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { doc, onSnapshot, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase'

export default function ProcessDetail() {
  const { id } = useParams()
  const [data, setData] = useState(null)

  useEffect(() => {
    const ref = doc(db, 'processes', id)
    const unsub = onSnapshot(ref, snap => {
      if (snap.exists()) setData({ id: snap.id, ...snap.data() })
      else setData(null)
    })
    return () => unsub()
  }, [id])

  if (!data) return <div>Carregando...</div>

  return (
    <div>
      <h2 className="text-xl font-bold">{data.processo}</h2>
      <div className="mt-2">Status: {data.status}</div>
      {/* Add editing UI here if needed */}
    </div>
  )
}
