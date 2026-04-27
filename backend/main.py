from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # On laisse "*" pour être sûr que ça passe
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Vérifie bien que tu as "/api/welcome" ici
@app.get("/api/welcome")
def get_welcome():
    return {"text": "Bienvenue sur l'API Campus !"}

@app.get("/api/goodbye")
def get_goodbye():
    return {"text": "Au revoir et à bientôt !"}
