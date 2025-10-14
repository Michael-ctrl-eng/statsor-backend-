import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

export interface Player {
  id?: string;
  name: string;
  position: string;
  jersey_number?: number;
  age?: number;
  nationality?: string;
  photo_url?: string;
  height?: number;
  weight?: number;
  preferred_foot?: string;
  status?: string;
  team_id?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Team {
  id?: string;
  name: string;
  sport: string;
  description?: string;
  logo_url?: string;
  formation?: string;
  owner_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Match {
  id?: string;
  team_id?: string;
  opponent_name: string;
  match_date: string;
  location?: string;
  match_type?: string;
  home_score?: number;
  away_score?: number;
  is_home?: boolean;
  status?: string;
  formation?: string;
  notes?: string;
  weather?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ClubData {
  id?: string;
  name: string;
  founded?: number;
  stadium?: string;
  capacity?: number;
  address?: string;
  phone?: string;
  email?: string;
  budget?: number;
  trophies?: number;
  notes?: string;
}

class DataManagementService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTimeout = 5 * 60 * 1000;
  private playersUpdateCallback: ((players: Player[]) => void) | null = null;

  setPlayersUpdateCallback(callback: ((players: Player[]) => void) | null) {
    this.playersUpdateCallback = callback;
  }

  private getCachedData(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCachedData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  async getPlayers(teamId?: string): Promise<Player[]> {
    try {
      const cacheKey = `players_${teamId || 'all'}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) return cached;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No authenticated user');
        return [];
      }

      let query = supabase
        .from('players')
        .select('*')
        .eq('user_id', user.id);

      if (teamId) {
        query = query.eq('team_id', teamId);
      }

      const { data: players, error } = await query;

      if (error) {
        console.error('Error fetching players:', error);
        return [];
      }

      this.setCachedData(cacheKey, players || []);
      return players || [];
    } catch (error) {
      console.error('Error fetching players:', error);
      return [];
    }
  }

  async getPlayer(id: string): Promise<Player | null> {
    try {
      const { data: player, error } = await supabase
        .from('players')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching player:', error);
        return null;
      }

      return player;
    } catch (error) {
      console.error('Error fetching player:', error);
      return null;
    }
  }

  async addPlayer(player: Player): Promise<Player | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to add players');
        return null;
      }

      const { data, error } = await supabase
        .from('players')
        .insert([{
          ...player,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error adding player:', error);
        toast.error('Failed to add player');
        return null;
      }

      this.cache.clear();
      toast.success('Player added successfully');

      if (this.playersUpdateCallback) {
        const updatedPlayers = await this.getPlayers();
        this.playersUpdateCallback(updatedPlayers);
      }

      return data;
    } catch (error) {
      console.error('Error adding player:', error);
      toast.error('Failed to add player');
      return null;
    }
  }

  async updatePlayer(id: string, updates: Partial<Player>): Promise<Player | null> {
    try {
      if (!id) {
        throw new Error('Player ID is required');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to update players');
        return null;
      }

      const cleanUpdates = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      delete cleanUpdates.id;
      delete cleanUpdates.created_at;

      console.log('Updating player with data:', { id, updates: cleanUpdates });

      const { data, error } = await supabase
        .from('players')
        .update(cleanUpdates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Supabase error updating player:', error);
        toast.error(`Failed to update player: ${error.message}`);
        return null;
      }

      if (!data) {
        console.error('No data returned from update');
        toast.error('Player update failed - no data returned');
        return null;
      }

      this.cache.clear();
      toast.success('Player updated successfully');

      if (this.playersUpdateCallback) {
        const updatedPlayers = await this.getPlayers();
        this.playersUpdateCallback(updatedPlayers);
      }

      return data;
    } catch (error: any) {
      console.error('Exception updating player:', error);
      const errorMessage = error?.message || 'Failed to update player';
      toast.error(errorMessage);
      return null;
    }
  }

  async deletePlayer(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting player:', error);
        toast.error('Failed to delete player');
        return false;
      }

      this.cache.clear();
      toast.success('Player deleted successfully');

      if (this.playersUpdateCallback) {
        const updatedPlayers = await this.getPlayers();
        this.playersUpdateCallback(updatedPlayers);
      }

      return true;
    } catch (error) {
      console.error('Error deleting player:', error);
      toast.error('Failed to delete player');
      return false;
    }
  }

  async getTeams(): Promise<Team[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: teams, error } = await supabase
        .from('teams')
        .select('*')
        .eq('owner_id', user.id);

      if (error) {
        console.error('Error fetching teams:', error);
        return [];
      }

      return teams || [];
    } catch (error) {
      console.error('Error fetching teams:', error);
      return [];
    }
  }

  async getTeam(id: string): Promise<Team | null> {
    try {
      const { data: team, error } = await supabase
        .from('teams')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching team:', error);
        return null;
      }

      return team;
    } catch (error) {
      console.error('Error fetching team:', error);
      return null;
    }
  }

  async addTeam(team: Team): Promise<Team | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to add teams');
        return null;
      }

      const { data, error } = await supabase
        .from('teams')
        .insert([{
          ...team,
          owner_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error adding team:', error);
        toast.error('Failed to add team');
        return null;
      }

      toast.success('Team added successfully');
      return data;
    } catch (error) {
      console.error('Error adding team:', error);
      toast.error('Failed to add team');
      return null;
    }
  }

  async getMatches(teamId?: string): Promise<Match[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      let query = supabase
        .from('matches')
        .select('*')
        .eq('user_id', user.id);

      if (teamId) {
        query = query.eq('team_id', teamId);
      }

      const { data: matches, error } = await query.order('match_date', { ascending: false });

      if (error) {
        console.error('Error fetching matches:', error);
        return [];
      }

      return matches || [];
    } catch (error) {
      console.error('Error fetching matches:', error);
      return [];
    }
  }

  async addMatch(match: Match): Promise<Match | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to add matches');
        return null;
      }

      const { data, error } = await supabase
        .from('matches')
        .insert([{
          ...match,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error adding match:', error);
        toast.error('Failed to add match');
        return null;
      }

      toast.success('Match added successfully');
      return data;
    } catch (error) {
      console.error('Error adding match:', error);
      toast.error('Failed to add match');
      return null;
    }
  }

  async updateMatch(id: string, updates: Partial<Match>): Promise<Match | null> {
    try {
      const { data, error } = await supabase
        .from('matches')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error updating match:', error);
        toast.error('Failed to update match');
        return null;
      }

      toast.success('Match updated successfully');
      return data;
    } catch (error) {
      console.error('Error updating match:', error);
      toast.error('Failed to update match');
      return null;
    }
  }

  async getClubData(): Promise<ClubData | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: teams } = await supabase
        .from('teams')
        .select('*')
        .eq('owner_id', user.id)
        .limit(1)
        .maybeSingle();

      if (!teams) return null;

      return {
        id: teams.id,
        name: teams.name,
        notes: teams.description || ''
      };
    } catch (error) {
      console.error('Error fetching club data:', error);
      return null;
    }
  }

  async exportToJSON(): Promise<string> {
    try {
      const players = await this.getPlayers();
      const teams = await this.getTeams();
      const matches = await this.getMatches();

      const exportData = {
        players,
        teams,
        matches,
        exportedAt: new Date().toISOString()
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Error exporting to JSON:', error);
      throw error;
    }
  }

  async importFromJSON(jsonData: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonData);

      if (data.players && Array.isArray(data.players)) {
        for (const player of data.players) {
          await this.addPlayer(player);
        }
      }

      if (data.teams && Array.isArray(data.teams)) {
        for (const team of data.teams) {
          await this.addTeam(team);
        }
      }

      if (data.matches && Array.isArray(data.matches)) {
        for (const match of data.matches) {
          await this.addMatch(match);
        }
      }

      toast.success('Data imported successfully');
      return true;
    } catch (error) {
      console.error('Error importing JSON:', error);
      toast.error('Failed to import data');
      return false;
    }
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const dataManagementService = new DataManagementService();
