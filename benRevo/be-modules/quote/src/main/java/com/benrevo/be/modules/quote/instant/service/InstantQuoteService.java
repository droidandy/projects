package com.benrevo.be.modules.quote.instant.service;

import com.benrevo.common.dto.AnthemCVProductQualificationDto;
import com.benrevo.common.dto.CreateProgramQuoteDto;
import com.benrevo.common.dto.RfpSubmissionStatusDto;
import com.benrevo.common.dto.ValidationErrorDto;
import com.benrevo.data.persistence.entities.RFP;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class InstantQuoteService{

    @Value("${app.carrier}")
    protected String[] appCarrier;

    @Value("${app.env}")
    protected String appEnv;
    
    public RfpSubmissionStatusDto startInstantQuoteGeneration(Long clientId, List<Long> rfpIds){
        throw new UnsupportedOperationException("Not implemented");
    }
    
    public AnthemCVProductQualificationDto doesUserQualifyForClearValue(Long clientId, 
        List<RFP> rfps, RfpSubmissionStatusDto rfpSubmissionStatusDto) {
        throw new UnsupportedOperationException("Not implemented");
    }

    public void generateProgramTrustQuote(Long clientId, CreateProgramQuoteDto params){
        throw new UnsupportedOperationException("Not implemented");
    }

    public ValidationErrorDto validateProgramRequirements(Long clientId, CreateProgramQuoteDto params){
        throw new UnsupportedOperationException("Not implemented");
    }
}
