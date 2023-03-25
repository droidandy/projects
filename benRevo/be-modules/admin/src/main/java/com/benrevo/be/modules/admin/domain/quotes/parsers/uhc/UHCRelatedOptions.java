package com.benrevo.be.modules.admin.domain.quotes.parsers.uhc;

import java.util.ArrayList;

public class UHCRelatedOptions {

    private ArrayList<UHCNetworkDetails> networkDetails = new ArrayList<UHCNetworkDetails>();

    public ArrayList<UHCNetworkDetails> getNetworkDetails() {
        return networkDetails;
    }

    public void setNetworkDetails(ArrayList<UHCNetworkDetails> networkDetails) {
        this.networkDetails = networkDetails;
    }
}
