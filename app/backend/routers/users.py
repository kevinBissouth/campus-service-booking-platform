from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException, APIRouter
from datetime import date
import asyncio
import bcrypt
import sqlite3 
from typing import List
from backend.database.database import get_db_connection
from backend.modeles.modeles import Utilisateur, LoginRequest, EtudiantProfil


router = APIRouter(prefix="/users", tags=["Users"])

# ============================ FONCTIONS ET ENDPOINTS POUR L'UTILISATEUR ===========================

    # =============================== FONCTIONS ==============================
# Fonction pour hasher un mot de passe
def hashe_mot_de_passe(mot_de_passe: str)-> str:
    return bcrypt.hashpw(mot_de_passe.encode(), bcrypt.gensalt()).decode()

# Fonction pour comparer le hash et un mot de passe
def verifier_mot_de_passe(mot_de_passe: str, hashed: str)-> bool:
    return bcrypt.checkpw(mot_de_passe.encode(), hashed.encode())
    

# Fonction pour recuperer le profil de lutilisateur de par sonn id
def get_profil_by_user(id_utilisateur: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT * FROM profil_etudiant
        WHERE id_utilisateur = ?
    """, (id_utilisateur,))

    row = cursor.fetchone()
    conn.close()

    return row

# Fonction pour se connceter
def login_user(email: str, password: str):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, nom, date_de_naissance, email, mot_de_passe, role
        FROM utilisateur
        WHERE email = ?
    """, (email,))

    user = cursor.fetchone()

    if not user:
        raise Exception("User not found")

    id, nom, date_de_naissance, email, hashed, role = user

    if not verifier_mot_de_passe(password, hashed):
        raise Exception("Wrong password")

    profil = get_profil_by_user(id)

    return {
        "id": id,
        "nom": nom,
        "date_de_naissance": date_de_naissance,
        "email": email,
        "role": role,
        "profil": {
            "filiere": profil[2] if profil and profil[2] else "Non défini",
            "niveau": profil[3] if profil and profil[3] else "Non défini",
            "poste_campus": profil[4] if profil and profil[4] else "Non défini"
        }
    }

# Fonction pour ajouter un utilisateur
def ajouter_utilisateur(utilisateur: Utilisateur):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        mot_de_passe_hashe = hashe_mot_de_passe(utilisateur.mot_de_passe)
        cursor.execute('''
        INSERT INTO utilisateur(nom, date_de_naissance, email, role, mot_de_passe) 
        VALUES (?, ?, ?, ?, ?)
        ''', (utilisateur.nom, utilisateur.date_de_naissance.isoformat(), utilisateur.email, utilisateur.role, mot_de_passe_hashe))
        conn.commit()
        
        user_id = cursor.lastrowid

        # 2. créer profil VIDE automatiquement
        cursor.execute("""
            INSERT INTO profil_etudiant (id_utilisateur, filiere, niveau, poste_campus)
            VALUES (?, '', '', '')
        """, (user_id,))

        conn.commit()
    except sqlite3.IntegrityError as e:
        conn.rollback()
        return {"error": "Email deja utilise"}
    finally:
        conn.close()

# Fonction pour récupérer tous les utilisateurs
def recuperer_tous_les_utilisateursF():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM utilisateur')
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

# Fonction pour récupérer un utilisateur par ID
def recuperer_utilisateur_par_idF(utilisateur_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM utilisateur WHERE id = ?', (utilisateur_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

# Fonction pour mettre à jour un utilisateur
def modifier_utilisateur(utilisateur_id: int, utilisateur: Utilisateur):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
    UPDATE utilisateur SET nom = ?, date_de_naissance = ?, email = ?, role = ?, mot_de_passe = ? WHERE id = ?
    ''', (utilisateur.nom, utilisateur.date_de_naissance.isoformat(), utilisateur.email, utilisateur.role, utilisateur.mot_de_passe, utilisateur_id))
    conn.commit()
    conn.close()

# Fonction pour supprimer un utilisateur
def supprimer_utilisateur(utilisateur_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM utilisateur WHERE id = ?', (utilisateur_id,))
    conn.commit()
    conn.close()


# Fonction pour ajouter un profil
def create_profil(profil: EtudiantProfil):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO profil_etudiant (id_utilisateur, filiere, niveau, poste_campus)
        VALUES (?, ?, ?, ?)
    """, (
        profil.id_utilisateur,
        profil.filiere,
        profil.niveau,
        profil.poste_campus
    ))

    conn.commit()
    conn.close()

    return {"message": "Profil créé avec succès"}

# Fonction pour modifier un profil
def update_profil(profil: EtudiantProfil):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE profil_etudiant
        SET filiere = ?, niveau = ?, poste_campus = ?
        WHERE id_utilisateur = ?
    """, (
        profil.filiere,
        profil.niveau,
        profil.poste_campus,
        profil.id_utilisateur
    ))

    conn.commit()
    conn.close()

    return {"message": "Profil mis à jour"}

# Fonction pour obtenir le profil de l'utilisateur
def get_profil_by_user(id_utilisateur: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, id_utilisateur, filiere, niveau, poste_campus
        FROM profil_etudiant
        WHERE id_utilisateur = ?
    """, (id_utilisateur,))

    row = cursor.fetchone()
    conn.close()

    return row

    # =============================== ENDPOINTS ==============================
    
# Route pour lire un profil
@router.get("/profil/{id_utilisateur}")
async def get_profile(id_utilisateur: int):
    profil = get_profil_by_user(id_utilisateur)

    if not profil:
        raise HTTPException(status_code=404, detail="Profil introuvable")

    return profil


# Route pour ajouter un profil
@router.post("/profil/")
async def create_profile(profil: EtudiantProfil):
    return create_profil(profil)


# Route pour mettre ajours un profil
@router.put("/profil/")
async def update_profile(profil: EtudiantProfil):
    return update_profil(profil)


# Route pour ajouter un utilisateur
@router.post("/add_user/")
async def creer_utilisateur(utilisateur: Utilisateur):
    message = ajouter_utilisateur(utilisateur)
    if not message:
        return {"message": "Utilisateur ajouté avec succès."}
    return message

# Route pour obtenir tous les utilisateurs
@router.get("/get_all_users/", response_model=List[Utilisateur])
async def recuperer_tous_les_utilisateurs():
    loop = asyncio.get_running_loop()
    utilisateurs = await loop.run_in_executor(None, recuperer_tous_les_utilisateursF)
    if utilisateurs is None:
        raise HTTPException(status_code=404, detail="Aucun Utilisateur")
    return utilisateurs
    

# Route pour obtenir un utilisateur par ID
@router.get("/get_user_by_id/{utilisateur_id}", response_model=Utilisateur)
async def rucuperer_utilisateur_par_id(utilisateur_id: int):
    utilisateur = recuperer_utilisateur_par_idF(utilisateur_id)
    if utilisateur is None:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    return utilisateur

# Route pour mettre à jour un utilisateur
@router.put("/update_user/{utilisateur_id}", response_model=Utilisateur)
async def modifier_utilisateur_data(utilisateur_id: int, utilisateur: Utilisateur):
    utilisateur_existant = recuperer_utilisateur_par_idF(utilisateur_id)
    if utilisateur_existant is None:
        raise HTTPException(status_code=404, detail="utilisateur non trouvé")
    modifier_utilisateur(utilisateur_id, utilisateur)
    return utilisateur

# Route pour supprimer un utilisateur
@router.delete("/delete_user/{utilisateur_id}")
async def supprimer_utilisateur_data(utilisateur_id: int):
    utilisateur_existant = recuperer_utilisateur_par_idF(utilisateur_id)
    if utilisateur_existant is None:
        raise HTTPException(status_code=404, detail="utilisateur non trouvé")
    supprimer_utilisateur(utilisateur_id)
    return {"message": "utilisateur supprimé avec succès."}

# Route pour connecter un utilisateur
@router.post("/login/")
async def login(data: LoginRequest):
    try:
        return login_user(data.email, data.mot_de_passe)
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
# ================================================================================================================