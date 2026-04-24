import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const table = searchParams.get('table')

  if (!table) return NextResponse.json({ error: 'Tabela não especificada' }, { status: 400 })

  const adminSupabase = createAdminClient()
  const { data, error } = await adminSupabase
    .from(table)
    .select('*')
    .order('nome', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    // Verify 'Gestor' status
    const { data: profile } = await supabase
      .from('aux_usuarios')
      .select('nivel_acesso')
      .eq('id', user.id)
      .single()

    if (profile?.nivel_acesso !== 'Gestor') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const { table, data } = await request.json()
    if (!table || !data) return NextResponse.json({ error: 'Dados ausentes' }, { status: 400 })

    const adminSupabase = createAdminClient()
    const { error } = await adminSupabase
      .from(table)
      .upsert(data, { onConflict: 'id' })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const { data: profile } = await supabase
      .from('aux_usuarios')
      .select('nivel_acesso')
      .eq('id', user.id)
      .single()

    if (profile?.nivel_acesso !== 'Gestor') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const { table, id } = await request.json()
    if (!table || !id) return NextResponse.json({ error: 'Dados ausentes' }, { status: 400 })

    const adminSupabase = createAdminClient()
    const { error } = await adminSupabase
      .from(table)
      .delete()
      .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
