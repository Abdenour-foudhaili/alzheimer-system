package assistancequotidienne2.assistancequotidienne2.Controllers;

import assistancequotidienne2.assistancequotidienne2.Entities.Patient;
import assistancequotidienne2.assistancequotidienne2.Entities.User;
import assistancequotidienne2.assistancequotidienne2.Repositories.PatientRepository;
import assistancequotidienne2.assistancequotidienne2.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private UserRepository userRepository;

    // CREATE
    @PostMapping
    public ResponseEntity<Patient> create(@RequestBody Patient patient) {
        patient.setId(null);
        patient.setUser(null);
        patient.setRendezVous(null);
        patient.setRapports(null);
        patient.setEmergencyContacts(null);

        User soignantRef = patient.getSoignant();
        if (soignantRef != null && soignantRef.getId() != null) {
            patient.setSoignant(userRepository.findById(soignantRef.getId()).orElse(null));
        } else {
            patient.setSoignant(null);
        }

        if (patient.getActif() == null) {
            patient.setActif(true);
        }
        return ResponseEntity.ok(patientRepository.save(patient));
    }

    // READ ALL
    @GetMapping
    public ResponseEntity<List<Patient>> getAll() {
        return ResponseEntity.ok(patientRepository.findAll());
    }

    // READ BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Patient> getById(@PathVariable Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient non trouvé avec l'id: " + id));
        return ResponseEntity.ok(patient);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Patient> update(@PathVariable Long id, @RequestBody Patient patient) {
        Patient existing = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient non trouvé avec l'id: " + id));

        existing.setNomComplet(patient.getNomComplet());
        existing.setDateNaissance(patient.getDateNaissance());
        existing.setAdresse(patient.getAdresse());
        existing.setNumeroDeTelephone(patient.getNumeroDeTelephone());
        existing.setAntecedents(patient.getAntecedents());
        existing.setAllergies(patient.getAllergies());
        existing.setNbInterventionsMois(patient.getNbInterventionsMois());
        existing.setDerniereVisite(patient.getDerniereVisite());
        existing.setActif(patient.getActif());

        return ResponseEntity.ok(patientRepository.save(existing));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        patientRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // SEARCH BY NAME
    @GetMapping("/search")
    public ResponseEntity<List<Patient>> searchByName(@RequestParam String nom) {
        return ResponseEntity.ok(patientRepository.findByNomCompletContaining(nom));
    }

    // GET ACTIVE PATIENTS
    @GetMapping("/actifs")
    public ResponseEntity<List<Patient>> getActivePatients() {
        return ResponseEntity.ok(patientRepository.findByActifTrue());
    }

    // GET BY STATUS (actif/inactif)
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Patient>> getByStatus(@PathVariable String status) {
        if ("actif".equalsIgnoreCase(status)) {
            return ResponseEntity.ok(patientRepository.findByActifTrue());
        } else {
            // Retourner tous les patients inactifs
            List<Patient> all = patientRepository.findAll();
            all.removeIf(Patient::getActif);
            return ResponseEntity.ok(all);
        }
    }

    // UPDATE STATUS
    @PatchMapping("/{id}/status")
    public ResponseEntity<Patient> updateStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient non trouvé avec l'id: " + id));
        
        String status = body.get("status");
        patient.setActif("actif".equalsIgnoreCase(status));
        return ResponseEntity.ok(patientRepository.save(patient));
    }

    // GET INTERVENTIONS DU MOIS
    @GetMapping("/{id}/interventions-mois")
    public ResponseEntity<Integer> getInterventionsMois(@PathVariable Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient non trouvé avec l'id: " + id));
        return ResponseEntity.ok(patient.getNbInterventionsMois() != null ? patient.getNbInterventionsMois() : 0);
    }

    // ASSIGNER UN SOIGNANT À UN PATIENT
    @PatchMapping("/{id}/assigner-soignant")
    public ResponseEntity<Patient> assignerSoignant(@PathVariable Long id, @RequestBody java.util.Map<String, Long> body) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient non trouvé avec l'id: " + id));

        Long soignantId = body.get("soignantId");
        if (soignantId == null) {
            // Retirer l'assignation
            patient.setSoignant(null);
        } else {
            User soignant = userRepository.findById(soignantId)
                    .orElseThrow(() -> new RuntimeException("Soignant non trouvé avec l'id: " + soignantId));
            patient.setSoignant(soignant);
        }
        return ResponseEntity.ok(patientRepository.save(patient));
    }

    // GET PATIENTS PAR SOIGNANT
    @GetMapping("/soignant/{soignantId}")
    public ResponseEntity<List<Patient>> getBySoignant(@PathVariable Long soignantId) {
        return ResponseEntity.ok(patientRepository.findBySoignantId(soignantId));
    }
}
