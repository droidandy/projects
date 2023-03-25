package com.benrevo.common.dto;

import com.benrevo.common.enums.QuoteState;
import com.benrevo.common.enums.QuoteType;

/**
 * Created by lemdy on 7/25/17.
 */
public class QuoteStatusDto {

    private QuoteState status;
    private QuoteType type;
    private String carrierName;
    private String carrierDisplayName;

    public QuoteState getStatus() {
        return status;
    }

    public void setStatus(QuoteState status) {
        this.status = status;
    }

    public QuoteType getType() {
        return type;
    }

    public void setType(QuoteType type) {
        this.type = type;
    }

    public String getCarrierName() {
        return carrierName;
    }

    public void setCarrierName(String carrierName) {
        this.carrierName = carrierName;
    }

    public String getCarrierDisplayName() {
        return carrierDisplayName;
    }

    public void setCarrierDisplayName(String carrierDisplayName) {
        this.carrierDisplayName = carrierDisplayName;
    }
}
