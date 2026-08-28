
-- Create sop_documents table
CREATE TABLE public.sop_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  process_id UUID NOT NULL REFERENCES public.processes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  code TEXT,
  area TEXT,
  version TEXT DEFAULT '1.0',
  status TEXT DEFAULT 'draft',
  objective TEXT,
  metadata JSONB DEFAULT '{}',
  steps JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(process_id, version)
);

-- Enable RLS
ALTER TABLE public.sop_documents ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own SOPs"
ON public.sop_documents FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own SOPs"
ON public.sop_documents FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own SOPs"
ON public.sop_documents FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own SOPs"
ON public.sop_documents FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_sop_documents_updated_at
BEFORE UPDATE ON public.sop_documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
