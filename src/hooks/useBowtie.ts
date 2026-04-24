'use client'

import { useState, useCallback, useEffect } from 'react'
import { Node, Edge } from '@xyflow/react'

export function useBowtie(riscoId: string | null, selectedRisk?: any) {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [loading, setLoading] = useState(false)

  const fetchBowtieData = useCallback(async (forceAutoLayout = false) => {
    if (!riscoId) return
    setLoading(true)
    try {
      const response = await fetch(`/api/bowtie/nodes?risco_id=${riscoId}`)
      const resData = await response.json()

      const dbNodes = resData.nodes || []
      const dbEdges = resData.edges || []

      const rfNodes: Node[] = []
      const rfEdges: Edge[] = []
      const riskNodeId = `risk-${riscoId}`
      const hazardNodeId = `hazard-${riscoId}`

      // 1. Static Central Nodes (Always visible)
      rfNodes.push({
        id: hazardNodeId,
        type: 'hazard',
        position: { x: 700 - 15, y: 50 },
        data: { label: selectedRisk?.perigo?.nome || 'Perigo Principal' }
      })
      rfEdges.push({ id: 'e-h-r', source: hazardNodeId, target: riskNodeId, sourceHandle: 'h-bottom', targetHandle: 'r-top' })

      rfNodes.push({
        id: riskNodeId,
        type: 'risk',
        position: { x: 700, y: 300 },
        data: { label: selectedRisk?.nome || 'Risco Central', id: riscoId }
      })

      // 2. Functional Grouping
      const causes = dbNodes.filter((n: any) => n.type === 'causa')
      const consequences = dbNodes.filter((n: any) => n.type === 'consequencia')
      const allControls = dbNodes.filter((n: any) => n.type === 'controle')

      const getY = (index: number, total: number, centerY = 300) => {
        const spacing = 180
        const startY = centerY - ((total - 1) * spacing) / 2
        return startY + index * spacing
      }

      // Group 1: Causes (X=100)
      causes.forEach((node: any, idx: number) => {
        const autoPos = { x: 100, y: getY(idx, causes.length) }
        // Use stored position if it exists, otherwise use autoPos
        const hasPos = node.pos_x !== null && node.pos_y !== null && node.pos_x !== 0
        const finalPos = (forceAutoLayout || !hasPos) ? autoPos : { x: node.pos_x, y: node.pos_y }
        rfNodes.push({ id: node.id, type: 'causa', position: finalPos, data: { label: node.nome, raw: node } })
      })

      // Group 2: Consequences (X=1300)
      consequences.forEach((node: any, idx: number) => {
        const autoPos = { x: 1300, y: getY(idx, consequences.length) }
        const hasPos = node.pos_x !== null && node.pos_y !== null && node.pos_x !== 0
        const finalPos = (forceAutoLayout || !hasPos) ? autoPos : { x: node.pos_x, y: node.pos_y }
        rfNodes.push({ id: node.id, type: 'consequencia', position: finalPos, data: { label: node.nome, raw: node } })
      })

      // Group 3: Controls
      allControls.forEach((node: any) => {
        const edge = dbEdges.find((e: any) => e.target_id === node.id || e.source_id === node.id)
        const parentId = node.parent_id || (edge?.source_id === node.id ? edge?.target_id : edge?.source_id)
        const parent = dbNodes.find((n: any) => n.id === parentId)
        
        let autoX = 400
        let autoY = 300
        if (parent) {
           const parentInRf = rfNodes.find(n => n.id === parent.id)
           autoY = parentInRf?.position.y || 300
           if (parent.type === 'consequencia') autoX = 1000
        }

        const hasPos = node.pos_x !== null && node.pos_y !== null && node.pos_x !== 0
        const finalPos = (forceAutoLayout || !hasPos) ? { x: autoX, y: autoY } : { x: node.pos_x, y: node.pos_y }
        rfNodes.push({ id: node.id, type: 'controle', position: finalPos, data: { label: node.nome, raw: node } })
      })

      // 3. Cabling
      const rfNodesMap = new Map(rfNodes.map(n => [n.id, n]))
      dbEdges.forEach((edge: any) => {
        const s = rfNodesMap.get(edge.source_id)
        const t = rfNodesMap.get(edge.target_id)
        if (s && t) {
          rfEdges.push({ id: edge.id, source: edge.source_id, target: edge.target_id, sourceHandle: edge.source_handle, targetHandle: edge.target_handle })
          if (s.type === 'causa' && t.type === 'controle') {
             rfEdges.push({ id: `rl-${t.id}`, source: t.id, sourceHandle: 'ctrl-right', target: riskNodeId, targetHandle: 'r-left' })
          }
          if (s.type === 'controle' && t.type === 'consequencia') {
             rfEdges.push({ id: `rl-${s.id}`, source: riskNodeId, sourceHandle: 'r-right', target: s.id, targetHandle: 'ctrl-left' })
          }
        }
      })

      // Fallback connections
      rfNodes.forEach(node => {
        if (node.type === 'causa' || node.type === 'consequencia') {
           if (!rfEdges.some(e => e.source === node.id || e.target === node.id)) {
              if (node.type === 'causa') rfEdges.push({ id: `f-${node.id}`, source: node.id, target: riskNodeId, sourceHandle: 'c-right', targetHandle: 'r-left' })
              else rfEdges.push({ id: `f-${node.id}`, source: riskNodeId, target: node.id, sourceHandle: 'r-right', targetHandle: 'con-left' })
           }
        }
      })

      setNodes(rfNodes)
      setEdges(rfEdges)

      // Persistence for forced layout
      if (forceAutoLayout) {
        for (const n of rfNodes) {
           if (['causa', 'consequencia', 'controle'].includes(n.type as string)) {
             await updateNodePosition(n.id, n.position.x, n.position.y)
           }
        }
      }
    } catch (error) {
      console.error('Bowtie render failed:', error)
    } finally {
      setLoading(false)
    }
  }, [riscoId, selectedRisk])

  const updateNodePosition = async (id: string, x: number, y: number) => {
    try {
      await fetch('/api/bowtie/nodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, pos_x: Math.round(x), pos_y: Math.round(y), risco_id: riscoId })
      })
    } catch (e) { }
  }

  const autoOrganize = () => fetchBowtieData(true)

  useEffect(() => { fetchBowtieData() }, [fetchBowtieData])

  return { nodes, edges, loading, refresh: fetchBowtieData, updateNodePosition, autoOrganize }
}
