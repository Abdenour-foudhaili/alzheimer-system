package assistancequotidienne2.assistancequotidienne2.Controllers;

import assistancequotidienne2.assistancequotidienne2.DTOs.EmergencyContactCreateRequest;
import assistancequotidienne2.assistancequotidienne2.Entities.EmergencyContact;
import assistancequotidienne2.assistancequotidienne2.Entities.Patient;
import assistancequotidienne2.assistancequotidienne2.Repositories.EmergencyContactRepository;
import assistancequotidienne2.assistancequotidienne2.Repositories.PatientRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmergencyContactControllerTest {

    @Mock
    private EmergencyContactRepository emergencyContactRepository;

    @Mock
    private PatientRepository patientRepository;

    @InjectMocks
    private EmergencyContactController controller;

    @Test
    void addEmergencyContact_returnsBadRequestWhenPatientIdMissing() {
        EmergencyContactCreateRequest body = new EmergencyContactCreateRequest();
        body.setFullName("Jane Doe");

        ResponseEntity<EmergencyContact> response = controller.addEmergencyContact(body);

        assertEquals(400, response.getStatusCodeValue());
    }

    @Test
    void addEmergencyContact_throwsWhenPatientNotFound() {
        EmergencyContactCreateRequest body = new EmergencyContactCreateRequest();
        body.setPatientId(404L);
        body.setFullName("Jane Doe");

        when(patientRepository.findById(404L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> controller.addEmergencyContact(body));
    }

    @Test
    void addEmergencyContact_persistsAndReturnsOk() {
        Patient patient = new Patient();
        patient.setId(1L);

        EmergencyContactCreateRequest body = new EmergencyContactCreateRequest();
        body.setPatientId(1L);
        body.setFullName("Jane Doe");
        body.setRelationship("Fille");
        body.setPhone("0600000000");
        body.setEmail("jane@example.com");

        EmergencyContact saved = new EmergencyContact();
        saved.setId(10L);
        saved.setFullName("Jane Doe");

        when(patientRepository.findById(1L)).thenReturn(Optional.of(patient));
        when(emergencyContactRepository.save(any(EmergencyContact.class))).thenReturn(saved);

        ResponseEntity<EmergencyContact> response = controller.addEmergencyContact(body);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(10L, response.getBody().getId());
        verify(emergencyContactRepository).save(any(EmergencyContact.class));
    }

    @Test
    void allEmergencyContact_returnsList() {
        when(emergencyContactRepository.findAll()).thenReturn(List.of(new EmergencyContact()));

        ResponseEntity<List<EmergencyContact>> response = controller.allEmergencyContact();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void byPatient_returnsContactsForPatient() {
        when(emergencyContactRepository.findByPatientId(2L)).thenReturn(List.of());

        ResponseEntity<List<EmergencyContact>> response = controller.byPatient(2L);

        assertEquals(200, response.getStatusCodeValue());
        verify(emergencyContactRepository).findByPatientId(2L);
    }

    @Test
    void delete_returnsNotFoundWhenMissing() {
        when(emergencyContactRepository.existsById(99L)).thenReturn(false);

        ResponseEntity<Void> response = controller.delete(99L);

        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    void delete_returnsNoContentWhenPresent() {
        when(emergencyContactRepository.existsById(5L)).thenReturn(true);

        ResponseEntity<Void> response = controller.delete(5L);

        assertEquals(204, response.getStatusCodeValue());
        verify(emergencyContactRepository).deleteById(5L);
    }
}
