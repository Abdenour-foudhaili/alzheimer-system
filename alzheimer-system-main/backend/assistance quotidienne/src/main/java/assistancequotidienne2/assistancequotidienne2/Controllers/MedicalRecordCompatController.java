package assistancequotidienne2.assistancequotidienne2.Controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * Compatibilité avec le front (doctor-patients) : pas d’entité dossier médical dans ce service.
 * Les endpoints renvoient des listes vides ou des réponses minimales pour éviter les 404.
 */
@RestController
@RequestMapping("/api/medicalRecord")
@CrossOrigin(origins = "*")
public class MedicalRecordCompatController {

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Map<String, Object>>> getByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(Collections.emptyList());
    }

    @GetMapping("/allMedicalRecord")
    public ResponseEntity<List<Map<String, Object>>> getAll() {
        return ResponseEntity.ok(Collections.emptyList());
    }

    @PostMapping("/addMedicalRecord")
    public ResponseEntity<Map<String, Object>> add(@RequestBody Map<String, Object> body) {
        Map<String, Object> res = new LinkedHashMap<>();
        res.put("idRecord", System.currentTimeMillis());
        res.put("diagnosis", body.getOrDefault("diagnosis", ""));
        res.put("diseaseStage", body.getOrDefault("diseaseStage", ""));
        res.put("medicalHistory", body.getOrDefault("medicalHistory", ""));
        res.put("allergies", body.getOrDefault("allergies", ""));
        Object pid = body.get("patientId");
        long patientId = pid instanceof Number ? ((Number) pid).longValue() : 0L;
        res.put("patient", Map.of("idPatient", patientId));
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/delete/{recordId}")
    public ResponseEntity<Void> delete(@PathVariable Long recordId) {
        return ResponseEntity.noContent().build();
    }
}
