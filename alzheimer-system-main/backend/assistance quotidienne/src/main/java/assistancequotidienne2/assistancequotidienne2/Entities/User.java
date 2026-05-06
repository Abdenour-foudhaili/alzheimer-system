package assistancequotidienne2.assistancequotidienne2.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import javax.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String mot_de_passe;
    
    @Enumerated(EnumType.STRING)
    private Role role;
    
    private String telephone;
    private Boolean actif = true;
    private LocalDateTime created_at;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    private Patient patient;

    @OneToMany(mappedBy = "soignant")
    @JsonIgnore
    private List<RendezVous> rendezVous;

    @OneToMany(mappedBy = "soignant")
    @JsonIgnore
    private List<Rapport> rapports;

    public User() {}

    public User(Long id, String nom, String email, String mot_de_passe, Role role,
                String telephone, Boolean actif, LocalDateTime created_at) {
        this.id = id;
        this.nom = nom;
        this.email = email;
        this.mot_de_passe = mot_de_passe;
        this.role = role;
        this.telephone = telephone;
        this.actif = actif;
        this.created_at = created_at;
    }

    @PrePersist
    protected void onCreate() {
        created_at = LocalDateTime.now();
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getMot_de_passe() { return mot_de_passe; }
    public void setMot_de_passe(String mot_de_passe) { this.mot_de_passe = mot_de_passe; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public Boolean getActif() { return actif; }
    public void setActif(Boolean actif) { this.actif = actif; }

    public LocalDateTime getCreated_at() { return created_at; }
    public void setCreated_at(LocalDateTime created_at) { this.created_at = created_at; }

    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }

    public List<RendezVous> getRendezVous() { return rendezVous; }
    public void setRendezVous(List<RendezVous> rendezVous) { this.rendezVous = rendezVous; }

    public List<Rapport> getRapports() { return rapports; }
    public void setRapports(List<Rapport> rapports) { this.rapports = rapports; }
}
