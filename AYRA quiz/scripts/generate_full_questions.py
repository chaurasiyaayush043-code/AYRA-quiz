import json, random, html, os

OTDB_FILE = "data/questions_10000.json"           # your fetched OTDB
OUTPUT_FILE = "data/questions_full_10000.json"
TARGET_COUNT = 10000

os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)

# Load OTDB questions
with open(OTDB_FILE, "r", encoding="utf-8") as f:
    otdb_questions = json.load(f)

print(f"Loaded {len(otdb_questions)} OTDB questions.")

all_questions = otdb_questions.copy()

# Generate filler questions if needed
def generate_filler(n, start_index):
    filler = []
    for i in range(start_index, start_index + n):
        q_text = f"Filler Question #{i}: What is {i} + {i}?"
        options = [
            f"A. {i*2}",
            f"B. {i*2+1}",
            f"C. {i*2+2}",
            f"D. {i*2+3}"
        ]
        correct = "A"
        filler.append({
            "q": q_text,
            "options": options,
            "answer": correct,
            "category": "Filler",
            "difficulty": "easy",
            "source": "generated"
        })
    return filler

needed = TARGET_COUNT - len(all_questions)
if needed > 0:
    print(f"Generating {needed} filler questions...")
    all_questions.extend(generate_filler(needed, start_index=1))

# Shuffle final questions
random.shuffle(all_questions)

# Save
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(all_questions, f, indent=2, ensure_ascii=False)

print(f"✅ Saved {len(all_questions)} questions to {OUTPUT_FILE}")
