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
      acessolivros: {
        Row: {
          administrativo: string | null
          civilista: string | null
          constitucional: string | null
          created_at: string
          id: string
          penal: string | null
        }
        Insert: {
          administrativo?: string | null
          civilista?: string | null
          constitucional?: string | null
          created_at?: string
          id?: string
          penal?: string | null
        }
        Update: {
          administrativo?: string | null
          civilista?: string | null
          constitucional?: string | null
          created_at?: string
          id?: string
          penal?: string | null
        }
        Relationships: []
      }
      flashcards: {
        Row: {
          back_content: string
          category: string
          created_at: string
          front_content: string
          id: string
          last_reviewed: string | null
          next_review: string | null
          user_id: string | null
        }
        Insert: {
          back_content: string
          category: string
          created_at?: string
          front_content: string
          id?: string
          last_reviewed?: string | null
          next_review?: string | null
          user_id?: string | null
        }
        Update: {
          back_content?: string
          category?: string
          created_at?: string
          front_content?: string
          id?: string
          last_reviewed?: string | null
          next_review?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      juricast: {
        Row: {
          area: string | null
          descricao: string | null
          id: number
          imagem_miniatura: string | null
          tag: string | null
          titulo: string | null
          url_audio: string | null
        }
        Insert: {
          area?: string | null
          descricao?: string | null
          id?: number
          imagem_miniatura?: string | null
          tag?: string | null
          titulo?: string | null
          url_audio?: string | null
        }
        Update: {
          area?: string | null
          descricao?: string | null
          id?: number
          imagem_miniatura?: string | null
          tag?: string | null
          titulo?: string | null
          url_audio?: string | null
        }
        Relationships: []
      }
      library_items: {
        Row: {
          author: string | null
          category: string
          content_url: string | null
          created_at: string
          description: string | null
          id: string
          subcategory: string | null
          title: string
        }
        Insert: {
          author?: string | null
          category: string
          content_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          subcategory?: string | null
          title: string
        }
        Update: {
          author?: string | null
          category?: string
          content_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          subcategory?: string | null
          title?: string
        }
        Relationships: []
      }
      podcast_pro: {
        Row: {
          area: string | null
          descricao: string | null
          id: number
          imagem_miniatura: string | null
          sequencia: string | null
          tag: string | null
          tema: string | null
          titulo: string | null
          url_audio: string | null
        }
        Insert: {
          area?: string | null
          descricao?: string | null
          id?: number
          imagem_miniatura?: string | null
          sequencia?: string | null
          tag?: string | null
          tema?: string | null
          titulo?: string | null
          url_audio?: string | null
        }
        Update: {
          area?: string | null
          descricao?: string | null
          id?: number
          imagem_miniatura?: string | null
          sequencia?: string | null
          tag?: string | null
          tema?: string | null
          titulo?: string | null
          url_audio?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          user_type: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          user_type?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          user_type?: string | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          category: string
          content: string
          correct_answer: string
          created_at: string
          difficulty: string | null
          explanation: string | null
          id: string
          options: Json | null
        }
        Insert: {
          category: string
          content: string
          correct_answer: string
          created_at?: string
          difficulty?: string | null
          explanation?: string | null
          id?: string
          options?: Json | null
        }
        Update: {
          category?: string
          content?: string
          correct_answer?: string
          created_at?: string
          difficulty?: string | null
          explanation?: string | null
          id?: string
          options?: Json | null
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          created_at: string
          id: string
          podcast_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          podcast_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          podcast_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_podcast_id_fkey"
            columns: ["podcast_id"]
            isOneToOne: false
            referencedRelation: "juricast"
            referencedColumns: ["id"]
          },
        ]
      }
      user_listening_progress: {
        Row: {
          duration: number
          id: string
          is_completed: boolean
          last_played_at: string
          play_position: number
          podcast_id: number
          user_id: string
        }
        Insert: {
          duration?: number
          id?: string
          is_completed?: boolean
          last_played_at?: string
          play_position?: number
          podcast_id: number
          user_id: string
        }
        Update: {
          duration?: number
          id?: string
          is_completed?: boolean
          last_played_at?: string
          play_position?: number
          podcast_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_listening_progress_podcast_id_fkey"
            columns: ["podcast_id"]
            isOneToOne: false
            referencedRelation: "juricast"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          content_id: string
          content_type: string
          created_at: string
          id: string
          last_accessed: string | null
          score: number | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string
          id?: string
          last_accessed?: string | null
          score?: number | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string
          id?: string
          last_accessed?: string | null
          score?: number | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      vade_annotations: {
        Row: {
          article_id: string | null
          content: string
          created_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          article_id?: string | null
          content: string
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          article_id?: string | null
          content?: string
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vade_annotations_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "vade_articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vade_annotations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vade_users"
            referencedColumns: ["id"]
          },
        ]
      }
      vade_articles: {
        Row: {
          content: string
          created_at: string
          id: string
          law_id: string | null
          number: string
          summary: string | null
          version: number
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          law_id?: string | null
          number: string
          summary?: string | null
          version?: number
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          law_id?: string | null
          number?: string
          summary?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "vade_articles_law_id_fkey"
            columns: ["law_id"]
            isOneToOne: false
            referencedRelation: "vade_laws"
            referencedColumns: ["id"]
          },
        ]
      }
      vade_badges: {
        Row: {
          created_at: string
          criteria: string | null
          description: string
          icon_url: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          criteria?: string | null
          description: string
          icon_url?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          criteria?: string | null
          description?: string
          icon_url?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      vade_clip_articles: {
        Row: {
          added_at: string
          article_id: string | null
          clip_id: string | null
          id: string
        }
        Insert: {
          added_at?: string
          article_id?: string | null
          clip_id?: string | null
          id?: string
        }
        Update: {
          added_at?: string
          article_id?: string | null
          clip_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vade_clip_articles_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "vade_articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vade_clip_articles_clip_id_fkey"
            columns: ["clip_id"]
            isOneToOne: false
            referencedRelation: "vade_clips"
            referencedColumns: ["id"]
          },
        ]
      }
      vade_clips: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          title: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          title: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vade_clips_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vade_users"
            referencedColumns: ["id"]
          },
        ]
      }
      vade_comments: {
        Row: {
          content: string
          created_at: string
          feed_id: string | null
          id: string
          parent_id: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          feed_id?: string | null
          id?: string
          parent_id?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          feed_id?: string | null
          id?: string
          parent_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vade_comments_feed_id_fkey"
            columns: ["feed_id"]
            isOneToOne: false
            referencedRelation: "vade_feed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vade_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "vade_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vade_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vade_users"
            referencedColumns: ["id"]
          },
        ]
      }
      vade_feed: {
        Row: {
          body: string
          category: string | null
          created_at: string
          id: string
          title: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          body: string
          category?: string | null
          created_at?: string
          id?: string
          title?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          body?: string
          category?: string | null
          created_at?: string
          id?: string
          title?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vade_feed_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vade_users"
            referencedColumns: ["id"]
          },
        ]
      }
      vade_laws: {
        Row: {
          branch: string | null
          created_at: string
          description: string | null
          id: string
          publication_date: string | null
          scope: string | null
          title: string
        }
        Insert: {
          branch?: string | null
          created_at?: string
          description?: string | null
          id?: string
          publication_date?: string | null
          scope?: string | null
          title: string
        }
        Update: {
          branch?: string | null
          created_at?: string
          description?: string | null
          id?: string
          publication_date?: string | null
          scope?: string | null
          title?: string
        }
        Relationships: []
      }
      vade_leaderboard: {
        Row: {
          category: string | null
          id: string
          period: string | null
          points: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          category?: string | null
          id?: string
          period?: string | null
          points?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          category?: string | null
          id?: string
          period?: string | null
          points?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vade_leaderboard_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vade_users"
            referencedColumns: ["id"]
          },
        ]
      }
      vade_legislative_alerts: {
        Row: {
          active: boolean
          channel: string | null
          created_at: string
          id: string
          keywords: string[] | null
          topic: string
          user_id: string | null
        }
        Insert: {
          active?: boolean
          channel?: string | null
          created_at?: string
          id?: string
          keywords?: string[] | null
          topic: string
          user_id?: string | null
        }
        Update: {
          active?: boolean
          channel?: string | null
          created_at?: string
          id?: string
          keywords?: string[] | null
          topic?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vade_legislative_alerts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vade_users"
            referencedColumns: ["id"]
          },
        ]
      }
      vade_likes: {
        Row: {
          created_at: string
          feed_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          feed_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          feed_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vade_likes_feed_id_fkey"
            columns: ["feed_id"]
            isOneToOne: false
            referencedRelation: "vade_feed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vade_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vade_users"
            referencedColumns: ["id"]
          },
        ]
      }
      vade_notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          read: boolean
          type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          read?: boolean
          type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          read?: boolean
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vade_notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vade_users"
            referencedColumns: ["id"]
          },
        ]
      }
      vade_private_messages: {
        Row: {
          body: string
          id: string
          read: boolean
          receiver_id: string | null
          sender_id: string | null
          sent_at: string
        }
        Insert: {
          body: string
          id?: string
          read?: boolean
          receiver_id?: string | null
          sender_id?: string | null
          sent_at?: string
        }
        Update: {
          body?: string
          id?: string
          read?: boolean
          receiver_id?: string | null
          sender_id?: string | null
          sent_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vade_private_messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "vade_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vade_private_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "vade_users"
            referencedColumns: ["id"]
          },
        ]
      }
      vade_user_badges: {
        Row: {
          awarded_at: string
          badge_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          awarded_at?: string
          badge_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          awarded_at?: string
          badge_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vade_user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "vade_badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vade_user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vade_users"
            referencedColumns: ["id"]
          },
        ]
      }
      vade_user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["vade_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["vade_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["vade_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vade_user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vade_users"
            referencedColumns: ["id"]
          },
        ]
      }
      vade_users: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          password_hash: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          password_hash: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          password_hash?: string
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
      vade_role: "admin" | "moderador" | "contribuidor" | "leitor"
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
      vade_role: ["admin", "moderador", "contribuidor", "leitor"],
    },
  },
} as const
