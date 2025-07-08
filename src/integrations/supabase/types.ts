export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      arquivos: {
        Row: {
          aquisicao_at: string | null
          categoria: string | null
          created_at: string | null
          digitalizado: boolean | null
          download_url: string | null
          hash: string | null
          id: string
          instituicao: string | null
          nome: string | null
          obra: string | null
          observacoes: string | null
          partitura_id: string | null
          performance_id: string | null
          tamanho: string | null
          tipo: string | null
          updated_at: string | null
          url: string | null
          usuario_id: string | null
        }
        Insert: {
          aquisicao_at?: string | null
          categoria?: string | null
          created_at?: string | null
          digitalizado?: boolean | null
          download_url?: string | null
          hash?: string | null
          id?: string
          instituicao?: string | null
          nome?: string | null
          obra?: string | null
          observacoes?: string | null
          partitura_id?: string | null
          performance_id?: string | null
          tamanho?: string | null
          tipo?: string | null
          updated_at?: string | null
          url?: string | null
          usuario_id?: string | null
        }
        Update: {
          aquisicao_at?: string | null
          categoria?: string | null
          created_at?: string | null
          digitalizado?: boolean | null
          download_url?: string | null
          hash?: string | null
          id?: string
          instituicao?: string | null
          nome?: string | null
          obra?: string | null
          observacoes?: string | null
          partitura_id?: string | null
          performance_id?: string | null
          tamanho?: string | null
          tipo?: string | null
          updated_at?: string | null
          url?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "arquivos_partitura_id_fkey"
            columns: ["partitura_id"]
            isOneToOne: false
            referencedRelation: "partituras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arquivos_performance_id_fkey"
            columns: ["performance_id"]
            isOneToOne: false
            referencedRelation: "performances"
            referencedColumns: ["id"]
          },
        ]
      }
      instituicoes: {
        Row: {
          created_at: string | null
          id: string
          nome: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          nome: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          nome?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      partituras: {
        Row: {
          ano_aquisicao: number | null
          ano_edicao: number | null
          compositor: string | null
          created_at: string | null
          digitalizado: boolean | null
          edicao: string | null
          genero: string | null
          id: string
          instituicao: string | null
          instrumentos: string | null
          numero_armario: string | null
          numero_pasta: string | null
          numero_prateleira: string | null
          observacoes: string | null
          pdf_urls: Json | null
          setor: string | null
          titulo: string | null
          tonalidade: string | null
          updated_at: string | null
        }
        Insert: {
          ano_aquisicao?: number | null
          ano_edicao?: number | null
          compositor?: string | null
          created_at?: string | null
          digitalizado?: boolean | null
          edicao?: string | null
          genero?: string | null
          id?: string
          instituicao?: string | null
          instrumentos?: string | null
          numero_armario?: string | null
          numero_pasta?: string | null
          numero_prateleira?: string | null
          observacoes?: string | null
          pdf_urls?: Json | null
          setor?: string | null
          titulo?: string | null
          tonalidade?: string | null
          updated_at?: string | null
        }
        Update: {
          ano_aquisicao?: number | null
          ano_edicao?: number | null
          compositor?: string | null
          created_at?: string | null
          digitalizado?: boolean | null
          edicao?: string | null
          genero?: string | null
          id?: string
          instituicao?: string | null
          instrumentos?: string | null
          numero_armario?: string | null
          numero_pasta?: string | null
          numero_prateleira?: string | null
          observacoes?: string | null
          pdf_urls?: Json | null
          setor?: string | null
          titulo?: string | null
          tonalidade?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      performances: {
        Row: {
          created_at: string | null
          data: string | null
          horario: string | null
          id: string
          interpretes: string | null
          local: string | null
          maestros: string | null
          partitura_id: string | null
          programa_anotado: string | null
          release: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data?: string | null
          horario?: string | null
          id?: string
          interpretes?: string | null
          local?: string | null
          maestros?: string | null
          partitura_id?: string | null
          programa_anotado?: string | null
          release?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data?: string | null
          horario?: string | null
          id?: string
          interpretes?: string | null
          local?: string | null
          maestros?: string | null
          partitura_id?: string | null
          programa_anotado?: string | null
          release?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "performances_partitura_id_fkey"
            columns: ["partitura_id"]
            isOneToOne: false
            referencedRelation: "partituras"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          funcao: string | null
          id: string
          name: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          funcao?: string | null
          id: string
          name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          funcao?: string | null
          id?: string
          name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      setores: {
        Row: {
          created_at: string | null
          id: string
          nome: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          nome: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          nome?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      solicitacoes_download: {
        Row: {
          arquivo_id: string
          created_at: string
          id: string
          mensagem: string | null
          status: string | null
          updated_at: string
          usuario_responsavel: string
          usuario_solicitante: string
        }
        Insert: {
          arquivo_id: string
          created_at?: string
          id?: string
          mensagem?: string | null
          status?: string | null
          updated_at?: string
          usuario_responsavel: string
          usuario_solicitante: string
        }
        Update: {
          arquivo_id?: string
          created_at?: string
          id?: string
          mensagem?: string | null
          status?: string | null
          updated_at?: string
          usuario_responsavel?: string
          usuario_solicitante?: string
        }
        Relationships: [
          {
            foreignKeyName: "solicitacoes_download_arquivo_id_fkey"
            columns: ["arquivo_id"]
            isOneToOne: false
            referencedRelation: "arquivos"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          id: string
          instituicao: string | null
          instrumento: string | null
          name: string | null
          role: string | null
          role_user_role: string | null
          setor: string | null
          status: string | null
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          id: string
          instituicao?: string | null
          instrumento?: string | null
          name?: string | null
          role?: string | null
          role_user_role?: string | null
          setor?: string | null
          status?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          instituicao?: string | null
          instrumento?: string | null
          name?: string | null
          role?: string | null
          role_user_role?: string | null
          setor?: string | null
          status?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

