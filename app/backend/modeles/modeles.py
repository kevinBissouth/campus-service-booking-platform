from pydantic import BaseModel, EmailStr, Field
from datetime import date


# PYDANTIC MODELE POUR LA VALIDATION DES DONNEES

class Utilisateur(BaseModel):
    nom: str = Field(min_length=2, max_length=20)
    date_de_naissance : date
    email: EmailStr
    role : int = Field(ge=0, le=1)
    mot_de_passe : str = Field(min_length=8)
    
class Service(BaseModel):
    nom: str
    description: str = Field(min_length=10)
    est_actif : int = Field(ge=0, le=1)

class Reservation(BaseModel):
    etudiant: int
    admin: int
    email: str
    service_choisis: int
    demande: str = Field(min_length=10)
    date_souhaitee: date 
    creneau_horaire: str
    statut: str

class LoginRequest(BaseModel):
    email: str
    mot_de_passe: str
    
class EtudiantProfil(BaseModel):
    id_utilisateur: int
    filiere: str
    niveau: str
    poste_campus: str
    