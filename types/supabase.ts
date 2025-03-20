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
      countries: {
        Row: {
          id: string
          name: string
          passport_validity: string | null
          time_zone: string | null
          climate: string | null
          image: string | null // Ajout du champ image
        }
        Insert: {
          id?: string
          name: string
          passport_validity?: string | null
          time_zone?: string | null
          climate?: string | null
          image?: string | null // Ajout du champ image
        }
        Update: {
          id?: string
          name?: string
          passport_validity?: string | null
          time_zone?: string | null
          climate?: string | null
          image?: string | null // Ajout du champ image
        }
      }
      entry_requirements: {
        Row: {
          id: string
          country_id: string
          visa_required: boolean | null
          visa_duration: string | null
          visa_cost: string | null
          e_visa_available: boolean | null
          exemptions: string | null
        }
        Insert: {
          id?: string
          country_id: string
          visa_required?: boolean | null
          visa_duration?: string | null
          visa_cost?: string | null
          e_visa_available?: boolean | null
          exemptions?: string | null
        }
        Update: {
          id?: string
          country_id?: string
          visa_required?: boolean | null
          visa_duration?: string | null
          visa_cost?: string | null
          e_visa_available?: boolean | null
          exemptions?: string | null
        }
      }
      // Add other table definitions as needed
    }
  }
}
