package com.benrevo.common.dto;

/**
 * Created by elliott on 6/16/17.
 */
public class QuoteOptionDisclaimerDto {

    private Long rfpQuoteOptionId;
    private Long rfpQuoteId;
    private String product;
    private Long carrierId;
    private String carrierName;
    private String disclaimer;
    private String type;

    public QuoteOptionDisclaimerDto() {
        super();
    }

    public QuoteOptionDisclaimerDto(String product, Long carrierId, String carrierName, String disclaimer) {
        super();
        this.product = product;
        this.carrierId = carrierId;
        this.carrierName = carrierName;
        this.disclaimer = disclaimer;
    }

    public Long getRfpQuoteOptionId() {
        return rfpQuoteOptionId;
    }

    public void setRfpQuoteOptionId(Long rfpQuoteOptionId) {
        this.rfpQuoteOptionId = rfpQuoteOptionId;
    }

    public String getDisclaimer() {
        return disclaimer;
    }

    public void setDisclaimer(String disclaimer) {
        this.disclaimer = disclaimer;
    }
    
    public String getProduct() {
        return product;
    }
    
    public void setProduct(String product) {
        this.product = product;
    }
    
    public Long getCarrierId() {
        return carrierId;
    }
    
    public void setCarrierId(Long carrierId) {
        this.carrierId = carrierId;
    }
    
    public String getCarrierName() {
        return carrierName;
    }

    public void setCarrierName(String carrierName) {
        this.carrierName = carrierName;
    }

    public Long getRfpQuoteId() {
        return rfpQuoteId;
    }

    public void setRfpQuoteId(Long rfpQuoteId) {
        this.rfpQuoteId = rfpQuoteId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
