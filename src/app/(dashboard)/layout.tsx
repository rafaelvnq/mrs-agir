import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Network, LayoutList, Users, Settings, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { RiskProvider } from '@/context/RiskContext';
import AppHeader from '@/components/organisms/AppHeader';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  // Get the current user profile from the auxiliary table
  const { data: { user } } = await supabase.auth.getUser();
  
  let profile = null;

  if (user) {
    const { data: profiles } = await supabase
      .from('aux_usuarios')
      .select('senha_alterada, nome, nivel_acesso')
      .eq('id', user.id);
    
    profile = profiles && profiles.length > 0 ? profiles[0] : null;

    if (profile && profile.senha_alterada === false) {
      redirect('/change-password');
    }
  }

  return (
    <RiskProvider>
      <div className="flex w-full min-h-screen bg-[#f7f9fa]">
        {/* Sidebar Base */}
        <aside className="w-[280px] bg-mrs-blue shadow-2xl text-white flex-shrink-0 flex flex-col hidden md:flex z-50 fixed top-0 bottom-0 left-0">
           <div className="flex items-center justify-center pt-8 pb-10">
             <Image 
               src="/logo-mrs.png" 
               alt="MRS Logística Logo" 
               width={160} 
               height={60} 
               className="object-contain"
               priority
             />
           </div>
           
           <nav className="flex-1 px-4 space-y-2">
             <div className="text-[10px] font-bold text-gray-400/80 mb-2 mt-4 uppercase tracking-widest px-4">Menu</div>
             
             <Link href="/bowtie" className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-lg border-l-4 border-mrs-yellow text-sm font-bold text-white transition-all shadow-sm">
               <Network className="w-5 h-5 text-mrs-yellow" />
               Bowtie
             </Link>

             <Link href="/risks" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 rounded-lg border-l-4 border-transparent hover:text-white transition-all text-sm font-medium">
               <LayoutList className="w-5 h-5 opacity-70" />
               Listagem de Riscos
             </Link>

             <div className="text-[10px] font-bold text-gray-400/80 mb-2 mt-8 uppercase tracking-widest px-4">Administração</div>
             
             <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 rounded-lg border-l-4 border-transparent hover:text-white transition-all text-sm font-medium">
               <Users className="w-5 h-5 opacity-70" />
               Gestão de Usuários
             </Link>
             <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 rounded-lg border-l-4 border-transparent hover:text-white transition-all text-sm font-medium">
               <Settings className="w-5 h-5 opacity-70" />
               Configurações da Base
             </Link>
           </nav>

           <div className="p-4 mb-4">
             <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 rounded-lg hover:text-white transition-colors text-sm font-medium">
               <HelpCircle className="w-5 h-5 opacity-70" />
               Sobre o Módulo
             </a>
           </div>
        </aside>

        {/* Workspace Central */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden md:ml-[280px]">
          <AppHeader profile={profile} />
          
          <div className="flex-1 overflow-auto bg-[#f4f7f6] mt-[88px]">
            {children}
          </div>
        </main>
      </div>
    </RiskProvider>
  );
}

