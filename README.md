## PROJETO FEITO 100% COM O CLAUDE CODE PRA UM PROJETO DE BIOLOGIA. NAO ASSUMO AUTORIA
# 🌱 BioSoro — Defensivos Naturais

Sistema completo para diagnóstico de pragas agrícolas via IA e protocolo de tratamento com soro de leite.

---

## Arquitetura

```
React (GitHub Pages)  →  FastAPI (Railway/Render)  →  OpenAI (Vision/Text)
                                    ↕
                              Supabase (Auth + DB)
```

**Dois caminhos de diagnóstico:**
- **"Não sei a praga"** → foto enviada ao GPT-4o Vision → identifica a praga → busca protocolo no Supabase
- **"Já sei a praga"** → nome da praga enviado ao GPT-4o-mini → descrição da praga → busca protocolo no Supabase

---

## 1. Configurar o Supabase

1. Acesse [supabase.com](https://supabase.com) e abra seu projeto
2. Vá em **SQL Editor** e execute o arquivo `supabase/schema.sql`
3. Isso cria as tabelas `cultures` e `search_history`, configura o RLS e insere os dados das 17 culturas
4. Copie as credenciais em **Project Settings > API**:
   - `URL` → `SUPABASE_URL` (backend) e `VITE_SUPABASE_URL` (frontend)
   - `anon public` → `VITE_SUPABASE_ANON_KEY` (frontend)
   - `service_role` → `SUPABASE_SERVICE_KEY` (backend — nunca expor no frontend!)

---

## 2. Configurar e rodar o Backend

```bash
cd backend

# Instalar dependências
pip install -r requirements.txt

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com suas chaves

# Rodar localmente
uvicorn main:app --reload --port 8000
```

**Variáveis do `.env`:**
```
SUPABASE_URL=https://XXXXXXXX.supabase.co
SUPABASE_SERVICE_KEY=eyJ...   # service_role key
OPENAI_API_KEY=sk-...
```

A API estará disponível em `http://localhost:8000`. Documentação automática em `http://localhost:8000/docs`.

---

## 3. Configurar e rodar o Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com suas chaves

# Rodar localmente
npm run dev
```

**Variáveis do `.env`:**
```
VITE_SUPABASE_URL=https://XXXXXXXX.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...   # anon/public key
VITE_API_URL=http://localhost:8000
```

---

## 4. Deploy

### Backend → Railway

1. Crie conta em [railway.app](https://railway.app)
2. **New Project > Deploy from GitHub Repo** → selecione o repositório
3. Configure o **Root Directory** como `backend`
4. Em **Variables**, adicione as 3 variáveis de ambiente
5. Railway detecta automaticamente o `requirements.txt` e faz o deploy
6. Copie a URL gerada (ex: `https://biosoro-backend.up.railway.app`)

> **Dica:** No `main.py`, troque `allow_origins=["*"]` pelo URL do seu GitHub Pages para maior segurança.

### Frontend → GitHub Pages

1. No `frontend/package.json`, o script `deploy` já está configurado com `gh-pages`
2. Crie o `.env` de produção com `VITE_API_URL` apontando para o backend no Railway
3. Execute:

```bash
cd frontend
npm run build   # gera a pasta dist/
npm run deploy  # publica no GitHub Pages (branch gh-pages)
```

4. No repositório GitHub: **Settings > Pages > Source: Deploy from branch `gh-pages`**

---

## Estrutura do projeto

```
biosoro-project/
├── backend/
│   ├── main.py              # FastAPI: todas as rotas
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.tsx          # Router (HashRouter para GitHub Pages)
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx
│   │   ├── lib/
│   │   │   ├── supabase.ts  # Cliente Supabase
│   │   │   └── api.ts       # Chamadas ao backend
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Stepper.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   └── pages/
│   │       ├── LoginPage.tsx
│   │       ├── RegisterPage.tsx
│   │       ├── HomePage.tsx       # Seleção de caminho (passo 1)
│   │       ├── DiagnosticoPage.tsx # Upload de foto (passo 2 — IA Vision)
│   │       ├── ProtocoloPage.tsx   # Seleção manual de praga (passo 2 — texto)
│   │       └── ResultadoPage.tsx   # Resultado completo (passo 3)
│   └── .env.example
└── supabase/
    └── schema.sql           # Tabelas + RLS + seed das 17 culturas
```

---

## Endpoints da API

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/` | — | Health check |
| GET | `/api/cultures` | — | Lista culturas e pragas |
| POST | `/api/diagnose/vision` | ✅ | Diagnóstico por foto (GPT-4o) |
| POST | `/api/diagnose/text` | ✅ | Protocolo por nome da praga (GPT-4o-mini) |
| GET | `/api/history` | ✅ | Histórico do usuário |

---

## Fluxo de dados

```
Usuário faz login (Supabase Auth)
    ↓
Supabase retorna access_token JWT
    ↓
Frontend passa token no header: Authorization: Bearer <token>
    ↓
Backend valida via supabase.auth.get_user(token)
    ↓
Chama OpenAI → busca no Supabase → salva histórico → retorna resultado
```
