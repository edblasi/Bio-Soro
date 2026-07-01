-- ────────────────────────────────────────────────────────────────────────────
-- BioSoro – Schema Supabase
-- Execute este SQL inteiro no SQL Editor do seu projeto Supabase
-- ────────────────────────────────────────────────────────────────────────────

-- 1. Tabela de culturas e pragas (referência)
CREATE TABLE IF NOT EXISTS cultures (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT        NOT NULL UNIQUE,
  common_pests TEXT[]      NOT NULL DEFAULT '{}',
  quantity     TEXT        NOT NULL,
  frequency    TEXT        NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabela de histórico de diagnósticos por usuário
CREATE TABLE IF NOT EXISTS search_history (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  analysis_id      TEXT        NOT NULL,
  culture_name     TEXT        NOT NULL,
  pest_identified  TEXT        NOT NULL,
  pest_description TEXT,
  dosage           TEXT        NOT NULL,
  frequency        TEXT        NOT NULL,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Row Level Security
ALTER TABLE cultures       ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

-- Culturas: leitura pública (dados de referência)
CREATE POLICY "cultures_select_all"
  ON cultures FOR SELECT USING (true);

-- Histórico: cada usuário só acessa os próprios registros
CREATE POLICY "history_select_own"
  ON search_history FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "history_insert_own"
  ON search_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. Seed: dados das culturas (tabela do docs)
INSERT INTO cultures (name, common_pests, quantity, frequency) VALUES
  ('Alface',             ARRAY['Pulgão','Lesma'],                   '25 mL/planta',   '5 dias (3 dias se infestação alta)'),
  ('Couve-manteiga',     ARRAY['Lagarta-da-couve','Pulgão'],        '35 mL/planta',   '4 dias'),
  ('Tomate',             ARRAY['Mosca-branca','Traça-do-tomateiro'],'50 mL/planta',  '3 dias'),
  ('Cebolinha',          ARRAY['Tripes','Pulgão'],                  '20 mL/touceira', '7 dias'),
  ('Salsinha',           ARRAY['Pulgão','Lagarta'],                 '20 mL/touceira', '7 dias'),
  ('Rúcula',             ARRAY['Pulgão','Lagarta'],                 '25 mL/planta',   '5 dias'),
  ('Cenoura',            ARRAY['Pulgão','Lagarta-rosca'],           '100 mL/m²',      '7 dias'),
  ('Beterraba',          ARRAY['Pulgão','Lagarta-rosca'],           '100 mL/m²',      '7 dias'),
  ('Pepino',             ARRAY['Mosca-branca','Ácaro-rajado'],      '45 mL/planta',  '4 dias'),
  ('Abobrinha',          ARRAY['Mosca-branca','Pulgão'],            '50 mL/planta',  '4 dias'),
  ('Pimentão',           ARRAY['Pulgão','Tripes'],                  '35 mL/planta',  '5 dias'),
  ('Berinjela',          ARRAY['Pulgão','Ácaro-rajado'],            '35 mL/planta',  '5 dias'),
  ('Repolho',            ARRAY['Lagarta-da-couve','Pulgão'],        '35 mL/planta',  '4 dias'),
  ('Brócolis',           ARRAY['Lagarta-da-couve','Pulgão'],        '35 mL/planta',  '4 dias'),
  ('Couve-flor',         ARRAY['Lagarta-da-couve','Pulgão'],        '35 mL/planta',  '4 dias'),
  ('Morango',            ARRAY['Ácaro-rajado','Pulgão'],            '20 mL/planta',   '5 dias'),
  ('Funcho (erva-doce)', ARRAY['Pulgão','Lagarta'],                 '30 mL/planta',   '5 dias')
ON CONFLICT (name) DO NOTHING;
