'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { X, Loader2, UserPlus, Shield, Mail, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'

const userSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  nivel_acesso: z.enum(['Gestor', 'Dono do Risco'], {
    errorMap: () => ({ message: 'Selecione um nível de acesso' })
  }),
})

type UserFormValues = z.infer<typeof userSchema>

interface CreateUserModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateUserModal({ isOpen, onClose }: CreateUserModalProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      nivel_acesso: 'Dono do Risco'
    }
  })

  const nivelAcesso = watch('nivel_acesso')

  if (!isOpen) return null

  async function onSubmit(data: UserFormValues) {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          password: data.email // Use email as initial password
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao criar usuário')
      }

      toast.success('Usuário criado com sucesso!')
      reset()
      onClose()
      router.refresh()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-mrs-blue/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 transform animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="bg-mrs-blue p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <UserPlus className="w-5 h-5 text-mrs-yellow" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Novo Usuário</h2>
              <p className="text-xs text-blue-200/80 font-medium uppercase tracking-wider">Gestão de Acessos</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5">
          {/* Nome */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-mrs-blue uppercase tracking-widest ml-1">Nome Completo</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Shield className="h-4 w-4 text-gray-400 group-focus-within:text-mrs-blue transition-colors" />
              </div>
              <input
                {...register('nome')}
                className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-mrs-blue/10 focus:border-mrs-blue transition-all"
                placeholder="Ex: João Silva"
              />
            </div>
            {errors.nome && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.nome.message}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-mrs-blue uppercase tracking-widest ml-1">E-mail Corporativo</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-gray-400 group-focus-within:text-mrs-blue transition-colors" />
              </div>
              <input
                {...register('email')}
                type="email"
                className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-mrs-blue/10 focus:border-mrs-blue transition-all"
                placeholder="joao.silva@mrs.com.br"
              />
            </div>
            {errors.email && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.email.message}</p>}
          </div>

          {/* Nível de Acesso */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-mrs-blue uppercase tracking-widest ml-1">Nível de Acesso</label>
            <div className="grid grid-cols-2 gap-3">
              <label 
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                  nivelAcesso === 'Gestor' 
                  ? 'border-mrs-blue bg-mrs-blue/10 text-mrs-blue ring-2 ring-mrs-blue/20' 
                  : 'border-gray-100 bg-gray-50 text-gray-400 hover:bg-gray-100'
                }`}
              >
                <input
                  {...register('nivel_acesso')}
                  type="radio"
                  value="Gestor"
                  className="hidden"
                />
                <span className="text-xs font-extrabold uppercase tracking-widest text-center">Gestor</span>
              </label>

              <label 
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                  nivelAcesso === 'Dono do Risco' 
                  ? 'border-mrs-blue bg-mrs-blue/10 text-mrs-blue ring-2 ring-mrs-blue/20' 
                  : 'border-gray-100 bg-gray-50 text-gray-400 hover:bg-gray-100'
                }`}
              >
                <input
                  {...register('nivel_acesso')}
                  type="radio"
                  value="Dono do Risco"
                  className="hidden"
                />
                <span className="text-xs font-extrabold uppercase tracking-widest text-center">Dono do Risco</span>
              </label>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3.5 text-sm font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all active:scale-[0.98]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] px-4 py-3.5 bg-mrs-blue hover:bg-mrs-blue-hover text-white font-bold text-sm rounded-xl shadow-lg shadow-mrs-blue/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Cadastrar Usuário</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
