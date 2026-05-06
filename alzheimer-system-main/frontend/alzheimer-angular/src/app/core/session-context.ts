/**
 * Identifiant de session navigateur (sans IAM central).
 * Réutilisé pour les en-têtes API et le profil tant qu'aucun backend d'auth n'est branché.
 */
const STORAGE_KEY = 'app-session-user-id';

export function getSessionUserId(): string {
  try {
    let id = sessionStorage.getItem(STORAGE_KEY);
    if (!id) {
      id =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `anon-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  } catch {
    return `anon-${Date.now()}`;
  }
}
