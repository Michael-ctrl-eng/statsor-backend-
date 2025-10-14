# AI Football Assistant Chatbot

A Python-based chatbot backend for the AI Assistant at http://localhost:3006/ai-assistant, using spaCy and NLTK for natural language processing.

## Features

- Natural Language Processing with spaCy and NLTK
- Intent classification and entity extraction
- Access to user data for personalized responses
- RESTful API for integration with frontend
- Data-driven insights and recommendations

## Requirements

- Python 3.7+
- pip (Python package installer)

## Installation

1. Navigate to the chatbot directory:
   ```
   cd chatbot
   ```

2. Create a virtual environment (recommended):
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

4. Download the spaCy English model:
   ```
   python -m spacy download en_core_web_sm
   ```

## Usage

1. Start the Flask server:
   ```
   python app.py
   ```

2. The server will start on `http://localhost:5000`

## API Endpoints

- `POST /api/chat` - Main chat endpoint
  - Request body: `{"message": "Your question", "context": {}}`
  - Response: `{"response": "Answer", "intent": "intent_type", "entities": {}}`

- `GET /api/team-data` - Get team data
- `POST /api/team-data` - Update team data
- `GET /health` - Health check endpoint

## Integration with Frontend

The chatbot is designed to work with the AI Assistant at http://localhost:3006/ai-assistant. The frontend should make POST requests to `http://localhost:5000/api/chat` with the user's message.

## Customization

You can customize the chatbot by modifying:

1. `USER_DATA` in `app.py` - Sample user data structure
2. `INTENT_PATTERNS` in `app.py` - Intent classification patterns
3. Response generation functions in `app.py`

## Extending Functionality

To extend the chatbot's functionality:

1. Add new intent patterns to `INTENT_PATTERNS`
2. Implement new response generation logic in `generate_response()`
3. Add new data structures to `USER_DATA` as needed
4. Create additional API endpoints for new features

## License

This project is licensed under the MIT License.