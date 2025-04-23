from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
import os

app = FastAPI()

# CORS aktivieren – erlaubt Zugriff vom Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # für lokale Entwicklung, in Produktion besser einschränken
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OpenAI API-Client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.post("/analyze-ethics")
async def analyze_ethics(request: Request):
    data = await request.json()
    prompt = data.get("prompt", "")

    if not prompt:
        return {"result": "Kein Prompt empfangen."}

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": (
                    "Du bist ein KI-Ethikexperte. Analysiere die DSGVO- und EU AI Act-Konformität eines Systems auf Basis der gegebenen Antworten. "
                    "Gib eine kurze Einschätzung und konkrete Empfehlungen."
                )
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.4,
        max_tokens=1000
    )

    return {"result": response.choices[0].message.content}
