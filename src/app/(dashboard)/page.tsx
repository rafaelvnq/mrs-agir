export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-in fade-in duration-700">
      <div className="mb-8 w-24 h-24 rounded-2xl bg-mrs-blue text-mrs-yellow flex items-center justify-center shadow-lg border-b-4 border-mrs-blue-hover">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      </div>
      
      <h1 className="text-4xl font-extrabold text-mrs-blue tracking-tight mb-4">
        Ambiente Configurado
      </h1>
      
      <p className="text-lg text-mrs-support-gray max-w-2xl text-balance">
        O repositório do <strong>Projeto AGIR (Módulo Bowtie)</strong> concluiu a instalação das dependências, as variáveis de ambiente e o design system (Tailwind). O App Shell já está incorporado e reativo!
      </p>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 text-left w-full max-w-3xl">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><path d="M22 4L12 14.01l-3-3"></path></svg>
          </div>
          <div>
            <h3 className="font-bold text-mrs-blue">Conexão Supabase</h3>
            <p className="text-sm text-gray-500 mt-1">O App já possui credenciais de banco e RLS ativado.</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-mrs-yellow/20 text-mrs-blue rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
          </div>
          <div>
            <h3 className="font-bold text-mrs-blue">Próxima Etapa Mapeada</h3>
            <p className="text-sm text-gray-500 mt-1">Iniciar a Autenticação ou Modais Conforme SDD.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
