import requests, json, random, html, time, os

DATA_DIR = "data/raw"
OUTPUT_FILE = "data/questions_10000.json"
os.makedirs(DATA_DIR, exist_ok=True)

TARGET_COUNT = 10000
BATCH_SIZE = 50

def normalize(text):
    return html.unescape(text.strip())

def fetch_batch():
    url = f"https://opentdb.com/api.php?amount={BATCH_SIZE}&type=multiple"
    r = requests.get(url).json()
    
    # Check if API returned results
    if r.get("response_code", 1) != 0:
        print("⚠️ API returned error or no results, skipping this batch...")
        return []

    batch = []
    for q in r["results"]:
        opts = q["incorrect_answers"] + [q["correct_answer"]]
        random.shuffle(opts)
        batch.append({
            "q": normalize(q["question"]),
            "options": [f"{chr(65+i)}. {normalize(opt)}" for i, opt in enumerate(opts)],
            "answer": chr(65 + opts.index(q["correct_answer"])),
            "category": q["category"],
            "difficulty": q["difficulty"],
            "source": "opentdb"
        })
    return batch

all_questions = []
print("Fetching 10,000 questions...")

while len(all_questions) < TARGET_COUNT:
    batch = fetch_batch()
    if not batch:
        # Wait 1 second before retry if no results
        time.sleep(1)
        continue
    all_questions.extend(batch)
    print(f"Collected {len(all_questions)} / {TARGET_COUNT}")
    time.sleep(0.3)

# Remove duplicates
unique_questions = {q['q']: q for q in all_questions}.values()

# Save JSON
os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(list(unique_questions)[:TARGET_COUNT], f, indent=2, ensure_ascii=False)

print(f"✅ Saved {len(unique_questions)} questions to {OUTPUT_FILE}")
