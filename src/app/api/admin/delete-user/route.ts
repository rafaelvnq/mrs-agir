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

    const { userId } = await request.json()
    if (!userId) {
      return NextResponse.json({ error: 'ID do usuário ausente' }, { status: 400 })
    }

    const adminSupabase = createAdminClient()

    // 1. Delete from aux_usuarios (profile)
    const { error: profileError } = await adminSupabase
      .from('aux_usuarios')
      .delete()
      .eq('id', userId)

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    // 2. Delete from Auth
    const { error: authError } = await adminSupabase.auth.admin.deleteUser(userId)

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
