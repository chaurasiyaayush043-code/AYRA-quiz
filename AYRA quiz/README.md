
# KBC Quiz Game

## Setup
1. Create a virtual environment and activate it:
   python -m venv venv
   source venv/bin/activate   # Linux/Mac
   venv\Scripts\activate    # Windows

2. Install dependencies:
   pip install -r requirements.txt

## Generate 10,000 Questions
Run the fetch script:
   python scripts/fetch_questions.py

This will create data/questions_10000.json

## Play the Game
Run:
   python game/ayra_game.py
