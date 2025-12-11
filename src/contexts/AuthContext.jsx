import React, { createContext, useEffect, useState, useCallback } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '../firebase'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    try {
      if (auth.currentUser) await auth.currentUser.reload()
    } catch (e) {
      console.error('Erro ao recarregar usuário:', e)
    }
  }, [])

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      setLoading(false)

      if (!u) {
        setRole(null)
        return
      }

      try {
        const uref = doc(db, 'users', u.uid)
        const snap = await getDoc(uref)
        if (!snap.exists()) {
          await setDoc(uref, {
            uid: u.uid,
            email: u.email || null,
            role: 'user',
            name: u.displayName || null,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            emailVerified: !!u.emailVerified
          })
          setRole('user')
        } else {
          const data = snap.data()
          setRole(data.role || 'user')
          if (u.emailVerified && data.emailVerified !== true) {
            await setDoc(uref, { emailVerified: true, updatedAt: serverTimestamp() }, { merge: true })
          }
        }
      } catch (e) {
        console.error('Erro ao garantir users/{uid}:', e)
      }
    })

    return () => unsub()
  }, [])

  return (
    <AuthContext.Provider value={{ user, role, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}
