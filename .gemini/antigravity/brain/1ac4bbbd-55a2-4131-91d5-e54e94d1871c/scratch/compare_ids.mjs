import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envContent = fs.readFileSync('.env.local', 'utf8')
const env = {}
envContent.split('\n').forEach(line => {
  const [key, ...value] = line.split('=')
  if (key && value) { env[key.trim()] = value.join('=').trim() }
})

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

async function checkIds() {
  const { data: { users } } = await supabase.auth.admin.listUsers()
  const authUser = users.find(u => u.email === 'admin@mrs.com.br')
  
  const { data: auxUser } = await supabase
    .from('aux_usuarios')
    .select('id')
    .eq('email', 'admin@mrs.com.br')
    .single()
    
  console.log('Auth User ID:', authUser?.id)
  console.log('Aux User ID:', auxUser?.id)
  console.log('IDs Match:', authUser?.id === auxUser?.id)
}
checkIds()
