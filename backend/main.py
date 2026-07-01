from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client, Client
from openai import OpenAI
import base64, os, json, random
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

# ── App ──────────────────────────────────────────────────────────────────────
app = FastAPI(title="BioSoro API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://edblasi.github.io"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Clients ──────────────────────────────────────────────────────────────────
supabase: Client = create_client(
    os.getenv("SUPABASE_URL", ""),
    os.getenv("SUPABASE_SERVICE_KEY", ""),
)
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", "COLOQUE_AQUI_SUA_CHAVE_OPENAI"))
security = HTTPBearer()

# ── Conteúdo estático (do docs) ───────────────────────────────────────────────
SCIENTIFIC_EXPLANATION = (
    "O inseticida contém ácido lático, resultante da fermentação do leite, e apresenta um pH baixo "
    "— em torno de 4,5 — o que o torna ácido. Quando aplicado nas plantações, essa acidez altera o "
    "ambiente em que vivem insetos e outras pragas, que geralmente se desenvolvem em condições de pH "
    "neutro. Dessa forma, o soro atua como um inseticida caseiro e natural, interferindo nas condições "
    "ideais para a sobrevivência dessas pragas, sem interferir no crescimento e desenvolvimento da planta."
)

EXTRA_TIPS = {
    "frequency_guide": [
        {"level": "Baixa",         "frequency": "1 aplicação a cada 7 dias"},
        {"level": "Moderada",      "frequency": "1 aplicação a cada 5 dias"},
        {"level": "Alta",          "frequency": "1 aplicação a cada 2–3 dias até controlar a praga"},
        {"level": "Após chuva forte", "frequency": "Reaplicar no mesmo dia (preferencialmente no final da tarde)"},
    ],
    "timing":     "Recomenda-se fortemente aplicar o produto após as 16h e antes das 10h, quando a intensidade da luz solar é menor.",
    "after_rain": "Em caso de exposição a chuvas fortes, reaplicar o produto.",
}

# ── Auth ──────────────────────────────────────────────────────────────────────
async def get_current_user(creds: HTTPAuthorizationCredentials = Depends(security)):
    try:
        resp = supabase.auth.get_user(creds.credentials)
        if not resp.user:
            raise HTTPException(status_code=401, detail="Token inválido.")
        return resp.user
    except Exception:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado.")

def gen_analysis_id() -> str:
    return f"BS-{datetime.now().year}-{random.randint(10000, 99999)}"

# ── Helpers ───────────────────────────────────────────────────────────────────
def _build_and_save(culture: str, pest_name: str, pest_description: str, user_id: str) -> dict:
    """Busca dados da cultura no Supabase, salva histórico e retorna resultado completo."""
    rows = supabase.table("cultures").select("*").ilike("name", culture).execute()
    if not rows.data:
        raise HTTPException(status_code=404, detail=f"Cultura '{culture}' não encontrada no banco de dados.")

    c = rows.data[0]
    analysis_id = gen_analysis_id()

    supabase.table("search_history").insert({
        "user_id":         user_id,
        "analysis_id":     analysis_id,
        "culture_name":    culture,
        "pest_identified": pest_name,
        "pest_description": pest_description,
        "dosage":          c["quantity"],
        "frequency":       c["frequency"],
    }).execute()

    return {
        "analysis_id":            analysis_id,
        "culture_name":           culture,
        "pest_name":              pest_name,
        "pest_description":       pest_description,
        "dosage":                 c["quantity"],
        "frequency":              c["frequency"],
        "scientific_explanation": SCIENTIFIC_EXPLANATION,
        "extra_tips":             EXTRA_TIPS,
    }

# ── Rotas ─────────────────────────────────────────────────────────────────────
@app.get("/")
def healthcheck():
    return {"status": "BioSoro API online 🌱"}


@app.get("/api/cultures")
def list_cultures():
    """Lista todas as culturas com dados de praga (endpoint público)."""
    result = (
        supabase.table("cultures")
        .select("name, common_pests, quantity, frequency")
        .order("name")
        .execute()
    )
    return result.data


@app.post("/api/diagnose/vision")
async def diagnose_vision(
    culture: str = Form(...),
    image: UploadFile = File(...),
    user=Depends(get_current_user),
):
    """Identifica a praga via foto usando OpenAI GPT-4o Vision."""
    img_bytes = await image.read()
    b64  = base64.b64encode(img_bytes).decode()
    mime = image.content_type or "image/jpeg"

    vision_prompt = (
        f"Você é especialista em identificação de pragas agrícolas. "
        f"A cultura em questão é: {culture}. "
        "Analise a imagem e identifique a praga presente. "
        "Se não houver praga visível, informe isso na descrição. "
        "Responda SOMENTE com JSON válido:\n"
        '{"pest_name":"<nome da praga em português>","pest_description":"<2 a 3 frases em português sobre como essa praga afeta essa cultura>","confidence":"alta|média|baixa"}'
    )

    try:
        response = openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[{
                "role": "user",
                "content": [
                    {"type": "image_url", "image_url": {"url": f"data:{mime};base64,{b64}", "detail": "high"}},
                    {"type": "text", "text": vision_prompt},
                ],
            }],
            max_tokens=400,
            response_format={"type": "json_object"},
        )
        ai = json.loads(response.choices[0].message.content)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Erro ao comunicar com OpenAI: {exc}")

    return _build_and_save(
        culture=culture,
        pest_name=ai.get("pest_name", "Não identificado"),
        pest_description=ai.get("pest_description", ""),
        user_id=str(user.id),
    )


@app.post("/api/diagnose/text")
async def diagnose_text(
    culture: str = Form(...),
    pest_name: str = Form(...),
    user=Depends(get_current_user),
):
    """Gera descrição da praga via texto (gpt-4o-mini, mais barato que visão)."""
    text_prompt = (
        f"Você é especialista em pragas agrícolas. Cultura: {culture}. Praga: {pest_name}. "
        "Descreva em 2 a 3 frases em português como essa praga afeta essa cultura e quais são os principais sintomas ou danos visíveis. "
        'Responda SOMENTE com JSON válido: {"pest_description":"<descrição aqui>"}'
    )

    try:
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": text_prompt}],
            max_tokens=250,
            response_format={"type": "json_object"},
        )
        ai = json.loads(response.choices[0].message.content)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Erro ao comunicar com OpenAI: {exc}")

    return _build_and_save(
        culture=culture,
        pest_name=pest_name,
        pest_description=ai.get("pest_description", ""),
        user_id=str(user.id),
    )


@app.get("/api/history")
async def get_history(user=Depends(get_current_user)):
    """Retorna os últimos 20 diagnósticos do usuário autenticado."""
    result = (
        supabase.table("search_history")
        .select("*")
        .eq("user_id", str(user.id))
        .order("created_at", desc=True)
        .limit(20)
        .execute()
    )
    return result.data
