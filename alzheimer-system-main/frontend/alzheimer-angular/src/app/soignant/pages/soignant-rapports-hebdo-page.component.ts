import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { RapportHebdomadaire } from '../../models/rapport-hebdo.model';
import { RapportHebdomadaireApiService } from '../../services/rapport-hebdomadaire-api.service';
import { SoignantService } from '../soignant.service';
import { PatientSoignant } from '../../models/patient-soignant.model';

@Component({
  selector: 'app-soignant-rapports-hebdo-page',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './soignant-rapports-hebdo-page.component.html',
  styleUrls: ['../soignant-pages.css', './soignant-rapports-hebdo-page.component.css']
})
export class SoignantRapportsHebdoPageComponent implements OnInit {
  private rapportHebdoApi = inject(RapportHebdomadaireApiService);
  private soignantService = inject(SoignantService);
  private router = inject(Router);

  rapports: RapportHebdomadaire[] = [];
  rapportsToSend: RapportHebdomadaire[] = [];
  rapportsSent: RapportHebdomadaire[] = [];
  patients: PatientSoignant[] = [];
  
  loading = false;
  consolidating = false;
  selectedRapport: RapportHebdomadaire | null = null;

  ngOnInit(): void {
    this.patients = this.soignantService.getPatientsAssignes();
    this.load();
  }

  load(): void {
    this.loading = true;
    this.rapportHebdoApi.getAll().subscribe({
      next: (data) => {
        const all = (data || []) as any[];
        this.rapports = all.map(r => this.mapRapport(r));
        this.rapportsToSend = this.rapports.filter(r => !r.envoyeAuMedecin);
        this.rapportsSent = this.rapports.filter(r => r.envoyeAuMedecin);
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement rapports hebdo:', err);
        this.loading = false;
      }
    });
  }

  mapRapport(r: any): RapportHebdomadaire {
    return {
      id: String(r.id),
      patientId: r.patient?.id ? String(r.patient.id) : '',
      patientNom: r.patientNom || r.patient?.nomComplet || 'Patient Inconnu',
      soignantId: r.soignant?.id ? String(r.soignant.id) : '',
      dateDebut: r.dateDebut || '',
      dateFin: r.dateFin || '',
      formulaireIds: r.formulaireIdsJson ? JSON.parse(r.formulaireIdsJson) : [],
      tauxObservanceMedicaments: r.tauxObservanceMedicaments || 0,
      tauxObservanceRepas: r.tauxObservanceRepas || 0,
      tauxObservanceRendezVous: r.tauxObservanceRendezVous || 0,
      incidentsNotables: r.incidentsNotables || '',
      observationsGenerales: r.observationsGenerales || '',
      envoyeAuMedecin: r.envoyeAuMedecin || false,
      dateEnvoi: r.dateEnvoi ? new Date(r.dateEnvoi) : undefined
    };
  }

  supprimer(id: string): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce rapport ?')) return;
    
    const numId = parseInt(id, 10);
    if (isNaN(numId)) return;

    this.rapportHebdoApi.delete(numId).subscribe({
      next: () => this.load(),
      error: (err) => console.error('Erreur suppression rapport hebdo:', err)
    });
  }

  envoyer(id: string): void {
    const numId = parseInt(id, 10);
    if (isNaN(numId)) return;

    this.rapportHebdoApi.marquerEnvoye(numId).subscribe({
      next: () => this.load(),
      error: (err) => console.error('Erreur envoi rapport hebdo:', err)
    });
  }

  /** Génération manuelle pour la semaine courante */
  consoliderTout(): void {
    if (this.consolidating) return;
    
    // Déterminer les dates de la semaine courante (Lundi -> Dimanche)
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const debut = monday.toISOString().slice(0, 10);
    const fin = sunday.toISOString().slice(0, 10);

    this.consolidating = true;
    
    // Pour chaque patient, on déclenche une consolidation
    const requests = this.patients.map(p => 
      this.soignantService.consoliderRapportHebdo(p.id, debut, fin).toPromise()
    );

    Promise.all(requests).then((results) => {
      this.consolidating = false;
      const count = results.filter(r => r !== null).length;
      console.log(`✅ Consolidation terminée : ${count} rapports mis à jour.`);
      this.load();
    }).catch(err => {
      console.error('Erreur consolidation:', err);
      this.consolidating = false;
      this.load();
    });
  }

  openReportDetail(rapport: RapportHebdomadaire): void {
    this.selectedRapport = rapport;
  }

  closeReportDetail(): void {
    this.selectedRapport = null;
  }

  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/']);
  }
}

