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
      accountdetails: {
        Row: {
          account_type: Database["public"]["Enums"]["account_type"] | null
          account_uid: string
          dob: string | null
          first_name: string | null
          last_name: string | null
          profile_picture: string | null
        }
        Insert: {
          account_type?: Database["public"]["Enums"]["account_type"] | null
          account_uid?: string
          dob?: string | null
          first_name?: string | null
          last_name?: string | null
          profile_picture?: string | null
        }
        Update: {
          account_type?: Database["public"]["Enums"]["account_type"] | null
          account_uid?: string
          dob?: string | null
          first_name?: string | null
          last_name?: string | null
          profile_picture?: string | null
        }
        Relationships: []
      }
      appointment: {
        Row: {
          appointment_id: string
          content: string | null
          created_date: string | null
          duration: number
          meeting_date: string | null
          patient_uid: string | null
          staff_id: string | null
          status: Database["public"]["Enums"]["apt_status"] | null
          ticket_id: string | null
          visibility: boolean | null
        }
        Insert: {
          appointment_id?: string
          content?: string | null
          created_date?: string | null
          duration?: number
          meeting_date?: string | null
          patient_uid?: string | null
          staff_id?: string | null
          status?: Database["public"]["Enums"]["apt_status"] | null
          ticket_id?: string | null
          visibility?: boolean | null
        }
        Update: {
          appointment_id?: string
          content?: string | null
          created_date?: string | null
          duration?: number
          meeting_date?: string | null
          patient_uid?: string | null
          staff_id?: string | null
          status?: Database["public"]["Enums"]["apt_status"] | null
          ticket_id?: string | null
          visibility?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "appointment_patient_uid_fkey"
            columns: ["patient_uid"]
            isOneToOne: false
            referencedRelation: "patient"
            referencedColumns: ["patient_uid"]
          },
          {
            foreignKeyName: "appointment_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["staff_id"]
          },
          {
            foreignKeyName: "appointment_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "ticket"
            referencedColumns: ["ticket_id"]
          },
        ]
      }
      customizedregimen: {
        Row: {
          create_time: string | null
          cus_regimen_id: string
          description: string | null
          name: string | null
        }
        Insert: {
          create_time?: string | null
          cus_regimen_id?: string
          description?: string | null
          name?: string | null
        }
        Update: {
          create_time?: string | null
          cus_regimen_id?: string
          description?: string | null
          name?: string | null
        }
        Relationships: []
      }
      customizedregimendetail: {
        Row: {
          cus_regimen_detail_id: string
          cus_regimen_id: string | null
          end_date: string | null
          frequency: number | null
          note: string | null
          prescription_id: string | null
          start_date: string | null
          total_dosage: number | null
        }
        Insert: {
          cus_regimen_detail_id?: string
          cus_regimen_id?: string | null
          end_date?: string | null
          frequency?: number | null
          note?: string | null
          prescription_id?: string | null
          start_date?: string | null
          total_dosage?: number | null
        }
        Update: {
          cus_regimen_detail_id?: string
          cus_regimen_id?: string | null
          end_date?: string | null
          frequency?: number | null
          note?: string | null
          prescription_id?: string | null
          start_date?: string | null
          total_dosage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "customizedregimendetail_cus_regimen_id_fkey"
            columns: ["cus_regimen_id"]
            isOneToOne: false
            referencedRelation: "customizedregimen"
            referencedColumns: ["cus_regimen_id"]
          },
          {
            foreignKeyName: "customizedregimendetail_prescription_id_fkey"
            columns: ["prescription_id"]
            isOneToOne: false
            referencedRelation: "prescription"
            referencedColumns: ["prescription_id"]
          },
        ]
      }
      daysession: {
        Row: {
          day_session: string
          end_time: string | null
          location: string | null
          start_time: string | null
          status: boolean | null
        }
        Insert: {
          day_session?: string
          end_time?: string | null
          location?: string | null
          start_time?: string | null
          status?: boolean | null
        }
        Update: {
          day_session?: string
          end_time?: string | null
          location?: string | null
          start_time?: string | null
          status?: boolean | null
        }
        Relationships: []
      }
      doctorschedule: {
        Row: {
          day_of_week: string
          day_session: string
          staff_id: string
        }
        Insert: {
          day_of_week: string
          day_session: string
          staff_id: string
        }
        Update: {
          day_of_week?: string
          day_session?: string
          staff_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "doctorschedule_day_of_week_day_session_fkey"
            columns: ["day_of_week", "day_session"]
            isOneToOne: false
            referencedRelation: "weekday"
            referencedColumns: ["day_of_week", "day_session"]
          },
          {
            foreignKeyName: "doctorschedule_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["staff_id"]
          },
        ]
      }
      doctorspecification: {
        Row: {
          specification_id: string
          staff_id: string
        }
        Insert: {
          specification_id: string
          staff_id: string
        }
        Update: {
          specification_id?: string
          staff_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "doctorspecification_specification_id_fkey"
            columns: ["specification_id"]
            isOneToOne: false
            referencedRelation: "specification"
            referencedColumns: ["specification_id"]
          },
          {
            foreignKeyName: "doctorspecification_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["staff_id"]
          },
        ]
      }
      intakehistory: {
        Row: {
          intake_id: string
          missed: boolean | null
          note: string | null
          patient_uid: string | null
          prescription_id: string | null
          remind_inc_appointment: boolean | null
          take_time: string | null
        }
        Insert: {
          intake_id?: string
          missed?: boolean | null
          note?: string | null
          patient_uid?: string | null
          prescription_id?: string | null
          remind_inc_appointment?: boolean | null
          take_time?: string | null
        }
        Update: {
          intake_id?: string
          missed?: boolean | null
          note?: string | null
          patient_uid?: string | null
          prescription_id?: string | null
          remind_inc_appointment?: boolean | null
          take_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "intakehistory_patient_uid_fkey"
            columns: ["patient_uid"]
            isOneToOne: false
            referencedRelation: "patient"
            referencedColumns: ["patient_uid"]
          },
          {
            foreignKeyName: "intakehistory_prescription_id_fkey"
            columns: ["prescription_id"]
            isOneToOne: false
            referencedRelation: "prescription"
            referencedColumns: ["prescription_id"]
          },
        ]
      }
      medicine: {
        Row: {
          description: string | null
          is_available: boolean | null
          med_time: Database["public"]["Enums"]["med_timing"] | null
          medicine_id: string
          name: string | null
        }
        Insert: {
          description?: string | null
          is_available?: boolean | null
          med_time?: Database["public"]["Enums"]["med_timing"] | null
          medicine_id?: string
          name?: string | null
        }
        Update: {
          description?: string | null
          is_available?: boolean | null
          med_time?: Database["public"]["Enums"]["med_timing"] | null
          medicine_id?: string
          name?: string | null
        }
        Relationships: []
      }
      patient: {
        Row: {
          account_uid: string | null
          anonymous_status: boolean | null
          patient_uid: string
        }
        Insert: {
          account_uid?: string | null
          anonymous_status?: boolean | null
          patient_uid?: string
        }
        Update: {
          account_uid?: string | null
          anonymous_status?: boolean | null
          patient_uid?: string
        }
        Relationships: []
      }
      prescription: {
        Row: {
          name: string | null
          note: string | null
          prescription_id: string
        }
        Insert: {
          name?: string | null
          note?: string | null
          prescription_id?: string
        }
        Update: {
          name?: string | null
          note?: string | null
          prescription_id?: string
        }
        Relationships: []
      }
      prescriptiondetail: {
        Row: {
          dosage: number | null
          end_time: string | null
          interval: number | null
          medicine_id: string | null
          note: string | null
          prescription_detail_id: string
          prescription_id: string | null
          start_time: string | null
        }
        Insert: {
          dosage?: number | null
          end_time?: string | null
          interval?: number | null
          medicine_id?: string | null
          note?: string | null
          prescription_detail_id?: string
          prescription_id?: string | null
          start_time?: string | null
        }
        Update: {
          dosage?: number | null
          end_time?: string | null
          interval?: number | null
          medicine_id?: string | null
          note?: string | null
          prescription_detail_id?: string
          prescription_id?: string | null
          start_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prescriptiondetail_medicine_id_fkey"
            columns: ["medicine_id"]
            isOneToOne: false
            referencedRelation: "medicine"
            referencedColumns: ["medicine_id"]
          },
          {
            foreignKeyName: "prescriptiondetail_prescription_id_fkey"
            columns: ["prescription_id"]
            isOneToOne: false
            referencedRelation: "prescription"
            referencedColumns: ["prescription_id"]
          },
        ]
      }
      random_name_pool: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      regimen: {
        Row: {
          create_date: string | null
          description: string | null
          name: string | null
          regimen_id: string
        }
        Insert: {
          create_date?: string | null
          description?: string | null
          name?: string | null
          regimen_id?: string
        }
        Update: {
          create_date?: string | null
          description?: string | null
          name?: string | null
          regimen_id?: string
        }
        Relationships: []
      }
      regimendetail: {
        Row: {
          end_date: string | null
          frequency: number | null
          medicine_id: string | null
          note: string | null
          regimen_detail_id: string
          regimen_id: string | null
          start_date: string | null
          total_dosage: number | null
        }
        Insert: {
          end_date?: string | null
          frequency?: number | null
          medicine_id?: string | null
          note?: string | null
          regimen_detail_id?: string
          regimen_id?: string | null
          start_date?: string | null
          total_dosage?: number | null
        }
        Update: {
          end_date?: string | null
          frequency?: number | null
          medicine_id?: string | null
          note?: string | null
          regimen_detail_id?: string
          regimen_id?: string | null
          start_date?: string | null
          total_dosage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "regimendetail_medicine_id_fkey"
            columns: ["medicine_id"]
            isOneToOne: false
            referencedRelation: "medicine"
            referencedColumns: ["medicine_id"]
          },
          {
            foreignKeyName: "regimendetail_regimen_id_fkey"
            columns: ["regimen_id"]
            isOneToOne: false
            referencedRelation: "regimen"
            referencedColumns: ["regimen_id"]
          },
        ]
      }
      specification: {
        Row: {
          achieved_date: string | null
          level: number | null
          name: string | null
          specification_id: string
        }
        Insert: {
          achieved_date?: string | null
          level?: number | null
          name?: string | null
          specification_id?: string
        }
        Update: {
          achieved_date?: string | null
          level?: number | null
          name?: string | null
          specification_id?: string
        }
        Relationships: []
      }
      staff: {
        Row: {
          account_uid: string | null
          join_date: string | null
          role: Database["public"]["Enums"]["staff_role"] | null
          staff_id: string
          status: boolean | null
        }
        Insert: {
          account_uid?: string | null
          join_date?: string | null
          role?: Database["public"]["Enums"]["staff_role"] | null
          staff_id?: string
          status?: boolean | null
        }
        Update: {
          account_uid?: string | null
          join_date?: string | null
          role?: Database["public"]["Enums"]["staff_role"] | null
          staff_id?: string
          status?: boolean | null
        }
        Relationships: []
      }
      ticket: {
        Row: {
          assigned_to: string | null
          content: string | null
          created_by: string | null
          date_created: string | null
          status: Database["public"]["Enums"]["tik_status"] | null
          ticket_id: string
          ticket_type: Database["public"]["Enums"]["ticket_type"]
          title: string | null
        }
        Insert: {
          assigned_to?: string | null
          content?: string | null
          created_by?: string | null
          date_created?: string | null
          status?: Database["public"]["Enums"]["tik_status"] | null
          ticket_id?: string
          ticket_type?: Database["public"]["Enums"]["ticket_type"]
          title?: string | null
        }
        Update: {
          assigned_to?: string | null
          content?: string | null
          created_by?: string | null
          date_created?: string | null
          status?: Database["public"]["Enums"]["tik_status"] | null
          ticket_id?: string
          ticket_type?: Database["public"]["Enums"]["ticket_type"]
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["staff_id"]
          },
        ]
      }
      ticket_interaction_history: {
        Row: {
          action: Database["public"]["Enums"]["ticket_interaction_type"]
          id: number
          note: string | null
          ticket_id: string
          time: string
        }
        Insert: {
          action?: Database["public"]["Enums"]["ticket_interaction_type"]
          id?: number
          note?: string | null
          ticket_id: string
          time?: string
        }
        Update: {
          action?: Database["public"]["Enums"]["ticket_interaction_type"]
          id?: number
          note?: string | null
          ticket_id?: string
          time?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_interaction_history_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "ticket"
            referencedColumns: ["ticket_id"]
          },
        ]
      }
      weekday: {
        Row: {
          day_of_week: string
          day_session: string
        }
        Insert: {
          day_of_week: string
          day_session: string
        }
        Update: {
          day_of_week?: string
          day_session?: string
        }
        Relationships: [
          {
            foreignKeyName: "weekday_day_session_fkey"
            columns: ["day_session"]
            isOneToOne: false
            referencedRelation: "daysession"
            referencedColumns: ["day_session"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      forward_ticket: {
        Args: { from_staff: string; to_staff: string }
        Returns: undefined
      }
      get_display_name: {
        Args: { uid: string }
        Returns: string
      }
      get_random_name: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      account_type: "staff" | "patient"
      apt_status:
        | "pending"
        | "scheduled"
        | "in progress"
        | "completed"
        | "canceled"
        | "no show"
      med_timing: "empty stomach" | "before meal" | "with meal" | "after meal"
      staff_role: "doctor" | "staff" | "manager"
      ticket_interaction_type:
        | "create"
        | "forward"
        | "dismiss"
        | "processed"
        | "other"
      ticket_type: "appointment" | "test" | "other"
      tik_status: "pending" | "booked" | "closed" | "canceled"
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
      account_type: ["staff", "patient"],
      apt_status: [
        "pending",
        "scheduled",
        "in progress",
        "completed",
        "canceled",
        "no show",
      ],
      med_timing: ["empty stomach", "before meal", "with meal", "after meal"],
      staff_role: ["doctor", "staff", "manager"],
      ticket_interaction_type: [
        "create",
        "forward",
        "dismiss",
        "processed",
        "other",
      ],
      ticket_type: ["appointment", "test", "other"],
      tik_status: ["pending", "booked", "closed", "canceled"],
    },
  },
} as const
