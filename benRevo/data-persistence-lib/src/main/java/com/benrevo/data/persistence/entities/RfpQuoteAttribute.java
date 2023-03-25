package com.benrevo.data.persistence.entities;

import com.benrevo.common.enums.RFPAttributeName;
import com.benrevo.common.enums.RfpQuoteAttributeName;
import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
@DiscriminatorValue("QUOTE")
public class RfpQuoteAttribute extends Attribute {

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name = "ref")
    private RfpQuote rfpQuote;

    @Column(name = "name")
    @Enumerated(EnumType.STRING)
    protected RfpQuoteAttributeName name;

    @Column(name = "value")
    private String value;

    public RfpQuoteAttribute() {
    }

    public RfpQuoteAttribute(RfpQuote rfpQuote, RfpQuoteAttributeName name, String value) {
        this.rfpQuote = rfpQuote;
        this.name = name;
        this.value = value;
    }

    public RfpQuote getRfpQuote() {
        return rfpQuote;
    }

    public void setRfpQuote(RfpQuote rfpQuote) {
        this.rfpQuote = rfpQuote;
    }

    public RfpQuoteAttributeName getName() {
        return name;
    }

    public void setName(RfpQuoteAttributeName name) {
        this.name = name;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public RfpQuoteAttribute copy() {
        RfpQuoteAttribute copy = new RfpQuoteAttribute();
        copy.setName(name);
        copy.setValue(value);
        return copy;
    }

}
