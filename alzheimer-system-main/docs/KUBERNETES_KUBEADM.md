# Kubernetes avec kubeadm — VM Ubuntu

Ce guide résume l’installation d’un cluster **kubeadm** et le déploiement de la stack Alzheimer via les manifestes dans **`k8s/`**.

Références officielles : [Créer un cluster avec kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/), [Installer kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm/).

---

## 1. Prérequis (sur chaque nœud — control-plane au minimum)

- Ubuntu 22.04 LTS (exemple), accès root/sudo  
- **2 Go RAM minimum** pour le control-plane seul (plus avec workloads)  
- Ports ouverts si multi-nœuds : [Ports et protocoles requis](https://kubernetes.io/docs/reference/networking/ports-and-protocols/)

### Désactiver le swap (obligatoire pour kubelet)

```bash
sudo swapoff -a
sudo sed -i '/ swap / s/^/#/' /etc/fstab
```

### Modules kernel et sysctl (réseau pods)

```bash
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF
sudo modprobe overlay
sudo modprobe br_netfilter

cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF
sudo sysctl --system
```

---

## 2. Container runtime : containerd

```bash
sudo apt-get update
sudo apt-get install -y containerd
sudo mkdir -p /etc/containerd
containerd config default | sudo tee /etc/containerd/config.toml
sudo sed -i 's/SystemdCgroup = false/SystemdCgroup = true/' /etc/containerd/config.toml
sudo systemctl restart containerd
sudo systemctl enable containerd
```

---

## 3. kubeadm, kubelet, kubectl

```bash
sudo apt-get install -y apt-transport-https ca-certificates curl gpg
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.31/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.31/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
sudo apt-get update
sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl
sudo systemctl enable kubelet
```

*(Tu peux adapter la version `v1.31` selon la branche stable souhaitée.)*

---

## 4. Initialiser le control-plane

Sur **un seul** nœud (premier master) :

```bash
sudo kubeadm init --pod-network-cidr=10.244.0.0/16
```

À la fin, kubeadm affiche la commande **`kubeadm join`** pour les workers — conserve-la.

Configurer kubectl pour l’utilisateur non-root :

```bash
mkdir -p "$HOME/.kube"
sudo cp /etc/kubernetes/admin.conf "$HOME/.kube/config"
sudo chown "$(id -u):$(id -g)" "$HOME/.kube/config"
```

---

## 5. Réseau pods (CNI) — exemple Calico

Sans CNI, les pods restent **Pending**. Exemple avec Calico (compatible avec `--pod-network-cidr=10.244.0.0/16`) :

```bash
kubectl apply -f https://raw.githubusercontent.com/projectcalico/calico/v3.28.0/manifests/calico.yaml
```

*(Vérifie la version Calico sur [docs.projectcalico.org](https://docs.tigera.io/calico/latest/getting-started/kubernetes/quickstart).)*

Attends que les pods `kube-system` passent **Running** :

```bash
kubectl get pods -n kube-system -w
```

Sur un cluster **mono-nœud**, autorise les pods sur le master :

```bash
kubectl taint nodes --all node-role.kubernetes.io/control-plane-
```

---

## 6. Joindre des workers (optionnel)

Sur chaque worker :

```bash
sudo kubeadm join <CONTROL_PLANE_IP>:6443 --token <token> --discovery-token-ca-cert-hash sha256:<hash>
```

(Token à régénérer avec `kubeadm token create --print-join-command` si besoin.)

---

## 7. Déployer la stack Alzheimer

1. **Construire et pousser les images** (Docker Hub ou registry privé), comme avec Jenkins — remplace **`YOUR_DOCKERHUB_USER`** dans les `*-deployment.yaml` (voir `k8s/README.md`).

2. Appliquer les manifestes :

```bash
cd alzheimer-system-main/k8s
kubectl apply -f namespace.yaml
kubectl apply -f mysql-secret.yaml
kubectl apply -f mysql-pvc.yaml
kubectl apply -f mysql-deployment.yaml
kubectl apply -f mysql-service.yaml
kubectl apply -f eureka-deployment.yaml
kubectl apply -f eureka-service.yaml
kubectl apply -f assistance-deployment.yaml
kubectl apply -f assistance-service.yaml
kubectl apply -f gateway-deployment.yaml
kubectl apply -f gateway-service.yaml
kubectl apply -f frontend-deployment.yaml
kubectl apply -f frontend-service.yaml
```

Pour changer le mot de passe MySQL : édite **`mysql-secret.yaml`** avant `kubectl apply`, puis garde la même valeur pour que Spring (`MYSQL_ROOT_PASSWORD`) reste cohérent.

3. Accès au front (sans Ingress) : **NodePort** `30080` → `http://<IP_NŒUD>:30080`.

```bash
kubectl get pods,svc -n alzheimer
```

---

## 8. Stockage MySQL (sans StorageClass en cloud)

Sur kubeadm / VM, il n’y a souvent **aucune** StorageClass. Installe **local-path** (Rancher), puis applique le PVC :

```bash
kubectl apply -f https://raw.githubusercontent.com/rancher/local-path-provisioner/v0.0.30/deploy/local-path-storage.yaml
kubectl get storageclass
```

Le manifeste `mysql-pvc.yaml` utilise **`local-path`**. Si tu préfères une autre classe (`standard`, etc.), édite `storageClassName` dans ce fichier.

Si tu avais déjà créé un PVC bloqué en Pending :

```bash
kubectl delete pvc mysql-pvc -n alzheimer --ignore-not-found
kubectl apply -f mysql-pvc.yaml
```

---

## Dépannage rapide

| Symptôme | Piste |
|----------|--------|
| Pods `Pending` réseau | CNI non installé ou mal configuré |
| Pods `Pending` volume | StorageClass / PV manquant |
| `ImagePullBackOff` | Mauvais nom d’image ou pas de `docker login` sur les nœuds / pas de secret `imagePullSecrets` |
| CrashLoop Spring | MySQL pas prêt : vérifie logs `kubectl logs -n alzheimer deploy/assistance` |

Pour la prod : Ingress TLS, secrets sécurisés, limites CPU/RAM, backups MySQL, et éviter `ddl-auto=update` hors démo.
