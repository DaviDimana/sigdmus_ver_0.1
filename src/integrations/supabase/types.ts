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
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
      arquivos: {
        Row: {
          arquivo_url: string | null
          categoria: string
          created_at: string
          downloads: number | null
          id: string
          nome: string
          obra: string
          partitura_id: string | null
          performance_id: string | null
          restricao_download: boolean
          tamanho: number
          tipo: string
          updated_at: string
          usuario_upload: string | null
        }
        Insert: {
          arquivo_url?: string | null
          categoria: string
          created_at?: string
          downloads?: number | null
          id?: string
          nome: string
          obra: string
          partitura_id?: string | null
          performance_id?: string | null
          restricao_download?: boolean
          tamanho: number
          tipo: string
          updated_at?: string
          usuario_upload?: string | null
        }
        Update: {
          arquivo_url?: string | null
          categoria?: string
          created_at?: string
          downloads?: number | null
          id?: string
          nome?: string
          obra?: string
          partitura_id?: string | null
          performance_id?: string | null
          restricao_download?: boolean
          tamanho?: number
          tipo?: string
          updated_at?: string
          usuario_upload?: string | null
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
          created_at: string
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      Partitura: {
        Row: {
          anoAquisicao: number | null
          anoEdicao: number | null
          arquivoUrl: string | null
          compositor: string
          createdAt: string
          digitalizado: boolean
          edicao: string | null
          generoForma: string | null
          id: number
          instrumentacao: string
          numArmario: string | null
          numPasta: string | null
          numPrateleira: string | null
          observacoes: string | null
          setor: Database["public"]["Enums"]["Setor"]
          titulo: string
          tonalidade: string | null
          updatedAt: string
        }
        Insert: {
          anoAquisicao?: number | null
          anoEdicao?: number | null
          arquivoUrl?: string | null
          compositor: string
          createdAt?: string
          digitalizado?: boolean
          edicao?: string | null
          generoForma?: string | null
          id?: number
          instrumentacao: string
          numArmario?: string | null
          numPasta?: string | null
          numPrateleira?: string | null
          observacoes?: string | null
          setor: Database["public"]["Enums"]["Setor"]
          titulo: string
          tonalidade?: string | null
          updatedAt: string
        }
        Update: {
          anoAquisicao?: number | null
          anoEdicao?: number | null
          arquivoUrl?: string | null
          compositor?: string
          createdAt?: string
          digitalizado?: boolean
          edicao?: string | null
          generoForma?: string | null
          id?: number
          instrumentacao?: string
          numArmario?: string | null
          numPasta?: string | null
          numPrateleira?: string | null
          observacoes?: string | null
          setor?: Database["public"]["Enums"]["Setor"]
          titulo?: string
          tonalidade?: string | null
          updatedAt?: string
        }
        Relationships: []
      }
      partituras: {
        Row: {
          ano_edicao: string | null
          compositor: string
          created_at: string
          digitalizado: boolean
          edicao: string | null
          genero: string | null
          id: string
          instrumentacao: string
          numero_armario: string | null
          numero_pasta: string | null
          numero_prateleira: string | null
          setor: string
          titulo: string
          tonalidade: string | null
          updated_at: string
        }
        Insert: {
          ano_edicao?: string | null
          compositor: string
          created_at?: string
          digitalizado?: boolean
          edicao?: string | null
          genero?: string | null
          id?: string
          instrumentacao: string
          numero_armario?: string | null
          numero_pasta?: string | null
          numero_prateleira?: string | null
          setor: string
          titulo: string
          tonalidade?: string | null
          updated_at?: string
        }
        Update: {
          ano_edicao?: string | null
          compositor?: string
          created_at?: string
          digitalizado?: boolean
          edicao?: string | null
          genero?: string | null
          id?: string
          instrumentacao?: string
          numero_armario?: string | null
          numero_pasta?: string | null
          numero_prateleira?: string | null
          setor?: string
          titulo?: string
          tonalidade?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      performances: {
        Row: {
          created_at: string
          data: string
          horario: string
          id: string
          interpretes: string
          local: string
          maestros: string
          nome_compositor: string
          release: string | null
          titulo_obra: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data: string
          horario: string
          id?: string
          interpretes: string
          local: string
          maestros: string
          nome_compositor: string
          release?: string | null
          titulo_obra: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data?: string
          horario?: string
          id?: string
          interpretes?: string
          local?: string
          maestros?: string
          nome_compositor?: string
          release?: string | null
          titulo_obra?: string
          updated_at?: string
        }
        Relationships: []
      }
      setores: {
        Row: {
          created_at: string
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      solicitacoes_cadastro: {
        Row: {
          created_at: string
          email: string
          funcao: Database["public"]["Enums"]["funcao_usuario"]
          id: string
          instituicao: string
          instrumento: Database["public"]["Enums"]["instrumento_tipo"] | null
          nome: string
          setor: string
          status: string
          telefone: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          funcao: Database["public"]["Enums"]["funcao_usuario"]
          id?: string
          instituicao: string
          instrumento?: Database["public"]["Enums"]["instrumento_tipo"] | null
          nome: string
          setor: string
          status?: string
          telefone: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          funcao?: Database["public"]["Enums"]["funcao_usuario"]
          id?: string
          instituicao?: string
          instrumento?: Database["public"]["Enums"]["instrumento_tipo"] | null
          nome?: string
          setor?: string
          status?: string
          telefone?: string
          updated_at?: string
        }
        Relationships: []
      }
      solicitacoes_download: {
        Row: {
          arquivo_id: string
          created_at: string
          id: string
          mensagem: string | null
          status: string
          updated_at: string
          usuario_responsavel: string
          usuario_solicitante: string
        }
        Insert: {
          arquivo_id: string
          created_at?: string
          id?: string
          mensagem?: string | null
          status?: string
          updated_at?: string
          usuario_responsavel: string
          usuario_solicitante: string
        }
        Update: {
          arquivo_id?: string
          created_at?: string
          id?: string
          mensagem?: string | null
          status?: string
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
      User: {
        Row: {
          createdAt: string
          email: string
          id: number
          name: string
          password: string
          role: Database["public"]["Enums"]["Role"]
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          email: string
          id?: number
          name: string
          password: string
          role?: Database["public"]["Enums"]["Role"]
          updatedAt: string
        }
        Update: {
          createdAt?: string
          email?: string
          id?: number
          name?: string
          password?: string
          role?: Database["public"]["Enums"]["Role"]
          updatedAt?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string | null
          email: string
          funcao: Database["public"]["Enums"]["funcao_usuario"] | null
          id: string
          instituicao: string | null
          instrumento: Database["public"]["Enums"]["instrumento_type"] | null
          name: string
          role: Database["public"]["Enums"]["user_role"]
          setor: Database["public"]["Enums"]["Setor"] | null
          status: string | null
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          funcao?: Database["public"]["Enums"]["funcao_usuario"] | null
          id: string
          instituicao?: string | null
          instrumento?: Database["public"]["Enums"]["instrumento_type"] | null
          name: string
          role?: Database["public"]["Enums"]["user_role"]
          setor?: Database["public"]["Enums"]["Setor"] | null
          status?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          funcao?: Database["public"]["Enums"]["funcao_usuario"] | null
          id?: string
          instituicao?: string | null
          instrumento?: Database["public"]["Enums"]["instrumento_type"] | null
          name?: string
          role?: Database["public"]["Enums"]["user_role"]
          setor?: Database["public"]["Enums"]["Setor"] | null
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
      check_user_profile_access: {
        Args: { profile_user_id: string }
        Returns: boolean
      }
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
      }
      get_user_sector: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["Setor"]
      }
      has_role: {
        Args: { check_role: Database["public"]["Enums"]["user_role"] }
        Returns: boolean
      }
    }
    Enums: {
      funcao_usuario:
        | "MUSICO"
        | "ESTUDANTE"
        | "PROFESSOR"
        | "MAESTRO"
        | "ARQUIVISTA"
        | "GERENTE"
      instrumento_tipo:
        | "FLAUTA"
        | "OBOÉ"
        | "CLARINETE"
        | "FAGOTE"
        | "TROMPA"
        | "TROMPETE"
        | "TROMBONE"
        | "TUBA"
        | "VIOLINO_I"
        | "VIOLINO_II"
        | "VIOLA"
        | "VIOLONCELO"
        | "CONTRABAIXO"
        | "HARPA"
        | "PIANO"
        | "PERCUSSAO"
        | "SOPRANO"
        | "CONTRALTO"
        | "TENOR"
        | "BAIXO"
      instrumento_type:
        | "FLAUTA"
        | "OBOÉ"
        | "CLARINETE"
        | "FAGOTE"
        | "TROMPA"
        | "TROMPETE"
        | "TROMBONE"
        | "TUBA"
        | "VIOLINO_I"
        | "VIOLINO_II"
        | "VIOLA"
        | "VIOLONCELO"
        | "CONTRABAIXO"
        | "HARPA"
        | "PIANO"
        | "PERCUSSAO"
        | "SOPRANO"
        | "CONTRALTO"
        | "TENOR"
        | "BAIXO"
      Role: "ADMIN" | "SETOR" | "USER"
      Setor:
        | "ACERVO_OSUFBA"
        | "ACERVO_SCHWEBEL"
        | "ACERVO_PIERO"
        | "ACERVO_PINO"
        | "ACERVO_WIDMER"
        | "MEMORIAL_LINDENBERG_CARDOSO"
        | "COMPOSITORES_DA_BAHIA"
        | "ACERVO_OSBA"
      user_role:
        | "ADMIN"
        | "GERENTE"
        | "ARQUIVISTA"
        | "MUSICO"
        | "ESTUDANTE"
        | "PROFESSOR"
        | "MAESTRO"
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
    Enums: {
      funcao_usuario: [
        "MUSICO",
        "ESTUDANTE",
        "PROFESSOR",
        "MAESTRO",
        "ARQUIVISTA",
        "GERENTE",
      ],
      instrumento_tipo: [
        "FLAUTA",
        "OBOÉ",
        "CLARINETE",
        "FAGOTE",
        "TROMPA",
        "TROMPETE",
        "TROMBONE",
        "TUBA",
        "VIOLINO_I",
        "VIOLINO_II",
        "VIOLA",
        "VIOLONCELO",
        "CONTRABAIXO",
        "HARPA",
        "PIANO",
        "PERCUSSAO",
        "SOPRANO",
        "CONTRALTO",
        "TENOR",
        "BAIXO",
      ],
      instrumento_type: [
        "FLAUTA",
        "OBOÉ",
        "CLARINETE",
        "FAGOTE",
        "TROMPA",
        "TROMPETE",
        "TROMBONE",
        "TUBA",
        "VIOLINO_I",
        "VIOLINO_II",
        "VIOLA",
        "VIOLONCELO",
        "CONTRABAIXO",
        "HARPA",
        "PIANO",
        "PERCUSSAO",
        "SOPRANO",
        "CONTRALTO",
        "TENOR",
        "BAIXO",
      ],
      Role: ["ADMIN", "SETOR", "USER"],
      Setor: [
        "ACERVO_OSUFBA",
        "ACERVO_SCHWEBEL",
        "ACERVO_PIERO",
        "ACERVO_PINO",
        "ACERVO_WIDMER",
        "MEMORIAL_LINDENBERG_CARDOSO",
        "COMPOSITORES_DA_BAHIA",
        "ACERVO_OSBA",
      ],
      user_role: [
        "ADMIN",
        "GERENTE",
        "ARQUIVISTA",
        "MUSICO",
        "ESTUDANTE",
        "PROFESSOR",
        "MAESTRO",
      ],
    },
  },
} as const
