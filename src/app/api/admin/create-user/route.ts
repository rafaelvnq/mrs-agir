import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // 1. Verify the requester's session and role
    const supabase = await createClient()
    const { data: { user: requester }, error: sessionError } = await supabase.auth.getUser()

    if (sessionError || !requester) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Check if requester is a 'Gestor' in aux_usuarios
    const { data: profile, error: profileError } = await supabase
      .from('aux_usuarios')
      .select('nivel_acesso')
      .eq('id', requester.id)
      .single()

    if (profileError || profile?.nivel_acesso !== 'Gestor') {
      return NextResponse.json({ error: 'Acesso negado. Apenas Gestores podem criar usuários.' }, { status: 403 })
    }

    // 2. Parse the request body
    const body = await request.json()
    const { email, password, nome, nivel_acesso } = body

    if (!email || !password || !nome || !nivel_acesso) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes' }, { status: 400 })
    }

    // 3. Create the user using the Admin Client
    const adminSupabase = createAdminClient()
    
    // Create user in Auth
    const { data: newUser, error: createError } = await adminSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email for internal management
      user_metadata: { nome, nivel_acesso }
    })

    if (createError) {
      console.error('Error creating user in Auth:', createError.message)
      return NextResponse.json({ error: createError.message }, { status: 500 })
    }

    if (!newUser.user) {
       return NextResponse.json({ error: 'Falha ao recuperar dados do novo usuário' }, { status: 500 })
    }

    // 4. Create the profile in aux_usuarios
    // Note: This matches the user ID from Auth
    const dbNivelAcesso = nivel_acesso === 'Dono do Risco' ? 'Dono do risco' : nivel_acesso

    const { error: insertError } = await adminSupabase
      .from('aux_usuarios')
      .upsert({
        id: newUser.user.id,
        email: email,
        nome: nome,
        nivel_acesso: dbNivelAcesso,
        senha_alterada: false // Force password change on first login
      }, { onConflict: 'id' })

    if (insertError) {
      console.error('Error creating user profile:', insertError)
      return NextResponse.json({ error: `Usuário criado no Auth, mas falha ao criar perfil auxiliar: ${insertError.message}` }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      user: {
        id: newUser.user.id,
        email: newUser.user.email,
        nome: nome
      }
    })

  } catch (error: any) {
    console.error('Admin API error:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
