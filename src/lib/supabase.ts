import { createClient } from '@supabase/supabase-js';

// Force refresh - timestamp: 1756584002672

// Supabase configuration with fallback to demo values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo-project.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

// Determine configuration status
const isDemoMode = supabaseUrl.includes('demo-project.supabase.co');
const hasValidCredentials = supabaseUrl && supabaseKey && supabaseUrl.startsWith('http');
const isRealSupabase = hasValidCredentials && !isDemoMode && 
  supabaseUrl !== 'your-supabase-url' && 
  supabaseKey !== 'your-supabase-anon-key';

// Configuration messaging
if (isDemoMode) {
  console.info('🔧 Running in demo mode with mock Supabase configuration.\n' +
    'For full functionality, configure your own Supabase project in .env file.');
} else if (!isRealSupabase && hasValidCredentials) {
  console.warn('⚠️ Using placeholder Supabase credentials. Please configure your actual project credentials.');
}

// Create Supabase client or mock client
export const supabase = (isRealSupabase || isDemoMode) ? createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: localStorage
  },
  global: {
    headers: {
      'X-Client-Info': 'statsor-app'
    }
  }
}) : {
  // Mock Supabase client for development
  auth: {
    getUser: async () => ({ data: { user: null }, error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    signUp: async () => ({ 
      data: { user: null, session: null }, 
      error: { 
        message: 'Database not configured. Please set up Supabase credentials in your environment variables.' 
      } 
    }),
    signInWithPassword: async () => ({ 
      data: { user: null, session: null }, 
      error: { 
        message: 'Database not configured. Please set up Supabase credentials in your environment variables.' 
      } 
    }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
  },
  from: () => ({
    select: () => ({ data: [], error: null }),
    insert: () => ({ data: null, error: { message: 'Supabase not configured' } }),
    update: () => ({ data: null, error: { message: 'Supabase not configured' } }),
    delete: () => ({ data: null, error: { message: 'Supabase not configured' } })
  })
} as any;

// Auth state management
export const getUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error getting user:', error);
    return null;
  }
  return user;
};

export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting session:', error);
    return null;
  }
  return session;
};

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          avatar_url?: string;
          role: 'player' | 'coach' | 'manager' | 'admin';
          is_verified: boolean;
          phone?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          first_name: string;
          last_name: string;
          avatar_url?: string;
          role?: 'player' | 'coach' | 'manager' | 'admin';
          is_verified?: boolean;
          phone?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          avatar_url?: string;
          role?: 'player' | 'coach' | 'manager' | 'admin';
          is_verified?: boolean;
          phone?: string;
          updated_at?: string;
        };
      };
      teams: {
        Row: {
          id: string;
          name: string;
          description?: string;
          logo_url?: string;
          founded_year?: number;
          home_venue?: string;
          website?: string;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          logo_url?: string;
          founded_year?: number;
          home_venue?: string;
          website?: string;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          logo_url?: string;
          founded_year?: number;
          home_venue?: string;
          website?: string;
          updated_at?: string;
        };
      };
      players: {
        Row: {
          id: string;
          team_id: string;
          user_id?: string;
          first_name: string;
          last_name: string;
          position: string;
          jersey_number?: number;
          date_of_birth?: string;
          nationality?: string;
          height?: number;
          weight?: number;
          dominant_foot?: 'left' | 'right' | 'both';
          market_value?: number;
          contract_start?: string;
          contract_end?: string;
          salary?: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          team_id: string;
          user_id?: string;
          first_name: string;
          last_name: string;
          position: string;
          jersey_number?: number;
          date_of_birth?: string;
          nationality?: string;
          height?: number;
          weight?: number;
          dominant_foot?: 'left' | 'right' | 'both';
          market_value?: number;
          contract_start?: string;
          contract_end?: string;
          salary?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          team_id?: string;
          user_id?: string;
          first_name?: string;
          last_name?: string;
          position?: string;
          jersey_number?: number;
          date_of_birth?: string;
          nationality?: string;
          height?: number;
          weight?: number;
          dominant_foot?: 'left' | 'right' | 'both';
          market_value?: number;
          contract_start?: string;
          contract_end?: string;
          salary?: number;
          updated_at?: string;
        };
      };
    };
  };
}

export type { Database as SupabaseDatabase };