export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string
          name: string
          document_id: string
          email: string
          phone: string
          address: Json
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          document_id: string
          email: string
          phone: string
          address: Json
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          document_id?: string
          email?: string
          phone?: string
          address?: Json
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      client_documents: {
        Row: {
          id: string
          client_id: string
          name: string
          url: string
          size: number
          type: string
          created_at: string
        }
        Insert: {
          id?: string
          client_id: string
          name: string
          url: string
          size: number
          type: string
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          name?: string
          url?: string
          size?: number
          type?: string
          created_at?: string
        }
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
  }
}