import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://iridamgbkhqheqoirlrc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyaWRhbWdia2hxaGVxb2lybHJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njk5MjY5MCwiZXhwIjoyMDkyNTY4NjkwfQ.QNCJTn_8unmSQZE4E_ddmGww3Yer2QvIbjmEE_wgdKA'
);

async function scanAux() {
  const words = ['unidade', 'unidades', 'localizacao', 'localizacoes', 'locais', 'patios', 'trecho', 'setor', 'área', 'unidade_negocio'];
  console.log('Scanning for aux_ + words...');
  for (const w of words) {
    const table = 'aux_' + w;
    const { error } = await supabase.from(table).select('*').limit(0);
    if (!error) console.log(`✅ FOUND: ${table}`);
  }
}

scanAux();
