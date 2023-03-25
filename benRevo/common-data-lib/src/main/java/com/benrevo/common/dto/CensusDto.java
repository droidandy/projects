package com.benrevo.common.dto;

public class CensusDto {

    private long id;
    private String name;
    private long tier1;
    private long tier2;
    private long tier3;
    private long tier4;

    public long getTier1() {
        return tier1;
    }

    public void setTier1(long tier1) {
        this.tier1 = tier1;
    }

    public long getTier2() {
        return tier2;
    }

    public void setTier2(long tier2) {
        this.tier2 = tier2;
    }

    public long getTier3() {
        return tier3;
    }

    public void setTier3(long tier3) {
        this.tier3 = tier3;
    }

    public long getTier4() {
        return tier4;
    }

    public void setTier4(long tier4) {
        this.tier4 = tier4;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
