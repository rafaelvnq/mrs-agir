'use client'

import React, { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { Plus, User, ShieldCheck, Clock } from 'lucide-react'

const ActionButton = ({ onClick, position, side }: { onClick: (e: any) => void, position: string, side: 'left' | 'right' | 'top' | 'bottom' }) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick(e);
    }}
    className={`absolute ${position} z-20 w-8 h-8 bg-white border-2 border-mrs-blue rounded-full flex items-center justify-center text-mrs-blue opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-xl active:scale-90 duration-300`}
  >
    <Plus className="w-5 h-5" />
  </button>
)

const HazardNode = memo(({ data }: NodeProps) => {
  return (
    <div className="px-6 py-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl shadow-sm min-w-[220px] relative transition-all hover:border-mrs-blue/50 group">
      <div className="absolute top-0 left-0 right-0 h-2 bg-yellow-400 rounded-t-2xl" 
           style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fbbf24, #fbbf24 10px, #1f2937 10px, #1f2937 20px)' }} />
      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5 mt-1">Perigo (Hazard)</span>
      <span className="text-sm font-bold text-mrs-blue leading-tight block">{data.label}</span>
      <Handle type="source" position={Position.Bottom} id="h-bottom" className="w-3 h-3 bg-gray-400 !-bottom-1.5 border-2 border-white" />
    </div>
  )
})

const RiskNode = memo(({ data }: NodeProps) => {
  return (
    <div className="relative group flex flex-col items-center">
      <ActionButton side="left" position="-left-12 top-1/2 -translate-y-1/2" onClick={() => data.onAdd(data.raw?.id || data.id, 'causa')} />
      <ActionButton side="right" position="-right-12 top-1/2 -translate-y-1/2" onClick={() => data.onAdd(data.raw?.id || data.id, 'consequencia')} />

      <div className={`w-48 h-48 rounded-full bg-emerald-500 border-[6px] border-white shadow-[0_20px_50px_rgba(16,185,129,0.3)] flex items-center justify-center text-center p-8 relative transition-all duration-500 hover:scale-105 cursor-pointer`}>
        <Handle type="target" position={Position.Left} id="r-left" className="w-4 h-4 bg-white border-2 border-emerald-500 !-left-2 opacity-0" />
        <Handle type="source" position={Position.Right} id="r-right" className="w-4 h-4 bg-white border-2 border-emerald-500 !-right-2 opacity-0" />
        <Handle type="target" position={Position.Top} id="r-top" className="w-4 h-4 bg-white border-2 border-emerald-500 !-top-2 opacity-0" />
        
        <div className="text-white font-black text-base tracking-tight leading-tight uppercase drop-shadow-lg">
          {data.label || 'Evento de Topo'}
        </div>
      </div>
    </div>
  )
})

const CauseNode = memo(({ data }: NodeProps) => {
  return (
    <div className="group relative">
      <div className="px-7 py-5 bg-orange-500 rounded-[1.5rem] shadow-xl border-4 border-white min-w-[240px] max-w-[300px] relative transition-all hover:translate-x-2 cursor-pointer shadow-orange-500/20">
        <Handle type="source" position={Position.Right} id="c-right" className="w-3 h-3 bg-white border-2 border-orange-500 !-right-2 opacity-0" />
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-orange-100 uppercase tracking-widest mb-1.5 opacity-80">Principal Causa</span>
          <span className="text-sm font-bold text-white leading-snug">{data.label}</span>
        </div>
      </div>
      <ActionButton side="right" position="-right-4 top-1/2 -translate-y-1/2" onClick={() => data.onAdd(data.raw?.id || data.id, 'controle')} />
    </div>
  )
})

const ConsequenceNode = memo(({ data }: NodeProps) => {
  return (
    <div className="group relative">
      <div className="px-7 py-5 bg-red-500 rounded-[1.5rem] shadow-xl border-4 border-white min-w-[240px] max-w-[300px] relative transition-all hover:-translate-x-2 cursor-pointer shadow-red-500/20">
        <Handle type="target" position={Position.Left} id="con-left" className="w-3 h-3 bg-white border-2 border-red-500 !-left-2 opacity-0" />
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-red-100 uppercase tracking-widest mb-1.5 opacity-80">Impacto / Outcome</span>
          <span className="text-sm font-bold text-white leading-snug">{data.label}</span>
        </div>
      </div>
      <ActionButton side="left" position="-left-4 top-1/2 -translate-y-1/2" onClick={() => data.onAdd(data.raw?.id || data.id, 'controle')} />
    </div>
  )
})

const ControlNode = memo(({ data }: NodeProps) => {
  const raw = data.raw || {}
  const statusColor = {
    'Em vigor': 'bg-emerald-500',
    'Pendente': 'bg-amber-500',
    'Vencido': 'bg-red-500',
    'Atrasado': 'bg-red-500'
  }[raw.status] || 'bg-mrs-blue'

  return (
    <div className="px-5 py-4 bg-white rounded-2xl shadow-lg border border-gray-100 min-w-[200px] relative group border-l-[6px] hover:shadow-2xl transition-all cursor-pointer overflow-hidden" 
         style={{ borderLeftColor: statusColor.replace('bg-', '') === 'emerald-500' ? '#10b981' : (raw.status === 'Pendente' ? '#f59e0b' : '#3b82f6') }}>
      
      <div className={`absolute top-0 right-0 px-2 py-0.5 rounded-bl-lg text-[7px] font-black text-white uppercase tracking-tighter ${statusColor}`}>
        {raw.status || 'S/ STATUS'}
      </div>

      <Handle type="target" position={Position.Left} id="ctrl-left" className="!-left-2 opacity-0" />
      <Handle type="source" position={Position.Right} id="ctrl-right" className="!-right-2 opacity-0" />
      
      <div className="flex flex-col space-y-2">
        <div className="space-y-0.5">
          <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest leading-none">Barreira de Segurança</span>
          <span className="text-[12px] font-bold text-mrs-blue leading-tight block break-words">{data.label}</span>
        </div>

        <div className="pt-2 border-t border-gray-50 flex items-center justify-between">
           <div className="flex items-center gap-1.5 overflow-hidden">
              <div className="p-1 bg-blue-50 rounded-md">
                <User className="w-2.5 h-2.5 text-mrs-blue" />
              </div>
              <span className="text-[9px] font-bold text-gray-500 truncate">{raw.dono?.nome || 'Sem Responsável'}</span>
           </div>
           
           {raw.ultima_verificacao && (
             <div className="flex items-center gap-1 text-gray-300">
               <Clock className="w-2.5 h-2.5" />
               <span className="text-[8px] font-bold">{new Date(raw.ultima_verificacao).toLocaleDateString()}</span>
             </div>
           )}
        </div>
      </div>
    </div>
  )
})

HazardNode.displayName = 'HazardNode'
RiskNode.displayName = 'RiskNode'
CauseNode.displayName = 'CauseNode'
ConsequenceNode.displayName = 'ConsequenceNode'
ControlNode.displayName = 'ControlNode'

export { HazardNode, RiskNode, CauseNode, ConsequenceNode, ControlNode }
