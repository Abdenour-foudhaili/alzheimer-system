import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TreatmentService } from './treatment.service';
import { environment } from '../../environments/environment';

describe('TreatmentService', () => {
  let service: TreatmentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(TreatmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should POST traitement payload mapped from Treatment', () => {
    service
      .create({
        treatmentName: 'Donepezil',
        dosage: '5mg',
        frequency: '1/j',
        patient: { idPatient: 1 }
      })
      .subscribe((t) => {
        expect(t.idTreatment).toBe(42);
        expect(t.treatmentName).toBe('Donepezil');
        expect(t.status).toBe('Active');
      });

    const req = httpMock.expectOne(`${environment.apiUrl}/traitements`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(
      jasmine.objectContaining({
        nomMedicament: 'Donepezil',
        patient: { id: 1 },
        actif: true
      })
    );
    req.flush({
      id: 42,
      nomMedicament: 'Donepezil',
      dosage: '5mg',
      frequence: '1/j',
      actif: true
    });
  });

  it('should map inactive traitement to status Inactive', () => {
    service.getByPatient(5).subscribe((items) => {
      expect(items.length).toBe(1);
      expect(items[0].status).toBe('Inactive');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/traitements/patient/5`);
    req.flush([{ id: 1, nomMedicament: 'X', actif: false }]);
  });

  it('should DELETE by id', () => {
    service.delete(8).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/traitements/8`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
