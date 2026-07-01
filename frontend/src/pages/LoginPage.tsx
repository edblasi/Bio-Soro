import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Leaf, Mail, Lock, ArrowRight } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export function LoginPage() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const { signIn } = useAuth()
  const navigate   = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      navigate('/')
    } catch {
      setError('E-mail ou senha incorretos. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7FAF8] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#2D6A4F] flex items-center justify-center shadow-md">
            <Leaf size={26} className="text-white" strokeWidth={2} />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-[#1A2E22]" style={{ fontFamily: "'DM Serif Display', serif" }}>
              BioSoro
            </h1>
            <span className="text-xs text-[#6B7F72]">Defensivos Naturais</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-[#DDE6DF] shadow-sm p-8">
          <h2 className="text-xl font-semibold text-[#1A2E22] mb-1" style={{ fontFamily: "'DM Serif Display', serif" }}>
            Bem-vindo de volta
          </h2>
          <p className="text-sm text-[#6B7F72] mb-6">Entre com sua conta para continuar</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#1A2E22] uppercase tracking-wide">E-mail</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B7D5C4] pointer-events-none" />
                <input
                  type="email" value={email} required
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-[#DDE6DF] bg-[#F7FAF8] text-sm text-[#1A2E22] placeholder:text-[#B7D5C4] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/25 focus:border-[#2D6A4F] transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#1A2E22] uppercase tracking-wide">Senha</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B7D5C4] pointer-events-none" />
                <input
                  type="password" value={password} required
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-[#DDE6DF] bg-[#F7FAF8] text-sm text-[#1A2E22] placeholder:text-[#B7D5C4] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/25 focus:border-[#2D6A4F] transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[#2D6A4F] text-white text-sm font-semibold hover:bg-[#245E43] disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm mt-1"
            >
              {loading
                ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Entrando...</>
                : <>Entrar <ArrowRight size={16} strokeWidth={2.5} /></>
              }
            </button>
          </form>

          <p className="text-center text-sm text-[#6B7F72] mt-5">
            Não tem conta?{' '}
            <Link to="/register" className="text-[#2D6A4F] font-semibold hover:underline">
              Criar conta
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-[#6B7F72] mt-4">
          © 2026 BioSoro — Produto 100% orgânico e sustentável.
        </p>
      </div>
    </div>
  )
}
