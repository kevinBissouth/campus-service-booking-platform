from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from backend.routers import users, bookings
from backend.database.database import create_table

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # On laisse "*" pour être sûr que ça passe
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(bookings.router)
create_table()
