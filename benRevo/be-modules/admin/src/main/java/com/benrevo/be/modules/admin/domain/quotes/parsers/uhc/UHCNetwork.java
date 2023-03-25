package com.benrevo.be.modules.admin.domain.quotes.parsers.uhc;

import java.util.ArrayList;

/**
 * Created by awelemdyorakwue on 5/24/17.
 */
public class UHCNetwork {

    //TODO: Clean up, why is there a RX one its own and then a list?

    private UHCNetworkDetails option;
    private ArrayList<UHCNetworkDetails> networksDetails = new ArrayList<UHCNetworkDetails>();
    private ArrayList<UHCNetworkDetails> networksDetailsRx = new ArrayList<UHCNetworkDetails>();
    private ArrayList<UHCNetworkDetails> networksDetailsRider = new ArrayList<UHCNetworkDetails>();
    private ArrayList<UHCNetworkDetails> additionalPharmacyBenefits = new ArrayList<UHCNetworkDetails>();

    public UHCNetworkDetails getOption() {
        return option;
    }

    public void setOption(UHCNetworkDetails option) {
        this.option = option;
    }

    public ArrayList<UHCNetworkDetails> getNetworksDetails() {
        return networksDetails;
    }

    public void setNetworksDetails(ArrayList<UHCNetworkDetails> networksDetails) {
        this.networksDetails = networksDetails;
    }

    public ArrayList<UHCNetworkDetails> getNetworksDetailsRx() {
        return networksDetailsRx;
    }

    public void setNetworksDetailsRx(ArrayList<UHCNetworkDetails> networksDetailsRx) {
        this.networksDetailsRx = networksDetailsRx;
    }

    public ArrayList<UHCNetworkDetails> getNetworksDetailsRider() {
        return networksDetailsRider;
    }

    public void setNetworksDetailsRider(ArrayList<UHCNetworkDetails> networksDetailsRider) {
        this.networksDetailsRider = networksDetailsRider;
    }

    public ArrayList<UHCNetworkDetails> getAdditionalPharmacyBenefits() {
        return additionalPharmacyBenefits;
    }

    public void setAdditionalPharmacyBenefits(ArrayList<UHCNetworkDetails> additionalPharmacyBenefits) {
        this.additionalPharmacyBenefits = additionalPharmacyBenefits;
    }

}
