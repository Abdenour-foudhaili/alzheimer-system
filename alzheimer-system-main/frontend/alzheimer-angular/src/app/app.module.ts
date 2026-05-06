import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader, TRANSLATE_HTTP_LOADER_CONFIG } from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { authInterceptor } from './auth.interceptor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      fallbackLang: 'fr',
      loader: { provide: TranslateLoader, useClass: TranslateHttpLoader }
    })
  ],
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    { provide: TRANSLATE_HTTP_LOADER_CONFIG, useValue: { prefix: './assets/i18n/' } }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
