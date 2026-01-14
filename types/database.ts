// ============================================
// Supabase 数据库类型定义
// ============================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ============================================
// 数据库架构类型（用于 Supabase 客户端）
// ============================================

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          title: string | null;
          bio: string | null;
          avatar_url: string | null;
          banner_url: string | null;
          climbs_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          title?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          banner_url?: string | null;
          climbs_count?: number;
        };
        Update: {
          name?: string;
          title?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          banner_url?: string | null;
          climbs_count?: number;
        };
        Relationships: [];
      };
      posts: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          location: string | null;
          date: string | null;
          image_url: string | null;
          alt_text: string | null;
          content: string | null;
          likes_count: number;
          comments_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          location?: string | null;
          date?: string | null;
          image_url?: string | null;
          alt_text?: string | null;
          content?: string | null;
          likes_count?: number;
          comments_count?: number;
        };
        Update: {
          title?: string;
          location?: string | null;
          date?: string | null;
          image_url?: string | null;
          alt_text?: string | null;
          content?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      likes: {
        Row: {
          id: string;
          user_id: string;
          post_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          post_id: string;
        };
        Update: {
          user_id?: string;
          post_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "likes_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "likes_post_id_fkey";
            columns: ["post_id"];
            referencedRelation: "posts";
            referencedColumns: ["id"];
          }
        ];
      };
      comments: {
        Row: {
          id: string;
          user_id: string;
          post_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          post_id: string;
          content: string;
        };
        Update: {
          content?: string;
        };
        Relationships: [
          {
            foreignKeyName: "comments_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comments_post_id_fkey";
            columns: ["post_id"];
            referencedRelation: "posts";
            referencedColumns: ["id"];
          }
        ];
      };
      follows: {
        Row: {
          id: string;
          follower_id: string;
          following_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          follower_id: string;
          following_id: string;
        };
        Update: {
          follower_id?: string;
          following_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_fkey";
            columns: ["follower_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "follows_following_id_fkey";
            columns: ["following_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      equipment: {
        Row: {
          id: string;
          name: string;
          brand: string;
          price: number;
          category: string;
          image_url: string | null;
          description: string | null;
          gallery: string[] | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          brand: string;
          price: number;
          category: string;
          image_url?: string | null;
          description?: string | null;
          gallery?: string[] | null;
        };
        Update: {
          name?: string;
          brand?: string;
          price?: number;
          category?: string;
          image_url?: string | null;
          description?: string | null;
          gallery?: string[] | null;
        };
        Relationships: [];
      };
      equipment_reviews: {
        Row: {
          id: string;
          equipment_id: string;
          user_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          equipment_id: string;
          user_id: string;
          rating: number;
          comment?: string | null;
        };
        Update: {
          rating?: number;
          comment?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "equipment_reviews_equipment_id_fkey";
            columns: ["equipment_id"];
            referencedRelation: "equipment";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "equipment_reviews_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      cart_items: {
        Row: {
          id: string;
          user_id: string;
          equipment_id: string;
          quantity: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          equipment_id: string;
          quantity?: number;
        };
        Update: {
          quantity?: number;
        };
        Relationships: [
          {
            foreignKeyName: "cart_items_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cart_items_equipment_id_fkey";
            columns: ["equipment_id"];
            referencedRelation: "equipment";
            referencedColumns: ["id"];
          }
        ];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          body: string | null;
          icon: string | null;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          body?: string | null;
          icon?: string | null;
          read?: boolean;
        };
        Update: {
          read?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      user_preferences: {
        Row: {
          id: string;
          notifications_enabled: boolean;
          safety_alerts: boolean;
          units: string;
          auto_summary: boolean;
          updated_at: string;
        };
        Insert: {
          id: string;
          notifications_enabled?: boolean;
          safety_alerts?: boolean;
          units?: string;
          auto_summary?: boolean;
        };
        Update: {
          notifications_enabled?: boolean;
          safety_alerts?: boolean;
          units?: string;
          auto_summary?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "user_preferences_id_fkey";
            columns: ["id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};


// ============================================
// 便捷类型别名
// ============================================

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type Post = Database['public']['Tables']['posts']['Row'];
export type PostInsert = Database['public']['Tables']['posts']['Insert'];
export type PostUpdate = Database['public']['Tables']['posts']['Update'];

export type Like = Database['public']['Tables']['likes']['Row'];
export type LikeInsert = Database['public']['Tables']['likes']['Insert'];

export type Comment = Database['public']['Tables']['comments']['Row'];
export type CommentInsert = Database['public']['Tables']['comments']['Insert'];
export type CommentUpdate = Database['public']['Tables']['comments']['Update'];

export type Follow = Database['public']['Tables']['follows']['Row'];
export type FollowInsert = Database['public']['Tables']['follows']['Insert'];

export type Equipment = Database['public']['Tables']['equipment']['Row'];
export type EquipmentInsert = Database['public']['Tables']['equipment']['Insert'];
export type EquipmentUpdate = Database['public']['Tables']['equipment']['Update'];

export type EquipmentReview = Database['public']['Tables']['equipment_reviews']['Row'];
export type EquipmentReviewInsert = Database['public']['Tables']['equipment_reviews']['Insert'];
export type EquipmentReviewUpdate = Database['public']['Tables']['equipment_reviews']['Update'];

export type CartItem = Database['public']['Tables']['cart_items']['Row'];
export type CartItemInsert = Database['public']['Tables']['cart_items']['Insert'];
export type CartItemUpdate = Database['public']['Tables']['cart_items']['Update'];

export type Notification = Database['public']['Tables']['notifications']['Row'];
export type NotificationInsert = Database['public']['Tables']['notifications']['Insert'];
export type NotificationUpdate = Database['public']['Tables']['notifications']['Update'];

export type UserPreferences = Database['public']['Tables']['user_preferences']['Row'];
export type UserPreferencesInsert = Database['public']['Tables']['user_preferences']['Insert'];
export type UserPreferencesUpdate = Database['public']['Tables']['user_preferences']['Update'];

// ============================================
// 扩展类型（带关联数据）
// ============================================

export interface PostWithAuthor extends Post {
  profiles: Pick<Profile, 'id' | 'name' | 'avatar_url' | 'title'>;
}

export interface CommentWithAuthor extends Comment {
  profiles: Pick<Profile, 'id' | 'name' | 'avatar_url'>;
}

export interface EquipmentReviewWithAuthor extends EquipmentReview {
  profiles: Pick<Profile, 'id' | 'name' | 'avatar_url'>;
}

export interface EquipmentWithReviews extends Equipment {
  equipment_reviews: EquipmentReviewWithAuthor[];
  average_rating?: number | null;
  review_count?: number;
}

export interface CartItemWithEquipment extends CartItem {
  equipment: Equipment;
}

// ============================================
// 查询响应类型
// ============================================

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  hasMore: boolean;
}

export interface ProfileStats {
  followers_count: number;
  following_count: number;
  posts_count: number;
}

// ============================================
// 输入类型（用于服务函数）
// ============================================

export interface PostCreate {
  title: string;
  location?: string;
  date?: string;
  image_url?: string;
  alt_text?: string;
  content?: string;
}

export interface CommentCreate {
  post_id: string;
  content: string;
}

export interface ReviewCreate {
  equipment_id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
}

// 类型别名（兼容性）
export type PreferencesUpdate = UserPreferencesUpdate;
export type NotificationType = 'safety' | 'community' | 'achievement' | 'social';
export type UnitSystem = 'metric' | 'imperial';
export type EquipmentCategory = '五金' | '服装' | '安全' | '背包';
