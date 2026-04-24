import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Simple env file parser
const envContent = fs.readFileSync('.env.local', 'utf8')
const env = {}
envContent.split('\n').forEach(line => {
  const [key, ...value] = line.split('=')
  if (key && value) {
    env[key.trim()] = value.join('=').trim()
  }
})

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing environment variables in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function bootstrap() {
  const email = 'admin@mrs.com.br'
  const password = email // Rule: email is the initial password

  console.log(`Attempting to create user: ${email}`)

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: 'Gestor' }
  })

  if (error) {
    if (error.message.includes('already registered')) {
      console.log('User already exists.')
    } else {
      console.error('Error creating admin user:', error.message)
    }
  } else {
    console.log('Admin user created successfully:', data.user?.id)
  }
}

bootstrap()
