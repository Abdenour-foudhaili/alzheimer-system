import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EmergencyContactService } from './emergency-contact.service';
import { environment } from '../../environments/environment';

describe('EmergencyContactService', () => {
  let service: EmergencyContactService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(EmergencyContactService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should POST new emergency contact', () => {
    const dto = {
      fullName: 'Marie',
      relationship: 'Épouse',
      phone: '0612345678',
      email: 'marie@test.fr',
      patientId: 9
    };

    service.createFromDTO(dto).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/emergencyContact/addEmergencyContact`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);
    req.flush({ idContact: 1, ...dto });
  });

  it('should GET contacts by patient', () => {
    service.getByPatient(4).subscribe((list) => {
      expect(list.length).toBe(0);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/emergencyContact/patient/4`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should DELETE contact', () => {
    service.delete(12).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/emergencyContact/delete/12`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
