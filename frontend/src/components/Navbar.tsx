import { useNavigate } from 'react-router-dom'
import { Leaf, ArrowLeft, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

interface NavbarProps {
  showBack?: boolean
  backLabel?: string
  backTo?: string
}

export function Navbar({ showBack = true, backLabel = 'Voltar ao Dashboard', backTo = '/' }: NavbarProps) {
  const navigate = useNavigate()
  const { signOut, user } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <header className="bg-white border-b border-[#DDE6DF] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">

        {/* Logo */}
        <div
          className="flex items-center gap-2.5 cursor-pointer select-none"
          onClick={() => navigate('/')}
        >
          <div className="w-8 h-8 rounded-lg bg-[#2D6A4F] flex items-center justify-center flex-shrink-0">
            <Leaf size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <span
            className="text-[#1A2E22] font-semibold text-lg tracking-tight"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            BioSoro
          </span>
          <span className="hidden sm:inline px-2.5 py-0.5 rounded-full bg-[#E8F0EB] text-[#2D6A4F] text-[11px] font-medium border border-[#B7D5C4]">
            Defensivos Naturais
          </span>
        </div>

        {/* Ações */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#6B7F72] hidden md:block truncate max-w-[180px]">
            {user?.email}
          </span>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 text-xs text-[#6B7F72] hover:text-[#1A2E22] transition-colors px-2 py-1.5 rounded-lg hover:bg-[#F7FAF8]"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Sair</span>
          </button>

          {showBack && (
            <button
              onClick={() => navigate(backTo)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#B7D5C4] text-[#2D6A4F] text-sm font-medium hover:bg-[#E8F0EB] transition-all"
            >
              <ArrowLeft size={15} strokeWidth={2} />
              <span className="hidden sm:inline">{backLabel}</span>
            </button>
          )}
        </div>

      </div>
    </header>
  )
}
