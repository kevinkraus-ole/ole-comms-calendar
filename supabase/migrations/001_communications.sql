-- Communications table for the marketing calendar
CREATE TABLE IF NOT EXISTS mkt_comms_communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  channel TEXT NOT NULL CHECK (channel IN ('push', 'email', 'sms', 'whatsapp', 'in_app')),
  segment TEXT NOT NULL DEFAULT 'Todos',
  scheduled_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'sent', 'cancelled')),
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION mkt_comms_update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_mkt_comms_communications_updated_at
  BEFORE UPDATE ON mkt_comms_communications
  FOR EACH ROW EXECUTE FUNCTION mkt_comms_update_updated_at();

-- Public read, authenticated write
ALTER TABLE mkt_comms_communications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read" ON mkt_comms_communications
  FOR SELECT USING (true);

CREATE POLICY "Authenticated can insert" ON mkt_comms_communications
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update" ON mkt_comms_communications
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete" ON mkt_comms_communications
  FOR DELETE USING (auth.role() = 'authenticated');

-- Seed data
INSERT INTO mkt_comms_communications (title, description, channel, segment, scheduled_at, status, created_by) VALUES
  ('Bienvenida nuevos agentes Q2', 'Email de bienvenida para todos los agentes incorporados en Q2', 'email', 'Agentes Nuevos', NOW() + INTERVAL '3 days', 'planned', 'marketing@olelife.com'),
  ('Push: Activa tu primer cliente', 'Recordatorio para agentes sin primer cliente activado', 'push', 'Agentes sin activación', NOW() + INTERVAL '5 days', 'planned', 'marketing@olelife.com'),
  ('WhatsApp: Promoción pólizas vida', 'Campaña de fin de mes para promotores Alliance', 'whatsapp', 'Promotores Alliance', NOW() + INTERVAL '7 days', 'planned', 'marketing@olelife.com'),
  ('Email: Reporte mensual agencias', 'Resumen de métricas de mayo para líderes de agencia', 'email', 'Líderes de Agencia', NOW() + INTERVAL '10 days', 'planned', 'marketing@olelife.com'),
  ('In-App: Banner Cash Bonus', 'Banner en dashboard agentes sobre el programa Cash Bonus', 'in_app', 'Todos los agentes', NOW() + INTERVAL '1 day', 'planned', 'marketing@olelife.com');
