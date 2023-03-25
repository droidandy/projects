package com.benrevo.common.dto;

import com.benrevo.common.dto.PresentationAlternativeDto.PresentationAlternativeBundlingDiscount;
import java.util.ArrayList;
import java.util.List;

public class PresentationUpdateDto {

    // update each card in alternative column
    private Long presentationOptionId;
    private Long rfpQuoteOptionId;
    private String product;

    // or update the bundling discounts
    private List<PresentationAlternativeBundlingDiscount> bundlingDiscounts = new ArrayList<>();
    
    public Long getPresentationOptionId() {
        return presentationOptionId;
    }
    public void setPresentationOptionId(Long presentationOptionId) {
        this.presentationOptionId = presentationOptionId;
    }
    public Long getRfpQuoteOptionId() {
        return rfpQuoteOptionId;
    }
    public void setRfpQuoteOptionId(Long rfpQuoteOptionId) {
        this.rfpQuoteOptionId = rfpQuoteOptionId;
    }
    public String getProduct() {
        return product;
    }
    public void setProduct(String product) {
        this.product = product;
    }

    public List<PresentationAlternativeBundlingDiscount> getBundlingDiscounts() {
        return bundlingDiscounts;
    }

    public void setBundlingDiscounts(
        List<PresentationAlternativeBundlingDiscount> bundlingDiscounts) {
        this.bundlingDiscounts = bundlingDiscounts;
    }
}
