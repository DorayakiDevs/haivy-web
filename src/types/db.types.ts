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
      appointment: {
        Row: {
          appointment_id: string
          content: string
          created_date: string
          duration: number
          is_online: boolean
          is_visible: boolean
          meeting_date: string
          meeting_link: string
          notes: string
          patient_id: string
          staff_id: string
          status: Database["public"]["Enums"]["appointment_status"]
          ticket_id: string
        }
        Insert: {
          appointment_id?: string
          content?: string
          created_date?: string
          duration?: number
          is_online?: boolean
          is_visible?: boolean
          meeting_date: string
          meeting_link?: string
          notes?: string
          patient_id: string
          staff_id: string
          status?: Database["public"]["Enums"]["appointment_status"]
          ticket_id: string
        }
        Update: {
          appointment_id?: string
          content?: string
          created_date?: string
          duration?: number
          is_online?: boolean
          is_visible?: boolean
          meeting_date?: string
          meeting_link?: string
          notes?: string
          patient_id?: string
          staff_id?: string
          status?: Database["public"]["Enums"]["appointment_status"]
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointment_patient_id_fkey1"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "user_details"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "appointment_staff_id_fkey1"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "user_details"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "appointment_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: true
            referencedRelation: "ticket"
            referencedColumns: ["ticket_id"]
          },
        ]
      }
      medicine_schedule: {
        Row: {
          date: string
          id: number
          medicine: string
          prescription: number
          taken: boolean
          time_of_day: Database["public"]["Enums"]["time_of_day"]
        }
        Insert: {
          date: string
          id?: number
          medicine: string
          prescription: number
          taken?: boolean
          time_of_day: Database["public"]["Enums"]["time_of_day"]
        }
        Update: {
          date?: string
          id?: number
          medicine?: string
          prescription?: number
          taken?: boolean
          time_of_day?: Database["public"]["Enums"]["time_of_day"]
        }
        Relationships: [
          {
            foreignKeyName: "medicine_schedule_medicine_fkey"
            columns: ["medicine"]
            isOneToOne: false
            referencedRelation: "medicines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medicine_schedule_prescription_fkey"
            columns: ["prescription"]
            isOneToOne: false
            referencedRelation: "prescriptions"
            referencedColumns: ["prescription_id"]
          },
        ]
      }
      medicines: {
        Row: {
          consumption_note: string
          description: string
          dosage: number
          id: string
          image_url: string | null
          is_available: boolean
          name: string
          unit: string
        }
        Insert: {
          consumption_note?: string
          description?: string
          dosage?: number
          id?: string
          image_url?: string | null
          is_available?: boolean
          name: string
          unit?: string
        }
        Update: {
          consumption_note?: string
          description?: string
          dosage?: number
          id?: string
          image_url?: string | null
          is_available?: boolean
          name?: string
          unit?: string
        }
        Relationships: []
      }
      patient_medical_info: {
        Row: {
          allergies: string
          blood_type: string
          chronic_conditions: string
          height_cm: number
          is_pregnant: boolean | null
          mental_health_notes: string
          notes: string
          patient_id: string
          sex: Database["public"]["Enums"]["sex"]
          substance_use_history: string
          updated_at: string
          weight_kg: number
        }
        Insert: {
          allergies?: string
          blood_type?: string
          chronic_conditions?: string
          height_cm?: number
          is_pregnant?: boolean | null
          mental_health_notes?: string
          notes?: string
          patient_id: string
          sex?: Database["public"]["Enums"]["sex"]
          substance_use_history?: string
          updated_at?: string
          weight_kg?: number
        }
        Update: {
          allergies?: string
          blood_type?: string
          chronic_conditions?: string
          height_cm?: number
          is_pregnant?: boolean | null
          mental_health_notes?: string
          notes?: string
          patient_id?: string
          sex?: Database["public"]["Enums"]["sex"]
          substance_use_history?: string
          updated_at?: string
          weight_kg?: number
        }
        Relationships: [
          {
            foreignKeyName: "patient_medical_info_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: true
            referencedRelation: "user_details"
            referencedColumns: ["user_id"]
          },
        ]
      }
      prescription_details: {
        Row: {
          daily_dosage_schedule: Json
          medicine_id: string
          prescription_id: number
          total_day: number
        }
        Insert: {
          daily_dosage_schedule: Json
          medicine_id: string
          prescription_id: number
          total_day: number
        }
        Update: {
          daily_dosage_schedule?: Json
          medicine_id?: string
          prescription_id?: number
          total_day?: number
        }
        Relationships: [
          {
            foreignKeyName: "prescription_details_medicine_id_fkey"
            columns: ["medicine_id"]
            isOneToOne: false
            referencedRelation: "medicines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescription_details_prescription_id_fkey"
            columns: ["prescription_id"]
            isOneToOne: false
            referencedRelation: "prescriptions"
            referencedColumns: ["prescription_id"]
          },
        ]
      }
      prescriptions: {
        Row: {
          appointment_id: string
          created_at: string
          prescription_id: number
          related_regimen: string | null
        }
        Insert: {
          appointment_id: string
          created_at?: string
          prescription_id?: number
          related_regimen?: string | null
        }
        Update: {
          appointment_id?: string
          created_at?: string
          prescription_id?: number
          related_regimen?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prescriptions_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointment"
            referencedColumns: ["appointment_id"]
          },
          {
            foreignKeyName: "prescriptions_related_regimen_fkey"
            columns: ["related_regimen"]
            isOneToOne: false
            referencedRelation: "regimens"
            referencedColumns: ["regimen_id"]
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
      regimen_details: {
        Row: {
          daily_dosage_schedule: Json
          medicine_id: string
          regimen_id: string
          total_day: number
        }
        Insert: {
          daily_dosage_schedule: Json
          medicine_id: string
          regimen_id: string
          total_day: number
        }
        Update: {
          daily_dosage_schedule?: Json
          medicine_id?: string
          regimen_id?: string
          total_day?: number
        }
        Relationships: [
          {
            foreignKeyName: "regimen_details_medicine_id_fkey"
            columns: ["medicine_id"]
            isOneToOne: false
            referencedRelation: "medicines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "regimendetail_regimen_id_fkey"
            columns: ["regimen_id"]
            isOneToOne: false
            referencedRelation: "regimens"
            referencedColumns: ["regimen_id"]
          },
        ]
      }
      regimens: {
        Row: {
          age_range: number[]
          create_date: string | null
          description: string | null
          is_available: boolean | null
          level: number
          name: string | null
          regimen_id: string
        }
        Insert: {
          age_range?: number[]
          create_date?: string | null
          description?: string | null
          is_available?: boolean | null
          level?: number
          name?: string | null
          regimen_id?: string
        }
        Update: {
          age_range?: number[]
          create_date?: string | null
          description?: string | null
          is_available?: boolean | null
          level?: number
          name?: string | null
          regimen_id?: string
        }
        Relationships: []
      }
      screening_results: {
        Row: {
          appointment_id: string
          blood_pressure: number
          created_at: string
          height_cm: number
          spo2: number
          weight_kg: number
        }
        Insert: {
          appointment_id: string
          blood_pressure: number
          created_at?: string
          height_cm: number
          spo2: number
          weight_kg: number
        }
        Update: {
          appointment_id?: string
          blood_pressure?: number
          created_at?: string
          height_cm?: number
          spo2?: number
          weight_kg?: number
        }
        Relationships: [
          {
            foreignKeyName: "screening_results_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: true
            referencedRelation: "appointment"
            referencedColumns: ["appointment_id"]
          },
        ]
      }
      specification_ownerships: {
        Row: {
          specification: number
          staff: string
        }
        Insert: {
          specification: number
          staff: string
        }
        Update: {
          specification?: number
          staff?: string
        }
        Relationships: [
          {
            foreignKeyName: "specification_ownerships_specification_fkey"
            columns: ["specification"]
            isOneToOne: false
            referencedRelation: "specifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "specification_ownerships_staff_fkey"
            columns: ["staff"]
            isOneToOne: false
            referencedRelation: "staffs"
            referencedColumns: ["user_id"]
          },
        ]
      }
      specifications: {
        Row: {
          created_at: string
          description: string
          id: number
          image_url: string | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: number
          image_url?: string | null
          title?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          image_url?: string | null
          title?: string
        }
        Relationships: []
      }
      staffs: {
        Row: {
          is_active: boolean
          join_date: string
          leave_date: string | null
          user_id: string
        }
        Insert: {
          is_active?: boolean
          join_date?: string
          leave_date?: string | null
          user_id: string
        }
        Update: {
          is_active?: boolean
          join_date?: string
          leave_date?: string | null
          user_id?: string
        }
        Relationships: []
      }
      test_results: {
        Row: {
          appointment: string
          created_at: string
          created_by: string
          id: number
          notes: string
          test_type: number
          ticket: string
          value: number | null
        }
        Insert: {
          appointment: string
          created_at?: string
          created_by?: string
          id?: number
          notes?: string
          test_type: number
          ticket: string
          value?: number | null
        }
        Update: {
          appointment?: string
          created_at?: string
          created_by?: string
          id?: number
          notes?: string
          test_type?: number
          ticket?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "test_results_appointment_fkey"
            columns: ["appointment"]
            isOneToOne: false
            referencedRelation: "appointment"
            referencedColumns: ["appointment_id"]
          },
          {
            foreignKeyName: "test_results_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "staffs"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "test_results_test_type_fkey"
            columns: ["test_type"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_results_ticket_fkey"
            columns: ["ticket"]
            isOneToOne: false
            referencedRelation: "ticket"
            referencedColumns: ["ticket_id"]
          },
        ]
      }
      tests: {
        Row: {
          created_at: string
          description: string
          id: number
          lower_threshold: number
          name: string
          result_type: Database["public"]["Enums"]["test_type"]
          unit: string
          upper_threshold: number | null
        }
        Insert: {
          created_at?: string
          description?: string
          id?: number
          lower_threshold: number
          name?: string
          result_type?: Database["public"]["Enums"]["test_type"]
          unit: string
          upper_threshold?: number | null
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          lower_threshold?: number
          name?: string
          result_type?: Database["public"]["Enums"]["test_type"]
          unit?: string
          upper_threshold?: number | null
        }
        Relationships: []
      }
      ticket: {
        Row: {
          assigned_to: string | null
          content: string | null
          created_by: string | null
          date_created: string | null
          status: Database["public"]["Enums"]["ticket_status"]
          ticket_id: string
          ticket_type: Database["public"]["Enums"]["ticket_type"]
          title: string | null
        }
        Insert: {
          assigned_to?: string | null
          content?: string | null
          created_by?: string | null
          date_created?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          ticket_id?: string
          ticket_type?: Database["public"]["Enums"]["ticket_type"]
          title?: string | null
        }
        Update: {
          assigned_to?: string | null
          content?: string | null
          created_by?: string | null
          date_created?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          ticket_id?: string
          ticket_type?: Database["public"]["Enums"]["ticket_type"]
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "staffs"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "ticket_assigned_to_fkey1"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "user_details"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "ticket_created_by_fkey1"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_details"
            referencedColumns: ["user_id"]
          },
        ]
      }
      ticket_interaction_history: {
        Row: {
          action: Database["public"]["Enums"]["ticket_interaction_type"]
          by: string | null
          id: number
          note: string | null
          ticket_id: string
          time: string
        }
        Insert: {
          action?: Database["public"]["Enums"]["ticket_interaction_type"]
          by?: string | null
          id?: number
          note?: string | null
          ticket_id: string
          time?: string
        }
        Update: {
          action?: Database["public"]["Enums"]["ticket_interaction_type"]
          by?: string | null
          id?: number
          note?: string | null
          ticket_id?: string
          time?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_interaction_history_by_fkey1"
            columns: ["by"]
            isOneToOne: false
            referencedRelation: "user_details"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "ticket_interaction_history_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "ticket"
            referencedColumns: ["ticket_id"]
          },
        ]
      }
      user_details: {
        Row: {
          birth_date: string | null
          full_name: string
          profile_image_url: string | null
          roles: Database["public"]["Enums"]["role"][]
          user_id: string
        }
        Insert: {
          birth_date?: string | null
          full_name?: string
          profile_image_url?: string | null
          roles?: Database["public"]["Enums"]["role"][]
          user_id: string
        }
        Update: {
          birth_date?: string | null
          full_name?: string
          profile_image_url?: string | null
          roles?: Database["public"]["Enums"]["role"][]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_ticket_comment: {
        Args: { tid: string; content: string }
        Returns: undefined
      }
      approve_ticket: {
        Args: { p_ticket_id: string; p_note?: string }
        Returns: undefined
      }
      bytea_to_text: {
        Args: { data: string }
        Returns: string
      }
      cancel_appointment: {
        Args: { p_appointment_id: string; p_note: string }
        Returns: undefined
      }
      check_roles: {
        Args: { roles: Database["public"]["Enums"]["role"][] }
        Returns: undefined
      }
      check_roles_bool: {
        Args: { roles: Database["public"]["Enums"]["role"][] }
        Returns: boolean
      }
      complete_appointment: {
        Args: { p_appointment_id: string; p_note: string }
        Returns: undefined
      }
      connection_test: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      create_appointment: {
        Args:
          | {
              p_duration: number
              p_is_public: boolean
              p_doctor_id: string
              p_patient_id: string
              p_phone: string
              p_service_desc: string
              p_meeting_date: string
              p_content: string
            }
          | {
              p_duration: number
              p_is_public: boolean
              p_doctor_id: string
              p_patient_id: string
              p_phone: string
              p_service_desc: string
              p_meeting_date: string
              p_content: string
              p_is_online: boolean
            }
        Returns: string
      }
      create_patient_medical_info: {
        Args: {
          patient_id: string
          height_cm?: number
          weight_kg?: number
          blood_type?: string
          allergies?: string
          chronic_conditions?: string
          is_pregnant?: boolean
          mental_health_notes?: string
          substance_use_history?: string
          notes?: string
          updated_at?: string
        }
        Returns: undefined
      }
      create_screening_results: {
        Args: {
          appointment_id: string
          blood_pressure: number
          height_cm: number
          weight_kg: number
          spo2: number
          created_at?: string
        }
        Returns: undefined
      }
      create_specification: {
        Args: { title: string; description?: string; image_url?: string }
        Returns: number
      }
      create_specification_ownership: {
        Args: { staff: string; specification: number }
        Returns: boolean
      }
      create_test_type: {
        Args: {
          name?: string
          description?: string
          upper_threshold?: number
          lower_threshold?: number
          unit?: string
          result_type?: Database["public"]["Enums"]["test_type"]
        }
        Returns: undefined
      }
      create_ticket: {
        Args: {
          p_title?: string
          p_content?: string
          p_type?: Database["public"]["Enums"]["ticket_type"]
          p_assigned_to?: string
        }
        Returns: string
      }
      delete_patient_medical_info: {
        Args: { patient_id: string }
        Returns: boolean
      }
      delete_specification: {
        Args: { id: number }
        Returns: boolean
      }
      delete_specification_ownership: {
        Args: { staff: string; specification: number }
        Returns: boolean
      }
      delete_test_type: {
        Args: { id: number }
        Returns: undefined
      }
      dismiss_ticket: {
        Args: { p_ticket_id: string; p_note: string }
        Returns: undefined
      }
      edit_interaction_history: {
        Args: { p_id: number; p_note: string }
        Returns: undefined
      }
      edit_user_details: {
        Args: { p_user_id: string; p_full_name: string; p_birth_date: string }
        Returns: boolean
      }
      forward_ticket: {
        Args: {
          ticket_id: string
          from_staff: string
          to_staff: string
          note: string
        }
        Returns: undefined
      }
      forward_ticket_comment: {
        Args: {
          p_ticket_id: string
          p_from_staff: string
          p_to_staff: string
          note: string
        }
        Returns: undefined
      }
      get_account_details: {
        Args: { p_id: string }
        Returns: Json
      }
      get_all_customers: {
        Args: Record<PropertyKey, never>
        Returns: {
          birth_date: string | null
          full_name: string
          profile_image_url: string | null
          roles: Database["public"]["Enums"]["role"][]
          user_id: string
        }[]
      }
      get_all_patient_medical_info: {
        Args: Record<PropertyKey, never>
        Returns: {
          allergies: string
          blood_type: string
          chronic_conditions: string
          height_cm: number
          is_pregnant: boolean | null
          mental_health_notes: string
          notes: string
          patient_id: string
          sex: Database["public"]["Enums"]["sex"]
          substance_use_history: string
          updated_at: string
          weight_kg: number
        }[]
      }
      get_all_screening_results: {
        Args: Record<PropertyKey, never>
        Returns: {
          appointment_id: string
          blood_pressure: number
          created_at: string
          height_cm: number
          spo2: number
          weight_kg: number
        }[]
      }
      get_all_specifications: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          description: string
          id: number
          image_url: string | null
          title: string
        }[]
      }
      get_all_tests_for_authenticated_user: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: number
          created_at: string
          created_by: Database["public"]["Tables"]["user_details"]["Row"]
          test_type: Database["public"]["Tables"]["tests"]["Row"]
          value: number
          notes: string
          ticket: Database["public"]["Tables"]["ticket"]["Row"]
          appointment: Database["public"]["Tables"]["appointment"]["Row"]
        }[]
      }
      get_all_tickets: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_appointment: {
        Args: { p_appointment_id: string }
        Returns: Json
      }
      get_appointments_gg_meet: {
        Args: Record<PropertyKey, never>
        Returns: {
          appointment_id: string
          meeting_date: string
          meeting_link: string
        }[]
      }
      get_available_uuids: {
        Args: { _limit: number }
        Returns: Json
      }
      get_display_name: {
        Args: { p_id: string }
        Returns: string
      }
      get_doctor_schedule_in_range: {
        Args: { begin_date: string; end_date: string }
        Returns: Json
      }
      get_doctor_schedule_with_date: {
        Args: { date: string }
        Returns: Json
      }
      get_full_name: {
        Args: { p_user_id: string }
        Returns: string
      }
      get_medication_schedule_for_authenticated_user: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: number
          take_at: Database["public"]["Enums"]["time_of_day"]
          taken: boolean
          date: string
          prescription: Database["public"]["Tables"]["prescriptions"]["Row"]
          medicine: Database["public"]["Tables"]["medicines"]["Row"]
        }[]
      }
      get_medicine_details: {
        Args: { p_id: string }
        Returns: Json
      }
      get_my_user_details: {
        Args: Record<PropertyKey, never>
        Returns: {
          birth_date: string | null
          full_name: string
          profile_image_url: string | null
          roles: Database["public"]["Enums"]["role"][]
          user_id: string
        }[]
      }
      get_patient_info_from_prescription: {
        Args: { p_prescription_id: number }
        Returns: {
          user_id: string
          full_name: string
          birth_date: string
          profile_image_url: string
        }[]
      }
      get_patient_medical_info_by_id: {
        Args: { patient_id: string }
        Returns: {
          allergies: string
          blood_type: string
          chronic_conditions: string
          height_cm: number
          is_pregnant: boolean | null
          mental_health_notes: string
          notes: string
          patient_id: string
          sex: Database["public"]["Enums"]["sex"]
          substance_use_history: string
          updated_at: string
          weight_kg: number
        }
      }
      get_patient_schedule_in_range: {
        Args: { p_begin_date: string; p_end_date: string }
        Returns: Json
      }
      get_patient_schedule_in_range_old: {
        Args: { start_date: string; end_date: string }
        Returns: {
          appointment_id: string
          meeting_date: string
          staff_id: string
          staff_name: string
          patient_id: string
          patient_name: string
        }[]
      }
      get_random_name: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_regimen_details: {
        Args: { p_regimen_id: string }
        Returns: Json
      }
      get_screening_results_by_appointment_id: {
        Args: { appointment_id: string }
        Returns: {
          appointment_id: string
          blood_pressure: number
          created_at: string
          height_cm: number
          spo2: number
          weight_kg: number
        }
      }
      get_specification_by_id: {
        Args: { id: number }
        Returns: {
          created_at: string
          description: string
          id: number
          image_url: string | null
          title: string
        }
      }
      get_specification_ownerships_by_specification: {
        Args: { specification: number }
        Returns: {
          staff: Database["public"]["Tables"]["staffs"]["Row"]
          account: Database["public"]["Tables"]["user_details"]["Row"]
        }[]
      }
      get_specification_ownerships_by_staff: {
        Args: { staff_id: string }
        Returns: {
          staff: Database["public"]["Tables"]["staffs"]["Row"]
          specification: Database["public"]["Tables"]["specifications"]["Row"]
          account: Database["public"]["Tables"]["user_details"]["Row"]
        }[]
      }
      get_test_results_by_appointment: {
        Args: { appointment_id: string }
        Returns: {
          id: number
          created_at: string
          created_by: Database["public"]["Tables"]["user_details"]["Row"]
          test_type: Database["public"]["Tables"]["tests"]["Row"]
          value: number
          notes: string
          ticket: Database["public"]["Tables"]["ticket"]["Row"]
        }[]
      }
      get_test_type_information: {
        Args: { test_id: number }
        Returns: {
          id: number
          created_at: string
          name: string
          description: string
          upper_threshold: number
          lower_threshold: number
          unit: string
          result_type: Database["public"]["Enums"]["test_type"]
        }[]
      }
      get_ticket_details: {
        Args: { tid: string }
        Returns: Json
      }
      get_user_basic_info: {
        Args: { uid: string }
        Returns: Json
      }
      http: {
        Args: { request: Database["public"]["CompositeTypes"]["http_request"] }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_delete: {
        Args:
          | { uri: string }
          | { uri: string; content: string; content_type: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_get: {
        Args: { uri: string } | { uri: string; data: Json }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_head: {
        Args: { uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_header: {
        Args: { field: string; value: string }
        Returns: Database["public"]["CompositeTypes"]["http_header"]
      }
      http_list_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: {
          curlopt: string
          value: string
        }[]
      }
      http_patch: {
        Args: { uri: string; content: string; content_type: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_post: {
        Args:
          | { uri: string; content: string; content_type: string }
          | { uri: string; data: Json }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_put: {
        Args: { uri: string; content: string; content_type: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_reset_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      http_set_curlopt: {
        Args: { curlopt: string; value: string }
        Returns: boolean
      }
      modify_ticket: {
        Args: { p_ticket_id: string; new_content: string; new_title: string }
        Returns: undefined
      }
      query_account_information: {
        Args: { _offset: number; _limit: number; query: string }
        Returns: Json
      }
      query_medicines: {
        Args: { query?: string; _offset?: number; _limit?: number }
        Returns: Json
      }
      query_tests: {
        Args: { q: string }
        Returns: {
          id: number
          created_at: string
          name: string
          description: string
          upper_threshold: number
          lower_threshold: number
          unit: string
          result_type: Database["public"]["Enums"]["test_type"]
        }[]
      }
      request_test: {
        Args: {
          test_type: number
          appointment_id: string
          assigned_to?: string
        }
        Returns: undefined
      }
      send_appointment_reminders: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      send_medicine_reminders: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      testing: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      text_to_bytea: {
        Args: { data: string }
        Returns: string
      }
      toggle_schedule_status: {
        Args: { id: number }
        Returns: undefined
      }
      update_appointment: {
        Args: {
          p_id: string
          p_doctor?: string
          p_content?: string
          p_patient?: string
          p_duration?: number
          p_meeting_time?: string
          p_status?: Database["public"]["Enums"]["appointment_status"]
          p_is_visible?: boolean
        }
        Returns: undefined
      }
      update_interaction_note: {
        Args: { uid: number; note: string }
        Returns: undefined
      }
      update_medicine: {
        Args:
          | {
              p_id: string
              p_name?: string
              p_description?: string
              p_is_available?: boolean
              p_consumption_note?: string
            }
          | {
              p_name: string
              p_description: string
              p_consumption_note: string
              p_is_available: boolean
              p_dosage: number
              p_unit: string
              p_id: string
            }
        Returns: undefined
      }
      update_patient_medical_info: {
        Args: {
          patient_id: string
          height_cm?: number
          weight_kg?: number
          blood_type?: string
          allergies?: string
          chronic_conditions?: string
          is_pregnant?: boolean
          mental_health_notes?: string
          substance_use_history?: string
          notes?: string
          updated_at?: string
        }
        Returns: boolean
      }
      update_screening_results: {
        Args: {
          appointment_id: string
          blood_pressure?: number
          height_cm?: number
          weight_kg?: number
          spo2?: number
          created_at?: string
        }
        Returns: undefined
      }
      update_specification: {
        Args: {
          id: number
          title?: string
          description?: string
          image_url?: string
        }
        Returns: boolean
      }
      update_test_results: {
        Args: { id: number; value?: number; notes?: string }
        Returns: undefined
      }
      update_test_type_details: {
        Args: {
          id: number
          name?: string
          description?: string
          upper_threshold?: number
          lower_threshold?: number
          unit?: string
          result_type?: Database["public"]["Enums"]["test_type"]
        }
        Returns: undefined
      }
      update_ticket_status: {
        Args: {
          ticket_id: string
          new_status: Database["public"]["Enums"]["ticket_status"]
        }
        Returns: undefined
      }
      urlencode: {
        Args: { data: Json } | { string: string } | { string: string }
        Returns: string
      }
      validate_daily_dosage_schedule: {
        Args: { p_json_of_dosage_schedule: Json }
        Returns: undefined
      }
    }
    Enums: {
      account_type: "staff" | "patient"
      appointment_status:
        | "pending"
        | "scheduled"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "no_show"
      medicine_timing:
        | "empty stomach"
        | "before meal"
        | "with meal"
        | "after meal"
      role: "customer" | "staff" | "doctor" | "manager" | "administrator"
      sex: "male" | "female" | "unspecified"
      staff_role: "doctor" | "staff" | "manager" | "admin"
      test_type: "numeric" | "boolean"
      ticket_interaction_type:
        | "create"
        | "forward"
        | "cancel"
        | "approve"
        | "other"
        | "comment"
        | "update"
        | "edit"
      ticket_status: "pending" | "cancelled" | "approved"
      ticket_type: "appointment" | "test" | "other"
      time_of_day: "morning" | "noon" | "afternoon" | "night" | "evening"
    }
    CompositeTypes: {
      http_header: {
        field: string | null
        value: string | null
      }
      http_request: {
        method: unknown | null
        uri: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content_type: string | null
        content: string | null
      }
      http_response: {
        status: number | null
        content_type: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content: string | null
      }
      test_info_type: {
        name: string | null
        description: string | null
        upper_threshold: number | null
        lower_threshold: number | null
        unit: string | null
        result_type: Database["public"]["Enums"]["test_type"] | null
      }
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
      account_type: ["staff", "patient"],
      appointment_status: [
        "pending",
        "scheduled",
        "in_progress",
        "completed",
        "cancelled",
        "no_show",
      ],
      medicine_timing: [
        "empty stomach",
        "before meal",
        "with meal",
        "after meal",
      ],
      role: ["customer", "staff", "doctor", "manager", "administrator"],
      sex: ["male", "female", "unspecified"],
      staff_role: ["doctor", "staff", "manager", "admin"],
      test_type: ["numeric", "boolean"],
      ticket_interaction_type: [
        "create",
        "forward",
        "cancel",
        "approve",
        "other",
        "comment",
        "update",
        "edit",
      ],
      ticket_status: ["pending", "cancelled", "approved"],
      ticket_type: ["appointment", "test", "other"],
      time_of_day: ["morning", "noon", "afternoon", "night", "evening"],
    },
  },
} as const
