'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Users, 
  UserPlus, 
  Search, 
  MoreVertical, 
  ShieldCheck, 
  User as UserIcon,
  RefreshCw,
  CheckCircle2,
  Clock,
  X
} from 'lucide-react'
import CreateUserModal from '@/components/organisms/admin/CreateUserModal'
import ConfirmModal from '@/components/organisms/admin/ConfirmModal'
import { toast } from 'sonner'

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    variant: 'danger' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {},
    variant: 'info'
  })
  
  const supabase = createClient()

  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  async function fetchUsers() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('aux_usuarios')
        .select('*')
        .order('nome', { ascending: true })

      if (error) throw error
      setUsers(data || [])
    } catch (error: any) {
      toast.error('Erro ao buscar usuários: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleResetPassword(userId: string, email: string) {
    setOpenMenuId(null)
    setConfirmConfig({
      isOpen: true,
      title: 'Resetar Senha',
      description: `Deseja resetar a senha do usuário ${email} para a senha padrão (e-mail)? Ele será marcado como pendente de acesso.`,
      variant: 'warning',
      onConfirm: async () => {
        try {
          const response = await fetch('/api/admin/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, email }),
          })
          const result = await response.json()
          if (result.error) throw new Error(result.error)
          toast.success('Senha resetada com sucesso!')
          fetchUsers()
        } catch (error: any) {
          toast.error('Erro ao resetar senha: ' + error.message)
        }
      }
    })
  }

  async function handleDeleteUser(userId: string, nome: string) {
    setOpenMenuId(null)
    setConfirmConfig({
      isOpen: true,
      title: 'Excluir Usuário',
      description: `TEM CERTEZA que deseja excluir permanentemente o usuário ${nome}? Esta ação não pode ser desfeita.`,
      variant: 'danger',
      onConfirm: async () => {
        try {
          const response = await fetch('/api/admin/delete-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId }),
          })
          const result = await response.json()
          if (result.error) throw new Error(result.error)
          toast.success('Usuário excluído com sucesso!')
          fetchUsers()
        } catch (error: any) {
          toast.error('Erro ao excluir usuário: ' + error.message)
        }
      }
    })
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = users.filter(user => 
    user.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-mrs-blue">
            <Users className="w-6 h-6" />
            <h1 className="text-2xl font-extrabold tracking-tight">Gestão de Usuários</h1>
          </div>
          <p className="text-sm text-gray-500 font-medium">
            Gerencie as permissões e contas de acesso ao módulo Bowtie.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-mrs-blue text-white rounded-xl font-bold text-sm shadow-lg shadow-mrs-blue/20 hover:bg-mrs-blue-hover transition-all active:scale-[0.98]"
        >
          <UserPlus className="w-5 h-5" />
          Novo Usuário
        </button>
      </div>

      {/* Stats Card (Optional but premium) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
           <div className="p-3 bg-blue-50 rounded-xl">
             <UserIcon className="w-6 h-6 text-mrs-blue" />
           </div>
           <div>
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total de Usuários</p>
             <p className="text-xl font-extrabold text-mrs-blue">{users.length}</p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
           <div className="p-3 bg-green-50 rounded-xl">
             <CheckCircle2 className="w-6 h-6 text-green-600" />
           </div>
           <div>
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ativos</p>
             <p className="text-xl font-extrabold text-mrs-blue">{users.filter(u => u.senha_alterada).length}</p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
           <div className="p-3 bg-mrs-yellow/10 rounded-xl">
             <Clock className="w-6 h-6 text-mrs-yellow" />
           </div>
           <div>
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pendentes de Acesso</p>
             <p className="text-xl font-extrabold text-mrs-blue">{users.filter(u => !u.senha_alterada).length}</p>
           </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Buscar por nome ou e-mail..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-mrs-blue/10 focus:border-mrs-blue transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={fetchUsers}
            className="p-2 text-gray-400 hover:text-mrs-blue hover:bg-white rounded-lg transition-all"
            title="Atualizar lista"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Usuário</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Nível</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-6"><div className="h-4 bg-gray-100 rounded w-48"></div></td>
                    <td className="px-6 py-6"><div className="h-4 bg-gray-100 rounded w-16 mx-auto"></div></td>
                    <td className="px-6 py-6"><div className="h-4 bg-gray-100 rounded w-20 mx-auto"></div></td>
                    <td className="px-6 py-6 text-right"><div className="h-4 bg-gray-100 rounded w-8 ml-auto"></div></td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <p className="text-gray-400 text-sm font-medium">Nenhum usuário encontrado.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-mrs-blue/5 border border-mrs-blue/10 flex items-center justify-center text-mrs-blue font-bold text-xs uppercase">
                          {user.nome?.substring(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-mrs-blue">{user.nome}</p>
                          <p className="text-[11px] text-gray-400 font-medium">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        user.nivel_acesso === 'Gestor' 
                        ? 'bg-blue-50 text-mrs-blue' 
                        : 'bg-gray-50 text-gray-500'
                      }`}>
                        <ShieldCheck className="w-3 h-3" />
                        {user.nivel_acesso === 'Dono do risco' || user.nivel_acesso === 'Dono' ? 'Dono do Risco' : user.nivel_acesso}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        user.senha_alterada 
                        ? 'bg-green-50 text-green-600' 
                        : 'bg-mrs-yellow/10 text-mrs-yellow'
                      }`}>
                        {user.senha_alterada ? 'Ativo' : 'Pendente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <button 
                        onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                        className={`p-2 rounded-lg transition-all ${
                          openMenuId === user.id 
                          ? 'bg-mrs-blue text-white shadow-md' 
                          : 'text-gray-400 hover:text-mrs-blue hover:bg-blue-50'
                        }`}
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      {openMenuId === user.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setOpenMenuId(null)} 
                          />
                          <div className="absolute right-6 top-12 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-20 py-2 animate-in zoom-in-95 duration-100 origin-top-right">
                            <button 
                              onClick={() => handleResetPassword(user.id, user.email)}
                              className="w-full px-4 py-2 text-left text-sm font-bold text-mrs-blue hover:bg-gray-50 flex items-center gap-2"
                            >
                              <RefreshCw className="w-4 h-4 text-mrs-yellow" />
                              Resetar Senha
                            </button>
                            <div className="h-px bg-gray-50 my-1" />
                            <button 
                              onClick={() => handleDeleteUser(user.id, user.nome)}
                              className="w-full px-4 py-2 text-left text-sm font-bold text-red-500 hover:bg-red-50 flex items-center gap-2"
                            >
                              <X className="w-4 h-4" />
                              Excluir Usuário
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CreateUserModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false)
          fetchUsers()
        }} 
      />

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        description={confirmConfig.description}
        variant={confirmConfig.variant}
        onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
        onConfirm={confirmConfig.onConfirm}
        confirmText={confirmConfig.variant === 'danger' ? 'Excluir Agora' : 'Confirmar'}
      />
    </div>
  )
}
