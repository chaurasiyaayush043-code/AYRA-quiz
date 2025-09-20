from flask import Flask, render_template, jsonify
from flask_cors import CORS
import os, json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "..", "data")

app = Flask(
    __name__,
    template_folder="kbc_web",
    static_folder="kbc_web"
)

CORS(app)  # <-- Allow all origins for development

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/questions")
def get_questions():
    try:
        file_path = os.path.join(DATA_DIR, "questions_10000.json")
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route("/api/questions/full")
def get_full_questions():
    try:
        file_path = os.path.join(DATA_DIR, "questions_full_10000.json")
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)
