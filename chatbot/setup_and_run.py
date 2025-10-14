#!/usr/bin/env python3
"""
Setup and run script for the AI Football Assistant chatbot.
This script ensures all dependencies are installed and starts the chatbot service.
"""

import os
import sys
import subprocess
import platform
from pathlib import Path

def check_python_version():
    """Check if Python 3.7+ is installed"""
    if sys.version_info < (3, 7):
        print("Error: Python 3.7 or higher is required")
        print(f"Current version: {sys.version}")
        return False
    return True

def install_dependencies():
    """Install required Python packages"""
    print("Installing required dependencies...")
    
    try:
        # Install/upgrade pip first
        subprocess.check_call([sys.executable, "-m", "pip", "install", "--upgrade", "pip"])
        
        # Install required packages
        required_packages = [
            "flask==2.3.2",
            "flask-cors==4.0.0",
            "spacy==3.6.1",
            "nltk==3.8.1",
            "numpy==1.24.3",
            "pandas==2.0.3",
            "scikit-learn==1.3.0",
            "python-dotenv==1.0.0",
            "requests==2.31.0"
        ]
        
        for package in required_packages:
            print(f"Installing {package}...")
            subprocess.check_call([sys.executable, "-m", "pip", "install", package])
        
        # Download spaCy English model
        print("Downloading spaCy English model...")
        subprocess.check_call([sys.executable, "-m", "spacy", "download", "en_core_web_sm"])
        
        # Download NLTK data
        print("Downloading NLTK data...")
        import nltk
        nltk.download('punkt')
        nltk.download('stopwords')
        nltk.download('wordnet')
        
        print("All dependencies installed successfully!")
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"Error installing dependencies: {e}")
        return False
    except Exception as e:
        print(f"Unexpected error during installation: {e}")
        return False

def start_chatbot():
    """Start the chatbot service"""
    print("Starting AI Football Assistant chatbot...")
    
    try:
        # Change to the chatbot directory
        chatbot_dir = Path(__file__).parent
        os.chdir(chatbot_dir)
        
        # Set environment variables
        os.environ.setdefault('FLASK_APP', 'app.py')
        os.environ.setdefault('FLASK_ENV', 'development')
        os.environ.setdefault('FLASK_RUN_HOST', '0.0.0.0')
        os.environ.setdefault('FLASK_RUN_PORT', '5000')
        
        # Start the Flask app
        subprocess.check_call([sys.executable, "-m", "flask", "run"])
        
    except subprocess.CalledProcessError as e:
        print(f"Error starting chatbot: {e}")
        return False
    except Exception as e:
        print(f"Unexpected error starting chatbot: {e}")
        return False

def main():
    """Main function"""
    print("AI Football Assistant Setup and Run Script")
    print("=" * 50)
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Install dependencies
    print("\nStep 1: Installing dependencies...")
    if not install_dependencies():
        print("Failed to install dependencies. Exiting.")
        sys.exit(1)
    
    # Start chatbot
    print("\nStep 2: Starting chatbot service...")
    if not start_chatbot():
        print("Failed to start chatbot service. Exiting.")
        sys.exit(1)

if __name__ == "__main__":
    main()