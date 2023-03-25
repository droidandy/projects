package com.benrevo.common.dto;

import com.benrevo.common.enums.QuoteType;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class QuoteUploaderDto {

    private Boolean needsMedicalQuoteType;
    private QuoteType medicalQuoteType;

    private Boolean needsDPPOOption;
    private DPPOOption DPPOOption;
    
    private String category;
    private QuoteType quoteType;
    
    private boolean renewal;
    private boolean addToExisted;

    private Set<QuoteParserErrorDto> errors = new HashSet<>();

    public static enum DPPOOption{
        ADD_TO_EXISTING_QUOTE,
        NEW_QUOTE
    }

    public Boolean getNeedsMedicalQuoteType() {
        return needsMedicalQuoteType;
    }

    public void setNeedsMedicalQuoteType(Boolean needsMedicalQuoteType) {
        this.needsMedicalQuoteType = needsMedicalQuoteType;
    }

    public QuoteType getMedicalQuoteType() {
        return medicalQuoteType;
    }

    public void setMedicalQuoteType(QuoteType medicalQuoteType) {
        this.medicalQuoteType = medicalQuoteType;
    }

    public Boolean getNeedsDPPOOption() {
        return needsDPPOOption;
    }

    public void setNeedsDPPOOption(Boolean needsDPPOOption) {
        this.needsDPPOOption = needsDPPOOption;
    }

    public DPPOOption getDPPOOption() {
        return DPPOOption;
    }

    public void setDPPOOption(DPPOOption DPPOOption) {
        this.DPPOOption = DPPOOption;
    }

    public Set<QuoteParserErrorDto> getErrors() {
        return errors;
    }

    public void setErrors(Set<QuoteParserErrorDto> errors) {
        this.errors = errors;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public QuoteType getQuoteType() {
        return quoteType;
    }

    public void setQuoteType(QuoteType quoteType) {
        this.quoteType = quoteType;
    }

    public boolean isRenewal() {
        return renewal;
    }

    public void setRenewal(boolean renewal) {
        this.renewal = renewal;
    }

    public boolean isAddToExisted() {
        return addToExisted;
    }

    public void setAddToExisted(boolean addToExisted) {
        this.addToExisted = addToExisted;
    }
}
