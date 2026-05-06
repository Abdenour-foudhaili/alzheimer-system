package assistancequotidienne2.assistancequotidienne2.Controllers;

import assistancequotidienne2.assistancequotidienne2.DTOs.EmergencyContactCreateRequest;
import assistancequotidienne2.assistancequotidienne2.Entities.EmergencyContact;
import assistancequotidienne2.assistancequotidienne2.Entities.Patient;
import assistancequotidienne2.assistancequotidienne2.Repositories.EmergencyContactRepository;
import assistancequotidienne2.assistancequotidienne2.Repositories.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emergencyContact")
@CrossOrigin(origins = "*")
public class EmergencyContactController {

    @Autowired
    private EmergencyContactRepository emergencyContactRepository;

    @Autowired
    private PatientRepository patientRepository;

    @PostMapping("/addEmergencyContact")
    public ResponseEntity<EmergencyContact> addEmergencyContact(@RequestBody EmergencyContactCreateRequest body) {
        Long pid = body.resolvePatientId();
        if (pid == null) {
            return ResponseEntity.badRequest().build();
        }
        Patient patient = patientRepository.findById(pid)
                .orElseThrow(() -> new RuntimeException("Patient non trouvé"));

        EmergencyContact contact = new EmergencyContact();
        contact.setFullName(body.getFullName());
        contact.setRelationship(body.getRelationship());
        contact.setPhone(body.getPhone());
        contact.setEmail(body.getEmail());
        contact.setPatient(patient);

        EmergencyContact saved = emergencyContactRepository.save(contact);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/allEmergencyContact")
    public ResponseEntity<List<EmergencyContact>> allEmergencyContact() {
        return ResponseEntity.ok(emergencyContactRepository.findAll());
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<EmergencyContact>> byPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(emergencyContactRepository.findByPatientId(patientId));
    }

    @DeleteMapping("/delete/{contactId}")
    public ResponseEntity<Void> delete(@PathVariable Long contactId) {
        if (!emergencyContactRepository.existsById(contactId)) {
            return ResponseEntity.notFound().build();
        }
        emergencyContactRepository.deleteById(contactId);
        return ResponseEntity.noContent().build();
    }
}
