import { createAdminClient } from './src/lib/supabase/admin.js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createAdminClient();

async function checkSchema() {
  const { data, error } = await supabase
    .from('aux_usuarios')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error fetching aux_usuarios:', error);
  } else {
    console.log('Schema for aux_usuarios (sample data):', data);
  }
}

checkSchema();
