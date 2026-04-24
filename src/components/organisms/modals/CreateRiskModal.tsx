'use client'

import { useState } from 'react'
import { X, Save } from 'lucide-react'
import { toast } from 'sonner'
import { useRisk } from '@/context/RiskContext'
import GlobalSelectBox from '@/components/molecules/GlobalSelectBox'

interface CreateRiskModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateRiskModal({ isOpen, onClose }: CreateRiskModalProps) {
  const { fetchRisks, setSelectedRiskId } = useRisk()
  const [loading, setLoading] = useState(false)
  
  // Form State
  const [nome, setNome] = useState('')
  const [perigoId, setPerigoId] = useState('')
  const [donoId, setDonoId] = useState('')
  const [origemId, setOrigemId] = useState('')
  const [classificacaoId, setClassificacaoId] = useState('')
  const [referencias, setReferencias] = useState('')
  const [severidade, setSeveridade] = useState('')
  const [probabilidade, setProbabilidade] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nome || !perigoId || !donoId) {
      toast.error('Preencha os campos obrigatórios (Nome, Perigo e Dono)')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/riscos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          perigo_id: perigoId,
          dono_id: donoId,
          origem_id: origemId || null,
          classificacao_id: classificacaoId || null,
          referencias,
          severidade,
          probabilidade
        })
      })

      const data = await response.json()
      if (data.error) throw new Error(data.error)

      toast.success('Risco criado com sucesso!')
      await fetchRisks()
      setSelectedRiskId(data.id)
      onClose()
    } catch (error: any) {
      toast.error('Erro ao criar risco: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-mrs-blue/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
        {/* Header */}
        <div className="bg-mrs-blue p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Nova Análise de Risco</h2>
            <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mt-1">Configuração de Central do Bowtie</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto max-h-[70vh]">
          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-2">
              <label className="text-[11px] font-black text-mrs-blue uppercase tracking-widest ml-1">Título do Risco Principal</label>
              <input 
                required
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-mrs-blue focus:outline-none focus:ring-4 focus:ring-mrs-blue/5 focus:border-mrs-blue transition-all"
                placeholder="Ex: Descarrilamento em via principal..."
                value={nome}
                onChange={e => setNome(e.target.value)}
              />
            </div>

            <GlobalSelectBox 
              label="Perigo Associado (Hazard)"
              table="aux_perigos"
              value={perigoId}
              onChange={setPerigoId}
              required
            />

            <GlobalSelectBox 
              label="Dono do Risco"
              table="aux_usuarios"
              value={donoId}
              onChange={setDonoId}
              required
            />
          </div>

          <div className="h-px bg-gray-100" />

          {/* Classification Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlobalSelectBox 
              label="Origem"
              table="aux_origens"
              value={origemId}
              onChange={setOrigemId}
            />

            <GlobalSelectBox 
              label="Classificação"
              table="aux_classificacoes"
              value={classificacaoId}
              onChange={setClassificacaoId}
            />
          </div>

          {/* Severity & Probability */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-3xl border border-gray-100">
            <GlobalSelectBox 
              label="Severidade"
              table="aux_severidades"
              value={severidade}
              onChange={setSeveridade}
              required
              useValueAsName
            />

            <GlobalSelectBox 
              label="Probabilidade"
              table="aux_probabilidades"
              value={probabilidade}
              onChange={setProbabilidade}
              required
              useValueAsName
            />
          </div>

          {/* References */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-mrs-blue uppercase tracking-widest ml-1">Referências Externas</label>
            <textarea 
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-mrs-blue focus:outline-none focus:ring-4 focus:ring-mrs-blue/5 focus:border-mrs-blue transition-all min-h-[100px]"
              placeholder="Normas, regulamentos ou documentos de referência..."
              value={referencias}
              onChange={e => setReferencias(e.target.value)}
            />
          </div>

          {/* Footer Actions */}
          <div className="flex gap-4 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 py-4 bg-gray-50 text-gray-400 rounded-2xl font-bold hover:bg-gray-100 transition-all"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-[2] py-4 bg-mrs-blue text-white rounded-2xl font-black shadow-xl shadow-mrs-blue/20 hover:bg-mrs-blue-hover transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Salvar Risco
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
