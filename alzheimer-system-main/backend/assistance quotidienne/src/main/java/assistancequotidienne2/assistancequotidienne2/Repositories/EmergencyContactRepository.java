package assistancequotidienne2.assistancequotidienne2.Repositories;

import assistancequotidienne2.assistancequotidienne2.Entities.EmergencyContact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmergencyContactRepository extends JpaRepository<EmergencyContact, Long> {

    List<EmergencyContact> findByPatientId(Long patientId);
}
