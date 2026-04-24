'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function updatePassword(newPassword: string) {
  const supabase = await createClient()

  // 1. Update password in Supabase Auth
  const { error: authError } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (authError) {
    return { error: authError.message }
  }

  // 2. Identify the user to update the auxiliary table
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Usuário não encontrado' }
  }

  // 3. Update the senha_alterada flag in the database
  const { error: dbError } = await supabase
    .from('aux_usuarios')
    .update({ senha_alterada: true })
    .eq('id', user.id)

  if (dbError) {
    console.error('Error updating profile status:', dbError.message)
    // We don't return error here because the password IS changed in Auth.
    // However, it will keep redirecting the user if this fails.
    return { error: 'Senha alterada no Auth, mas erro ao atualizar perfil. Tente novamente.' }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
