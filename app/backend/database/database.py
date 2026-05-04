import sqlite3
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent
BASE_DIR.mkdir(parents=True, exist_ok=True)

DATABASE = BASE_DIR / "service_booking.db"


def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    
    # POUR RECUPERER LES RESULTATS SOUS FORME DE DICTIONNAIRE
    conn.row_factory = sqlite3.Row
    return conn

def create_table():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(''' CREATE TABLE IF NOT EXISTS utilisateur(id INTEGER PRIMARY KEY AUTOINCREMENT,
                        nom TEXT NOT NULL,
                        date_de_naissance TEXT NOT NULL,
                        email TEXT NOT NULL UNIQUE,
                        role INTEGER NOT NULL DEFAULT 1,
                        mot_de_passe TEXT NOT NULL) ''')
    conn.commit()
    
    cursor.execute(''' CREATE TABLE IF NOT EXISTS service(id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nom TEXT NOT NULL,
                    description TEXT NOT NULL,
                    est_actif INTEGER NOT NULL DEFAULT 1) ''')
    conn.commit()
    
    cursor.execute(''' CREATE TABLE IF NOT EXISTS reservation(id INTEGER PRIMARY KEY AUTOINCREMENT,
                    etudiant INTEGER NOT NULL,
                    admin INTEGER NOT NULL,
                    email TEXT NOT NULL,
                    service_choisis INTEGER NOT NULL,
                    demande TEXT NOT NULL,
                    date_souhaitee TEXT NOT NULL,
                    creneau_horaire TEXT NOT NULL,
                    statut TEXT NOT NULL,
                    FOREIGN KEY (etudiant) REFERENCES utilisateur(id),
                    FOREIGN KEY (admin) REFERENCES utilisateur(id),
                    FOREIGN KEY (service_choisis) REFERENCES service(id))''')
    
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS profil_etudiant (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_utilisateur INTEGER UNIQUE,
            filiere TEXT NOT NULL,
            niveau TEXT NOT NULL,
            poste_campus TEXT,

            FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id) ON DELETE CASCADE)""")
    
    conn.commit()
    conn.close()
