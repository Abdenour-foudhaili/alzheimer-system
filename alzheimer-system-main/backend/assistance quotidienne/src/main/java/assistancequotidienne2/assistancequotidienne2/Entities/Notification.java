package assistancequotidienne2.assistancequotidienne2.Entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notification")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Destinataire (mÃ©decin ou soignant) */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "destinataire_id")
    @JsonIgnoreProperties({"patient", "rendezVous", "rapports"})
    private User destinataire;

    /** ExpÃ©diteur (soignant ou mÃ©decin) */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "expediteur_id")
    @JsonIgnoreProperties({"patient", "rendezVous", "rapports"})
    private User expediteur;

    /** Patient concernÃ© */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "patient_id")
    @JsonIgnoreProperties({"rendezVous", "rapports", "user", "emergencyContacts"})
    private Patient patient;

    private String type; // FICHE_TRANSMISSION, RAPPORT, ALERTE, etc.

    @Column(columnDefinition = "TEXT")
    private String titre;

    @Column(columnDefinition = "TEXT")
    private String message;

    private Boolean lu = false;
    private LocalDateTime dateCreation;
    private LocalDateTime dateLecture;

    /** ID de la ressource liÃ©e (fiche, rapport, etc.) */
    private Long referenceId;
    private String referenceType; // FicheTransmission, Rapport, etc.

    public Notification() {
        this.dateCreation = LocalDateTime.now();
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getDestinataire() { return destinataire; }
    public void setDestinataire(User destinataire) { this.destinataire = destinataire; }

    public User getExpediteur() { return expediteur; }
    public void setExpediteur(User expediteur) { this.expediteur = expediteur; }

    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getTitre() { return titre; }
    public void setTitre(String titre) { this.titre = titre; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Boolean getLu() { return lu; }
    public void setLu(Boolean lu) { this.lu = lu; }

    public LocalDateTime getDateCreation() { return dateCreation; }
    public void setDateCreation(LocalDateTime dateCreation) { this.dateCreation = dateCreation; }

    public LocalDateTime getDateLecture() { return dateLecture; }
    public void setDateLecture(LocalDateTime dateLecture) { this.dateLecture = dateLecture; }

    public Long getReferenceId() { return referenceId; }
    public void setReferenceId(Long referenceId) { this.referenceId = referenceId; }

    public String getReferenceType() { return referenceType; }
    public void setReferenceType(String referenceType) { this.referenceType = referenceType; }

    public void marquerLu() {
        this.lu = true;
        this.dateLecture = LocalDateTime.now();
    }
}
