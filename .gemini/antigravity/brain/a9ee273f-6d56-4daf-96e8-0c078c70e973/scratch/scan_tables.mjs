import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://iridamgbkhqheqoirlrc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyaWRhbWdia2hxaGVxb2lybHJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njk5MjY5MCwiZXhwIjoyMDkyNTY4NjkwfQ.QNCJTn_8unmSQZE4E_ddmGww3Yer2QvIbjmEE_wgdKA'
);

async function listAllTables() {
  // We don't have direct SQL access usually, but we can try common names or use a trick.
  // Actually, I'll try to fetch from a common table and see if I can guess more.
  
  // Try to use the REST API to list tables (if PostgREST allows it)
  // Or just guess more names.
  
  const commonNames = [
    'aux_perigos', 
    'aux_temas_risco', 
    'aux_categorias_controle', 
    'aux_locais', 
    'aux_unidades',
    'aux_areas', 
    'aux_setores',
    'aux_filiais',
    'aux_empresas',
    'aux_unidades_mrs'
  ];

  console.log('Scanning for auxiliary tables...');
  for (const name of commonNames) {
    const { error } = await supabase.from(name).select('*').limit(0);
    if (!error) {
      console.log(`✅ Found: ${name}`);
    } else if (error.code !== 'PGRST116' && error.code !== '42P01') {
       // PGRST116 is not found in some versions, but 42P01 is standard PG for undefined_table
       // console.log(`? ${name}: ${error.code} - ${error.message}`);
    }
  }
}

listAllTables();
