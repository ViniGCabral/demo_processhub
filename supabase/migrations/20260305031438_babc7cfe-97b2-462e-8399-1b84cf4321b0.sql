
-- Use case sessions table
CREATE TABLE public.use_case_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_name TEXT NOT NULL,
  area TEXT NOT NULL,
  source_level TEXT NOT NULL CHECK (source_level IN ('l1','l2','l3','l4')),
  source_ids TEXT[] NOT NULL DEFAULT '{}',
  source_names TEXT[] NOT NULL DEFAULT '{}',
  process_names TEXT[] NOT NULL DEFAULT '{}',
  assessment_problems TEXT DEFAULT '',
  observations TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Use cases table
CREATE TABLE public.use_cases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.use_case_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT DEFAULT 'IA',
  effort TEXT DEFAULT 'low',
  impact TEXT DEFAULT 'high',
  source_reference TEXT DEFAULT '',
  potential_gains JSONB DEFAULT '[]',
  key_indicators TEXT[] DEFAULT '{}',
  key_technologies TEXT[] DEFAULT '{}',
  impacted_processes_count INT DEFAULT 0,
  benchmarking JSONB DEFAULT NULL,
  screen_match JSONB DEFAULT NULL,
  business_case JSONB DEFAULT NULL,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.use_case_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.use_cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sessions" ON public.use_case_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own sessions" ON public.use_case_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own sessions" ON public.use_case_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own sessions" ON public.use_case_sessions FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own use cases" ON public.use_cases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own use cases" ON public.use_cases FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own use cases" ON public.use_cases FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own use cases" ON public.use_cases FOR DELETE USING (auth.uid() = user_id);

-- Updated_at trigger for use_cases
CREATE TRIGGER update_use_cases_updated_at BEFORE UPDATE ON public.use_cases FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
