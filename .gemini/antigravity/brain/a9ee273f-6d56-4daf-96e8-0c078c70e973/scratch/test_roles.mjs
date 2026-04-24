import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://iridamgbkhqheqoirlrc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyaWRhbWdia2hxaGVxb2lybHJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njk5MjY5MCwiZXhwIjoyMDkyNTY4NjkwfQ.QNCJTn_8unmSQZE4E_ddmGww3Yer2QvIbjmEE_wgdKA'
);

async function testRoles() {
  const testId = 'ea904b7f-7278-448b-a86a-684ece5775dc'; // id of dono1
  
  const rolesToTest = ['Dono', 'DONO', 'dono', 'Dono do Risco', 'Dono do risco'];
  
  for (const role of rolesToTest) {
    console.log(`Testing role: "${role}"`);
    const { error } = await supabase
      .from('aux_usuarios')
      .update({ nivel_acesso: role })
      .eq('id', testId);
    
    if (error) {
      console.log(`❌ Failed for "${role}":`, error.message);
    } else {
      console.log(`✅ Success for "${role}"!`);
      break;
    }
  }
}

testRoles();
