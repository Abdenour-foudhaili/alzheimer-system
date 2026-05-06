package assistancequotidienne2.assistancequotidienne2.Entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "rapport_hebdomadaire")
public class RapportHebdomadaire {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "patient_id")
    @JsonIgnoreProperties({"rendezVous", "rapports", "user", "emergencyContacts"})
    private Patient patient;

    private String patientNom;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "soignant_id")
    @JsonIgnoreProperties({"patient", "rendezVous", "rapports"})
    private User soignant;

    @Column(name = "date_debut")
    private LocalDate dateDebut;

    @Column(name = "date_fin")
    private LocalDate dateFin;

    @Column(columnDefinition = "TEXT")
    private String formulaireIdsJson; // JSON array of formulaire IDs

    private Double tauxObservanceMedicaments;
    private Double tauxObservanceRepas;
    private Double tauxObservanceRendezVous;

    @Column(columnDefinition = "TEXT")
    private String incidentsNotables;

    @Column(columnDefinition = "TEXT")
    private String observationsGenerales;

    private Boolean envoyeAuMedecin = false;
    private LocalDateTime dateEnvoi;
    private LocalDateTime dateCreation;

    private Boolean consulteParMedecin = false;
    private LocalDateTime dateConsultation;

    public RapportHebdomadaire() {
        this.dateCreation = LocalDateTime.now();
        this.envoyeAuMedecin = false;
        this.consulteParMedecin = false;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }

    public String getPatientNom() { return patientNom; }
    public void setPatientNom(String patientNom) { this.patientNom = patientNom; }

    public User getSoignant() { return soignant; }
    public void setSoignant(User soignant) { this.soignant = soignant; }

    public LocalDate getDateDebut() { return dateDebut; }
    public void setDateDebut(LocalDate dateDebut) { this.dateDebut = dateDebut; }

    public LocalDate getDateFin() { return dateFin; }
    public void setDateFin(LocalDate dateFin) { this.dateFin = dateFin; }

    public String getFormulaireIdsJson() { return formulaireIdsJson; }
    public void setFormulaireIdsJson(String formulaireIdsJson) { this.formulaireIdsJson = formulaireIdsJson; }

    public Double getTauxObservanceMedicaments() { return tauxObservanceMedicaments; }
    public void setTauxObservanceMedicaments(Double tauxObservanceMedicaments) { this.tauxObservanceMedicaments = tauxObservanceMedicaments; }

    public Double getTauxObservanceRepas() { return tauxObservanceRepas; }
    public void setTauxObservanceRepas(Double tauxObservanceRepas) { this.tauxObservanceRepas = tauxObservanceRepas; }

    public Double getTauxObservanceRendezVous() { return tauxObservanceRendezVous; }
    public void setTauxObservanceRendezVous(Double tauxObservanceRendezVous) { this.tauxObservanceRendezVous = tauxObservanceRendezVous; }

    public String getIncidentsNotables() { return incidentsNotables; }
    public void setIncidentsNotables(String incidentsNotables) { this.incidentsNotables = incidentsNotables; }

    public String getObservationsGenerales() { return observationsGenerales; }
    public void setObservationsGenerales(String observationsGenerales) { this.observationsGenerales = observationsGenerales; }

    public Boolean getEnvoyeAuMedecin() { return envoyeAuMedecin; }
    public void setEnvoyeAuMedecin(Boolean envoyeAuMedecin) { this.envoyeAuMedecin = envoyeAuMedecin; }

    public LocalDateTime getDateEnvoi() { return dateEnvoi; }
    public void setDateEnvoi(LocalDateTime dateEnvoi) { this.dateEnvoi = dateEnvoi; }

    public LocalDateTime getDateCreation() { return dateCreation; }
    public void setDateCreation(LocalDateTime dateCreation) { this.dateCreation = dateCreation; }

    public void marquerEnvoye() {
        this.envoyeAuMedecin = true;
        this.dateEnvoi = LocalDateTime.now();
    }

    public Boolean getConsulteParMedecin() { return consulteParMedecin; }
    public void setConsulteParMedecin(Boolean consulteParMedecin) { this.consulteParMedecin = consulteParMedecin; }

    public LocalDateTime getDateConsultation() { return dateConsultation; }
    public void setDateConsultation(LocalDateTime dateConsultation) { this.dateConsultation = dateConsultation; }

    public void marquerConsulte() {
        this.consulteParMedecin = true;
        this.dateConsultation = LocalDateTime.now();
    }
}
