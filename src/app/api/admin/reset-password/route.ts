import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user: requester } } = await supabase.auth.getUser()

    if (!requester) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('aux_usuarios')
      .select('nivel_acesso')
      .eq('id', requester.id)
      .single()

    if (profile?.nivel_acesso !== 'Gestor') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const { userId, email } = await request.json()
    if (!userId || !email) {
      return NextResponse.json({ error: 'Dados ausentes' }, { status: 400 })
    }

    const adminSupabase = createAdminClient()

    // 1. Reset password in Auth
    const { error: authError } = await adminSupabase.auth.admin.updateUserById(userId, {
      password: email
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 500 })
    }

    // 2. Reset senha_alterada flag in aux_usuarios
    const { error: profileError } = await adminSupabase
      .from('aux_usuarios')
      .update({ senha_alterada: false })
      .eq('id', userId)

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
