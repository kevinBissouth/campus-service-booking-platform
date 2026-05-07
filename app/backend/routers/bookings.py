from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException, APIRouter
from datetime import date
import asyncio
import bcrypt
import sqlite3 
from typing import List
from backend.database.database import get_db_connection
from backend.modeles.modeles import Service, Reservation


router = APIRouter(tags=["bookings"])

# ============================ FONCTIONS ET ENDPOINTS POUR LES SERVICES ===========================

    # =============================== FONCTIONS ==============================
# Fonction pour ajouter le service
def ajouter_service(service: Service):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(''' INSERT INTO service (nom, description, est_actif) 
                        VALUES (?, ?, ?)''', (service.nom,service.description, service.est_actif))
        conn.commit()
    except sqlite3.Error as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Erreur SQLite: {e}")
    finally:
        conn.close()
        
        
# Fonction pour recuperer tous les services        
def recuperer_tous_les_servicesF():
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM service")
        rows = cursor.fetchall()
        return [dict(row) for row in rows]
    except sqlite3.Error as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Erreur SQLite: {e}")
    finally:
        conn.close()


# Fonction pour récupérer un service par ID
def recuperer_service_par_idF(service_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('SELECT * FROM service WHERE id = ?', (service_id,))
        row = cursor.fetchone()
        return dict(row) if row else None
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Erreur SQLite: {e}")
    finally:
        conn.close()


# Fonction pour mettre a jour un service
def modifier_service(service_id: int, service: Service):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('''
        UPDATE service SET nom = ?, description = ?, est_actif = ? WHERE id = ?
        ''', (service.nom, service.description, service.est_actif, service_id))
        conn.commit()
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Erreur SQLite: {e}")
    finally:
        conn.close()
    

# Fonction pour supprimer un Service
def supprimer_service(service_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('DELETE FROM service WHERE id = ?', (service_id,))
        conn.commit()
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Erreur SQLite: {e}")
    finally:
        conn.close()
    

    # ============================== ENDPOINTS =============================
# Route pour supprimer un Service
@router.delete("/delete_service/{service_id}")
async def supprimer_service_data(service_id: int):
    service_existant = recuperer_service_par_idF(service_id)
    if service_existant is None:
        raise HTTPException(status_code=404, detail="service non trouvé")
    supprimer_service(service_id)
    return {"message": "service supprimé avec succès."}


# Route mettre a jour un Service
@router.put("/update_service/{service_id}", response_model=Service)
async def modifier_service_data(service_id: int, service: Service):
    service_existant = recuperer_service_par_idF(service_id)
    if service_existant is None:
        raise HTTPException(status_code=404, detail="service non trouvé")
    modifier_service(service_id, service)
    return service

# Route pour recuperer un service par id
@router.get("/services/{id}", response_model=Service)
async def rucuperer_service_par_id(id: int):
    service = recuperer_service_par_idF(id)
    if service is None:
        raise HTTPException(status_code=404, detail="service non trouvé")
    return service


# Route pour ajouter un service
@router.post("/add_service/")
async def creer_service(service: Service):
    message = ajouter_service(service)
    if not message:
        return {"message": "service ajouté avec succès."}
    return message


# Route pour obtenir tous les Services
@router.get("/services", response_model=List[Service])
async def recuperer_tous_les_services():
    loop = asyncio.get_running_loop()
    services = await loop.run_in_executor(None, recuperer_tous_les_servicesF)
    if services is None:
        raise HTTPException(status_code=404, detail="Aucun service")
    return services
# ===================================================================================================



# ============================ FONCTIONS ET ENDPOINTS POUR LES RESERVATIONS ===========================
    # =============================== FONCTIONS ==============================
def ajouter_reservation(reservation: Reservation):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        if reservation.admin is None:
            reservation.admin = 0

        date_souhaitee = reservation.date_souhaitee
        if hasattr(date_souhaitee, "isoformat"):
            date_souhaitee = date_souhaitee.isoformat()

        cursor.execute('''
        INSERT INTO reservation(etudiant, admin, email, service_choisis, demande, date_souhaitee, creneau_horaire, statut) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (reservation.etudiant, reservation.admin, reservation.email, reservation.service_choisis, reservation.demande, date_souhaitee, reservation.creneau_horaire, reservation.statut))
        conn.commit()
    except Exception as e:
        conn.rollback()
        return {"error": f"{e}"}
    finally:
        conn.close()


# Fonction pour recuperer toutes les reservations     
def recuperer_toutes_les_reservationF():
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM reservation")
        rows = cursor.fetchall()
        return [dict(row) for row in rows]
    except sqlite3.Error as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Erreur SQLite: {e}")
    finally:
        conn.close()


# Fonction pour récupérer une reservation par ID
def recuperer_reservation_par_idF(reservation_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('SELECT * FROM reservation WHERE id = ?', (reservation_id,))
        row = cursor.fetchone()
        return dict(row) if row else None
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Erreur SQLite: {e}")
    finally:
        conn.close()
        

# Fonction pour mettre a jour une reservation
def modifier_reservation(reservation_id: int, reservation: Reservation):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('''
        UPDATE reservation SET etudiant = ?, admin = ?, email = ?, service_choisis = ?, demande = ?, date_souhaitee = ?, creneau_horaire = ?, statut = ? WHERE id = ?
        ''', (reservation.etudiant, reservation.admin, reservation.email, reservation.service_choisis, reservation.demande, reservation.date_souhaitee, reservation.creneau_horaire, reservation.statut, reservation_id))
        conn.commit()
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Erreur SQLite: {e}")
    finally:
        conn.close()
        

# Fonction pour supprimer une reservation
def supprimer_reservation(reservation_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('DELETE FROM reservation WHERE id = ?', (reservation_id,))
        conn.commit()
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Erreur SQLite: {e}")
    finally:
        conn.close()


    # ============================== ENDPOINTS =============================
# Route pour supprimer une reservation
@router.delete("/bookings/{id}")
async def supprimer_reservation_data(id: int):
    reservation_existant = recuperer_reservation_par_idF(id)
    if reservation_existant is None:
        raise HTTPException(status_code=404, detail="reservation non trouvé")
    supprimer_reservation(id)
    return {"message": "reservation supprimé avec succès."}


# Route mettre a jour une reservation
@router.put("/update_reservation/{reservation_id}", response_model=Reservation)
async def modifier_reservation_data(reservation_id: int, reservation: Reservation):
    reservation_existant = recuperer_reservation_par_idF(reservation_id)
    if reservation_existant is None:
        raise HTTPException(status_code=404, detail="reservation non trouvé")
    modifier_reservation(reservation_id, reservation)
    return reservation


# Route pour recuperer une reservation par id
@router.get("/bookings/{id}", response_model=Reservation)
async def rucuperer_reservation_par_id(id: int):
    service = recuperer_reservation_par_idF(id)
    if service is None:
        raise HTTPException(status_code=404, detail="reservation non trouvé")
    return service


# Route pour obtenir toutes les reservations
@router.get("/bookings", response_model=List[Reservation])
async def recuperer_tous_les_reservation():
    loop = asyncio.get_running_loop()
    reservations = await loop.run_in_executor(None, recuperer_toutes_les_reservationF)
    if reservations is None:
        raise HTTPException(status_code=404, detail="Aucune reservation")
    return reservations


# Route pour ajouter une reservation
@router.post("/bookings")
async def creer_reservation(reservation: Reservation):
    # Set default admin to 0 if not provided
    if reservation.admin is None:
        reservation.admin = 0
    message = ajouter_reservation(reservation)
    if not message:
        return {"message": "reservation ajoutée avec succès."}
    return message

