# Alzheimer Risk Detection System

![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=java&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-2.7.18-green?style=for-the-badge&logo=spring-boot&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-18-red?style=for-the-badge&logo=angular&logoColor=white)

## Overview

The Alzheimer Risk Detection System is a distributed microservices platform for monitoring and supporting Alzheimer’s patients. It uses a **Spring Boot** backend and an **Angular** frontend.

---

## System Architecture

```mermaid
graph TD
    User((User))
    User -->|HTTPS| Gateway[API Gateway]

    subgraph Infrastructure
    Gateway -->|Discovery| Eureka[Eureka Server]
    end

    subgraph Microservices
    Gateway -->|Route| Services[Backend Services]
    Services -.->|Register| Eureka
    end
```

### Core components

- **API Gateway**: Entry point for routing and CORS (`localhost:8090`).
- **Discovery Server (Eureka)**: Service registry (`localhost:8761`).
- **Assistance Quotidienne**: Main REST API (`localhost:8088`).
- **Frontend**: Angular (`localhost:4200`).

---

## Technology stack

### Backend

- Spring Boot 2.7.18, Java 17  
- Spring Cloud Gateway, Eureka  
- Maven  

### Frontend

- Angular  
- PrimeNG, PrimeIcons  

### Local infrastructure

- **MySQL** on `localhost:3306` (e.g. XAMPP), database `assistancequotidiennedb`  

---

## Project structure

```text
alzheimer-system/
├── backend/
│   ├── api-gateway/
│   ├── discovery-server/
│   └── assistance quotidienne/
└── frontend/
    └── alzheimer-angular/
```

---

## Getting started (sans Docker)

### Prerequisites

- Java JDK 17  
- Maven  
- Node.js (v18+)  
- MySQL (ex. XAMPP) — créez la base `assistancequotidiennedb`, utilisateur `root`, mot de passe vide ou adaptez `application.properties`.  

### 1. Démarrer les backends (4 terminaux)

Ordre recommandé :

**Terminal 1 — Eureka**

```bash
cd backend/discovery-server
mvn spring-boot:run
```

Dashboard : http://localhost:8761  

**Terminal 2 — Assistance quotidienne**

```bash
cd "backend/assistance quotidienne"
mvn spring-boot:run
```

API directe : http://localhost:8088/api  

**Terminal 3 — API Gateway**

```bash
cd backend/api-gateway
mvn spring-boot:run
```

Passerelle : http://localhost:8090/api  

Le gateway route tout `/api/**` vers `http://localhost:8088`.

### 2. Frontend

```bash
cd frontend/alzheimer-angular
npm install
npm start
```

Ouvrir http://localhost:4200  

`environment.ts` utilise `http://localhost:8090/api`.

Les WebSockets médecin pointent vers `http://localhost:8088/ws` en dev local.

---

## Docker sur une VM (stack complète)

À la racine du dossier **`alzheimer-system-main`** :

```bash
cp .env.example .env   # ajuster MYSQL_ROOT_PASSWORD si besoin
docker compose up -d --build
```

Services exposés sur la VM :

| Service | URL / port |
|--------|------------|
| **Frontend** (nginx + Angular build `docker`) | `http://<IP_VM>` (port 80 par défaut) |
| **API Gateway** | `http://<IP_VM>:8090` |
| **Assistance** (direct) | `http://<IP_VM>:8088` |
| **Eureka** | `http://<IP_VM>:8761` |
| **MySQL** | `<IP_VM>:3306` |

Le front utilise des URLs relatives **`/api`** et **`/ws`** ; nginx du conteneur `frontend` proxifie vers **gateway** et **assistance**.

Profils Spring **`docker`** : Eureka à `http://eureka:8761/eureka`, MySQL à `mysql:3306`. En **premier déploiement**, `ddl-auto=update` est activé dans ce profil pour créer les tables (à durcir pour la prod).

Arrêt : `docker compose down` (données MySQL conservées dans le volume `mysql_data`).

### Kubernetes (kubeadm)

Installation du cluster et déploiement des pods : **[`docs/KUBERNETES_KUBEADM.md`](docs/KUBERNETES_KUBEADM.md)** — manifestes dans **`k8s/`**.

---

## Tests unitaires (TU)

**Backend** (`backend/assistance quotidienne`) — JUnit 5 + Mockito pour les contrôleurs / services ; `@SpringBootTest` pour le chargement du contexte.

```bash
cd "backend/assistance quotidienne"
mvn test
```

**Frontend** (`frontend/alzheimer-angular`) — Jasmine + Karma ; CI sans navigateur visible :

```bash
cd frontend/alzheimer-angular
npm run test:ci
```

Sur Linux (Jenkins / VM), installez **Chromium ou Google Chrome** pour que `ChromeHeadless` puisse démarrer.

**Jenkins** : pipelines séparées dans **`ci/`** (Eureka, API Gateway, Assistance quotidienne, Frontend) — voir le tableau des **Script Path** dans [`docs/CI_CD_JENKINS.md`](docs/CI_CD_JENKINS.md). Option monolithique : **`alzheimer-system-main/Jenkinsfile`** (Assistance + frontend seulement). Après analyse Sonar, chaque pipeline peut **pousser une image sur Docker Hub** (credential Jenkins **`docker-hub`**, Docker installé sur l’agent).

---

## Security note

The default configuration does **not** enforce JWT or centralized login. For production, add appropriate authentication and tighten Spring Security on the gateway and services.
