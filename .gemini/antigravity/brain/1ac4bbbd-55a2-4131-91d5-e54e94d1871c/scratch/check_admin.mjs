import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envContent = fs.readFileSync('.env.local', 'utf8')
const env = {}
envContent.split('\n').forEach(line => {
  const [key, ...value] = line.split('=')
  if (key && value) { env[key.trim()] = value.join('=').trim() }
})

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

async function check() {
  const { data: { users }, error } = await supabase.auth.admin.listUsers()
  if (error) {
    console.error(error)
  } else {
    const admin = users.find(u => u.email === 'admin@mrs.com.br')
    console.log(admin ? 'Admin exists' : 'Admin NOT found')
  }
}
check()
