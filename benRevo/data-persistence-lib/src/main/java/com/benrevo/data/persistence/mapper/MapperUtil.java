package com.benrevo.data.persistence.mapper;

import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.entities.ancillary.AncillaryPlan;

public class MapperUtil {

    public static Client clientFromId(Long id) {
        if(id == null) {
            return null;
        }
        Client client = new Client();
        client.setClientId(id);
        return client;
    }

    public static Broker brokerFromId(Long id) {
        if(id == null) {
            return null;
        }
        Broker broker = new Broker();
        broker.setBrokerId(id);
        return broker;
    }

    public static RFP rfpFromId(Long id) {
        if(id == null) {
            return null;
        }
        RFP rfp = new RFP();
        rfp.setRfpId(id);
        return rfp;
    }
    
    public static PlanNameByNetwork pnnFromId(Long id) {
        if(id == null) {
            return null;
        }
        PlanNameByNetwork pnn = new PlanNameByNetwork();
        pnn.setPnnId(id);
        return pnn;
    }

    public static AncillaryPlan rfpPlanFromId(Long id) {
        if(id == null) {
            return null;
        }
        AncillaryPlan rfpPlan = new AncillaryPlan();
        rfpPlan.setAncillaryPlanId(id);
        return rfpPlan;
    }
    

}
