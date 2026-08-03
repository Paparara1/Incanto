
CREATE TABLE public.ton_balance_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  address TEXT NOT NULL,
  balance_nanoton BIGINT NOT NULL DEFAULT 0,
  balance_ton NUMERIC(20, 9) NOT NULL DEFAULT 0,
  previous_balance_ton NUMERIC(20, 9),
  is_inbound BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ton_balance_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read ton balance" ON public.ton_balance_log FOR SELECT USING (true);

CREATE INDEX idx_ton_balance_created ON public.ton_balance_log(created_at DESC);
