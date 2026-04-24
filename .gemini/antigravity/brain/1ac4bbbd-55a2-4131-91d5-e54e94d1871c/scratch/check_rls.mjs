import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envContent = fs.readFileSync('.env.local', 'utf8')
const env = {}
envContent.split('\n').forEach(line => {
  const [key, ...value] = line.split('=')
  if (key && value) { env[key.trim()] = value.join('=').trim() }
})

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

async function checkRLS() {
  const { data, error } = await supabase.rpc('check_rls', { table_name: 'aux_usuarios' })
  // Since we don't have this RPC usually, let's just query pg_policies
  
  const { data: policies, error: polError } = await supabase
    .from('pg_policies') // This might be accessible via service role
    .select('*')
    .eq('tablename', 'aux_usuarios')
    
  if (polError) {
    console.log('Cannot check policies directly. Trying to read as a normal user...')
    
    // Create an anon client to test
    const anonClient = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    const { data: testData, error: testError } = await anonClient.from('aux_usuarios').select('*').limit(1)
    
    if (testError) {
      console.log('Anon read failed:', testError.message)
    } else {
      console.log('Anon read succeeded (RLS might be OFF or public):', testData)
    }
  } else {
    console.log('Policies found:', policies)
  }
}
checkRLS()
