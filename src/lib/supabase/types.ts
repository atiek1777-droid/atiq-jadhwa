/**
 * Hand-written types mirroring sql/schema.sql exactly.
 * Once the project is linked to a live Supabase instance, replace this file
 * by running:
 *   npx supabase gen types typescript --project-id <id> > src/lib/supabase/types.ts
 * Every query in this codebase is written against this shape, so regenerating
 * it (as long as the schema matches sql/schema.sql) requires no other changes.
 */

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          slug: string;
          title_ar: string;
          title_en: string;
          category: string[];
          industry: string | null;
          short_description_ar: string | null;
          short_description_en: string | null;
          role: string | null;
          services: string[];
          project_date: string | null;
          cover_image: string | null;
          external_url: string | null;
          challenge: string | null;
          approach: string | null;
          solution: string | null;
          outcome: string | null;
          tools: string[];
          featured: boolean;
          published: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["projects"]["Row"]> & {
          slug: string;
          title_ar: string;
          title_en: string;
        };
        Update: Partial<Database["public"]["Tables"]["projects"]["Row"]>;
      };
      project_images: {
        Row: {
          id: string;
          project_id: string | null;
          image_url: string;
          alt_text: string | null;
          orientation: "landscape" | "portrait" | "square" | null;
          sort_order: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["project_images"]["Row"]> & {
          image_url: string;
        };
        Update: Partial<Database["public"]["Tables"]["project_images"]["Row"]>;
      };
      services: {
        Row: {
          id: string;
          slug: string;
          pillar: "build" | "improve" | "grow" | null;
          title_ar: string;
          title_en: string;
          description_ar: string | null;
          description_en: string | null;
          sort_order: number;
          published: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["services"]["Row"]> & {
          slug: string;
          title_ar: string;
          title_en: string;
        };
        Update: Partial<Database["public"]["Tables"]["services"]["Row"]>;
      };
      restaurant_solutions: {
        Row: {
          id: string;
          stage: "diagnose" | "cost" | "control" | "organize" | "improve" | "grow" | null;
          title_ar: string;
          title_en: string;
          description_ar: string | null;
          description_en: string | null;
          sort_order: number;
          published: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["restaurant_solutions"]["Row"]> & {
          title_ar: string;
          title_en: string;
        };
        Update: Partial<Database["public"]["Tables"]["restaurant_solutions"]["Row"]>;
      };
      articles: {
        Row: {
          id: string;
          slug: string;
          title_ar: string;
          title_en: string;
          excerpt_ar: string | null;
          excerpt_en: string | null;
          body_ar: string | null;
          body_en: string | null;
          cover_image: string | null;
          published: boolean;
          published_at: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["articles"]["Row"]> & {
          slug: string;
          title_ar: string;
          title_en: string;
        };
        Update: Partial<Database["public"]["Tables"]["articles"]["Row"]>;
      };
      media: {
        Row: {
          id: string;
          url: string;
          alt_text: string | null;
          width: number | null;
          height: number | null;
          orientation: "landscape" | "portrait" | "square" | null;
          source_note: string | null;
          assigned_project_id: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["media"]["Row"]> & { url: string };
        Update: Partial<Database["public"]["Tables"]["media"]["Row"]>;
      };
      contact_submissions: {
        Row: {
          id: string;
          name: string;
          email: string;
          message: string;
          locale: string | null;
          source: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["contact_submissions"]["Row"]> & {
          name: string;
          email: string;
          message: string;
        };
        Update: Partial<Database["public"]["Tables"]["contact_submissions"]["Row"]>;
      };
      ai_sessions: {
        Row: { id: string; locale: string | null; source: string | null; created_at: string };
        Insert: Partial<Database["public"]["Tables"]["ai_sessions"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["ai_sessions"]["Row"]>;
      };
      ai_messages: {
        Row: {
          id: string;
          session_id: string | null;
          role: "user" | "assistant";
          content: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["ai_messages"]["Row"]> & {
          role: "user" | "assistant";
          content: string;
        };
        Update: Partial<Database["public"]["Tables"]["ai_messages"]["Row"]>;
      };
      ai_leads: {
        Row: {
          id: string;
          session_id: string | null;
          name: string | null;
          phone: string | null;
          business_type: string | null;
          summary: string | null;
          status: "new" | "contacted" | "closed";
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["ai_leads"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["ai_leads"]["Row"]>;
      };
      ai_knowledge: {
        Row: {
          id: string;
          domain:
            | "profile"
            | "services"
            | "restaurant_solutions"
            | "projects"
            | "nextra_ai"
            | "policies"
            | "assistant_rules";
          key: string;
          content_ar: string | null;
          content_en: string | null;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["ai_knowledge"]["Row"]> & {
          domain: Database["public"]["Tables"]["ai_knowledge"]["Row"]["domain"];
          key: string;
        };
        Update: Partial<Database["public"]["Tables"]["ai_knowledge"]["Row"]>;
      };
      ai_faqs: {
        Row: {
          id: string;
          question_ar: string;
          question_en: string;
          answer_ar: string;
          answer_en: string;
          sort_order: number;
          published: boolean;
        };
        Insert: Partial<Database["public"]["Tables"]["ai_faqs"]["Row"]> & {
          question_ar: string;
          question_en: string;
          answer_ar: string;
          answer_en: string;
        };
        Update: Partial<Database["public"]["Tables"]["ai_faqs"]["Row"]>;
      };
      site_settings: {
        Row: { key: string; value: unknown; updated_at: string };
        Insert: { key: string; value: unknown };
        Update: Partial<Database["public"]["Tables"]["site_settings"]["Row"]>;
      };
      social_links: {
        Row: { id: string; platform: string; url: string; sort_order: number };
        Insert: Partial<Database["public"]["Tables"]["social_links"]["Row"]> & {
          platform: string;
          url: string;
        };
        Update: Partial<Database["public"]["Tables"]["social_links"]["Row"]>;
      };
      homepage_sections: {
        Row: {
          id: string;
          section_key: string;
          content: unknown;
          sort_order: number;
          visible: boolean;
        };
        Insert: Partial<Database["public"]["Tables"]["homepage_sections"]["Row"]> & {
          section_key: string;
        };
        Update: Partial<Database["public"]["Tables"]["homepage_sections"]["Row"]>;
      };
    };
  };
}
