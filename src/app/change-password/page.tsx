'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { updatePassword } from './actions'
import { toast } from 'sonner'
import Image from 'next/image'
import { Loader2, Lock, Save, Eye, EyeOff, AlertCircle } from 'lucide-react'

const passwordSchema = z.object({
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string().min(1, 'A confirmação é obrigatória'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
})

type PasswordFormValues = z.infer<typeof passwordSchema>

export default function ChangePasswordPage() {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  })

  async function onSubmit(data: PasswordFormValues) {
    setLoading(true)
    const result = await updatePassword(data.password)
    
    if (result?.error) {
      toast.error(result.error)
      setLoading(false)
    } else {
      toast.success('Senha atualizada com sucesso!')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f7f6] p-4 font-sans">
      <div className="w-full max-w-[460px] animate-in fade-in zoom-in duration-500">
        {/* Logo Container */}
        <div className="flex justify-center mb-8">
           <Image 
             src="/logo-mrs.png" 
             alt="MRS Logística Logo" 
             width={180} 
             height={70} 
             className="object-contain"
             priority
           />
        </div>

        {/* Card */}
        <div className="bg-[#1B3255] rounded-[2.5rem] shadow-2xl p-10 relative overflow-hidden border border-white/10">
          {/* Status Header */}
          <div className="flex items-center gap-3 mb-6 p-4 bg-mrs-yellow/10 rounded-2xl border border-mrs-yellow/20">
            <AlertCircle className="w-6 h-6 text-mrs-yellow shrink-0" />
            <p className="text-sm text-mrs-yellow-light font-bold">
              Primeiro acesso detectado. Por favor, defina sua senha definitiva.
            </p>
          </div>

          <div className="relative z-10">
            <h1 className="text-2xl font-extrabold text-white mb-2 tracking-tight">
              Alterar Senha
            </h1>
            <p className="text-gray-300 text-sm mb-8">
              Sua segurança é nossa prioridade. Escolha uma senha forte de no mínimo 6 dígitos.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* New Password */}
              <div className="space-y-2">
                <label className="text-white/80 text-xs font-bold uppercase tracking-widest pl-1">
                  Nova Senha
                </label>
                <div className="relative group/field">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="block w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-mrs-yellow/50 focus:border-mrs-yellow transition-all text-sm font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-mrs-yellow"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-mrs-yellow-light text-[11px] font-bold px-1">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-white/80 text-xs font-bold uppercase tracking-widest pl-1">
                  Confirme a Nova Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('confirmPassword')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-mrs-yellow/50 focus:border-mrs-yellow transition-all text-sm font-medium"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-mrs-yellow-light text-[11px] font-bold px-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-mrs-yellow hover:bg-mrs-yellow-light text-mrs-blue font-extrabold py-4 px-4 rounded-xl shadow-lg shadow-mrs-yellow/20 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span className="tracking-wide uppercase">Salvar Nova Senha</span>
                    <Save className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
