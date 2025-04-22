import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [answers, setAnswers] = useState({});
  const [optimizedText, setOptimizedText] = useState("");
  const [loading, setLoading] = useState(false);

  const questions = [
    {
      id: 1,
      category: "DSGVO – Art. 5: Datenminimierung",
      text: "Werden nur die Daten verarbeitet, die für den vorgesehenen Zweck erforderlich sind?",
      options: ["Ja", "Teilweise", "Nein"]
    },
    {
      id: 2,
      category: "DSGVO – Art. 22: Automatisierte Entscheidungen",
      text: "Trifft das KI-System automatisierte Entscheidungen mit rechtlicher Wirkung für Personen?",
      options: ["Ja", "Nein", "Unklar"]
    },
    {
      id: 3,
      category: "EU AI Act – Risikobewertung",
      text: "Wurde geprüft, ob es sich um ein Hochrisiko-System handelt (z. B. biometrische Erkennung, kritische Infrastrukturen)?",
      options: ["Ja", "Nein", "Noch nicht"]
    },
    {
      id: 4,
      category: "EU AI Act – Transparenz",
      text: "Wird klar und verständlich kommuniziert, dass ein KI-System verwendet wird?",
      options: ["Ja", "Teilweise", "Nein"]
    },
    {
      id: 5,
      category: "EU AI Act – Menschliche Aufsicht",
      text: "Ist eine menschliche Kontrolle des KI-Systems vorgesehen?",
      options: ["Ja", "Teilweise", "Nein"]
    }
  ];

  const handleAnswerChange = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleOptimize = async () => {
    setLoading(true);

    const prompt = `
    Bitte bewerte das folgende KI-System im Hinblick auf DSGVO- und EU AI Act-Konformität anhand der Antworten:

${questions.map(q => `Frage: ${q.text}\nAntwort: ${answers[q.id] || "Nicht beantwortet"}`).join("\n\n")}

Gib eine kurze Einschätzung und konkrete Empfehlungen.
`;

    try {
      const response = await axios.post("http://localhost:8000/analyze-ethics", {
        prompt: prompt,
      });

      setOptimizedText(response.data.result);
    } catch (error) {
      console.error("Fehler bei der Auswertung:", error);
      setOptimizedText("Ein Fehler ist aufgetreten.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="PageWrapper">

<div className="Navbar">
        <div className="Navbar-Left">
          <div className="Logo">Ethik-KI-Check</div>
          <a href="/login">Anwendungsbereiche</a>
          <a href="/login">Ethische Grundlage</a>
        </div>
        <div className="Navbar-Right">
          <a href="/login" className="Login">Log in</a>
          <a href="/login" className="TryFree">Jetzt ausprobieren</a>
        </div>
      </div>

      <div className="App">
        <h1>KI-Ethik Bewertungstool</h1>

        <p>Beantworten Sie die folgenden Fragen zur DSGVO- und EU AI Act-Konformität:</p>

        <div className="Questionnaire">
          {questions.map((q) => (
            <div key={q.id} className="Question">
              <h3>{q.category}</h3>
              <p>{q.text}</p>
              {q.options.map((option) => (
                <label key={option} className="Option">
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    value={option}
                    checked={answers[q.id] === option}
                    onChange={() => handleAnswerChange(q.id, option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          ))}
        </div>
        
        <button className="Generieren-Button" onClick={handleOptimize} disabled={loading}>
          {loading ? "Wird ausgewertet..." : "Auswertung starten"}
        </button>

        {loading && (
          <div className="ProgressBarWrapper">
            <div className="ProgressBar">
              <div className="ProgressBar-Fill" />
            </div>
          </div>
        )}

        {optimizedText && (
          <>
            <h2>Ergebnis:</h2>
            <div className="Output-Box">
              <pre>{optimizedText}</pre>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
