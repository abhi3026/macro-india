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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ai_agent_runs: {
        Row: {
          details: Json
          drafts_created: number
          error: string | null
          finished_at: string | null
          id: string
          model: string | null
          started_at: string
          status: string
          topics_planned: number
          trigger: string
        }
        Insert: {
          details?: Json
          drafts_created?: number
          error?: string | null
          finished_at?: string | null
          id?: string
          model?: string | null
          started_at?: string
          status?: string
          topics_planned?: number
          trigger?: string
        }
        Update: {
          details?: Json
          drafts_created?: number
          error?: string | null
          finished_at?: string | null
          id?: string
          model?: string | null
          started_at?: string
          status?: string
          topics_planned?: number
          trigger?: string
        }
        Relationships: []
      }
      countries: {
        Row: {
          code: string
          created_at: string
          display_order: number
          flag_emoji: string | null
          flag_url: string | null
          name: string
          show_on_homepage: boolean
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          display_order?: number
          flag_emoji?: string | null
          flag_url?: string | null
          name: string
          show_on_homepage?: boolean
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          display_order?: number
          flag_emoji?: string | null
          flag_url?: string | null
          name?: string
          show_on_homepage?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      country_indicators: {
        Row: {
          change_value: number | null
          country_code: string
          created_at: string
          current_value: number | null
          id: string
          indicator_key: string
          last_updated: string
          notes: string | null
          period_label: string | null
          previous_value: number | null
          sentiment: string
          source: string | null
          source_url: string | null
          status: Database["public"]["Enums"]["content_status"]
          trend: string | null
          updated_at: string
        }
        Insert: {
          change_value?: number | null
          country_code: string
          created_at?: string
          current_value?: number | null
          id?: string
          indicator_key: string
          last_updated?: string
          notes?: string | null
          period_label?: string | null
          previous_value?: number | null
          sentiment?: string
          source?: string | null
          source_url?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          trend?: string | null
          updated_at?: string
        }
        Update: {
          change_value?: number | null
          country_code?: string
          created_at?: string
          current_value?: number | null
          id?: string
          indicator_key?: string
          last_updated?: string
          notes?: string | null
          period_label?: string | null
          previous_value?: number | null
          sentiment?: string
          source?: string | null
          source_url?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          trend?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "country_indicators_country_code_fkey"
            columns: ["country_code"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "country_indicators_indicator_key_fkey"
            columns: ["indicator_key"]
            isOneToOne: false
            referencedRelation: "indicator_definitions"
            referencedColumns: ["key"]
          },
        ]
      }
      economic_indicators: {
        Row: {
          created_at: string
          current_value: string | null
          id: string
          indicator: string
          last_updated: string
          notes: string | null
          previous_value: string | null
          serial: number
          source: string | null
          source_url: string | null
          status: Database["public"]["Enums"]["content_status"]
          unit: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_value?: string | null
          id?: string
          indicator: string
          last_updated?: string
          notes?: string | null
          previous_value?: string | null
          serial?: number
          source?: string | null
          source_url?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          unit?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_value?: string | null
          id?: string
          indicator?: string
          last_updated?: string
          notes?: string | null
          previous_value?: string | null
          serial?: number
          source?: string | null
          source_url?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          unit?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      education_categories: {
        Row: {
          created_at: string
          display_order: number
          intro_markdown: string
          seo_description: string | null
          seo_title: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          intro_markdown?: string
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          intro_markdown?: string
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      educational_posts: {
        Row: {
          author_id: string | null
          author_name: string | null
          body: string | null
          canonical_url: string | null
          category: string | null
          created_at: string
          excerpt: string | null
          id: string
          image: string | null
          og_image: string | null
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          serial: number
          show_on_homepage: boolean
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          author_name?: string | null
          body?: string | null
          canonical_url?: string | null
          category?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          image?: string | null
          og_image?: string | null
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          serial?: number
          show_on_homepage?: boolean
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          author_name?: string | null
          body?: string | null
          canonical_url?: string | null
          category?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          image?: string | null
          og_image?: string | null
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          serial?: number
          show_on_homepage?: boolean
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      indicator_definitions: {
        Row: {
          created_at: string
          display_order: number
          higher_is_better: boolean | null
          key: string
          label: string
          show_on_dashboard: boolean
          show_on_homepage: boolean
          unit: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          higher_is_better?: boolean | null
          key: string
          label: string
          show_on_dashboard?: boolean
          show_on_homepage?: boolean
          unit?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          higher_is_better?: boolean | null
          key?: string
          label?: string
          show_on_dashboard?: boolean
          show_on_homepage?: boolean
          unit?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      interest_rates: {
        Row: {
          bond_yield: number | null
          bond_yield_change: number | null
          bond_yield_sentiment: string
          bond_yield_trend: string | null
          bond_yield_updated: string | null
          country_code: string
          created_at: string
          id: string
          interest_rate: number | null
          interest_rate_change: number | null
          interest_rate_sentiment: string
          interest_rate_trend: string | null
          interest_rate_updated: string | null
          status: Database["public"]["Enums"]["content_status"]
          updated_at: string
        }
        Insert: {
          bond_yield?: number | null
          bond_yield_change?: number | null
          bond_yield_sentiment?: string
          bond_yield_trend?: string | null
          bond_yield_updated?: string | null
          country_code: string
          created_at?: string
          id?: string
          interest_rate?: number | null
          interest_rate_change?: number | null
          interest_rate_sentiment?: string
          interest_rate_trend?: string | null
          interest_rate_updated?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Update: {
          bond_yield?: number | null
          bond_yield_change?: number | null
          bond_yield_sentiment?: string
          bond_yield_trend?: string | null
          bond_yield_updated?: string | null
          country_code?: string
          created_at?: string
          id?: string
          interest_rate?: number | null
          interest_rate_change?: number | null
          interest_rate_sentiment?: string
          interest_rate_trend?: string | null
          interest_rate_updated?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Relationships: []
      }
      invitations: {
        Row: {
          accepted_at: string | null
          created_at: string
          email: string
          id: string
          invited_by: string | null
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          email: string
          id?: string
          invited_by?: string | null
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          email?: string
          id?: string
          invited_by?: string | null
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      macro_agent_runs: {
        Row: {
          created_at: string
          details: Json | null
          error: string | null
          finished_at: string | null
          id: string
          rows_updated: number
          started_at: string
          status: string
          trigger: string
        }
        Insert: {
          created_at?: string
          details?: Json | null
          error?: string | null
          finished_at?: string | null
          id?: string
          rows_updated?: number
          started_at?: string
          status?: string
          trigger?: string
        }
        Update: {
          created_at?: string
          details?: Json | null
          error?: string | null
          finished_at?: string | null
          id?: string
          rows_updated?: number
          started_at?: string
          status?: string
          trigger?: string
        }
        Relationships: []
      }
      macro_snapshot: {
        Row: {
          context: string
          created_at: string
          delta: string
          display_order: number
          id: string
          label: string
          sentiment: string
          status: Database["public"]["Enums"]["content_status"]
          trend: string
          updated_at: string
          value: string
        }
        Insert: {
          context?: string
          created_at?: string
          delta?: string
          display_order?: number
          id?: string
          label: string
          sentiment?: string
          status?: Database["public"]["Enums"]["content_status"]
          trend?: string
          updated_at?: string
          value?: string
        }
        Update: {
          context?: string
          created_at?: string
          delta?: string
          display_order?: number
          id?: string
          label?: string
          sentiment?: string
          status?: Database["public"]["Enums"]["content_status"]
          trend?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email: string
          id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string
          id?: string
        }
        Relationships: []
      }
      research_articles: {
        Row: {
          author_id: string | null
          author_name: string | null
          body: string | null
          canonical_url: string | null
          category: string | null
          created_at: string
          excerpt: string | null
          featured: boolean
          featured_image: string | null
          id: string
          og_image: string | null
          publish_date: string | null
          published_at: string | null
          references_list: string[]
          seo_description: string | null
          seo_title: string | null
          serial: number
          show_on_homepage: boolean
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          author_name?: string | null
          body?: string | null
          canonical_url?: string | null
          category?: string | null
          created_at?: string
          excerpt?: string | null
          featured?: boolean
          featured_image?: string | null
          id?: string
          og_image?: string | null
          publish_date?: string | null
          published_at?: string | null
          references_list?: string[]
          seo_description?: string | null
          seo_title?: string | null
          serial?: number
          show_on_homepage?: boolean
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          author_name?: string | null
          body?: string | null
          canonical_url?: string | null
          category?: string | null
          created_at?: string
          excerpt?: string | null
          featured?: boolean
          featured_image?: string | null
          id?: string
          og_image?: string | null
          publish_date?: string | null
          published_at?: string | null
          references_list?: string[]
          seo_description?: string | null
          seo_title?: string | null
          serial?: number
          show_on_homepage?: boolean
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
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
      weekly_reads: {
        Row: {
          author_id: string | null
          body: string | null
          created_at: string
          heading: string
          id: string
          image: string | null
          link_url: string | null
          published_at: string | null
          section: Database["public"]["Enums"]["weekly_section"]
          serial: number
          status: Database["public"]["Enums"]["content_status"]
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          body?: string | null
          created_at?: string
          heading: string
          id?: string
          image?: string | null
          link_url?: string | null
          published_at?: string | null
          section: Database["public"]["Enums"]["weekly_section"]
          serial?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          body?: string | null
          created_at?: string
          heading?: string
          id?: string
          image?: string | null
          link_url?: string | null
          published_at?: string | null
          section?: Database["public"]["Enums"]["weekly_section"]
          serial?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_manage: { Args: { _user_id: string }; Returns: boolean }
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "editor" | "analyst" | "contributor"
      content_status:
        | "draft"
        | "pending"
        | "approved"
        | "published"
        | "declined"
      weekly_section: "Policy" | "Market" | "Risk"
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
      app_role: ["admin", "editor", "analyst", "contributor"],
      content_status: ["draft", "pending", "approved", "published", "declined"],
      weekly_section: ["Policy", "Market", "Risk"],
    },
  },
} as const
