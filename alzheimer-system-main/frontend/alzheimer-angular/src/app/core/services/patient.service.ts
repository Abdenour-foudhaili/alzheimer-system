import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { getSessionUserId } from '../session-context';

export interface PatientProfile {
  id?: number;
  /** Identifiant corrélé côté client (session navigateur). */
  sessionUserId: string;
  firstName: string;
  lastName: string;
  age: number;
  
  bmi?: number;
  systolicBP?: number;
  diastolicBP?: number;
  heartRate?: number;
  bloodSugar?: number;
  cholesterolTotal?: number;
  smokingStatus?: string;
  alcoholConsumption?: string;
  physicalActivity?: number;
  dietQuality?: number;
  sleepQuality?: number;
  familyHistory?: boolean;
  diabetes?: boolean;
  hypertension?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private readonly apiUrl = `${environment.apiUrl}/patients`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'X-User-Id': getSessionUserId()
    });
  }

  getMe(): Observable<PatientProfile> {
    return this.http.get<PatientProfile>(`${this.apiUrl}/me`, { headers: this.getHeaders() });
  }

  updateMe(profile: PatientProfile): Observable<PatientProfile> {
    return this.http.post<PatientProfile>(`${this.apiUrl}/me`, profile, { headers: this.getHeaders() });
  }
}
