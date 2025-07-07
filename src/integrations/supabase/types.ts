export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ai_chat_messages: {
        Row: {
          created_at: string
          id: string
          is_user: boolean
          message: string
          session_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_user?: boolean
          message: string
          session_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_user?: boolean
          message?: string
          session_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          created_at: string
          id: string
          key_name: string
          key_value: string
          last_updated: string
        }
        Insert: {
          created_at?: string
          id?: string
          key_name: string
          key_value: string
          last_updated?: string
        }
        Update: {
          created_at?: string
          id?: string
          key_name?: string
          key_value?: string
          last_updated?: string
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          budget: number | null
          created_at: string
          id: string
          meta_data: Json | null
          name: string
          platform: string
          product_id: string
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          budget?: number | null
          created_at?: string
          id?: string
          meta_data?: Json | null
          name: string
          platform: string
          product_id: string
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          budget?: number | null
          created_at?: string
          id?: string
          meta_data?: Json | null
          name?: string
          platform?: string
          product_id?: string
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_connections: {
        Row: {
          connected: boolean
          created_at: string
          credentials: Json
          id: string
          last_updated: string
          platform: string
          user_id: string
        }
        Insert: {
          connected?: boolean
          created_at?: string
          credentials?: Json
          id?: string
          last_updated?: string
          platform: string
          user_id: string
        }
        Update: {
          connected?: boolean
          created_at?: string
          credentials?: Json
          id?: string
          last_updated?: string
          platform?: string
          user_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          ad_copy: string | null
          created_at: string
          deleted: boolean | null
          description: string
          id: string
          image: string | null
          metrics: Json | null
          name: string
          platforms: string[] | null
          price: number | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ad_copy?: string | null
          created_at?: string
          deleted?: boolean | null
          description: string
          id?: string
          image?: string | null
          metrics?: Json | null
          name: string
          platforms?: string[] | null
          price?: number | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ad_copy?: string | null
          created_at?: string
          deleted?: boolean | null
          description?: string
          id?: string
          image?: string | null
          metrics?: Json | null
          name?: string
          platforms?: string[] | null
          price?: number | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sales_letters: {
        Row: {
          content: string
          created_at: string
          id: string
          product_id: string
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          product_id: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          product_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_letters_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          company: string | null
          created_at: string
          full_name: string | null
          job_title: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          full_name?: string | null
          job_title?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company?: string | null
          created_at?: string
          full_name?: string | null
          job_title?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_recommendations: {
        Row: {
          created_at: string
          id: string
          recommendation_data: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          recommendation_data: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          recommendation_data?: Json
          updated_at?: string
          user_id?: string
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
