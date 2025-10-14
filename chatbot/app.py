import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import spacy
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re
from datetime import datetime
import random
import requests
from dotenv import load_dotenv

# Import the new Groq integration
from groq_integration import GroqIntegration

# Load environment variables
load_dotenv()

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

try:
    nltk.data.find('corpora/wordnet')
except LookupError:
    nltk.download('wordnet')

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Please install the spaCy English model: python -m spacy download en_core_web_sm")
    nlp = None

app = Flask(__name__)
CORS(app, origins=["http://localhost:3006", "http://localhost:3001", "http://localhost:5173", "http://localhost:3008"])  # Enable CORS for frontend and backend

# Initialize NLTK components
lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))

# Initialize Groq integration
try:
    groq_client = GroqIntegration()
    print("Groq integration initialized successfully")
except Exception as e:
    print(f"Failed to initialize Groq integration: {e}")
    groq_client = None

# Backend API configuration
BACKEND_API_URL = os.getenv('BACKEND_API_URL', 'http://localhost:3001/api/v1')

def fetch_user_data(user_id=None):
    """Fetch real user data from the backend API"""
    try:
        # For now, we'll use mock data but in a real implementation,
        # this would fetch from the backend API using the user_id
        # Example API call:
        # response = requests.get(f"{BACKEND_API_URL}/players", 
        #                        headers={"Authorization": f"Bearer {access_token}"})
        # if response.status_code == 200:
        #     return response.json()
        
        # Return the existing mock data for now
        return USER_DATA
    except Exception as e:
        print(f"Error fetching user data: {e}")
        return USER_DATA  # Fallback to mock data

def update_user_data(user_id, data):
    """Update user data in the backend"""
    try:
        # For now, we'll just print the update but in a real implementation,
        # this would make a PUT request to the backend API
        # Example API call:
        # response = requests.put(f"{BACKEND_API_URL}/players/{user_id}", 
        #                        json=data,
        #                        headers={"Authorization": f"Bearer {access_token}"})
        # if response.status_code == 200:
        #     return response.json()
        
        print(f"Updating user data for user {user_id}: {data}")
        return {"success": True, "message": "Data update simulated"}
    except Exception as e:
        print(f"Error updating user data: {e}")
        return {"success": False, "error": str(e)}

# Enhanced sample user data with more realistic information
USER_DATA = {
    "players": [
        {
            "id": "1",
            "name": "Lionel Messi",
            "position": "Forward",
            "goals": 28,
            "assists": 15,
            "rating": 9.2,
            "fitness": 95,
            "injuries": [],
            "age": 36,
            "nationality": "Argentina",
            "market_value": "45M",
            "contract_expiry": "2025-06-30",
            "strengths": ["Finishing", "Dribbling", "Vision"],
            "weaknesses": ["Pace", "Defensive work"]
        },
        {
            "id": "2",
            "name": "Kevin De Bruyne",
            "position": "Midfielder",
            "goals": 8,
            "assists": 22,
            "rating": 8.8,
            "fitness": 92,
            "injuries": [],
            "age": 32,
            "nationality": "Belgium",
            "market_value": "35M",
            "contract_expiry": "2026-06-30",
            "strengths": ["Passing", "Vision", "Set pieces"],
            "weaknesses": ["Defensive positioning"]
        },
        {
            "id": "3",
            "name": "Virgil van Dijk",
            "position": "Defender",
            "goals": 3,
            "assists": 1,
            "rating": 8.5,
            "fitness": 94,
            "injuries": [],
            "age": 32,
            "nationality": "Netherlands",
            "market_value": "25M",
            "contract_expiry": "2027-06-30",
            "strengths": ["Aerial ability", "Leadership", "Passing"],
            "weaknesses": ["Pace"]
        },
        {
            "id": "4",
            "name": "Alisson Becker",
            "position": "Goalkeeper",
            "goals": 0,
            "assists": 0,
            "rating": 8.7,
            "fitness": 96,
            "injuries": [],
            "age": 31,
            "nationality": "Brazil",
            "market_value": "20M",
            "contract_expiry": "2028-06-30",
            "strengths": ["Shot stopping", "Distribution", "Command of area"],
            "weaknesses": ["Occasional mistakes under pressure"]
        }
    ],
    "team": {
        "name": "FC Barcelona",
        "formation": "4-3-3",
        "wins": 24,
        "losses": 4,
        "draws": 6,
        "goals_for": 78,
        "goals_against": 32,
        "clean_sheets": 14,
        "league_position": 2,
        "manager": "Xavi Hernandez",
        "recent_form": ["W", "D", "W", "W", "L"]
    },
    "matches": [
        {
            "id": "1",
            "opponent": "Real Madrid",
            "date": "2023-10-15",
            "result": "Win",
            "score": "3-1",
            "home_away": "Home",
            "competition": "La Liga",
            "goals": [
                {"minute": 23, "scorer": "Lionel Messi", "assist": "Kevin De Bruyne"},
                {"minute": 67, "scorer": "Lionel Messi", "assist": "None"},
                {"minute": 89, "scorer": "Kevin De Bruyne", "assist": "Lionel Messi"}
            ],
            "tactical_notes": "Effective pressing in midfield, Messi's movement caused problems for the opponent's defense"
        },
        {
            "id": "2",
            "opponent": "Bayern Munich",
            "date": "2023-10-22",
            "result": "Draw",
            "score": "2-2",
            "home_away": "Away",
            "competition": "Champions League",
            "goals": [
                {"minute": 15, "scorer": "Lionel Messi", "assist": "Kevin De Bruyne"},
                {"minute": 42, "scorer": "Thomas Muller", "assist": "Kingsley Coman"},
                {"minute": 68, "scorer": "Robert Lewandowski", "assist": "None"},
                {"minute": 85, "scorer": "Kevin De Bruyne", "assist": "Lionel Messi"}
            ],
            "tactical_notes": "Strong defensive performance but struggled to maintain possession in the second half"
        },
        {
            "id": "3",
            "opponent": "Atletico Madrid",
            "date": "2023-10-29",
            "result": "Win",
            "score": "2-0",
            "home_away": "Home",
            "competition": "La Liga",
            "goals": [
                {"minute": 34, "scorer": "Lionel Messi", "assist": "Kevin De Bruyne"},
                {"minute": 76, "scorer": "Frenkie de Jong", "assist": "Lionel Messi"}
            ],
            "tactical_notes": "Solid defensive shape, effective counter-pressing after losing possession"
        }
    ],
    "training": {
        "last_session": "2023-10-25",
        "focus_areas": ["Possession", "Set Pieces", "Fitness"],
        "attendance": 95,
        "duration_minutes": 90
    },
    "upcoming_matches": [
        {
            "opponent": "Sevilla",
            "date": "2023-11-05",
            "time": "20:00",
            "venue": "Home",
            "competition": "La Liga"
        },
        {
            "opponent": "PSG",
            "date": "2023-11-08",
            "time": "20:00",
            "venue": "Away",
            "competition": "Champions League"
        }
    ]
}

# Enhanced intent classification with more nuanced patterns
INTENT_PATTERNS = {
    "greeting": {
        "patterns": ["hello", "hi", "hey", "good morning", "good afternoon", "good evening", "greetings", "what's up"],
        "responses": [
            "Hello! I'm your AI Football Assistant. How can I help you today?",
            "Hi there! What would you like to know about your team?",
            "Greetings! I'm here to help with tactical advice and team analysis."
        ]
    },
    "player_info": {
        "patterns": ["player", "who is", "tell me about", "information about", "stats for", "performance", "rating", "goals", "assists", "contract", "strength", "weakness", "form", "condition", "squad", "team member"],
        "responses": [
            "I can provide detailed information about your players. Which player would you like to know more about?",
            "Let me share some insights about your squad members. Who are you interested in?",
            "I have detailed stats on all your players. Just tell me the name of the player you're interested in."
        ]
    },
    "team_info": {
        "patterns": ["team", "club", "squad", "formation", "record", "position", "league", "manager", "clean sheet", "season", "results", "table", "standings"],
        "responses": [
            "I can provide detailed information about your team's performance and setup.",
            "Let me share insights about your team's current status and achievements.",
            "I have comprehensive data on your team's season performance and tactical setup."
        ]
    },
    "match_info": {
        "patterns": ["match", "game", "fixture", "next match", "last match", "result", "score", "opponent", "competition", "goals", "tactical", "analysis", "upcoming", "recent"],
        "responses": [
            "I can provide details about your upcoming or past matches.",
            "Let me share match information and tactical insights.",
            "I have data on your recent performances and upcoming fixtures."
        ]
    },
    "tactics": {
        "patterns": ["tactic", "strategy", "formation", "play style", "approach", "lineup", "system", "counter", "pressing", "defend", "attack", "shape", "setup", "style"],
        "responses": [
            "I can offer tactical advice for your team's formation and strategy.",
            "Let me provide insights on tactical approaches and formations.",
            "I can analyze your tactical setup and suggest improvements."
        ]
    },
    "training": {
        "patterns": ["training", "practice", "drill", "workout", "exercise", "session", "focus", "improve", "fitness", "conditioning", "workout", "plan"],
        "responses": [
            "I can suggest training drills and focus areas for your team.",
            "Let me recommend specific training exercises based on your team's needs.",
            "I can help you plan effective training sessions for your players."
        ]
    },
    "injury": {
        "patterns": ["injury", "hurt", "fitness", "recovery", "medical", "suspension", "absence", "condition", "rest", "health", "wellness"],
        "responses": [
            "I can provide information about player fitness and injury status.",
            "Let me check on your squad's current fitness levels and any concerns.",
            "I can help you manage player workload and recovery."
        ]
    },
    "analysis": {
        "patterns": ["analysis", "insight", "recommendation", "advice", "suggestion", "improve", "weakness", "strength", "tactical", "data", "metrics", "review", "evaluate"],
        "responses": [
            "I can provide data-driven insights and recommendations for your team.",
            "Let me analyze your team's performance and offer suggestions.",
            "I can identify key strengths and areas for improvement in your setup."
        ]
    },
    "prediction": {
        "patterns": ["predict", "chance", "probability", "win", "lose", "draw", "outcome", "expect", "forecast", "chance", "likely", "result"],
        "responses": [
            "I can make predictions based on your team's current form and data.",
            "Let me analyze the factors that could influence your next match.",
            "I can provide statistical predictions for upcoming fixtures."
        ]
    },
    "agent_action": {
        "patterns": ["add player", "create player", "remove player", "delete player", "add match", "create match", "schedule match", "update player", "edit player", "new player", "sign player", "transfer", "buy player", "sell player", "release player", "manage team", "team management", "organize match", "set up match", "arrange match", "plan match", "add", "remove", "create", "delete", "sign", "transfer player", "buy", "sell", "release", "manage", "organize", "schedule"],
        "responses": [
            "I can help you manage your team by adding or updating players and matches.",
            "Let me assist you with team management tasks.",
            "I can perform administrative actions for your team."
        ]
    },
    "goodbye": {
        "patterns": ["bye", "goodbye", "see you", "farewell", "thanks", "thank you", "that's all", "later"],
        "responses": [
            "Goodbye! Feel free to ask me anytime about your team.",
            "Thanks for chatting! I'm here whenever you need tactical advice.",
            "See you later! Remember, I'm always available for football insights."
        ]
    }
}

# Enhanced entity extraction for better understanding
def preprocess_text(text):
    """Preprocess text using NLTK and spaCy"""
    if nlp:
        doc = nlp(text.lower())
        tokens = [token.lemma_ for token in doc if not token.is_stop and not token.is_punct and token.is_alpha]
    else:
        # Fallback if spaCy is not available
        tokens = word_tokenize(text.lower())
        tokens = [lemmatizer.lemmatize(token) for token in tokens if token not in stop_words and token.isalpha()]
    
    return tokens

def classify_intent(user_input):
    """Classify the intent of the user input with improved accuracy"""
    processed_input = preprocess_text(user_input)
    input_text = " ".join(processed_input)
    
    # Calculate similarity scores for each intent
    best_intent = "unknown"
    best_score = 0
    
    for intent, data in INTENT_PATTERNS.items():
        patterns = data["patterns"]
        for pattern in patterns:
            # Check for exact matches first
            if pattern in input_text:
                return intent
            # Calculate similarity for partial matches
            similarity = len(set(pattern.split()) & set(input_text.split())) / len(set(pattern.split()))
            if similarity > best_score:
                best_score = similarity
                best_intent = intent
    
    # Return the intent if we have a reasonable match, with a lower threshold for agent actions
    if best_score > 0.2:
        return best_intent
    else:
        # Check for agent action keywords specifically
        agent_keywords = ["add", "remove", "create", "delete", "sign", "transfer", "buy", "sell", "release", "manage", "organize", "schedule"]
        for keyword in agent_keywords:
            if keyword in input_text:
                return "agent_action"
        return "unknown"

def extract_entities(user_input):
    """Extract entities from user input using spaCy"""
    entities = {}
    
    if nlp:
        doc = nlp(user_input)
        for ent in doc.ents:
            entities[ent.label_] = ent.text
    else:
        # Simple regex-based entity extraction as fallback
        # Extract potential player names (capitalized words)
        player_names = re.findall(r'\b[A-Z][a-z]+\b', user_input)
        if player_names:
            entities['PERSON'] = player_names[0]  # Take the first as example
    
    return entities

def call_groq_api(prompt, system_message="You are a helpful football assistant."):
    """Call Groq API for enhanced responses"""
    if not groq_client:
        print("Groq client not initialized")
        return None
        
    try:
        response = groq_client.generate_response(
            prompt=prompt,
            system_message=system_message,
            temperature=0.7,
            max_tokens=1000
        )
        return response
    except Exception as e:
        print(f"Error calling Groq API: {e}")
        return None

def generate_response(user_input, intent, entities, user_data=USER_DATA):
    """Generate a response based on intent and entities with enhanced Groq integration"""
    user_input_lower = user_input.lower()
    
    # Always use Groq API for agent actions for more sophisticated responses
    if intent == "agent_action":
        prompt = f"""
        User wants to perform a team management action: {user_input}
        Current team data: {json.dumps(user_data, indent=2)}
        
        Please provide a detailed, helpful response that:
        1. Acknowledges the specific request (e.g., adding a player, scheduling a match, etc.)
        2. Explains what action would be taken in a real system
        3. Provides any necessary information or next steps
        4. Uses football-specific terminology and knowledge
        5. Reminds the user that this is a simulation and real actions would require proper authentication
        """
        
        groq_response = call_groq_api(prompt, "You are an AI assistant that can help manage football teams. You can analyze requests to add players, schedule matches, etc. Always provide detailed, helpful responses using football terminology.")
        if groq_response:
            return groq_response
        else:
            return random.choice(INTENT_PATTERNS["agent_action"]["responses"]) + " (Note: I'm currently in simulation mode, so I can't perform actual actions.)"
    
    # Also use Groq API for analysis and prediction intents for more sophisticated responses
    elif intent == "analysis" or intent == "prediction":
        prompt = f"""
        User asked: {user_input}
        Current team data: {json.dumps(user_data, indent=2)}
        
        Please provide a detailed, data-driven response that:
        1. Directly answers the user's question
        2. Uses the provided team data to support your analysis
        3. Provides actionable insights or recommendations
        4. Uses football-specific terminology and knowledge
        5. Includes specific statistics and examples from the data when relevant
        """
        
        groq_response = call_groq_api(prompt, "You are an expert football analyst and tactical advisor. Always provide detailed, data-driven responses using football terminology.")
        if groq_response:
            return groq_response
        else:
            # Fallback to template responses
            pass  # Continue to template responses below
    
    # Use Groq API for complex queries that don't match specific intents
    elif intent == "unknown" or len(user_input.split()) > 5:
        prompt = f"""
        User asked: {user_input}
        Current team data: {json.dumps(user_data, indent=2)}
        
        Please provide a helpful response that:
        1. Directly addresses the user's question
        2. Uses the provided team data when relevant
        3. Provides specific, actionable advice when possible
        4. Uses football-specific terminology and knowledge
        5. Is detailed and comprehensive, showing expertise in football management
        """
        
        groq_response = call_groq_api(prompt, "You are an expert football analyst and tactical advisor. Always provide detailed, helpful responses using football terminology.")
        if groq_response:
            return groq_response
        else:
            # Fallback to data-driven insights
            return get_data_driven_insight(user_input, user_data)
    
    # For all other intents, try Groq API first as well, then fallback
    prompt = f"""
    User asked: {user_input}
    Current team data: {json.dumps(user_data, indent=2)}
    
    Please provide a helpful response that:
    1. Directly addresses the user's question
    2. Uses the provided team data when relevant
    3. Provides specific, actionable advice when possible
    4. Uses football-specific terminology and knowledge
    5. Is detailed and comprehensive, showing expertise in football management
    """
    
    groq_response = call_groq_api(prompt, "You are an expert football analyst and tactical advisor. Always provide detailed, helpful responses using football terminology.")
    if groq_response:
        return groq_response
    
    # If Groq API fails or isn't available, use template responses
    if intent == "greeting":
        return random.choice(INTENT_PATTERNS["greeting"]["responses"])
    
    elif intent == "goodbye":
        return random.choice(INTENT_PATTERNS["goodbye"]["responses"])
    
    elif intent == "player_info":
        # Check if a specific player is mentioned
        player_name = entities.get('PERSON', '')
        
        if player_name:
            # Try to find the player
            player = None
            for p in user_data['players']:
                if player_name.lower() in p['name'].lower():
                    player = p
                    break
            
            if player:
                contract_info = f"Contract until {player['contract_expiry']}" if player.get('contract_expiry') else "Contract details not available"
                return f"""{player['name']} is a {player['age']}-year-old {player['position']} from {player['nationality']}.

📊 Performance Stats:
• Goals: {player['goals']}
• Assists: {player['assists']}
• Rating: {player['rating']}/10
• Fitness: {player['fitness']}%

💼 Contract Information:
• {contract_info}
• Market Value: {player['market_value']}

⚡ Strengths:
• {', '.join(player['strengths'])}

⚠️ Areas for Improvement:
• {', '.join(player['weaknesses'])}

Is there anything specific about {player['name']} you'd like to know?"""
            else:
                return f"I couldn't find information about {player_name}. Here are the players in your squad: " + ", ".join([p['name'] for p in user_data['players']])
        else:
            # General player info
            player_list = "\n".join([f"• {p['name']} - {p['position']} (Rating: {p['rating']}/10)" for p in user_data['players']])
            return f"Your squad includes:\n{player_list}\n\nYou can ask me about specific players for more detailed information."
    
    elif intent == "team_info":
        team = user_data['team']
        recent_form = "".join(team['recent_form'][-5:]) if team['recent_form'] else "N/A"
        return f"""Your team is {team['name']} managed by {team['manager']}.

📋 Season Record:
• Position: {team['league_position']} in {'La Liga' if 'la liga' in user_input_lower else 'the league'}
• Wins: {team['wins']}
• Draws: {team['draws']}
• Losses: {team['losses']}
• Goals For: {team['goals_for']}
• Goals Against: {team['goals_against']}
• Clean Sheets: {team['clean_sheets']}

战术:
Currently playing in a {team['formation']} formation.

📈 Recent Form: {recent_form}

Would you like tactical advice for your current formation?"""
    
    elif intent == "match_info":
        if "next" in user_input_lower or "upcoming" in user_input_lower:
            if user_data['upcoming_matches']:
                next_match = user_data['upcoming_matches'][0]
                return f"""Your next match is against {next_match['opponent']}:

📅 Date: {next_match['date']}
⏰ Time: {next_match['time']}
📍 Venue: {next_match['venue']}
🏆 Competition: {next_match['competition']}

Would you like tactical advice for this match?"""
            else:
                return "I don't have information about upcoming matches at the moment."
        else:
            # Last match info
            if user_data['matches']:
                last_match = user_data['matches'][0]
                goals_info = "\n".join([f"  ⚽ {goal['minute']}': {goal['scorer']} ({'assist: ' + goal['assist'] if goal['assist'] != 'None' else 'unassisted'})" for goal in last_match.get('goals', [])])
                return f"""Your last match was against {last_match['opponent']} on {last_match['date']} ({last_match['home_away']}).

🎯 Result: {last_match['result']} ({last_match['score']})
🏆 Competition: {last_match['competition']}

⚽ Goals:
{goals_info if goals_info else '  No goals recorded'}

📋 Tactical Notes:
{last_match.get('tactical_notes', 'No specific tactical notes available')}

Would you like an analysis of this match?"""
            else:
                return "I don't have any match information recorded yet."
    
    elif intent == "tactics":
        team = user_data['team']
        return f"""Your team typically plays in a {team['formation']} formation under manager {team['manager']}.

📋 Formation Analysis:
• This formation provides width through the wingers
• Strong midfield presence with three central midfielders
• High pressing potential with forwards tracking back

💡 Tactical Recommendations:
1. Use the wings to stretch the opposition defense
2. Maintain compactness between lines
3. Quick transitions from defense to attack

Would you like specific advice for an upcoming opponent?"""
    
    elif intent == "training":
        training = user_data['training']
        return f"""Your last training session was on {training['last_session']}.

🎯 Focus Areas:
• {'\n• '.join(training['focus_areas'])}

📊 Session Details:
• Duration: {training['duration_minutes']} minutes
• Attendance: {training['attendance']}%

💡 Training Recommendations:
1. Continue possession drills to improve ball control
2. Work on set-piece variations for more scoring opportunities
3. Include fitness training to maintain high energy levels

Would you like a specific training plan for the upcoming match?"""
    
    elif intent == "injury":
        injured_players = [p for p in user_data['players'] if p['injuries']]
        if injured_players:
            injury_info = "\n".join([f"• {p['name']} - {len(p['injuries'])} injuries" for p in injured_players])
            return f"Currently, the followingCurrently, the following players have injury concerns:\n{injury_info}\n\nWould you like recommendations for managing these injuries?"""
        else:
            avg_fitness = np.mean([p['fitness'] for p in user_data['players']])
            return f"""All players are currently fit and available for selection.

📊 Team Fitness:
• Average Fitness Level: {avg_fitness:.1f}%
• All players above 90% fitness

This is excellent news for upcoming matches!"""
    
    elif intent == "analysis":
        # Try Groq API first, then fallback
        prompt = f"""
        User asked: {user_input}
        Current team data: {json.dumps(user_data, indent=2)}
        
        Please provide a detailed, data-driven analysis that:
        1. Directly answers the user's question
        2. Uses the provided team data to support your analysis
        3. Provides actionable insights or recommendations
        4. Uses football-specific terminology and knowledge
        5. Includes specific statistics and examples from the data when relevant
        """
        
        groq_response = call_groq_api(prompt, "You are an expert football analyst and tactical advisor. Always provide detailed, data-driven responses using football terminology.")
        if groq_response:
            return groq_response
        else:
            return get_data_driven_insight(user_input, user_data)
    
    elif intent == "prediction":
        # Try Groq API first, then fallback
        prompt = f"""
        User asked: {user_input}
        Current team data: {json.dumps(user_data, indent=2)}
        
        Please provide a detailed prediction that:
        1. Directly answers the user's question
        2. Uses the provided team data to support your analysis
        3. Provides probability percentages when relevant
        4. Uses football-specific terminology and knowledge
        5. Considers multiple factors like form, injuries, tactics, etc.
        """
        
        groq_response = call_groq_api(prompt, "You are an expert football analyst and tactical advisor. Always provide detailed, data-driven responses using football terminology.")
        if groq_response:
            return groq_response
        elif user_data['upcoming_matches']:
            next_match = user_data['upcoming_matches'][0]
            # Simple prediction based on team form
            team = user_data['team']
            total_games = team['wins'] + team['draws'] + team['losses']
            win_rate = (team['wins'] / total_games) * 100 if total_games > 0 else 50
            
            # Adjust based on home/away
            home_advantage = 5 if next_match['venue'] == 'Home' else -5
            
            predicted_win_rate = min(95, max(5, win_rate + home_advantage))
            
            return f"""Based on your current form, I predict:

🎯 Match: {team['name']} vs {next_match['opponent']}
📈 Win Probability: {predicted_win_rate:.1f}%
⚖️ Draw Probability: {(100-predicted_win_rate)/2:.1f}%
📉 Loss Probability: {(100-predicted_win_rate)/2:.1f}%

Factors supporting this prediction:
• Strong home form (if home match)
• Good recent results
• High team fitness levels

Would you like tactical advice to improve these chances?"""
        else:
            return "I don't have information about upcoming matches to make predictions."
    
    else:
        # For unknown intents, try Groq API first, then fallback to data-driven insights
        prompt = f"""
        User asked: {user_input}
        Current team data: {json.dumps(user_data, indent=2)}
        
        Please provide a helpful response that:
        1. Directly addresses the user's question
        2. Uses the provided team data when relevant
        3. Provides specific, actionable advice when possible
        4. Uses football-specific terminology and knowledge
        5. Is detailed and comprehensive, showing expertise in football management
        """
        
        groq_response = call_groq_api(prompt, "You are an expert football analyst and tactical advisor. Always provide detailed, helpful responses using football terminology.")
        if groq_response:
            return groq_response
        else:
            return get_data_driven_insight(user_input, user_data)

def get_data_driven_insight(user_input, user_data=USER_DATA):
    """Provide data-driven insights based on user data"""
    # Analyze team performance
    team = user_data['team']
    players = user_data['players']
    matches = user_data['matches']
    
    insights = []
    
    # Top scorer
    top_scorer = max(players, key=lambda x: x['goals'])
    insights.append(f"⚽ Your top scorer is {top_scorer['name']} with {top_scorer['goals']} goals.")
    
    # Top assister
    top_assister = max(players, key=lambda x: x['assists'])
    insights.append(f"🎯 Your most creative player is {top_assister['name']} with {top_assister['assists']} assists.")
    
    # Team form
    total_games = team['wins'] + team['draws'] + team['losses']
    if total_games > 0:
        win_rate = (team['wins'] / total_games) * 100
        insights.append(f"📈 Your team's win rate this season is {win_rate:.1f}% ({team['wins']}W-{team['draws']}D-{team['losses']}L).")
    
    # Goal difference
    goal_difference = team['goals_for'] - team['goals_against']
    insights.append(f"⚖️ Goal Difference: {'+'}{goal_difference}" if goal_difference >= 0 else f"⚖️ Goal Difference: {goal_difference}")
    
    # Clean sheets
    insights.append(f"🛡️ Clean Sheets: {team['clean_sheets']} out of {total_games} matches.")
    
    # Recent form (last 3 matches)
    if len(matches) >= 3:
        recent_matches = matches[:3]
        results = [match['result'][0] for match in recent_matches]  # Get first letter (W, D, L)
        form_string = "".join(results)
        insights.append(f"🔥 Recent Form (Last 3): {form_string}")
    
    # Fitness level
    avg_fitness = np.mean([p['fitness'] for p in players])
    if avg_fitness > 90:
        insights.append("💪 Your squad is in excellent physical condition (avg fitness: {:.1f}%).".format(avg_fitness))
    elif avg_fitness > 80:
        insights.append("👍 Your squad has good fitness levels (avg fitness: {:.1f}%).".format(avg_fitness))
    else:
        insights.append("⚠️ Consider focusing on fitness training to improve overall team performance (avg fitness: {:.1f}%).".format(avg_fitness))
    
    # Contract situation
    expiring_contracts = [p for p in players if p.get('contract_expiry') and datetime.strptime(p['contract_expiry'], '%Y-%m-%d') < datetime.strptime('2025-06-30', '%Y-%m-%d')]
    if expiring_contracts:
        expiring_names = ", ".join([p['name'] for p in expiring_contracts])
        insights.append(f"📝 Contract Alert: {expiring_names} have contracts expiring soon.")
    
    # Market value
    total_value = sum([float(p['market_value'].replace('M', '')) for p in players if p.get('market_value')])
    insights.append(f"💰 Squad Value: €{total_value:.0f}M")
    
    return "\n\n".join(insights) + "\n\nIs there anything specific you'd like to know about your team or would you like tactical advice?"

@app.route('/api/chat', methods=['POST'])
def chat():
    """Main chat endpoint"""
    try:
        data = request.get_json()
        user_input = data.get('message', '')
        user_context = data.get('context', {})
        user_id = user_context.get('userId')  # Extract user ID if available
        
        if not user_input:
            return jsonify({"error": "No message provided"}), 400
        
        # Fetch real user data
        user_data = fetch_user_data(user_id)
        
        # Classify intent
        intent = classify_intent(user_input)
        
        # Extract entities
        entities = extract_entities(user_input)
        
        # Generate response
        response = generate_response(user_input, intent, entities, user_data)
        
        return jsonify({
            "response": response,
            "intent": intent,
            "entities": entities
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/team-data', methods=['GET'])
def get_team_data():
    """Endpoint to get team data"""
    return jsonify(USER_DATA)

@app.route('/api/team-data', methods=['POST'])
def update_team_data():
    """Endpoint to update team data"""
    global USER_DATA
    try:
        data = request.get_json()
        USER_DATA.update(data)
        return jsonify({"message": "Team data updated successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "AI Football Assistant"}), 200

@app.route('/', methods=['GET'])
def home():
    """Home endpoint"""
    return jsonify({"message": "AI Football Assistant is running", "endpoints": ["/health", "/api/chat", "/api/team-data"]}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)