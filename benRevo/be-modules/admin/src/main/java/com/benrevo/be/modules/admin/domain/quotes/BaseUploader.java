package com.benrevo.be.modules.admin.domain.quotes;

import com.benrevo.common.dto.QuoteChangesDto;
import com.benrevo.common.dto.QuoteUploaderDto;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.data.persistence.entities.RfpQuote;

import java.io.InputStream;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

/**
 * Created by lemdy on 6/8/17.
 */
@Service
@Transactional
public class BaseUploader {

    protected boolean isTest = false;
    protected boolean persist = true;
    protected boolean createRfpSubmissionIfNotFound = false;
    protected int foundPlans, missingPlans;
    protected Set<String> missingPlansList = new HashSet<>();

    protected HashMap<String, Integer> plans = new HashMap<>();

    public int getFoundPlans() {
        return foundPlans;
    }

    public int getMissingPlans() {
        return isTest ? missingPlans : 0;
    }

    public Set<String> getMissingPlansList() {
        return missingPlansList;
    }

    public void resetPlanStatistics() {
        foundPlans = missingPlans = 0;
        missingPlansList = new HashSet<>();
    }

    public QuoteUploaderDto validate(List<MultipartFile> files, Long clientId, Long brokerId) throws Exception{
        throw new UnsupportedOperationException("Not implemented");
    }

    public List<RfpQuote> run(List<MultipartFile> files, Long clientId, Long brokerId,
        QuoteUploaderDto dto, boolean isTest, boolean persist) throws Exception{
        throw new UnsupportedOperationException("Not implemented");
    }

    public RfpQuote run(InputStream fis, List<InputStream> fis2List, Long clientId, Long brokerId,
        QuoteType quoteType, String category, boolean isRenewal, boolean isTest) throws Exception{
        throw new UnsupportedOperationException("Not implemented");
    };
    
    public QuoteChangesDto findChanges(InputStream fis, List<InputStream> fis2List, Long clientId,
        Long brokerId, QuoteType quoteType, String category, boolean isRenewal, boolean isTest) throws Exception{
        throw new UnsupportedOperationException("Not implemented");
    };

    public boolean useForCarrier(String carrier){
        throw new UnsupportedOperationException("Not implemented");
    };

    public HashMap<String, Integer> getPlans() {
        return plans;
    }

    public void setPlans(HashMap<String, Integer> plans) {
        this.plans = plans;
    }

    public String getValueOrDefault(String value, String defaultValue) {
        return value != null ? value : defaultValue;
    }
}
