import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://iridamgbkhqheqoirlrc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyaWRhbWdia2hxaGVxb2lybHJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5OTI2OTAsImV4cCI6MjA5MjU2ODY5MH0.y7qLDgjekjIP8y6CM3vUrch5vJXw2LNArJTZjtjR0Ww'
);

async function checkBowtieTables() {
  const tables = ['bowtie_nodes', 'bowtie_edges', 'riscos', 'perigos', 'causas', 'consequencias', 'controles'];
  for (const t of tables) {
    const { error } = await supabase.from(t).select('*').limit(0);
    if (!error) console.log(`✅ FOUND: ${t}`);
  }
}

checkBowtieTables();
