package assistancequotidienne2.assistancequotidienne2.Entities;

public enum TypeRapport {
    HEBDOMADAIRE,
    MENSUEL,
    MEDICAL,
    PERSONNALISE,
    /** Ancienne valeur en base / ancien front — conservée pour lecture Hibernate */
    QUOTIDIEN
}
