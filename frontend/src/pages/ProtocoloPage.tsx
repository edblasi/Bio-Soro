import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, AlertCircle, Sparkles, BookOpen } from 'lucide-react'
import { Navbar }   from '../components/Navbar'
import { Footer }   from '../components/Footer'
import { Stepper }  from '../components/Stepper'
import { useAuth }  from '../contexts/AuthContext'
import { fetchCultures, diagnoseText, Culture } from '../lib/api'

export function ProtocoloPage() {
  const navigate    = useNavigate()
  const { session } = useAuth()

  const [cultures,      setCultures]      = useState<Culture[]>([])
  const [selectedCulture, setSelectedCulture] = useState<Culture | null>(null)
  const [cultureName,   setCultureName]   = useState('')
  const [pestName,      setPestName]      = useState('')
  const [customPest,    setCustomPest]    = useState('')
  const [loading,       setLoading]       = useState(false)
  const [error,         setError]         = useState('')

  useEffect(() => {
    fetchCultures().then(setCultures).catch(() => {})
  }, [])

  const handleCultureChange = (name: string) => {
    setCultureName(name)
    setPestName('')
    setCustomPest('')
    setSelectedCulture(cultures.find(c => c.name === name) ?? null)
  }

  /* Praga final: chip selecionado ou campo customizado */
  const finalPest = pestName || customPest

  const handleSubmit = async () => {
    if (!cultureName) { setError('Selecione a cultura antes de continuar.'); return }
    if (!finalPest)   { setError('Informe o nome da praga identificada.'); return }
    if (!session?.access_token) return

    setError('')
    setLoading(true)
    try {
      const result = await diagnoseText(session.access_token, cultureName, finalPest)
      navigate('/resultado', { state: { result, via: 'text' } })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao buscar protocolo. Tente novamente.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const canSubmit = !!cultureName && !!finalPest && !loading

  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAF8]">
      <Navbar backLabel="Voltar ao Dashboard" backTo="/" />
      <Stepper currentStep={2} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">

        {/* Cabeçalho */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-[#2D6A4F] uppercase tracking-widest mb-2">Passo 2 de 3 — Protocolo Direto</p>
          <h2 className="text-3xl font-semibold text-[#1A2E22] mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
            Informe a cultura e a praga
          </h2>
          <p className="text-[#6B7F72] text-sm max-w-xl">
            Selecione sua cultura e indique a praga identificada. A IA irá descrever o problema e você recebe o protocolo de tratamento com o BioSoro.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-4xl">

          {/* Coluna esquerda: formulário */}
          <div className="flex flex-col gap-5">

            {/* Step A: Cultura */}
            <div className="bg-white rounded-2xl border border-[#DDE6DF] shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-[#1A2E22] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">A</span>
                </div>
                <h3 className="text-sm font-semibold text-[#1A2E22]">Qual é a cultura?</h3>
              </div>

              <div className="relative">
                <select
                  value={cultureName}
                  onChange={e => handleCultureChange(e.target.value)}
                  className="w-full appearance-none bg-[#F7FAF8] border border-[#DDE6DF] rounded-xl px-4 py-3.5 text-sm text-[#1A2E22] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/25 focus:border-[#2D6A4F] transition-all pr-10 cursor-pointer"
                >
                  <option value="">Selecione a cultura plantada</option>
                  {cultures.map(c => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#B7D5C4] pointer-events-none" />
              </div>

              {/* Info da cultura selecionada */}
              {selectedCulture && (
                <div className="mt-3 px-3 py-2.5 rounded-lg bg-[#E8F0EB] flex items-center gap-2 text-xs text-[#2D6A4F]">
                  <BookOpen size={13} />
                  <span>
                    Dose recomendada: <strong>{selectedCulture.quantity}</strong> · a cada <strong>{selectedCulture.frequency}</strong>
                  </span>
                </div>
              )}
            </div>

            {/* Step B: Praga */}
            <div className="bg-white rounded-2xl border border-[#DDE6DF] shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-[#1A2E22] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">B</span>
                </div>
                <h3 className="text-sm font-semibold text-[#1A2E22]">Qual é a praga identificada?</h3>
              </div>

              {/* Chips de pragas comuns */}
              {selectedCulture && selectedCulture.common_pests.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-[#6B7F72] mb-2 font-medium">Pragas mais comuns para {selectedCulture.name}:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCulture.common_pests.map(pest => (
                      <button
                        key={pest}
                        onClick={() => { setPestName(pest); setCustomPest('') }}
                        className={`px-3.5 py-1.5 rounded-full border text-sm font-medium transition-all
                          ${pestName === pest
                            ? 'bg-[#2D6A4F] border-[#2D6A4F] text-white shadow-sm'
                            : 'bg-white border-[#B7D5C4] text-[#2D6A4F] hover:bg-[#E8F0EB]'
                          }`}
                      >
                        {pest}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 my-4">
                    <div className="flex-1 h-px bg-[#DDE6DF]" />
                    <span className="text-xs text-[#B7D5C4] font-medium">ou</span>
                    <div className="flex-1 h-px bg-[#DDE6DF]" />
                  </div>
                </div>
              )}

              {/* Campo customizado */}
              <input
                type="text"
                value={customPest}
                onChange={e => { setCustomPest(e.target.value); setPestName('') }}
                placeholder={selectedCulture ? 'Outra praga (digite o nome)' : 'Selecione a cultura primeiro…'}
                disabled={!selectedCulture}
                className="w-full bg-[#F7FAF8] border border-[#DDE6DF] rounded-xl px-4 py-3.5 text-sm text-[#1A2E22] placeholder:text-[#B7D5C4] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/25 focus:border-[#2D6A4F] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Coluna direita: resumo + botão */}
          <div className="flex flex-col gap-5">

            {/* Card de resumo */}
            <div className="bg-[#1A2E22] rounded-2xl p-6 text-white">
              <h3 className="font-semibold text-sm mb-4 text-[#B7D5C4] uppercase tracking-wide">O que acontece a seguir</h3>
              <ul className="flex flex-col gap-3 text-sm text-[#B7D5C4]">
                {[
                  'A IA (gpt-4o-mini) descreve como essa praga afeta sua cultura específica',
                  'O sistema busca a dosagem exata e frequência no banco de dados',
                  'Você recebe a explicação científica do BioSoro e as dicas de aplicação',
                ].map((txt, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#2D6A4F]/60 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {txt}
                  </li>
                ))}
              </ul>

              {/* Preview da seleção */}
              {(cultureName || finalPest) && (
                <div className="mt-5 pt-4 border-t border-white/10 flex flex-col gap-1.5">
                  {cultureName && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#6B9E84]">Cultura:</span>
                      <span className="text-white font-medium">{cultureName}</span>
                    </div>
                  )}
                  {finalPest && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#6B9E84]">Praga:</span>
                      <span className="text-white font-medium">{finalPest}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Erro */}
            {error && (
              <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            {/* Botão */}
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl bg-[#2D6A4F] text-white font-semibold text-sm hover:bg-[#245E43] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Buscando protocolo...
                </>
              ) : (
                <>
                  <Sparkles size={17} strokeWidth={2} />
                  Obter Protocolo de Tratamento
                </>
              )}
            </button>

            {loading && (
              <p className="text-center text-xs text-[#6B7F72]">
                Consultando a IA e o banco de dados…
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
