package com.benrevo.data.persistence.repository;

import com.benrevo.data.persistence.entities.ClientFileUpload;
import org.springframework.data.repository.CrudRepository;
import java.util.List;

public interface ClientFileRepository extends CrudRepository<ClientFileUpload, Long> {

    List<ClientFileUpload> findByRfpIdAndDeleted(Long rfpId, boolean deleted);

}
