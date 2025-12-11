// src/pages/Dashboard.jsx
import React from 'react'
import BarStatusCard from '../components/BarStatusCard'

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* mostra o card com a condição da barra (reutiliza o componente já criado) */}
      <BarStatusCard />

      <div className="mt-6 p-4 bg-white rounded shadow">
        <h2 className="text-lg font-semibold">Resumo rápido</h2>
        <p className="text-sm text-gray-600 mt-2">
          Aqui você pode adicionar métricas, alerts, gráficos ou links rápidos para os processos.
          Por enquanto esta é uma tela inicial simples — personalizar conforme necessidade.
        </p>
      </div>
    </div>
  )
}
