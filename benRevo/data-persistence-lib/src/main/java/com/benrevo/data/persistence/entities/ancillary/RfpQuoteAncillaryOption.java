package com.benrevo.data.persistence.entities.ancillary;

import com.benrevo.data.persistence.entities.QuoteOption;
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
import javax.persistence.Transient;

@Entity
@Table(name = "rfp_quote_ancillary_option")
public class RfpQuoteAncillaryOption implements QuoteOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rfp_quote_ancillary_option_id")
    private Long rfpQuoteAncillaryOptionId;
    
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "rfp_quote_id", referencedColumnName = "rfp_quote_id", nullable = false)
	private RfpQuote rfpQuote;
	
	@Column(name = "name")
    private String name;
	
	@Column(name = "display_name")
    private String displayName;
	
	@ManyToOne
    @JoinColumn(name = "rfp_quote_ancillary_plan_id", referencedColumnName = "rfp_quote_ancillary_plan_id")
    private RfpQuoteAncillaryPlan rfpQuoteAncillaryPlan;
	
	@ManyToOne
    @JoinColumn(name = "second_rfp_quote_ancillary_plan_id", referencedColumnName = "rfp_quote_ancillary_plan_id")
    private RfpQuoteAncillaryPlan secondRfpQuoteAncillaryPlan;

	public RfpQuoteAncillaryOption() {
	}

    public Long getRfpQuoteAncillaryOptionId() {
        return rfpQuoteAncillaryOptionId;
    }

    public void setRfpQuoteAncillaryOptionId(Long rfpQuoteAncillaryOptionId) {
        this.rfpQuoteAncillaryOptionId = rfpQuoteAncillaryOptionId;
    }
    
    @Transient
    @Override
    public Long getOptionId() {
        return rfpQuoteAncillaryOptionId;
    }
  
    public RfpQuote getRfpQuote() {
        return rfpQuote;
    }

    public void setRfpQuote(RfpQuote rfpQuote) {
        this.rfpQuote = rfpQuote;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }
 
    public RfpQuoteAncillaryPlan getRfpQuoteAncillaryPlan() {
        return rfpQuoteAncillaryPlan;
    }

    public void setRfpQuoteAncillaryPlan(RfpQuoteAncillaryPlan rfpQuoteAncillaryPlan) {
        this.rfpQuoteAncillaryPlan = rfpQuoteAncillaryPlan;
    }
    
    public RfpQuoteAncillaryPlan getSecondRfpQuoteAncillaryPlan() {
		return secondRfpQuoteAncillaryPlan;
	}

	public void setSecondRfpQuoteAncillaryPlan(RfpQuoteAncillaryPlan secondRfpQuoteAncillaryPlan) {
		this.secondRfpQuoteAncillaryPlan = secondRfpQuoteAncillaryPlan;
	}

	@Override
	public int hashCode() {
        return Objects.hash(rfpQuoteAncillaryOptionId, rfpQuote, rfpQuoteAncillaryPlan, secondRfpQuoteAncillaryPlan);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj) {
			return true;
		}
		if (obj == null || getClass() != obj.getClass()) {
			return false;
		}
		RfpQuoteAncillaryOption other = (RfpQuoteAncillaryOption) obj;
		
		return Objects.equals(rfpQuoteAncillaryOptionId, other.rfpQuoteAncillaryOptionId) 
            && Objects.equals(rfpQuote, other.rfpQuote) 
            && Objects.equals(rfpQuoteAncillaryPlan, other.rfpQuoteAncillaryPlan)
            && Objects.equals(secondRfpQuoteAncillaryPlan, other.secondRfpQuoteAncillaryPlan);
	}
}