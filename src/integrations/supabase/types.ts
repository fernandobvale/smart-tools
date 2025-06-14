export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
        }
        Insert: {
          cpf: string
          created_at?: string
          id?: string
          nome: string
          saldo?: string | null
        }
        Update: {
          cpf?: string
          created_at?: string
          id?: string
          nome?: string
          saldo?: string | null
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
          valor?: number
        }
        Relationships: []
      }
      editores: {
        Row: {
          created_at: string
          id: string
          nome: string
        }
        Insert: {
          created_at?: string
          id?: string
          nome: string
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
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
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
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
        }
        Insert: {
          bank_name: string
          cpf: string
          created_at?: string
          full_name: string
          id?: string
          pix_key: string
        }
        Update: {
          bank_name?: string
          cpf?: string
          created_at?: string
          full_name?: string
          id?: string
          pix_key?: string
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      convert_video_to_audio: {
        Args: { video_path: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
