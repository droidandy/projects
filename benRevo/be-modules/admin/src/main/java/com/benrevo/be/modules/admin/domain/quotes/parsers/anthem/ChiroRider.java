package com.benrevo.be.modules.admin.domain.quotes.parsers.anthem;

/**
 * Created by lemdy on 6/2/17.
 */
public class ChiroRider {

    private String name;
    private String location;
    private String tier1Rate = "0.0";
    private String tier1RateLocation = "";
    private String tier2Rate = "0.0";
    private String tier2RateLocation = "";
    private String tier3Rate = "0.0";
    private String tier3RateLocation = "";
    private String tier4Rate = "0.0";
    private String tier4RateLocation = "";

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTier1Rate() {
        return tier1Rate;
    }

    public void setTier1Rate(String tier1Rate) {
        this.tier1Rate = tier1Rate;
    }

    public String getTier2Rate() {
        return tier2Rate;
    }

    public void setTier2Rate(String tier2Rate) {
        this.tier2Rate = tier2Rate;
    }

    public String getTier3Rate() {
        return tier3Rate;
    }

    public void setTier3Rate(String tier3Rate) {
        this.tier3Rate = tier3Rate;
    }

    public String getTier4Rate() {
        return tier4Rate;
    }

    public void setTier4Rate(String tier4Rate) {
        this.tier4Rate = tier4Rate;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getTier1RateLocation() {
        return tier1RateLocation;
    }

    public void setTier1RateLocation(String tier1RateLocation) {
        this.tier1RateLocation = tier1RateLocation;
    }

    public String getTier2RateLocation() {
        return tier2RateLocation;
    }

    public void setTier2RateLocation(String tier2RateLocation) {
        this.tier2RateLocation = tier2RateLocation;
    }

    public String getTier3RateLocation() {
        return tier3RateLocation;
    }

    public void setTier3RateLocation(String tier3RateLocation) {
        this.tier3RateLocation = tier3RateLocation;
    }

    public String getTier4RateLocation() {
        return tier4RateLocation;
    }

    public void setTier4RateLocation(String tier4RateLocation) {
        this.tier4RateLocation = tier4RateLocation;
    }
}
