import { Player, ClubData } from './dataManagementService';

export interface DemoMatch {
  id: string;
  opponent: string;
  date: string;
  result: 'win' | 'loss' | 'draw';
  score: string;
  venue: 'home' | 'away';
  competition: string;
  attendance?: number;
}

export interface DemoTrainingSession {
  id: string;
  date: string;
  type: 'fitness' | 'tactical' | 'technical' | 'recovery';
  duration: number; // minutes
  intensity: 'low' | 'medium' | 'high';
  focus: string;
  attendance: number;
}

export interface DemoFinancialRecord {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
}

export interface DemoEvent {
  id: string;
  title: string;
  date: string;
  type: 'match' | 'training' | 'meeting' | 'other';
  description: string;
  location?: string;
}

export interface DemoAnalytics {
  performance: {
    winRate: number;
    goalsFor: number;
    goalsAgainst: number;
    cleanSheets: number;
  };
  financial: {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    budgetUtilization: number;
  };
  training: {
    sessionsCompleted: number;
    averageAttendance: number;
    fitnessImprovement: number;
  };
}

class DemoAccountService {
  private static instance: DemoAccountService;
  
  public static getInstance(): DemoAccountService {
    if (!DemoAccountService.instance) {
      DemoAccountService.instance = new DemoAccountService();
    }
    return DemoAccountService.instance;
  }

  getDemoPlayers(): Player[] {
    return [
      {
        id: 'demo-1',
        first_name: 'Marcus',
        last_name: 'Johnson',
        position: 'Forward',
        age: 24,
        nationality: 'England',
        number: 9,
        height: 185,
        weight: 78,
        rating: 87,
        matches: 28,
        goals: 15,
        assists: 8,
        yellow_cards: 3,
        red_cards: 0,
        status: 'active',
        contract_end: '2025-06-30',
        salary: 45000,
        market_value: 2500000,
        skills: {
          technical: 85,
          physical: 80,
          tactical: 78,
          mental: 88
        },
        team_id: 'demo-team-1',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-12-15T14:30:00Z'
      },
      {
        id: 'demo-2',
        first_name: 'Alessandro',
        last_name: 'Rodriguez',
        position: 'Midfielder',
        age: 26,
        nationality: 'Spain',
        number: 8,
        height: 178,
        weight: 72,
        rating: 84,
        matches: 30,
        goals: 6,
        assists: 12,
        yellow_cards: 5,
        red_cards: 1,
        status: 'active',
        contract_end: '2026-06-30',
        salary: 38000,
        market_value: 1800000,
        skills: {
          technical: 72,
          physical: 70,
          tactical: 85,
          mental: 75
        },
        team_id: 'demo-team-1',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-12-15T14:30:00Z'
      },
      {
        id: 'demo-3',
        first_name: 'David',
        last_name: 'Thompson',
        position: 'Defender',
        age: 29,
        nationality: 'Scotland',
        number: 4,
        height: 190,
        weight: 85,
        rating: 82,
        matches: 32,
        goals: 2,
        assists: 3,
        yellow_cards: 8,
        red_cards: 0,
        status: 'active',
        contract_end: '2024-06-30',
        salary: 32000,
        market_value: 1200000,
        skills: {
          technical: 45,
          physical: 88,
          tactical: 78,
          mental: 65
        },
        team_id: 'demo-team-1',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-12-15T14:30:00Z'
      },
      {
        id: 'demo-4',
        first_name: 'Lucas',
        last_name: 'Silva',
        position: 'Goalkeeper',
        age: 27,
        nationality: 'Brazil',
        number: 1,
        height: 192,
        weight: 88,
        rating: 85,
        matches: 30,
        goals: 0,
        assists: 1,
        yellow_cards: 2,
        red_cards: 0,
        status: 'active',
        contract_end: '2025-06-30',
        salary: 40000,
        market_value: 1500000,
        skills: {
          technical: 68,
          physical: 85,
          tactical: 75,
          mental: 70
        },
        team_id: 'demo-team-1',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-12-15T14:30:00Z'
      }
    ];
  }

  getDemoClubData(): ClubData {
    return {
      id: 'demo-team-1',
      name: 'Statsor FC',
      founded: 1995,
      stadium: 'Victory Stadium',
      capacity: 45000,
      headCoach: 'Demo Manager',

      budget: 15000000,
      revenue: 8500000,
      expenses: 6200000,
      trophies: 3,
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-12-15T14:30:00Z'
    };
  }

  getDemoMatches(): DemoMatch[] {
    return [
      {
        id: 'match-1',
        opponent: 'Arsenal FC',
        date: '2024-12-20',
        result: 'win',
        score: '2-1',
        venue: 'home',
        competition: 'Premier League',
        attendance: 42000
      },
      {
        id: 'match-2',
        opponent: 'Manchester City',
        date: '2024-12-15',
        result: 'draw',
        score: '1-1',
        venue: 'away',
        competition: 'Premier League',
        attendance: 55000
      },
      {
        id: 'match-3',
        opponent: 'Chelsea FC',
        date: '2024-12-10',
        result: 'loss',
        score: '0-2',
        venue: 'away',
        competition: 'Premier League',
        attendance: 40000
      },
      {
        id: 'match-4',
        opponent: 'Liverpool FC',
        date: '2024-12-05',
        result: 'win',
        score: '3-1',
        venue: 'home',
        competition: 'Premier League',
        attendance: 44500
      }
    ];
  }

  getDemoTrainingSessions(): DemoTrainingSession[] {
    return [
      {
        id: 'training-1',
        date: '2024-12-18',
        type: 'tactical',
        duration: 90,
        intensity: 'medium',
        focus: 'Set pieces and defensive positioning',
        attendance: 22
      },
      {
        id: 'training-2',
        date: '2024-12-17',
        type: 'fitness',
        duration: 75,
        intensity: 'high',
        focus: 'Cardio and strength training',
        attendance: 24
      },
      {
        id: 'training-3',
        date: '2024-12-16',
        type: 'technical',
        duration: 85,
        intensity: 'medium',
        focus: 'Passing accuracy and ball control',
        attendance: 23
      },
      {
        id: 'training-4',
        date: '2024-12-14',
        type: 'recovery',
        duration: 45,
        intensity: 'low',
        focus: 'Stretching and light exercises',
        attendance: 20
      }
    ];
  }

  getDemoFinancialRecords(): DemoFinancialRecord[] {
    return [
      {
        id: 'finance-1',
        date: '2024-12-01',
        type: 'income',
        category: 'Ticket Sales',
        amount: 450000,
        description: 'December home matches ticket revenue'
      },
      {
        id: 'finance-2',
        date: '2024-12-01',
        type: 'income',
        category: 'Sponsorship',
        amount: 200000,
        description: 'Monthly sponsorship payment'
      },
      {
        id: 'finance-3',
        date: '2024-12-05',
        type: 'expense',
        category: 'Player Salaries',
        amount: 380000,
        description: 'Monthly player wages'
      },
      {
        id: 'finance-4',
        date: '2024-12-10',
        type: 'expense',
        category: 'Stadium Maintenance',
        amount: 25000,
        description: 'Pitch renovation and facility upkeep'
      },
      {
        id: 'finance-5',
        date: '2024-12-12',
        type: 'income',
        category: 'Merchandise',
        amount: 35000,
        description: 'Jersey and merchandise sales'
      }
    ];
  }

  getDemoEvents(): DemoEvent[] {
    return [
      {
        id: 'event-1',
        title: 'vs Arsenal FC',
        date: '2024-12-20',
        type: 'match',
        description: 'Premier League home match',
        location: 'Victory Stadium'
      },
      {
        id: 'event-2',
        title: 'Tactical Training Session',
        date: '2024-12-18',
        type: 'training',
        description: 'Focus on set pieces and defensive positioning',
        location: 'Training Ground'
      },
      {
        id: 'event-3',
        title: 'Board Meeting',
        date: '2024-12-22',
        type: 'meeting',
        description: 'Monthly board meeting to discuss club strategy',
        location: 'Club Offices'
      },
      {
        id: 'event-4',
        title: 'Youth Academy Graduation',
        date: '2024-12-25',
        type: 'other',
        description: 'Ceremony for youth players joining first team',
        location: 'Victory Stadium'
      }
    ];
  }

  getDemoAnalytics(): DemoAnalytics {
    return {
      performance: {
        winRate: 65.5,
        goalsFor: 42,
        goalsAgainst: 28,
        cleanSheets: 8
      },
      financial: {
        totalRevenue: 8500000,
        totalExpenses: 6200000,
        netProfit: 2300000,
        budgetUtilization: 78.5
      },
      training: {
        sessionsCompleted: 156,
        averageAttendance: 22.8,
        fitnessImprovement: 12.3
      }
    };
  }

  // Method to initialize demo account with all data
  initializeDemoAccount() {
    const demoData = {
      players: this.getDemoPlayers(),
      club: this.getDemoClubData(),
      matches: this.getDemoMatches(),
      trainingSessions: this.getDemoTrainingSessions(),
      financialRecords: this.getDemoFinancialRecords(),
      events: this.getDemoEvents(),
      analytics: this.getDemoAnalytics()
    };

    // Store demo data in localStorage with demo prefix
    localStorage.setItem('demo_account_data', JSON.stringify(demoData));
    localStorage.setItem('user_type', 'demo');
    
    return demoData;
  }

  // Check if current user is demo account
  isDemoAccount(): boolean {
    return localStorage.getItem('user_type') === 'demo';
  }

  // Clear demo account data
  clearDemoAccount() {
    localStorage.removeItem('demo_account_data');
    localStorage.removeItem('user_type');
  }
}

export const demoAccountService = DemoAccountService.getInstance();