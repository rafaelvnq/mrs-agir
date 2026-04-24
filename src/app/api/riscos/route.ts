import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Buscamos os riscos e incluímos o nome do perigo correlacionado
    const { data, error } = await supabase
      .from('riscos')
      .select(`
        *,
        perigo:aux_perigos(nome)
      `)
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    // Apenas Gestores podem criar novos riscos (RN do PRD)
    const { data: profile } = await supabase
      .from('aux_usuarios')
      .select('nivel_acesso')
      .eq('id', user.id)
      .single()

    if (profile?.nivel_acesso !== 'Gestor') {
      return NextResponse.json({ error: 'Acesso negado: Apenas Gestores podem criar riscos.' }, { status: 403 })
    }

    const body = await request.json()
    
    const adminSupabase = createAdminClient()
    const { data, error } = await adminSupabase
      .from('riscos')
      .insert(body)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
