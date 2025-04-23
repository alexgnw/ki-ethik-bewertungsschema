import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [answers, setAnswers] = useState({});
  const [optimizedText, setOptimizedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [ampel, setAmpel] = useState(null);

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
      category: "DSGVO – Art. 5 Abs.2 & EU AI Act: Rechenschaftspflicht",
      text: "Ist klar geregelt, wer für den KI-Einsatz verantwortlich ist (inkl. Dokumentation)",
      options: ["Ja", "Nein", "Unklar"]
    },
    {
      id: 4,
      category: "EU AI Act – Risikobewertung",
      text: "Wurde geprüft, ob es sich um ein Hochrisiko-System handelt (z. B. biometrische Erkennung, kritische Infrastrukturen)?",
      options: ["Ja", "Nein", "Noch nicht"]
    },
    {
      id: 5,
      category: "EU AI Act – Transparenz",
      text: "Wird klar und verständlich kommuniziert, dass ein KI-System verwendet wird?",
      options: ["Ja", "Teilweise", "Nein"]
    },
    {
      id: 6,
      category: "DSGVO – Art. 13/14: Datenverarbeitung",
      text: "Wurden die Betroffenen über die Datenverarbeitung informiert?",
      options: ["Ja", "Teilweise", "Nein"]
    },
    {
      id: 7,
      category: "Europakommission – Nachvollziehbarkeit",
      text: "Können Entscheidungen des Systems für Dritte nachvollzogen werden?",
      options: ["Ja", "Teilweise", "Nein"]
    },
    {
      id: 8,
      category: "EU AI Act – Menschliche Aufsicht",
      text: "Ist eine menschliche Kontrolle des KI-Systems vorgesehen?",
      options: ["Ja", "Teilweise", "Nein"]
    },  
    {
      id: 9,
      category: "EU AI Act – Diskriminierung & Bias",
      text: "Wurden potenzielle Diskriminierungsrisiken identifiziert (z. B. durch Bias-Analysen)?",
      options: ["Ja", "Teilweise", "Nein"]
    },
    {
      id: 10,
      category: "DSGVO – Art. 32: Stand der Technik",
      text: "Wird das System nach dem Stand der Technik technisch und organisatorisch abgesichert?",
      options: ["Ja", "Teilweise", "Nein"]
    },
    {
      id: 11,
      category: "EU AI Act – Dokumentationspflicht",
      text: "Liegt eine technische Dokumentation mit Angaben zur Funktionsweise, Datenquellen und Trainingsmethoden vor?",
      options: ["Ja", "Teilweise", "Nein"]
    }
  ];

  const detectAmpelFromText = (text) => {
    if (text.includes("🟢")) return "green";
    if (text.includes("🟡")) return "yellow";
    if (text.includes("🔴")) return "red";
    return null;
  };

  const handleAnswerChange = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleOptimize = async () => {
    setLoading(true);

    const prompt = `
    Bitte bewerte das folgende KI-System im Hinblick auf DSGVO- und EU AI Act-Konformität anhand der Antworten:

${questions.map(q => `Frage: ${q.text}\nAntwort: ${answers[q.id] || "Nicht beantwortet"}`).join("\n\n")}

Gib eine kurze Einschätzung und konkrete Empfehlungen.

Verwende zusätzlich eine Gesamtbewertung in Form eines Ampelsystems:
- 🟢 für konform
- 🟡 für teilweise erfüllt
- 🔴 für kritisch

Wichtig: Gib die **Gesamtbewertung nur einmal ganz am Anfang** der Antwort an – verwende keine weiteren Ampel-Emojis im Text oder bei den Empfehlungen.
`;

    try {
      const response = await axios.post("http://localhost:8000/analyze-ethics", {
        prompt: prompt,
      });


      const resultText = response.data.result;
      setAmpel(detectAmpelFromText(resultText));
      setOptimizedText(resultText);

      setOptimizedText(response.data.result);
    } catch (error) {
      console.error("Fehler bei der Auswertung:", error);
      setOptimizedText("Ein Fehler ist aufgetreten.");
      setAmpel(null); // Zurücksetzen im Fehlerfall
    } finally {
      setLoading(false);
    }
  };


  //Output lesbarer formatieren
  const formatOutput = (text) => {
    return text
      .replace(/Einschätzung:/g, "<h3><strong>Einschätzung:</strong></h3>")
      .replace(/Empfehlungen:/g, "<h3><strong>Empfehlungen:</strong></h3>")
      .replace(/(\\d+\\.\\s)/g, "<p><strong>$1</strong>") // optional für nummerierte Listen
      .replace(/\\n/g, "<br>"); // Zeilenumbrüche beibehalten
  };


  return (
    <div className="PageWrapper">

<div className="Navbar">
        <div className="Navbar-Left">
          <div className="Logo">
            <span role="img" aria-label="waage" className="Logo-Icon">⚖️</span> Ethik-KI-Check
          </div>
          <a href="/login">Anwendungsbereiche</a>
          <a href="/login">Rechtsgrundlage</a>
        </div>
        <div className="Navbar-Right">
          <a href="/login" className="Login">Hilfe</a>
          <a href="/login" className="TryFree">Über das Projekt</a>
        </div>
      </div>

      <div className="App">
      <h1 className="HeroHeadline">
      KI-Systeme <span className="AccentLegal">rechtssicher</span><br />
      und <span className="AccentEthical">ethisch</span> bewerten
      </h1>

        <p>Beantworten Sie die folgenden Fragen zur DSGVO- und EU AI Act-Konformität, um eine fundierte Einschätzung über die ethische und rechtliche Verträglichkeit Ihres KI-Systems zu erhalten.<br></br>
        Unser Tool unterstützt öffentliche Einrichtungen dabei, Verantwortung und Transparenz<br></br>beim Einsatz künstlicher Intelligenz sicherzustellen.</p>

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

        {ampel && (
          <>
          <h2>Ergebnis:</h2>
          <div className="AmpelWrapper">
            <div className={`AmpelCircle ${ampel === "red" ? "active" : ""} red`} />
            <div className={`AmpelCircle ${ampel === "yellow" ? "active" : ""} yellow`} />
            <div className={`AmpelCircle ${ampel === "green" ? "active" : ""} green`} />
          </div>
          </>
        )}

        {optimizedText && (
          <>
            <div className="Output-Box">
              <div dangerouslySetInnerHTML={{ __html: formatOutput(optimizedText) }} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
