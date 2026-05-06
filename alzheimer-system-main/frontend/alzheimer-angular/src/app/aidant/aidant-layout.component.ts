import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-aidant-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, TranslateModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './aidant-layout.component.html',
  styleUrls: ['./aidant-layout.component.css']
})
export class AidantLayoutComponent {
  aidantName = 'Aidant';
}
