// ====================== QUIZ GAME LOGIC ======================
let score = 0;
let uniqueQuestions = [];
let unusedQuestions = [];

// ===== Shuffle =====
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// ===== Normalize text =====
function normalizeText(text) {
    return text.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
}

// ===== Remove duplicates =====
function removeDuplicates(array) {
    const seen = new Set();
    return array.filter(q => {
        const norm = normalizeText(q.q);
        if (seen.has(norm)) return false;
        seen.add(norm);
        return true;
    });
}

// ===== Show question =====
function showQuestion(q) {
    document.getElementById("question").innerText = q.q;
    const optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = "";

    q.options.forEach(opt => {
        const btn = document.createElement("button");
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(opt, q.answer);
        btn.classList.add("option-btn");
        optionsDiv.appendChild(btn);
    });

    // Clear feedback
    const feedback = document.getElementById("feedback");
    if (feedback) feedback.style.opacity = 0;
}

// ===== Check answer =====
function checkAnswer(selected, correct) {
    const feedback = document.getElementById("feedback") || document.createElement("div");
    feedback.id = "feedback";

    if (!document.getElementById("feedback")) {
        const container = document.getElementById("quiz-container") || document.body;
        container.appendChild(feedback);
    }

    // Clear previous classes
    feedback.classList.remove("correct", "wrong");

    if (selected.startsWith(correct)) {
        feedback.innerText = "✅ Correct!";
        feedback.classList.add("correct");
        score += 1000;
    } else {
        feedback.innerText = `❌ Wrong! The correct answer was ${correct}.`;
        feedback.classList.add("wrong");
        score = 0;
    }

    document.getElementById("score").innerText = "Score: " + score;

    // Show feedback smoothly
    feedback.style.opacity = 1;

    // Disable buttons temporarily
    document.querySelectorAll(".option-btn").forEach(btn => btn.disabled = true);

    // Next question after 1 second
    setTimeout(() => {
        feedback.style.opacity = 0;
        document.querySelectorAll(".option-btn").forEach(btn => btn.disabled = false);
        nextQuestion();
    }, 1000);
}

// ===== Next question =====
function nextQuestion() {
    if (unusedQuestions.length === 0) {
        unusedQuestions = [...uniqueQuestions];
        shuffle(unusedQuestions);
    }
    const q = unusedQuestions.shift();
    showQuestion(q);
}

// ===== Quit game =====
function quitGame() {
    alert("Game ended. Final Score: " + score);
    score = 0;
    document.getElementById("score").innerText = "Score: " + score;
    document.getElementById("question").innerText = "Game ended. Click Next to play again.";
    document.getElementById("options").innerHTML = "";
    unusedQuestions = [...uniqueQuestions];
    shuffle(unusedQuestions);
}

// ===== Fallback questions =====
const fallbackQuestions = [
    { q: "1+1?", options: ["A.1", "B.2", "C.3", "D.4"], answer: "B" },
    { q: "2+2?", options: ["A.2", "B.3", "C.4", "D.5"], answer: "C" },
    { q: "Capital of India?", options: ["A.Mumbai", "B.Delhi", "C.Kolkata", "D.Chennai"], answer: "B" },
    { q: "5-2=?", options: ["A.2", "B.3", "C.4", "D.5"], answer: "B" },
    { q: "3*3=?", options: ["A.6", "B.7", "C.8", "D.9"], answer: "D" }
];

// ===== Load Questions from Backend (Safe Version) =====
async function loadQuestions() {
    const BASE_URL = "http://127.0.0.1:5000"; // Flask backend

    async function fetchJSON(url) {
        try {
            const res = await fetch(url);
            const text = await res.text();
            if (!text.trim().startsWith("{") && !text.trim().startsWith("[")) {
                throw new Error("Response is not JSON, maybe HTML");
            }
            return JSON.parse(text);
        } catch (err) {
            throw err;
        }
    }

    try {
        let data = await fetchJSON(`${BASE_URL}/api/questions`);
        uniqueQuestions = removeDuplicates(data);
        console.log("✅ Loaded cleaned JSON from backend");
    } catch (err1) {
        console.warn("❌ Cleaned JSON failed, trying full JSON", err1);
        try {
            let data = await fetchJSON(`${BASE_URL}/api/questions/full`);
            uniqueQuestions = removeDuplicates(data);
            console.log("✅ Loaded full JSON from backend");
        } catch (err2) {
            console.error("❌ Both JSON failed, using fallback questions", err2);
            uniqueQuestions = fallbackQuestions;
        }
    }

    unusedQuestions = [...uniqueQuestions];
    shuffle(unusedQuestions);
    nextQuestion();
}


// ===== Initialize =====
window.onload = loadQuestions;
