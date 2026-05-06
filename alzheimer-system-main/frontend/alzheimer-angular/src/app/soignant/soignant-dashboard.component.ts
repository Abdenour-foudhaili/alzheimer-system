import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SoignantService } from './soignant.service';
import { Alerte, GraviteAlerte } from '../models/alerte.model';
import { PatientSoignant } from '../models/patient-soignant.model';
import { RapportMedical, StatutDirective } from '../models/rapport-medical.model';
import { NotificationTache } from '../models/notification-tache.model';
import { RapportHebdomadaire } from '../models/rapport-hebdo.model';
import { EvenementAgenda, StatutAgenda } from '../models/agenda.model';
@Component({
  selector: 'app-soignant-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './soignant-dashboard.component.html',
  styleUrls: ['./soignant-dashboard.component.css'],
})
export class SoignantDashboardComponent implements OnInit, OnDestroy {
  soignantName = 'Soignant';
  alertes: Alerte[] = [];
  patients: PatientSoignant[] = [];
  stats: {
    alertesTraitees: number;
    tauxReponseMoyen: number;
    patientsPrioritaires: number;
  } = {
      alertesTraitees: 0,
      tauxReponseMoyen: 0,
      patientsPrioritaires: 0,
    };





  rapports: RapportMedical[] = [];
  notifications: NotificationTache[] = [];
  rapportsHebdo: RapportHebdomadaire[] = [];
  agendaDuJour: EvenementAgenda[] = [];
  currentDate = new Date();
  currentTime = '';

  /** Pour la sidebar (badges) */
  alertesNonTraiteesCount = 0;
  rapportsNonLusCount = 0;
  rapportHebdoNonEnvoye = false;
  notificationsCount = 0;






  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor(
    private router: Router,
    private soignantService: SoignantService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.refresh();
    this.intervalId = setInterval(() => {
      this.currentDate = new Date();
      this.currentTime = this.currentDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  refresh(): void {
    this.currentDate = new Date();
    this.currentTime = this.currentDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    this.alertes = this.soignantService.getAlertesActives();
    this.patients = this.soignantService.getPatientsAssignes();

    this.stats = this.soignantService.getStatistiquesDuJour();
    this.rapports = this.soignantService.getRapportsMedicauxRecus();
    this.notifications = this.soignantService.getNotificationsTache();
    this.rapportsHebdo = this.soignantService.getRapportsHebdomadaires();
    this.agendaDuJour = this.soignantService.getAgendaDuJour();
    this.alertesNonTraiteesCount = this.alertes.filter(a => a.statut !== 'TRAITEE').length;
    this.rapportsNonLusCount = this.rapports.filter(r => !r.lu).length;
    this.rapportHebdoNonEnvoye = this.rapportsHebdo.some(r => !r.envoyeAuMedecin);
    this.notificationsCount = this.notifications.filter(n => n.statut === 'a_faire').length;
  }

  graviteClass(gravite: GraviteAlerte): string {
    const map: Record<GraviteAlerte, string> = {
      URGENCE: 'gravite-urgence',
      COMPORTEMENT: 'gravite-comportement',
      ZONE_INTERDITE: 'gravite-zone',
    };
    return map[gravite] ?? '';
  }

  graviteLabel(gravite: GraviteAlerte): string {
    const map: Record<GraviteAlerte, string> = {
      URGENCE: this.translate.instant('SOIGNANT.GRAVITY_URGENCE'),
      COMPORTEMENT: this.translate.instant('SOIGNANT.GRAVITY_BEHAVIOUR'),
      ZONE_INTERDITE: this.translate.instant('SOIGNANT.GRAVITY_FORBIDDEN_ZONE'),
    };
    return map[gravite] ?? gravite;
  }

  marquerEnCours(alerte: Alerte): void {
    this.soignantService.marquerAlerteStatut(alerte.id, 'EN_COURS').subscribe(() => this.refresh());
  }

  marquerTraitee(alerte: Alerte): void {
    this.soignantService.marquerAlerteStatut(alerte.id, 'TRAITEE').subscribe(() => this.refresh());
  }



  risqueClass(risque: string): string {
    const map: Record<string, string> = {
      faible: 'risque-faible',
      moyen: 'risque-moyen',
      eleve: 'risque-eleve',
    };
    return map[risque] ?? '';
  }

  formatTime(d: Date): string {
    return new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  formatDate(d: Date | string): string {
    return new Date(d).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  // Rapports médicaux
  marquerRapportLu(rapportId: string): void {
    this.soignantService.marquerRapportLu(rapportId).subscribe(() => this.refresh());
  }

  marquerDirectiveStatut(directiveId: string, statut: StatutDirective): void {
    this.soignantService.marquerDirectiveStatut(directiveId, statut).subscribe(() => this.refresh());
  }

  statutDirectiveLabel(s: StatutDirective): string {
    const map: Record<StatutDirective, string> = { non_lu: this.translate.instant('SOIGNANT.UNREAD'), lu: this.translate.instant('SOIGNANT.READ'), en_cours: this.translate.instant('SOIGNANT.IN_PROGRESS'), execute: this.translate.instant('SOIGNANT.EXECUTED'), reporter: this.translate.instant('SOIGNANT.REPORT') };
    return map[s] ?? s;
  }

  // Notifications
  marquerNotificationFait(notif: NotificationTache): void {
    this.soignantService.marquerNotificationFait(notif.id).subscribe(() => this.refresh());
  }

  marquerNotificationReporter(notif: NotificationTache): void {
    this.soignantService.marquerNotificationReporter(notif.id).subscribe(() => this.refresh());
  }

  marquerNotificationProbleme(notif: NotificationTache): void {
    this.soignantService.marquerNotificationProbleme(notif.id).subscribe(() => this.refresh());
  }

  // Rapport hebdo
  envoyerRapportHebdo(rapportId: string): void {
    this.soignantService.envoyerRapportHebdoAuMedecin(rapportId).subscribe(() => this.refresh());
  }

  // Agenda
  statutAgendaClass(statut: StatutAgenda): string {
    return statut === 'fait' ? 'agenda-fait' : statut === 'en_retard' ? 'agenda-retard' : 'agenda-attente';
  }

  marquerEvenementStatut(ev: EvenementAgenda, statut: StatutAgenda): void {
    this.soignantService.marquerEvenementStatut(ev.id, statut).subscribe(() => this.refresh());
  }

  // SOS / Urgence


  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/']);
  }
}
