-- Olive Young x Naver Pay card application table
CREATE TABLE IF NOT EXISTS public.card_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  birth text NOT NULL,
  agree_privacy boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.card_applications IS 'Olive Young x Naver Pay card landing page applications';

ALTER TABLE public.card_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert"
  ON public.card_applications
  FOR INSERT
  TO anon
  WITH CHECK (agree_privacy = true);

CREATE POLICY "Deny anonymous select"
  ON public.card_applications
  FOR SELECT
  TO anon
  USING (false);
