'use client'

import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

interface GlobalSelectBoxProps {
  label: string
  table?: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  placeholder?: string
  fetchUrl?: string
  useValueAsName?: boolean // Se true, o valor do select será o 'nome' em vez da 'id'
}

export default function GlobalSelectBox({ 
  label, 
  table, 
  value, 
  onChange, 
  required, 
  placeholder = "Selecione...",
  fetchUrl,
  useValueAsName = false
}: GlobalSelectBoxProps) {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const url = fetchUrl || `/api/admin/params?table=${table}`
        const response = await fetch(url)
        const data = await response.json()
        setItems(data || [])
      } catch (error) {
        console.error(`Error fetching data for ${label}:`, error)
      } finally {
        setLoading(false)
      }
    }

    if (table || fetchUrl) {
      fetchData()
    }
  }, [table, fetchUrl, label])

  return (
    <div className="space-y-2">
      <label className="text-[11px] font-black text-mrs-blue uppercase tracking-widest ml-1">
        {label}
      </label>
      <div className="relative group">
        <select
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-mrs-blue focus:outline-none focus:ring-4 focus:ring-mrs-blue/5 focus:border-mrs-blue transition-all appearance-none disabled:opacity-50 pr-12 cursor-pointer group-hover:border-mrs-blue/20"
          disabled={loading}
        >
          <option value="">{loading ? 'Carregando...' : placeholder}</option>
          {items.map((item) => (
            <option key={item.id} value={useValueAsName ? item.nome : item.id}>
              {item.nome}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mrs-blue/40 pointer-events-none group-hover:text-mrs-blue transition-colors" />
      </div>
    </div>
  )
}
