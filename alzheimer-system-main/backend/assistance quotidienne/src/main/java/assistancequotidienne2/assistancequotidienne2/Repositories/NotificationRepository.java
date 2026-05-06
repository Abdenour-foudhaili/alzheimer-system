package assistancequotidienne2.assistancequotidienne2.Repositories;

import assistancequotidienne2.assistancequotidienne2.Entities.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    @Query("SELECT n FROM Notification n WHERE n.destinataire.id = :userId ORDER BY n.dateCreation DESC")
    List<Notification> findByDestinataireIdOrderByDateCreationDesc(@Param("userId") Long userId);

    @Query("SELECT n FROM Notification n WHERE n.destinataire.id = :userId AND n.lu = false ORDER BY n.dateCreation DESC")
    List<Notification> findByDestinataireIdAndLuFalseOrderByDateCreationDesc(@Param("userId") Long userId);

    @Query("SELECT COUNT(n) FROM Notification n WHERE n.destinataire.id = :userId AND n.lu = false")
    long countByDestinataireIdAndLuFalse(@Param("userId") Long userId);

    List<Notification> findByPatientIdOrderByDateCreationDesc(Long patientId);
}
