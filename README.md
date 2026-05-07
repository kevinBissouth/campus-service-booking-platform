# campus-service-booking-platform
A platform for managing service bookings on a campus, built with a frontend (React, React Router, Axios, Tailwind CSS) and a backend (FastAPI with Python).

============================================================================================

— LE TITRE DU PROJET : 
    Campus Service Booking Platform.


============================================================================================

— LE DOMAINE CHOISI : 
    Développement Web + API.


============================================================================================

— LE PROBLÈME TRAITÉ : 
    mettre en place une plateforme permettant aux étudiants de réserver certains services internes dans un campus.

============================================================================================

— LES OUTILS UTILISÉS :
    **outils de développement**:
        — Visual Studio Code : Éditeur de code léger et puissant.Il est utilisé ici pour développer, organiser et déboguer l'application.
        — Node.js : Environnement d'exécution JavaScript coter serveur.Il est utilisé ici pour gérer les dépendances et exécuter les outils du frontend (React).
        — Python 3.10 : Langage de programmation polyvalent.Il est utilisé ici pour développer la logique backend et les API.
        — Git : Système de gestion de versions distribué.Il est utilisé ici pour suivre les modifications et gérer l'historique du projet.
        — GitHub: Plateforme d'hébergement de code basée sur Git. Il est utilisé ici pour stocker le projet.
        — Postman : Outil de test d'API.Il est utilisé ici pour tester et valider les endpoints backend.

    **Technologies utilisées**:
        *frontend:
            -React : Bibliothèque de gestion de navigation coté client.Il est utilisé ici pour construire une interface dynamique basée sur des composants.
            -React Router : Bibliothèque de gestion de navigation coté client.Il est utilisé ici pour créer des pages et gérer les routes dans l'application.
            -Axios : Client HTTP basé sur les promesses.Il est utilisé ici pour envoyer des requetes au backend et récupérer les données. 
            -Tailwind CSS : Framework CSS utilitaire.Il est utilisé ici pour concevoir rapidement une interface moderne et responsive.
        *backend:
            -FastAPI ( avec python) : Framework web moderne pour python.Il est utilisé ici pour créer des API REST rapides et gérer la logique métier.
        *base de données:
            -SQlite3 : Système de gestion de base de données relationnelle léger.Il est utilisé ici pour stocker et récupérer les données de l'application.

============================================================================================

— LES INSTRUCTIONS D'INSTALLATION :
    **outils de développement**
        - Visual Studio Code : Télécharger et installer depuis le site officiel " https://code.visualstudio.com/ "
        - Node.js : Télécharger et installer depuis le site officiel " https://nodejs.org/ "
        - Python 3.10 : Télécharger et installer depuis le site officiel " https://www.python.org/ "
        - Git : Télécharger et installer depuis le site officiel " https://git-scm.com/ "
        - GitHub : Créer un compte et accéder via le lien " https://github.com/ "
        - Postman : Télécharger et installer depuis le site officiel " https://www-postman.com/ "

    **Technologies utilisées**:
        *frontend:
            - React : Télécharger et installer depuis le site officiel " https://react.dev/ "
            - React Router : installer via npm avec la commande " npm install react-router-dom "
            - Axios : installer via npm avec la commande " npm install axios "
            - Tailwind css : Télécharger et installer depuis le site officiel " https://tailwindcss.com/ "
        *backend:
            - FastAPI (avec python) : installer via la commande " pip install fastapi uvicorn "
        *base de données:
            - SQLite3 : intégrer dans python, documentation officiel via le lien " https://wwww.sqlite.org/ "
    

============================================================================================

— LES INSTRUCTIONS POUR LANCER LE PROJET :
    - .pour lancer la partie backend (l'API):
        aller dans le dossier app/
        taper dans le terminal : uvicorn backend.main:app --reload

    - pour lancer la partie frontend :
        aller dans le dossier app/frontend/campus-service-booking-platform/
        taper dans le terminal : npm run dev

============================================================================================

— LES FONCTIONNALITÉS REALISÉES : 

    1. Authentification Utilisateur :
        - Système de registre sécurisé avec hashage de mot de passe (bcrypt)
        - Formulaire de connexion avec validation des identifiants
        - Gestion de session avec localStorage
        - Routes protégées (redirection vers login automatique si non authentifié)

    2. Gestion des Services :
        - Affichage dynamique de tous les services disponibles
        - Récupération des services via API REST (`GET /services`)
        - Détails de chaque service (nom, description, statut)
        - Sélection de service dans le formulaire de réservation

    3. Système de Réservation :
        - Création de réservation avec sélection de service, date et créneau horaire
        - Validation des données (date minimale, cohérence des horaires)
        - Stockage en base de données SQLite
        - Statut de réservation (pending, accepted, rejected)

    4. Dashboard Utilisateur :
        - Affichage des réservations filtrées par utilisateur
        - Statistiques (réservations en attente, acceptées, rejetées)
        - Pagination des réservations (6 par page)
        - Recherche et filtrage des réservations
        - Option pour annuler une réservation

    5. Interface Utilisateur Moderne :
        - Design responsive avec Tailwind CSS
        - Navigation intuitive avec Sidebar et Topbar
        - Modal pour ajouter une réservation
        - Toast notifications pour les actions utilisateur
        - Support pour les écrans mobiles et desktop

    6. API REST Normalisée :
        - Routes REST conformes aux standards (GET/POST/PUT/DELETE)
        - Endpoints clairs et cohérents (ex: `/services`, `/bookings`)
        - Gestion des erreurs HTTP appropriées
        - Endpoint de profil utilisateur

============================================================================================

— LES DIFFICULTÉS RENCONTRÉES : 

    1. Gestion des Routes API :
        - Problème initial : routes non normalisées et incohérentes (ex: `/get_all_services/`, `/add_reservation/`)
        - Solution : refactorisation complète vers une architecture REST standard
        - Impact : correction du bug de suppression de réservation qui appelait la mauvaise fonction

    2. Synchronisation Frontend-Backend :
        - Problème : les URLs d'API du frontend ne correspondaient pas toujours à celles du backend
        - Solution : audit complet du codebase et mise à jour coordonnée de tous les appels API
        - Défi : assurer la cohérence entre 3 composants frontend et le backend

    3. Validation des Données :
        - Problème : validation insuffisante des dates et horaires côté frontend
        - Solution : ajout de validations strictes (date minimale = aujourd'hui, cohérence début/fin)
        - Résultat : prévention des réservations invalides côté client avant envoi au backend

    4. Base de Données :
        - Problème : besoin de créer/initialiser les tables SQLite au démarrage
        - Solution : fonction `create_table()` appelée automatiquement au lancement de l'app
        - Note : gestion des dates ISO format pour compatibilité Python-SQLite

    5. Typage et Modèles :
        - Problème : Pydantic models doivent être cohérents entre frontend et backend
        - Solution : documentation claire des attributs et typage strict
        - Défi : gestion des types nullable (admin peut être None -> 0)

    6. Authentification et Sécurité :
        - Problème : besoin de crypter les mots de passe en base de données
        - Solution : utilisation de bcrypt pour hachage sécurisé
        - Note : limitation actuelle - pas de JWT tokens, juste localStorage

    6. Realisation du Frontend :
        - Problème : Realiser les differentes pages (nouvelle technologie et difficile a apprendre)
        - Solution : Faire des recherche et parcourir la documentation officiel( React.dev )
        - Note : limitation actuelle - Pas de maitrise de la technologie
            

============================================================================================

— DOCUMENTATION DES ROUTES API :
    **les routes API pour l'utilisateur**
        - POST /add_user/ : cette route permet d'enregistrer un Utilisateur. Elle prend en entrer un Utilisateur: 
            attributs :
                    nom: str
                    date_de_naissance: date (YYYY-MM-DD)
                    email
                    role: int (1 pour etudiant et 0 pour administration)
                    mot_de_passe: str (pas moins de 8 caracteres)

        - GET /get_all_users/ : cette route permet de recuperer tous les utilisateurs.

        - GET /get_user_by_id/{utilisateur_id} : cette route permet de recuperer un utilisateur en entrant son id. 

        - DELETE /delete_user/{utilisateur_id} : cette route permet de supprimer un utilisateur en entrant son id.

        - PUT /update_user/ : cette route permet de modifier un utilisateur. Elle prend en entrer un Utilisateur exactement comme la route POST /add_user/.

        - POST /login/ : cette route permet de connecter un utilisateur. Elle prend en entrer un LoginRequest:
            attribut:
                email: str
                mot_de_passe: str

    **les routes API pour les sevices**
        - POST /add_service/ : cette route permet d'enregistrer un service. Elle prend en entrer un service: 
            attributs :
                    nom: str
                    description: str
                    est_actif: int ( 1 pour disponible et 0 pour l'inverse)

        - GET /services : cette route permet de recuperer tous les services.

        - GET /services/{id} : cette route permet de recuperer un service en entrant son id. 

        - DELETE /delete_service/{service_id} : cette route permet de supprimer un service en entrant son id.

        - PUT /update_service/{service_id} : cette route permet de modifier un service. Elle prend en entrer un service exactement comme la route POST /add_service/.

    **les routes API pour les reservaions**
        - POST /bookings : cette route permet d'enregistrer une reservation. Elle prend en entrer un objet de type Reservation: 
            attributs :
                etudiant: int (id de l'etudiant)
                admin: int  (id de l'administration)
                email (l'email de l'etudiant)
                service_choisis: int (id du service)
                demande: str 
                date_souhaitee: date
                creneau_horaire: str
                statut: str 

        - GET /services : cette route permet de recuperer tous les services.

        - GET /bookings : cette route permet de recuperer toutes les reservations.

        - GET /bookings/{id} : cette route permet de recuperer une reservation en entrant son id. 

        - DELETE /bookings/{id} : cette route permet de supprimer une reservation en entrant son id.

        - PUT /update_reservation/{reservation_id} : cette route permet de modifier une reservation. Elle prend en entrer un objet de type Reservation exactement comme la route POST /bookings.
============================================================================================

— LES CAPTURES D'ÉCRAN :

    1. Landing Page - Page d'accueil avec présentation du projet
    2. Formulaire d'inscription - Interface pour créer un compte utilisateur
    3. Formulaire de connexion - Page de login sécurisée
    4. Dashboard - Vue principale avec statistiques des réservations
    5. Création de réservation (sélection du service) - Modale d'ajout de réservation
    6. Formulaire complet d'ajout de réservation - Tous les champs de réservation
    7. Détails d'une réservation - Informations détaillées d'une réservation
    8. Profil utilisateur - Informations et paramètres de l'utilisateur
    9. Formulaire de modification du profil - Édition des données utilisateur

    Les screenshots sont disponibles dans le dossier `/screenshots` du projet.

============================================================================================

— LES AMÉLIORATIONS POSSIBLES : 

    1. Authentification et Sécurité :
        - Implémenter JWT (JSON Web Tokens) à la place de localStorage
        - Ajouter une authentification à deux facteurs (2FA)
        - Implémenter le refresh token pour les sessions longues
        - Ajouter une limite de tentatives de connexion échouées

    2. Fonctionnalités Avancées :
        - Système de notifications en temps réel (WebSocket)
        - Historique des réservations avec exportation en PDF
        - Système de rappel par email des réservations
        - Gestion des réclamations/feedback pour les services
        - Calendrier interactif pour visualiser les disponibilités

    3. Expérience Utilisateur :
        - Interface d'administration pour gérer services et réservations
        - Graphiques/charts pour les statistiques
        - Mode sombre/clair
        - Multilingue (français, anglais, etc.)
        - Accessibilité améliorée (WCAG compliance)

    4. Performance et Infrastructure :
        - Migration de SQLite vers PostgreSQL ou MySQL pour production
        - Mise en cache (Redis) pour les services fréquemment consultés
        - Algorithme d'optimisation des créneaux horaires
        - CDN pour les assets front-end
        - Pagination côté serveur pour les grandes listes

    5. Tests et Qualité :
        - Tests unitaires complets (Jest pour React, pytest pour FastAPI)
        - Tests d'intégration
        - Tests E2E (Cypress ou Selenium)
        - Code coverage à 80%+
        - Documentation API automatique (Swagger)

    6. Déploiement et DevOps :
        - Containerisation avec Docker
        - CI/CD pipeline (GitHub Actions ou GitLab CI)
        - Monitoring et logging centralisé
        - Backup automatique de la base de données
        - Déploiement sur serveur de production (AWS, Heroku, Railway)

============================================================================================

— CE QUE L'ÉTUDIANT A APPRIS : 

    1. Développement Web Full-Stack :
        - Architecture client-serveur
        - Séparation des préoccupations (frontend vs backend)
        - Communication via API REST
        - Gestion des états et props en React

    2. Backend et APIs :
        - Framework FastAPI et ses concepts (dependencies, security)
        - Design REST : utilisation appropriée des méthodes HTTP (GET, POST, PUT, DELETE)
        - Gestion des bases de données relationnelles
        - Validation des données avec Pydantic
        - Gestion des erreurs HTTP et status codes

    3. Frontend et UX :
        - Composants React réutilisables
        - Hooks React (useState, useEffect, useContext)
        - Gestion des appels API avec Axios
        - Design responsive avec Tailwind CSS
        - Validation côté client
        - UX/UI best practices

    4. Gestion de Base de Données :
        - SQL basique (SELECT, INSERT, UPDATE, DELETE)
        - Schémas de base de données et relations
        - Pagination et filtrage
        - Optimisation des requêtes

    5. Sécurité :
        - Hashage des mots de passe avec bcrypt
        - Validation  des inputs
        

    6. Version Control et Collaboration :
        - Git et GitHub
        - Commits signifiants
        - Documentation du code

    7. Outils et Environnements :
        - NPM et gestion des dépendances JavaScript
        - pip et environnements virtuels Python
        - Visual Studio Code et debugging
        - Postman pour tester les APIs
        - Node.js et uvicorn

    8. Refactoring et Maintenance :
        - Importance de la cohérence des conventions
        - Refactorisation pour améliorer la qualité du code
        - Documentation API
        

============================================================================================
