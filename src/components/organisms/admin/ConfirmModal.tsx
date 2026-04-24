'use client'

import { AlertTriangle, X } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'info'
}: ConfirmModalProps) {
  if (!isOpen) return null

  const variantStyles = {
    danger: {
      iconBg: 'bg-red-50',
      iconText: 'text-red-500',
      confirmBtn: 'bg-red-500 hover:bg-red-600 shadow-red-200',
    },
    warning: {
      iconBg: 'bg-mrs-yellow/10',
      iconText: 'text-mrs-yellow',
      confirmBtn: 'bg-mrs-yellow hover:bg-yellow-600 shadow-yellow-100',
    },
    info: {
      iconBg: 'bg-blue-50',
      iconText: 'text-mrs-blue',
      confirmBtn: 'bg-mrs-blue hover:bg-mrs-blue-hover shadow-blue-100',
    }
  }

  const style = variantStyles[variant]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-mrs-blue/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden border border-gray-100 transform animate-in zoom-in-95 duration-200">
        <div className="p-8 text-center space-y-4">
          <div className={`mx-auto w-16 h-16 ${style.iconBg} rounded-2xl flex items-center justify-center mb-2`}>
            <AlertTriangle className={`w-8 h-8 ${style.iconText}`} />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-extrabold text-mrs-blue tracking-tight">{title}</h3>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">
              {description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-50 text-gray-400 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm()
                onClose()
              }}
              className={`px-6 py-3 ${style.confirmBtn} text-white rounded-xl font-bold text-sm shadow-lg transition-all active:scale-[0.98]`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
