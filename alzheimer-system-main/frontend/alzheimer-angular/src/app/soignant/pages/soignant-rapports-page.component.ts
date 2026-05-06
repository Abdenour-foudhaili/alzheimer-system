import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RapportService, Rapport } from '../../services/rapport.service';
import { RapportHebdomadaireApiService } from '../../services/rapport-hebdomadaire-api.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-soignant-rapports-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './soignant-rapports-page.component.html',
  styleUrls: ['../soignant-pages.css']
})
export class SoignantRapportsPageComponent implements OnInit {
  // Rapports réels du médecin (depuis la BDD)
  rapportsMedecin: Rapport[] = [];
  pagedRapportsMedecin: Rapport[] = [];
  selectedRapportMedecin: Rapport | null = null;
  loadingRapportsMedecin = false;

  // Pagination rapports médecin
  medecinPage = 1;
  medecinPageSize = 5;
  medecinPageSizeOptions = [5, 10, 20];
  medecinTotalPages = 1;

  // Rapports hebdomadaires
  rapportsHebdo: any[] = [];
  pagedRapportsHebdo: any[] = [];
  loadingHebdo = false;
  sendingHebdo: number | null = null;  // ID of the rapport being sent
  sendHebdoSuccess: {id: number, patientName: string} | null = null;
  sendHebdoError: string | null = null;
  selectedHebdo: any | null = null;

  // Pagination rapports hebdo
  hebdoPage = 1;
  hebdoPageSize = 5;
  hebdoPageSizeOptions = [5, 10, 20];
  hebdoTotalPages = 1;

  constructor(
    private rapportService: RapportService,
    private rapportHebdoApi: RapportHebdomadaireApiService,
    private http: HttpClient,
    private translate: TranslateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRapportsMedecin();
    this.loadRapportsHebdo();
  }

  /** Charge les rapports réels depuis l'API */
  loadRapportsMedecin(): void {
    this.loadingRapportsMedecin = true;
    this.rapportService.getAll().subscribe({
      next: (data) => {
        // Seulement les rapports envoyés par le médecin (statut ENVOYE)
        this.rapportsMedecin = data.filter(r => r.statut === 'ENVOYE');
        this.loadingRapportsMedecin = false;
        this.medecinPage = 1;
        this.applyMedecinPagination();
      },
      error: (err) => {
        console.error('Erreur chargement rapports médecin:', err);
        this.loadingRapportsMedecin = false;
      }
    });
  }

  /** Charge les rapports hebdomadaires */
  loadRapportsHebdo(): void {
    this.loadingHebdo = true;
    this.rapportHebdoApi.getAll().subscribe({
      next: (data) => {
        this.rapportsHebdo = data.sort((a: any, b: any) =>
          new Date(b.dateCreation || 0).getTime() - new Date(a.dateCreation || 0).getTime()
        );
        this.loadingHebdo = false;
        this.hebdoPage = 1;
        this.applyHebdoPagination();
      },
      error: (err) => {
        console.error('Erreur chargement rapports hebdo:', err);
        this.loadingHebdo = false;
      }
    });
  }

  /** Envoyer un rapport hebdomadaire au médecin */
  envoyerHebdoAuMedecin(rapport: any): void {
    if (!rapport.id || this.sendingHebdo) return;
    if (rapport.envoyeAuMedecin) return;

    this.sendingHebdo = rapport.id;
    this.sendHebdoError = null;

    this.rapportHebdoApi.marquerEnvoye(rapport.id).subscribe({
      next: (updated) => {
        rapport.envoyeAuMedecin = true;
        rapport.dateEnvoi = updated.dateEnvoi;
        this.sendingHebdo = null;
        this.sendHebdoSuccess = {
          id: rapport.id,
          patientName: rapport.patientNom || rapport.patient?.nomComplet || 'Patient'
        };
        // Auto-dismiss after 5s
        setTimeout(() => this.dismissHebdoSuccess(), 5000);
      },
      error: (err: any) => {
        this.sendingHebdo = null;
        this.sendHebdoError = 'Erreur lors de l\'envoi du rapport. Veuillez réessayer.';
        setTimeout(() => this.sendHebdoError = null, 5000);
      }
    });
  }

  dismissHebdoSuccess(): void {
    this.sendHebdoSuccess = null;
  }

  /** Ouvre le détail d'un rapport hebdomadaire */
  openHebdoDetail(rapport: any): void {
    this.selectedHebdo = rapport;
  }

  closeHebdoDetail(): void {
    this.selectedHebdo = null;
  }

  getHebdoStatut(r: any): string {
    if (r.consulteParMedecin) return 'Consulté';
    if (r.envoyeAuMedecin) return 'Envoyé';
    return 'En attente';
  }

  // === Pagination Rapports Médecin ===
  applyMedecinPagination(): void {
    this.medecinTotalPages = Math.max(1, Math.ceil(this.rapportsMedecin.length / this.medecinPageSize));
    const start = (this.medecinPage - 1) * this.medecinPageSize;
    this.pagedRapportsMedecin = this.rapportsMedecin.slice(start, start + this.medecinPageSize);
  }

  goToMedecinPage(page: number): void {
    if (page < 1 || page > this.medecinTotalPages) return;
    this.medecinPage = page;
    this.applyMedecinPagination();
  }

  onMedecinPageSizeChange(): void {
    this.medecinPage = 1;
    this.applyMedecinPagination();
  }

  get medecinRangeStart(): number {
    return this.rapportsMedecin.length === 0 ? 0 : (this.medecinPage - 1) * this.medecinPageSize + 1;
  }

  get medecinRangeEnd(): number {
    return Math.min(this.rapportsMedecin.length, this.medecinPage * this.medecinPageSize);
  }

  get medecinPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.medecinTotalPages; i++) pages.push(i);
    return pages;
  }

  // === Pagination Rapports Hebdo ===
  applyHebdoPagination(): void {
    this.hebdoTotalPages = Math.max(1, Math.ceil(this.rapportsHebdo.length / this.hebdoPageSize));
    const start = (this.hebdoPage - 1) * this.hebdoPageSize;
    this.pagedRapportsHebdo = this.rapportsHebdo.slice(start, start + this.hebdoPageSize);
  }

  goToHebdoPage(page: number): void {
    if (page < 1 || page > this.hebdoTotalPages) return;
    this.hebdoPage = page;
    this.applyHebdoPagination();
  }

  onHebdoPageSizeChange(): void {
    this.hebdoPage = 1;
    this.applyHebdoPagination();
  }

  get hebdoRangeStart(): number {
    return this.rapportsHebdo.length === 0 ? 0 : (this.hebdoPage - 1) * this.hebdoPageSize + 1;
  }

  get hebdoRangeEnd(): number {
    return Math.min(this.rapportsHebdo.length, this.hebdoPage * this.hebdoPageSize);
  }

  get hebdoPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.hebdoTotalPages; i++) pages.push(i);
    return pages;
  }

  /** Ouvre la consultation d'un rapport médecin (BDD) et marque comme lu */
  consulterRapportMedecin(r: Rapport): void {
    this.selectedRapportMedecin = r;
    // Marquer comme lu par le soignant dans la BDD
    if (r.id && !(r as any).luParSoignant) {
      this.rapportService.marquerLuParSoignant(r.id).subscribe({
        next: (updated) => {
          (r as any).luParSoignant = true;
        },
        error: (err: any) => console.error('Erreur marquage lu:', err)
      });
    }
  }

  fermerRapportMedecin(): void {
    this.selectedRapportMedecin = null;
  }

  // === Helpers pour les rapports médecin ===
  getStatutLabel(statut: string | undefined): string {
    switch (statut) {
      case 'GENERE': return 'Généré';
      case 'ENVOYE': return 'Envoyé';
      case 'ARCHIVE': return 'Archivé';
      case 'BROUILLON': return 'Brouillon';
      default: return statut || '—';
    }
  }

  getTypeLabel(type: string | undefined): string {
    switch (type) {
      case 'QUOTIDIEN': return 'Quotidien';
      case 'HEBDOMADAIRE': return 'Hebdomadaire';
      case 'MENSUEL': return 'Mensuel';
      case 'INCIDENT': return 'Incident';
      case 'MEDICAL': return 'Médical';
      case 'PERSONNALISE': return 'Personnalisé';
      default: return type || '—';
    }
  }

  hasIndicators(r: Rapport): boolean {
    return r.tauxObservance != null || r.qualiteSommeil != null ||
           r.nbAlertes != null || r.nbInterventions != null ||
           r.nbComportementsAnormaux != null;
  }

  /** Télécharge un rapport médecin en HTML */
  downloadRapportMedecin(rapport: Rapport): void {
    const patient = rapport.patient?.nomComplet || 'Patient inconnu';
    const auteur = rapport.soignant?.nomComplet || rapport.soignant?.nom || 'Médecin';
    const dateGen = rapport.dateGeneration ? new Date(rapport.dateGeneration).toLocaleString('fr-FR') : new Date().toLocaleString('fr-FR');
    const periodeStr = (rapport.periodeDebut && rapport.periodeFin)
      ? `${new Date(rapport.periodeDebut).toLocaleDateString('fr-FR')} → ${new Date(rapport.periodeFin).toLocaleDateString('fr-FR')}`
      : '—';

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Rapport Médical #${rapport.id} — ${patient}</title>
<style>
  @page { size: A4; margin: 20mm 18mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Times New Roman', 'Georgia', serif; font-size: 11pt; line-height: 1.5; color: #1a1a1a; background: #fff; }
  .page { max-width: 210mm; margin: 0 auto; padding: 20mm 18mm; }
  .doc-header { border-bottom: 3px double #1a3a5c; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; }
  .doc-institution { display: block; font-size: 14pt; font-weight: bold; color: #1a3a5c; letter-spacing: 0.5px; }
  .doc-subtitle { display: block; font-size: 9pt; color: #555; margin-top: 2px; }
  .doc-header-right { text-align: right; font-size: 9pt; color: #444; }
  .doc-ref { display: block; font-weight: bold; font-size: 10pt; }
  .doc-title { text-align: center; margin: 16px 0 20px; }
  .doc-title h1 { font-size: 15pt; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #1a3a5c; border-bottom: 1px solid #ccc; padding-bottom: 6px; display: inline-block; }
  .section { margin-bottom: 18px; page-break-inside: avoid; }
  .section-title { font-size: 11pt; font-weight: bold; color: #1a3a5c; border-bottom: 1px solid #d0d0d0; padding-bottom: 3px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
  .section-letter { display: inline-block; width: 22px; height: 22px; background: #1a3a5c; color: white; text-align: center; line-height: 22px; border-radius: 3px; font-size: 9pt; font-weight: bold; margin-right: 8px; vertical-align: middle; }
  .summary-table { width: 100%; border-collapse: collapse; font-size: 10pt; margin-bottom: 10px; }
  .summary-table td { padding: 4px 8px; border: 1px solid #ddd; }
  .summary-table .label { background: #f5f7fa; font-weight: 600; color: #333; width: 35%; }
  .indicators-row { display: flex; gap: 12px; margin: 8px 0 10px; }
  .indicator-box { flex: 1; text-align: center; border: 1px solid #d0d0d0; border-radius: 4px; padding: 8px 4px; }
  .indicator-val { display: block; font-size: 16pt; font-weight: bold; color: #1a3a5c; }
  .indicator-val.alert { color: #c0392b; }
  .indicator-lbl { display: block; font-size: 8pt; color: #666; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.3px; }
  .clinical-block { background: #fafbfc; border: 1px solid #e0e0e0; border-left: 3px solid #1a3a5c; padding: 10px 14px; margin: 6px 0; font-family: 'Courier New', monospace; font-size: 10pt; white-space: pre-wrap; word-break: break-word; line-height: 1.6; }
  .clinical-block.directive { border-left-color: #2980b9; }
  .clinical-block.reco { border-left-color: #27ae60; }
  .caregiver-section { border: 2px solid #e67e22; border-radius: 6px; padding: 12px 16px; margin: 16px 0; background: #fef9f2; }
  .caregiver-section h3 { color: #e67e22; font-size: 11pt; margin-bottom: 8px; }
  .caregiver-notice { font-size: 9pt; color: #888; font-style: italic; margin-bottom: 8px; }
  .caregiver-block { margin-bottom: 10px; }
  .caregiver-block h4 { font-size: 10pt; font-weight: bold; color: #d35400; margin-bottom: 4px; }
  .caregiver-text { font-size: 10pt; white-space: pre-wrap; line-height: 1.5; }
  .doc-footer { margin-top: 24px; border-top: 2px solid #1a3a5c; padding-top: 10px; font-size: 8.5pt; color: #666; }
  .doc-footer-grid { display: flex; justify-content: space-between; }
  .footer-label { font-weight: bold; color: #444; }
  .confidential { text-align: center; margin-top: 10px; font-size: 8pt; color: #999; text-transform: uppercase; letter-spacing: 1px; }
</style>
</head>
<body>
<div class="page">
  <div class="doc-header">
    <div>
      <span class="doc-institution">AXE Alzheimer e-Health</span>
      <span class="doc-subtitle">Plateforme de suivi clinique — Maladie d'Alzheimer et troubles neurocognitifs</span>
    </div>
    <div class="doc-header-right">
      <span class="doc-ref">Réf. RAP-${String(rapport.id).padStart(5, '0')}</span>
      <span>${dateGen}</span>
    </div>
  </div>
  <div class="doc-title"><h1>${rapport.titre || 'Rapport de suivi clinique'}</h1></div>
  <div class="section">
    <div class="section-title"><span class="section-letter">A</span> Synthèse clinique</div>
    <table class="summary-table">
      <tr><td class="label">Patient</td><td>${this.escapeHtml(patient)}</td></tr>
      <tr><td class="label">Période de suivi</td><td>${periodeStr}</td></tr>
      <tr><td class="label">Type de rapport</td><td>${rapport.typeRapport || '—'}</td></tr>
      <tr><td class="label">Statut du document</td><td>${rapport.statut || '—'}</td></tr>
      <tr><td class="label">Médecin rédacteur</td><td>${this.escapeHtml(auteur)}</td></tr>
      <tr><td class="label">Date de génération</td><td>${dateGen}</td></tr>
    </table>
  </div>
  ${this.hasIndicators(rapport) ? `<div class="section">
    <div class="section-title"><span class="section-letter">B</span> Indicateurs cliniques</div>
    <div class="indicators-row">
      ${rapport.tauxObservance != null ? `<div class="indicator-box"><span class="indicator-val${rapport.tauxObservance < 70 ? ' alert' : ''}">${rapport.tauxObservance}%</span><span class="indicator-lbl">Observance</span></div>` : ''}
      ${rapport.qualiteSommeil != null ? `<div class="indicator-box"><span class="indicator-val${rapport.qualiteSommeil < 5 ? ' alert' : ''}">${rapport.qualiteSommeil}/10</span><span class="indicator-lbl">Sommeil</span></div>` : ''}
      ${rapport.nbAlertes != null ? `<div class="indicator-box"><span class="indicator-val${rapport.nbAlertes > 0 ? ' alert' : ''}">${rapport.nbAlertes}</span><span class="indicator-lbl">Alertes</span></div>` : ''}
      ${rapport.nbInterventions != null ? `<div class="indicator-box"><span class="indicator-val">${rapport.nbInterventions}</span><span class="indicator-lbl">Interventions</span></div>` : ''}
      ${rapport.nbComportementsAnormaux != null ? `<div class="indicator-box"><span class="indicator-val${rapport.nbComportementsAnormaux > 0 ? ' alert' : ''}">${rapport.nbComportementsAnormaux}</span><span class="indicator-lbl">Comp. anormaux</span></div>` : ''}
    </div>
  </div>` : ''}
  ${rapport.contenuTexte ? `<div class="section"><div class="section-title"><span class="section-letter">C</span> Protocole thérapeutique</div><div class="clinical-block">${this.escapeHtml(rapport.contenuTexte)}</div></div>` : ''}
  ${rapport.directives ? `<div class="section"><div class="section-title"><span class="section-letter">D</span> Directives médicales</div><div class="clinical-block directive">${this.escapeHtml(rapport.directives)}</div></div>` : ''}
  ${rapport.recommandations ? `<div class="section"><div class="section-title"><span class="section-letter">E</span> Recommandations</div><div class="clinical-block reco">${this.escapeHtml(rapport.recommandations)}</div></div>` : ''}
  ${(rapport.directives || rapport.recommandations) ? `<div class="caregiver-section">
    <h3>★ Section simplifiée pour l'aidant / soignant</h3>
    <p class="caregiver-notice">Cette section résume les consignes en langage simplifié pour le personnel soignant et les aidants familiaux.</p>
    ${rapport.directives ? `<div class="caregiver-block"><h4>Ce qu'il faut faire :</h4><div class="caregiver-text">${this.escapeHtml(rapport.directives)}</div></div>` : ''}
    ${rapport.recommandations ? `<div class="caregiver-block"><h4>Ce qu'il faut surveiller :</h4><div class="caregiver-text">${this.escapeHtml(rapport.recommandations)}</div></div>` : ''}
  </div>` : ''}
  <div class="doc-footer">
    <div class="doc-footer-grid">
      <div><span class="footer-label">Auteur :</span> ${this.escapeHtml(auteur)}<br><span class="footer-label">Source :</span> AXE Alzheimer e-Health — Module Médecin</div>
      <div><span class="footer-label">Réf. :</span> RAP-${String(rapport.id).padStart(5, '0')}<br><span class="footer-label">Généré le :</span> ${dateGen}</div>
    </div>
    <p class="confidential">Document confidentiel — Données médicales protégées — Loi n° 2002-303 relative aux droits des malades</p>
  </div>
</div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RAP-${String(rapport.id).padStart(5, '0')}_${patient.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/']);
  }
}
