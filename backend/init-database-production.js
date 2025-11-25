const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function initializeProductionDatabase() {
  console.log('🚀 Initializing production database...');
  
  try {
    // Create tables
    console.log('📋 Creating tables...');
    
    // Users table
    const { error: usersError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.users (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255),
          first_name VARCHAR(100),
          last_name VARCHAR(100),
          role VARCHAR(50) DEFAULT 'player',
          is_active BOOLEAN DEFAULT true,
          email_verified BOOLEAN DEFAULT false,
          phone VARCHAR(20),
          date_of_birth DATE,
          nationality VARCHAR(50),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (usersError) console.log('Users table:', usersError.message || 'OK');
    
    // Teams table
    const { error: teamsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.teams (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR(255) NOT NULL,
          sport VARCHAR(100) NOT NULL DEFAULT 'football',
          description TEXT,
          logo_url VARCHAR(500),
          coach_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (teamsError) console.log('Teams table:', teamsError.message || 'OK');
    
    // Players table
    const { error: playersError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.players (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
          team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
          jersey_number INTEGER,
          position VARCHAR(100),
          height DECIMAL(5,2),
          weight DECIMAL(5,2),
          date_of_birth DATE,
          nationality VARCHAR(50),
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (playersError) console.log('Players table:', playersError.message || 'OK');
    
    // Matches table
    const { error: matchesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.matches (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          home_team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
          away_team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
          match_date TIMESTAMP WITH TIME ZONE NOT NULL,
          venue VARCHAR(255),
          status VARCHAR(50) DEFAULT 'scheduled',
          home_score INTEGER DEFAULT 0,
          away_score INTEGER DEFAULT 0,
          duration INTEGER DEFAULT 90,
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (matchesError) console.log('Matches table:', matchesError.message || 'OK');
    
    // Training sessions table
    const { error: trainingError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.training_sessions (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          session_date TIMESTAMP WITH TIME ZONE NOT NULL,
          duration INTEGER DEFAULT 60,
          location VARCHAR(255),
          exercises JSONB,
          attended_players UUID[] DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (trainingError) console.log('Training sessions table:', trainingError.message || 'OK');
    
    // Create indexes
    console.log('📊 Creating indexes...');
    
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);',
      'CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);',
      'CREATE INDEX IF NOT EXISTS idx_players_user_id ON public.players(user_id);',
      'CREATE INDEX IF NOT EXISTS idx_players_team_id ON public.players(team_id);',
      'CREATE INDEX IF NOT EXISTS idx_matches_date ON public.matches(match_date);',
      'CREATE INDEX IF NOT EXISTS idx_matches_teams ON public.matches(home_team_id, away_team_id);',
      'CREATE INDEX IF NOT EXISTS idx_training_team_date ON public.training_sessions(team_id, session_date);'
    ];
    
    for (const indexSql of indexes) {
      await supabase.rpc('exec_sql', { sql: indexSql });
    }
    
    // Enable RLS
    console.log('🔒 Enabling Row Level Security...');
    
    const rlsTables = ['users', 'teams', 'players', 'matches', 'training_sessions'];
    for (const table of rlsTables) {
      await supabase.rpc('exec_sql', { sql: `ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY;` });
    }
    
    // Create basic RLS policies
    console.log('📝 Creating RLS policies...');
    
    // Users policies
    await supabase.rpc('exec_sql', {
      sql: `
        DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
        CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
        
        DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
        CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
        
        DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
        CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (true);
      `
    });
    
    // Teams policies
    await supabase.rpc('exec_sql', {
      sql: `
        DROP POLICY IF EXISTS "Teams are viewable by everyone" ON public.teams;
        CREATE POLICY "Teams are viewable by everyone" ON public.teams FOR SELECT USING (true);
        
        DROP POLICY IF EXISTS "Coaches can manage own teams" ON public.teams;
        CREATE POLICY "Coaches can manage own teams" ON public.teams FOR ALL USING (auth.uid() = coach_id);
      `
    });
    
    // Players policies
    await supabase.rpc('exec_sql', {
      sql: `
        DROP POLICY IF EXISTS "Players are viewable by everyone" ON public.players;
        CREATE POLICY "Players are viewable by everyone" ON public.players FOR SELECT USING (true);
        
        DROP POLICY IF EXISTS "Users can view own player profile" ON public.players;
        CREATE POLICY "Users can view own player profile" ON public.players FOR SELECT USING (auth.uid() = user_id);
        
        DROP POLICY IF EXISTS "Users can update own player profile" ON public.players;
        CREATE POLICY "Users can update own player profile" ON public.players FOR UPDATE USING (auth.uid() = user_id);
      `
    });
    
    // Insert seed data
    console.log('🌱 Inserting seed data...');
    
    // Create a demo team
    const { data: demoTeam, error: teamError } = await supabase
      .from('teams')
      .upsert({
        name: 'Demo FC',
        sport: 'football',
        description: 'A demo team for new users to explore features'
      })
      .select()
      .single();
    
    if (teamError) {
      console.log('Demo team creation:', teamError.message);
    } else {
      console.log('✅ Demo team created:', demoTeam.name);
    }
    
    console.log('✅ Production database initialized successfully!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  }
}

// Run the initialization
initializeProductionDatabase();
