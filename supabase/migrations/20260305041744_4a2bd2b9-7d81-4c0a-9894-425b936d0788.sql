CREATE TABLE public.saved_use_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  use_case_id UUID REFERENCES public.use_cases(id) ON DELETE CASCADE NOT NULL,
  l1_id TEXT,
  l1_name TEXT,
  l2_name TEXT,
  l3_name TEXT,
  l4_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, use_case_id)
);

ALTER TABLE public.saved_use_cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own saved use cases"
ON public.saved_use_cases
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);