package com.benrevo.common.dto;

public class RiderDto {

    private Long riderId;

    private String riderCode;

    private String riderDescription;

    private boolean selected;

    private boolean selectable;

    private Float tier1Rate;

    private Float tier2Rate;

    private Float tier3Rate;

    private Float tier4Rate;

    public RiderDto() {
    }

    public String getRiderCode() {
        return riderCode;
    }

    public void setRiderCode(String riderCode) {
        this.riderCode = riderCode;
    }

    public String getRiderDescription() {
        return riderDescription;
    }

    public void setRiderDescription(String riderDescription) {
        this.riderDescription = riderDescription;
    }

    public Float getTier1Rate() {
        return tier1Rate;
    }

    public void setTier1Rate(Float tier1Rate) {
        this.tier1Rate = tier1Rate;
    }

    public Float getTier2Rate() {
        return tier2Rate;
    }

    public void setTier2Rate(Float tier2Rate) {
        this.tier2Rate = tier2Rate;
    }

    public Float getTier3Rate() {
        return tier3Rate;
    }

    public void setTier3Rate(Float tier3Rate) {
        this.tier3Rate = tier3Rate;
    }

    public Float getTier4Rate() {
        return tier4Rate;
    }

    public void setTier4Rate(Float tier4Rate) {
        this.tier4Rate = tier4Rate;
    }

    public Long getRiderId() {
        return riderId;
    }

    public void setRiderId(Long riderId) {
        this.riderId = riderId;
    }

    public boolean isSelected() {
        return selected;
    }

    public void setSelected(boolean selected) {
        this.selected = selected;
    }

    public boolean isSelectable() {
        return selectable;
    }

    public void setSelectable(boolean selectable) {
        this.selectable = selectable;
    }
}
