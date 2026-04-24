import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envContent = fs.readFileSync('.env.local', 'utf8')
const env = {}
envContent.split('\n').forEach(line => {
  const [key, ...value] = line.split('=')
  if (key && value) { env[key.trim()] = value.join('=').trim() }
})

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

async function checkData() {
  const { data, error } = await supabase
    .from('aux_usuarios')
    .select('email, senha_alterada')
    .eq('email', 'admin@mrs.com.br')
    .single()
    
  if (error) {
    console.error('Error fetching admin profile:', error.message)
  } else {
    console.log('Admin Profile Data:', data)
  }
}
checkData()
