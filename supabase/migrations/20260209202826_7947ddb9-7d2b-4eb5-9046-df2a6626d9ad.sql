
-- Create processes table
CREATE TABLE public.processes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  area TEXT NOT NULL DEFAULT '',
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  has_documentation BOOLEAN NOT NULL DEFAULT false,
  documentation_status TEXT DEFAULT 'pending',
  is_favorite BOOLEAN DEFAULT false,
  is_template BOOLEAN DEFAULT false,
  l1 TEXT,
  l2 TEXT,
  l3 TEXT,
  l4 TEXT,
  automation JSONB,
  data_integrity JSONB,
  governance JSONB,
  executor TEXT,
  approver TEXT,
  frequency TEXT,
  avg_time TEXT,
  owner TEXT,
  support_team TEXT,
  adhoc_monthly TEXT,
  sla TEXT,
  regulations TEXT,
  kpis TEXT,
  systems TEXT[],
  version TEXT,
  doc_last_review TEXT,
  doc_next_review TEXT,
  execution_effort JSONB,
  last_review TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.processes ENABLE ROW LEVEL SECURITY;

-- Users can only see their own processes
CREATE POLICY "Users can view their own processes"
  ON public.processes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own processes"
  ON public.processes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own processes"
  ON public.processes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own processes"
  ON public.processes FOR DELETE
  USING (auth.uid() = user_id);

-- Index for faster lookups
CREATE INDEX idx_processes_user_id ON public.processes(user_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_processes_updated_at
  BEFORE UPDATE ON public.processes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
