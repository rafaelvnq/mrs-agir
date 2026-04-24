'use client'

import { useState } from 'react'
import { Plus, LogOut, ChevronDown } from 'lucide-react'
import { signOut } from '@/app/login/actions'
import { useRisk } from '@/context/RiskContext'
import { usePathname } from 'next/navigation'
import CreateRiskModal from './modals/CreateRiskModal'

interface AppHeaderProps {
  profile: {
    nome: string;
    nivel_acesso: string;
  } | null
}

export default function AppHeader({ profile }: AppHeaderProps) {
  const { risks, selectedRiskId, setSelectedRiskId, loading } = useRisk()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const pathname = usePathname()

  const isBowtiePage = pathname === '/bowtie'

  return (
    <header className="h-[88px] flex items-center justify-between px-8 bg-white shadow-sm border-b border-gray-100 z-10 w-full fixed top-0 right-0 left-0 md:left-[280px] md:w-[calc(100%-280px)]">
      <div className="flex items-center gap-8 flex-1">
        {isBowtiePage ? (
          <>
            {/* Risk Selection Dropdown */}
            <div className="flex flex-col min-w-[300px]">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
                Análise em Contexto
              </label>
              <div className="relative group">
                <select
                  value={selectedRiskId || ''}
                  onChange={(e) => setSelectedRiskId(e.target.value)}
                  disabled={loading}
                  className="w-full appearance-none bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-xl text-sm font-bold text-mrs-blue focus:outline-none focus:ring-2 focus:ring-mrs-blue/10 focus:border-mrs-blue transition-all cursor-pointer disabled:opacity-50 pr-10"
                >
                  {loading ? (
                    <option>Carregando riscos...</option>
                  ) : risks.length === 0 ? (
                    <option value="">Nenhum risco cadastrado</option>
                  ) : (
                    risks.map((risk) => (
                      <option key={risk.id} value={risk.id}>
                        {risk.codigo_ref.toString().padStart(3, '0')} - {risk.nome}
                      </option>
                    ))
                  )}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mrs-blue pointer-events-none group-hover:translate-y-[-40%] transition-transform" />
              </div>
            </div>

            {/* Action Button: Novo Risco (Only for Gestor) */}
            {profile?.nivel_acesso === 'Gestor' && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-mrs-blue text-white rounded-xl font-bold text-xs shadow-lg shadow-mrs-blue/20 hover:bg-mrs-blue-hover transition-all active:scale-[0.98] mt-4"
              >
                <Plus className="w-4 h-4" />
                Novo Risco
              </button>
            )}
          </>
        ) : (
          <div>
            <h1 className="text-[22px] font-extrabold tracking-wide text-mrs-blue uppercase">
              {pathname === '/' ? 'Dashboard Principal' : 
               pathname.includes('admin/users') ? 'Gestão de Usuários' :
               pathname.includes('admin/settings') ? 'Configurações da Base' :
               pathname.includes('risks') ? 'Listagem de Riscos' : 'Sistema AGIR'}
            </h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest -mt-1 ml-0.5">
              Identidade e Gestão Integrada
            </p>
          </div>
        )}
      </div>

      {/* User Session Profile */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end mr-2">
          <span className="text-[14px] font-bold text-mrs-blue">
            {profile?.nome || 'Usuário AGIR'}
          </span>
          <span className="text-[11px] font-semibold tracking-wide uppercase text-gray-400">
            {profile?.nivel_acesso || 'Visitante'}
          </span>
        </div>
        <div 
          className="h-11 w-11 rounded-full bg-cover bg-center border-2 border-white shadow-md ring-1 ring-gray-100" 
          style={{ backgroundImage: `url('https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.nome || 'U')}&background=1B3255&color=fff&bold=true')` }} 
        />
        
        <div className="ml-2 pl-4 border-l border-gray-100">
          <form action={signOut}>
            <button 
              type="submit" 
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 group"
              title="Sair do Sistema"
            >
              <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>

      {/* Modal - Só carregado quando aberto */}
      {isModalOpen && (
        <CreateRiskModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </header>
  )
}
