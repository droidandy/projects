package com.benrevo.admin.domain.options.uhc;

import com.benrevo.common.Constants;

import java.util.ArrayList;
import java.util.List;

public class QuoteOptionSetupTestCase {

    private String category;
	private List<ClientPlanInfo> clientPlans = new ArrayList<>();

    public void addClientPlan(ClientPlanInfo cpi) {
        if(!category.equals(Constants.MEDICAL) && null != cpi.getRxPnnId()) {
            throw new IllegalArgumentException("Cannot set the Rx plan in an non Medical plan");
        }

	    clientPlans.add(cpi);
    }

	public List<ClientPlanInfo> getClientPlans() {
		return clientPlans;
	}

	public void setClientPlans(List<ClientPlanInfo> clientPlans) {
		this.clientPlans = clientPlans;
	}

    public void setCategory(String category) {
        this.category = category;
    }

    public String getCategory() {
        return category;
    }

    public static class ClientPlanInfo {
        private String product;
        private String planType;
        private Long rxPnnId;
        private Float[] rates;
        private Float[] contri;
        private Long[] enroll;
        private String matchingUHCNetwork;

        public ClientPlanInfo(String product, String planType, Long rxPnnId,
                              float rates1, float contri1, long enroll1,
                              float rates2, float contri2, long enroll2,
                              float rates3, float contri3, long enroll3,
                              float rates4, float contri4, long enroll4) {
            this.product = product;
            this.planType = planType;
            this.rxPnnId = rxPnnId;
            this.rates = new Float[4];
            this.contri = new Float[4];
            this.enroll = new Long[4];
            this.rates[0] = rates1;
            this.rates[1] = rates2;
            this.rates[2] = rates3;
            this.rates[3] = rates4;
            this.contri[0] = contri1;
            this.contri[1] = contri2;
            this.contri[2] = contri3;
            this.contri[3] = contri4;
            this.enroll[0] = enroll1;
            this.enroll[1] = enroll2;
            this.enroll[2] = enroll3;
            this.enroll[3] = enroll4;
        }


        public String getProduct() {
            return product;
        }

        public String getPlanType() {
            return planType;
        }

        public Long getRxPnnId() {
            return this.rxPnnId;
        }

        public Float[] getRates() {
            return rates;
        }

        public Long[] getEnroll() {
            return enroll;
        }

        public Float[] getContri() {
            return contri;
        }

        public void setMatchingUHCNetwork(String matchingUHCNetwork) {
            this.matchingUHCNetwork = matchingUHCNetwork;
        }

        public String getMatchingUHCNetwork() {
            return this.matchingUHCNetwork;
        }
    }
}
