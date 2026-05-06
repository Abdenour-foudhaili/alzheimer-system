import { CanActivateFn } from '@angular/router';

/** Accès ouvert : aucun contrôle de rôle côté IAM central dans cette configuration. */
export const roleGuard: CanActivateFn = () => true;
