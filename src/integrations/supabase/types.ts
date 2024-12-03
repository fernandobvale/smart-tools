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
        Args: {
          video_path: string
        }
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
