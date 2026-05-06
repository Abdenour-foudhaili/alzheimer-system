/** Déploiement derrière nginx (Docker / K8s) : URLs relatives. Utilisé par les configs build « docker » et « production ». */
export const environment = {
  production: true,
  apiUrl: '/api',
  sockJsWsUrl: '/ws',
};
