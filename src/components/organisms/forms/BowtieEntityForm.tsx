'use client'

import { useState, useEffect } from 'react'
import { X, Save, Trash2, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import GlobalSelectBox from '@/components/molecules/GlobalSelectBox'
import { createClient } from '@/lib/supabase/client'

interface BowtieEntityFormProps {
  isOpen: boolean
  onClose: () => void
  type: 'causa' | 'consequencia' | 'controle'
  riscoId: string
  initialData?: any 
  onSuccess?: () => void
  parentId?: string 
}

export default function BowtieEntityForm({ 
  isOpen, 
  onClose, 
  type, 
  riscoId, 
  initialData,
  onSuccess,
  parentId
}: BowtieEntityFormProps) {
  const [loading, setLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)

  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [temaId, setTemaId] = useState('') 
  const [categoriaId, setCategoriaId] = useState('') 
  const [donoId, setDonoId] = useState('') 
  const [status, setStatus] = useState('') 
  const [frequencia, setFrequencia] = useState('') 
  const [ultimaVer, setUltimaVer] = useState('') 
  const [planoVer, setPlanoVer] = useState('') 

  useEffect(() => {
    async function getProfile() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('aux_usuarios').select('nivel_acesso').eq('id', user.id).single()
        setUserProfile(data)
      }
    }
    if (isOpen) getProfile()
  }, [isOpen])

  useEffect(() => {
    if (initialData) {
      setNome(initialData.nome || '')
      setDescricao(initialData.descricao_longa || '')
      setTemaId(initialData.tema_id || '')
      setCategoriaId(initialData.categoria_id || '')
      setDonoId(initialData.dono_id || '')
      setStatus(initialData.status || '')
      setFrequencia(initialData.frequencia || '')
      setUltimaVer(initialData.ultima_verificacao || '')
      setPlanoVer(initialData.plano_verificacao || '')
    } else {
      setNome('')
      setDescricao('')
      setTemaId('')
      setCategoriaId('')
      setDonoId('')
      setStatus('')
      setFrequencia('')
      setUltimaVer('')
      setPlanoVer('')
    }
  }, [initialData, isOpen])

  const isGestor = userProfile?.nivel_acesso === 'Gestor'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    // Determine subtype if it's a new control
    const subType = initialData?.subtype || (parentId ? (type === 'controle' ? (window as any).lastActionSubtype : null) : null)

    const payload = {
      id: initialData?.id,
      risco_id: riscoId,
      parent_id: initialData?.parent_id || parentId || null,
      subtype: subType, 
      type,
      nome,
      descricao_longa: descricao,
      tema_id: type === 'consequencia' ? temaId : null,
      categoria_id: type === 'controle' ? categoriaId : null,
      dono_id: type === 'controle' ? donoId : null,
      status: type === 'controle' ? status : null,
      frequencia: type === 'controle' ? frequencia : null,
      ultima_verificacao: type === 'controle' ? ultimaVer || null : null,
      plano_verificacao: type === 'controle' ? planoVer : null,
      
      // Smart Positioning
      pos_x: initialData?.pos_x ?? (
        type === 'causa' ? 100 : 
        type === 'consequencia' ? 1300 : 
        (type === 'controle' && subType === 'preventivo' ? 400 : 1000)
      ),
      pos_y: initialData?.pos_y ?? (Math.floor(Math.random() * 200) + 200)
    }

    try {
      const response = await fetch('/api/bowtie/nodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await response.json()
      if (data.error) throw new Error(data.error)

      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} salva com sucesso!`)
      onSuccess?.()
      onClose()
    } catch (error: any) {
      toast.error('Erro ao salvar: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!initialData?.id) return
    setLoading(true)
    try {
      const response = await fetch(`/api/bowtie/nodes?id=${initialData.id}`, { method: 'DELETE' })
      const data = await response.json()
      if (data.error) throw new Error(data.error)

      toast.success('Elemento excluído com sucesso.')
      onSuccess?.()
      onClose()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
      setShowDeleteConfirm(false)
    }
  }

  if (!isOpen) return null

  const typeLabels = {
    causa: 'Causa do Risco',
    consequencia: 'Consequência Indesejada',
    controle: 'Controle / Barreira'
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-mrs-blue/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-300 relative">
        <div className="bg-mrs-blue p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-white/10 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-mrs-yellow" />
             </div>
             <div>
               <h2 className="text-xl font-bold tracking-tight">{initialData ? 'Editar' : 'Nova'} {typeLabels[type]}</h2>
               <p className="text-[10px] uppercase font-bold text-blue-200 tracking-widest leading-none mt-1">Gestão de Contexto Bowtie</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[75vh]">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-mrs-blue uppercase tracking-widest ml-1">Título / Identificação</label>
            <input 
              required
              className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-mrs-blue focus:outline-none focus:border-mrs-blue transition-all"
              placeholder={`Ex: ${type === 'causa' ? 'Falha humana' : type === 'consequencia' ? 'Impacto Ambiental' : 'Checklist Diário'}`}
              value={nome}
              onChange={e => setNome(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-mrs-blue uppercase tracking-widest ml-1">Descrição Detalhada</label>
            <textarea 
              className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-mrs-blue focus:outline-none focus:border-mrs-blue transition-all min-h-[80px]"
              placeholder="Explique o contexto técnico deste elemento..."
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
            />
          </div>

          {type === 'consequencia' && (
            <GlobalSelectBox label="Tema do Risco" table="aux_temas_risco" value={temaId} onChange={setTemaId} required />
          )}

          {type === 'controle' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <GlobalSelectBox label="Categoria" table="aux_categorias_controle" value={categoriaId} onChange={setCategoriaId} required />
                <GlobalSelectBox label="Dono" table="aux_usuarios" value={donoId} onChange={setDonoId} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <GlobalSelectBox label="Status" table="aux_status_controles" value={status} onChange={setStatus} useValueAsName />
                <GlobalSelectBox label="Frequência" table="aux_frequencias" value={frequencia} onChange={setFrequencia} useValueAsName />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-mrs-blue uppercase tracking-widest ml-1">Próxima Verificação</label>
                <input type="date" className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-mrs-blue focus:outline-none focus:border-mrs-blue" value={ultimaVer} onChange={e => setUltimaVer(e.target.value)} />
              </div>
            </>
          )}

          <div className="flex gap-3 pt-4 items-center">
            {initialData && isGestor && (
              <button type="button" onClick={() => setShowDeleteConfirm(true)} className="p-4 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all group">
                <Trash2 className="w-5 h-5 group-hover:scale-110" />
              </button>
            )}
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-gray-50 text-gray-400 rounded-xl font-bold hover:bg-gray-100 text-sm">Cancelar</button>
            <button type="submit" disabled={loading} className="flex-[2] py-4 bg-mrs-blue text-white rounded-xl font-black shadow-lg hover:bg-mrs-blue-hover transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
              {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : 'Salvar Elemento'}
            </button>
          </div>
        </form>

        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-30 flex flex-col items-center justify-center p-10 text-center animate-in fade-in slide-in-from-bottom-4">
             <AlertTriangle className="w-8 h-8 text-red-600 mb-4" />
             <h3 className="text-xl font-black text-mrs-blue mb-2">Confirmar Exclusão?</h3>
             <p className="text-sm text-gray-500 mb-8">Esta ação é permanente e removerá todas as conexões deste item.</p>
             <div className="flex gap-4 w-full">
                <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-4 border border-gray-200 rounded-xl font-bold text-gray-400">Voltar</button>
                <button onClick={handleDelete} className="flex-1 py-4 bg-red-600 text-white rounded-xl font-bold">Sim, Excluir</button>
             </div>
          </div>
        )}
      </div>
    </div>
  )
}
