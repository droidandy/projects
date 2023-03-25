package com.benrevo.data.persistence.repository;

import com.benrevo.common.enums.QuoteType;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.benrevo.data.persistence.entities.RfpQuoteOption;
import org.springframework.data.repository.query.Param;

public interface RfpQuoteOptionRepository extends CrudRepository<RfpQuoteOption, Long> {
	@Query(value = "select rqo from RfpQuoteOption rqo "
			+ "inner join rqo.rfpQuote rq "
			+ "inner join rq.rfpSubmission sub "
			+ "where sub.client.clientId = :clientId and rqo.finalSelection = true")
	List<RfpQuoteOption> findSelectedByClientId(@Param("clientId") Long clientId);
	
	@Query(value = "select rqo from RfpQuoteOption rqo "
        + "inner join rqo.rfpQuote rq "
        + "inner join rq.rfpSubmission sub "
        + "where sub.client.clientId = :clientId")
	List<RfpQuoteOption> findByClientId(@Param("clientId") Long clientId);

    @Query(value = "select rqo from RfpQuoteOption rqo "
        + "inner join rqo.rfpQuote rq "
        + "inner join rq.rfpSubmission sub "
        + "inner join sub.rfpCarrier rc "
        + "where sub.client.clientId = :clientId and rc.category = :category "
        + "and rq.latest = 1 and rq.quoteType <> 'DECLINED'")
    List<RfpQuoteOption> findByClientIdAndCategory(@Param("clientId") Long clientId, @Param("category") String category);

    @Query(value = "select rqo from RfpQuoteOption rqo "
        + "inner join rqo.rfpQuote rq "
        + "inner join rq.rfpSubmission sub "
        + "inner join sub.rfpCarrier rc "
        + "where sub.client.clientId = :clientId and rc.category = :category "
        + "and rq.latest = 1 and rq.quoteType = :quoteType and rq.quoteType <> 'DECLINED'")
    List<RfpQuoteOption> findByClientIdAndCategoryAndQuoteType(@Param("clientId") Long clientId,
        @Param("category") String category, @Param("quoteType") QuoteType quoteType);

	@Query(value = "select rqo from RfpQuoteOption rqo "
			+ "inner join rqo.rfpQuote rq "
			+ "inner join rq.rfpSubmission sub "
			+ "inner join sub.rfpCarrier rc "
			+ "where sub.client.clientId = :clientId and rc.category = :category and rqo.finalSelection = true")
	RfpQuoteOption findSelectedByClientIdAndCategory(@Param("clientId") Long clientId, @Param("category") String category);
	
	List<RfpQuoteOption> findByRfpQuoteRfpQuoteId(Long rfpQuoteId);
}
