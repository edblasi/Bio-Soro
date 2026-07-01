const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// ── Tipos ─────────────────────────────────────────────────────────────────────
export interface Culture {
  name: string
  common_pests: string[]
  quantity: string
  frequency: string
}

export interface DiagnosisResult {
  analysis_id: string
  culture_name: string
  pest_name: string
  pest_description: string
  dosage: string
  frequency: string
  scientific_explanation: string
  extra_tips: {
    frequency_guide: { level: string; frequency: string }[]
    timing: string
    after_rain: string
  }
}

export interface HistoryEntry {
  id: string
  analysis_id: string
  culture_name: string
  pest_identified: string
  dosage: string
  frequency: string
  created_at: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const authHeader = (token: string) => ({ Authorization: `Bearer ${token}` })

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Erro desconhecido' }))
    throw new Error(err.detail || `HTTP ${res.status}`)
  }
  return res.json()
}

// ── Endpoints ─────────────────────────────────────────────────────────────────

/** Lista culturas (público, não precisa de token) */
export async function fetchCultures(): Promise<Culture[]> {
  const res = await fetch(`${API}/api/cultures`)
  return handleResponse<Culture[]>(res)
}

/** Diagnóstico via foto (OpenAI Vision - gpt-4o) */
export async function diagnoseVision(
  token: string,
  culture: string,
  image: File,
): Promise<DiagnosisResult> {
  const form = new FormData()
  form.append('culture', culture)
  form.append('image', image)

  const res = await fetch(`${API}/api/diagnose/vision`, {
    method: 'POST',
    headers: authHeader(token),
    body: form,
  })
  return handleResponse<DiagnosisResult>(res)
}

/** Diagnóstico por nome da praga (OpenAI text - gpt-4o-mini) */
export async function diagnoseText(
  token: string,
  culture: string,
  pestName: string,
): Promise<DiagnosisResult> {
  const form = new FormData()
  form.append('culture', culture)
  form.append('pest_name', pestName)

  const res = await fetch(`${API}/api/diagnose/text`, {
    method: 'POST',
    headers: authHeader(token),
    body: form,
  })
  return handleResponse<DiagnosisResult>(res)
}

/** Histórico de diagnósticos do usuário */
export async function fetchHistory(token: string): Promise<HistoryEntry[]> {
  const res = await fetch(`${API}/api/history`, {
    headers: authHeader(token),
  })
  return handleResponse<HistoryEntry[]>(res)
}
