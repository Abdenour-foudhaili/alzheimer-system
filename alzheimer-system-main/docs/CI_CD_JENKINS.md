# CI/CD — Jenkins + SonarQube (VM Linux)

Les pipelines sont dans **`alzheimer-system-main/ci/`** (à la racine du dépôt Git : `alzheimer-system-main/ci/…`). **Recommandé** : **un job Jenkins par microservice / frontend**, chacun pointant vers **un seul** `Jenkinsfile` ci‑dessous.

| Job (exemple) | Chemin du script (Script Path) | Outillage Jenkins (`tools`) | SonarQube `projectKey` |
|---------------|-------------------------------|-----------------------------|-------------------------|
| Eureka | `alzheimer-system-main/ci/Jenkinsfile.eureka` | JDK‑17, Maven‑3.9 | `alzheimer-eureka` |
| API Gateway | `alzheimer-system-main/ci/Jenkinsfile.api-gateway` | JDK‑17, Maven‑3.9 | `alzheimer-api-gateway` |
| Assistance quotidienne | `alzheimer-system-main/ci/Jenkinsfile.assistance-quotidienne` | JDK‑17, Maven‑3.9 | `alzheimer-assistance-quotidienne` (JaCoCo) |
| Frontend Angular | `alzheimer-system-main/ci/Jenkinsfile.frontend` | JDK‑17, NodeJS‑20 | `alzheimer-angular` (`sonar-scanner`) |

**Option tout‑en‑un** (sans Eureka/Gateway dans le même fichier) : `alzheimer-system-main/Jenkinsfile` ou `alzheimer-system-main/ci/Jenkinsfile.monolith` — Assistance + frontend dans une seule pipeline.

Ordre **runtime** local (hors Jenkins) : démarrer **Eureka** puis les services qui s’y enregistrent (**Gateway**, **Assistance**), puis le frontend. Les pipelines CI ne démarrent pas les serveurs ; elles **compilent, testent et analysent** chaque module.

## Prérequis sur la VM

- **Ubuntu Server 22.04 LTS** (ou équivalent), **4 Go RAM minimum** (8 Go recommandé si Jenkins + SonarQube sur la même VM).
- Accès réseau depuis la VM vers votre dépôt Git (HTTPS ou SSH).

### Option A — SonarQube en Docker (simple)

```bash
docker run -d --name sonarqube -p 9000:9000 \
  -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true \
  sonarqube:lts-community
```

Ouvrez `http://<IP_VM>:9000`, login `admin` / `admin`, changez le mot de passe, puis **créez un token utilisateur** (Mon compte → Sécurité) pour Jenkins.

### Option B — Jenkins en Docker

Pour un premier essai, vous pouvez lancer Jenkins en conteneur et monter le socket Docker pour builder ; en production, préférez un agent dédié ou Jenkins installé via paquets.

### Option C — Jenkins via paquets / WAR

Installez OpenJDK 17, Maven 3.9+, Node.js 20 LTS, **Google Chrome ou Chromium** (pour les TU Angular en `ChromeHeadless`), puis [téléchargez Jenkins LTS](https://www.jenkins.io/doc/book/installing/linux/) selon la doc officielle. Exemple Ubuntu : `sudo apt-get install -y chromium-browser`.

### Sonar Scanner CLI (obligatoire pour l’étape frontend)

Sur l’agent Jenkins qui exécute le pipeline :

```bash
# Exemple Debian/Ubuntu — adaptez la version depuis https://docs.sonarqube.org/latest/analyzing-source-code/scanners/sonarscanner/
sudo apt-get update && sudo apt-get install -y unzip
wget -q https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-5.0.1.3006-linux.zip
sudo unzip -q sonar-scanner-cli-*.zip -d /opt
sudo ln -sf /opt/sonar-scanner-*/bin/sonar-scanner /usr/local/bin/sonar-scanner
```

Vérifiez : `sonar-scanner -h`

---

## Configuration Jenkins

1. **Plugins** (Administrer Jenkins → Plugins) :
   - SonarQube Scanner **et** intégration SonarQube (webhook / Quality Gate).
   - Pipeline, Git, JUnit, Credentials.

2. **JDK** — Administrer Jenkins → Outils → JDK → ajoutez une installation nommée exactement **`JDK-17`** (ou renommez dans le `Jenkinsfile`).

3. **Maven** — Outils → Maven → **`Maven-3.9`** (chemin `MAVEN_HOME` ou installateur automatique).

4. **Node.js** — Outils → NodeJS → **`NodeJS-20`** (cochez « Install automatically » si besoin).

5. **SonarQube Server** — Administrer Jenkins → Configuration du système → SonarQube servers :
   - **Nom** : `SonarQube` (doit correspondre au `withSonarQubeEnv('SonarQube')` du `Jenkinsfile`).
   - **URL du serveur** : `http://<IP_VM>:9000` (ou votre URL SonarQube).
   - **Server authentication token** : token créé dans SonarQube (type « Secret text » en credentials Jenkins).

6. **Webhook Quality Gate** — Dans SonarQube : Administration → Configuration → Webhooks → Ajouter :
   - URL : `http://<IP_JENKINS>:8080/sonarqube-webhook/`  
   (URL exacte indiquée dans la configuration Jenkins SonarQube.)

7. **Jobs Pipeline** — Pour **chaque** ligne du tableau ci‑dessus : Nouveau item → Pipeline → « Pipeline script from SCM » → Git (URL du repo, branche `assistance-quotidienne` ou `main`) → **Script Path** = chemin indiqué (ex. **`alzheimer-system-main/ci/Jenkinsfile.eureka`**).

---

## Noms des outils dans `Jenkinsfile`

Si vos installations Jenkins ont d’autres libellés, modifiez le bloc :

```groovy
tools {
  maven 'Maven-3.9'
  jdk 'JDK-17'
  nodejs 'NodeJS-20'
}
```

---

## Projets SonarQube

| Composant | `projectKey` |
|-----------|----------------|
| Eureka | `alzheimer-eureka` |
| API Gateway | `alzheimer-api-gateway` |
| Assistance quotidienne | `alzheimer-assistance-quotidienne` |
| Frontend Angular | `alzheimer-angular` |

La première analyse crée chaque projet dans SonarQube. Le frontend utilise aussi `frontend/alzheimer-angular/sonar-project.properties`.

---

## Quality Gate

Chaque pipeline qui exécute Sonar appelle **`waitForQualityGate`** après son analyse (webhook SonarQube → Jenkins obligatoire). Si plusieurs builds Sonar partent **en parallèle**, gardez un délai ou séquencez les jobs pour éviter des collisions rares sur le webhook.

---

## Dépannage

- **`sonar-scanner`: command not found** — Installez le Scanner CLI sur l’agent ou utilisez une image Docker avec `sonar-scanner` dans le `PATH`.
- **Quality Gate en erreur / timeout** — Vérifiez le webhook Sonar→Jenkins et que l’URL Jenkins est joignable depuis SonarQube (firewall).
- **Échec `npm ci`** — Committez un `package-lock.json` à jour dans `frontend/alzheimer-angular`.
- **Chemin avec espace** (`assistance quotidienne`) — Le `Jenkinsfile` utilise des variables et `-f "$BACKEND_POM"` pour éviter les problèmes de quoting.

---

## Sécurité (production)

- Ne pas exposer Jenkins ni SonarQube sur Internet sans HTTPS et pare-feu.
- Utiliser des credentials Jenkins pour Git et Sonar, pas de tokens en clair dans le dépôt.
