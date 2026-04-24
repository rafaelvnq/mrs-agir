import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const riscoId = searchParams.get('risco_id')
  if (!riscoId) return NextResponse.json({ error: 'Risco ID ausente' }, { status: 400 })

  const adminSupabase = createAdminClient()
  const { data: nodes, error: nodesError } = await adminSupabase
    .from('bowtie_nodes')
    .select('*, dono:aux_usuarios(nome), tema:aux_temas_risco(nome), categoria:aux_categorias_controle(nome)')
    .eq('risco_id', riscoId)

  if (nodesError) return NextResponse.json({ error: nodesError.message }, { status: 500 })

  const { data: edges, error: edgesError } = await adminSupabase.from('bowtie_edges').select('*').eq('risco_id', riscoId)
  return NextResponse.json({ nodes, edges })
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const body = await request.json()
    const { id, parent_id, subtype, ...saveData } = body
    const adminSupabase = createAdminClient()

    // INTELLIGENT SAVE: 
    // If we only have ID and positions (drag & drop), use UPDATE instead of UPSERT
    // to avoid triggering "Missing required columns" errors.
    if (id && Object.keys(saveData).length <= 3 && (saveData.pos_x || saveData.pos_y)) {
       const { error } = await adminSupabase
         .from('bowtie_nodes')
         .update({ pos_x: saveData.pos_x, pos_y: saveData.pos_y })
         .eq('id', id)
       
       if (error) return NextResponse.json({ error: error.message }, { status: 500 })
       return NextResponse.json({ success: true })
    }

    // NORMAL SAVE (Full Form)
    const { data: node, error: nodeError } = await adminSupabase
      .from('bowtie_nodes')
      .upsert({ id: id || undefined, ...saveData })
      .select().single()

    if (nodeError) return NextResponse.json({ error: nodeError.message }, { status: 500 })

    // Edge Creation for new nodes
    if (!id && parent_id && node) {
      const isUuid = (val: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(val)
      let sId = '', tId = '', sH = '', tH = ''

      if (saveData.type === 'controle') {
         if (subtype === 'mitigatorio') { sId = node.id; tId = parent_id; sH = 'ctrl-right'; tH = 'con-left' }
         else { sId = parent_id; tId = node.id; sH = 'c-right'; tH = 'ctrl-left' }
      }
      if (isUuid(sId) && isUuid(tId)) {
        await adminSupabase.from('bowtie_edges').insert({ risco_id: saveData.risco_id, source_id: sId, target_id: tId, source_handle: sH, target_handle: tH })
      }
    }

    return NextResponse.json(node)
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }) }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const adminSupabase = createAdminClient()
    await adminSupabase.from('bowtie_nodes').delete().eq('id', id)
    return NextResponse.json({ success: true })
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }) }
}
