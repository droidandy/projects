package com.benefit.data.model;


public class Benefit {
    protected Integer planId;
    protected Integer benefitNameId;
    protected String inOutNetwork;
    protected int value;
    protected String restriction;

    /*********
     * internal use
     *********/

    //benefit difference
    protected Format format;
    private int diff;
    private double diffPercent;

    public enum Format {
        NUMBER, DOLLAR, PERCENT, MULTIPLE
    }

    //Cigna,A,IN,Individual OOP Limit,1000,Includes all copays except
    public Benefit(int value, Benefit.Format format) {
        this.value = value;
        this.format = format;
    }

    public void setBenefitDetails(Integer planId, Integer benefitNameId, String inOutNetwork, String restriction) {
        this.planId = planId;
        this.inOutNetwork = inOutNetwork;
        this.benefitNameId = benefitNameId;
        this.restriction = restriction;
    }

    @Override
    public String toString() {
        return planId + "|" + benefitNameId + "|" + inOutNetwork + "|" +
                value + "(" + diff + ")" + "|" + format + "|" + restriction + "|";
    }

    public Integer getPlanId() {
        return planId;
    }

    public String getInOutNetwork() {
        return inOutNetwork;
    }

    public Integer getBenefitNameId() {
        return benefitNameId;
    }

    public int getValue() {
        return value;
    }

    public Format getFormat() {
        return format;
    }

    public String getFormatStr() {
        return format.toString();
    }

    public String getRestriction() {
        return restriction;
    }

    public void setDifference(int diff) {
        this.diff = diff;
    }

    public void setDiffPercent(double diff) {
        this.diffPercent = diff;
    }
}
