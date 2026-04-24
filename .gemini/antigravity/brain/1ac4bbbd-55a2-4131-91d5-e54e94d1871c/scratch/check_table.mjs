import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envContent = fs.readFileSync('.env.local', 'utf8')
const env = {}
envContent.split('\n').forEach(line => {
  const [key, ...value] = line.split('=')
  if (key && value) { env[key.trim()] = value.join('=').trim() }
})

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

async function checkTable() {
  const { data, error } = await supabase.from('aux_usuarios').select('*').limit(1)
  if (error) {
    console.error('Table aux_usuarios check failed:', error.message)
  } else {
    console.log('Table aux_usuarios exists. Columns found in first row keys:', Object.keys(data[0] || {}))
  }
}
checkTable()
