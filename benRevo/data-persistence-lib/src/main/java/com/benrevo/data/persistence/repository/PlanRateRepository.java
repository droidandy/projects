package com.benrevo.data.persistence.repository;

import com.benrevo.common.enums.PlanRateType;
import com.benrevo.data.persistence.entities.PlanRate;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface PlanRateRepository extends CrudRepository<PlanRate, Long> {
    
    @Query("select pr from ProgramToPnn p2pnn  "
        + "inner join PlanRate pr on pr.programToPnnId = p2pnn.programToPnnId "
        + "where p2pnn.programId = :programId "
        + "and (:ratingBand is null or pr.ratingBand = :ratingBand) "
        // note: if :rateType = null, we want to ignore pr.type and pr.typeValue values cheking in query
        + "and (:rateType is null or (pr.type = :rateType and pr.typeValue = :typeValue)) ")
    List<PlanRate> findByProgramIdAndRatingBandAndRateTypeAndValue(@Param("programId") Long programId, 
        @Param("ratingBand") Float ratingBand, @Param("rateType") PlanRateType rateType, @Param("typeValue") String typeValue);
    
    @Query("select pr from ProgramToPnn p2pnn  "
        + "inner join PlanRate pr on pr.programToPnnId = p2pnn.programToPnnId "
        + "where p2pnn.programId = :programId "
        + "and (:rateType is null or (pr.type = :rateType and pr.typeValue = :typeValue)) "
        + "and (:rateType2 is null or (pr.type2 = :rateType2 and pr.typeValue2 = :typeValue2)) "
        + "and (:rateType3 is null or (pr.type3 = :rateType3 and pr.typeValue3 = :typeValue3)) ")
    List<PlanRate> findByProgramIdAndRateTypeAndValue(@Param("programId") Long programId, 
        @Param("rateType") PlanRateType rateType, @Param("typeValue") String typeValue,
        @Param("rateType2") PlanRateType rateType2, @Param("typeValue2") String typeValue2,
        @Param("rateType3") PlanRateType rateType3, @Param("typeValue3") String typeValue3);
    
    @Query("select pr from ProgramToPnn p2pnn  "
        + "inner join PlanRate pr on pr.programToPnnId = p2pnn.programToPnnId "
        + "where p2pnn.programId = :programId and pr.type = :rateType "
        + "and (:ratingBand is null or pr.ratingBand = :ratingBand) ")
    List<PlanRate> findByProgramIdAndRatingBandAndRateType(@Param("programId") Long programId, 
        @Param("ratingBand") Float ratingBand, @Param("rateType") PlanRateType rateType);
    
    @Query("select pr from ProgramToPnn p2pnn  "
        + "inner join PlanRate pr on pr.programToPnnId = p2pnn.programToPnnId "
        + "where p2pnn.programId = :programId ")
    List<PlanRate> findByProgramId(@Param("programId") Long programId);

    PlanRate findByProgramToPnnIdAndRatingTiersAndRatingBandAndTypeAndTypeValueAndType2AndTypeValue2AndType3AndTypeValue3(
        Long programToPnnId, Integer ratingTiers, Float ratingBand, PlanRateType type, String typeValue,
        PlanRateType type2, String typeValue2, PlanRateType type3, String typeValue3);
    
}

