import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://iridamgbkhqheqoirlrc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyaWRhbWdia2hxaGVxb2lybHJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njk5MjY5MCwiZXhwIjoyMDkyNTY4NjkwfQ.QNCJTn_8unmSQZE4E_ddmGww3Yer2QvIbjmEE_wgdKA'
);

async function checkTables() {
  const tables = ['aux_perigos', 'aux_temas_risco', 'aux_categorias_controle', 'aux_localizacoes'];
  
  for (const table of tables) {
    console.log(`Checking table: ${table}`);
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
       console.log(`❌ Table ${table} error:`, error.message);
    } else {
       console.log(`✅ Table ${table} exists. Sample:`, data);
    }
  }
}

checkTables();
