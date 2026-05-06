import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PatientService } from './patient.service';
import { environment } from '../../environments/environment';

describe('PatientService', () => {
  let service: PatientService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(PatientService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should GET all patients', () => {
    service.getAll().subscribe((rows) => {
      expect(rows.length).toBe(1);
      expect(rows[0].nomComplet).toBe('Dupont Jean');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/patients`);
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, nomComplet: 'Dupont Jean' }]);
  });

  it('should GET patient by id', () => {
    service.getById(3).subscribe((p) => {
      expect(p.id).toBe(3);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/patients/3`);
    req.flush({ id: 3, nomComplet: 'Test' });
  });

  it('should map PATIENT users in getAllFromUsers', () => {
    service.getAllFromUsers().subscribe((patients) => {
      expect(patients.length).toBe(1);
      expect(patients[0].id).toBe(77);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/users`);
    req.flush([
      { id: 10, role: 'SOIGNANT', nom: 'Doc' },
      {
        id: 11,
        role: 'PATIENT',
        nom: 'Martin',
        patient: { id: 77, prenom: 'Paul', nom: 'Martin' }
      }
    ]);
  });

  it('should emit on triggerRefresh', () => {
    let emissions = 0;
    service.refresh$.subscribe(() => emissions++);
    service.triggerRefresh();
    expect(emissions).toBe(1);
  });
});
