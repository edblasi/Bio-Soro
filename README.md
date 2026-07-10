# 🌱 BioSoro — Defensivo Natural com Diagnóstico Inteligente de Pragas

Este projeto foi desenvolvido para uma feira de Biologia com fins educacionais e demonstrativos. A proposta foi organizada, adaptada e implementada a partir de pesquisas, referências técnicas e recursos de apoio, portanto não reivindico autoria completa sobre todos os conceitos, ferramentas ou tecnologias utilizados. com o objetivo de apresentar uma solução tecnológica para auxiliar no diagnóstico de pragas agrícolas e na recomendação de protocolos de tratamento utilizando um defensivo natural à base de soro de leite.

O sistema une Inteligência Artificial, banco de dados e uma interface web simples para ajudar o usuário a identificar possíveis pragas em plantas e receber orientações de aplicação do produto.

---

## 📌 Sobre o Projeto

O **BioSoro** é uma plataforma web que permite ao usuário diagnosticar pragas agrícolas de duas formas:

1. **Diagnóstico por imagem**
   O usuário envia uma foto da planta ou da praga, e a Inteligência Artificial analisa a imagem para identificar o possível problema.

2. **Diagnóstico por nome da praga**
   Caso o usuário já saiba qual é a praga, ele pode informar o nome diretamente e receber o protocolo de tratamento correspondente.

Após o diagnóstico, o sistema consulta o banco de dados e retorna um protocolo com informações sobre a cultura, a praga, a dosagem recomendada e a frequência de aplicação do defensivo natural.

---

## 🧪 Objetivo

O objetivo do projeto é demonstrar como a tecnologia pode ser usada na agricultura para:

* auxiliar na identificação de pragas;
* reduzir o uso excessivo de produtos químicos;
* incentivar alternativas naturais de controle;
* facilitar o acesso a informações sobre manejo agrícola;
* apoiar pequenos produtores e hortas caseiras.

---

## 🏗️ Arquitetura do Sistema

```txt
React, hospedado no GitHub Pages
        ↓
FastAPI, hospedado no Railway
        ↓
OpenAI, para análise por imagem e texto
        ↓
Supabase, para autenticação e banco de dados
```

---

## 🔄 Funcionamento

O sistema possui dois fluxos principais.

### 1. Quando o usuário não sabe qual é a praga

```txt
Usuário envia uma foto
        ↓
A imagem é analisada pela IA
        ↓
A praga provável é identificada
        ↓
O sistema busca o protocolo no banco de dados
        ↓
O resultado é exibido ao usuário
```

### 2. Quando o usuário já sabe qual é a praga

```txt
Usuário digita o nome da praga
        ↓
A IA interpreta e descreve a praga
        ↓
O sistema busca o protocolo no banco de dados
        ↓
O resultado é exibido ao usuário
```

---

## 💻 Tecnologias Utilizadas

### Frontend

* React
* TypeScript
* Vite
* Supabase Auth
* GitHub Pages

### Backend

* Python
* FastAPI
* OpenAI API
* Supabase SDK

### Banco de Dados

* Supabase
* PostgreSQL
* Row Level Security

---

## 📂 Estrutura do Projeto

```txt
biosoro-project/
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx
│   │   ├── lib/
│   │   │   ├── supabase.ts
│   │   │   └── api.ts
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Stepper.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   └── pages/
│   │       ├── LoginPage.tsx
│   │       ├── RegisterPage.tsx
│   │       ├── HomePage.tsx
│   │       ├── DiagnosticoPage.tsx
│   │       ├── ProtocoloPage.tsx
│   │       └── ResultadoPage.tsx
│   │
│   └── .env.example
│
└── supabase/
    └── schema.sql
```

---

## ⚙️ Configuração do Supabase

1. Acesse o site do Supabase.
2. Crie ou abra um projeto.
3. Vá até a aba **SQL Editor**.
4. Execute o arquivo:

```txt
supabase/schema.sql
```

Esse arquivo cria as tabelas necessárias, configura as políticas de segurança e insere os dados iniciais das culturas e protocolos.

Depois, vá em:

```txt
Project Settings > API
```

Copie as seguintes informações:

```txt
Project URL
Anon Public Key
Service Role Key
```

A chave `service_role` deve ser usada apenas no backend e nunca deve ser exposta no frontend.

---

## 🔑 Variáveis de Ambiente

### Backend

Crie um arquivo `.env` dentro da pasta `backend` com as seguintes variáveis:

```env
SUPABASE_URL=https://XXXXXXXX.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
OPENAI_API_KEY=sk-...
```

### Frontend

Crie um arquivo `.env` dentro da pasta `frontend` com as seguintes variáveis:

```env
VITE_SUPABASE_URL=https://XXXXXXXX.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_API_URL=http://localhost:8000
```

---

## ▶️ Como Rodar o Backend Localmente

Entre na pasta do backend:

```bash
cd backend
```

Instale as dependências:

```bash
pip install -r requirements.txt
```

Crie o arquivo de variáveis de ambiente:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas chaves.

Depois, execute o servidor:

```bash
uvicorn main:app --reload --port 8000
```

A API ficará disponível em:

```txt
http://localhost:8000
```

A documentação automática estará em:

```txt
http://localhost:8000/docs
```

---

## ▶️ Como Rodar o Frontend Localmente

Entre na pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo de variáveis de ambiente:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com as informações do Supabase e a URL da API.

Depois, rode o projeto:

```bash
npm run dev
```

---

## 🌐 Deploy do Backend

O backend pode ser publicado no Railway ou no Render.

### Railway

1. Crie uma conta no Railway.
2. Clique em **New Project**.
3. Escolha **Deploy from GitHub Repo**.
4. Selecione o repositório do projeto.
5. Configure o diretório raiz como:

```txt
backend
```

6. Adicione as variáveis de ambiente:

```env
SUPABASE_URL
SUPABASE_SERVICE_KEY
OPENAI_API_KEY
```

7. Após o deploy, copie a URL gerada pelo Railway.

Exemplo:

```txt
https://biosoro-backend.up.railway.app
```

---

## 🌐 Deploy do Frontend

O frontend pode ser publicado no GitHub Pages.

Antes do deploy, configure o `.env` de produção com a URL do backend:

```env
VITE_API_URL=https://biosoro-backend.up.railway.app
```

Depois, execute:

```bash
cd frontend
npm run build
npm run deploy
```

No GitHub, vá em:

```txt
Settings > Pages
```

E configure a publicação pela branch:

```txt
gh-pages
```

---

## 📡 Endpoints da API

| Método | Rota                   | Autenticação | Descrição                                 |
| ------ | ---------------------- | ------------ | ----------------------------------------- |
| GET    | `/`                    | Não          | Verifica se a API está funcionando        |
| GET    | `/api/cultures`        | Não          | Lista as culturas e pragas cadastradas    |
| POST   | `/api/diagnose/vision` | Sim          | Faz diagnóstico por imagem usando IA      |
| POST   | `/api/diagnose/text`   | Sim          | Busca protocolo a partir do nome da praga |
| GET    | `/api/history`         | Sim          | Retorna o histórico do usuário            |

---

## 🔐 Fluxo de Autenticação

```txt
Usuário faz login
        ↓
Supabase Auth gera um token JWT
        ↓
Frontend envia o token no header da requisição
        ↓
Backend valida o token
        ↓
Sistema processa o diagnóstico
        ↓
Resultado é salvo no histórico do usuário
```

O token é enviado no seguinte formato:

```txt
Authorization: Bearer <token>
```

---

## 🗃️ Banco de Dados

O banco de dados armazena informações como:

* culturas cadastradas;
* pragas associadas;
* protocolos de aplicação;
* usuários autenticados;
* histórico de buscas e diagnósticos.

---

## 🔒 Segurança

O projeto utiliza algumas práticas básicas de segurança:

* autenticação com Supabase Auth;
* validação de token JWT no backend;
* Row Level Security no banco de dados;
* chave `service_role` usada apenas no backend;
* chave pública `anon` usada apenas no frontend;
* histórico vinculado ao usuário autenticado.

---

## 🌱 Possíveis Melhorias Futuras

Algumas melhorias que podem ser implementadas futuramente:

* painel administrativo para cadastrar novas culturas e pragas;
* histórico com filtros por data, cultura ou praga;
* exportação do resultado em PDF;
* upload de múltiplas imagens;
* geolocalização das ocorrências;
* dashboard com estatísticas;
* treinamento de um modelo próprio de visão computacional;
* recomendações diferentes conforme o estágio da planta;
* alertas sobre reaplicação do produto.

---

## ⚠️ Observação

Este projeto foi desenvolvido para fins educacionais e de demonstração em uma feira de Biologia. As recomendações apresentadas pelo sistema devem ser interpretadas como uma proposta experimental e não substituem a orientação de profissionais da área agrícola ou agronômica.

Antes de qualquer aplicação real em larga escala, é necessário realizar testes, validações práticas e análises de segurança para as plantas, para o solo e para o ambiente.
