import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://iridamgbkhqheqoirlrc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyaWRhbWdia2hxaGVxb2lybHJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njk5MjY5MCwiZXhwIjoyMDkyNTY4NjkwfQ.QNCJTn_8unmSQZE4E_ddmGww3Yer2QvIbjmEE_wgdKA'
);

async function findColumns() {
  const table = 'aux_categorias_controle';
  const cols = ['id', 'nome', 'descricao', 'observacao', 'detalhes', 'ativo', 'status', 'created_at'];
  
  for (const c of cols) {
    const { error } = await supabase.from(table).select(c).limit(1);
    if (!error) {
       console.log(`✅ Column found: ${c}`);
    } else {
       // console.log(`❌ Column NOT found: ${c} (${error.message})`);
    }
  }
}

findColumns();
