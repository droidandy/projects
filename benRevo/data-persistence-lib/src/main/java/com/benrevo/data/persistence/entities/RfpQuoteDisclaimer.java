package com.benrevo.data.persistence.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "rfp_quote_disclaimer")
public class RfpQuoteDisclaimer {
    
    @Id
    @Column(name = "rfp_quote_disclaimer_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long rfpQuoteDisclaimerId;

    @ManyToOne
    @JoinColumn(name="rfp_quote_id", referencedColumnName="rfp_quote_id", nullable=false)
    private RfpQuote rfpQuote;

    @Column (name = "type")
    private String type;

    @Column (name = "text", nullable = false)
    private String text;

    public RfpQuoteDisclaimer() {
    }
    
    public RfpQuoteDisclaimer(RfpQuote rfpQuote, String type, String text) {
        this.rfpQuote = rfpQuote;
        this.type = type;
        this.text = text;
    }

    public Long getRfpQuoteDisclaimerId() {
        return rfpQuoteDisclaimerId;
    }

    public void setRfpQuoteDisclaimerId(Long rfpQuoteDisclaimerId) {
        this.rfpQuoteDisclaimerId = rfpQuoteDisclaimerId;
    }

    public RfpQuote getRfpQuote() {
        return rfpQuote;
    }

    public void setRfpQuote(RfpQuote rfpQuote) {
        this.rfpQuote = rfpQuote;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    
}
