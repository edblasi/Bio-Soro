import { Leaf } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-white border-t border-[#DDE6DF] mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between flex-wrap gap-3">

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#2D6A4F] flex items-center justify-center">
            <Leaf size={12} className="text-white" strokeWidth={2.5} />
          </div>
          <span
            className="text-[#1A2E22] font-semibold text-sm"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            BioSoro
          </span>
        </div>

        <p className="text-xs text-[#6B7F72] text-center">
          © 2026 BioSoro — Produto 100% orgânico e sustentável.
        </p>

        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2D6A4F] opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2D6A4F]" />
          </span>
          <span className="text-xs text-[#6B7F72] font-medium">IA ativa e pronta</span>
        </div>

      </div>
    </footer>
  )
}
