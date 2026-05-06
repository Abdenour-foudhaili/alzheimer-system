import { CanActivateFn } from '@angular/router';

/** Laisse afficher la route racine sans redirection IAM. */
export const roleRedirectGuard: CanActivateFn = () => true;
