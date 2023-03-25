/**
 * 
 */
package com.benrevo.data.persistence.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.benrevo.common.enums.DocumentAttributeName;
import com.benrevo.data.persistence.entities.Document;

public interface DocumentRepository extends JpaRepository<Document, Long> {
	
    Document findByCarrierCarrierIdAndFileName(Long carrierId, String fileName);
    
    List<Document> findByCarrierCarrierId(Long carrierId);
    
    @Query("select d from Document d where d.carrier.carrierId = :carrierId and d.fileName like %:fileName%")
    List<Document> searchByCarrierIdAndFileName(@Param("carrierId") Long carrierId, @Param("fileName") String fileName);
    
    @Query("select d from Document d inner join d.attributes a where d.carrier.carrierId = :carrierId and a.name in :tags" )
    List<Document> findByCarrierIdAndAttributes(@Param("carrierId") Long carrierId, @Param("tags") List<DocumentAttributeName> tags);
    
    @Query("select d from Document d inner join d.attributes a where d.carrier.carrierId = :carrierId and d.fileName like %:fileName% and a.name in :tags" )
    List<Document> findByCarrierIdAndFileNameAndAttributes(@Param("carrierId") Long carrierId, @Param("fileName") String fileName, @Param("tags") List<DocumentAttributeName> tags);
    
}
