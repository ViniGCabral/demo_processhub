import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import type { SOPData, SOPStep, SOPSubstep, SOPMetadata, SOPInputOutput, SOPAutomationClass, SOPProcessClassification } from '@/data/sopMockData';
import { sopDataMap as mockSopDataMap, sopDemoDefault } from '@/data/sopMockData';

// Re-export types for convenience
export type { SOPData, SOPStep, SOPSubstep, SOPMetadata, SOPInputOutput, SOPAutomationClass, SOPProcessClassification };


interface SOPStore {
  sopMap: Record<string, SOPData>;
  loading: boolean;
  loaded: boolean;
  fetchSOPs: () => Promise<void>;
  getSOP: (processId: string) => SOPData | null;
  seedDemoSOPs: (processIds: Record<string, string>) => Promise<void>;
  upsertSOP: (processId: string, sop: Omit<SOPData, 'id'>) => Promise<void>;
  deleteSOP: (processId: string) => Promise<void>;
}

function dbToSOP(row: any): SOPData {
  return {
    id: row.id,
    title: row.title,
    code: row.code || '',
    area: row.area || '',
    objective: row.objective || '',
    metadata: row.metadata as SOPMetadata | undefined,
    steps: (row.steps as SOPStep[]) || [],
  };
}

export const useSopStore = create<SOPStore>()((set, get) => ({
  sopMap: {},
  loading: false,
  loaded: false,

  fetchSOPs: async () => {
    if (get().loading) return;
    set({ loading: true });

    const { data, error } = await supabase
      .from('sop_documents')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching SOPs:', error);
      set({ loading: false, loaded: true });
      return;
    }

    const sopMap: Record<string, SOPData> = {};
    for (const row of data || []) {
      sopMap[row.process_id] = dbToSOP(row);
    }
    set({ sopMap, loading: false, loaded: true });
  },

  getSOP: (processId: string) => {
    const stored = get().sopMap[processId];
    if (stored) return stored;
    // Fallback to mock data for demo mode
    return mockSopDataMap[processId] || sopDemoDefault;
  },

  seedDemoSOPs: async (processIds: Record<string, string>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const rows = Object.entries(mockSopDataMap).map(([mockId, sop]) => {
      const realProcessId = processIds[mockId];
      if (!realProcessId) return null;
      return {
        process_id: realProcessId,
        user_id: user.id,
        title: sop.title,
        code: sop.code,
        area: sop.area,
        objective: sop.objective,
        metadata: sop.metadata as any,
        steps: sop.steps as any,
        version: '1.0',
        status: 'draft',
      };
    }).filter(Boolean);

    if (rows.length === 0) return;

    const { data, error } = await supabase
      .from('sop_documents')
      .insert(rows)
      .select();

    if (error) {
      console.error('Error seeding SOPs:', error);
      return;
    }

    if (data) {
      const sopMap = { ...get().sopMap };
      for (const row of data) {
        sopMap[row.process_id] = dbToSOP(row);
      }
      set({ sopMap });
    }
  },

  upsertSOP: async (processId: string, sop: Omit<SOPData, 'id'>) => {
    // Keep the sidebar counter and modifications view in sync immediately,
    // even while the remote save is still in progress.
    const current = get().sopMap[processId];
    set({
      sopMap: {
        ...get().sopMap,
        [processId]: { ...sop, id: current?.id || processId },
      },
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const row = {
      process_id: processId,
      user_id: user.id,
      title: sop.title,
      code: sop.code,
      area: sop.area,
      objective: sop.objective,
      metadata: sop.metadata as any,
      steps: sop.steps as any,
      version: '1.0',
      status: 'draft',
    };

    // Check if exists
    const { data: existing } = await supabase
      .from('sop_documents')
      .select('id')
      .eq('process_id', processId)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('sop_documents')
        .update(row)
        .eq('id', existing.id);
      if (error) console.error('Error updating SOP:', error);
    } else {
      const { error } = await supabase
        .from('sop_documents')
        .insert(row);
      if (error) console.error('Error inserting SOP:', error);
    }

    // Refresh
    await get().fetchSOPs();
  },

  deleteSOP: async (processId: string) => {
    const { error } = await supabase
      .from('sop_documents')
      .delete()
      .eq('process_id', processId);

    if (error) {
      console.error('Error deleting SOP:', error);
      return;
    }

    const sopMap = { ...get().sopMap };
    delete sopMap[processId];
    set({ sopMap });
  },
}));
