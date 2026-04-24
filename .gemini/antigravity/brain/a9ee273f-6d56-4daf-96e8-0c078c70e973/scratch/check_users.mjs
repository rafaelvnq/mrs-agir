import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkUsers() {
  const { data, error } = await supabase
    .from('aux_usuarios')
    .select('id, email, nome, nivel_acesso, senha_alterada');

  if (error) {
    console.error('Error fetching aux_usuarios:', error);
  } else {
    console.log('Current users in aux_usuarios:');
    console.table(data);
  }
}

checkUsers();
