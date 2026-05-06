import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'assistanceQuotidienne';

  constructor(private translate: TranslateService) {
    console.log('🚀 AppComponent initialized');
    translate.addLangs(['fr', 'en']);
    const savedLang = localStorage.getItem('lang');
    translate.use(savedLang === 'en' ? 'en' : 'fr');
    console.log('✅ Translation service configured');
  }
}
