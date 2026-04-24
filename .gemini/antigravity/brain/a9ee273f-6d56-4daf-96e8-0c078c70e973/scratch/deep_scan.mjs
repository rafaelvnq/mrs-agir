import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://iridamgbkhqheqoirlrc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyaWRhbWdia2hxaGVxb2lybHJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njk5MjY5MCwiZXhwIjoyMDkyNTY4NjkwfQ.QNCJTn_8unmSQZE4E_ddmGww3Yer2QvIbjmEE_wgdKA'
);

async function deepScan() {
  const suffixes = ['unidades', 'locais', 'unidade', 'local', 'site', 'unidade_negocio', 'centro_custo', 'areas', 'setores', 'patios', 'trechos'];
  const prefixes = ['aux_', 'param_', 'cfg_', 'tab_', ''];

  console.log('Deep scanning for location-like tables...');
  for (const p of prefixes) {
    for (const s of suffixes) {
      const name = p + s;
      const { error } = await supabase.from(name).select('*').limit(0);
      if (!error) {
        console.log(`✅ FOUND: ${name}`);
      }
    }
  }
}

deepScan();
