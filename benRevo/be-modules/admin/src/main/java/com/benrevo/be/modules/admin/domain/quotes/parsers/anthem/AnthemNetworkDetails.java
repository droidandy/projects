package com.benrevo.be.modules.admin.domain.quotes.parsers.anthem;


import java.util.ArrayList;

public class AnthemNetworkDetails {

    private String networkType;
    private String networkName;
    private ArrayList<AnthemPlanDetails> planDetails = new ArrayList<AnthemPlanDetails>();

    public String getNetworkName() {
        return networkName;
    }

    public void setNetworkName(String networkName) {
        this.networkName = networkName;
    }

    public String getNetworkType() {
        return networkType;
    }

    public void setNetworkType(String networkType) {
        this.networkType = networkType;
    }

    public ArrayList<AnthemPlanDetails> getPlanDetails() {
        return planDetails;
    }

    public void setPlanDetails(ArrayList<AnthemPlanDetails> planDetails) {
        this.planDetails = planDetails;
    }
}
