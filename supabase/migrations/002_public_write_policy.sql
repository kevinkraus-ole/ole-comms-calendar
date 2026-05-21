-- Permite escritura pública (sin autenticación) para la rama no-auth
-- NOTA: revertir esto cuando se active SSO en producción

DROP POLICY IF EXISTS "Authenticated can insert" ON mkt_comms_communications;
DROP POLICY IF EXISTS "Authenticated can update" ON mkt_comms_communications;
DROP POLICY IF EXISTS "Authenticated can delete" ON mkt_comms_communications;

CREATE POLICY "Public can insert" ON mkt_comms_communications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can update" ON mkt_comms_communications
  FOR UPDATE USING (true);

CREATE POLICY "Public can delete" ON mkt_comms_communications
  FOR DELETE USING (true);
