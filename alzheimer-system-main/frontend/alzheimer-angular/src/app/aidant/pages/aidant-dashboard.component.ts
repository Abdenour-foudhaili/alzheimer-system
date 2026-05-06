import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PatientService, Patient } from '../../services/patient.service';
import { RendezVousService, RendezVous } from '../../services/rendez-vous.service';
import { RapportService, Rapport } from '../../services/rapport.service';

@Component({
  selector: 'app-aidant-dashboard',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './aidant-dashboard.component.html',
  styleUrls: ['../aidant-pages.css', './aidant-dashboard.component.css']
})
export class AidantDashboardComponent implements OnInit {

  patients: Patient[] = [];
  prochainRdv: RendezVous | null = null;
  todayRdvCount = 0;
  dernierRapport: Rapport | null = null;
  alertes: { icon: string; message: string; type: string; date: string }[] = [];

  // Stats
  observanceGlobale = 0;
  rdvSemaine = 0;
  rapportsNonLus = 0;

  // Date
  get todayFormatted(): string {
    return new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  constructor(
    private router: Router,
    private patientService: PatientService,
    private rendezVousService: RendezVousService,
    private rapportService: RapportService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.patientService.getAll().subscribe({
      next: (patients) => {
        this.patients = patients.slice(0, 3);
        this.buildAlerts();
      },
      error: () => this.loadMockData()
    });

    this.rendezVousService.getAll().subscribe({
      next: (rdvs) => {
        const now = new Date();
        const upcoming = rdvs
          .filter(r => r.dateHeure && new Date(r.dateHeure) >= now)
          .sort((a, b) => new Date(a.dateHeure!).getTime() - new Date(b.dateHeure!).getTime());
        this.prochainRdv = upcoming[0] || null;

        const today = now.toISOString().slice(0, 10);
        this.todayRdvCount = rdvs.filter(r => r.dateHeure?.startsWith(today)).length;

        const weekEnd = new Date(now);
        weekEnd.setDate(weekEnd.getDate() + 7);
        this.rdvSemaine = rdvs.filter(r => r.dateHeure && new Date(r.dateHeure) >= now && new Date(r.dateHeure) <= weekEnd).length;
      },
      error: () => this.loadMockRdv()
    });

    this.rapportService.getAll().subscribe({
      next: (rapports) => {
        const sorted = rapports.sort((a, b) =>
          new Date(b.dateGeneration || '').getTime() - new Date(a.dateGeneration || '').getTime()
        );
        this.dernierRapport = sorted[0] || null;
        this.rapportsNonLus = rapports.filter(r => r.statut !== 'LU').length;
        this.observanceGlobale = rapports.length > 0
          ? Math.round(rapports.reduce((sum, r) => sum + (r.tauxObservance || 0), 0) / rapports.length)
          : 85;
      },
      error: () => {
        this.observanceGlobale = 85;
        this.rapportsNonLus = 2;
      }
    });
  }

  private loadMockData(): void {
    this.patients = [
      { nomComplet: 'Jean Dupont', actif: true, numeroDeTelephone: '06 12 34 56 78', dateNaissance: '1948-03-15', antecedents: 'Alzheimer stade modéré' },
      { nomComplet: 'Marie Martin', actif: true, numeroDeTelephone: '06 98 76 54 32', dateNaissance: '1944-07-22', antecedents: 'Alzheimer stade léger' }
    ];
    this.buildAlerts();
  }

  private loadMockRdv(): void {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0);
    this.prochainRdv = {
      type: 'CONSULTATION',
      statut: 'CONFIRME',
      dateHeure: tomorrow.toISOString(),
      lieu: 'Cabinet Dr. Lefebvre',
      motif: 'Suivi trimestriel'
    };
    this.todayRdvCount = 1;
    this.rdvSemaine = 3;
  }

  private buildAlerts(): void {
    this.alertes = [];
    if (this.patients.some(p => !p.actif)) {
      this.alertes.push({ icon: '⚠️', message: 'AIDANT.ALERTS.PATIENT_INACTIVE', type: 'warning', date: new Date().toISOString() });
    }
    // Example alerts
    this.alertes.push(
      { icon: '💊', message: 'AIDANT.ALERTS.MISSED_MEDICATION', type: 'danger', date: new Date().toISOString() },
      { icon: '📋', message: 'AIDANT.ALERTS.NEW_REPORT', type: 'info', date: new Date().toISOString() }
    );
  }

  getPatientInitials(patient: Patient): string {
    return (patient.nomComplet || 'P')
      .split(' ')
      .map(n => n.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  getObservanceClass(): string {
    if (this.observanceGlobale >= 80) return 'green';
    if (this.observanceGlobale >= 60) return 'orange';
    return 'red';
  }

  formatDate(date: string | undefined): string {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  }

  goToPatients(): void { this.router.navigate(['/aidant-patients']); }
  goToPlanning(): void { this.router.navigate(['/aidant-planning']); }
  goToRapports(): void { this.router.navigate(['/aidant-rapports']); }

  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/']);
  }
}
