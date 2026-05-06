import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Treatment {
  idTreatment?: number;
  treatmentName: string;
  dosage: string;
  frequency: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  patient?: {
    idPatient: number;
  };
}

export interface TreatmentDTO {
  treatmentName: string;
  dosage: string;
  frequency: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  patientId: number;
}

/** Réponse Spring Boot (entité Traitement) */
interface TraitementApi {
  id: number;
  nomMedicament?: string;
  dosage?: string;
  frequence?: string;
  dateDebut?: string;
  dateFin?: string;
  actif?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TreatmentService {
  private baseUrl = `${environment.apiUrl}/traitements`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  private mapFromApi(t: TraitementApi): Treatment {
    return {
      idTreatment: t.id,
      treatmentName: t.nomMedicament ?? '',
      dosage: t.dosage ?? '',
      frequency: t.frequence ?? '',
      startDate: t.dateDebut ?? '',
      endDate: t.dateFin ?? '',
      status: t.actif === false ? 'Inactive' : 'Active'
    };
  }

  create(treatment: Treatment): Observable<Treatment> {
    const payload = this.toPayload(treatment);
    return this.http
      .post<TraitementApi>(`${this.baseUrl}`, payload, { headers: this.getHeaders() })
      .pipe(map((row) => this.mapFromApi(row)));
  }

  createFromDTO(dto: TreatmentDTO): Observable<Treatment> {
    const payload = {
      patient: { id: dto.patientId },
      nomMedicament: dto.treatmentName,
      dosage: dto.dosage ?? '',
      frequence: dto.frequency ?? '',
      dateDebut: dto.startDate || null,
      dateFin: dto.endDate || null,
      actif: dto.status !== 'Inactive'
    };
    return this.http
      .post<TraitementApi>(`${this.baseUrl}`, payload, { headers: this.getHeaders() })
      .pipe(map((row) => this.mapFromApi(row)));
  }

  getAll(): Observable<Treatment[]> {
    return this.http
      .get<TraitementApi[]>(`${this.baseUrl}`, { headers: this.getHeaders() })
      .pipe(map((rows) => rows.map((t) => this.mapFromApi(t))));
  }

  getByPatient(patientId: number): Observable<Treatment[]> {
    return this.http
      .get<TraitementApi[]>(`${this.baseUrl}/patient/${patientId}`, { headers: this.getHeaders() })
      .pipe(map((rows) => rows.map((t) => this.mapFromApi(t))));
  }

  delete(treatmentId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${treatmentId}`, { headers: this.getHeaders() });
  }

  private toPayload(t: Treatment): Record<string, unknown> {
    return {
      patient: t.patient?.idPatient ? { id: t.patient.idPatient } : undefined,
      nomMedicament: t.treatmentName,
      dosage: t.dosage,
      frequence: t.frequency,
      dateDebut: t.startDate || null,
      dateFin: t.endDate || null,
      actif: t.status !== 'Inactive'
    };
  }
}
