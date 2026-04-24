'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

interface Risk {
  id: string
  nome: string
  codigo_ref: number
  perigo?: {
    nome: string
  }
}

interface RiskContextType {
  selectedRiskId: string | null
  setSelectedRiskId: (id: string | null) => void
  risks: Risk[]
  loading: boolean
  fetchRisks: () => Promise<void>
}

const RiskContext = createContext<RiskContextType | undefined>(undefined)

export function RiskProvider({ children }: { children: React.ReactNode }) {
  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(null)
  const [risks, setRisks] = useState<Risk[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRisks = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/riscos')
      if (!response.ok) throw new Error('Falha ao buscar riscos')
      const data = await response.json()
      setRisks(data || [])
      
      // Auto-selecionar o primeiro se nenhum selecionado
      if (data && data.length > 0 && !selectedRiskId) {
        // Tenta pegar do localStorage se houver
        const saved = localStorage.getItem('agir_selected_risk_id')
        if (saved && data.find((r: Risk) => r.id === saved)) {
          setSelectedRiskId(saved)
        } else {
          setSelectedRiskId(data[0].id)
        }
      }
    } catch (error) {
      console.error('Error fetching risks:', error)
    } finally {
      setLoading(false)
    }
  }, [selectedRiskId])

  useEffect(() => {
    fetchRisks()
  }, []) // Fetch on mount

  useEffect(() => {
    if (selectedRiskId) {
      localStorage.setItem('agir_selected_risk_id', selectedRiskId)
    }
  }, [selectedRiskId])

  return (
    <RiskContext.Provider 
      value={{ 
        selectedRiskId, 
        setSelectedRiskId, 
        risks, 
        loading, 
        fetchRisks 
      }}
    >
      {children}
    </RiskContext.Provider>
  )
}

export function useRisk() {
  const context = useContext(RiskContext)
  if (context === undefined) {
    throw new Error('useRisk must be used within a RiskProvider')
  }
  return context
}
