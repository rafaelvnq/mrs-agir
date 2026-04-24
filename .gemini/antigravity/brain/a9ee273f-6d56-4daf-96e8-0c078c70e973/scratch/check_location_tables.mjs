import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://iridamgbkhqheqoirlrc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyaWRhbWdia2hxaGVxb2lybHJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njk5MjY5MCwiZXhwIjoyMDkyNTY4NjkwfQ.QNCJTn_8unmSQZE4E_ddmGww3Yer2QvIbjmEE_wgdKA'
);

async function checkMoreTables() {
  const tables = ['aux_unidades', 'aux_locais', 'aux_areas', 'unidades', 'locais'];
  
  for (const table of tables) {
    const { error } = await supabase.from(table).select('*').limit(1);
    if (!error) {
       console.log(`✅ Table ${table} exists.`);
    }
  }
}

checkMoreTables();
