package assistancequotidienne2.assistancequotidienne2.Entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import javax.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
public class Rapport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "patient_id")
    @JsonIgnoreProperties({"traitements", "rendezVous", "rappels", "rapports", "user", "emergencyContacts"})
    private Patient patient;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "soignant_id")
    @JsonIgnoreProperties({"patient", "rendezVous", "rapports"})
    private User soignant;

    @Enumerated(EnumType.STRING)
    private TypeRapport typeRapport;

    private LocalDate periodeDebut;
    private LocalDate periodeFin;

    @Column(columnDefinition = "TEXT")
    private String titre;

    @Column(columnDefinition = "TEXT")
    private String contenuTexte;

    private Integer nbAlertes = 0;
    private Integer nbInterventions = 0;
    private Double tauxObservance;
    private Double qualiteSommeil;
    private Integer nbComportementsAnormaux = 0;

    @Column(columnDefinition = "TEXT")
    private String directives;

    @Column(columnDefinition = "TEXT")
    private String recommandations;

    @Enumerated(EnumType.STRING)
    private FormatRapport formatExport = FormatRapport.PDF;

    private String cheminFichier;

    @Enumerated(EnumType.STRING)
    private StatutRapport statut = StatutRapport.GENERE;

    private LocalDateTime dateGeneration;

    private Boolean luParSoignant = false;
    private LocalDateTime dateLectureSoignant;

    public Rapport() {}

    @PrePersist
    protected void onCreate() {
        dateGeneration = LocalDateTime.now();
        
        if ((titre == null || titre.isEmpty()) && typeRapport != null && patient != null) {
            titre = String.format("Rapport %s - %s (%s Ã  %s)",
                typeRapport.name().toLowerCase(),
                patient.getNomComplet(),
                periodeDebut,
                periodeFin
            );
        }
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }

    public User getSoignant() { return soignant; }
    public void setSoignant(User soignant) { this.soignant = soignant; }

    public TypeRapport getTypeRapport() { return typeRapport; }
    public void setTypeRapport(TypeRapport typeRapport) { this.typeRapport = typeRapport; }

    public LocalDate getPeriodeDebut() { return periodeDebut; }
    public void setPeriodeDebut(LocalDate periodeDebut) { this.periodeDebut = periodeDebut; }

    public LocalDate getPeriodeFin() { return periodeFin; }
    public void setPeriodeFin(LocalDate periodeFin) { this.periodeFin = periodeFin; }

    public String getTitre() { return titre; }
    public void setTitre(String titre) { this.titre = titre; }

    public String getContenuTexte() { return contenuTexte; }
    public void setContenuTexte(String contenuTexte) { this.contenuTexte = contenuTexte; }

    public Integer getNbAlertes() { return nbAlertes; }
    public void setNbAlertes(Integer nbAlertes) { this.nbAlertes = nbAlertes; }

    public Integer getNbInterventions() { return nbInterventions; }
    public void setNbInterventions(Integer nbInterventions) { this.nbInterventions = nbInterventions; }

    public Double getTauxObservance() { return tauxObservance; }
    public void setTauxObservance(Double tauxObservance) { this.tauxObservance = tauxObservance; }

    public Double getQualiteSommeil() { return qualiteSommeil; }
    public void setQualiteSommeil(Double qualiteSommeil) { this.qualiteSommeil = qualiteSommeil; }

    public Integer getNbComportementsAnormaux() { return nbComportementsAnormaux; }
    public void setNbComportementsAnormaux(Integer nbComportementsAnormaux) { this.nbComportementsAnormaux = nbComportementsAnormaux; }

    public String getDirectives() { return directives; }
    public void setDirectives(String directives) { this.directives = directives; }

    public String getRecommandations() { return recommandations; }
    public void setRecommandations(String recommandations) { this.recommandations = recommandations; }

    public FormatRapport getFormatExport() { return formatExport; }
    public void setFormatExport(FormatRapport formatExport) { this.formatExport = formatExport; }

    public String getCheminFichier() { return cheminFichier; }
    public void setCheminFichier(String cheminFichier) { this.cheminFichier = cheminFichier; }

    public StatutRapport getStatut() { return statut; }
    public void setStatut(StatutRapport statut) { this.statut = statut; }

    public LocalDateTime getDateGeneration() { return dateGeneration; }
    public void setDateGeneration(LocalDateTime dateGeneration) { this.dateGeneration = dateGeneration; }

    public Boolean getLuParSoignant() { return luParSoignant; }
    public void setLuParSoignant(Boolean luParSoignant) { this.luParSoignant = luParSoignant; }

    public LocalDateTime getDateLectureSoignant() { return dateLectureSoignant; }
    public void setDateLectureSoignant(LocalDateTime dateLectureSoignant) { this.dateLectureSoignant = dateLectureSoignant; }

    public void marquerLuParSoignant() {
        this.luParSoignant = true;
        this.dateLectureSoignant = LocalDateTime.now();
    }

    @Transient
    public long getDureeJours() {
        if (periodeDebut == null || periodeFin == null) return 0;
        return java.time.temporal.ChronoUnit.DAYS.between(periodeDebut, periodeFin);
    }

    public void marquerEnvoye() {
        this.statut = StatutRapport.ENVOYE;
    }
}
