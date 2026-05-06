package assistancequotidienne2.assistancequotidienne2.DTOs;

/**
 * Corps JSON accepté par {@code POST /api/emergencyContact/addEmergencyContact}
 * (DTO Angular ou objet imbriqué avec {@code patient.idPatient}).
 */
public class EmergencyContactCreateRequest {

    private String fullName;
    private String relationship;
    private String phone;
    private String email;
    private Long patientId;
    private NestedPatient patient;

    public static class NestedPatient {
        private Long idPatient;
        private Long id;

        public Long getIdPatient() {
            return idPatient;
        }

        public void setIdPatient(Long idPatient) {
            this.idPatient = idPatient;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }
    }

    public Long resolvePatientId() {
        if (patientId != null) {
            return patientId;
        }
        if (patient != null) {
            if (patient.getIdPatient() != null) {
                return patient.getIdPatient();
            }
            return patient.getId();
        }
        return null;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getRelationship() {
        return relationship;
    }

    public void setRelationship(String relationship) {
        this.relationship = relationship;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public NestedPatient getPatient() {
        return patient;
    }

    public void setPatient(NestedPatient patient) {
        this.patient = patient;
    }
}
