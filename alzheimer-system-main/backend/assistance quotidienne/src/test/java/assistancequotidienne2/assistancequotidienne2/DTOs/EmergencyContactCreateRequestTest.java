package assistancequotidienne2.assistancequotidienne2.DTOs;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class EmergencyContactCreateRequestTest {

    @Test
    void resolvePatientId_prefersTopLevelPatientId() {
        EmergencyContactCreateRequest req = new EmergencyContactCreateRequest();
        req.setPatientId(10L);
        EmergencyContactCreateRequest.NestedPatient nested = new EmergencyContactCreateRequest.NestedPatient();
        nested.setIdPatient(20L);
        req.setPatient(nested);

        assertEquals(10L, req.resolvePatientId());
    }

    @Test
    void resolvePatientId_usesNestedIdPatient() {
        EmergencyContactCreateRequest req = new EmergencyContactCreateRequest();
        EmergencyContactCreateRequest.NestedPatient nested = new EmergencyContactCreateRequest.NestedPatient();
        nested.setIdPatient(7L);
        req.setPatient(nested);

        assertEquals(7L, req.resolvePatientId());
    }

    @Test
    void resolvePatientId_fallsBackToNestedId() {
        EmergencyContactCreateRequest req = new EmergencyContactCreateRequest();
        EmergencyContactCreateRequest.NestedPatient nested = new EmergencyContactCreateRequest.NestedPatient();
        nested.setId(3L);
        req.setPatient(nested);

        assertEquals(3L, req.resolvePatientId());
    }

    @Test
    void resolvePatientId_returnsNullWhenUnset() {
        EmergencyContactCreateRequest req = new EmergencyContactCreateRequest();
        assertNull(req.resolvePatientId());
    }
}
