import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Leaf } from 'lucide-react'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7FAF8] gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[#2D6A4F] flex items-center justify-center shadow">
          <Leaf size={22} className="text-white" strokeWidth={2} />
        </div>
        <div className="w-7 h-7 border-[3px] border-[#2D6A4F] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  return <>{children}</>
}
