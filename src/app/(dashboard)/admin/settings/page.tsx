'use client'

import { useState, useEffect } from 'react'
import { 
  Settings, 
  Plus, 
  Trash2, 
  Edit2, 
  Activity, 
  Tag, 
  Shield, 
  MapPin,
  Search,
  RefreshCw,
  AlertTriangle,
  ShieldCheck,
  Clock
} from 'lucide-react'
import { toast } from 'sonner'
import ConfirmModal from '@/components/organisms/admin/ConfirmModal'

type ParamTab = {
  id: string
  label: string
  table: string
  icon: any
}

const TABS: ParamTab[] = [
  { id: 'perigos', label: 'Perigos', table: 'aux_perigos', icon: Activity },
  { id: 'temas', label: 'Temas de Risco', table: 'aux_temas_risco', icon: Tag },
  { id: 'categorias', label: 'Categorias de Controle', table: 'aux_categorias_controle', icon: Shield },
  { id: 'unidades', label: 'Unidades / Locais', table: 'aux_unidades', icon: MapPin },
  { id: 'origens', label: 'Origens de Risco', table: 'aux_origens', icon: Tag },
  { id: 'classificacoes', label: 'Classificações', table: 'aux_classificacoes', icon: Settings },
  { id: 'severidades', label: 'Escala de Severidade', table: 'aux_severidades', icon: AlertTriangle },
  { id: 'probabilidades', label: 'Escala de Probabilidade', table: 'aux_probabilidades', icon: RefreshCw },
  { id: 'status', label: 'Status de Controle', table: 'aux_status_controles', icon: ShieldCheck },
  { id: 'frequencias', label: 'Frequências', table: 'aux_frequencias', icon: Clock },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<ParamTab>(TABS[0])
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isUpsertOpen, setIsUpsertOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({ isOpen: false, id: null })

  async function fetchItems() {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/params?table=${activeTab.table}`, {
        cache: 'no-store'
      })
      const data = await response.json()
      if (data.error) throw new Error(data.error)
      setItems(data || [])
    } catch (error: any) {
      toast.error('Erro ao buscar dados: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setSearchTerm('')
    fetchItems()
  }, [activeTab])

  const filteredItems = items.filter(item => 
    item.nome?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  async function handleDelete(id: string) {
    try {
      const response = await fetch('/api/admin/params', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table: activeTab.table, id }),
      })
      const result = await response.json()
      if (result.error) throw new Error(result.error)
      toast.success('Excluído com sucesso!')
      fetchItems()
    } catch (error: any) {
      toast.error('Erro ao excluir: ' + error.message)
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-mrs-blue">
            <Settings className="w-6 h-6" />
            <h1 className="text-2xl font-extrabold tracking-tight">Configurações da Base</h1>
          </div>
          <p className="text-sm text-gray-500 font-medium">
            Gerencie os parâmetros globais utilizados em todo o sistema AGIR.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingItem(null)
            setIsUpsertOpen(true)
          }}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-mrs-blue text-white rounded-xl font-bold text-sm shadow-lg shadow-mrs-blue/20 hover:bg-mrs-blue-hover transition-all active:scale-[0.98]"
        >
          <Plus className="w-5 h-5" />
          Novo Item
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-gray-100/50 rounded-2xl w-fit">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab.id === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                isActive 
                ? 'bg-white text-mrs-blue shadow-sm ring-1 ring-black/5' 
                : 'text-gray-500 hover:text-mrs-blue hover:bg-white/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-mrs-blue' : 'text-gray-400'}`} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder={`Buscar em ${activeTab.label}...`}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-mrs-blue/10 focus:border-mrs-blue transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={fetchItems}
            className="p-2 text-gray-400 hover:text-mrs-blue hover:bg-white rounded-lg transition-all"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nome do Parâmetro</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tabela</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-6"><div className="h-4 bg-gray-100 rounded w-64"></div></td>
                    <td className="px-6 py-6"><div className="h-4 bg-gray-100 rounded w-32"></div></td>
                    <td className="px-6 py-6 text-right"><div className="h-4 bg-gray-100 rounded w-16 ml-auto"></div></td>
                  </tr>
                ))
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 bg-gray-50 rounded-2xl">
                         <AlertTriangle className="w-8 h-8 text-gray-300" />
                      </div>
                      <p className="text-gray-400 text-sm font-medium">Nenhum item cadastrado para {activeTab.label}.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-mrs-blue">{item.nome}</p>
                      {item.descricao && <p className="text-xs text-gray-400 line-clamp-1">{item.descricao}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-500 font-mono italic">{activeTab.table}</code>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button 
                          onClick={() => {
                            setEditingItem(item)
                            setIsUpsertOpen(true)
                          }}
                          className="p-2 text-gray-400 hover:text-mrs-blue hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setConfirmConfig({ isOpen: true, id: item.id })}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <UpsertParamModal 
        isOpen={isUpsertOpen}
        onClose={() => setIsUpsertOpen(false)}
        onSuccess={fetchItems}
        table={activeTab.table}
        item={editingItem}
        title={activeTab.label}
      />

      <ConfirmModal 
        isOpen={confirmConfig.isOpen}
        title="Excluir Parâmetro"
        description="Tem certeza que deseja remover este item? Isso pode afetar análises de risco existentes que utilizam este parâmetro."
        variant="danger"
        confirmText="Excluir Agora"
        onClose={() => setConfirmConfig({ isOpen: false, id: null })}
        onConfirm={() => confirmConfig.id && handleDelete(confirmConfig.id)}
      />
    </div>
  )
}

/* Internal Components for simplicity within the task */
function UpsertParamModal({ isOpen, onClose, onSuccess, table, item, title }: any) {
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (item) {
      setNome(item.nome || '')
      setDescricao(item.descricao || '')
    } else {
      setNome('')
      setDescricao('')
    }
  }, [item, isOpen])

  if (!isOpen) return null

  async function handleSubmit(e: any) {
    e.preventDefault()
    setSaving(true)
    try {
      const response = await fetch('/api/admin/params', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          table, 
          data: { 
            id: item?.id, // Supabase will insert if undefined
            nome, 
            descricao 
          } 
        }),
      })
      const result = await response.json()
      if (result.error) throw new Error(result.error)
      toast.success(item ? 'Atualizado!' : 'Criado com sucesso!')
      onSuccess()
      onClose()
    } catch (error: any) {
      toast.error('Erro ao salvar: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-mrs-blue/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden transform animate-in slide-in-from-bottom-4 duration-300">
        <div className="bg-mrs-blue p-6 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold tracking-tight">{item ? 'Editar' : 'Novo'} {title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Plus className="w-5 h-5 rotate-45" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-mrs-blue uppercase tracking-widest ml-1">Nome / Título</label>
            <input 
              required
              className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-mrs-blue/10 focus:border-mrs-blue transition-all"
              value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder="Digite o nome..."
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-mrs-blue uppercase tracking-widest ml-1">Descrição (Opcional)</label>
            <textarea 
              className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-mrs-blue/10 focus:border-mrs-blue transition-all min-h-[100px]"
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
              placeholder="Detalhes sobre este parâmetro..."
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 bg-gray-50 text-gray-400 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all">Cancelar</button>
            <button 
              type="submit" 
              disabled={saving}
              className="flex-1 py-3 bg-mrs-blue text-white rounded-xl font-bold text-sm shadow-lg hover:bg-mrs-blue-hover transition-all disabled:opacity-50"
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
