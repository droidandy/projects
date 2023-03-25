package com.benrevo.data.persistence.repository;

import com.benrevo.common.enums.QuoteType;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpSubmission;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RfpQuoteRepository extends JpaRepository<RfpQuote, Long>, RfpQuoteRepositoryCustom {
	
	@Query(value = "select rq.* from rfp_submission sub "
			+ "inner join rfp_carrier rc on rc.rfp_carrier_id = sub.rfp_carrier_id "
			+ "inner join rfp_quote rq on rq.rfp_submission_id = sub.rfp_submission_id "
			+ "where sub.client_id = :clientId and rc.category = :category "
			+ "and rq.latest = 1 and rq.quote_type <> 'DECLINED'", nativeQuery = true)
	List<RfpQuote> findByClientIdAndCategory(@Param("clientId") Long clientId, @Param("category") String category);
	
	@Query(value = "select rq from RfpQuote rq "
        + "where rq.rfpSubmission.client.clientId = :clientId "
        + "and rq.rfpSubmission.rfpCarrier.category = :category "
        + "and rq.latest = 1 and rq.quoteType = :quoteType")
	List<RfpQuote> findByClientIdAndCategoryAndQuoteType(@Param("clientId") Long clientId,
	    @Param("category") String category, @Param("quoteType") QuoteType quoteType);
	
	@Query(value = "select rq.* from rfp_submission sub "
        + "inner join rfp_quote rq on rq.rfp_submission_id = sub.rfp_submission_id "
        + "where sub.client_id = :clientId and rq.latest = 1 and rq.quote_type <> 'DECLINED'", nativeQuery = true)
	List<RfpQuote> findByClientId(@Param("clientId") Long clientId);

    @Query(value = "select rq.* from rfp_submission sub "
        + "inner join rfp_quote rq on rq.rfp_submission_id = sub.rfp_submission_id "
        + "where sub.client_id = :clientId and rq.latest = 1", nativeQuery = true)
    List<RfpQuote> findByClientIdIncludingDeclinedQuotes(@Param("clientId") Long clientId);

	RfpQuote findByRfpSubmissionAndRfpSubmissionClientClientIdAndLatestIsTrue(RfpSubmission rfpSubmission, Long clientId);
	
	List<RfpQuote> findByRfpSubmissionClientClientIdAndLatestAndQuoteType(Long clientId, boolean latest, QuoteType quoteType);
	
	RfpQuote findByRfpSubmissionRfpCarrierRfpCarrierIdAndRfpSubmissionClientClientIdAndLatestAndQuoteType(Long rfpCarrierId, Long clientId, boolean latest, QuoteType quoteType);
	
	RfpQuote findByRfpSubmissionProgramProgramIdAndRfpSubmissionClientClientIdAndLatestIsTrueAndQuoteType(Long programId, Long clientId, QuoteType quoteType);
}
