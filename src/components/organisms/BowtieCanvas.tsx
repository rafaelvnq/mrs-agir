'use client'

import React, { useCallback, useMemo, useState, useEffect } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  Panel,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { LayoutGrid, MousePointer2 } from 'lucide-react'

import { RiskNode, CauseNode, ConsequenceNode, ControlNode, HazardNode } from './nodes/CustomNodes'
import { useBowtie } from '@/hooks/useBowtie'
import BowtieEntityForm from './forms/BowtieEntityForm'

const nodeTypes = {
  risk: RiskNode,
  causa: CauseNode,
  consequencia: ConsequenceNode,
  controle: ControlNode,
  hazard: HazardNode,
}

interface BowtieCanvasProps {
  riscoId: string
  selectedRisk?: any
}

export default function BowtieCanvas({ riscoId, selectedRisk }: BowtieCanvasProps) {
  const { nodes, edges, loading, refresh, updateNodePosition, autoOrganize } = useBowtie(riscoId, selectedRisk)
  
  const [rfNodes, setNodes, onNodesChange] = useNodesState([])
  const [rfEdges, setEdges, onEdgesChange] = useEdgesState([])

  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'causa' | 'consequencia' | 'controle'>('causa')
  const [modalData, setModalData] = useState<any>(null)

  useEffect(() => {
    const nodesWithInteractions = nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        onAdd: (parentId: string, type: any, subtype?: string) => {
          const parentNode = nodes.find(n => n.id === parentId);
          const parentType = parentNode?.type || (parentId.toString().startsWith('risk') ? 'risk' : 'causa');
          
          let actualSubtype = subtype;
          if (type === 'controle') {
            actualSubtype = parentType === 'consequencia' ? 'mitigatorio' : 'preventivo';
          }
          if (actualSubtype) (window as any).lastActionSubtype = actualSubtype;

          setModalType(type)
          setModalData({ parent_id: parentId, subtype: actualSubtype })
          setModalOpen(true)
        }
      }
    }))
    setNodes(nodesWithInteractions)
    setEdges(edges)
  }, [nodes, edges, setNodes, setEdges])

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (node.type === 'hazard') return
    setModalType(node.type as any)
    setModalData(node.data.raw || node.data)
    setModalOpen(true)
  }, [])

  const onNodeDragStop = useCallback((event: any, node: Node) => {
    updateNodePosition(node.id, node.position.x, node.position.y)
  }, [updateNodePosition])

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  return (
    <div className="w-full h-full bg-slate-50 relative group/canvas overflow-hidden">
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.1}
        maxZoom={2}
        className="bowtie-flow transition-all"
      >
        <Background color="#cbd5e1" gap={25} size={1} />
        <Controls showInteractive={false} className="bg-white border-none shadow-2xl rounded-2xl overflow-hidden m-4" />
        
        <Panel position="top-right" className="m-4 flex flex-col gap-2 items-end">
           <div className="bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-gray-100 shadow-xl text-[10px] font-black text-mrs-blue uppercase tracking-widest flex items-center gap-2">
              <MousePointer2 className="w-3 h-3 text-emerald-500" />
              Arraste para organizar | [+] para expandir
           </div>
           
           <button 
             onClick={autoOrganize}
             className="bg-mrs-blue hover:bg-mrs-blue-hover text-white px-5 py-3 rounded-2xl shadow-xl transition-all flex items-center gap-3 active:scale-95 group border border-white/20"
           >
              <LayoutGrid className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
              <span className="text-[11px] font-black uppercase tracking-widest">Auto-Organizar Diagrama</span>
           </button>
        </Panel>

        <Panel position="top-left" className="m-6">
           <div className="bg-mrs-blue/10 backdrop-blur-md px-4 py-2 rounded-xl border border-mrs-blue/20 flex flex-col">
              <span className="text-[10px] font-black text-mrs-blue opacity-50 uppercase tracking-[0.2em] mb-1">Status do Motor</span>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                 <span className="text-xs font-bold text-mrs-blue">Sincronização Ativa</span>
              </div>
           </div>
        </Panel>
      </ReactFlow>
      
      <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md p-5 rounded-[1.5rem] border border-gray-100 shadow-2xl z-10 pointer-events-none animate-in slide-in-from-bottom-4 duration-700">
        <div className="flex gap-8 items-center">
            <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-orange-500 rounded-lg shadow-sm" />
                <span className="text-[11px] font-black text-mrs-blue uppercase tracking-widest border-l-2 border-orange-500/20 pl-2">Causas</span>
            </div>
            <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-emerald-500 rounded-full shadow-sm" />
                <span className="text-[11px] font-black text-mrs-blue uppercase tracking-widest border-l-2 border-emerald-500/20 pl-2">Risco Central</span>
            </div>
            <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-red-500 rounded-lg shadow-sm" />
                <span className="text-[11px] font-black text-mrs-blue uppercase tracking-widest border-l-2 border-red-500/20 pl-2">Consequências</span>
            </div>
        </div>
      </div>

      {modalOpen && (
        <BowtieEntityForm 
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false)
            setModalData(null)
          }}
          type={modalType}
          riscoId={riscoId}
          parentId={modalData?.parent_id}
          initialData={modalData?.id ? modalData : null}
          onSuccess={refresh}
        />
      )}
      
      {loading && (
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-50 flex items-center justify-center">
           <div className="w-10 h-10 border-4 border-mrs-blue/20 border-t-mrs-blue rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}
