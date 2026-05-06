# Manifestes Kubernetes — Alzheimer

Les Services utilisent les **mêmes noms DNS** que Docker Compose (`mysql`, `eureka`, `assistance`, `gateway`) pour que le profil Spring **`docker`** fonctionne sans changement.

## Images à remplacer

Les fichiers `*-deployment.yaml` utilisent des placeholders — **remplace `YOUR_DOCKERHUB_USER`** par ton utilisateur Docker Hub (ou le préfixe complet du registry) **avant** `kubectl apply`.

Images attendues (alignées sur les pipelines Jenkins) :

| Déploiement | Image exemple |
|-------------|----------------|
| eureka | `YOUR_DOCKERHUB_USER/alzheimer-eureka:latest` |
| gateway | `YOUR_DOCKERHUB_USER/alzheimer-api-gateway:latest` |
| assistance | `YOUR_DOCKERHUB_USER/alzheimer-assistance-quotidienne:latest` |
| frontend | `YOUR_DOCKERHUB_USER/alzheimer-angular-front:latest` |

MySQL utilise l’image publique `mysql:8.0`.

Commande rapide sous Linux :

```bash
sed -i 's/YOUR_DOCKERHUB_USER/mon-utilisateur-hub/g' *.yaml
```

## Ordre d’application

Voir la section **§7** dans [`docs/KUBERNETES_KUBEADM.md`](../docs/KUBERNETES_KUBEADM.md).

## Accès

- **Frontend** : NodePort **30080** (`frontend-service.yaml`).
- Eureka / Gateway en ClusterIP uniquement ; pour debug : `kubectl port-forward -n alzheimer svc/eureka 8761:8761`.
