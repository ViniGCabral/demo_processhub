export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      process_videos: {
        Row: {
          created_at: string
          filename: string | null
          id: string
          process_id: string | null
          transcription_s3_key: string | null
          transcription_text: string | null
          transcription_url: string | null
          user_id: string
          video_s3_key: string
          video_url: string
        }
        Insert: {
          created_at?: string
          filename?: string | null
          id?: string
          process_id?: string | null
          transcription_s3_key?: string | null
          transcription_text?: string | null
          transcription_url?: string | null
          user_id: string
          video_s3_key: string
          video_url: string
        }
        Update: {
          created_at?: string
          filename?: string | null
          id?: string
          process_id?: string | null
          transcription_s3_key?: string | null
          transcription_text?: string | null
          transcription_url?: string | null
          user_id?: string
          video_s3_key?: string
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "process_videos_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "processes"
            referencedColumns: ["id"]
          },
        ]
      }
      processes: {
        Row: {
          adhoc_monthly: string | null
          approver: string | null
          area: string
          automation: Json | null
          avg_time: string | null
          business_unit: string | null
          created_at: string
          data_integrity: Json | null
          description: string | null
          doc_last_review: string | null
          doc_next_review: string | null
          documentation_status: string | null
          execution_effort: Json | null
          executor: string | null
          frequency: string | null
          governance: Json | null
          has_documentation: boolean
          id: string
          is_favorite: boolean | null
          is_template: boolean | null
          kpis: string | null
          l1: string | null
          l2: string | null
          l3: string | null
          l4: string | null
          last_review: string | null
          name: string
          owner: string | null
          regulations: string | null
          sla: string | null
          support_team: string | null
          systems: string[] | null
          updated_at: string
          use_cases: Json | null
          user_id: string
          version: string | null
        }
        Insert: {
          adhoc_monthly?: string | null
          approver?: string | null
          area?: string
          automation?: Json | null
          avg_time?: string | null
          business_unit?: string | null
          created_at?: string
          data_integrity?: Json | null
          description?: string | null
          doc_last_review?: string | null
          doc_next_review?: string | null
          documentation_status?: string | null
          execution_effort?: Json | null
          executor?: string | null
          frequency?: string | null
          governance?: Json | null
          has_documentation?: boolean
          id?: string
          is_favorite?: boolean | null
          is_template?: boolean | null
          kpis?: string | null
          l1?: string | null
          l2?: string | null
          l3?: string | null
          l4?: string | null
          last_review?: string | null
          name: string
          owner?: string | null
          regulations?: string | null
          sla?: string | null
          support_team?: string | null
          systems?: string[] | null
          updated_at?: string
          use_cases?: Json | null
          user_id: string
          version?: string | null
        }
        Update: {
          adhoc_monthly?: string | null
          approver?: string | null
          area?: string
          automation?: Json | null
          avg_time?: string | null
          business_unit?: string | null
          created_at?: string
          data_integrity?: Json | null
          description?: string | null
          doc_last_review?: string | null
          doc_next_review?: string | null
          documentation_status?: string | null
          execution_effort?: Json | null
          executor?: string | null
          frequency?: string | null
          governance?: Json | null
          has_documentation?: boolean
          id?: string
          is_favorite?: boolean | null
          is_template?: boolean | null
          kpis?: string | null
          l1?: string | null
          l2?: string | null
          l3?: string | null
          l4?: string | null
          last_review?: string | null
          name?: string
          owner?: string | null
          regulations?: string | null
          sla?: string | null
          support_team?: string | null
          systems?: string[] | null
          updated_at?: string
          use_cases?: Json | null
          user_id?: string
          version?: string | null
        }
        Relationships: []
      }
      saved_use_cases: {
        Row: {
          created_at: string
          id: string
          l1_id: string | null
          l1_name: string | null
          l2_name: string | null
          l3_name: string | null
          l4_name: string | null
          use_case_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          l1_id?: string | null
          l1_name?: string | null
          l2_name?: string | null
          l3_name?: string | null
          l4_name?: string | null
          use_case_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          l1_id?: string | null
          l1_name?: string | null
          l2_name?: string | null
          l3_name?: string | null
          l4_name?: string | null
          use_case_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_use_cases_use_case_id_fkey"
            columns: ["use_case_id"]
            isOneToOne: false
            referencedRelation: "use_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      sop_documents: {
        Row: {
          area: string | null
          code: string | null
          created_at: string
          id: string
          metadata: Json | null
          objective: string | null
          process_id: string
          status: string | null
          steps: Json | null
          title: string
          updated_at: string
          user_id: string
          version: string | null
        }
        Insert: {
          area?: string | null
          code?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          objective?: string | null
          process_id: string
          status?: string | null
          steps?: Json | null
          title: string
          updated_at?: string
          user_id: string
          version?: string | null
        }
        Update: {
          area?: string | null
          code?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          objective?: string | null
          process_id?: string
          status?: string | null
          steps?: Json | null
          title?: string
          updated_at?: string
          user_id?: string
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sop_documents_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "processes"
            referencedColumns: ["id"]
          },
        ]
      }
      use_case_sessions: {
        Row: {
          area: string
          assessment_problems: string | null
          company_name: string
          created_at: string
          id: string
          observations: string | null
          process_names: string[]
          source_ids: string[]
          source_level: string
          source_names: string[]
          user_id: string
        }
        Insert: {
          area: string
          assessment_problems?: string | null
          company_name: string
          created_at?: string
          id?: string
          observations?: string | null
          process_names?: string[]
          source_ids?: string[]
          source_level: string
          source_names?: string[]
          user_id: string
        }
        Update: {
          area?: string
          assessment_problems?: string | null
          company_name?: string
          created_at?: string
          id?: string
          observations?: string | null
          process_names?: string[]
          source_ids?: string[]
          source_level?: string
          source_names?: string[]
          user_id?: string
        }
        Relationships: []
      }
      use_cases: {
        Row: {
          benchmarking: Json | null
          business_case: Json | null
          category: string | null
          created_at: string
          description: string | null
          effort: string | null
          id: string
          impact: string | null
          impacted_processes_count: number | null
          key_indicators: string[] | null
          key_technologies: string[] | null
          potential_gains: Json | null
          screen_match: Json | null
          session_id: string
          source_reference: string | null
          status: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          benchmarking?: Json | null
          business_case?: Json | null
          category?: string | null
          created_at?: string
          description?: string | null
          effort?: string | null
          id?: string
          impact?: string | null
          impacted_processes_count?: number | null
          key_indicators?: string[] | null
          key_technologies?: string[] | null
          potential_gains?: Json | null
          screen_match?: Json | null
          session_id: string
          source_reference?: string | null
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          benchmarking?: Json | null
          business_case?: Json | null
          category?: string | null
          created_at?: string
          description?: string | null
          effort?: string | null
          id?: string
          impact?: string | null
          impacted_processes_count?: number | null
          key_indicators?: string[] | null
          key_technologies?: string[] | null
          potential_gains?: Json | null
          screen_match?: Json | null
          session_id?: string
          source_reference?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "use_cases_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "use_case_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
