// Tipos generados desde Supabase (proyecto Apps vdakfewjadwaczulcmvj).
// Regenerar con: Supabase MCP generate_typescript_types.
// NO editar a mano.

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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      aci_secciones: {
        Row: {
          body: string | null
          chapter: string | null
          created_at: string | null
          has_formula: boolean | null
          has_table: boolean | null
          id: number
          level: number | null
          norm_code: string
          page_end: number | null
          page_start: number | null
          parent_id: string | null
          section_id: string
          source_file: string | null
          title: string | null
          tsv: unknown
        }
        Insert: {
          body?: string | null
          chapter?: string | null
          created_at?: string | null
          has_formula?: boolean | null
          has_table?: boolean | null
          id?: number
          level?: number | null
          norm_code?: string
          page_end?: number | null
          page_start?: number | null
          parent_id?: string | null
          section_id: string
          source_file?: string | null
          title?: string | null
          tsv?: unknown
        }
        Update: {
          body?: string | null
          chapter?: string | null
          created_at?: string | null
          has_formula?: boolean | null
          has_table?: boolean | null
          id?: number
          level?: number | null
          norm_code?: string
          page_end?: number | null
          page_start?: number | null
          parent_id?: string | null
          section_id?: string
          source_file?: string | null
          title?: string | null
          tsv?: unknown
        }
        Relationships: []
      }
      aisc_secciones: {
        Row: {
          body: string | null
          chapter: string | null
          created_at: string | null
          has_formula: boolean | null
          has_table: boolean | null
          id: number
          level: number | null
          norm_code: string
          page_end: number | null
          page_start: number | null
          parent_id: string | null
          section_id: string
          source_file: string | null
          title: string | null
          tsv: unknown
        }
        Insert: {
          body?: string | null
          chapter?: string | null
          created_at?: string | null
          has_formula?: boolean | null
          has_table?: boolean | null
          id?: number
          level?: number | null
          norm_code?: string
          page_end?: number | null
          page_start?: number | null
          parent_id?: string | null
          section_id: string
          source_file?: string | null
          title?: string | null
          tsv?: unknown
        }
        Update: {
          body?: string | null
          chapter?: string | null
          created_at?: string | null
          has_formula?: boolean | null
          has_table?: boolean | null
          id?: number
          level?: number | null
          norm_code?: string
          page_end?: number | null
          page_start?: number | null
          parent_id?: string | null
          section_id?: string
          source_file?: string | null
          title?: string | null
          tsv?: unknown
        }
        Relationships: []
      }
      assignments: {
        Row: {
          assigned_by: string | null
          building_id: string | null
          created_at: string
          id: string
          inspector_id: string | null
          status: string | null
          zone: string | null
        }
        Insert: {
          assigned_by?: string | null
          building_id?: string | null
          created_at?: string
          id?: string
          inspector_id?: string | null
          status?: string | null
          zone?: string | null
        }
        Update: {
          assigned_by?: string | null
          building_id?: string | null
          created_at?: string
          id?: string
          inspector_id?: string | null
          status?: string | null
          zone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "inspectors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_inspector_id_fkey"
            columns: ["inspector_id"]
            isOneToOne: false
            referencedRelation: "inspectors"
            referencedColumns: ["id"]
          },
        ]
      }
      buildings: {
        Row: {
          address: string | null
          ciudad: string | null
          construction_type: string | null
          created_at: string
          estado: string | null
          footprint_area_m2: number | null
          geom: unknown
          id: string
          is_essential: boolean | null
          lat: number | null
          lng: number | null
          material: string | null
          municipio: string | null
          n_occupants: number | null
          n_semi_basements: number | null
          n_stories_above: number | null
          n_stories_below: number | null
          name: string | null
          occupancy_type: string | null
          sector_calle: string | null
          short_column: boolean | null
          soft_story: boolean | null
          year_built: number | null
        }
        Insert: {
          address?: string | null
          ciudad?: string | null
          construction_type?: string | null
          created_at?: string
          estado?: string | null
          footprint_area_m2?: number | null
          geom?: unknown
          id?: string
          is_essential?: boolean | null
          lat?: number | null
          lng?: number | null
          material?: string | null
          municipio?: string | null
          n_occupants?: number | null
          n_semi_basements?: number | null
          n_stories_above?: number | null
          n_stories_below?: number | null
          name?: string | null
          occupancy_type?: string | null
          sector_calle?: string | null
          short_column?: boolean | null
          soft_story?: boolean | null
          year_built?: number | null
        }
        Update: {
          address?: string | null
          ciudad?: string | null
          construction_type?: string | null
          created_at?: string
          estado?: string | null
          footprint_area_m2?: number | null
          geom?: unknown
          id?: string
          is_essential?: boolean | null
          lat?: number | null
          lng?: number | null
          material?: string | null
          municipio?: string | null
          n_occupants?: number | null
          n_semi_basements?: number | null
          n_stories_above?: number | null
          n_stories_below?: number | null
          name?: string | null
          occupancy_type?: string | null
          sector_calle?: string | null
          short_column?: boolean | null
          soft_story?: boolean | null
          year_built?: number | null
        }
        Relationships: []
      }
      cartillas: {
        Row: {
          id: string
          name: string
          order_num: number | null
          work_id: string
        }
        Insert: {
          id?: string
          name: string
          order_num?: number | null
          work_id: string
        }
        Update: {
          id?: string
          name?: string
          order_num?: number | null
          work_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cartillas_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "works"
            referencedColumns: ["id"]
          },
        ]
      }
      catalog_material: {
        Row: {
          code: string
          label: string
          sort: number
        }
        Insert: {
          code: string
          label: string
          sort?: number
        }
        Update: {
          code?: string
          label?: string
          sort?: number
        }
        Relationships: []
      }
      catalog_occupancy: {
        Row: {
          code: string
          label: string
          sort: number
        }
        Insert: {
          code: string
          label: string
          sort?: number
        }
        Update: {
          code?: string
          label?: string
          sort?: number
        }
        Relationships: []
      }
      cc_cities: {
        Row: {
          altitude: number | null
          department: string | null
          exposure: string | null
          id: number
          name: string
          region_id: number | null
          vb: number | null
        }
        Insert: {
          altitude?: number | null
          department?: string | null
          exposure?: string | null
          id: number
          name: string
          region_id?: number | null
          vb?: number | null
        }
        Update: {
          altitude?: number | null
          department?: string | null
          exposure?: string | null
          id?: number
          name?: string
          region_id?: number | null
          vb?: number | null
        }
        Relationships: []
      }
      cc_municipalities: {
        Row: {
          Aa: number | null
          Ad: number | null
          Ae: number | null
          altitud: number | null
          Av: number | null
          codigo_dane: string | null
          departamento: string | null
          fuente_sismo: string | null
          fuente_viento: string | null
          id: number
          lat: number | null
          lon: number | null
          municipio: string
          region_viento: number | null
          Vb: number | null
          zona_amenaza: string | null
        }
        Insert: {
          Aa?: number | null
          Ad?: number | null
          Ae?: number | null
          altitud?: number | null
          Av?: number | null
          codigo_dane?: string | null
          departamento?: string | null
          fuente_sismo?: string | null
          fuente_viento?: string | null
          id?: number
          lat?: number | null
          lon?: number | null
          municipio: string
          region_viento?: number | null
          Vb?: number | null
          zona_amenaza?: string | null
        }
        Update: {
          Aa?: number | null
          Ad?: number | null
          Ae?: number | null
          altitud?: number | null
          Av?: number | null
          codigo_dane?: string | null
          departamento?: string | null
          fuente_sismo?: string | null
          fuente_viento?: string | null
          id?: number
          lat?: number | null
          lon?: number | null
          municipio?: string
          region_viento?: number | null
          Vb?: number | null
          zona_amenaza?: string | null
        }
        Relationships: []
      }
      cc_steel_profiles: {
        Row: {
          area: number | null
          designation: string
          fy: number | null
          height: number | null
          id: string
          ix: number | null
          iy: number | null
          manufacturer: string
          rx: number | null
          ry: number | null
          sx: number | null
          sy: number | null
          thickness: number | null
          type: string
          weight: number | null
          width: number | null
          zx: number | null
          zy: number | null
        }
        Insert: {
          area?: number | null
          designation: string
          fy?: number | null
          height?: number | null
          id: string
          ix?: number | null
          iy?: number | null
          manufacturer: string
          rx?: number | null
          ry?: number | null
          sx?: number | null
          sy?: number | null
          thickness?: number | null
          type: string
          weight?: number | null
          width?: number | null
          zx?: number | null
          zy?: number | null
        }
        Update: {
          area?: number | null
          designation?: string
          fy?: number | null
          height?: number | null
          id?: string
          ix?: number | null
          iy?: number | null
          manufacturer?: string
          rx?: number | null
          ry?: number | null
          sx?: number | null
          sy?: number | null
          thickness?: number | null
          type?: string
          weight?: number | null
          width?: number | null
          zx?: number | null
          zy?: number | null
        }
        Relationships: []
      }
      elements: {
        Row: {
          cartilla_id: string
          id: string
          name: string
          order_num: number | null
          plan_code: string | null
          quantity: number | null
        }
        Insert: {
          cartilla_id: string
          id?: string
          name: string
          order_num?: number | null
          plan_code?: string | null
          quantity?: number | null
        }
        Update: {
          cartilla_id?: string
          id?: string
          name?: string
          order_num?: number | null
          plan_code?: string | null
          quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "elements_cartilla_id_fkey"
            columns: ["cartilla_id"]
            isOneToOne: false
            referencedRelation: "cartillas"
            referencedColumns: ["id"]
          },
        ]
      }
      embedding_cache: {
        Row: {
          created_at: string | null
          embedding: string | null
          query_hash: string
          query_text: string | null
        }
        Insert: {
          created_at?: string | null
          embedding?: string | null
          query_hash: string
          query_text?: string | null
        }
        Update: {
          created_at?: string | null
          embedding?: string | null
          query_hash?: string
          query_text?: string | null
        }
        Relationships: []
      }
      finding_photos: {
        Row: {
          ai_classification: Json | null
          annotation_json: Json | null
          caption: string | null
          captured_at: string | null
          crack_width_mm: number | null
          finding_id: string | null
          id: string
          inspection_id: string | null
          lat: number | null
          lng: number | null
          storage_path: string | null
        }
        Insert: {
          ai_classification?: Json | null
          annotation_json?: Json | null
          caption?: string | null
          captured_at?: string | null
          crack_width_mm?: number | null
          finding_id?: string | null
          id?: string
          inspection_id?: string | null
          lat?: number | null
          lng?: number | null
          storage_path?: string | null
        }
        Update: {
          ai_classification?: Json | null
          annotation_json?: Json | null
          caption?: string | null
          captured_at?: string | null
          crack_width_mm?: number | null
          finding_id?: string | null
          id?: string
          inspection_id?: string | null
          lat?: number | null
          lng?: number | null
          storage_path?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "finding_photos_finding_id_fkey"
            columns: ["finding_id"]
            isOneToOne: false
            referencedRelation: "inspection_findings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finding_photos_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "inspections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finding_photos_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "inspections_public"
            referencedColumns: ["id"]
          },
        ]
      }
      inspection_element_counts: {
        Row: {
          element_type: string
          id: string
          inspection_id: string
          n_examined: number | null
          n_moderate: number
          n_no_minor: number
          pct_moderate: number | null
        }
        Insert: {
          element_type: string
          id?: string
          inspection_id: string
          n_examined?: number | null
          n_moderate?: number
          n_no_minor?: number
          pct_moderate?: number | null
        }
        Update: {
          element_type?: string
          id?: string
          inspection_id?: string
          n_examined?: number | null
          n_moderate?: number
          n_no_minor?: number
          pct_moderate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inspection_element_counts_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "inspections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspection_element_counts_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "inspections_public"
            referencedColumns: ["id"]
          },
        ]
      }
      inspection_findings: {
        Row: {
          category: string
          element: string
          id: string
          inspection_id: string | null
          notes: string | null
          severity: string
        }
        Insert: {
          category: string
          element: string
          id?: string
          inspection_id?: string | null
          notes?: string | null
          severity: string
        }
        Update: {
          category?: string
          element?: string
          id?: string
          inspection_id?: string | null
          notes?: string | null
          severity?: string
        }
        Relationships: [
          {
            foreignKeyName: "inspection_findings_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "inspections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspection_findings_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "inspections_public"
            referencedColumns: ["id"]
          },
        ]
      }
      inspection_inspectors: {
        Row: {
          full_name: string | null
          id: string
          inspection_id: string
          inspector_id: string | null
          is_lead: boolean | null
          signature_storage_path: string | null
          signed_at: string | null
        }
        Insert: {
          full_name?: string | null
          id?: string
          inspection_id: string
          inspector_id?: string | null
          is_lead?: boolean | null
          signature_storage_path?: string | null
          signed_at?: string | null
        }
        Update: {
          full_name?: string | null
          id?: string
          inspection_id?: string
          inspector_id?: string | null
          is_lead?: boolean | null
          signature_storage_path?: string | null
          signed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inspection_inspectors_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "inspections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspection_inspectors_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "inspections_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspection_inspectors_inspector_id_fkey"
            columns: ["inspector_id"]
            isOneToOne: false
            referencedRelation: "inspectors"
            referencedColumns: ["id"]
          },
        ]
      }
      inspections: {
        Row: {
          access_members: string | null
          areas_inspected: string | null
          barricades_needed: boolean | null
          building_id: string | null
          client_uuid: string
          comp_elevators: string | null
          comp_slabs: string | null
          comp_tanks_antennas: string | null
          comp_utilities: string | null
          comp_walls_stairs_facades: string | null
          created_at: string
          critical_floor: string | null
          detailed_eval_recommended: string[] | null
          entry_restrictions: string | null
          estimated_damage_band: string | null
          evaluation_level: string
          event_date: string | null
          event_type: string | null
          ext_adjacent_danger: string | null
          ext_collapse: string | null
          ext_geo_danger: string | null
          ext_settlement: string | null
          ext_tilt: string | null
          floors_inspected: string | null
          gas_leak: boolean | null
          general_comments: string | null
          geom: unknown
          gps_accuracy_m: number | null
          id: string
          inspected_at: string
          inspector_id: string | null
          inspector_signature: string | null
          lat: number | null
          lng: number | null
          moderate_pct_estimated: number | null
          n_severe_beams: number | null
          n_severe_columns: number | null
          n_severe_concrete_walls: number | null
          n_severe_masonry_walls: number | null
          observations: string | null
          placard_final: string | null
          placard_override_reason: string | null
          placard_suggested: string | null
          planilla_no: string | null
          prevention_measures: string[] | null
          previous_placard: string | null
          risk_components: string | null
          risk_external: string | null
          risk_moderate: string | null
          risk_overall: string | null
          risk_severe: string | null
          sketch_storage_path: string | null
          sync_status: string
          time_end: string | null
          time_start: string | null
          updated_at: string
        }
        Insert: {
          access_members?: string | null
          areas_inspected?: string | null
          barricades_needed?: boolean | null
          building_id?: string | null
          client_uuid: string
          comp_elevators?: string | null
          comp_slabs?: string | null
          comp_tanks_antennas?: string | null
          comp_utilities?: string | null
          comp_walls_stairs_facades?: string | null
          created_at?: string
          critical_floor?: string | null
          detailed_eval_recommended?: string[] | null
          entry_restrictions?: string | null
          estimated_damage_band?: string | null
          evaluation_level?: string
          event_date?: string | null
          event_type?: string | null
          ext_adjacent_danger?: string | null
          ext_collapse?: string | null
          ext_geo_danger?: string | null
          ext_settlement?: string | null
          ext_tilt?: string | null
          floors_inspected?: string | null
          gas_leak?: boolean | null
          general_comments?: string | null
          geom?: unknown
          gps_accuracy_m?: number | null
          id?: string
          inspected_at: string
          inspector_id?: string | null
          inspector_signature?: string | null
          lat?: number | null
          lng?: number | null
          moderate_pct_estimated?: number | null
          n_severe_beams?: number | null
          n_severe_columns?: number | null
          n_severe_concrete_walls?: number | null
          n_severe_masonry_walls?: number | null
          observations?: string | null
          placard_final?: string | null
          placard_override_reason?: string | null
          placard_suggested?: string | null
          planilla_no?: string | null
          prevention_measures?: string[] | null
          previous_placard?: string | null
          risk_components?: string | null
          risk_external?: string | null
          risk_moderate?: string | null
          risk_overall?: string | null
          risk_severe?: string | null
          sketch_storage_path?: string | null
          sync_status?: string
          time_end?: string | null
          time_start?: string | null
          updated_at?: string
        }
        Update: {
          access_members?: string | null
          areas_inspected?: string | null
          barricades_needed?: boolean | null
          building_id?: string | null
          client_uuid?: string
          comp_elevators?: string | null
          comp_slabs?: string | null
          comp_tanks_antennas?: string | null
          comp_utilities?: string | null
          comp_walls_stairs_facades?: string | null
          created_at?: string
          critical_floor?: string | null
          detailed_eval_recommended?: string[] | null
          entry_restrictions?: string | null
          estimated_damage_band?: string | null
          evaluation_level?: string
          event_date?: string | null
          event_type?: string | null
          ext_adjacent_danger?: string | null
          ext_collapse?: string | null
          ext_geo_danger?: string | null
          ext_settlement?: string | null
          ext_tilt?: string | null
          floors_inspected?: string | null
          gas_leak?: boolean | null
          general_comments?: string | null
          geom?: unknown
          gps_accuracy_m?: number | null
          id?: string
          inspected_at?: string
          inspector_id?: string | null
          inspector_signature?: string | null
          lat?: number | null
          lng?: number | null
          moderate_pct_estimated?: number | null
          n_severe_beams?: number | null
          n_severe_columns?: number | null
          n_severe_concrete_walls?: number | null
          n_severe_masonry_walls?: number | null
          observations?: string | null
          placard_final?: string | null
          placard_override_reason?: string | null
          placard_suggested?: string | null
          planilla_no?: string | null
          prevention_measures?: string[] | null
          previous_placard?: string | null
          risk_components?: string | null
          risk_external?: string | null
          risk_moderate?: string | null
          risk_overall?: string | null
          risk_severe?: string | null
          sketch_storage_path?: string | null
          sync_status?: string
          time_end?: string | null
          time_start?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inspections_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspections_inspector_id_fkey"
            columns: ["inspector_id"]
            isOneToOne: false
            referencedRelation: "inspectors"
            referencedColumns: ["id"]
          },
        ]
      }
      inspectors: {
        Row: {
          created_at: string
          credential_level: number
          email: string | null
          full_name: string | null
          id: string
          is_anonymous: boolean
          national_id: string | null
          phone: string | null
          role: string
        }
        Insert: {
          created_at?: string
          credential_level?: number
          email?: string | null
          full_name?: string | null
          id: string
          is_anonymous?: boolean
          national_id?: string | null
          phone?: string | null
          role?: string
        }
        Update: {
          created_at?: string
          credential_level?: number
          email?: string | null
          full_name?: string | null
          id?: string
          is_anonymous?: boolean
          national_id?: string | null
          phone?: string | null
          role?: string
        }
        Relationships: []
      }
      kg_edges: {
        Row: {
          created_at: string | null
          edge_type: string
          equivalence_score: number | null
          id: string
          metadata: Json | null
          source_id: string
          target_id: string
          verified_by_expert: boolean | null
        }
        Insert: {
          created_at?: string | null
          edge_type: string
          equivalence_score?: number | null
          id: string
          metadata?: Json | null
          source_id: string
          target_id: string
          verified_by_expert?: boolean | null
        }
        Update: {
          created_at?: string | null
          edge_type?: string
          equivalence_score?: number | null
          id?: string
          metadata?: Json | null
          source_id?: string
          target_id?: string
          verified_by_expert?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "kg_edges_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "kg_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kg_edges_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "kg_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      kg_nodes: {
        Row: {
          content: string | null
          content_summary: string | null
          created_at: string | null
          embedding: string | null
          formula_latex: string | null
          formula_python: string | null
          formula_variables: Json | null
          hierarchy_depth: number | null
          id: string
          norm_code: string
          page_end: number | null
          page_start: number | null
          requirement_condition: string | null
          requirement_python_func: string | null
          search_vector: unknown
          section_path: string | null
          source_pdf: string | null
          table_headers: Json | null
          table_rows: Json | null
          table_sql_ref: string | null
          title: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          content_summary?: string | null
          created_at?: string | null
          embedding?: string | null
          formula_latex?: string | null
          formula_python?: string | null
          formula_variables?: Json | null
          hierarchy_depth?: number | null
          id: string
          norm_code: string
          page_end?: number | null
          page_start?: number | null
          requirement_condition?: string | null
          requirement_python_func?: string | null
          search_vector?: unknown
          section_path?: string | null
          source_pdf?: string | null
          table_headers?: Json | null
          table_rows?: Json | null
          table_sql_ref?: string | null
          title?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          content_summary?: string | null
          created_at?: string | null
          embedding?: string | null
          formula_latex?: string | null
          formula_python?: string | null
          formula_variables?: Json | null
          hierarchy_depth?: number | null
          id?: string
          norm_code?: string
          page_end?: number | null
          page_start?: number | null
          requirement_condition?: string | null
          requirement_python_func?: string | null
          search_vector?: unknown
          section_path?: string | null
          source_pdf?: string | null
          table_headers?: Json | null
          table_rows?: Json | null
          table_sql_ref?: string | null
          title?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      norm_crosslinks: {
        Row: {
          created_at: string | null
          id: number
          link_type: string | null
          note: string | null
          source_norm: string
          source_section: string | null
          target_norm: string
          target_section: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          link_type?: string | null
          note?: string | null
          source_norm: string
          source_section?: string | null
          target_norm: string
          target_section?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          link_type?: string | null
          note?: string | null
          source_norm?: string
          source_section?: string | null
          target_norm?: string
          target_section?: string | null
        }
        Relationships: []
      }
      norm_formulas: {
        Row: {
          created_at: string | null
          description: string | null
          formula_id: string | null
          id: number
          latex: string | null
          norm_code: string
          page: number | null
          python_code: string | null
          section_id: string | null
          source_file: string | null
          units: string | null
          variables: Json | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          formula_id?: string | null
          id?: number
          latex?: string | null
          norm_code: string
          page?: number | null
          python_code?: string | null
          section_id?: string | null
          source_file?: string | null
          units?: string | null
          variables?: Json | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          formula_id?: string | null
          id?: number
          latex?: string | null
          norm_code?: string
          page?: number | null
          python_code?: string | null
          section_id?: string | null
          source_file?: string | null
          units?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
      norm_metadata: {
        Row: {
          applicability: string | null
          country: string | null
          created_at: string | null
          decree_numbers: string[] | null
          edition: string | null
          effective_date: string | null
          expiration_date: string | null
          extraction_date: string | null
          extraction_notes: string | null
          extraction_status: string | null
          extraction_version: string | null
          full_title: string
          id: string
          issuer: string | null
          issuing_body: string | null
          language: string | null
          last_update_date: string | null
          legal_basis: string | null
          norm_code: string
          publication_date: string | null
          referenced_by: string[] | null
          references_norms: string[] | null
          scope: string | null
          short_title: string | null
          status: string | null
          superseded_by: string | null
          supersedes: string[] | null
          titles: Json | null
          total_pages: number | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          applicability?: string | null
          country?: string | null
          created_at?: string | null
          decree_numbers?: string[] | null
          edition?: string | null
          effective_date?: string | null
          expiration_date?: string | null
          extraction_date?: string | null
          extraction_notes?: string | null
          extraction_status?: string | null
          extraction_version?: string | null
          full_title: string
          id?: string
          issuer?: string | null
          issuing_body?: string | null
          language?: string | null
          last_update_date?: string | null
          legal_basis?: string | null
          norm_code: string
          publication_date?: string | null
          referenced_by?: string[] | null
          references_norms?: string[] | null
          scope?: string | null
          short_title?: string | null
          status?: string | null
          superseded_by?: string | null
          supersedes?: string[] | null
          titles?: Json | null
          total_pages?: number | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          applicability?: string | null
          country?: string | null
          created_at?: string | null
          decree_numbers?: string[] | null
          edition?: string | null
          effective_date?: string | null
          expiration_date?: string | null
          extraction_date?: string | null
          extraction_notes?: string | null
          extraction_status?: string | null
          extraction_version?: string | null
          full_title?: string
          id?: string
          issuer?: string | null
          issuing_body?: string | null
          language?: string | null
          last_update_date?: string | null
          legal_basis?: string | null
          norm_code?: string
          publication_date?: string | null
          referenced_by?: string[] | null
          references_norms?: string[] | null
          scope?: string | null
          short_title?: string | null
          status?: string | null
          superseded_by?: string | null
          supersedes?: string[] | null
          titles?: Json | null
          total_pages?: number | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: []
      }
      norm_property_tables: {
        Row: {
          created_at: string | null
          data: Json | null
          id: number
          norm_code: string
          page: number | null
          section_id: string | null
          source_file: string | null
          table_id: string | null
          title: string | null
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: number
          norm_code: string
          page?: number | null
          section_id?: string | null
          source_file?: string | null
          table_id?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: number
          norm_code?: string
          page?: number | null
          section_id?: string | null
          source_file?: string | null
          table_id?: string | null
          title?: string | null
        }
        Relationships: []
      }
      nsr10_acero_alta_temperatura: {
        Row: {
          id: number
          ke: number | null
          kp: number | null
          ky: number | null
          tabla_ref: string | null
          temperatura_c: number | null
        }
        Insert: {
          id?: number
          ke?: number | null
          kp?: number | null
          ky?: number | null
          tabla_ref?: string | null
          temperatura_c?: number | null
        }
        Update: {
          id?: number
          ke?: number | null
          kp?: number | null
          ky?: number | null
          tabla_ref?: string | null
          temperatura_c?: number | null
        }
        Relationships: []
      }
      nsr10_acero_arriostramiento: {
        Row: {
          beta_formula: string | null
          id: number
          pbr_formula: string | null
          requisito: string
          tabla_ref: string | null
          tipo: string
        }
        Insert: {
          beta_formula?: string | null
          id?: number
          pbr_formula?: string | null
          requisito: string
          tabla_ref?: string | null
          tipo: string
        }
        Update: {
          beta_formula?: string | null
          id?: number
          pbr_formula?: string | null
          requisito?: string
          tabla_ref?: string | null
          tipo?: string
        }
        Relationships: []
      }
      nsr10_acero_atiesadores_esbeltez: {
        Row: {
          elemento: string | null
          id: number
          lambda_p: string | null
          lambda_r: string | null
          tabla_ref: string | null
        }
        Insert: {
          elemento?: string | null
          id?: number
          lambda_p?: string | null
          lambda_r?: string | null
          tabla_ref?: string | null
        }
        Update: {
          elemento?: string | null
          id?: number
          lambda_p?: string | null
          lambda_r?: string | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_acero_clasificacion: {
        Row: {
          caso: string
          descripcion: string | null
          elemento: string | null
          id: number
          lambda_p: string | null
          lambda_r: string | null
          tabla_ref: string | null
        }
        Insert: {
          caso: string
          descripcion?: string | null
          elemento?: string | null
          id?: number
          lambda_p?: string | null
          lambda_r?: string | null
          tabla_ref?: string | null
        }
        Update: {
          caso?: string
          descripcion?: string | null
          elemento?: string | null
          id?: number
          lambda_p?: string | null
          lambda_r?: string | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_acero_columnas_compuestas: {
        Row: {
          as_min: string | null
          espaciamiento_conectores: string | null
          espesor_recub_min_mm: number | null
          id: number
          requisitos: string | null
          tabla_ref: string | null
          tipo: string
        }
        Insert: {
          as_min?: string | null
          espaciamiento_conectores?: string | null
          espesor_recub_min_mm?: number | null
          id?: number
          requisitos?: string | null
          tabla_ref?: string | null
          tipo: string
        }
        Update: {
          as_min?: string | null
          espaciamiento_conectores?: string | null
          espesor_recub_min_mm?: number | null
          id?: number
          requisitos?: string | null
          tabla_ref?: string | null
          tipo?: string
        }
        Relationships: []
      }
      nsr10_acero_compresion_esbelta: {
        Row: {
          elemento: string
          factor_reduccion: string | null
          formula: string | null
          id: number
          limite_esbeltez: string | null
          tabla_ref: string | null
        }
        Insert: {
          elemento: string
          factor_reduccion?: string | null
          formula?: string | null
          id?: number
          limite_esbeltez?: string | null
          tabla_ref?: string | null
        }
        Update: {
          elemento?: string
          factor_reduccion?: string | null
          formula?: string | null
          id?: number
          limite_esbeltez?: string | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_acero_conexiones_hss: {
        Row: {
          configuracion: string | null
          id: number
          limites: string | null
          pn_formula: string | null
          tabla_ref: string | null
          tipo_conexion: string
        }
        Insert: {
          configuracion?: string | null
          id?: number
          limites?: string | null
          pn_formula?: string | null
          tabla_ref?: string | null
          tipo_conexion: string
        }
        Update: {
          configuracion?: string | null
          id?: number
          limites?: string | null
          pn_formula?: string | null
          tabla_ref?: string | null
          tipo_conexion?: string
        }
        Relationships: []
      }
      nsr10_acero_distancia_borde: {
        Row: {
          diametro_perno: string
          distancia_min_mm: number | null
          id: number
          tabla_ref: string | null
        }
        Insert: {
          diametro_perno: string
          distancia_min_mm?: number | null
          id?: number
          tabla_ref?: string | null
        }
        Update: {
          diametro_perno?: string
          distancia_min_mm?: number | null
          id?: number
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_acero_esbeltez: {
        Row: {
          elemento: string
          formula: string | null
          id: number
          lambda_limite: string | null
          tabla_ref: string | null
          tipo: string
        }
        Insert: {
          elemento: string
          formula?: string | null
          id?: number
          lambda_limite?: string | null
          tabla_ref?: string | null
          tipo: string
        }
        Update: {
          elemento?: string
          formula?: string | null
          id?: number
          lambda_limite?: string | null
          tabla_ref?: string | null
          tipo?: string
        }
        Relationships: []
      }
      nsr10_acero_esbeltez_compresion: {
        Row: {
          caso: string | null
          elemento: string | null
          id: number
          lambda_r: string | null
          tabla_ref: string | null
        }
        Insert: {
          caso?: string | null
          elemento?: string | null
          id?: number
          lambda_r?: string | null
          tabla_ref?: string | null
        }
        Update: {
          caso?: string | null
          elemento?: string | null
          id?: number
          lambda_r?: string | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_acero_esbeltez_flexion: {
        Row: {
          caso: string | null
          elemento: string | null
          id: number
          lambda_p: string | null
          lambda_r: string | null
          tabla_ref: string | null
        }
        Insert: {
          caso?: string | null
          elemento?: string | null
          id?: number
          lambda_p?: string | null
          lambda_r?: string | null
          tabla_ref?: string | null
        }
        Update: {
          caso?: string | null
          elemento?: string | null
          id?: number
          lambda_p?: string | null
          lambda_r?: string | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_acero_especificaciones: {
        Row: {
          aplicacion: string | null
          categoria: string
          fu_mpa: number | null
          fy_mpa: number | null
          grado: string | null
          id: number
          norma: string
          tabla_ref: string | null
        }
        Insert: {
          aplicacion?: string | null
          categoria: string
          fu_mpa?: number | null
          fy_mpa?: number | null
          grado?: string | null
          id?: number
          norma: string
          tabla_ref?: string | null
        }
        Update: {
          aplicacion?: string | null
          categoria?: string
          fu_mpa?: number | null
          fy_mpa?: number | null
          grado?: string | null
          id?: number
          norma?: string
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_acero_fatiga: {
        Row: {
          categoria: string
          constante_cf: number | null
          descripcion: string | null
          fsr_mpa: number | null
          id: number
          tabla_ref: string | null
          umbral_fth: number | null
        }
        Insert: {
          categoria: string
          constante_cf?: number | null
          descripcion?: string | null
          fsr_mpa?: number | null
          id?: number
          tabla_ref?: string | null
          umbral_fth?: number | null
        }
        Update: {
          categoria?: string
          constante_cf?: number | null
          descripcion?: string | null
          fsr_mpa?: number | null
          id?: number
          tabla_ref?: string | null
          umbral_fth?: number | null
        }
        Relationships: []
      }
      nsr10_acero_fatiga_parametros: {
        Row: {
          categoria: string | null
          cf: number | null
          descripcion: string | null
          fth_mpa: number | null
          id: number
          tabla_ref: string | null
        }
        Insert: {
          categoria?: string | null
          cf?: number | null
          descripcion?: string | null
          fth_mpa?: number | null
          id?: number
          tabla_ref?: string | null
        }
        Update: {
          categoria?: string | null
          cf?: number | null
          descripcion?: string | null
          fth_mpa?: number | null
          id?: number
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_acero_flexion: {
        Row: {
          caso: string
          condicion: string | null
          estado_limite: string | null
          id: number
          mn_formula: string | null
          seccion: string
          tabla_ref: string | null
        }
        Insert: {
          caso: string
          condicion?: string | null
          estado_limite?: string | null
          id?: number
          mn_formula?: string | null
          seccion: string
          tabla_ref?: string | null
        }
        Update: {
          caso?: string
          condicion?: string | null
          estado_limite?: string | null
          id?: number
          mn_formula?: string | null
          seccion?: string
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_acero_hss_armadura_circ: {
        Row: {
          estado_limite: string | null
          formula: string | null
          id: number
          phi: number | null
          tabla_ref: string | null
          tipo: string | null
        }
        Insert: {
          estado_limite?: string | null
          formula?: string | null
          id?: number
          phi?: number | null
          tabla_ref?: string | null
          tipo?: string | null
        }
        Update: {
          estado_limite?: string | null
          formula?: string | null
          id?: number
          phi?: number | null
          tabla_ref?: string | null
          tipo?: string | null
        }
        Relationships: []
      }
      nsr10_acero_hss_armadura_rect: {
        Row: {
          estado_limite: string | null
          formula: string | null
          id: number
          phi: number | null
          tabla_ref: string | null
          tipo: string | null
        }
        Insert: {
          estado_limite?: string | null
          formula?: string | null
          id?: number
          phi?: number | null
          tabla_ref?: string | null
          tipo?: string | null
        }
        Update: {
          estado_limite?: string | null
          formula?: string | null
          id?: number
          phi?: number | null
          tabla_ref?: string | null
          tipo?: string | null
        }
        Relationships: []
      }
      nsr10_acero_hss_platina_circ: {
        Row: {
          estado_limite: string | null
          formula_phi_rn: string | null
          id: number
          phi: number | null
          tabla_ref: string | null
          tipo_conexion: string | null
        }
        Insert: {
          estado_limite?: string | null
          formula_phi_rn?: string | null
          id?: number
          phi?: number | null
          tabla_ref?: string | null
          tipo_conexion?: string | null
        }
        Update: {
          estado_limite?: string | null
          formula_phi_rn?: string | null
          id?: number
          phi?: number | null
          tabla_ref?: string | null
          tipo_conexion?: string | null
        }
        Relationships: []
      }
      nsr10_acero_hss_platina_rect: {
        Row: {
          estado_limite: string | null
          formula_phi_rn: string | null
          id: number
          phi: number | null
          tabla_ref: string | null
          tipo_conexion: string | null
        }
        Insert: {
          estado_limite?: string | null
          formula_phi_rn?: string | null
          id?: number
          phi?: number | null
          tabla_ref?: string | null
          tipo_conexion?: string | null
        }
        Update: {
          estado_limite?: string | null
          formula_phi_rn?: string | null
          id?: number
          phi?: number | null
          tabla_ref?: string | null
          tipo_conexion?: string | null
        }
        Relationships: []
      }
      nsr10_acero_incendio: {
        Row: {
          e_factor: number | null
          fy_factor: number | null
          id: number
          material: string
          tabla_ref: string | null
          temperatura_c: number | null
        }
        Insert: {
          e_factor?: number | null
          fy_factor?: number | null
          id?: number
          material: string
          tabla_ref?: string | null
          temperatura_c?: number | null
        }
        Update: {
          e_factor?: number | null
          fy_factor?: number | null
          id?: number
          material?: string
          tabla_ref?: string | null
          temperatura_c?: number | null
        }
        Relationships: []
      }
      nsr10_acero_inspeccion_postsoldadura: {
        Row: {
          actividad: string | null
          categoria_a: string | null
          categoria_b: string | null
          fase: string | null
          id: number
          tabla_ref: string | null
        }
        Insert: {
          actividad?: string | null
          categoria_a?: string | null
          categoria_b?: string | null
          fase?: string | null
          id?: number
          tabla_ref?: string | null
        }
        Update: {
          actividad?: string | null
          categoria_a?: string | null
          categoria_b?: string | null
          fase?: string | null
          id?: number
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_acero_inspeccion_presoldadura: {
        Row: {
          actividad: string | null
          categoria_a: string | null
          categoria_b: string | null
          fase: string | null
          id: number
          tabla_ref: string | null
        }
        Insert: {
          actividad?: string | null
          categoria_a?: string | null
          categoria_b?: string | null
          fase?: string | null
          id?: number
          tabla_ref?: string | null
        }
        Update: {
          actividad?: string | null
          categoria_a?: string | null
          categoria_b?: string | null
          fase?: string | null
          id?: number
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_acero_inspeccion_soldadura: {
        Row: {
          actividad: string | null
          categoria_a: string | null
          categoria_b: string | null
          fase: string | null
          id: number
          tabla_ref: string | null
        }
        Insert: {
          actividad?: string | null
          categoria_a?: string | null
          categoria_b?: string | null
          fase?: string | null
          id?: number
          tabla_ref?: string | null
        }
        Update: {
          actividad?: string | null
          categoria_a?: string | null
          categoria_b?: string | null
          fase?: string | null
          id?: number
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_acero_lamina_anchoesp: {
        Row: {
          caso: string | null
          condicion: string | null
          id: number
          tabla_ref: string | null
          valor_max: string | null
        }
        Insert: {
          caso?: string | null
          condicion?: string | null
          id?: number
          tabla_ref?: string | null
          valor_max?: string | null
        }
        Update: {
          caso?: string | null
          condicion?: string | null
          id?: number
          tabla_ref?: string | null
          valor_max?: string | null
        }
        Relationships: []
      }
      nsr10_acero_lamina_anchos: {
        Row: {
          be_formula: string | null
          condicion: string | null
          id: number
          limite: string | null
          tabla_ref: string | null
          tipo_elemento: string
        }
        Insert: {
          be_formula?: string | null
          condicion?: string | null
          id?: number
          limite?: string | null
          tabla_ref?: string | null
          tipo_elemento: string
        }
        Update: {
          be_formula?: string | null
          condicion?: string | null
          id?: number
          limite?: string | null
          tabla_ref?: string | null
          tipo_elemento?: string
        }
        Relationships: []
      }
      nsr10_acero_lamina_armadas: {
        Row: {
          d_eq_formula: string | null
          id: number
          r: number | null
          seccion: string | null
          tabla_ref: string | null
        }
        Insert: {
          d_eq_formula?: string | null
          id?: number
          r?: number | null
          seccion?: string | null
          tabla_ref?: string | null
        }
        Update: {
          d_eq_formula?: string | null
          id?: number
          r?: number | null
          seccion?: string | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_acero_lamina_delgada: {
        Row: {
          aplicacion: string | null
          formula: string | null
          id: number
          parametro: string
          seccion_ref: string
          tabla_ref: string | null
          valor: string | null
        }
        Insert: {
          aplicacion?: string | null
          formula?: string | null
          id?: number
          parametro: string
          seccion_ref: string
          tabla_ref?: string | null
          valor?: string | null
        }
        Update: {
          aplicacion?: string | null
          formula?: string | null
          id?: number
          parametro?: string
          seccion_ref?: string
          tabla_ref?: string | null
          valor?: string | null
        }
        Relationships: []
      }
      nsr10_acero_lamina_diafragmas: {
        Row: {
          id: number
          omega: number | null
          phi: number | null
          tabla_ref: string | null
          tipo_diafragma: string | null
        }
        Insert: {
          id?: number
          omega?: number | null
          phi?: number | null
          tabla_ref?: string | null
          tipo_diafragma?: string | null
        }
        Update: {
          id?: number
          omega?: number | null
          phi?: number | null
          tabla_ref?: string | null
          tipo_diafragma?: string | null
        }
        Relationships: []
      }
      nsr10_acero_lamina_pandeo_k: {
        Row: {
          condicion_borde: string | null
          id: number
          k: number | null
          tabla_ref: string | null
          tipo: string | null
        }
        Insert: {
          condicion_borde?: string | null
          id?: number
          k?: number | null
          tabla_ref?: string | null
          tipo?: string | null
        }
        Update: {
          condicion_borde?: string | null
          id?: number
          k?: number | null
          tabla_ref?: string | null
          tipo?: string | null
        }
        Relationships: []
      }
      nsr10_acero_lamina_r_cz: {
        Row: {
          caso: string | null
          id: number
          r: number | null
          tabla_ref: string | null
        }
        Insert: {
          caso?: string | null
          id?: number
          r?: number | null
          tabla_ref?: string | null
        }
        Update: {
          caso?: string | null
          id?: number
          r?: number | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_acero_longitud_k: {
        Row: {
          condicion_apoyo: string
          diagrama: string | null
          id: number
          k_recomendado: number | null
          k_teorico: number | null
          tabla_ref: string | null
        }
        Insert: {
          condicion_apoyo: string
          diagrama?: string | null
          id?: number
          k_recomendado?: number | null
          k_teorico?: number | null
          tabla_ref?: string | null
        }
        Update: {
          condicion_apoyo?: string
          diagrama?: string | null
          id?: number
          k_recomendado?: number | null
          k_teorico?: number | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_acero_materiales: {
        Row: {
          fu_mpa: number | null
          fy_mpa: number | null
          grado: string | null
          id: number
          norma: string
          tabla_ref: string | null
          uso: string | null
        }
        Insert: {
          fu_mpa?: number | null
          fy_mpa?: number | null
          grado?: string | null
          id?: number
          norma: string
          tabla_ref?: string | null
          uso?: string | null
        }
        Update: {
          fu_mpa?: number | null
          fy_mpa?: number | null
          grado?: string | null
          id?: number
          norma?: string
          tabla_ref?: string | null
          uso?: string | null
        }
        Relationships: []
      }
      nsr10_acero_pandeo_torsion: {
        Row: {
          caso: string | null
          formula_fe: string | null
          id: number
          tabla_ref: string | null
        }
        Insert: {
          caso?: string | null
          formula_fe?: string | null
          id?: number
          tabla_ref?: string | null
        }
        Update: {
          caso?: string | null
          formula_fe?: string | null
          id?: number
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_acero_perfiles: {
        Row: {
          area_cm2: number | null
          designacion: string
          id: number
          ix_cm4: number | null
          iy_cm4: number | null
          peso_kg_m: number | null
          rx_cm: number | null
          ry_cm: number | null
          tipo: string
          zx_cm3: number | null
          zy_cm3: number | null
        }
        Insert: {
          area_cm2?: number | null
          designacion: string
          id?: number
          ix_cm4?: number | null
          iy_cm4?: number | null
          peso_kg_m?: number | null
          rx_cm?: number | null
          ry_cm?: number | null
          tipo: string
          zx_cm3?: number | null
          zy_cm3?: number | null
        }
        Update: {
          area_cm2?: number | null
          designacion?: string
          id?: number
          ix_cm4?: number | null
          iy_cm4?: number | null
          peso_kg_m?: number | null
          rx_cm?: number | null
          ry_cm?: number | null
          tipo?: string
          zx_cm3?: number | null
          zy_cm3?: number | null
        }
        Relationships: []
      }
      nsr10_acero_perforaciones: {
        Row: {
          corta_slot: string | null
          diametro_perno: string
          estandar: string | null
          id: number
          larga_slot: string | null
          sobredimensionada: string | null
          tabla_ref: string | null
        }
        Insert: {
          corta_slot?: string | null
          diametro_perno: string
          estandar?: string | null
          id?: number
          larga_slot?: string | null
          sobredimensionada?: string | null
          tabla_ref?: string | null
        }
        Update: {
          corta_slot?: string | null
          diametro_perno?: string
          estandar?: string | null
          id?: number
          larga_slot?: string | null
          sobredimensionada?: string | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_acero_pernos_resist: {
        Row: {
          fnt_mpa: number | null
          fnv_mpa: number | null
          id: number
          tabla_ref: string | null
          tipo_perno: string
        }
        Insert: {
          fnt_mpa?: number | null
          fnv_mpa?: number | null
          id?: number
          tabla_ref?: string | null
          tipo_perno: string
        }
        Update: {
          fnt_mpa?: number | null
          fnv_mpa?: number | null
          id?: number
          tabla_ref?: string | null
          tipo_perno?: string
        }
        Relationships: []
      }
      nsr10_acero_pernos_tension: {
        Row: {
          diametro_mm: number | null
          diametro_pulg: string
          id: number
          tabla_ref: string | null
          tension_min_kn: number | null
        }
        Insert: {
          diametro_mm?: number | null
          diametro_pulg: string
          id?: number
          tabla_ref?: string | null
          tension_min_kn?: number | null
        }
        Update: {
          diametro_mm?: number | null
          diametro_pulg?: string
          id?: number
          tabla_ref?: string | null
          tension_min_kn?: number | null
        }
        Relationships: []
      }
      nsr10_acero_phi: {
        Row: {
          estado_limite: string
          id: number
          phi: number
          tabla_ref: string | null
        }
        Insert: {
          estado_limite: string
          id?: number
          phi: number
          tabla_ref?: string | null
        }
        Update: {
          estado_limite?: string
          id?: number
          phi?: number
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_acero_rezago_cortante: {
        Row: {
          conexion: string | null
          id: number
          tabla_ref: string | null
          tipo_seccion: string | null
          u: string | null
        }
        Insert: {
          conexion?: string | null
          id?: number
          tabla_ref?: string | null
          tipo_seccion?: string | null
          u?: string | null
        }
        Update: {
          conexion?: string | null
          id?: number
          tabla_ref?: string | null
          tipo_seccion?: string | null
          u?: string | null
        }
        Relationships: []
      }
      nsr10_acero_rigidizadores: {
        Row: {
          formula: string | null
          id: number
          notas: string | null
          requisito: string
          tabla_ref: string | null
          tipo: string
        }
        Insert: {
          formula?: string | null
          id?: number
          notas?: string | null
          requisito: string
          tabla_ref?: string | null
          tipo: string
        }
        Update: {
          formula?: string | null
          id?: number
          notas?: string | null
          requisito?: string
          tabla_ref?: string | null
          tipo?: string
        }
        Relationships: []
      }
      nsr10_acero_seleccion_compresion: {
        Row: {
          id: number
          numeral_compacta: string | null
          numeral_esbelta: string | null
          seccion: string | null
          tabla_ref: string | null
        }
        Insert: {
          id?: number
          numeral_compacta?: string | null
          numeral_esbelta?: string | null
          seccion?: string | null
          tabla_ref?: string | null
        }
        Update: {
          id?: number
          numeral_compacta?: string | null
          numeral_esbelta?: string | null
          seccion?: string | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_acero_seleccion_flexion: {
        Row: {
          id: number
          numeral: string | null
          seccion: string | null
          tabla_ref: string | null
        }
        Insert: {
          id?: number
          numeral?: string | null
          seccion?: string | null
          tabla_ref?: string | null
        }
        Update: {
          id?: number
          numeral?: string | null
          seccion?: string | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_acero_sismico: {
        Row: {
          des: string | null
          dmo: string | null
          id: number
          requisito: string
          seccion_ref: string | null
          sistema: string
        }
        Insert: {
          des?: string | null
          dmo?: string | null
          id?: number
          requisito: string
          seccion_ref?: string | null
          sistema: string
        }
        Update: {
          des?: string | null
          dmo?: string | null
          id?: number
          requisito?: string
          seccion_ref?: string | null
          sistema?: string
        }
        Relationships: []
      }
      nsr10_acero_sismico_sistemas: {
        Row: {
          cd: number | null
          id: number
          omega0: number | null
          r0: number | null
          sistema: string | null
          tabla_ref: string | null
        }
        Insert: {
          cd?: number | null
          id?: number
          omega0?: number | null
          r0?: number | null
          sistema?: string | null
          tabla_ref?: string | null
        }
        Update: {
          cd?: number | null
          id?: number
          omega0?: number | null
          r0?: number | null
          sistema?: string | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_acero_sismico_zonas: {
        Row: {
          elemento: string | null
          id: number
          longitud: string | null
          sistema: string | null
          tabla_ref: string | null
          zona_protegida: string | null
        }
        Insert: {
          elemento?: string | null
          id?: number
          longitud?: string | null
          sistema?: string | null
          tabla_ref?: string | null
          zona_protegida?: string | null
        }
        Update: {
          elemento?: string | null
          id?: number
          longitud?: string | null
          sistema?: string | null
          tabla_ref?: string | null
          zona_protegida?: string | null
        }
        Relationships: []
      }
      nsr10_acero_sistemas_sismicos: {
        Row: {
          altura_max_m: number | null
          cd: number | null
          id: number
          limitaciones: string | null
          omega0: number | null
          r0: number | null
          sistema: string
          tabla_ref: string | null
        }
        Insert: {
          altura_max_m?: number | null
          cd?: number | null
          id?: number
          limitaciones?: string | null
          omega0?: number | null
          r0?: number | null
          sistema: string
          tabla_ref?: string | null
        }
        Update: {
          altura_max_m?: number | null
          cd?: number | null
          id?: number
          limitaciones?: string | null
          omega0?: number | null
          r0?: number | null
          sistema?: string
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_acero_soldadura_filete: {
        Row: {
          espesor_max_mm: number | null
          espesor_min_mm: number | null
          id: number
          tabla_ref: string | null
          tamano_min_mm: number | null
        }
        Insert: {
          espesor_max_mm?: number | null
          espesor_min_mm?: number | null
          id?: number
          tabla_ref?: string | null
          tamano_min_mm?: number | null
        }
        Update: {
          espesor_max_mm?: number | null
          espesor_min_mm?: number | null
          id?: number
          tabla_ref?: string | null
          tamano_min_mm?: number | null
        }
        Relationships: []
      }
      nsr10_acero_soldadura_garganta: {
        Row: {
          angulo_bisel: string | null
          formula: string | null
          garganta_efectiva: string | null
          id: number
          tabla_ref: string | null
          tipo_soldadura: string
        }
        Insert: {
          angulo_bisel?: string | null
          formula?: string | null
          garganta_efectiva?: string | null
          id?: number
          tabla_ref?: string | null
          tipo_soldadura: string
        }
        Update: {
          angulo_bisel?: string | null
          formula?: string | null
          garganta_efectiva?: string | null
          id?: number
          tabla_ref?: string | null
          tipo_soldadura?: string
        }
        Relationships: []
      }
      nsr10_acero_soldadura_precal: {
        Row: {
          id: number
          posicion: string | null
          preparacion: string | null
          proceso: string | null
          tabla_ref: string | null
          tipo_junta: string
        }
        Insert: {
          id?: number
          posicion?: string | null
          preparacion?: string | null
          proceso?: string | null
          tabla_ref?: string | null
          tipo_junta: string
        }
        Update: {
          id?: number
          posicion?: string | null
          preparacion?: string | null
          proceso?: string | null
          tabla_ref?: string | null
          tipo_junta?: string
        }
        Relationships: []
      }
      nsr10_acero_soldadura_resist: {
        Row: {
          fnw: string | null
          id: number
          phi: number | null
          tabla_ref: string | null
          tipo_carga: string
          tipo_soldadura: string
        }
        Insert: {
          fnw?: string | null
          id?: number
          phi?: number | null
          tabla_ref?: string | null
          tipo_carga: string
          tipo_soldadura: string
        }
        Update: {
          fnw?: string | null
          id?: number
          phi?: number | null
          tabla_ref?: string | null
          tipo_carga?: string
          tipo_soldadura?: string
        }
        Relationships: []
      }
      nsr10_acero_tubos: {
        Row: {
          area_cm2: number | null
          d_ext_mm: number | null
          designacion: string | null
          espesor_mm: number | null
          i_cm4: number | null
          id: number
          peso_kg_m: number | null
          tabla_ref: string | null
          tipo_tubo: string
          z_cm3: number | null
        }
        Insert: {
          area_cm2?: number | null
          d_ext_mm?: number | null
          designacion?: string | null
          espesor_mm?: number | null
          i_cm4?: number | null
          id?: number
          peso_kg_m?: number | null
          tabla_ref?: string | null
          tipo_tubo: string
          z_cm3?: number | null
        }
        Update: {
          area_cm2?: number | null
          d_ext_mm?: number | null
          designacion?: string | null
          espesor_mm?: number | null
          i_cm4?: number | null
          id?: number
          peso_kg_m?: number | null
          tabla_ref?: string | null
          tipo_tubo?: string
          z_cm3?: number | null
        }
        Relationships: []
      }
      nsr10_acero_tubos_conexiones: {
        Row: {
          configuracion: string | null
          formula: string | null
          id: number
          limite_beta: string | null
          limite_gamma: string | null
          phi: number | null
          tabla_ref: string | null
          tipo_conexion: string
        }
        Insert: {
          configuracion?: string | null
          formula?: string | null
          id?: number
          limite_beta?: string | null
          limite_gamma?: string | null
          phi?: number | null
          tabla_ref?: string | null
          tipo_conexion: string
        }
        Update: {
          configuracion?: string | null
          formula?: string | null
          id?: number
          limite_beta?: string | null
          limite_gamma?: string | null
          phi?: number | null
          tabla_ref?: string | null
          tipo_conexion?: string
        }
        Relationships: []
      }
      nsr10_acero_tubos_diseño: {
        Row: {
          dimensiones: string | null
          forma: string
          fy_mpa: number | null
          id: number
          phi_mn_knm: number | null
          phi_pn_kn: number | null
          phi_vn_kn: number | null
          tabla_ref: string | null
        }
        Insert: {
          dimensiones?: string | null
          forma: string
          fy_mpa?: number | null
          id?: number
          phi_mn_knm?: number | null
          phi_pn_kn?: number | null
          phi_vn_kn?: number | null
          tabla_ref?: string | null
        }
        Update: {
          dimensiones?: string | null
          forma?: string
          fy_mpa?: number | null
          id?: number
          phi_mn_knm?: number | null
          phi_pn_kn?: number | null
          phi_vn_kn?: number | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_acero_zonas_protegidas: {
        Row: {
          id: number
          longitud: string | null
          restricciones: string | null
          sistema: string
          tabla_ref: string | null
          ubicacion: string
        }
        Insert: {
          id?: number
          longitud?: string | null
          restricciones?: string | null
          sistema: string
          tabla_ref?: string | null
          ubicacion: string
        }
        Update: {
          id?: number
          longitud?: string | null
          restricciones?: string | null
          sistema?: string
          tabla_ref?: string | null
          ubicacion?: string
        }
        Relationships: []
      }
      nsr10_aire_concreto: {
        Row: {
          contenido_aire_pct: number
          id: number
          tabla_ref: string | null
          tamano_agregado_mm: number
        }
        Insert: {
          contenido_aire_pct: number
          id?: number
          tabla_ref?: string | null
          tamano_agregado_mm: number
        }
        Update: {
          contenido_aire_pct?: number
          id?: number
          tabla_ref?: string | null
          tamano_agregado_mm?: number
        }
        Relationships: []
      }
      nsr10_amplificacion_suelo: {
        Row: {
          amortiguamiento_pct: number | null
          deformacion_cortante: number | null
          g_sobre_g0: number | null
          id: number
          tabla_ref: string | null
          vs_sobre_vs0: number | null
        }
        Insert: {
          amortiguamiento_pct?: number | null
          deformacion_cortante?: number | null
          g_sobre_g0?: number | null
          id?: number
          tabla_ref?: string | null
          vs_sobre_vs0?: number | null
        }
        Update: {
          amortiguamiento_pct?: number | null
          deformacion_cortante?: number | null
          g_sobre_g0?: number | null
          id?: number
          tabla_ref?: string | null
          vs_sobre_vs0?: number | null
        }
        Relationships: []
      }
      nsr10_barras_refuerzo: {
        Row: {
          area_mm2: number | null
          designacion: string
          diametro_mm: number | null
          id: number
          masa_kg_m: number | null
          perimetro_mm: number | null
          sistema: string
          tabla_ref: string | null
        }
        Insert: {
          area_mm2?: number | null
          designacion: string
          diametro_mm?: number | null
          id?: number
          masa_kg_m?: number | null
          perimetro_mm?: number | null
          sistema: string
          tabla_ref?: string | null
        }
        Update: {
          area_mm2?: number | null
          designacion?: string
          diametro_mm?: number | null
          id?: number
          masa_kg_m?: number | null
          perimetro_mm?: number | null
          sistema?: string
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_cargas_cubiertas: {
        Row: {
          carga_kgf_m2: number | null
          carga_kn_m2: number | null
          id: number
          notas: string | null
          tabla_ref: string | null
          tipo_cubierta: string
        }
        Insert: {
          carga_kgf_m2?: number | null
          carga_kn_m2?: number | null
          id?: number
          notas?: string | null
          tabla_ref?: string | null
          tipo_cubierta: string
        }
        Update: {
          carga_kgf_m2?: number | null
          carga_kn_m2?: number | null
          id?: number
          notas?: string | null
          tabla_ref?: string | null
          tipo_cubierta?: string
        }
        Relationships: []
      }
      nsr10_cargas_elementos: {
        Row: {
          carga_kn_m2: number | null
          carga_por_espesor: boolean | null
          categoria: string
          elemento: string
          id: number
          notas: string | null
          tabla_ref: string | null
          unidad: string | null
        }
        Insert: {
          carga_kn_m2?: number | null
          carga_por_espesor?: boolean | null
          categoria: string
          elemento: string
          id?: number
          notas?: string | null
          tabla_ref?: string | null
          unidad?: string | null
        }
        Update: {
          carga_kn_m2?: number | null
          carga_por_espesor?: boolean | null
          categoria?: string
          elemento?: string
          id?: number
          notas?: string | null
          tabla_ref?: string | null
          unidad?: string | null
        }
        Relationships: []
      }
      nsr10_cargas_muertas: {
        Row: {
          afinado_piso_kn_m2: number | null
          descripcion: string | null
          fachada_particiones_kn_m2: number | null
          id: number
          ocupacion: string
          tabla_ref: string | null
        }
        Insert: {
          afinado_piso_kn_m2?: number | null
          descripcion?: string | null
          fachada_particiones_kn_m2?: number | null
          id?: number
          ocupacion: string
          tabla_ref?: string | null
        }
        Update: {
          afinado_piso_kn_m2?: number | null
          descripcion?: string | null
          fachada_particiones_kn_m2?: number | null
          id?: number
          ocupacion?: string
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_cargas_vivas: {
        Row: {
          carga_kgf_m2: number
          carga_kn_m2: number
          categoria: string
          id: number
          notas: string | null
          tabla_ref: string | null
          uso: string
        }
        Insert: {
          carga_kgf_m2: number
          carga_kn_m2: number
          categoria: string
          id?: number
          notas?: string | null
          tabla_ref?: string | null
          uso: string
        }
        Update: {
          carga_kgf_m2?: number
          carga_kn_m2?: number
          categoria?: string
          id?: number
          notas?: string | null
          tabla_ref?: string | null
          uso?: string
        }
        Relationships: []
      }
      nsr10_casas_alcance: {
        Row: {
          id: number
          limite: string
          notas: string | null
          parametro: string
          tabla_ref: string | null
        }
        Insert: {
          id?: number
          limite: string
          notas?: string | null
          parametro: string
          tabla_ref?: string | null
        }
        Update: {
          id?: number
          limite?: string
          notas?: string | null
          parametro?: string
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_casas_bahareque: {
        Row: {
          id: number
          parametro: string
          tabla_ref: string | null
          unidad: string | null
          valor: string
        }
        Insert: {
          id?: number
          parametro: string
          tabla_ref?: string | null
          unidad?: string | null
          valor: string
        }
        Update: {
          id?: number
          parametro?: string
          tabla_ref?: string | null
          unidad?: string | null
          valor?: string
        }
        Relationships: []
      }
      nsr10_casas_bahareque_cb: {
        Row: {
          coef_cb: number | null
          id: number
          tabla_ref: string | null
          zona_sismica: string | null
        }
        Insert: {
          coef_cb?: number | null
          id?: number
          tabla_ref?: string | null
          zona_sismica?: string | null
        }
        Update: {
          coef_cb?: number | null
          id?: number
          tabla_ref?: string | null
          zona_sismica?: string | null
        }
        Relationships: []
      }
      nsr10_casas_cimentacion: {
        Row: {
          dos_pisos: string | null
          id: number
          parametro: string
          tabla_ref: string | null
          un_piso: string | null
          unidad: string | null
        }
        Insert: {
          dos_pisos?: string | null
          id?: number
          parametro: string
          tabla_ref?: string | null
          un_piso?: string | null
          unidad?: string | null
        }
        Update: {
          dos_pisos?: string | null
          id?: number
          parametro?: string
          tabla_ref?: string | null
          un_piso?: string | null
          unidad?: string | null
        }
        Relationships: []
      }
      nsr10_casas_cimentacion_prof: {
        Row: {
          ancho_min_m: number | null
          espesor_min_m: number | null
          id: number
          notas: string | null
          profundidad_min_m: number
          tabla_ref: string | null
          tipo_suelo: string
        }
        Insert: {
          ancho_min_m?: number | null
          espesor_min_m?: number | null
          id?: number
          notas?: string | null
          profundidad_min_m: number
          tabla_ref?: string | null
          tipo_suelo: string
        }
        Update: {
          ancho_min_m?: number | null
          espesor_min_m?: number | null
          id?: number
          notas?: string | null
          profundidad_min_m?: number
          tabla_ref?: string | null
          tipo_suelo?: string
        }
        Relationships: []
      }
      nsr10_casas_coef_mo: {
        Row: {
          dos_pisos: number | null
          id: number
          tabla_ref: string | null
          un_piso: number | null
          zona_amenaza: string
        }
        Insert: {
          dos_pisos?: number | null
          id?: number
          tabla_ref?: string | null
          un_piso?: number | null
          zona_amenaza: string
        }
        Update: {
          dos_pisos?: number | null
          id?: number
          tabla_ref?: string | null
          un_piso?: number | null
          zona_amenaza?: string
        }
        Relationships: []
      }
      nsr10_casas_cubiertas: {
        Row: {
          anclaje: string | null
          id: number
          luz_max_m: number | null
          material: string | null
          pendiente_min_pct: number | null
          seccion_min: string | null
          tabla_ref: string | null
          tipo_cubierta: string
        }
        Insert: {
          anclaje?: string | null
          id?: number
          luz_max_m?: number | null
          material?: string | null
          pendiente_min_pct?: number | null
          seccion_min?: string | null
          tabla_ref?: string | null
          tipo_cubierta: string
        }
        Update: {
          anclaje?: string | null
          id?: number
          luz_max_m?: number | null
          material?: string | null
          pendiente_min_pct?: number | null
          seccion_min?: string | null
          tabla_ref?: string | null
          tipo_cubierta?: string
        }
        Relationships: []
      }
      nsr10_casas_guadua: {
        Row: {
          carga_kn: number | null
          elemento: string
          id: number
          luz_m: number | null
          seccion: string | null
          tabla_ref: string | null
        }
        Insert: {
          carga_kn?: number | null
          elemento: string
          id?: number
          luz_m?: number | null
          seccion?: string | null
          tabla_ref?: string | null
        }
        Update: {
          carga_kn?: number | null
          elemento?: string
          id?: number
          luz_m?: number | null
          seccion?: string | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_casas_guadua_columnas: {
        Row: {
          altura_m: number | null
          carga_kn: number | null
          diametro_mm: number | null
          id: number
          tabla_ref: string | null
        }
        Insert: {
          altura_m?: number | null
          carga_kn?: number | null
          diametro_mm?: number | null
          id?: number
          tabla_ref?: string | null
        }
        Update: {
          altura_m?: number | null
          carga_kn?: number | null
          diametro_mm?: number | null
          id?: number
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_casas_guadua_viguetas: {
        Row: {
          diametro_mm: number | null
          id: number
          luz_m: number | null
          separacion_mm: number | null
          tabla_ref: string | null
        }
        Insert: {
          diametro_mm?: number | null
          id?: number
          luz_m?: number | null
          separacion_mm?: number | null
          tabla_ref?: string | null
        }
        Update: {
          diametro_mm?: number | null
          id?: number
          luz_m?: number | null
          separacion_mm?: number | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_casas_limitaciones: {
        Row: {
          area_max_m2: number | null
          id: number
          max_pisos: number | null
          requisitos: string | null
          sistema: string
          tabla_ref: string | null
          zona_sismica: string
        }
        Insert: {
          area_max_m2?: number | null
          id?: number
          max_pisos?: number | null
          requisitos?: string | null
          sistema: string
          tabla_ref?: string | null
          zona_sismica: string
        }
        Update: {
          area_max_m2?: number | null
          id?: number
          max_pisos?: number | null
          requisitos?: string | null
          sistema?: string
          tabla_ref?: string | null
          zona_sismica?: string
        }
        Relationships: []
      }
      nsr10_casas_losas: {
        Row: {
          espesor_min_mm: number | null
          id: number
          notas: string | null
          tabla_ref: string | null
          tipo_losa: string
        }
        Insert: {
          espesor_min_mm?: number | null
          id?: number
          notas?: string | null
          tabla_ref?: string | null
          tipo_losa: string
        }
        Update: {
          espesor_min_mm?: number | null
          id?: number
          notas?: string | null
          tabla_ref?: string | null
          tipo_losa?: string
        }
        Relationships: []
      }
      nsr10_casas_losas_refuerzo: {
        Row: {
          cuantia_min: number | null
          espaciamiento_max_mm: number | null
          id: number
          tabla_ref: string | null
          tipo: string | null
        }
        Insert: {
          cuantia_min?: number | null
          espaciamiento_max_mm?: number | null
          id?: number
          tabla_ref?: string | null
          tipo?: string | null
        }
        Update: {
          cuantia_min?: number | null
          espaciamiento_max_mm?: number | null
          id?: number
          tabla_ref?: string | null
          tipo?: string | null
        }
        Relationships: []
      }
      nsr10_casas_madera: {
        Row: {
          elemento: string
          grupo_madera: string
          id: number
          luz_m: number | null
          seccion: string | null
          separacion_m: number | null
          tabla_ref: string | null
        }
        Insert: {
          elemento: string
          grupo_madera: string
          id?: number
          luz_m?: number | null
          seccion?: string | null
          separacion_m?: number | null
          tabla_ref?: string | null
        }
        Update: {
          elemento?: string
          grupo_madera?: string
          id?: number
          luz_m?: number | null
          seccion?: string | null
          separacion_m?: number | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_casas_muros_espesor: {
        Row: {
          dos_pisos_mm: number | null
          id: number
          tabla_ref: string | null
          tipo_unidad: string
          un_piso_mm: number | null
        }
        Insert: {
          dos_pisos_mm?: number | null
          id?: number
          tabla_ref?: string | null
          tipo_unidad: string
          un_piso_mm?: number | null
        }
        Update: {
          dos_pisos_mm?: number | null
          id?: number
          tabla_ref?: string | null
          tipo_unidad?: string
          un_piso_mm?: number | null
        }
        Relationships: []
      }
      nsr10_casas_muros_espesores: {
        Row: {
          espesor_1_piso_mm: number | null
          espesor_2_pisos_mm: number | null
          id: number
          tabla_ref: string | null
          tipo_muro: string | null
        }
        Insert: {
          espesor_1_piso_mm?: number | null
          espesor_2_pisos_mm?: number | null
          id?: number
          tabla_ref?: string | null
          tipo_muro?: string | null
        }
        Update: {
          espesor_1_piso_mm?: number | null
          espesor_2_pisos_mm?: number | null
          id?: number
          tabla_ref?: string | null
          tipo_muro?: string | null
        }
        Relationships: []
      }
      nsr10_casas_muros_mamp: {
        Row: {
          altura_max_m: number | null
          confinamiento: string | null
          espesor_mm: number
          id: number
          longitud_max_m: number | null
          refuerzo: string | null
          tabla_ref: string | null
          tipo_muro: string
        }
        Insert: {
          altura_max_m?: number | null
          confinamiento?: string | null
          espesor_mm: number
          id?: number
          longitud_max_m?: number | null
          refuerzo?: string | null
          tabla_ref?: string | null
          tipo_muro: string
        }
        Update: {
          altura_max_m?: number | null
          confinamiento?: string | null
          espesor_mm?: number
          id?: number
          longitud_max_m?: number | null
          refuerzo?: string | null
          tabla_ref?: string | null
          tipo_muro?: string
        }
        Relationships: []
      }
      nsr10_casas_refuerzo_losa: {
        Row: {
          id: number
          notas: string | null
          refuerzo: string
          tabla_ref: string | null
          tipo_losa: string
        }
        Insert: {
          id?: number
          notas?: string | null
          refuerzo: string
          tabla_ref?: string | null
          tipo_losa: string
        }
        Update: {
          id?: number
          notas?: string | null
          refuerzo?: string
          tabla_ref?: string | null
          tipo_losa?: string
        }
        Relationships: []
      }
      nsr10_casas_separacion: {
        Row: {
          id: number
          numero_pisos: number
          separacion_mm: number
          tabla_ref: string | null
        }
        Insert: {
          id?: number
          numero_pisos: number
          separacion_mm: number
          tabla_ref?: string | null
        }
        Update: {
          id?: number
          numero_pisos?: number
          separacion_mm?: number
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_casas_viguetas_refuerzo: {
        Row: {
          id: number
          luz_m: number | null
          refuerzo_negativo: string | null
          refuerzo_positivo: string | null
          tabla_ref: string | null
        }
        Insert: {
          id?: number
          luz_m?: number | null
          refuerzo_negativo?: string | null
          refuerzo_positivo?: string | null
          tabla_ref?: string | null
        }
        Update: {
          id?: number
          luz_m?: number | null
          refuerzo_negativo?: string | null
          refuerzo_positivo?: string | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_coef_ad: {
        Row: {
          ad: number
          departamento: string | null
          id: number
          municipio: string | null
          region: string | null
          tabla_ref: string | null
        }
        Insert: {
          ad: number
          departamento?: string | null
          id?: number
          municipio?: string | null
          region?: string | null
          tabla_ref?: string | null
        }
        Update: {
          ad?: number
          departamento?: string | null
          id?: number
          municipio?: string | null
          region?: string | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_coef_ad_puentes: {
        Row: {
          ad: number
          ciudad: string | null
          departamento: string | null
          id: number
          region: number | null
          tabla_ref: string | null
        }
        Insert: {
          ad: number
          ciudad?: string | null
          departamento?: string | null
          id?: number
          region?: number | null
          tabla_ref?: string | null
        }
        Update: {
          ad?: number
          ciudad?: string | null
          departamento?: string | null
          id?: number
          region?: number | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_coef_ae: {
        Row: {
          ae: number
          departamento: string | null
          id: number
          municipio: string | null
          region: string | null
          tabla_ref: string | null
        }
        Insert: {
          ae: number
          departamento?: string | null
          id?: number
          municipio?: string | null
          region?: string | null
          tabla_ref?: string | null
        }
        Update: {
          ae?: number
          departamento?: string | null
          id?: number
          municipio?: string | null
          region?: string | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_coef_ae_ciudades: {
        Row: {
          ae: number
          ciudad: string
          departamento: string | null
          id: number
          tabla_ref: string | null
        }
        Insert: {
          ae: number
          ciudad: string
          departamento?: string | null
          id?: number
          tabla_ref?: string | null
        }
        Update: {
          ae?: number
          ciudad?: string
          departamento?: string | null
          id?: number
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_coef_cu: {
        Row: {
          aa_threshold: number
          cu: number
          id: number
        }
        Insert: {
          aa_threshold: number
          cu: number
          id?: number
        }
        Update: {
          aa_threshold?: number
          cu?: number
          id?: number
        }
        Relationships: []
      }
      nsr10_coef_fa: {
        Row: {
          aa_value: number
          fa: number | null
          id: number
          notes: string | null
          soil_type: string
        }
        Insert: {
          aa_value: number
          fa?: number | null
          id?: number
          notes?: string | null
          soil_type: string
        }
        Update: {
          aa_value?: number
          fa?: number | null
          id?: number
          notes?: string | null
          soil_type?: string
        }
        Relationships: []
      }
      nsr10_coef_fv: {
        Row: {
          av_value: number
          fv: number | null
          id: number
          notes: string | null
          soil_type: string
        }
        Insert: {
          av_value: number
          fv?: number | null
          id?: number
          notes?: string | null
          soil_type: string
        }
        Update: {
          av_value?: number
          fv?: number | null
          id?: number
          notes?: string | null
          soil_type?: string
        }
        Relationships: []
      }
      nsr10_coef_importancia: {
        Row: {
          coef_i: number
          descripcion: string | null
          grupo_uso: string
          id: number
        }
        Insert: {
          coef_i: number
          descripcion?: string | null
          grupo_uso: string
          id?: number
        }
        Update: {
          coef_i?: number
          descripcion?: string | null
          grupo_uso?: string
          id?: number
        }
        Relationships: []
      }
      nsr10_coef_kz: {
        Row: {
          altura_m: number
          id: number
          kz_exp_b_caso1: number | null
          kz_exp_b_caso2: number | null
          kz_exp_c: number | null
          kz_exp_d: number | null
        }
        Insert: {
          altura_m: number
          id?: number
          kz_exp_b_caso1?: number | null
          kz_exp_b_caso2?: number | null
          kz_exp_c?: number | null
          kz_exp_d?: number | null
        }
        Update: {
          altura_m?: number
          id?: number
          kz_exp_b_caso1?: number | null
          kz_exp_b_caso2?: number | null
          kz_exp_c?: number | null
          kz_exp_d?: number | null
        }
        Relationships: []
      }
      nsr10_coef_losas_2dir: {
        Row: {
          caso: string | null
          coeficiente: number | null
          descripcion: string
          id: number
          notas: string | null
          relacion_m: number | null
          tabla: string
        }
        Insert: {
          caso?: string | null
          coeficiente?: number | null
          descripcion: string
          id?: number
          notas?: string | null
          relacion_m?: number | null
          tabla: string
        }
        Update: {
          caso?: string | null
          coeficiente?: number | null
          descripcion?: string
          id?: number
          notas?: string | null
          relacion_m?: number | null
          tabla?: string
        }
        Relationships: []
      }
      nsr10_coef_losas_momentos: {
        Row: {
          caso: number
          coef_neg_cont: number | null
          coef_neg_disc: number | null
          coef_pos_cm: number | null
          coef_pos_cv: number | null
          direccion: string | null
          id: number
          relacion_lados: string
          tabla_ref: string | null
          tipo_borde: string
        }
        Insert: {
          caso: number
          coef_neg_cont?: number | null
          coef_neg_disc?: number | null
          coef_pos_cm?: number | null
          coef_pos_cv?: number | null
          direccion?: string | null
          id?: number
          relacion_lados: string
          tabla_ref?: string | null
          tipo_borde: string
        }
        Update: {
          caso?: number
          coef_neg_cont?: number | null
          coef_neg_disc?: number | null
          coef_pos_cm?: number | null
          coef_pos_cv?: number | null
          direccion?: string | null
          id?: number
          relacion_lados?: string
          tabla_ref?: string | null
          tipo_borde?: string
        }
        Relationships: []
      }
      nsr10_coef_no_estructural: {
        Row: {
          ap: number | null
          categoria: string | null
          componente: string | null
          id: number
          rp: number | null
          tabla_ref: string | null
        }
        Insert: {
          ap?: number | null
          categoria?: string | null
          componente?: string | null
          id?: number
          rp?: number | null
          tabla_ref?: string | null
        }
        Update: {
          ap?: number | null
          categoria?: string | null
          componente?: string | null
          id?: number
          rp?: number | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_coef_periodo: {
        Row: {
          alpha: number
          ct: number
          id: number
          sistema: string
        }
        Insert: {
          alpha: number
          ct: number
          id?: number
          sistema: string
        }
        Update: {
          alpha?: number
          ct?: number
          id?: number
          sistema?: string
        }
        Relationships: []
      }
      nsr10_coef_phi: {
        Row: {
          descripcion: string | null
          id: number
          phi_c: number | null
          phi_e: number | null
          tabla_ref: string | null
          tipo_elemento: string
        }
        Insert: {
          descripcion?: string | null
          id?: number
          phi_c?: number | null
          phi_e?: number | null
          tabla_ref?: string | null
          tipo_elemento: string
        }
        Update: {
          descripcion?: string | null
          id?: number
          phi_c?: number | null
          phi_e?: number | null
          tabla_ref?: string | null
          tipo_elemento?: string
        }
        Relationships: []
      }
      nsr10_coef_r: {
        Row: {
          capacidad_disipacion: string | null
          cd: number | null
          id: number
          material: string | null
          omega0: number | null
          phi_a: number | null
          phi_c: number | null
          phi_p: number | null
          r0: number
          restricciones: string | null
          sistema: string
        }
        Insert: {
          capacidad_disipacion?: string | null
          cd?: number | null
          id?: number
          material?: string | null
          omega0?: number | null
          phi_a?: number | null
          phi_c?: number | null
          phi_p?: number | null
          r0: number
          restricciones?: string | null
          sistema: string
        }
        Update: {
          capacidad_disipacion?: string | null
          cd?: number | null
          id?: number
          material?: string | null
          omega0?: number | null
          phi_a?: number | null
          phi_c?: number | null
          phi_p?: number | null
          r0?: number
          restricciones?: string | null
          sistema?: string
        }
        Relationships: []
      }
      nsr10_coef_r_especial: {
        Row: {
          cd: number | null
          id: number
          omega0: number | null
          r0: number
          restricciones: string | null
          tabla_ref: string | null
          tipo_estructura: string
        }
        Insert: {
          cd?: number | null
          id?: number
          omega0?: number | null
          r0: number
          restricciones?: string | null
          tabla_ref?: string | null
          tipo_estructura: string
        }
        Update: {
          cd?: number | null
          id?: number
          omega0?: number | null
          r0?: number
          restricciones?: string | null
          tabla_ref?: string | null
          tipo_estructura?: string
        }
        Relationships: []
      }
      nsr10_combinaciones: {
        Row: {
          descripcion: string | null
          formula: string
          id: number
          metodo: string
          numero: number
        }
        Insert: {
          descripcion?: string | null
          formula: string
          id?: number
          metodo: string
          numero: number
        }
        Update: {
          descripcion?: string | null
          formula?: string
          id?: number
          metodo?: string
          numero?: number
        }
        Relationships: []
      }
      nsr10_combinaciones_carga: {
        Row: {
          combinacion: string
          descripcion: string | null
          id: number
          numero: string
          seccion: string | null
        }
        Insert: {
          combinacion: string
          descripcion?: string | null
          id?: number
          numero: string
          seccion?: string | null
        }
        Update: {
          combinacion?: string
          descripcion?: string | null
          id?: number
          numero?: string
          seccion?: string | null
        }
        Relationships: []
      }
      nsr10_complementarios_ancho_salida: {
        Row: {
          id: number
          mm_por_persona: number | null
          tabla_ref: string | null
          tipo: string | null
        }
        Insert: {
          id?: number
          mm_por_persona?: number | null
          tabla_ref?: string | null
          tipo?: string | null
        }
        Update: {
          id?: number
          mm_por_persona?: number | null
          tabla_ref?: string | null
          tipo?: string | null
        }
        Relationships: []
      }
      nsr10_complementarios_asientos_distancia: {
        Row: {
          distancia_mm: number | null
          id: number
          tabla_ref: string | null
          tipo: string | null
        }
        Insert: {
          distancia_mm?: number | null
          id?: number
          tabla_ref?: string | null
          tipo?: string | null
        }
        Update: {
          distancia_mm?: number | null
          id?: number
          tabla_ref?: string | null
          tipo?: string | null
        }
        Relationships: []
      }
      nsr10_complementarios_barandas: {
        Row: {
          altura_min_mm: number | null
          carga_lineal_kn_m: number | null
          id: number
          tabla_ref: string | null
          ubicacion: string | null
        }
        Insert: {
          altura_min_mm?: number | null
          carga_lineal_kn_m?: number | null
          id?: number
          tabla_ref?: string | null
          ubicacion?: string | null
        }
        Update: {
          altura_min_mm?: number | null
          carga_lineal_kn_m?: number | null
          id?: number
          tabla_ref?: string | null
          ubicacion?: string | null
        }
        Relationships: []
      }
      nsr10_complementarios_distancia_salida: {
        Row: {
          con_rociadores_m: number | null
          grupo: string | null
          id: number
          sin_rociadores_m: number | null
          tabla_ref: string | null
        }
        Insert: {
          con_rociadores_m?: number | null
          grupo?: string | null
          id?: number
          sin_rociadores_m?: number | null
          tabla_ref?: string | null
        }
        Update: {
          con_rociadores_m?: number | null
          grupo?: string | null
          id?: number
          sin_rociadores_m?: number | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_complementarios_indice_ocupacion: {
        Row: {
          id: number
          m2_por_persona: number | null
          tabla_ref: string | null
          uso: string | null
        }
        Insert: {
          id?: number
          m2_por_persona?: number | null
          tabla_ref?: string | null
          uso?: string | null
        }
        Update: {
          id?: number
          m2_por_persona?: number | null
          tabla_ref?: string | null
          uso?: string | null
        }
        Relationships: []
      }
      nsr10_complementarios_num_salidas: {
        Row: {
          carga_ocupacion_max: number | null
          carga_ocupacion_min: number | null
          id: number
          num_salidas: number | null
          tabla_ref: string | null
        }
        Insert: {
          carga_ocupacion_max?: number | null
          carga_ocupacion_min?: number | null
          id?: number
          num_salidas?: number | null
          tabla_ref?: string | null
        }
        Update: {
          carga_ocupacion_max?: number | null
          carga_ocupacion_min?: number | null
          id?: number
          num_salidas?: number | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_complementarios_ocupacion: {
        Row: {
          descripcion: string | null
          ejemplos: string | null
          grupo: string | null
          id: number
          subgrupo: string | null
          tabla_ref: string | null
        }
        Insert: {
          descripcion?: string | null
          ejemplos?: string | null
          grupo?: string | null
          id?: number
          subgrupo?: string | null
          tabla_ref?: string | null
        }
        Update: {
          descripcion?: string | null
          ejemplos?: string | null
          grupo?: string | null
          id?: number
          subgrupo?: string | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_complementarios_vidrio_areas_recocido: {
        Row: {
          espesor_mm: number | null
          id: number
          presion_1000pa: number | null
          presion_1500pa: number | null
          presion_2000pa: number | null
          tabla_ref: string | null
        }
        Insert: {
          espesor_mm?: number | null
          id?: number
          presion_1000pa?: number | null
          presion_1500pa?: number | null
          presion_2000pa?: number | null
          tabla_ref?: string | null
        }
        Update: {
          espesor_mm?: number | null
          id?: number
          presion_1000pa?: number | null
          presion_1500pa?: number | null
          presion_2000pa?: number | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_complementarios_vidrio_areas_templado: {
        Row: {
          area_max_m2: number | null
          espesor_mm: number | null
          id: number
          tabla_ref: string | null
        }
        Insert: {
          area_max_m2?: number | null
          espesor_mm?: number | null
          id?: number
          tabla_ref?: string | null
        }
        Update: {
          area_max_m2?: number | null
          espesor_mm?: number | null
          id?: number
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_complementarios_vidrio_cargas: {
        Row: {
          aplicacion: string | null
          area_mm2: number | null
          carga_kn: number | null
          id: number
          tabla_ref: string | null
        }
        Insert: {
          aplicacion?: string | null
          area_mm2?: number | null
          carga_kn?: number | null
          id?: number
          tabla_ref?: string | null
        }
        Update: {
          aplicacion?: string | null
          area_mm2?: number | null
          carga_kn?: number | null
          id?: number
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_complementarios_vidrio_propiedades: {
        Row: {
          densidad_kg_m3: number | null
          espesor_mm: number | null
          id: number
          resist_flexion_mpa: number | null
          tabla_ref: string | null
          tipo_vidrio: string | null
        }
        Insert: {
          densidad_kg_m3?: number | null
          espesor_mm?: number | null
          id?: number
          resist_flexion_mpa?: number | null
          tabla_ref?: string | null
          tipo_vidrio?: string | null
        }
        Update: {
          densidad_kg_m3?: number | null
          espesor_mm?: number | null
          id?: number
          resist_flexion_mpa?: number | null
          tabla_ref?: string | null
          tipo_vidrio?: string | null
        }
        Relationships: []
      }
      nsr10_complementarios_vidrio_seguridad: {
        Row: {
          area_max_m2: number | null
          espesor_min_mm: number | null
          id: number
          tabla_ref: string | null
          tipo: string | null
        }
        Insert: {
          area_max_m2?: number | null
          espesor_min_mm?: number | null
          id?: number
          tabla_ref?: string | null
          tipo?: string | null
        }
        Update: {
          area_max_m2?: number | null
          espesor_min_mm?: number | null
          id?: number
          tabla_ref?: string | null
          tipo?: string | null
        }
        Relationships: []
      }
      nsr10_contenido: {
        Row: {
          contenido: string | null
          created_at: string | null
          datos: Json | null
          id: number
          search_vector: unknown
          seccion: string | null
          tipo: string | null
          titulo: string | null
        }
        Insert: {
          contenido?: string | null
          created_at?: string | null
          datos?: Json | null
          id?: number
          search_vector?: unknown
          seccion?: string | null
          tipo?: string | null
          titulo?: string | null
        }
        Update: {
          contenido?: string | null
          created_at?: string | null
          datos?: Json | null
          id?: number
          search_vector?: unknown
          seccion?: string | null
          tipo?: string | null
          titulo?: string | null
        }
        Relationships: []
      }
      nsr10_cuantias_minimas: {
        Row: {
          cuantia_min: string
          elemento: string
          formula: string | null
          id: number
          seccion_ref: string | null
          tipo_refuerzo: string
        }
        Insert: {
          cuantia_min: string
          elemento: string
          formula?: string | null
          id?: number
          seccion_ref?: string | null
          tipo_refuerzo: string
        }
        Update: {
          cuantia_min?: string
          elemento?: string
          formula?: string | null
          id?: number
          seccion_ref?: string | null
          tipo_refuerzo?: string
        }
        Relationships: []
      }
      nsr10_deflexiones: {
        Row: {
          deflexion_considerada: string | null
          id: number
          limite: string
          notas: string | null
          tabla_ref: string | null
          tipo_elemento: string
        }
        Insert: {
          deflexion_considerada?: string | null
          id?: number
          limite: string
          notas?: string | null
          tabla_ref?: string | null
          tipo_elemento: string
        }
        Update: {
          deflexion_considerada?: string | null
          id?: number
          limite?: string
          notas?: string | null
          tabla_ref?: string | null
          tipo_elemento?: string
        }
        Relationships: []
      }
      nsr10_deriva_limites: {
        Row: {
          deriva_max_pct: number
          id: number
          seccion_referencia: string | null
          sistema_estructural: string
        }
        Insert: {
          deriva_max_pct: number
          id?: number
          seccion_referencia?: string | null
          sistema_estructural: string
        }
        Update: {
          deriva_max_pct?: number
          id?: number
          seccion_referencia?: string | null
          sistema_estructural?: string
        }
        Relationships: []
      }
      nsr10_deriva_max: {
        Row: {
          deriva_max: number | null
          id: number
          notas: string | null
          sistema: string | null
        }
        Insert: {
          deriva_max?: number | null
          id?: number
          notas?: string | null
          sistema?: string | null
        }
        Update: {
          deriva_max?: number | null
          id?: number
          notas?: string | null
          sistema?: string | null
        }
        Relationships: []
      }
      nsr10_deriva_umbral_dano: {
        Row: {
          deriva_max_pct: number
          descripcion: string | null
          id: number
          sistema_estructural: string
          tabla_ref: string | null
        }
        Insert: {
          deriva_max_pct: number
          descripcion?: string | null
          id?: number
          sistema_estructural: string
          tabla_ref?: string | null
        }
        Update: {
          deriva_max_pct?: number
          descripcion?: string | null
          id?: number
          sistema_estructural?: string
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_derivas_maximas: {
        Row: {
          deriva_max_pct: number
          grupo_uso: string
          id: number
          notas: string | null
          tabla_ref: string | null
          tipo_estructura: string | null
        }
        Insert: {
          deriva_max_pct: number
          grupo_uso: string
          id?: number
          notas?: string | null
          tabla_ref?: string | null
          tipo_estructura?: string | null
        }
        Update: {
          deriva_max_pct?: number
          grupo_uso?: string
          id?: number
          notas?: string | null
          tabla_ref?: string | null
          tipo_estructura?: string | null
        }
        Relationships: []
      }
      nsr10_derivas_umbral_puentes: {
        Row: {
          condicion: string | null
          deriva_umbral_pct: number
          id: number
          tabla_ref: string | null
          tipo_elemento: string
        }
        Insert: {
          condicion?: string | null
          deriva_umbral_pct: number
          id?: number
          tabla_ref?: string | null
          tipo_elemento: string
        }
        Update: {
          condicion?: string | null
          deriva_umbral_pct?: number
          id?: number
          tabla_ref?: string | null
          tipo_elemento?: string
        }
        Relationships: []
      }
      nsr10_desempeno_minimo: {
        Row: {
          descripcion: string | null
          grado_desempeno: string
          grupo_uso: string
          id: number
          tabla_ref: string | null
          zona_amenaza: string
        }
        Insert: {
          descripcion?: string | null
          grado_desempeno: string
          grupo_uso: string
          id?: number
          tabla_ref?: string | null
          zona_amenaza: string
        }
        Update: {
          descripcion?: string | null
          grado_desempeno?: string
          grupo_uso?: string
          id?: number
          tabla_ref?: string | null
          zona_amenaza?: string
        }
        Relationships: []
      }
      nsr10_desplazamiento_umbral: {
        Row: {
          descripcion: string | null
          id: number
          limite_deriva: number | null
          sistema_estructural: string
          tabla_ref: string | null
          tipo_deriva: string | null
        }
        Insert: {
          descripcion?: string | null
          id?: number
          limite_deriva?: number | null
          sistema_estructural: string
          tabla_ref?: string | null
          tipo_deriva?: string | null
        }
        Update: {
          descripcion?: string | null
          id?: number
          limite_deriva?: number | null
          sistema_estructural?: string
          tabla_ref?: string | null
          tipo_deriva?: string | null
        }
        Relationships: []
      }
      nsr10_doblado_barras: {
        Row: {
          barra_desde: string
          barra_hasta: string
          diametro_min: string
          id: number
          tabla_ref: string | null
        }
        Insert: {
          barra_desde: string
          barra_hasta: string
          diametro_min: string
          id?: number
          tabla_ref?: string | null
        }
        Update: {
          barra_desde?: string
          barra_hasta?: string
          diametro_min?: string
          id?: number
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_elementos_no_estructurales: {
        Row: {
          ap: number | null
          categoria: string
          elemento: string
          id: number
          notas: string | null
          rp: number | null
          tabla_ref: string | null
          tipo_anclaje: string | null
        }
        Insert: {
          ap?: number | null
          categoria: string
          elemento: string
          id?: number
          notas?: string | null
          rp?: number | null
          tabla_ref?: string | null
          tipo_anclaje?: string | null
        }
        Update: {
          ap?: number | null
          categoria?: string
          elemento?: string
          id?: number
          notas?: string | null
          rp?: number | null
          tabla_ref?: string | null
          tipo_anclaje?: string | null
        }
        Relationships: []
      }
      nsr10_empuje_sismico: {
        Row: {
          formula: string | null
          id: number
          notas: string | null
          parametro: string
          tabla_ref: string | null
          zona_alta: string | null
          zona_baja: string | null
          zona_intermedia: string | null
        }
        Insert: {
          formula?: string | null
          id?: number
          notas?: string | null
          parametro: string
          tabla_ref?: string | null
          zona_alta?: string | null
          zona_baja?: string | null
          zona_intermedia?: string | null
        }
        Update: {
          formula?: string | null
          id?: number
          notas?: string | null
          parametro?: string
          tabla_ref?: string | null
          zona_alta?: string | null
          zona_baja?: string | null
          zona_intermedia?: string | null
        }
        Relationships: []
      }
      nsr10_espesores_minimos: {
        Row: {
          condicion_apoyo: string
          elemento: string
          h_min: string
          id: number
          notas: string | null
          tabla_ref: string | null
        }
        Insert: {
          condicion_apoyo: string
          elemento: string
          h_min: string
          id?: number
          notas?: string | null
          tabla_ref?: string | null
        }
        Update: {
          condicion_apoyo?: string
          elemento?: string
          h_min?: string
          id?: number
          notas?: string | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_estructuras_ambientales: {
        Row: {
          descripcion: string
          id: number
          notas: string | null
          parametro: string | null
          tabla_ref: string
          unidad: string | null
          valor: string | null
        }
        Insert: {
          descripcion: string
          id?: number
          notas?: string | null
          parametro?: string | null
          tabla_ref: string
          unidad?: string | null
          valor?: string | null
        }
        Update: {
          descripcion?: string
          id?: number
          notas?: string | null
          parametro?: string | null
          tabla_ref?: string
          unidad?: string | null
          valor?: string | null
        }
        Relationships: []
      }
      nsr10_estudio_sismico: {
        Row: {
          descripcion: string
          id: number
          subtipo: string
          tabla_ref: string | null
        }
        Insert: {
          descripcion: string
          id?: number
          subtipo: string
          tabla_ref?: string | null
        }
        Update: {
          descripcion?: string
          id?: number
          subtipo?: string
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_estudio_sismico_casos: {
        Row: {
          caso: string
          condicion: string
          id: number
          obligatorio: boolean | null
          requisito: string | null
          tabla_ref: string | null
        }
        Insert: {
          caso: string
          condicion: string
          id?: number
          obligatorio?: boolean | null
          requisito?: string | null
          tabla_ref?: string | null
        }
        Update: {
          caso?: string
          condicion?: string
          id?: number
          obligatorio?: boolean | null
          requisito?: string | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_exposicion_concreto: {
        Row: {
          categoria: string
          clase: string
          condicion: string
          id: number
          severidad: string | null
          tabla_ref: string | null
        }
        Insert: {
          categoria: string
          clase: string
          condicion: string
          id?: number
          severidad?: string | null
          tabla_ref?: string | null
        }
        Update: {
          categoria?: string
          clase?: string
          condicion?: string
          id?: number
          severidad?: string | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_exposicion_viento: {
        Row: {
          alpha: number | null
          alpha_bar: string | null
          alpha_hat: string | null
          b_bar: number | null
          b_hat: number | null
          c: number | null
          epsilon: string | null
          exposicion: string
          id: number
          lbar_m: number | null
          zg_m: number | null
          zmin_m: number | null
        }
        Insert: {
          alpha?: number | null
          alpha_bar?: string | null
          alpha_hat?: string | null
          b_bar?: number | null
          b_hat?: number | null
          c?: number | null
          epsilon?: string | null
          exposicion: string
          id?: number
          lbar_m?: number | null
          zg_m?: number | null
          zmin_m?: number | null
        }
        Update: {
          alpha?: number | null
          alpha_bar?: string | null
          alpha_hat?: string | null
          b_bar?: number | null
          b_hat?: number | null
          c?: number | null
          epsilon?: string | null
          exposicion?: string
          id?: number
          lbar_m?: number | null
          zg_m?: number | null
          zmin_m?: number | null
        }
        Relationships: []
      }
      nsr10_factor_ss: {
        Row: {
          factor_modificacion: number
          id: number
          num_ensayos: string
          tabla_ref: string | null
        }
        Insert: {
          factor_modificacion: number
          id?: number
          num_ensayos: string
          tabla_ref?: string | null
        }
        Update: {
          factor_modificacion?: number
          id?: number
          num_ensayos?: string
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_factores_evaluacion: {
        Row: {
          condicion: string
          id: number
          notas: string | null
          tabla_ref: string | null
          tipo_factor: string
          valor: number
        }
        Insert: {
          condicion: string
          id?: number
          notas?: string | null
          tabla_ref?: string | null
          tipo_factor: string
          valor: number
        }
        Update: {
          condicion?: string
          id?: number
          notas?: string | null
          tabla_ref?: string | null
          tipo_factor?: string
          valor?: number
        }
        Relationships: []
      }
      nsr10_fcr: {
        Row: {
          condicion: string | null
          fc_especificado: string
          formula_fcr: string
          id: number
          tabla_ref: string | null
        }
        Insert: {
          condicion?: string | null
          fc_especificado: string
          formula_fcr: string
          id?: number
          tabla_ref?: string | null
        }
        Update: {
          condicion?: string | null
          fc_especificado?: string
          formula_fcr?: string
          id?: number
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_figuras: {
        Row: {
          descripcion: string | null
          figura_ref: string
          id: number
          pagina: number | null
          tipo: string | null
          titulo: string
          titulo_nsr: string
        }
        Insert: {
          descripcion?: string | null
          figura_ref: string
          id?: number
          pagina?: number | null
          tipo?: string | null
          titulo: string
          titulo_nsr: string
        }
        Update: {
          descripcion?: string | null
          figura_ref?: string
          id?: number
          pagina?: number | null
          tipo?: string | null
          titulo?: string
          titulo_nsr?: string
        }
        Relationships: []
      }
      nsr10_formulas: {
        Row: {
          codigo_python: string | null
          descripcion: string | null
          formula_latex: string | null
          formula_texto: string | null
          id: number
          latex: string | null
          nombre: string | null
          seccion: string | null
          simbolo: string | null
          unidades: string | null
          variables: string | null
        }
        Insert: {
          codigo_python?: string | null
          descripcion?: string | null
          formula_latex?: string | null
          formula_texto?: string | null
          id?: number
          latex?: string | null
          nombre?: string | null
          seccion?: string | null
          simbolo?: string | null
          unidades?: string | null
          variables?: string | null
        }
        Update: {
          codigo_python?: string | null
          descripcion?: string | null
          formula_latex?: string | null
          formula_texto?: string | null
          id?: number
          latex?: string | null
          nombre?: string | null
          seccion?: string | null
          simbolo?: string | null
          unidades?: string | null
          variables?: string | null
        }
        Relationships: []
      }
      nsr10_formulas_concreto: {
        Row: {
          codigo_python: string | null
          formula: string
          id: number
          latex: string | null
          nombre: string
          notas: string | null
          seccion: string
          unidades: string | null
          variables: string | null
        }
        Insert: {
          codigo_python?: string | null
          formula: string
          id?: number
          latex?: string | null
          nombre: string
          notas?: string | null
          seccion: string
          unidades?: string | null
          variables?: string | null
        }
        Update: {
          codigo_python?: string | null
          formula?: string
          id?: number
          latex?: string | null
          nombre?: string
          notas?: string | null
          seccion?: string
          unidades?: string | null
          variables?: string | null
        }
        Relationships: []
      }
      nsr10_formulas_sismo: {
        Row: {
          codigo_python: string | null
          formula: string
          id: number
          latex: string | null
          nombre: string
          notas: string | null
          parametros_entrada: Json | null
          parametros_salida: string | null
          seccion: string
          titulo: string | null
          unidades: string | null
          variables: string | null
        }
        Insert: {
          codigo_python?: string | null
          formula: string
          id?: number
          latex?: string | null
          nombre: string
          notas?: string | null
          parametros_entrada?: Json | null
          parametros_salida?: string | null
          seccion: string
          titulo?: string | null
          unidades?: string | null
          variables?: string | null
        }
        Update: {
          codigo_python?: string | null
          formula?: string
          id?: number
          latex?: string | null
          nombre?: string
          notas?: string | null
          parametros_entrada?: Json | null
          parametros_salida?: string | null
          seccion?: string
          titulo?: string | null
          unidades?: string | null
          variables?: string | null
        }
        Relationships: []
      }
      nsr10_formulas_viento: {
        Row: {
          codigo_python: string | null
          formula: string
          id: number
          latex: string | null
          nombre: string
          notas: string | null
          seccion: string
          unidades: string | null
          variables: string | null
        }
        Insert: {
          codigo_python?: string | null
          formula: string
          id?: number
          latex?: string | null
          nombre: string
          notas?: string | null
          seccion: string
          unidades?: string | null
          variables?: string | null
        }
        Update: {
          codigo_python?: string | null
          formula?: string
          id?: number
          latex?: string | null
          nombre?: string
          notas?: string | null
          seccion?: string
          unidades?: string | null
          variables?: string | null
        }
        Relationships: []
      }
      nsr10_geotecnia_asentamientos: {
        Row: {
          asentamiento_diferencial_max: string | null
          asentamiento_total_max_mm: number | null
          distorsion_angular_max: string | null
          id: number
          tabla_ref: string | null
          tipo_estructura: string
        }
        Insert: {
          asentamiento_diferencial_max?: string | null
          asentamiento_total_max_mm?: number | null
          distorsion_angular_max?: string | null
          id?: number
          tabla_ref?: string | null
          tipo_estructura: string
        }
        Update: {
          asentamiento_diferencial_max?: string | null
          asentamiento_total_max_mm?: number | null
          distorsion_angular_max?: string | null
          id?: number
          tabla_ref?: string | null
          tipo_estructura?: string
        }
        Relationships: []
      }
      nsr10_geotecnia_capacidad: {
        Row: {
          id: number
          n_spt_rango: string | null
          observaciones: string | null
          qa_presuntiva_kpa: number | null
          qu_kpa_rango: string | null
          tabla_ref: string | null
          tipo_suelo: string
        }
        Insert: {
          id?: number
          n_spt_rango?: string | null
          observaciones?: string | null
          qa_presuntiva_kpa?: number | null
          qu_kpa_rango?: string | null
          tabla_ref?: string | null
          tipo_suelo: string
        }
        Update: {
          id?: number
          n_spt_rango?: string | null
          observaciones?: string | null
          qa_presuntiva_kpa?: number | null
          qu_kpa_rango?: string | null
          tabla_ref?: string | null
          tipo_suelo?: string
        }
        Relationships: []
      }
      nsr10_geotecnia_categorias: {
        Row: {
          area_max_m2: number | null
          categoria: string
          descripcion: string | null
          id: number
          pisos_max: number | null
          requisitos_estudio: string | null
          tabla_ref: string | null
        }
        Insert: {
          area_max_m2?: number | null
          categoria: string
          descripcion?: string | null
          id?: number
          pisos_max?: number | null
          requisitos_estudio?: string | null
          tabla_ref?: string | null
        }
        Update: {
          area_max_m2?: number | null
          categoria?: string
          descripcion?: string | null
          id?: number
          pisos_max?: number | null
          requisitos_estudio?: string | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_geotecnia_colapsibilidad: {
        Row: {
          clasificacion: string | null
          ic_max: number | null
          ic_min: number | null
          id: number
          severidad: string | null
          tabla_ref: string | null
        }
        Insert: {
          clasificacion?: string | null
          ic_max?: number | null
          ic_min?: number | null
          id?: number
          severidad?: string | null
          tabla_ref?: string | null
        }
        Update: {
          clasificacion?: string | null
          ic_max?: number | null
          ic_min?: number | null
          id?: number
          severidad?: string | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_geotecnia_ensayos: {
        Row: {
          aplicacion: string | null
          ensayo: string
          id: number
          norma: string | null
          observaciones: string | null
          parametro_obtenido: string | null
          tabla_ref: string | null
        }
        Insert: {
          aplicacion?: string | null
          ensayo: string
          id?: number
          norma?: string | null
          observaciones?: string | null
          parametro_obtenido?: string | null
          tabla_ref?: string | null
        }
        Update: {
          aplicacion?: string | null
          ensayo?: string
          id?: number
          norma?: string | null
          observaciones?: string | null
          parametro_obtenido?: string | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_geotecnia_ensayos_pilotes: {
        Row: {
          ensayos_min: number | null
          id: number
          reduccion_fsicp: number | null
          tabla_ref: string | null
        }
        Insert: {
          ensayos_min?: number | null
          id?: number
          reduccion_fsicp?: number | null
          tabla_ref?: string | null
        }
        Update: {
          ensayos_min?: number | null
          id?: number
          reduccion_fsicp?: number | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_geotecnia_exploracion: {
        Row: {
          categoria: string
          ensayos_requeridos: string | null
          espaciamiento_max_m: number | null
          id: number
          num_sondeos_min: number | null
          profundidad_min: string | null
          tabla_ref: string | null
        }
        Insert: {
          categoria: string
          ensayos_requeridos?: string | null
          espaciamiento_max_m?: number | null
          id?: number
          num_sondeos_min?: number | null
          profundidad_min?: string | null
          tabla_ref?: string | null
        }
        Update: {
          categoria?: string
          ensayos_requeridos?: string | null
          espaciamiento_max_m?: number | null
          id?: number
          num_sondeos_min?: number | null
          profundidad_min?: string | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_geotecnia_fs: {
        Row: {
          condicion: string | null
          fs_min: number
          id: number
          modo_falla: string
          notas: string | null
          tabla_ref: string | null
        }
        Insert: {
          condicion?: string | null
          fs_min: number
          id?: number
          modo_falla: string
          notas?: string | null
          tabla_ref?: string | null
        }
        Update: {
          condicion?: string | null
          fs_min?: number
          id?: number
          modo_falla?: string
          notas?: string | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_geotecnia_fs_directo: {
        Row: {
          condicion: string | null
          estado_limite: string | null
          fs_min: number | null
          id: number
          tabla_ref: string | null
        }
        Insert: {
          condicion?: string | null
          estado_limite?: string | null
          fs_min?: number | null
          id?: number
          tabla_ref?: string | null
        }
        Update: {
          condicion?: string | null
          estado_limite?: string | null
          fs_min?: number | null
          id?: number
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_geotecnia_fs_muros: {
        Row: {
          estado_limite: string | null
          fs_min: number | null
          id: number
          tabla_ref: string | null
        }
        Insert: {
          estado_limite?: string | null
          fs_min?: number | null
          id?: number
          tabla_ref?: string | null
        }
        Update: {
          estado_limite?: string | null
          fs_min?: number | null
          id?: number
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_geotecnia_fs_pilotes: {
        Row: {
          condicion: string | null
          fsicp_min: number | null
          id: number
          tabla_ref: string | null
          tipo: string | null
        }
        Insert: {
          condicion?: string | null
          fsicp_min?: number | null
          id?: number
          tabla_ref?: string | null
          tipo?: string | null
        }
        Update: {
          condicion?: string | null
          fsicp_min?: number | null
          id?: number
          tabla_ref?: string | null
          tipo?: string | null
        }
        Relationships: []
      }
      nsr10_geotecnia_licuacion: {
        Row: {
          criterio: string | null
          id: number
          n_spt_corregido: number | null
          profundidad_max_m: number | null
          susceptibilidad: string | null
          tabla_ref: string | null
          tipo_suelo: string
        }
        Insert: {
          criterio?: string | null
          id?: number
          n_spt_corregido?: number | null
          profundidad_max_m?: number | null
          susceptibilidad?: string | null
          tabla_ref?: string | null
          tipo_suelo: string
        }
        Update: {
          criterio?: string | null
          id?: number
          n_spt_corregido?: number | null
          profundidad_max_m?: number | null
          susceptibilidad?: string | null
          tabla_ref?: string | null
          tipo_suelo?: string
        }
        Relationships: []
      }
      nsr10_geotecnia_muros: {
        Row: {
          delta_h_sobre_h: string | null
          estado: string
          id: number
          ka: number | null
          kp: number | null
          notas: string | null
          tabla_ref: string | null
          tipo_suelo: string
        }
        Insert: {
          delta_h_sobre_h?: string | null
          estado: string
          id?: number
          ka?: number | null
          kp?: number | null
          notas?: string | null
          tabla_ref?: string | null
          tipo_suelo: string
        }
        Update: {
          delta_h_sobre_h?: string | null
          estado?: string
          id?: number
          ka?: number | null
          kp?: number | null
          notas?: string | null
          tabla_ref?: string | null
          tipo_suelo?: string
        }
        Relationships: []
      }
      nsr10_geotecnia_muros_movimiento: {
        Row: {
          id: number
          movimiento_activo: string | null
          movimiento_pasivo: string | null
          tabla_ref: string | null
          tipo_muro: string | null
        }
        Insert: {
          id?: number
          movimiento_activo?: string | null
          movimiento_pasivo?: string | null
          tabla_ref?: string | null
          tipo_muro?: string | null
        }
        Update: {
          id?: number
          movimiento_activo?: string | null
          movimiento_pasivo?: string | null
          tabla_ref?: string | null
          tipo_muro?: string | null
        }
        Relationships: []
      }
      nsr10_geotecnia_pilotes: {
        Row: {
          aplicacion: string | null
          capacidad_tipica_kn: string | null
          diametro_tipico_mm: string | null
          id: number
          material: string | null
          metodo_instalacion: string | null
          tabla_ref: string | null
          tipo_pilote: string
        }
        Insert: {
          aplicacion?: string | null
          capacidad_tipica_kn?: string | null
          diametro_tipico_mm?: string | null
          id?: number
          material?: string | null
          metodo_instalacion?: string | null
          tabla_ref?: string | null
          tipo_pilote: string
        }
        Update: {
          aplicacion?: string | null
          capacidad_tipica_kn?: string | null
          diametro_tipico_mm?: string | null
          id?: number
          material?: string | null
          metodo_instalacion?: string | null
          tabla_ref?: string | null
          tipo_pilote?: string
        }
        Relationships: []
      }
      nsr10_geotecnia_sismo_talud: {
        Row: {
          coef_sismico_kh: number | null
          coef_sismico_kv: number | null
          fs_min: number | null
          id: number
          metodo_analisis: string | null
          tabla_ref: string | null
          zona_sismica: string
        }
        Insert: {
          coef_sismico_kh?: number | null
          coef_sismico_kv?: number | null
          fs_min?: number | null
          id?: number
          metodo_analisis?: string | null
          tabla_ref?: string | null
          zona_sismica: string
        }
        Update: {
          coef_sismico_kh?: number | null
          coef_sismico_kv?: number | null
          fs_min?: number | null
          id?: number
          metodo_analisis?: string | null
          tabla_ref?: string | null
          zona_sismica?: string
        }
        Relationships: []
      }
      nsr10_geotecnia_sondeos: {
        Row: {
          categoria: string | null
          espaciamiento: string | null
          id: number
          num_sondeos_min: number | null
          profundidad: string | null
          tabla_ref: string | null
        }
        Insert: {
          categoria?: string | null
          espaciamiento?: string | null
          id?: number
          num_sondeos_min?: number | null
          profundidad?: string | null
          tabla_ref?: string | null
        }
        Update: {
          categoria?: string | null
          espaciamiento?: string | null
          id?: number
          num_sondeos_min?: number | null
          profundidad?: string | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_geotecnia_succion: {
        Row: {
          id: number
          tabla_ref: string | null
          unidad: string | null
          valor_equivalente: string | null
        }
        Insert: {
          id?: number
          tabla_ref?: string | null
          unidad?: string | null
          valor_equivalente?: string | null
        }
        Update: {
          id?: number
          tabla_ref?: string | null
          unidad?: string | null
          valor_equivalente?: string | null
        }
        Relationships: []
      }
      nsr10_geotecnia_suelos_expansivos: {
        Row: {
          clasificacion: string | null
          expansion_libre: string | null
          id: number
          ip_max: number | null
          ip_min: number | null
          ll_max: number | null
          ll_min: number | null
          tabla_ref: string | null
        }
        Insert: {
          clasificacion?: string | null
          expansion_libre?: string | null
          id?: number
          ip_max?: number | null
          ip_min?: number | null
          ll_max?: number | null
          ll_min?: number | null
          tabla_ref?: string | null
        }
        Update: {
          clasificacion?: string | null
          expansion_libre?: string | null
          id?: number
          ip_max?: number | null
          ip_min?: number | null
          ll_max?: number | null
          ll_min?: number | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_geotecnia_talud_sismico: {
        Row: {
          id: number
          kst_amax_min: number | null
          tabla_ref: string | null
          tipo_talud: string | null
        }
        Insert: {
          id?: number
          kst_amax_min?: number | null
          tabla_ref?: string | null
          tipo_talud?: string | null
        }
        Update: {
          id?: number
          kst_amax_min?: number | null
          tabla_ref?: string | null
          tipo_talud?: string | null
        }
        Relationships: []
      }
      nsr10_geotecnia_taludes: {
        Row: {
          altura_max_m: number | null
          categoria_talud: string
          fs_estatico: number | null
          fs_sismico: number | null
          id: number
          pendiente_max: string | null
          tabla_ref: string | null
        }
        Insert: {
          altura_max_m?: number | null
          categoria_talud: string
          fs_estatico?: number | null
          fs_sismico?: number | null
          id?: number
          pendiente_max?: string | null
          tabla_ref?: string | null
        }
        Update: {
          altura_max_m?: number | null
          categoria_talud?: string
          fs_estatico?: number | null
          fs_sismico?: number | null
          id?: number
          pendiente_max?: string | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_geotecnia_taludes_clase: {
        Row: {
          clase: string
          consecuencia: string | null
          id: number
          requisitos_analisis: string | null
          riesgo: string | null
          tabla_ref: string | null
        }
        Insert: {
          clase: string
          consecuencia?: string | null
          id?: number
          requisitos_analisis?: string | null
          riesgo?: string | null
          tabla_ref?: string | null
        }
        Update: {
          clase?: string
          consecuencia?: string | null
          id?: number
          requisitos_analisis?: string | null
          riesgo?: string | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_golpeteo: {
        Row: {
          condicion: string
          formula: string | null
          id: number
          notas: string | null
          separacion_minima: string | null
          tabla_ref: string | null
        }
        Insert: {
          condicion: string
          formula?: string | null
          id?: number
          notas?: string | null
          separacion_minima?: string | null
          tabla_ref?: string | null
        }
        Update: {
          condicion?: string
          formula?: string | null
          id?: number
          notas?: string | null
          separacion_minima?: string | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_guadua_esfuerzos: {
        Row: {
          condicion: string | null
          formula: string | null
          id: number
          tabla_ref: string | null
          tipo_esfuerzo: string
          valor_mpa: number
        }
        Insert: {
          condicion?: string | null
          formula?: string | null
          id?: number
          tabla_ref?: string | null
          tipo_esfuerzo: string
          valor_mpa: number
        }
        Update: {
          condicion?: string | null
          formula?: string | null
          id?: number
          tabla_ref?: string | null
          tipo_esfuerzo?: string
          valor_mpa?: number
        }
        Relationships: []
      }
      nsr10_guadua_factores: {
        Row: {
          condicion: string | null
          factor: string
          id: number
          simbolo: string | null
          tabla_ref: string | null
          valor: number | null
        }
        Insert: {
          condicion?: string | null
          factor: string
          id?: number
          simbolo?: string | null
          tabla_ref?: string | null
          valor?: number | null
        }
        Update: {
          condicion?: string | null
          factor?: string
          id?: number
          simbolo?: string | null
          tabla_ref?: string | null
          valor?: number | null
        }
        Relationships: []
      }
      nsr10_guadua_muros: {
        Row: {
          altura_max_m: number | null
          capacidad_kn_m: number | null
          espesor_min_mm: number | null
          id: number
          material_relleno: string | null
          sistema: string
          tabla_ref: string | null
        }
        Insert: {
          altura_max_m?: number | null
          capacidad_kn_m?: number | null
          espesor_min_mm?: number | null
          id?: number
          material_relleno?: string | null
          sistema: string
          tabla_ref?: string | null
        }
        Update: {
          altura_max_m?: number | null
          capacidad_kn_m?: number | null
          espesor_min_mm?: number | null
          id?: number
          material_relleno?: string | null
          sistema?: string
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_guadua_propiedades: {
        Row: {
          condicion: string | null
          id: number
          propiedad: string
          tabla_ref: string | null
          unidades: string | null
          valor: number | null
        }
        Insert: {
          condicion?: string | null
          id?: number
          propiedad: string
          tabla_ref?: string | null
          unidades?: string | null
          valor?: number | null
        }
        Update: {
          condicion?: string | null
          id?: number
          propiedad?: string
          tabla_ref?: string | null
          unidades?: string | null
          valor?: number | null
        }
        Relationships: []
      }
      nsr10_guadua_uniones: {
        Row: {
          capacidad: string | null
          descripcion: string | null
          figura_ref: string | null
          id: number
          requisitos: string | null
          tabla_ref: string | null
          tipo_union: string
        }
        Insert: {
          capacidad?: string | null
          descripcion?: string | null
          figura_ref?: string | null
          id?: number
          requisitos?: string | null
          tabla_ref?: string | null
          tipo_union: string
        }
        Update: {
          capacidad?: string | null
          descripcion?: string | null
          figura_ref?: string | null
          id?: number
          requisitos?: string | null
          tabla_ref?: string | null
          tipo_union?: string
        }
        Relationships: []
      }
      nsr10_incendio_acabados_interiores: {
        Row: {
          corredores: string | null
          grupo_ocupacion: string | null
          id: number
          otras_areas: string | null
          salidas: string | null
          tabla_ref: string | null
        }
        Insert: {
          corredores?: string | null
          grupo_ocupacion?: string | null
          id?: number
          otras_areas?: string | null
          salidas?: string | null
          tabla_ref?: string | null
        }
        Update: {
          corredores?: string | null
          grupo_ocupacion?: string | null
          id?: number
          otras_areas?: string | null
          salidas?: string | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_incendio_categoria_altura: {
        Row: {
          altura_max_m: number | null
          categoria: string | null
          grupo: string | null
          id: number
          pisos_max: number | null
          tabla_ref: string | null
        }
        Insert: {
          altura_max_m?: number | null
          categoria?: string | null
          grupo?: string | null
          id?: number
          pisos_max?: number | null
          tabla_ref?: string | null
        }
        Update: {
          altura_max_m?: number | null
          categoria?: string | null
          grupo?: string | null
          id?: number
          pisos_max?: number | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_incendio_categoria_area: {
        Row: {
          altura_max_m: number | null
          area_max_m2: number | null
          categoria: string | null
          grupo: string | null
          id: number
          tabla_ref: string | null
        }
        Insert: {
          altura_max_m?: number | null
          area_max_m2?: number | null
          categoria?: string | null
          grupo?: string | null
          id?: number
          tabla_ref?: string | null
        }
        Update: {
          altura_max_m?: number | null
          area_max_m2?: number | null
          categoria?: string | null
          grupo?: string | null
          id?: number
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_incendio_columnas_concreto: {
        Row: {
          dimension_min_mm: number | null
          id: number
          resistencia_1h: string | null
          resistencia_2h: string | null
          resistencia_3h: string | null
          tabla_ref: string | null
        }
        Insert: {
          dimension_min_mm?: number | null
          id?: number
          resistencia_1h?: string | null
          resistencia_2h?: string | null
          resistencia_3h?: string | null
          tabla_ref?: string | null
        }
        Update: {
          dimension_min_mm?: number | null
          id?: number
          resistencia_1h?: string | null
          resistencia_2h?: string | null
          resistencia_3h?: string | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_incendio_detectores: {
        Row: {
          detectores_requeridos: string | null
          grupo_ocupacion: string | null
          id: number
          tabla_ref: string | null
        }
        Insert: {
          detectores_requeridos?: string | null
          grupo_ocupacion?: string | null
          id?: number
          tabla_ref?: string | null
        }
        Update: {
          detectores_requeridos?: string | null
          grupo_ocupacion?: string | null
          id?: number
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_incendio_grupos_ocupacion: {
        Row: {
          descripcion: string | null
          ejemplos: string | null
          grupo: string | null
          id: number
          subgrupo: string | null
          tabla_ref: string | null
        }
        Insert: {
          descripcion?: string | null
          ejemplos?: string | null
          grupo?: string | null
          id?: number
          subgrupo?: string | null
          tabla_ref?: string | null
        }
        Update: {
          descripcion?: string | null
          ejemplos?: string | null
          grupo?: string | null
          id?: number
          subgrupo?: string | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_incendio_hidrantes: {
        Row: {
          area_m2_max: number | null
          area_m2_min: number | null
          caudal_lps: number | null
          id: number
          num_hidrantes: number | null
          tabla_ref: string | null
        }
        Insert: {
          area_m2_max?: number | null
          area_m2_min?: number | null
          caudal_lps?: number | null
          id?: number
          num_hidrantes?: number | null
          tabla_ref?: string | null
        }
        Update: {
          area_m2_max?: number | null
          area_m2_min?: number | null
          caudal_lps?: number | null
          id?: number
          num_hidrantes?: number | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_incendio_incremento_area: {
        Row: {
          condicion: string | null
          id: number
          incremento_pct: number | null
          tabla_ref: string | null
        }
        Insert: {
          condicion?: string | null
          id?: number
          incremento_pct?: number | null
          tabla_ref?: string | null
        }
        Update: {
          condicion?: string | null
          id?: number
          incremento_pct?: number | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_incendio_mamposteria_arcilla: {
        Row: {
          espesor_eq_mm: number | null
          id: number
          resistencia_h: number | null
          tabla_ref: string | null
        }
        Insert: {
          espesor_eq_mm?: number | null
          id?: number
          resistencia_h?: number | null
          tabla_ref?: string | null
        }
        Update: {
          espesor_eq_mm?: number | null
          id?: number
          resistencia_h?: number | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_incendio_mamposteria_concreto: {
        Row: {
          espesor_eq_mm: number | null
          id: number
          resistencia_h: number | null
          tabla_ref: string | null
        }
        Insert: {
          espesor_eq_mm?: number | null
          id?: number
          resistencia_h?: number | null
          tabla_ref?: string | null
        }
        Update: {
          espesor_eq_mm?: number | null
          id?: number
          resistencia_h?: number | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_incendio_materiales_llama: {
        Row: {
          clase: string | null
          id: number
          indice_propagacion: number | null
          material: string | null
          tabla_ref: string | null
        }
        Insert: {
          clase?: string | null
          id?: number
          indice_propagacion?: number | null
          material?: string | null
          tabla_ref?: string | null
        }
        Update: {
          clase?: string | null
          id?: number
          indice_propagacion?: number | null
          material?: string | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_incendio_muros_losas: {
        Row: {
          espesor_mm: number | null
          id: number
          resistencia_h: number | null
          tabla_ref: string | null
          tipo: string | null
        }
        Insert: {
          espesor_mm?: number | null
          id?: number
          resistencia_h?: number | null
          tabla_ref?: string | null
          tipo?: string | null
        }
        Update: {
          espesor_mm?: number | null
          id?: number
          resistencia_h?: number | null
          tabla_ref?: string | null
          tipo?: string | null
        }
        Relationships: []
      }
      nsr10_incendio_potencial_area: {
        Row: {
          id: number
          material: string | null
          potencial_mj_m2: number | null
          tabla_ref: string | null
        }
        Insert: {
          id?: number
          material?: string | null
          potencial_mj_m2?: number | null
          tabla_ref?: string | null
        }
        Update: {
          id?: number
          material?: string | null
          potencial_mj_m2?: number | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_incendio_potencial_masa: {
        Row: {
          id: number
          material: string | null
          potencial_mj_kg: number | null
          tabla_ref: string | null
        }
        Insert: {
          id?: number
          material?: string | null
          potencial_mj_kg?: number | null
          tabla_ref?: string | null
        }
        Update: {
          id?: number
          material?: string | null
          potencial_mj_kg?: number | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_incendio_propagacion_llama: {
        Row: {
          clase: string | null
          descripcion: string | null
          id: number
          indice_max: number | null
          indice_min: number | null
          tabla_ref: string | null
        }
        Insert: {
          clase?: string | null
          descripcion?: string | null
          id?: number
          indice_max?: number | null
          indice_min?: number | null
          tabla_ref?: string | null
        }
        Update: {
          clase?: string | null
          descripcion?: string | null
          id?: number
          indice_max?: number | null
          indice_min?: number | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_incendio_propiedades_concreto: {
        Row: {
          calor_especifico_j_kgk: number | null
          conductividad_w_mk: number | null
          id: number
          tabla_ref: string | null
          temperatura_c: number | null
        }
        Insert: {
          calor_especifico_j_kgk?: number | null
          conductividad_w_mk?: number | null
          id?: number
          tabla_ref?: string | null
          temperatura_c?: number | null
        }
        Update: {
          calor_especifico_j_kgk?: number | null
          conductividad_w_mk?: number | null
          id?: number
          tabla_ref?: string | null
          temperatura_c?: number | null
        }
        Relationships: []
      }
      nsr10_incendio_recubrimiento_losas: {
        Row: {
          id: number
          recubrimiento_preesforzado_mm: number | null
          recubrimiento_reforzado_mm: number | null
          resistencia_h: number | null
          tabla_ref: string | null
        }
        Insert: {
          id?: number
          recubrimiento_preesforzado_mm?: number | null
          recubrimiento_reforzado_mm?: number | null
          resistencia_h?: number | null
          tabla_ref?: string | null
        }
        Update: {
          id?: number
          recubrimiento_preesforzado_mm?: number | null
          recubrimiento_reforzado_mm?: number | null
          resistencia_h?: number | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_incendio_recubrimiento_vigas: {
        Row: {
          ancho_viga_mm: number | null
          id: number
          recubrimiento_mm: number | null
          resistencia_h: number | null
          tabla_ref: string | null
        }
        Insert: {
          ancho_viga_mm?: number | null
          id?: number
          recubrimiento_mm?: number | null
          resistencia_h?: number | null
          tabla_ref?: string | null
        }
        Update: {
          ancho_viga_mm?: number | null
          id?: number
          recubrimiento_mm?: number | null
          resistencia_h?: number | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_incendio_resistencia_elementos: {
        Row: {
          categoria_i_h: number | null
          categoria_ii_h: number | null
          categoria_iii_h: number | null
          elemento: string | null
          id: number
          tabla_ref: string | null
        }
        Insert: {
          categoria_i_h?: number | null
          categoria_ii_h?: number | null
          categoria_iii_h?: number | null
          elemento?: string | null
          id?: number
          tabla_ref?: string | null
        }
        Update: {
          categoria_i_h?: number | null
          categoria_ii_h?: number | null
          categoria_iii_h?: number | null
          elemento?: string | null
          id?: number
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_incendio_sistemas_proteccion: {
        Row: {
          alarma: string | null
          extintores: string | null
          grupo_ocupacion: string | null
          id: number
          rociadores: string | null
          tabla_ref: string | null
        }
        Insert: {
          alarma?: string | null
          extintores?: string | null
          grupo_ocupacion?: string | null
          id?: number
          rociadores?: string | null
          tabla_ref?: string | null
        }
        Update: {
          alarma?: string | null
          extintores?: string | null
          grupo_ocupacion?: string | null
          id?: number
          rociadores?: string | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_irregularidad_altura: {
        Row: {
          descripcion: string | null
          id: number
          nombre: string | null
          phi_a: number | null
          prohibida_alta: boolean | null
          tabla_ref: string | null
          tipo: string | null
        }
        Insert: {
          descripcion?: string | null
          id?: number
          nombre?: string | null
          phi_a?: number | null
          prohibida_alta?: boolean | null
          tabla_ref?: string | null
          tipo?: string | null
        }
        Update: {
          descripcion?: string | null
          id?: number
          nombre?: string | null
          phi_a?: number | null
          prohibida_alta?: boolean | null
          tabla_ref?: string | null
          tipo?: string | null
        }
        Relationships: []
      }
      nsr10_irregularidad_planta: {
        Row: {
          descripcion: string | null
          id: number
          nombre: string | null
          phi_p: number | null
          prohibida_alta: boolean | null
          tabla_ref: string | null
          tipo: string | null
        }
        Insert: {
          descripcion?: string | null
          id?: number
          nombre?: string | null
          phi_p?: number | null
          prohibida_alta?: boolean | null
          tabla_ref?: string | null
          tipo?: string | null
        }
        Update: {
          descripcion?: string | null
          id?: number
          nombre?: string | null
          phi_p?: number | null
          prohibida_alta?: boolean | null
          tabla_ref?: string | null
          tipo?: string | null
        }
        Relationships: []
      }
      nsr10_irregularidades: {
        Row: {
          descripcion: string | null
          id: number
          nombre: string | null
          phi_a: number | null
          phi_p: number | null
          prohibida_zona_alta: boolean | null
          tipo: string | null
        }
        Insert: {
          descripcion?: string | null
          id?: number
          nombre?: string | null
          phi_a?: number | null
          phi_p?: number | null
          prohibida_zona_alta?: boolean | null
          tipo?: string | null
        }
        Update: {
          descripcion?: string | null
          id?: number
          nombre?: string | null
          phi_a?: number | null
          phi_p?: number | null
          prohibida_zona_alta?: boolean | null
          tipo?: string | null
        }
        Relationships: []
      }
      nsr10_losas_sin_vigas: {
        Row: {
          con_abaco: boolean | null
          fy_mpa: number
          h_min: string
          id: number
          tabla_ref: string | null
          tipo_panel: string
        }
        Insert: {
          con_abaco?: boolean | null
          fy_mpa: number
          h_min: string
          id?: number
          tabla_ref?: string | null
          tipo_panel: string
        }
        Update: {
          con_abaco?: boolean | null
          fy_mpa?: number
          h_min?: string
          id?: number
          tabla_ref?: string | null
          tipo_panel?: string
        }
        Relationships: []
      }
      nsr10_madera_alcance: {
        Row: {
          altura_max_m: number | null
          id: number
          pisos_max: number | null
          requisitos: string | null
          sistema: string
          tabla_ref: string | null
          uso: string | null
        }
        Insert: {
          altura_max_m?: number | null
          id?: number
          pisos_max?: number | null
          requisitos?: string | null
          sistema: string
          tabla_ref?: string | null
          uso?: string | null
        }
        Update: {
          altura_max_m?: number | null
          id?: number
          pisos_max?: number | null
          requisitos?: string | null
          sistema?: string
          tabla_ref?: string | null
          uso?: string | null
        }
        Relationships: []
      }
      nsr10_madera_arandelas: {
        Row: {
          diametro_arandela_mm: number | null
          diametro_perno_mm: number | null
          espesor_arandela_mm: number | null
          id: number
          tabla_ref: string | null
        }
        Insert: {
          diametro_arandela_mm?: number | null
          diametro_perno_mm?: number | null
          espesor_arandela_mm?: number | null
          id?: number
          tabla_ref?: string | null
        }
        Update: {
          diametro_arandela_mm?: number | null
          diametro_perno_mm?: number | null
          espesor_arandela_mm?: number | null
          id?: number
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_madera_carga_angulo: {
        Row: {
          angulo_grados: number
          id: number
          notas: string | null
          tabla_ref: string | null
          z_ratio: number | null
        }
        Insert: {
          angulo_grados: number
          id?: number
          notas?: string | null
          tabla_ref?: string | null
          z_ratio?: number | null
        }
        Update: {
          angulo_grados?: number
          id?: number
          notas?: string | null
          tabla_ref?: string | null
          z_ratio?: number | null
        }
        Relationships: []
      }
      nsr10_madera_clavos: {
        Row: {
          diametro_mm: number
          espaciamiento_min: string | null
          id: number
          longitud_mm: number
          penetracion_min_mm: number | null
          tabla_ref: string | null
          z_extraccion_n_mm: number | null
          z_lateral_n: number | null
        }
        Insert: {
          diametro_mm: number
          espaciamiento_min?: string | null
          id?: number
          longitud_mm: number
          penetracion_min_mm?: number | null
          tabla_ref?: string | null
          z_extraccion_n_mm?: number | null
          z_lateral_n?: number | null
        }
        Update: {
          diametro_mm?: number
          espaciamiento_min?: string | null
          id?: number
          longitud_mm?: number
          penetracion_min_mm?: number | null
          tabla_ref?: string | null
          z_extraccion_n_mm?: number | null
          z_lateral_n?: number | null
        }
        Relationships: []
      }
      nsr10_madera_coef_cd: {
        Row: {
          cd: number | null
          duracion_carga: string | null
          id: number
          tabla_ref: string | null
        }
        Insert: {
          cd?: number | null
          duracion_carga?: string | null
          id?: number
          tabla_ref?: string | null
        }
        Update: {
          cd?: number | null
          duracion_carga?: string | null
          id?: number
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_madera_coef_cg: {
        Row: {
          cg: number | null
          id: number
          num_conectores: number | null
          tabla_ref: string | null
        }
        Insert: {
          cg?: number | null
          id?: number
          num_conectores?: number | null
          tabla_ref?: string | null
        }
        Update: {
          cg?: number | null
          id?: number
          num_conectores?: number | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_madera_coef_cl: {
        Row: {
          cl: number | null
          d_b: string | null
          id: number
          tabla_ref: string | null
        }
        Insert: {
          cl?: number | null
          d_b?: string | null
          id?: number
          tabla_ref?: string | null
        }
        Update: {
          cl?: number | null
          d_b?: string | null
          id?: number
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_madera_coef_cm: {
        Row: {
          ch_mayor_19: number | null
          ch_menor_19: number | null
          id: number
          propiedad: string | null
          tabla_ref: string | null
        }
        Insert: {
          ch_mayor_19?: number | null
          ch_menor_19?: number | null
          id?: number
          propiedad?: string | null
          tabla_ref?: string | null
        }
        Update: {
          ch_mayor_19?: number | null
          ch_menor_19?: number | null
          id?: number
          propiedad?: string | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_madera_coef_ct: {
        Row: {
          ch_humedo: number | null
          ch_seco: number | null
          id: number
          tabla_ref: string | null
          temperatura_c: string | null
        }
        Insert: {
          ch_humedo?: number | null
          ch_seco?: number | null
          id?: number
          tabla_ref?: string | null
          temperatura_c?: string | null
        }
        Update: {
          ch_humedo?: number | null
          ch_seco?: number | null
          id?: number
          tabla_ref?: string | null
          temperatura_c?: string | null
        }
        Relationships: []
      }
      nsr10_madera_columnas: {
        Row: {
          esbeltez_max: number | null
          factor_k: number | null
          formula: string | null
          id: number
          notas: string | null
          tabla_ref: string | null
          tipo: string
        }
        Insert: {
          esbeltez_max?: number | null
          factor_k?: number | null
          formula?: string | null
          id?: number
          notas?: string | null
          tabla_ref?: string | null
          tipo: string
        }
        Update: {
          esbeltez_max?: number | null
          factor_k?: number | null
          formula?: string | null
          id?: number
          notas?: string | null
          tabla_ref?: string | null
          tipo?: string
        }
        Relationships: []
      }
      nsr10_madera_columnas_comp: {
        Row: {
          espaciamiento: string | null
          factor_kf: number | null
          id: number
          requisitos: string | null
          tabla_ref: string | null
          tipo_union: string
        }
        Insert: {
          espaciamiento?: string | null
          factor_kf?: number | null
          id?: number
          requisitos?: string | null
          tabla_ref?: string | null
          tipo_union: string
        }
        Update: {
          espaciamiento?: string | null
          factor_kf?: number | null
          id?: number
          requisitos?: string | null
          tabla_ref?: string | null
          tipo_union?: string
        }
        Relationships: []
      }
      nsr10_madera_conectores_anillo: {
        Row: {
          diametro_mm: number | null
          espesor_min_mm: number | null
          id: number
          perno_requerido: string | null
          tabla_ref: string | null
          tipo: string
          z_paralelo_kn: number | null
          z_perp_kn: number | null
        }
        Insert: {
          diametro_mm?: number | null
          espesor_min_mm?: number | null
          id?: number
          perno_requerido?: string | null
          tabla_ref?: string | null
          tipo: string
          z_paralelo_kn?: number | null
          z_perp_kn?: number | null
        }
        Update: {
          diametro_mm?: number | null
          espesor_min_mm?: number | null
          id?: number
          perno_requerido?: string | null
          tabla_ref?: string | null
          tipo?: string
          z_paralelo_kn?: number | null
          z_perp_kn?: number | null
        }
        Relationships: []
      }
      nsr10_madera_deflexiones: {
        Row: {
          delta_l: string | null
          delta_total: string | null
          id: number
          tabla_ref: string | null
          tipo_elemento: string | null
        }
        Insert: {
          delta_l?: string | null
          delta_total?: string | null
          id?: number
          tabla_ref?: string | null
          tipo_elemento?: string | null
        }
        Update: {
          delta_l?: string | null
          delta_total?: string | null
          id?: number
          tabla_ref?: string | null
          tipo_elemento?: string | null
        }
        Relationships: []
      }
      nsr10_madera_esfuerzos: {
        Row: {
          e_mpa: number | null
          emin_mpa: number | null
          fb_mpa: number
          fc_mpa: number | null
          fcperp_mpa: number | null
          ft_mpa: number | null
          fv_mpa: number | null
          grupo: string
          id: number
          tabla_ref: string | null
        }
        Insert: {
          e_mpa?: number | null
          emin_mpa?: number | null
          fb_mpa: number
          fc_mpa?: number | null
          fcperp_mpa?: number | null
          ft_mpa?: number | null
          fv_mpa?: number | null
          grupo: string
          id?: number
          tabla_ref?: string | null
        }
        Update: {
          e_mpa?: number | null
          emin_mpa?: number | null
          fb_mpa?: number
          fc_mpa?: number | null
          fcperp_mpa?: number | null
          ft_mpa?: number | null
          fv_mpa?: number | null
          grupo?: string
          id?: number
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_madera_esfuerzos_adm: {
        Row: {
          compresion_par_mpa: number | null
          compresion_perp_mpa: number | null
          cortante_mpa: number | null
          flexion_mpa: number | null
          grupo: string | null
          id: number
          tabla_ref: string | null
          traccion_mpa: number | null
        }
        Insert: {
          compresion_par_mpa?: number | null
          compresion_perp_mpa?: number | null
          cortante_mpa?: number | null
          flexion_mpa?: number | null
          grupo?: string | null
          id?: number
          tabla_ref?: string | null
          traccion_mpa?: number | null
        }
        Update: {
          compresion_par_mpa?: number | null
          compresion_perp_mpa?: number | null
          cortante_mpa?: number | null
          flexion_mpa?: number | null
          grupo?: string | null
          id?: number
          tabla_ref?: string | null
          traccion_mpa?: number | null
        }
        Relationships: []
      }
      nsr10_madera_factores: {
        Row: {
          aplicacion: string | null
          condicion: string | null
          factor: string
          id: number
          simbolo: string
          tabla_ref: string | null
          valor: number | null
        }
        Insert: {
          aplicacion?: string | null
          condicion?: string | null
          factor: string
          id?: number
          simbolo: string
          tabla_ref?: string | null
          valor?: number | null
        }
        Update: {
          aplicacion?: string | null
          condicion?: string | null
          factor?: string
          id?: number
          simbolo?: string
          tabla_ref?: string | null
          valor?: number | null
        }
        Relationships: []
      }
      nsr10_madera_factores_red: {
        Row: {
          factor: number | null
          id: number
          nota: string | null
          propiedad: string | null
          tabla_ref: string | null
        }
        Insert: {
          factor?: number | null
          id?: number
          nota?: string | null
          propiedad?: string | null
          tabla_ref?: string | null
        }
        Update: {
          factor?: number | null
          id?: number
          nota?: string | null
          propiedad?: string | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_madera_grupos: {
        Row: {
          densidad_kg_m3: number | null
          especie: string | null
          grupo: string
          id: number
          modulo_elasticidad_mpa: number | null
          nombre_comun: string | null
          tabla_ref: string | null
        }
        Insert: {
          densidad_kg_m3?: number | null
          especie?: string | null
          grupo: string
          id?: number
          modulo_elasticidad_mpa?: number | null
          nombre_comun?: string | null
          tabla_ref?: string | null
        }
        Update: {
          densidad_kg_m3?: number | null
          especie?: string | null
          grupo?: string
          id?: number
          modulo_elasticidad_mpa?: number | null
          nombre_comun?: string | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_madera_longitud_ke: {
        Row: {
          condicion: string | null
          id: number
          ke: number | null
          tabla_ref: string | null
        }
        Insert: {
          condicion?: string | null
          id?: number
          ke?: number | null
          tabla_ref?: string | null
        }
        Update: {
          condicion?: string | null
          id?: number
          ke?: number | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_madera_modulos_e: {
        Row: {
          e_min_mpa: number | null
          e_prom_mpa: number | null
          g_mpa: number | null
          grupo: string | null
          id: number
          tabla_ref: string | null
        }
        Insert: {
          e_min_mpa?: number | null
          e_prom_mpa?: number | null
          g_mpa?: number | null
          grupo?: string | null
          id?: number
          tabla_ref?: string | null
        }
        Update: {
          e_min_mpa?: number | null
          e_prom_mpa?: number | null
          g_mpa?: number | null
          grupo?: string | null
          id?: number
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_madera_muros_corte: {
        Row: {
          capacidad_kn_m: number | null
          clavado: string | null
          espesor_mm: number | null
          id: number
          requisitos: string | null
          tabla_ref: string | null
          tipo_forro: string
        }
        Insert: {
          capacidad_kn_m?: number | null
          clavado?: string | null
          espesor_mm?: number | null
          id?: number
          requisitos?: string | null
          tabla_ref?: string | null
          tipo_forro: string
        }
        Update: {
          capacidad_kn_m?: number | null
          clavado?: string | null
          espesor_mm?: number | null
          id?: number
          requisitos?: string | null
          tabla_ref?: string | null
          tipo_forro?: string
        }
        Relationships: []
      }
      nsr10_madera_pernos: {
        Row: {
          diametro_mm: number
          diametro_pulg: string
          dist_borde_mm: number | null
          espesor_min_mm: number | null
          id: number
          tabla_ref: string | null
          z_paralelo_n: number | null
          z_perp_n: number | null
        }
        Insert: {
          diametro_mm: number
          diametro_pulg: string
          dist_borde_mm?: number | null
          espesor_min_mm?: number | null
          id?: number
          tabla_ref?: string | null
          z_paralelo_n?: number | null
          z_perp_n?: number | null
        }
        Update: {
          diametro_mm?: number
          diametro_pulg?: string
          dist_borde_mm?: number | null
          espesor_min_mm?: number | null
          id?: number
          tabla_ref?: string | null
          z_paralelo_n?: number | null
          z_perp_n?: number | null
        }
        Relationships: []
      }
      nsr10_madera_pernos_carga: {
        Row: {
          diametro_mm: number | null
          grupo_a_kn: number | null
          grupo_b_kn: number | null
          grupo_c_kn: number | null
          id: number
          tabla_ref: string | null
        }
        Insert: {
          diametro_mm?: number | null
          grupo_a_kn?: number | null
          grupo_b_kn?: number | null
          grupo_c_kn?: number | null
          id?: number
          tabla_ref?: string | null
        }
        Update: {
          diametro_mm?: number | null
          grupo_a_kn?: number | null
          grupo_b_kn?: number | null
          grupo_c_kn?: number | null
          id?: number
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_madera_placa_dentada: {
        Row: {
          aplicacion: string | null
          area_cm2: number | null
          espesor_madera_min_mm: number | null
          id: number
          tabla_ref: string | null
          tipo_placa: string
          z_kn: number | null
        }
        Insert: {
          aplicacion?: string | null
          area_cm2?: number | null
          espesor_madera_min_mm?: number | null
          id?: number
          tabla_ref?: string | null
          tipo_placa: string
          z_kn?: number | null
        }
        Update: {
          aplicacion?: string | null
          area_cm2?: number | null
          espesor_madera_min_mm?: number | null
          id?: number
          tabla_ref?: string | null
          tipo_placa?: string
          z_kn?: number | null
        }
        Relationships: []
      }
      nsr10_madera_tamano: {
        Row: {
          ancho_mm: number | null
          cf: number | null
          cl: number | null
          id: number
          notas: string | null
          peralte_mm: number | null
          tabla_ref: string | null
        }
        Insert: {
          ancho_mm?: number | null
          cf?: number | null
          cl?: number | null
          id?: number
          notas?: string | null
          peralte_mm?: number | null
          tabla_ref?: string | null
        }
        Update: {
          ancho_mm?: number | null
          cf?: number | null
          cl?: number | null
          id?: number
          notas?: string | null
          peralte_mm?: number | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_madera_tornillos: {
        Row: {
          diametro_mm: number | null
          id: number
          numero: number
          penetracion_min_mm: number | null
          tabla_ref: string | null
          z_extraccion_n_mm: number | null
          z_lateral_n: number | null
        }
        Insert: {
          diametro_mm?: number | null
          id?: number
          numero: number
          penetracion_min_mm?: number | null
          tabla_ref?: string | null
          z_extraccion_n_mm?: number | null
          z_lateral_n?: number | null
        }
        Update: {
          diametro_mm?: number | null
          id?: number
          numero?: number
          penetracion_min_mm?: number | null
          tabla_ref?: string | null
          z_extraccion_n_mm?: number | null
          z_lateral_n?: number | null
        }
        Relationships: []
      }
      nsr10_mamposteria_confinada: {
        Row: {
          id: number
          notas: string | null
          resistencia_min_mpa: number | null
          tabla_ref: string | null
          tipo_unidad: string
        }
        Insert: {
          id?: number
          notas?: string | null
          resistencia_min_mpa?: number | null
          tabla_ref?: string | null
          tipo_unidad: string
        }
        Update: {
          id?: number
          notas?: string | null
          resistencia_min_mpa?: number | null
          tabla_ref?: string | null
          tipo_unidad?: string
        }
        Relationships: []
      }
      nsr10_mamposteria_cortante: {
        Row: {
          condicion: string
          formula: string
          id: number
          tabla_ref: string | null
          vm_max: string | null
        }
        Insert: {
          condicion: string
          formula: string
          id?: number
          tabla_ref?: string | null
          vm_max?: string | null
        }
        Update: {
          condicion?: string
          formula?: string
          id?: number
          tabla_ref?: string | null
          vm_max?: string | null
        }
        Relationships: []
      }
      nsr10_mamposteria_doblado: {
        Row: {
          diametro_barra: string
          diametro_doblado_db: number
          id: number
          tabla_ref: string | null
        }
        Insert: {
          diametro_barra: string
          diametro_doblado_db: number
          id?: number
          tabla_ref?: string | null
        }
        Update: {
          diametro_barra?: string
          diametro_doblado_db?: number
          id?: number
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_mamposteria_esbeltez: {
        Row: {
          factor_correccion: number
          id: number
          relacion_h_t: number
          tabla_ref: string | null
        }
        Insert: {
          factor_correccion: number
          id?: number
          relacion_h_t: number
          tabla_ref?: string | null
        }
        Update: {
          factor_correccion?: number
          id?: number
          relacion_h_t?: number
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_mamposteria_espesores: {
        Row: {
          espesor_nominal_mm: number | null
          espesor_pared_min_mm: number | null
          espesor_tabique_min_mm: number | null
          id: number
          tabla_ref: string | null
          tipo_unidad: string
        }
        Insert: {
          espesor_nominal_mm?: number | null
          espesor_pared_min_mm?: number | null
          espesor_tabique_min_mm?: number | null
          id?: number
          tabla_ref?: string | null
          tipo_unidad: string
        }
        Update: {
          espesor_nominal_mm?: number | null
          espesor_pared_min_mm?: number | null
          espesor_tabique_min_mm?: number | null
          id?: number
          tabla_ref?: string | null
          tipo_unidad?: string
        }
        Relationships: []
      }
      nsr10_mamposteria_inyeccion: {
        Row: {
          altura_max_m: number
          dimension_espacio: string
          id: number
          metodo: string | null
          tabla_ref: string | null
        }
        Insert: {
          altura_max_m: number
          dimension_espacio: string
          id?: number
          metodo?: string | null
          tabla_ref?: string | null
        }
        Update: {
          altura_max_m?: number
          dimension_espacio?: string
          id?: number
          metodo?: string | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_mamposteria_machones: {
        Row: {
          coeficiente: number | null
          espaciamiento_e_t: string
          espesor_machon_muro: number | null
          id: number
          tabla_ref: string | null
        }
        Insert: {
          coeficiente?: number | null
          espaciamiento_e_t: string
          espesor_machon_muro?: number | null
          id?: number
          tabla_ref?: string | null
        }
        Update: {
          coeficiente?: number | null
          espaciamiento_e_t?: string
          espesor_machon_muro?: number | null
          id?: number
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_mamposteria_ruptura: {
        Row: {
          direccion: string
          fr_mpa: number | null
          id: number
          mortero_tipo: string
          tabla_ref: string | null
          tipo_unidad: string
        }
        Insert: {
          direccion: string
          fr_mpa?: number | null
          id?: number
          mortero_tipo: string
          tabla_ref?: string | null
          tipo_unidad: string
        }
        Update: {
          direccion?: string
          fr_mpa?: number | null
          id?: number
          mortero_tipo?: string
          tabla_ref?: string | null
          tipo_unidad?: string
        }
        Relationships: []
      }
      nsr10_mamposteria_tolerancias: {
        Row: {
          elemento: string
          id: number
          tabla_ref: string | null
          tolerancia: string
          unidad: string | null
        }
        Insert: {
          elemento: string
          id?: number
          tabla_ref?: string | null
          tolerancia: string
          unidad?: string | null
        }
        Update: {
          elemento?: string
          id?: number
          tabla_ref?: string | null
          tolerancia?: string
          unidad?: string | null
        }
        Relationships: []
      }
      nsr10_mamposteria_vn_max: {
        Row: {
          condicion: string
          id: number
          tabla_ref: string | null
          vn_max_formula: string
        }
        Insert: {
          condicion: string
          id?: number
          tabla_ref?: string | null
          vn_max_formula: string
        }
        Update: {
          condicion?: string
          id?: number
          tabla_ref?: string | null
          vn_max_formula?: string
        }
        Relationships: []
      }
      nsr10_masas_materiales: {
        Row: {
          densidad_kg_m3: number
          id: number
          material: string
          notas: string | null
          tabla_ref: string | null
        }
        Insert: {
          densidad_kg_m3: number
          id?: number
          material: string
          notas?: string | null
          tabla_ref?: string | null
        }
        Update: {
          densidad_kg_m3?: number
          id?: number
          material?: string
          notas?: string | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_morteros_pega: {
        Row: {
          descripcion: string | null
          id: number
          proporcion_arena: string | null
          proporcion_cal: string | null
          proporcion_cemento: string | null
          resistencia_min_mpa: number | null
          tabla_ref: string | null
          tipo: string
        }
        Insert: {
          descripcion?: string | null
          id?: number
          proporcion_arena?: string | null
          proporcion_cal?: string | null
          proporcion_cemento?: string | null
          resistencia_min_mpa?: number | null
          tabla_ref?: string | null
          tipo: string
        }
        Update: {
          descripcion?: string | null
          id?: number
          proporcion_arena?: string | null
          proporcion_cal?: string | null
          proporcion_cemento?: string | null
          resistencia_min_mpa?: number | null
          tabla_ref?: string | null
          tipo?: string
        }
        Relationships: []
      }
      nsr10_morteros_relleno: {
        Row: {
          descripcion: string | null
          id: number
          proporcion_agregado: string | null
          proporcion_arena: string | null
          proporcion_cal: string | null
          proporcion_cemento: string | null
          tabla_ref: string | null
          tipo: string
        }
        Insert: {
          descripcion?: string | null
          id?: number
          proporcion_agregado?: string | null
          proporcion_arena?: string | null
          proporcion_cal?: string | null
          proporcion_cemento?: string | null
          tabla_ref?: string | null
          tipo: string
        }
        Update: {
          descripcion?: string | null
          id?: number
          proporcion_agregado?: string | null
          proporcion_arena?: string | null
          proporcion_cal?: string | null
          proporcion_cemento?: string | null
          tabla_ref?: string | null
          tipo?: string
        }
        Relationships: []
      }
      nsr10_movimientos_sismicos: {
        Row: {
          id: number
          periodo_retorno_anos: number | null
          probabilidad_excedencia: string | null
          tabla_ref: string | null
          tipo_movimiento: string
          uso: string | null
        }
        Insert: {
          id?: number
          periodo_retorno_anos?: number | null
          probabilidad_excedencia?: string | null
          tabla_ref?: string | null
          tipo_movimiento: string
          uso?: string | null
        }
        Update: {
          id?: number
          periodo_retorno_anos?: number | null
          probabilidad_excedencia?: string | null
          tabla_ref?: string | null
          tipo_movimiento?: string
          uso?: string | null
        }
        Relationships: []
      }
      nsr10_municipios: {
        Row: {
          aa: number
          ad: number | null
          ae: number | null
          av: number
          departamento: string | null
          id: number
          municipio: string
          zona_amenaza: string | null
        }
        Insert: {
          aa: number
          ad?: number | null
          ae?: number | null
          av: number
          departamento?: string | null
          id?: number
          municipio: string
          zona_amenaza?: string | null
        }
        Update: {
          aa?: number
          ad?: number | null
          ae?: number | null
          av?: number
          departamento?: string | null
          id?: number
          municipio?: string
          zona_amenaza?: string | null
        }
        Relationships: []
      }
      nsr10_muros_diafragma: {
        Row: {
          condicion: string
          id: number
          tabla_ref: string | null
          vm_max_mpa: number
        }
        Insert: {
          condicion: string
          id?: number
          tabla_ref?: string | null
          vm_max_mpa: number
        }
        Update: {
          condicion?: string
          id?: number
          tabla_ref?: string | null
          vm_max_mpa?: number
        }
        Relationships: []
      }
      nsr10_nomenclatura: {
        Row: {
          definicion: string | null
          id: number
          nombre: string
          seccion_ref: string | null
          simbolo: string
          titulo: string | null
          unidades: string | null
        }
        Insert: {
          definicion?: string | null
          id?: number
          nombre: string
          seccion_ref?: string | null
          simbolo: string
          titulo?: string | null
          unidades?: string | null
        }
        Update: {
          definicion?: string | null
          id?: number
          nombre?: string
          seccion_ref?: string | null
          simbolo?: string
          titulo?: string | null
          unidades?: string | null
        }
        Relationships: []
      }
      nsr10_perfil_suelo: {
        Row: {
          descripcion: string | null
          id: number
          n_max: number | null
          n_min: number | null
          nombre: string | null
          su_max: number | null
          su_min: number | null
          tabla_ref: string | null
          tipo: string | null
          vs_max: number | null
          vs_min: number | null
        }
        Insert: {
          descripcion?: string | null
          id?: number
          n_max?: number | null
          n_min?: number | null
          nombre?: string | null
          su_max?: number | null
          su_min?: number | null
          tabla_ref?: string | null
          tipo?: string | null
          vs_max?: number | null
          vs_min?: number | null
        }
        Update: {
          descripcion?: string | null
          id?: number
          n_max?: number | null
          n_min?: number | null
          nombre?: string | null
          su_max?: number | null
          su_min?: number | null
          tabla_ref?: string | null
          tipo?: string | null
          vs_max?: number | null
          vs_min?: number | null
        }
        Relationships: []
      }
      nsr10_periodo_aproximado: {
        Row: {
          alpha: number
          ct: number
          id: number
          notas: string | null
          sistema_estructural: string
          tabla_ref: string | null
        }
        Insert: {
          alpha: number
          ct: number
          id?: number
          notas?: string | null
          sistema_estructural: string
          tabla_ref?: string | null
        }
        Update: {
          alpha?: number
          ct?: number
          id?: number
          notas?: string | null
          sistema_estructural?: string
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_phi_concreto: {
        Row: {
          condicion: string
          id: number
          notas: string | null
          phi: number
          seccion_ref: string | null
        }
        Insert: {
          condicion: string
          id?: number
          notas?: string | null
          phi: number
          seccion_ref?: string | null
        }
        Update: {
          condicion?: string
          id?: number
          notas?: string | null
          phi?: number
          seccion_ref?: string | null
        }
        Relationships: []
      }
      nsr10_procedimiento_diseno: {
        Row: {
          categoria: string
          grupo_uso: string
          id: number
          procedimiento: string
          requisitos: string | null
          tabla_ref: string | null
          tipo_edificacion: string | null
        }
        Insert: {
          categoria: string
          grupo_uso: string
          id?: number
          procedimiento: string
          requisitos?: string | null
          tabla_ref?: string | null
          tipo_edificacion?: string | null
        }
        Update: {
          categoria?: string
          grupo_uso?: string
          id?: number
          procedimiento?: string
          requisitos?: string | null
          tabla_ref?: string | null
          tipo_edificacion?: string | null
        }
        Relationships: []
      }
      nsr10_recubrimientos: {
        Row: {
          condicion: string
          id: number
          notas: string | null
          recubrimiento_preesforzado_mm: number | null
          recubrimiento_reforzado_mm: number | null
          tabla_ref: string | null
        }
        Insert: {
          condicion: string
          id?: number
          notas?: string | null
          recubrimiento_preesforzado_mm?: number | null
          recubrimiento_reforzado_mm?: number | null
          tabla_ref?: string | null
        }
        Update: {
          condicion?: string
          id?: number
          notas?: string | null
          recubrimiento_preesforzado_mm?: number | null
          recubrimiento_reforzado_mm?: number | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_referencias: {
        Row: {
          aplicacion: string | null
          codigo: string
          id: number
          nombre: string
          organizacion: string | null
          pais: string | null
          titulo_nsr: string | null
          version: string | null
        }
        Insert: {
          aplicacion?: string | null
          codigo: string
          id?: number
          nombre: string
          organizacion?: string | null
          pais?: string | null
          titulo_nsr?: string | null
          version?: string | null
        }
        Update: {
          aplicacion?: string | null
          codigo?: string
          id?: number
          nombre?: string
          organizacion?: string | null
          pais?: string | null
          titulo_nsr?: string | null
          version?: string | null
        }
        Relationships: []
      }
      nsr10_regiones_sismicas: {
        Row: {
          aa: number
          av: number
          descripcion: string | null
          id: number
          region: number
          tabla_ref: string | null
        }
        Insert: {
          aa: number
          av: number
          descripcion?: string | null
          id?: number
          region: number
          tabla_ref?: string | null
        }
        Update: {
          aa?: number
          av?: number
          descripcion?: string | null
          id?: number
          region?: number
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_requisitos_concreto: {
        Row: {
          clase_exposicion: string
          fc_min_mpa: number | null
          id: number
          relacion_ac_max: number | null
          requisitos_adicionales: string | null
          tabla_ref: string | null
        }
        Insert: {
          clase_exposicion: string
          fc_min_mpa?: number | null
          id?: number
          relacion_ac_max?: number | null
          requisitos_adicionales?: string | null
          tabla_ref?: string | null
        }
        Update: {
          clase_exposicion?: string
          fc_min_mpa?: number | null
          id?: number
          relacion_ac_max?: number | null
          requisitos_adicionales?: string | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_requisitos_f3: {
        Row: {
          id: number
          material_cementante: string
          porcentaje_max: number | null
          tabla_ref: string | null
        }
        Insert: {
          id?: number
          material_cementante: string
          porcentaje_max?: number | null
          tabla_ref?: string | null
        }
        Update: {
          id?: number
          material_cementante?: string
          porcentaje_max?: number | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_secciones: {
        Row: {
          contenido: string | null
          created_at: string | null
          id: number
          pagina: number | null
          search_vector: unknown
          seccion: string
          tipo: string | null
          titulo: string
        }
        Insert: {
          contenido?: string | null
          created_at?: string | null
          id?: number
          pagina?: number | null
          search_vector?: unknown
          seccion: string
          tipo?: string | null
          titulo: string
        }
        Update: {
          contenido?: string | null
          created_at?: string | null
          id?: number
          pagina?: number | null
          search_vector?: unknown
          seccion?: string
          tipo?: string | null
          titulo?: string
        }
        Relationships: []
      }
      nsr10_separacion_sismica: {
        Row: {
          id: number
          notas: string | null
          pisos: number | null
          separacion_coincide_pct: number | null
          separacion_no_coincide_pct: number | null
          separacion_sin_vecino_pct: number | null
          tabla_ref: string | null
        }
        Insert: {
          id?: number
          notas?: string | null
          pisos?: number | null
          separacion_coincide_pct?: number | null
          separacion_no_coincide_pct?: number | null
          separacion_sin_vecino_pct?: number | null
          tabla_ref?: string | null
        }
        Update: {
          id?: number
          notas?: string | null
          pisos?: number | null
          separacion_coincide_pct?: number | null
          separacion_no_coincide_pct?: number | null
          separacion_sin_vecino_pct?: number | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_separacion_sismica_cubierta: {
        Row: {
          condicion: string
          formula: string | null
          id: number
          notas: string | null
          separacion_min: string
          tabla_ref: string | null
        }
        Insert: {
          condicion: string
          formula?: string | null
          id?: number
          notas?: string | null
          separacion_min: string
          tabla_ref?: string | null
        }
        Update: {
          condicion?: string
          formula?: string | null
          id?: number
          notas?: string | null
          separacion_min?: string
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_supervision_calificacion: {
        Row: {
          experiencia_min_anos: number | null
          grado: string
          id: number
          independencia: string | null
          matricula: string | null
          profesion: string
          tabla_ref: string | null
        }
        Insert: {
          experiencia_min_anos?: number | null
          grado: string
          id?: number
          independencia?: string | null
          matricula?: string | null
          profesion: string
          tabla_ref?: string | null
        }
        Update: {
          experiencia_min_anos?: number | null
          grado?: string
          id?: number
          independencia?: string | null
          matricula?: string | null
          profesion?: string
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_supervision_documentos: {
        Row: {
          archivo: string | null
          contenido: string | null
          documento: string
          frecuencia: string | null
          id: number
          responsable: string | null
          tabla_ref: string | null
        }
        Insert: {
          archivo?: string | null
          contenido?: string | null
          documento: string
          frecuencia?: string | null
          id?: number
          responsable?: string | null
          tabla_ref?: string | null
        }
        Update: {
          archivo?: string | null
          contenido?: string | null
          documento?: string
          frecuencia?: string | null
          id?: number
          responsable?: string | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_supervision_ejecucion: {
        Row: {
          actividad: string
          control: string
          criterio_aceptacion: string | null
          frecuencia: string | null
          id: number
          tabla_ref: string | null
        }
        Insert: {
          actividad: string
          control: string
          criterio_aceptacion?: string | null
          frecuencia?: string | null
          id?: number
          tabla_ref?: string | null
        }
        Update: {
          actividad?: string
          control?: string
          criterio_aceptacion?: string | null
          frecuencia?: string | null
          id?: number
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_supervision_ensayos: {
        Row: {
          ensayo: string
          frecuencia: string
          id: number
          material: string
          norma: string | null
          observaciones: string | null
          tabla_ref: string | null
        }
        Insert: {
          ensayo: string
          frecuencia: string
          id?: number
          material: string
          norma?: string | null
          observaciones?: string | null
          tabla_ref?: string | null
        }
        Update: {
          ensayo?: string
          frecuencia?: string
          id?: number
          material?: string
          norma?: string | null
          observaciones?: string | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_supervision_grados: {
        Row: {
          aplicacion: string | null
          descripcion: string
          grado: string
          id: number
          presencia: string | null
          requisitos: string | null
          tabla_ref: string | null
        }
        Insert: {
          aplicacion?: string | null
          descripcion: string
          grado: string
          id?: number
          presencia?: string | null
          requisitos?: string | null
          tabla_ref?: string | null
        }
        Update: {
          aplicacion?: string | null
          descripcion?: string
          grado?: string
          id?: number
          presencia?: string | null
          requisitos?: string | null
          tabla_ref?: string | null
        }
        Relationships: []
      }
      nsr10_supervision_materiales: {
        Row: {
          control_requerido: string
          documentacion: string | null
          id: number
          material: string
          tabla_ref: string | null
          verificacion: string | null
        }
        Insert: {
          control_requerido: string
          documentacion?: string | null
          id?: number
          material: string
          tabla_ref?: string | null
          verificacion?: string | null
        }
        Update: {
          control_requerido?: string
          documentacion?: string | null
          id?: number
          material?: string
          tabla_ref?: string | null
          verificacion?: string | null
        }
        Relationships: []
      }
      nsr10_supervision_requisitos: {
        Row: {
          frecuencia_visitas: string | null
          grado_supervision: string
          grupo_uso: string
          id: number
          supervisor_requisitos: string | null
          tabla_ref: string | null
          zona_sismica: string | null
        }
        Insert: {
          frecuencia_visitas?: string | null
          grado_supervision: string
          grupo_uso: string
          id?: number
          supervisor_requisitos?: string | null
          tabla_ref?: string | null
          zona_sismica?: string | null
        }
        Update: {
          frecuencia_visitas?: string | null
          grado_supervision?: string
          grupo_uso?: string
          id?: number
          supervisor_requisitos?: string | null
          tabla_ref?: string | null
          zona_sismica?: string | null
        }
        Relationships: []
      }
      nsr10_tipos_analisis: {
        Row: {
          altura_max_m: number | null
          id: number
          metodo_permitido: string
          notas: string | null
          obligatorio: boolean | null
          regularidad: string | null
          tabla_ref: string | null
          zona_sismica: string
        }
        Insert: {
          altura_max_m?: number | null
          id?: number
          metodo_permitido: string
          notas?: string | null
          obligatorio?: boolean | null
          regularidad?: string | null
          tabla_ref?: string | null
          zona_sismica: string
        }
        Update: {
          altura_max_m?: number | null
          id?: number
          metodo_permitido?: string
          notas?: string | null
          obligatorio?: boolean | null
          regularidad?: string | null
          tabla_ref?: string | null
          zona_sismica?: string
        }
        Relationships: []
      }
      nsr10_viento: {
        Row: {
          condicion: string | null
          id: number
          notas: string | null
          parametro: string
          tabla: string
          valor: number | null
        }
        Insert: {
          condicion?: string | null
          id?: number
          notas?: string | null
          parametro: string
          tabla: string
          valor?: number | null
        }
        Update: {
          condicion?: string | null
          id?: number
          notas?: string | null
          parametro?: string
          tabla?: string
          valor?: number | null
        }
        Relationships: []
      }
      nsr10_viento_cubiertas: {
        Row: {
          angulo: string | null
          cp_negativo: number | null
          cp_positivo: number | null
          id: number
          notas: string | null
          tabla_ref: string | null
          tipo_cubierta: string
          zona: string | null
        }
        Insert: {
          angulo?: string | null
          cp_negativo?: number | null
          cp_positivo?: number | null
          id?: number
          notas?: string | null
          tabla_ref?: string | null
          tipo_cubierta: string
          zona?: string | null
        }
        Update: {
          angulo?: string | null
          cp_negativo?: number | null
          cp_positivo?: number | null
          id?: number
          notas?: string | null
          tabla_ref?: string | null
          tipo_cubierta?: string
          zona?: string | null
        }
        Relationships: []
      }
      nsr10_viento_paredes: {
        Row: {
          cp: number
          id: number
          l_b_ratio: string | null
          notas: string | null
          superficie: string
          tabla_ref: string | null
        }
        Insert: {
          cp: number
          id?: number
          l_b_ratio?: string | null
          notas?: string | null
          superficie: string
          tabla_ref?: string | null
        }
        Update: {
          cp?: number
          id?: number
          l_b_ratio?: string | null
          notas?: string | null
          superficie?: string
          tabla_ref?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string | null
          id: string
          location: string | null
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          location?: string | null
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          location?: string | null
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      quickcheck_import_staging: {
        Row: {
          created_at: string | null
          error_detail: string | null
          id: string
          import_status: string | null
          mapped_inspection_id: string | null
          raw_row: Json
          source_filename: string | null
        }
        Insert: {
          created_at?: string | null
          error_detail?: string | null
          id?: string
          import_status?: string | null
          mapped_inspection_id?: string | null
          raw_row: Json
          source_filename?: string | null
        }
        Update: {
          created_at?: string | null
          error_detail?: string | null
          id?: string
          import_status?: string | null
          mapped_inspection_id?: string | null
          raw_row?: Json
          source_filename?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quickcheck_import_staging_mapped_inspection_id_fkey"
            columns: ["mapped_inspection_id"]
            isOneToOne: false
            referencedRelation: "inspections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quickcheck_import_staging_mapped_inspection_id_fkey"
            columns: ["mapped_inspection_id"]
            isOneToOne: false
            referencedRelation: "inspections_public"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_requests: {
        Row: {
          contact_city: string
          contact_name: string
          contact_phone: string
          created_at: string | null
          delivery_date: string | null
          id: string
          notes: string | null
          providers: string[]
          status: string | null
          summary: Json
          user_id: string
          work_id: string
        }
        Insert: {
          contact_city: string
          contact_name: string
          contact_phone: string
          created_at?: string | null
          delivery_date?: string | null
          id?: string
          notes?: string | null
          providers: string[]
          status?: string | null
          summary: Json
          user_id: string
          work_id: string
        }
        Update: {
          contact_city?: string
          contact_name?: string
          contact_phone?: string
          created_at?: string | null
          delivery_date?: string | null
          id?: string
          notes?: string | null
          providers?: string[]
          status?: string | null
          summary?: Json
          user_id?: string
          work_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_requests_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "works"
            referencedColumns: ["id"]
          },
        ]
      }
      rag_feedback: {
        Row: {
          answer: string | null
          comment: string | null
          created_at: string | null
          id: number
          question: string
          rating: number
        }
        Insert: {
          answer?: string | null
          comment?: string | null
          created_at?: string | null
          id?: number
          question: string
          rating: number
        }
        Update: {
          answer?: string | null
          comment?: string | null
          created_at?: string | null
          id?: number
          question?: string
          rating?: number
        }
        Relationships: []
      }
      rag_nsr10_vision: {
        Row: {
          capitulo: string | null
          chunk_text: string | null
          embedding: string | null
          figure_files: string[] | null
          filename: string | null
          fuente: string | null
          id: number
          n_pages: number | null
          page_end: number | null
          page_start: number | null
          resumen: string | null
          sec_nombre: string | null
          seccion: string | null
          titulo: string | null
        }
        Insert: {
          capitulo?: string | null
          chunk_text?: string | null
          embedding?: string | null
          figure_files?: string[] | null
          filename?: string | null
          fuente?: string | null
          id?: number
          n_pages?: number | null
          page_end?: number | null
          page_start?: number | null
          resumen?: string | null
          sec_nombre?: string | null
          seccion?: string | null
          titulo?: string | null
        }
        Update: {
          capitulo?: string | null
          chunk_text?: string | null
          embedding?: string | null
          figure_files?: string[] | null
          filename?: string | null
          fuente?: string | null
          id?: number
          n_pages?: number | null
          page_end?: number | null
          page_start?: number | null
          resumen?: string | null
          sec_nombre?: string | null
          seccion?: string | null
          titulo?: string | null
        }
        Relationships: []
      }
      rebar_entries: {
        Row: {
          bar_standard: string
          element_id: string
          figure_code: string
          hook_a_cm: number | null
          id: string
          nsr10_warning: string | null
          order_num: number | null
          quantity: number | null
          total_length_cm: number
        }
        Insert: {
          bar_standard: string
          element_id: string
          figure_code: string
          hook_a_cm?: number | null
          id?: string
          nsr10_warning?: string | null
          order_num?: number | null
          quantity?: number | null
          total_length_cm: number
        }
        Update: {
          bar_standard?: string
          element_id?: string
          figure_code?: string
          hook_a_cm?: number | null
          id?: string
          nsr10_warning?: string | null
          order_num?: number | null
          quantity?: number | null
          total_length_cm?: number
        }
        Relationships: [
          {
            foreignKeyName: "rebar_entries_element_id_fkey"
            columns: ["element_id"]
            isOneToOne: false
            referencedRelation: "elements"
            referencedColumns: ["id"]
          },
        ]
      }
      research_ideas: {
        Row: {
          created_at: string | null
          description: string | null
          feasibility_score: number | null
          id: string
          impact_score: number | null
          notes: string | null
          novelty_score: number | null
          source_papers: string[] | null
          status: string | null
          title: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          feasibility_score?: number | null
          id?: string
          impact_score?: number | null
          notes?: string | null
          novelty_score?: number | null
          source_papers?: string[] | null
          status?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          feasibility_score?: number | null
          id?: string
          impact_score?: number | null
          notes?: string | null
          novelty_score?: number | null
          source_papers?: string[] | null
          status?: string | null
          title?: string | null
        }
        Relationships: []
      }
      research_papers: {
        Row: {
          abstract: string | null
          analyzed_at: string | null
          arxiv_id: string | null
          authors: Json | null
          citation_count: number | null
          discovered_at: string | null
          doi: string | null
          formulas: Json | null
          future_work: Json | null
          id: string
          key_findings: Json | null
          limitations: Json | null
          methodology: string | null
          nomenclature: Json | null
          pdf_drive_id: string | null
          pdf_url: string | null
          relevance_score: number | null
          semantic_scholar_id: string | null
          source: string | null
          source_url: string | null
          tags: string[] | null
          title: string
          tldr: string | null
          topics: string[] | null
          venue: string | null
          venue_type: string | null
          year: number | null
        }
        Insert: {
          abstract?: string | null
          analyzed_at?: string | null
          arxiv_id?: string | null
          authors?: Json | null
          citation_count?: number | null
          discovered_at?: string | null
          doi?: string | null
          formulas?: Json | null
          future_work?: Json | null
          id?: string
          key_findings?: Json | null
          limitations?: Json | null
          methodology?: string | null
          nomenclature?: Json | null
          pdf_drive_id?: string | null
          pdf_url?: string | null
          relevance_score?: number | null
          semantic_scholar_id?: string | null
          source?: string | null
          source_url?: string | null
          tags?: string[] | null
          title: string
          tldr?: string | null
          topics?: string[] | null
          venue?: string | null
          venue_type?: string | null
          year?: number | null
        }
        Update: {
          abstract?: string | null
          analyzed_at?: string | null
          arxiv_id?: string | null
          authors?: Json | null
          citation_count?: number | null
          discovered_at?: string | null
          doi?: string | null
          formulas?: Json | null
          future_work?: Json | null
          id?: string
          key_findings?: Json | null
          limitations?: Json | null
          methodology?: string | null
          nomenclature?: Json | null
          pdf_drive_id?: string | null
          pdf_url?: string | null
          relevance_score?: number | null
          semantic_scholar_id?: string | null
          source?: string | null
          source_url?: string | null
          tags?: string[] | null
          title?: string
          tldr?: string | null
          topics?: string[] | null
          venue?: string | null
          venue_type?: string | null
          year?: number | null
        }
        Relationships: []
      }
      spatial_ref_sys: {
        Row: {
          auth_name: string | null
          auth_srid: number | null
          proj4text: string | null
          srid: number
          srtext: string | null
        }
        Insert: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid: number
          srtext?: string | null
        }
        Update: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid?: number
          srtext?: string | null
        }
        Relationships: []
      }
      works: {
        Row: {
          contact_name: string | null
          contact_phone: string | null
          created_at: string | null
          id: string
          name: string
          project_id: string
        }
        Insert: {
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          name: string
          project_id: string
        }
        Update: {
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          name?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "works_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      geography_columns: {
        Row: {
          coord_dimension: number | null
          f_geography_column: unknown
          f_table_catalog: unknown
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Relationships: []
      }
      geometry_columns: {
        Row: {
          coord_dimension: number | null
          f_geometry_column: unknown
          f_table_catalog: string | null
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Insert: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Update: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Relationships: []
      }
      inspections_public: {
        Row: {
          address: string | null
          building_id: string | null
          building_name: string | null
          ciudad: string | null
          client_uuid: string | null
          construction_type: string | null
          estado: string | null
          evaluation_level: string | null
          event_date: string | null
          event_type: string | null
          id: string | null
          inspected_at: string | null
          is_essential: boolean | null
          lat: number | null
          lng: number | null
          municipio: string | null
          occupancy_type: string | null
          placard_final: string | null
          risk_overall: string | null
          year_built: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inspections_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["id"]
          },
        ]
      }
      rag_feedback_bad: {
        Row: {
          question: string | null
          ultimo: string | null
          votos_negativos: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      _postgis_deprecate: {
        Args: { newname: string; oldname: string; version: string }
        Returns: undefined
      }
      _postgis_index_extent: {
        Args: { col: string; tbl: unknown }
        Returns: unknown
      }
      _postgis_pgsql_version: { Args: never; Returns: string }
      _postgis_scripts_pgsql_version: { Args: never; Returns: string }
      _postgis_selectivity: {
        Args: { att_name: string; geom: unknown; mode?: string; tbl: unknown }
        Returns: number
      }
      _postgis_stats: {
        Args: { ""?: string; att_name: string; tbl: unknown }
        Returns: string
      }
      _st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      _st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_intersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      _st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      _st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      _st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_sortablehash: { Args: { geom: unknown }; Returns: number }
      _st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_voronoi: {
        Args: {
          clip?: unknown
          g1: unknown
          return_polygons?: boolean
          tolerance?: number
        }
        Returns: unknown
      }
      _st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      addauth: { Args: { "": string }; Returns: boolean }
      addgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              new_dim: number
              new_srid_in: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
      buscar_nsr10: {
        Args: { max_results?: number; query_text: string }
        Returns: {
          contenido: string
          tipo: string
          titulo: string
        }[]
      }
      disablelongtransactions: { Args: never; Returns: string }
      dropgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { column_name: string; table_name: string }; Returns: string }
      dropgeometrytable:
        | {
            Args: {
              catalog_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { schema_name: string; table_name: string }; Returns: string }
        | { Args: { table_name: string }; Returns: string }
      enablelongtransactions: { Args: never; Returns: string }
      equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      geometry: { Args: { "": string }; Returns: unknown }
      geometry_above: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_below: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_cmp: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_contained_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_distance_box: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_distance_centroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_eq: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_ge: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_gt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_le: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_left: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_lt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overabove: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overbelow: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overleft: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overright: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_right: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geomfromewkt: { Args: { "": string }; Returns: unknown }
      get_fa: { Args: { p_aa: number; p_soil: string }; Returns: number }
      get_fv: { Args: { p_av: number; p_soil: string }; Returns: number }
      get_parametros_sismicos: {
        Args: { p_municipio: string; p_suelo?: string }
        Returns: {
          aa: number
          av: number
          fa: number
          fv: number
          municipio: string
          zona: string
        }[]
      }
      get_related_nodes: {
        Args: { edge_types?: string[]; node_id: string }
        Returns: {
          edge_type: string
          id: string
          section_path: string
          title: string
          type: string
        }[]
      }
      gettransactionid: { Args: never; Returns: unknown }
      hybrid_search: {
        Args: {
          bm25_weight?: number
          match_count?: number
          query_embedding: string
          query_text: string
          vector_weight?: number
        }
        Returns: {
          bm25_rank: number
          content: string
          hybrid_score: number
          id: string
          section_path: string
          title: string
          type: string
          vector_rank: number
        }[]
      }
      is_coordinator: { Args: never; Returns: boolean }
      longtransactionsenabled: { Args: never; Returns: boolean }
      match_rag_nsr10_vision: {
        Args: {
          folder_filter?: string
          match_count?: number
          query_embedding: string
        }
        Returns: {
          capitulo: string
          chunk_text: string
          figure_files: string[]
          filename: string
          id: number
          page_end: number
          page_start: number
          sec_nombre: string
          seccion: string
          similarity: number
          titulo: string
        }[]
      }
      owns_inspection: { Args: { insp: string }; Returns: boolean }
      populate_geometry_columns:
        | { Args: { tbl_oid: unknown; use_typmod?: boolean }; Returns: number }
        | { Args: { use_typmod?: boolean }; Returns: string }
      postgis_constraint_dims: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_srid: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_type: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: string
      }
      postgis_extensions_upgrade: { Args: never; Returns: string }
      postgis_full_version: { Args: never; Returns: string }
      postgis_geos_version: { Args: never; Returns: string }
      postgis_lib_build_date: { Args: never; Returns: string }
      postgis_lib_revision: { Args: never; Returns: string }
      postgis_lib_version: { Args: never; Returns: string }
      postgis_libjson_version: { Args: never; Returns: string }
      postgis_liblwgeom_version: { Args: never; Returns: string }
      postgis_libprotobuf_version: { Args: never; Returns: string }
      postgis_libxml_version: { Args: never; Returns: string }
      postgis_proj_version: { Args: never; Returns: string }
      postgis_scripts_build_date: { Args: never; Returns: string }
      postgis_scripts_installed: { Args: never; Returns: string }
      postgis_scripts_released: { Args: never; Returns: string }
      postgis_svn_version: { Args: never; Returns: string }
      postgis_type_name: {
        Args: {
          coord_dimension: number
          geomname: string
          use_new_name?: boolean
        }
        Returns: string
      }
      postgis_version: { Args: never; Returns: string }
      postgis_wagyu_version: { Args: never; Returns: string }
      search_kg: {
        Args: {
          match_count?: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          content: string
          id: string
          section_path: string
          similarity: number
          title: string
          type: string
        }[]
      }
      search_kg_semantic: {
        Args: {
          filter_norm_code?: string
          match_count?: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          content: string
          id: string
          section_path: string
          similarity: number
          title: string
          type: string
        }[]
      }
      st_3dclosestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3ddistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_3dlongestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmakebox: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmaxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dshortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_addpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_angle:
        | { Args: { line1: unknown; line2: unknown }; Returns: number }
        | {
            Args: { pt1: unknown; pt2: unknown; pt3: unknown; pt4?: unknown }
            Returns: number
          }
      st_area:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_asencodedpolyline: {
        Args: { geom: unknown; nprecision?: number }
        Returns: string
      }
      st_asewkt: { Args: { "": string }; Returns: string }
      st_asgeojson:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: {
              geom_column?: string
              maxdecimaldigits?: number
              pretty_bool?: boolean
              r: Record<string, unknown>
            }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_asgml:
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
            }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
      st_askml:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_aslatlontext: {
        Args: { geom: unknown; tmpl?: string }
        Returns: string
      }
      st_asmarc21: { Args: { format?: string; geom: unknown }; Returns: string }
      st_asmvtgeom: {
        Args: {
          bounds: unknown
          buffer?: number
          clip_geom?: boolean
          extent?: number
          geom: unknown
        }
        Returns: unknown
      }
      st_assvg:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_astext: { Args: { "": string }; Returns: string }
      st_astwkb:
        | {
            Args: {
              geom: unknown
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown[]
              ids: number[]
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
      st_asx3d: {
        Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_azimuth:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: number }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_boundingdiagonal: {
        Args: { fits?: boolean; geom: unknown }
        Returns: unknown
      }
      st_buffer:
        | {
            Args: { geom: unknown; options?: string; radius: number }
            Returns: unknown
          }
        | {
            Args: { geom: unknown; quadsegs: number; radius: number }
            Returns: unknown
          }
      st_centroid: { Args: { "": string }; Returns: unknown }
      st_clipbybox2d: {
        Args: { box: unknown; geom: unknown }
        Returns: unknown
      }
      st_closestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_collect: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_concavehull: {
        Args: {
          param_allow_holes?: boolean
          param_geom: unknown
          param_pctconvex: number
        }
        Returns: unknown
      }
      st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_coorddim: { Args: { geometry: unknown }; Returns: number }
      st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_crosses: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_curvetoline: {
        Args: { flags?: number; geom: unknown; tol?: number; toltype?: number }
        Returns: unknown
      }
      st_delaunaytriangles: {
        Args: { flags?: number; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_difference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_disjoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_distance:
        | {
            Args: { geog1: unknown; geog2: unknown; use_spheroid?: boolean }
            Returns: number
          }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_distancesphere:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
        | {
            Args: { geom1: unknown; geom2: unknown; radius: number }
            Returns: number
          }
      st_distancespheroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_expand:
        | { Args: { box: unknown; dx: number; dy: number }; Returns: unknown }
        | {
            Args: { box: unknown; dx: number; dy: number; dz?: number }
            Returns: unknown
          }
        | {
            Args: {
              dm?: number
              dx: number
              dy: number
              dz?: number
              geom: unknown
            }
            Returns: unknown
          }
      st_force3d: { Args: { geom: unknown; zvalue?: number }; Returns: unknown }
      st_force3dm: {
        Args: { geom: unknown; mvalue?: number }
        Returns: unknown
      }
      st_force3dz: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force4d: {
        Args: { geom: unknown; mvalue?: number; zvalue?: number }
        Returns: unknown
      }
      st_generatepoints:
        | { Args: { area: unknown; npoints: number }; Returns: unknown }
        | {
            Args: { area: unknown; npoints: number; seed: number }
            Returns: unknown
          }
      st_geogfromtext: { Args: { "": string }; Returns: unknown }
      st_geographyfromtext: { Args: { "": string }; Returns: unknown }
      st_geohash:
        | { Args: { geog: unknown; maxchars?: number }; Returns: string }
        | { Args: { geom: unknown; maxchars?: number }; Returns: string }
      st_geomcollfromtext: { Args: { "": string }; Returns: unknown }
      st_geometricmedian: {
        Args: {
          fail_if_not_converged?: boolean
          g: unknown
          max_iter?: number
          tolerance?: number
        }
        Returns: unknown
      }
      st_geometryfromtext: { Args: { "": string }; Returns: unknown }
      st_geomfromewkt: { Args: { "": string }; Returns: unknown }
      st_geomfromgeojson:
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": string }; Returns: unknown }
      st_geomfromgml: { Args: { "": string }; Returns: unknown }
      st_geomfromkml: { Args: { "": string }; Returns: unknown }
      st_geomfrommarc21: { Args: { marc21xml: string }; Returns: unknown }
      st_geomfromtext: { Args: { "": string }; Returns: unknown }
      st_gmltosql: { Args: { "": string }; Returns: unknown }
      st_hasarc: { Args: { geometry: unknown }; Returns: boolean }
      st_hausdorffdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_hexagon: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_hexagongrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_interpolatepoint: {
        Args: { line: unknown; point: unknown }
        Returns: number
      }
      st_intersection: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_intersects:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_isvaliddetail: {
        Args: { flags?: number; geom: unknown }
        Returns: Database["public"]["CompositeTypes"]["valid_detail"]
        SetofOptions: {
          from: "*"
          to: "valid_detail"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      st_length:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_letters: { Args: { font?: Json; letters: string }; Returns: unknown }
      st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      st_linefromencodedpolyline: {
        Args: { nprecision?: number; txtin: string }
        Returns: unknown
      }
      st_linefromtext: { Args: { "": string }; Returns: unknown }
      st_linelocatepoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_linetocurve: { Args: { geometry: unknown }; Returns: unknown }
      st_locatealong: {
        Args: { geometry: unknown; leftrightoffset?: number; measure: number }
        Returns: unknown
      }
      st_locatebetween: {
        Args: {
          frommeasure: number
          geometry: unknown
          leftrightoffset?: number
          tomeasure: number
        }
        Returns: unknown
      }
      st_locatebetweenelevations: {
        Args: { fromelevation: number; geometry: unknown; toelevation: number }
        Returns: unknown
      }
      st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makebox2d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makeline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makevalid: {
        Args: { geom: unknown; params: string }
        Returns: unknown
      }
      st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_minimumboundingcircle: {
        Args: { inputgeom: unknown; segs_per_quarter?: number }
        Returns: unknown
      }
      st_mlinefromtext: { Args: { "": string }; Returns: unknown }
      st_mpointfromtext: { Args: { "": string }; Returns: unknown }
      st_mpolyfromtext: { Args: { "": string }; Returns: unknown }
      st_multilinestringfromtext: { Args: { "": string }; Returns: unknown }
      st_multipointfromtext: { Args: { "": string }; Returns: unknown }
      st_multipolygonfromtext: { Args: { "": string }; Returns: unknown }
      st_node: { Args: { g: unknown }; Returns: unknown }
      st_normalize: { Args: { geom: unknown }; Returns: unknown }
      st_offsetcurve: {
        Args: { distance: number; line: unknown; params?: string }
        Returns: unknown
      }
      st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_perimeter: {
        Args: { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_pointfromtext: { Args: { "": string }; Returns: unknown }
      st_pointm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
        }
        Returns: unknown
      }
      st_pointz: {
        Args: {
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_pointzm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_polyfromtext: { Args: { "": string }; Returns: unknown }
      st_polygonfromtext: { Args: { "": string }; Returns: unknown }
      st_project: {
        Args: { azimuth: number; distance: number; geog: unknown }
        Returns: unknown
      }
      st_quantizecoordinates: {
        Args: {
          g: unknown
          prec_m?: number
          prec_x: number
          prec_y?: number
          prec_z?: number
        }
        Returns: unknown
      }
      st_reduceprecision: {
        Args: { geom: unknown; gridsize: number }
        Returns: unknown
      }
      st_relate: { Args: { geom1: unknown; geom2: unknown }; Returns: string }
      st_removerepeatedpoints: {
        Args: { geom: unknown; tolerance?: number }
        Returns: unknown
      }
      st_segmentize: {
        Args: { geog: unknown; max_segment_length: number }
        Returns: unknown
      }
      st_setsrid:
        | { Args: { geog: unknown; srid: number }; Returns: unknown }
        | { Args: { geom: unknown; srid: number }; Returns: unknown }
      st_sharedpaths: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_shortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_simplifypolygonhull: {
        Args: { geom: unknown; is_outer?: boolean; vertex_fraction: number }
        Returns: unknown
      }
      st_split: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_square: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_squaregrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_srid:
        | { Args: { geog: unknown }; Returns: number }
        | { Args: { geom: unknown }; Returns: number }
      st_subdivide: {
        Args: { geom: unknown; gridsize?: number; maxvertices?: number }
        Returns: unknown[]
      }
      st_swapordinates: {
        Args: { geom: unknown; ords: unknown }
        Returns: unknown
      }
      st_symdifference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_symmetricdifference: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_tileenvelope: {
        Args: {
          bounds?: unknown
          margin?: number
          x: number
          y: number
          zoom: number
        }
        Returns: unknown
      }
      st_touches: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_transform:
        | {
            Args: { from_proj: string; geom: unknown; to_proj: string }
            Returns: unknown
          }
        | {
            Args: { from_proj: string; geom: unknown; to_srid: number }
            Returns: unknown
          }
        | { Args: { geom: unknown; to_proj: string }; Returns: unknown }
      st_triangulatepolygon: { Args: { g1: unknown }; Returns: unknown }
      st_union:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
        | {
            Args: { geom1: unknown; geom2: unknown; gridsize: number }
            Returns: unknown
          }
      st_voronoilines: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_voronoipolygons: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_wkbtosql: { Args: { wkb: string }; Returns: unknown }
      st_wkttosql: { Args: { "": string }; Returns: unknown }
      st_wrapx: {
        Args: { geom: unknown; move: number; wrap: number }
        Returns: unknown
      }
      unlockrows: { Args: { "": string }; Returns: number }
      updategeometrysrid: {
        Args: {
          catalogn_name: string
          column_name: string
          new_srid_in: number
          schema_name: string
          table_name: string
        }
        Returns: string
      }
      usage_stats: { Args: never; Returns: Json }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      geometry_dump: {
        path: number[] | null
        geom: unknown
      }
      valid_detail: {
        valid: boolean | null
        reason: string | null
        location: unknown
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
    Enums: {},
  },
} as const
