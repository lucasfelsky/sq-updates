import React, { useState, useContext } from 'react'
import { auth } from '../firebase'
import { sendEmailVerification } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'

export default function VerifyEmail() {
  const [sending, setSending] = useState(false)
  const [checking, setChecking] = useState(false)
  const { refreshUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const resend = async () => {
    const u = auth.currentUser
    if (!u) return alert('Nenhum usuário logado.')
    try {
      setSending(true)
      await sendEmailVerification(u)
      alert('E-mail de verificação reenviado.')
    } catch (err) {
      alert('Erro: ' + (err.message || err))
    } finally {
      setSending(false)
    }
  }

  const checkVerifiedNow = async () => {
    const u = auth.currentUser
    if (!u) return alert('Nenhum usuário logado.')
    try {
      setChecking(true)
      await refreshUser()
      const reloaded = auth.currentUser
      if (reloaded && reloaded.emailVerified) {
        navigate('/processes')
      } else {
        alert('Ainda não verificado. Verifique seu e-mail.')
      }
    } catch (err) {
      alert('Erro ao checar verificação: ' + (err.message || err))
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl mb-3">Verifique seu e-mail</h2>
      <p>Enviamos um e-mail de verificação para o endereço cadastrado. Clique no link do e-mail para ativar sua conta.</p>
      <div className="mt-4 flex gap-2">
        <button onClick={resend} disabled={sending} className="p-2 bg-blue-600 text-white rounded">Reenviar</button>
        <button onClick={checkVerifiedNow} disabled={checking} className="p-2 bg-green-600 text-white rounded">Já verifiquei — checar</button>
      </div>
    </div>
  )
}
