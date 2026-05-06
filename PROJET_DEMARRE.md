# ✅ Projet Alzheimer System - Démarré

## 🎉 Tous les Services sont Opérationnels!

### Backend Docker (5 services)

| Service | Port | Statut | URL |
|---------|------|--------|-----|
| **Discovery Server (Eureka)** | 8761 | ✅ Healthy | http://localhost:8761 |
| **API Gateway** | 8090 | ✅ Running | http://localhost:8090 |
| **Assistance Quotidienne** | 8098 | ✅ Running | http://localhost:8098 |
| **RabbitMQ** | 5672, 15672 | ✅ Running | http://localhost:15672 |
| **MySQL** | 3307→3306 | ✅ Healthy | (interne Docker ; accès hôte : `localhost:3307`) |

### Frontend Angular

| Service | Port | Statut | URL |
|---------|------|--------|-----|
| **Angular Dev Server** | 4200 | ✅ Running | http://localhost:4200 |

### Base de Données

| Service | Port | Statut | URL |
|---------|------|--------|-----|
| **MySQL** | 3307 (hôte) | ✅ | Base `assistancequotidiennedb` (conteneur `mysql-assistance`) |

---

## 🌐 URLs Principales

### Frontend
- **Application principale**: http://localhost:4200
- **Dashboard Admin**: http://localhost:4200/admin/manage-users
- **Dashboard Soignant**: http://localhost:4200/soignant-dashboard
- **Dashboard Médecin**: http://localhost:4200/doctor-dashboard
- **Dashboard Aidant**: http://localhost:4200/aidant-dashboard

### Backend
- **API Gateway**: http://localhost:8090/api
- **Assistance Quotidienne**: http://localhost:8098/api
- **Eureka Dashboard**: http://localhost:8761
- **RabbitMQ Management**: http://localhost:15672 (guest/guest)

### Base de Données
- **MySQL (Docker)** : `localhost:3307`, utilisateur `root`, mot de passe vide
- **Base de données**: `assistancequotidiennedb`

---

## 📊 Statut des Services

### ✅ Services Démarrés
1. Discovery Server (Eureka) - Port 8761
2. API Gateway - Port 8090
3. Assistance Quotidienne - Port 8098
4. RabbitMQ - Ports 5672, 15672
5. MySQL - Port 3307 (hôte) / 3306 (réseau Docker)
6. Angular Dev Server - Port 4200

### 🔧 Configuration
- **Backend**: Docker containers
- **Frontend**: npm start (dev mode)
- **Base de données**: MySQL dans Docker (`mysql` sur le réseau compose)

---

## 🧪 Tester l'Application

### 1. Accéder au Frontend
Ouvrir: **http://localhost:4200**

### 2. Tester les Dashboards
- Admin: http://localhost:4200/admin/manage-users
- Soignant: http://localhost:4200/soignant-dashboard
- Médecin: http://localhost:4200/doctor-dashboard

### 3. Vérifier l'API
- API Gateway: http://localhost:8090/api/patients
- Direct Backend: http://localhost:8098/api/patients

### 4. Vérifier Eureka
- Dashboard: http://localhost:8761
- Devrait afficher: `ASSISTANCE-QUOTIDIENNE`, `API-GATEWAY`

---

## 🛑 Arrêter le Projet

### Arrêter le Frontend
Dans le terminal où Angular tourne:
```powershell
Ctrl + C
```

### Arrêter le Backend
```powershell
cd alzheimer-system-main/docker
docker-compose -f docker-compose.yml down
```

---

## 🔄 Redémarrer le Projet

### Démarrer le Backend
```powershell
cd alzheimer-system-main/docker
docker-compose -f docker-compose.yml up -d
```

### Démarrer le Frontend
```powershell
cd alzheimer-system-main/frontend/alzheimer-angular
npm start
```

---

## 📝 Notes Importantes

### Fonctionnalités Disponibles
- ✅ Gestion des utilisateurs
- ✅ Gestion des patients
- ✅ Rapports médicaux
- ✅ Fiches de transmission
- ✅ Rapports hebdomadaires (génération automatique)
- ✅ Agenda et rendez-vous
- ✅ Notifications en temps réel (WebSocket)
- ✅ Traductions FR/EN

### Fonctionnalités Supprimées
- ❌ Mémoire Assistée (supprimée complètement)

### Scheduler Actif
- **Rapports Hebdomadaires**: Génération automatique chaque minute (mode test)
  - Pour production: Modifier `RapportHebdomadaireScheduler.java`
  - Changer le cron à: `0 0 9 * * MON` (Lundi 09:00)

---

## 🔍 Logs et Débogage

### Logs Backend
```powershell
# Assistance Quotidienne
docker logs assistance-quotidienne -f

# API Gateway
docker logs api-gateway -f

# Discovery Server
docker logs discovery-server -f

# RabbitMQ
docker logs rabbitmq -f
```

### Logs Frontend
Le terminal où `npm start` tourne affiche les logs en temps réel.

---

## ✅ Checklist de Vérification

- [x] Discovery Server démarré (port 8761)
- [x] API Gateway démarré (port 8090)
- [x] Assistance Quotidienne démarré (port 8098)
- [x] RabbitMQ démarré (ports 5672, 15672)
- [x] Angular démarré (port 4200)
- [x] MySQL Docker actif (port hôte 3307)
- [x] Base de données `assistancequotidiennedb` existe
- [x] Mémoire Assistée supprimée

---

**Date**: 22 avril 2026
**Statut**: ✅ PROJET COMPLÈTEMENT OPÉRATIONNEL
**URL principale**: http://localhost:4200
