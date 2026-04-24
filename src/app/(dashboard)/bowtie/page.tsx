'use client'

import { useRisk } from '@/context/RiskContext'
import { Network, Activity, AlertTriangle } from 'lucide-react'
import BowtieCanvas from '@/components/organisms/BowtieCanvas'
import { ReactFlowProvider } from '@xyflow/react'

export default function BowtiePage() {
  const { selectedRiskId, risks } = useRisk()
  
  const selectedRisk = risks.find(r => r.id === selectedRiskId)

  return (
    <div className="p-8 h-full flex flex-col">
      {!selectedRiskId ? (
        <div className="flex flex-col items-center justify-center flex-1 text-center space-y-4">
          <div className="p-6 bg-blue-50 rounded-full">
            <Network className="w-12 h-12 text-mrs-blue opacity-20" />
          </div>
          <h2 className="text-xl font-bold text-mrs-blue">Nenhum Risco Selecionado</h2>
          <p className="text-sm text-gray-400 max-w-xs">
            Selecione uma análise no dropdown superior para visualizar o diagrama Bowtie correspondente.
          </p>
        </div>
      ) : (
        <div className="animate-in fade-in zoom-in-95 duration-500 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-black text-mrs-blue tracking-tight">
                {selectedRisk?.nome}
              </h1>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">
                Ref: {selectedRisk?.codigo_ref.toString().padStart(3, '0')} | Bowtie Canvas
              </p>
            </div>
            
            <div className="flex gap-4">
               <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm flex items-center gap-2">
                 <Activity className="w-4 h-4 text-mrs-blue" />
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Severidade:</span>
                 <span className="text-xs font-black text-red-600">{selectedRisk?.severidade || 'N/A'}</span>
               </div>
               <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm flex items-center gap-2">
                 <AlertTriangle className="w-4 h-4 text-mrs-blue" />
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Probabilidade:</span>
                 <span className="text-xs font-black text-mrs-blue">{selectedRisk?.probabilidade || 'N/A'}</span>
               </div>
            </div>
          </div>

          {/* Engine Visual (React Flow v12) */}
          <div className="flex-1 bg-white rounded-[2rem] border-2 border-slate-100 shadow-2xl relative overflow-hidden ring-1 ring-mrs-blue/5">
            <ReactFlowProvider>
              <BowtieCanvas riscoId={selectedRiskId} selectedRisk={selectedRisk} />
            </ReactFlowProvider>
          </div>
        </div>
      )}
    </div>
  )
}
