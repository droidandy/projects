package com.benrevo.common.params;

public class BenefitSearchParams {
    private int id;
    private String format;
    private String lessThan; //lessThan
    private String greaterThan; // greaterThan
    private String format2;
    private String lessThan2; // lessThan2
    private String greaterThan2; // greaterThan2
    private String list;
    private String inOrOut;

    public BenefitSearchParams() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getInOrOut() {
        return inOrOut;
    }

    public void setInOrOut(String inOrOut) {
        this.inOrOut = inOrOut;
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }

    public String getLessThan() {
        return lessThan;
    }

    public void setLessThan(String lessThan) {
        this.lessThan = lessThan;
    }

    public String getGreaterThan() {
        return greaterThan;
    }

    public void setGreaterThan(String greaterThan) {
        this.greaterThan = greaterThan;
    }

    public String getList() {
        return list;
    }

    public void setList(String list) {
        this.list = list;
    }

    public String getFormat2() {
        return format2;
    }

    public void setFormat2(String format2) {
        this.format2 = format2;
    }

    public String getLessThan2() {
        return lessThan2;
    }

    public void setLessThan2(String lessThan2) {
        this.lessThan2 = lessThan2;
    }

    public String getGreaterThan2() {
        return greaterThan2;
    }

    public void setGreaterThan2(String greaterThan2) {
        this.greaterThan2 = greaterThan2;
    }
}
