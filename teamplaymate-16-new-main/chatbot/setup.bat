@echo off
echo Installing Python dependencies for AI Football Assistant...
pip install -r requirements.txt

echo Downloading spaCy English model...
python -m spacy download en_core_web_sm

echo Setup complete! Run 'run.bat' to start the chatbot service.
pause