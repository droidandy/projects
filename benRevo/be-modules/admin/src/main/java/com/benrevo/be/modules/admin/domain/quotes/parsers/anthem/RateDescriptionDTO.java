package com.benrevo.be.modules.admin.domain.quotes.parsers.anthem;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;

public class RateDescriptionDTO {

    private LinkedHashMap<String, AnthemNetworkDetails> networks = new LinkedHashMap<String, AnthemNetworkDetails>();
    private LinkedHashMap<String, String> censusInformation = new LinkedHashMap<String, String>();
    private List<ChiroRider> chiroRiders = new ArrayList<ChiroRider>();
    private String rateDescriptionCellLocation;

    public LinkedHashMap<String, AnthemNetworkDetails> getAnthemNetworks() {
        return networks;
    }

    public void setAnthemNetworks(LinkedHashMap<String, AnthemNetworkDetails> networks) {
        this.networks = networks;
    }

    public LinkedHashMap<String, String> getCensusInformation() {
        return censusInformation;
    }

    public void setCensusInformation(LinkedHashMap<String, String> censusInformation) {
        this.censusInformation = censusInformation;
    }

    public List<ChiroRider> getChiroRiders() {
        return chiroRiders;
    }

    public void setChiroRiders(List<ChiroRider> chiroRiders) {
        this.chiroRiders = chiroRiders;
    }

    public String getRateDescriptionCellLocation() {
        return rateDescriptionCellLocation;
    }

    public void setRateDescriptionCellLocation(String rateDescriptionCellLocation) {
        this.rateDescriptionCellLocation = rateDescriptionCellLocation;
    }
}
