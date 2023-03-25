package com.benrevo.data.persistence.entities.ancillary;

import com.benrevo.data.persistence.entities.RfpQuote;
import java.util.Objects;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "rfp_quote_ancillary_plan")
public class RfpQuoteAncillaryPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rfp_quote_ancillary_plan_id")
    private Long rfpQuoteAncillaryPlanId;
    
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "rfp_quote_id", referencedColumnName = "rfp_quote_id", nullable = false)
	private RfpQuote rfpQuote;
	
	@ManyToOne
    @JoinColumn(name = "ancillary_plan_id", referencedColumnName = "ancillary_plan_id", nullable = false)
    private AncillaryPlan ancillaryPlan;
	
	@Column(name = "match_plan")
	private boolean matchPlan = false;

	public RfpQuoteAncillaryPlan() {
	}

    public Long getRfpQuoteAncillaryPlanId() {
        return rfpQuoteAncillaryPlanId;
    }

    public void setRfpQuoteAncillaryPlanId(Long rfpQuoteAncillaryPlanId) {
        this.rfpQuoteAncillaryPlanId = rfpQuoteAncillaryPlanId;
    }

    public RfpQuote getRfpQuote() {
        return rfpQuote;
    }

    public void setRfpQuote(RfpQuote rfpQuote) {
        this.rfpQuote = rfpQuote;
    }

    public AncillaryPlan getAncillaryPlan() {
        return ancillaryPlan;
    }

    public void setAncillaryPlan(AncillaryPlan ancillaryPlan) {
        this.ancillaryPlan = ancillaryPlan;
    }

    public boolean isMatchPlan() {
        return matchPlan;
    }

    public void setMatchPlan(boolean matchPlan) {
        this.matchPlan = matchPlan;
    }

    @Override
	public int hashCode() {
        return Objects.hash(rfpQuoteAncillaryPlanId, rfpQuote, ancillaryPlan, matchPlan);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj) {
			return true;
		}
		if (obj == null || getClass() != obj.getClass()) {
			return false;
		}
		RfpQuoteAncillaryPlan other = (RfpQuoteAncillaryPlan) obj;
		
		return Objects.equals(rfpQuoteAncillaryPlanId, other.rfpQuoteAncillaryPlanId) 
            && Objects.equals(rfpQuote, other.rfpQuote) 
            && Objects.equals(ancillaryPlan, other.ancillaryPlan) 
            && Objects.equals(matchPlan, other.matchPlan);
	}
	
}