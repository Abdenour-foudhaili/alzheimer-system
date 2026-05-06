package assistancequotidienne2.assistancequotidienne2.Entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
public class FicheTransmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "patient_id")
    @JsonIgnoreProperties({"rendezVous", "rapports", "user", "emergencyContacts"})
    private Patient patient;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "soignant_id")
    @JsonIgnoreProperties({"patient", "rendezVous", "rapports"})
    private User soignant;

    private LocalDate dateFiche;
    private LocalDateTime dateCreation;
    private LocalDateTime dateEnvoi;

    private String statut; // brouillon, envoye, valide

    @Column(columnDefinition = "TEXT")
    private String patientInfoJson;

    @Column(columnDefinition = "TEXT")
    private String soignantInfoJson;

    @Column(columnDefinition = "TEXT")
    private String observanceMedicamentsJson;

    @Column(columnDefinition = "TEXT")
    private String alimentationJson;

    @Column(columnDefinition = "TEXT")
    private String vieSocialeJson;

    @Column(columnDefinition = "TEXT")
    private String suiviDirectivesJson;

    private Boolean signatureSoignant = false;

    @Column(columnDefinition = "TEXT")
    private String commentaireLibre;

    @Transient
    private String patientNom;

    @Transient
    private String soignantNom;

    public FicheTransmission() {
        this.dateCreation = LocalDateTime.now();
        this.dateFiche = LocalDate.now();
        this.statut = "brouillon";
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }

    public User getSoignant() { return soignant; }
    public void setSoignant(User soignant) { this.soignant = soignant; }

    public LocalDate getDateFiche() { return dateFiche; }
    public void setDateFiche(LocalDate dateFiche) { this.dateFiche = dateFiche; }

    public LocalDateTime getDateCreation() { return dateCreation; }
    public void setDateCreation(LocalDateTime dateCreation) { this.dateCreation = dateCreation; }

    public LocalDateTime getDateEnvoi() { return dateEnvoi; }
    public void setDateEnvoi(LocalDateTime dateEnvoi) { this.dateEnvoi = dateEnvoi; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public String getPatientInfoJson() { return patientInfoJson; }
    public void setPatientInfoJson(String patientInfoJson) { this.patientInfoJson = patientInfoJson; }

    public String getSoignantInfoJson() { return soignantInfoJson; }
    public void setSoignantInfoJson(String soignantInfoJson) { this.soignantInfoJson = soignantInfoJson; }

    public String getObservanceMedicamentsJson() { return observanceMedicamentsJson; }
    public void setObservanceMedicamentsJson(String observanceMedicamentsJson) { this.observanceMedicamentsJson = observanceMedicamentsJson; }

    public String getAlimentationJson() { return alimentationJson; }
    public void setAlimentationJson(String alimentationJson) { this.alimentationJson = alimentationJson; }

    public String getVieSocialeJson() { return vieSocialeJson; }
    public void setVieSocialeJson(String vieSocialeJson) { this.vieSocialeJson = vieSocialeJson; }

    public String getSuiviDirectivesJson() { return suiviDirectivesJson; }
    public void setSuiviDirectivesJson(String suiviDirectivesJson) { this.suiviDirectivesJson = suiviDirectivesJson; }

    public Boolean getSignatureSoignant() { return signatureSoignant; }
    public void setSignatureSoignant(Boolean signatureSoignant) { this.signatureSoignant = signatureSoignant; }

    public String getCommentaireLibre() { return commentaireLibre; }
    public void setCommentaireLibre(String commentaireLibre) { this.commentaireLibre = commentaireLibre; }

    public String getPatientNom() { return patientNom; }
    public void setPatientNom(String patientNom) { this.patientNom = patientNom; }

    public String getSoignantNom() { return soignantNom; }
    public void setSoignantNom(String soignantNom) { this.soignantNom = soignantNom; }

    public void marquerEnvoye() {
        this.statut = "envoye";
        this.dateEnvoi = LocalDateTime.now();
    }
}
