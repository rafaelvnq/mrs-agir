import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://iridamgbkhqheqoirlrc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyaWRhbWdia2hxaGVxb2lybHJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5OTI2OTAsImV4cCI6MjA5MjU2ODY5MH0.y7qLDgjekjIP8y6CM3vUrch5vJXw2LNArJTZjtjR0Ww'
);

async function checkAll() {
  const tables = ['aux_perigos', 'aux_temas_risco', 'aux_categorias_controle'];
  const cols = ['id', 'nome', 'descricao', 'ativo', 'created_at', 'description', 'status', 'active', 'title'];

  for (const t of tables) {
    console.log(`Checking ${t}:`);
    for (const c of cols) {
       const { error } = await supabase.from(t).select(c).limit(1);
       if (!error) console.log(`  + ${c}`);
    }
  }
}

checkAll();
