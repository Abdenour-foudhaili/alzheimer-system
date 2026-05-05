import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { SoignantService } from './soignant.service';
import { MessageService, ConfirmationService } from 'primeng/api';
// import keycloak from '../keycloak'; // TEMPORARY: Disabled

//hello
@Component({
  selector: 'app-soignant-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, TranslateModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './soignant-layout.component.html',
  styleUrls: ['./soignant-layout.component.css']
})
export class SoignantLayoutComponent implements OnInit {
  soignantName = 'Soignant'; // TEMPORARY: Hardcoded since Keycloak is disabled
  alertesNonTraiteesCount = 0;
  rapportsNonLusCount = 0;
  rapportHebdoNonEnvoye = false;
  notificationsCount = 0;
  constructor(private soignantService: SoignantService) { }

  ngOnInit(): void {
    this.refreshBadges();
  }

  refreshBadges(): void {
    const alertes = this.soignantService.getAlertesActives();
    const rapports = this.soignantService.getRapportsMedicauxRecus();
    const rapportsHebdo = this.soignantService.getRapportsHebdomadaires();
    const notifications = this.soignantService.getNotificationsTache();
    this.alertesNonTraiteesCount = alertes.filter(a => a.statut !== 'TRAITEE').length;
    this.rapportsNonLusCount = rapports.filter(r => !r.lu).length;
    this.rapportHebdoNonEnvoye = rapportsHebdo.some(r => !r.envoyeAuMedecin);
    this.notificationsCount = notifications.filter(n => n.statut === 'a_faire').length;
  }


}
