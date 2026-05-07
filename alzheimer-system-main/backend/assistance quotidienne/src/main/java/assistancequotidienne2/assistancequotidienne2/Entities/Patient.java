package assistancequotidienne2.assistancequotidienne2.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import javax.persistence.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    private String nomComplet;
    
    @Column(name = "date_naissance")
    private LocalDate dateNaissance;
    
    private String adresse;
    
    @Column(name = "numero_de_telephone")
    private String numeroDeTelephone;

    private String antecedents;
    private String allergies;

    private Integer nbInterventionsMois = 0;
    private LocalDate derniereVisite;

    private Boolean actif = true;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "soignant_id")
    private User soignant;

    //@OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
    //@JsonIgnore
    //private List<Traitement> traitements;

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<RendezVous> rendezVous;

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Rapport> rapports;

    //@OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
    //@JsonIgnore
    //private List<MedicalRecord> medicalRecords;

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<EmergencyContact> emergencyContacts;

    //@OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
    //@JsonIgnore
    //private List<Treatment> treatments;

    public Patient() {}

    public Patient(Long id, User user, String nomComplet, LocalDate dateNaissance, String adresse,
                   String numeroDeTelephone, String antecedents, String allergies,
                   Integer nbInterventionsMois, LocalDate derniereVisite, Boolean actif) {
        this.id = id;
        this.user = user;
        this.nomComplet = nomComplet;
        this.dateNaissance = dateNaissance;
        this.adresse = adresse;
        this.numeroDeTelephone = numeroDeTelephone;
        this.antecedents = antecedents;
        this.allergies = allergies;
        this.nbInterventionsMois = nbInterventionsMois;
        this.derniereVisite = derniereVisite;
        this.actif = actif;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getNomComplet() { return nomComplet; }
    public void setNomComplet(String nomComplet) { this.nomComplet = nomComplet; }

    public LocalDate getDateNaissance() { return dateNaissance; }
    public void setDateNaissance(LocalDate dateNaissance) { this.dateNaissance = dateNaissance; }

    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }

    public String getNumeroDeTelephone() { return numeroDeTelephone; }
    public void setNumeroDeTelephone(String numeroDeTelephone) { this.numeroDeTelephone = numeroDeTelephone; }

    public String getAntecedents() { return antecedents; }
    public void setAntecedents(String antecedents) { this.antecedents = antecedents; }

    public String getAllergies() { return allergies; }
    public void setAllergies(String allergies) { this.allergies = allergies; }

    public Integer getNbInterventionsMois() { return nbInterventionsMois; }
    public void setNbInterventionsMois(Integer nbInterventionsMois) { this.nbInterventionsMois = nbInterventionsMois; }

    public LocalDate getDerniereVisite() { return derniereVisite; }
    public void setDerniereVisite(LocalDate derniereVisite) { this.derniereVisite = derniereVisite; }

    public Boolean getActif() { return actif; }
    public void setActif(Boolean actif) { this.actif = actif; }

    //public List<Traitement> getTraitements() { return traitements; }
    //public void setTraitements(List<Traitement> traitements) { this.traitements = traitements; }

    public List<RendezVous> getRendezVous() { return rendezVous; }
    public void setRendezVous(List<RendezVous> rendezVous) { this.rendezVous = rendezVous; }

    public List<Rapport> getRapports() { return rapports; }
    public void setRapports(List<Rapport> rapports) { this.rapports = rapports; }

    //public List<MedicalRecord> getMedicalRecords() { return medicalRecords; }
    //public void setMedicalRecords(List<MedicalRecord> medicalRecords) { this.medicalRecords = medicalRecords; }

    public List<EmergencyContact> getEmergencyContacts() { return emergencyContacts; }
    public void setEmergencyContacts(List<EmergencyContact> emergencyContacts) { this.emergencyContacts = emergencyContacts; }

    //public List<Treatment> getTreatments() { return treatments; }
    //public void setTreatments(List<Treatment> treatments) { this.treatments = treatments; }

    public User getSoignant() { return soignant; }
    public void setSoignant(User soignant) { this.soignant = soignant; }

    @Transient
    public int getAge() {
        if (dateNaissance == null) return 0;
        return LocalDate.now().getYear() - dateNaissance.getYear();
    }
}
