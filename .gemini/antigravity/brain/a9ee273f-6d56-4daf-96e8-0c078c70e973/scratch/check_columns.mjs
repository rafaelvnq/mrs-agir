import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://iridamgbkhqheqoirlrc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyaWRhbWdia2hxaGVxb2lybHJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njk5MjY5MCwiZXhwIjoyMDkyNTY4NjkwfQ.QNCJTn_8unmSQZE4E_ddmGww3Yer2QvIbjmEE_wgdKA'
);

async function checkColumns() {
  const tables = ['aux_perigos', 'aux_temas_risco', 'aux_categorias_controle'];
  
  for (const table of tables) {
    console.log(`Checking table: ${table}`);
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
       console.log(`❌ Error:`, error.message);
    } else {
       if (data.length > 0) {
         console.log(`✅ Columns:`, Object.keys(data[0]));
       } else {
         // Table is empty, let's try to insert and see failure to guess columns or just guess common ones.
         console.log(`✅ Table is empty. Trying to find columns via dummy select...`);
       }
    }
  }
}

checkColumns();
