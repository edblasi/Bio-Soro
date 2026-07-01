import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState }      from 'react'
import {
  Leaf, Droplets, Clock, FlaskConical, Info,
  AlertTriangle, RotateCcw, CheckCircle2, ImageIcon,
} from 'lucide-react'
import { Navbar }  from '../components/Navbar'
import { Footer }  from '../components/Footer'
import { Stepper } from '../components/Stepper'
import type { DiagnosisResult } from '../lib/api'

interface LocationState {
  result: DiagnosisResult
  imageUrl?: string
  via: 'vision' | 'text'
}

export function ResultadoPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const state    = location.state as LocationState | null

  const [saved, setSaved] = useState(false)

  /* Redireciona se acessar sem dados */
  useEffect(() => {
    if (!state?.result) navigate('/', { replace: true })
  }, [state, navigate])

  if (!state?.result) return null

  const { result, imageUrl, via } = state

  const handleSave = () => setSaved(true)

  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAF8]">
      <Navbar backLabel="Nova Análise" backTo="/" />
      <Stepper currentStep={3} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">

        {/* Cabeçalho */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[#2D6A4F] uppercase tracking-widest mb-2">Passo 3 de 3 — Protocolo de Tratamento</p>
            <h2 className="text-3xl font-semibold text-[#1A2E22]" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Resultado & Protocolo
            </h2>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-xs text-[#6B7F72] font-mono bg-white border border-[#DDE6DF] px-3 py-1.5 rounded-lg">
              ID: #{result.analysis_id}
            </span>
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm
                ${saved
                  ? 'bg-[#E8F0EB] border border-[#B7D5C4] text-[#2D6A4F]'
                  : 'bg-[#2D6A4F] text-white hover:bg-[#245E43]'
                }`}
            >
              <CheckCircle2 size={15} />
              {saved ? 'Salvo no histórico!' : 'Salvo automaticamente'}
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">

          {/* ── COLUNA PRINCIPAL (2/3) ──────────────────────────────────────── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Card: Identificação */}
            <div className="bg-white rounded-2xl border border-[#DDE6DF] shadow-sm overflow-hidden">
              <div className="bg-[#1A2E22] px-6 py-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#2D6A4F] flex items-center justify-center flex-shrink-0">
                  <Leaf size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-[#6B9E84] uppercase tracking-wide font-semibold">Cultura identificada</p>
                  <p className="text-white font-semibold text-lg" style={{ fontFamily: "'DM Serif Display', serif" }}>
                    {result.culture_name}
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-xs text-[#6B9E84] uppercase tracking-wide font-semibold">
                    {via === 'vision' ? 'Via IA Vision' : 'Via Protocolo Direto'}
                  </p>
                  <p className="text-white font-semibold text-lg" style={{ fontFamily: "'DM Serif Display', serif" }}>
                    {result.pest_name}
                  </p>
                </div>
              </div>

              <div className="p-6 flex gap-5">
                {/* Foto (apenas caminho vision) */}
                {via === 'vision' && imageUrl && (
                  <div className="flex-shrink-0 w-32 h-32 rounded-xl overflow-hidden border border-[#DDE6DF]">
                    <img src={imageUrl} alt="Plantação analisada" className="w-full h-full object-cover" />
                  </div>
                )}
                {via === 'vision' && !imageUrl && (
                  <div className="flex-shrink-0 w-32 h-32 rounded-xl bg-[#F7FAF8] border border-[#DDE6DF] flex items-center justify-center">
                    <ImageIcon size={28} className="text-[#B7D5C4]" />
                  </div>
                )}

                <div className="flex-1">
                  <p className="text-xs font-semibold text-[#6B7F72] uppercase tracking-wide mb-2">Descrição da praga</p>
                  <p className="text-sm text-[#1A2E22] leading-relaxed">
                    {result.pest_description || 'Descrição não disponível para esta praga.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Card: Dosagem e Frequência */}
            <div className="bg-white rounded-2xl border border-[#DDE6DF] shadow-sm p-6">
              <h3 className="text-sm font-semibold text-[#1A2E22] mb-5 flex items-center gap-2">
                <Droplets size={16} className="text-[#2D6A4F]" /> Protocolo de Aplicação
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-[#E8F0EB] rounded-xl p-5 border border-[#B7D5C4]">
                  <p className="text-xs font-semibold text-[#2D6A4F] uppercase tracking-wide mb-1">Quantidade de uso</p>
                  <p className="text-2xl font-bold text-[#1A2E22]" style={{ fontFamily: "'DM Serif Display', serif" }}>
                    {result.dosage}
                  </p>
                  <p className="text-xs text-[#6B7F72] mt-1">por {result.culture_name.toLowerCase()}</p>
                </div>
                <div className="bg-[#E8F0EB] rounded-xl p-5 border border-[#B7D5C4]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Clock size={13} className="text-[#2D6A4F]" />
                    <p className="text-xs font-semibold text-[#2D6A4F] uppercase tracking-wide">Frequência de aplicação</p>
                  </div>
                  <p className="text-2xl font-bold text-[#1A2E22]" style={{ fontFamily: "'DM Serif Display', serif" }}>
                    A cada {result.frequency}
                  </p>
                  <p className="text-xs text-[#6B7F72] mt-1">reaplicar após chuvas fortes</p>
                </div>
              </div>
            </div>

            {/* Card: Explicação Científica */}
            <div className="bg-white rounded-2xl border border-[#DDE6DF] shadow-sm p-6">
              <h3 className="text-sm font-semibold text-[#1A2E22] mb-4 flex items-center gap-2">
                <FlaskConical size={16} className="text-[#2D6A4F]" /> Por que o BioSoro funciona?
              </h3>
              <div className="bg-[#F7FAF8] rounded-xl p-5 border border-[#DDE6DF]">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#E8F0EB] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FlaskConical size={15} className="text-[#2D6A4F]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#2D6A4F] mb-1.5">pH 4,5 — Ação Ácida Natural</p>
                    <p className="text-sm text-[#1A2E22] leading-relaxed">
                      {result.scientific_explanation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── COLUNA LATERAL (1/3) ───────────────────────────────────────── */}
          <div className="flex flex-col gap-5">

            {/* Card: Guia de Frequência */}
            <div className="bg-white rounded-2xl border border-[#DDE6DF] shadow-sm p-6">
              <h3 className="text-sm font-semibold text-[#1A2E22] mb-4 flex items-center gap-2">
                <Info size={15} className="text-[#2D6A4F]" /> Guia por Nível de Infestação
              </h3>
              <div className="flex flex-col gap-2">
                {result.extra_tips.frequency_guide.map((item, i) => (
                  <div
                    key={i}
                    className={`rounded-xl px-4 py-3 border text-sm ${
                      i === 0 ? 'bg-[#E8F0EB] border-[#B7D5C4]' :
                      i === 1 ? 'bg-[#FFF9EC] border-[#F0D98A]' :
                      i === 2 ? 'bg-red-50 border-red-100' :
                                'bg-[#F7FAF8] border-[#DDE6DF]'
                    }`}
                  >
                    <p className={`font-semibold text-xs mb-0.5 ${
                      i === 0 ? 'text-[#2D6A4F]' :
                      i === 1 ? 'text-[#7A5C00]' :
                      i === 2 ? 'text-red-600' :
                                'text-[#1A2E22]'
                    }`}>
                      {item.level}
                    </p>
                    <p className="text-[#1A2E22] text-xs leading-relaxed">{item.frequency}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Card: Dicas de Aplicação */}
            <div className="bg-[#1A2E22] rounded-2xl p-6 text-white">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle size={15} className="text-[#B7D5C4]" />
                Observações Importantes
              </h3>
              <div className="flex flex-col gap-3 text-xs text-[#B7D5C4] leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <span className="text-[#2D6A4F] mt-0.5">🌅</span>
                  <p>{result.extra_tips.timing}</p>
                </div>
                <div className="h-px bg-white/10" />
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5">🌧️</span>
                  <p>{result.extra_tips.after_rain}</p>
                </div>
              </div>
            </div>

            {/* Botão: nova análise */}
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-[#B7D5C4] text-[#2D6A4F] font-semibold text-sm hover:bg-[#E8F0EB] transition-all"
            >
              <RotateCcw size={15} strokeWidth={2.5} />
              Nova análise
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
