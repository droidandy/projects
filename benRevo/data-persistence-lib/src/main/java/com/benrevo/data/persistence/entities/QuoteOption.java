package com.benrevo.data.persistence.entities;

/**
 * Common interface for RfpQuoteOption and RfpQuoteAncillaryOption
 */
public interface QuoteOption {

    Long getOptionId();
    
    RfpQuote getRfpQuote();
    
    String getName();
    
    String getDisplayName();

}
