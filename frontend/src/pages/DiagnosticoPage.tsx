import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, ImageIcon, X, Sparkles, AlertCircle, ChevronDown } from 'lucide-react'
import { Navbar }        from '../components/Navbar'
import { Footer }        from '../components/Footer'
import { Stepper }       from '../components/Stepper'
import { useAuth }       from '../contexts/AuthContext'
import { fetchCultures, diagnoseVision, Culture } from '../lib/api'

export function DiagnosticoPage() {
  const navigate       = useNavigate()
  const { session }    = useAuth()
  const fileInputRef   = useRef<HTMLInputElement>(null)

  const [cultures,  setCultures]  = useState<Culture[]>([])
  const [culture,   setCulture]   = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUrl,  setImageUrl]  = useState<string>('')
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')

  /* Carrega culturas */
  useEffect(() => {
    fetchCultures().then(setCultures).catch(() => {})
  }, [])

  /* Preview da imagem */
  const handleFileChange = (file: File | null) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Por favor, envie um arquivo de imagem (JPG, PNG, WEBP).')
      return
    }
    setImageFile(file)
    setImageUrl(URL.createObjectURL(file))
    setError('')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    handleFileChange(e.dataTransfer.files[0] ?? null)
  }

  const clearImage = () => {
    setImageFile(null)
    if (imageUrl) URL.revokeObjectURL(imageUrl)
    setImageUrl('')
  }

  /* Submissão */
  const handleAnalyze = async () => {
    if (!culture)    { setError('Selecione a cultura antes de continuar.'); return }
    if (!imageFile)  { setError('Adicione uma foto da plantação afetada.'); return }
    if (!session?.access_token) return

    setError('')
    setLoading(true)
    try {
      const result = await diagnoseVision(session.access_token, culture, imageFile)
      navigate('/resultado', { state: { result, imageUrl, via: 'vision' } })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao analisar. Tente novamente.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const canSubmit = !!culture && !!imageFile && !loading

  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAF8]">
      <Navbar backLabel="Voltar ao Dashboard" backTo="/" />
      <Stepper currentStep={2} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">

        {/* Cabeçalho */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-[#2D6A4F] uppercase tracking-widest mb-2">Passo 2 de 3 — Identificação por IA</p>
          <h2 className="text-3xl font-semibold text-[#1A2E22] mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
            Diagnóstico com Visão Computacional
          </h2>
          <p className="text-[#6B7F72] text-sm max-w-xl">
            Envie uma foto clara da plantação afetada e selecione a cultura. O GPT-4o irá identificar a praga e recomendar o protocolo de tratamento.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-4xl">

          {/* Coluna esquerda: upload */}
          <div className="flex flex-col gap-5">
            {/* Step A */}
            <div className="bg-white rounded-2xl border border-[#DDE6DF] shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-[#1A2E22] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">A</span>
                </div>
                <h3 className="text-sm font-semibold text-[#1A2E22]">Foto da plantação</h3>
              </div>

              {/* Área de drop */}
              {!imageUrl ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={e => e.preventDefault()}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#B7D5C4] rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer hover:bg-[#F7FAF8] hover:border-[#2D6A4F] transition-all text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#E8F0EB] flex items-center justify-center">
                    <Upload size={22} className="text-[#2D6A4F]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1A2E22]">Arraste ou clique para enviar</p>
                    <p className="text-xs text-[#6B7F72] mt-0.5">JPG, PNG ou WEBP · Máx. 10 MB</p>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-[#DDE6DF]">
                  <img src={imageUrl} alt="Preview" className="w-full h-52 object-cover" />
                  <button
                    onClick={clearImage}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 border border-[#DDE6DF] flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-all"
                  >
                    <X size={14} className="text-[#6B7F72]" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 px-3 py-2">
                    <p className="text-white text-xs truncate flex items-center gap-1.5">
                      <ImageIcon size={11} /> {imageFile?.name}
                    </p>
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef} type="file" accept="image/*" className="hidden"
                onChange={e => handleFileChange(e.target.files?.[0] ?? null)}
              />
            </div>

            {/* Step B */}
            <div className="bg-white rounded-2xl border border-[#DDE6DF] shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-[#1A2E22] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">B</span>
                </div>
                <h3 className="text-sm font-semibold text-[#1A2E22]">Qual é a cultura?</h3>
              </div>

              <div className="relative">
                <select
                  value={culture}
                  onChange={e => setCulture(e.target.value)}
                  className="w-full appearance-none bg-[#F7FAF8] border border-[#DDE6DF] rounded-xl px-4 py-3.5 text-sm text-[#1A2E22] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/25 focus:border-[#2D6A4F] transition-all pr-10 cursor-pointer"
                >
                  <option value="">Selecione a cultura plantada</option>
                  {cultures.map(c => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#B7D5C4] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Coluna direita: info + botão */}
          <div className="flex flex-col gap-5">

            {/* Info card */}
            <div className="bg-[#1A2E22] rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2.5 mb-4">
                <Sparkles size={18} className="text-[#B7D5C4]" />
                <h3 className="font-semibold text-sm">Como funciona</h3>
              </div>
              <ul className="flex flex-col gap-3 text-sm text-[#B7D5C4]">
                {[
                  'Sua foto é enviada ao GPT-4o com instrução especializada em pragas agrícolas',
                  'A IA identifica a praga, sua severidade e descreve os danos característicos',
                  'O sistema busca no banco de dados a dosagem exata para sua cultura',
                  'Você recebe o protocolo completo de aplicação do BioSoro',
                ].map((txt, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#2D6A4F]/60 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {txt}
                  </li>
                ))}
              </ul>
            </div>

            {/* Dica de foto */}
            <div className="bg-[#FFF9EC] border border-[#F0D98A] rounded-xl p-4 text-sm text-[#7A5C00]">
              <p className="font-semibold mb-1">💡 Dica para melhores resultados</p>
              <p className="text-xs leading-relaxed">
                Tire a foto com boa iluminação, o mais próximo possível da praga. Fotos nítidas das folhas, caule ou fruto afetado aumentam muito a precisão da identificação.
              </p>
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
              onClick={handleAnalyze}
              disabled={!canSubmit}
              className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl bg-[#2D6A4F] text-white font-semibold text-sm hover:bg-[#245E43] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Identificando praga...
                </>
              ) : (
                <>
                  <Sparkles size={17} strokeWidth={2} />
                  Analisar com IA
                </>
              )}
            </button>

            {loading && (
              <p className="text-center text-xs text-[#6B7F72]">
                Isso pode levar alguns segundos. A IA está analisando a imagem…
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
