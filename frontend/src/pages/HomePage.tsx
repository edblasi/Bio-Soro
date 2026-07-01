import { useNavigate } from 'react-router-dom'
import { Leaf, CheckCircle, HelpCircle, ArrowRight, Clock, History } from 'lucide-react'
import { Navbar }  from '../components/Navbar'
import { Footer }  from '../components/Footer'
import { Stepper } from '../components/Stepper'
import { useAuth } from '../contexts/AuthContext'
import { useEffect, useState } from 'react'
import { fetchHistory, HistoryEntry } from '../lib/api'

export function HomePage() {
  const navigate = useNavigate()
  const { session } = useAuth()
  const [history, setHistory] = useState<HistoryEntry[]>([])

  useEffect(() => {
    if (session?.access_token) {
      fetchHistory(session.access_token)
        .then(setHistory)
        .catch(() => {})
    }
  }, [session])

  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAF8]">
      <Navbar showBack={false} />
      <Stepper currentStep={1} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">

        {/* Cabeçalho */}
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold text-[#2D6A4F] uppercase tracking-widest mb-2">Passo 1 de 3</p>
          <h2 className="text-3xl font-semibold text-[#1A2E22] mb-3" style={{ fontFamily: "'DM Serif Display', serif" }}>
            Você sabe qual animal ou inseto está<br className="hidden sm:block" /> atingindo sua lavoura?
          </h2>
          <p className="text-[#6B7F72] text-sm max-w-lg mx-auto">
            Selecione a opção que melhor descreve sua situação para iniciarmos o diagnóstico.
          </p>
        </div>

        {/* Cards de seleção */}
        <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto mb-10">

          {/* Card: Já sei */}
          <button
            onClick={() => navigate('/protocolo')}
            className="group bg-white border-2 border-[#DDE6DF] hover:border-[#2D6A4F] rounded-2xl p-7 flex flex-col items-start gap-4 text-left transition-all duration-200 hover:shadow-md shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-[#E8F0EB] group-hover:bg-[#2D6A4F] flex items-center justify-center transition-colors">
              <CheckCircle size={22} className="text-[#2D6A4F] group-hover:text-white transition-colors" />
            </div>
            <div className="flex-1">
              <h3 className="text-[#1A2E22] font-semibold text-base mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Sim, sei exatamente com qual praga estou lidando
              </h3>
              <p className="text-[#6B7F72] text-sm leading-relaxed">
                Já identifiquei a praga e quero obter o protocolo de tratamento com o soro diretamente.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[#2D6A4F] text-sm font-semibold">
              Ir para Protocolo <ArrowRight size={15} strokeWidth={2.5} />
            </div>
          </button>

          {/* Card: Não sei */}
          <button
            onClick={() => navigate('/diagnostico')}
            className="group bg-white border-2 border-[#DDE6DF] hover:border-[#2D6A4F] rounded-2xl p-7 flex flex-col items-start gap-4 text-left transition-all duration-200 hover:shadow-md shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-[#E8F0EB] group-hover:bg-[#2D6A4F] flex items-center justify-center transition-colors">
              <HelpCircle size={22} className="text-[#2D6A4F] group-hover:text-white transition-colors" />
            </div>
            <div className="flex-1">
              <h3 className="text-[#1A2E22] font-semibold text-base mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Não tenho certeza, gostaria de ajuda para identificar
              </h3>
              <p className="text-[#6B7F72] text-sm leading-relaxed">
                Envie uma foto da plantação afetada e a IA irá identificar a praga e recomendar o tratamento ideal.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[#2D6A4F] text-sm font-semibold">
              Identificar com IA <ArrowRight size={15} strokeWidth={2.5} />
            </div>
          </button>
        </div>

        {/* Histórico recente */}
        {history.length > 0 && (
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <History size={15} className="text-[#6B7F72]" />
              <h3 className="text-sm font-semibold text-[#1A2E22]">Diagnósticos recentes</h3>
            </div>
            <div className="bg-white rounded-2xl border border-[#DDE6DF] divide-y divide-[#F0F4F1] overflow-hidden shadow-sm">
              {history.slice(0, 4).map(h => (
                <div key={h.id} className="px-5 py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#E8F0EB] flex items-center justify-center flex-shrink-0">
                      <Leaf size={14} className="text-[#2D6A4F]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1A2E22]">
                        {h.culture_name} — <span className="text-[#2D6A4F]">{h.pest_identified}</span>
                      </p>
                      <p className="text-xs text-[#6B7F72]">
                        {h.dosage} · a cada {h.frequency}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#6B7F72] flex-shrink-0">
                    <Clock size={12} />
                    {new Date(h.created_at).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
