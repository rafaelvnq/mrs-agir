'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { signIn } from './actions'
import { toast } from 'sonner'
import Image from 'next/image'
import { Loader2, Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginFormValues) {
    setLoading(true)
    const result = await signIn(data)
    
    if (result?.error) {
      toast.error(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f7f6] p-4 font-sans">
      <div className="w-full max-w-[420px] animate-in fade-in zoom-in duration-500">
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

        {/* Login Card */}
        <div className="bg-[#1B3255] rounded-[2rem] shadow-2xl p-10 relative overflow-hidden border border-white/10 group">
          {/* Subtle Background Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-mrs-yellow/10 rounded-full blur-3xl group-hover:bg-mrs-yellow/20 transition-all duration-700" />
          
          <div className="relative z-10">
            <h1 className="text-2xl font-extrabold text-white mb-2 tracking-tight">
              Acesso ao Sistema
            </h1>
            <p className="text-gray-300 text-sm mb-8 font-medium">
              Entre com suas credenciais do projeto AGIR
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-white/80 text-xs font-bold uppercase tracking-widest pl-1">
                  E-mail
                </label>
                <div className="relative group/field">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within/field:text-mrs-yellow transition-colors" />
                  </div>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="exemplo@mrs.com.br"
                    className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-mrs-yellow/50 focus:border-mrs-yellow transition-all text-sm font-medium"
                  />
                </div>
                {errors.email && (
                  <p className="text-mrs-yellow-light text-[11px] font-bold animate-in slide-in-from-top-1 px-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-white/80 text-xs font-bold uppercase tracking-widest pl-1">
                  Senha
                </label>
                <div className="relative group/field">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within/field:text-mrs-yellow transition-colors" />
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
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-mrs-yellow transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-mrs-yellow-light text-[11px] font-bold animate-in slide-in-from-top-1 px-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-mrs-yellow hover:bg-mrs-yellow-light text-mrs-blue font-extrabold py-4 px-4 rounded-xl shadow-lg shadow-mrs-yellow/20 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group/btn"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span className="tracking-wide">ENTRAR NO SISTEMA</span>
                    <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                Protegido por MRS Logistica S.A.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
