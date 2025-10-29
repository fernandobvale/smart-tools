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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      _test_connection: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      bitcoin_transactions: {
        Row: {
          amount_brl: number
          amount_btc: number
          created_at: string
          id: string
          notes: string | null
          price_per_btc: number
          transaction_date: string
          transaction_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_brl: number
          amount_btc: number
          created_at?: string
          id?: string
          notes?: string | null
          price_per_btc: number
          transaction_date?: string
          transaction_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_brl?: number
          amount_btc?: number
          created_at?: string
          id?: string
          notes?: string | null
          price_per_btc?: number
          transaction_date?: string
          transaction_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          bairro: string
          canal_contato: string
          cep: string
          cidade_estado: string
          codigo_rastreio: string | null
          complemento: string | null
          created_at: string
          dados_confirmados: boolean
          email_aluno: string
          endereco: string
          id: string
          nome_aluno: string
          numero_pedido: string
          observacoes: string | null
          quantidade: number
          site_referencia: string
          status_envio: string
          status_pagamento: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          bairro: string
          canal_contato: string
          cep: string
          cidade_estado: string
          codigo_rastreio?: string | null
          complemento?: string | null
          created_at?: string
          dados_confirmados?: boolean
          email_aluno: string
          endereco: string
          id?: string
          nome_aluno: string
          numero_pedido: string
          observacoes?: string | null
          quantidade?: number
          site_referencia: string
          status_envio: string
          status_pagamento: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          bairro?: string
          canal_contato?: string
          cep?: string
          cidade_estado?: string
          codigo_rastreio?: string | null
          complemento?: string | null
          created_at?: string
          dados_confirmados?: boolean
          email_aluno?: string
          endereco?: string
          id?: string
          nome_aluno?: string
          numero_pedido?: string
          observacoes?: string | null
          quantidade?: number
          site_referencia?: string
          status_envio?: string
          status_pagamento?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      course_complaints: {
        Row: {
          action_taken: string | null
          analyst: string | null
          complaint: string
          complaint_date: string
          course: string
          created_at: string
          feedback: string | null
          id: string
          school: string
          status: string
          updated_at: string
        }
        Insert: {
          action_taken?: string | null
          analyst?: string | null
          complaint: string
          complaint_date: string
          course: string
          created_at?: string
          feedback?: string | null
          id?: string
          school: string
          status?: string
          updated_at?: string
        }
        Update: {
          action_taken?: string | null
          analyst?: string | null
          complaint?: string
          complaint_date?: string
          course?: string
          created_at?: string
          feedback?: string | null
          id?: string
          school?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      course_suggestions: {
        Row: {
          attendant: string
          course_created: boolean
          created_at: string
          id: string
          internet_searches: string
          observations: string | null
          school: string
          suggested_course: string
          suggestion_date: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          attendant: string
          course_created?: boolean
          created_at?: string
          id?: string
          internet_searches: string
          observations?: string | null
          school: string
          suggested_course: string
          suggestion_date: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          attendant?: string
          course_created?: boolean
          created_at?: string
          id?: string
          internet_searches?: string
          observations?: string | null
          school?: string
          suggested_course?: string
          suggestion_date?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      cpf_searches: {
        Row: {
          cpf: string
          created_at: string
          id: string
          nome: string
          saldo: string | null
          user_id: string | null
        }
        Insert: {
          cpf: string
          created_at?: string
          id?: string
          nome: string
          saldo?: string | null
          user_id?: string | null
        }
        Update: {
          cpf?: string
          created_at?: string
          id?: string
          nome?: string
          saldo?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      cursos: {
        Row: {
          created_at: string
          data_entrega: string
          data_pagamento: string | null
          id: string
          nome_curso: string
          nome_editor: string
          numero_aulas: number
          status_pagamento: string
          updated_at: string
          user_id: string | null
          valor: number
        }
        Insert: {
          created_at?: string
          data_entrega: string
          data_pagamento?: string | null
          id?: string
          nome_curso: string
          nome_editor: string
          numero_aulas: number
          status_pagamento: string
          updated_at?: string
          user_id?: string | null
          valor: number
        }
        Update: {
          created_at?: string
          data_entrega?: string
          data_pagamento?: string | null
          id?: string
          nome_curso?: string
          nome_editor?: string
          numero_aulas?: number
          status_pagamento?: string
          updated_at?: string
          user_id?: string | null
          valor?: number
        }
        Relationships: []
      }
      editores: {
        Row: {
          created_at: string
          id: string
          nome: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          nome: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
          user_id?: string | null
        }
        Relationships: []
      }
      new_courses: {
        Row: {
          created_at: string
          curso: string
          id: string
          professor: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          curso: string
          id?: string
          professor: string
          status: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          curso?: string
          id?: string
          professor?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      notes: {
        Row: {
          content: string
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      payees: {
        Row: {
          bank_name: string
          cpf: string
          created_at: string
          full_name: string
          id: string
          pix_key: string
          user_id: string | null
        }
        Insert: {
          bank_name: string
          cpf: string
          created_at?: string
          full_name: string
          id?: string
          pix_key: string
          user_id?: string | null
        }
        Update: {
          bank_name?: string
          cpf?: string
          created_at?: string
          full_name?: string
          id?: string
          pix_key?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      prompts: {
        Row: {
          area_link: string
          course_1: string
          course_1_link: string
          course_2: string
          course_2_link: string
          course_area: string
          course_content: string
          course_name: string
          created_at: string
          generated_prompt: string
          id: string
          user_id: string | null
          workload: string
        }
        Insert: {
          area_link: string
          course_1: string
          course_1_link: string
          course_2: string
          course_2_link: string
          course_area: string
          course_content: string
          course_name: string
          created_at?: string
          generated_prompt: string
          id?: string
          user_id?: string | null
          workload: string
        }
        Update: {
          area_link?: string
          course_1?: string
          course_1_link?: string
          course_2?: string
          course_2_link?: string
          course_area?: string
          course_content?: string
          course_name?: string
          created_at?: string
          generated_prompt?: string
          id?: string
          user_id?: string | null
          workload?: string
        }
        Relationships: []
      }
      supabase_projects: {
        Row: {
          anon_key: string
          created_at: string
          dashboard_url: string
          db_host: string
          db_name: string
          db_password: string
          db_port: number
          db_user: string
          id: string
          project_id: string
          project_name: string
          service_role_key: string
          supabase_url: string
          updated_at: string
          user_email: string
          user_id: string
          user_password: string | null
          user_password_hash: string | null
        }
        Insert: {
          anon_key: string
          created_at?: string
          dashboard_url: string
          db_host: string
          db_name?: string
          db_password: string
          db_port?: number
          db_user: string
          id?: string
          project_id: string
          project_name: string
          service_role_key: string
          supabase_url: string
          updated_at?: string
          user_email: string
          user_id: string
          user_password?: string | null
          user_password_hash?: string | null
        }
        Update: {
          anon_key?: string
          created_at?: string
          dashboard_url?: string
          db_host?: string
          db_name?: string
          db_password?: string
          db_port?: number
          db_user?: string
          id?: string
          project_id?: string
          project_name?: string
          service_role_key?: string
          supabase_url?: string
          updated_at?: string
          user_email?: string
          user_id?: string
          user_password?: string | null
          user_password_hash?: string | null
        }
        Relationships: []
      }
      teacher_applications: {
        Row: {
          academic_background: string
          created_at: string
          email: string
          full_name: string
          id: string
          motivation: string
          privacy_accepted: boolean
          teaching_experience: string
          video_experience: string
          whatsapp: string
        }
        Insert: {
          academic_background: string
          created_at?: string
          email: string
          full_name: string
          id?: string
          motivation: string
          privacy_accepted?: boolean
          teaching_experience: string
          video_experience: string
          whatsapp: string
        }
        Update: {
          academic_background?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          motivation?: string
          privacy_accepted?: boolean
          teaching_experience?: string
          video_experience?: string
          whatsapp?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      convert_video_to_audio: { Args: { video_path: string }; Returns: string }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
