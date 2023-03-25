package com.benrevo.data.persistence.entities;

import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.hibernate.annotations.Where;
import org.springframework.beans.BeanUtils;
import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "rfp")
public class RFP {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "rfp_id")
    private Long rfpId;

    @OneToOne
    @JoinColumn(name = "client_id")
    private Client client;

    @Column(name = "product")
    private String product;

    @Column(name = "waiting_period")
    private String waitingPeriod;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "commission")
    private String commission;

    @Column(name = "contribution_type")
    private String contributionType;

    @Column(name = "prior_carrier")
    private boolean priorCarrier;

    @Column(name = "broker_of_record")
    private boolean brokerOfRecord;

    @Column(name = "rating_tiers")
    private Integer ratingTiers;

    @Column(name = "option_count")
    private Integer optionCount;

    @OrderBy("id ASC")
    @OneToMany(mappedBy = "rfp",
               fetch = FetchType.LAZY,
               cascade = CascadeType.ALL,
               orphanRemoval = true)
    private List<Option> options;

    @OrderBy("id ASC")
    @OneToMany(mappedBy = "rfp",
               fetch = FetchType.LAZY,
               cascade = CascadeType.ALL,
               orphanRemoval = true)
    private List<CarrierHistory> carrierHistories;

    @Column(name = "buy_up")
    private boolean buyUp;

    @Column(name = "self_funding")
    private boolean selfFunding;

    @Column(name = "alongside")
    private boolean alongside;

    @Column(name = "take_over")
    private boolean takeOver;

    @Column(name = "quote_alte_tiers")
    private Integer quoteAlteTiers;

    @Column(name = "comments")
    private String comments;

    @Column(name = "large_claims")
    private String largeClaims;

    @Column(name = "last_updated")
    private Date lastUpdated;
    
    @Column(name = "quote_alt")
    private Boolean alternativeQuote;
    
    @Column(name = "alt_request")
    private String additionalRequests;
    
    @Column(name = "eap")
	private Boolean eap;
	
	@Column(name = "visits")
    private Integer visits;
	
    @OneToMany(mappedBy="rfp", fetch=FetchType.LAZY, cascade = CascadeType.REMOVE)
	@Where(clause="type='RFP'")
	private List<RFPAttribute> attributes = new ArrayList<>();

    @Override
    public int hashCode() {
        return new HashCodeBuilder(17, 37)
            .append(getRfpId())
            .append(getClient())
            .append(getProduct())
            .append(getWaitingPeriod())
            .append(getPaymentMethod())
            .append(getCommission())
            .append(getContributionType())
            .append(isPriorCarrier())
            .append(getRatingTiers())
            .append(getOptionCount())
            .append(getOptions())
            .append(getCarrierHistories())
            .append(isBuyUp())
            .append(isSelfFunding())
            .append(isAlongside())
            .append(isTakeOver())
            .append(getQuoteAlteTiers())
            .append(getComments())
            .append(getLargeClaims())
            .append(getLastUpdated())
            .append(isBrokerOfRecord())
            .append(getAdditionalRequests())
            .append(getAlternativeQuote())
            .append(getEap())
            .append(getVisits())
            .toHashCode();
    }

    @Override
    public boolean equals(Object o) {
        if(this == o) {
            return true;
        }

        if(o == null || getClass() != o.getClass()) {
            return false;
        }

        RFP rfp = (RFP) o;

        return new org.apache.commons.lang3.builder.EqualsBuilder()
            .append(isPriorCarrier(), rfp.isPriorCarrier())
            .append(isBuyUp(), rfp.isBuyUp())
            .append(isSelfFunding(), rfp.isSelfFunding())
            .append(isAlongside(), rfp.isAlongside())
            .append(isTakeOver(), rfp.isTakeOver())
            .append(getRfpId(), rfp.getRfpId())
            .append(getClient(), rfp.getClient())
            .append(getProduct(), rfp.getProduct())
            .append(getWaitingPeriod(), rfp.getWaitingPeriod())
            .append(getPaymentMethod(), rfp.getPaymentMethod())
            .append(getCommission(), rfp.getCommission())
            .append(getContributionType(), rfp.getContributionType())
            .append(getRatingTiers(), rfp.getRatingTiers())
            .append(getOptionCount(), rfp.getOptionCount())
            .append(getOptions(), rfp.getOptions())
            .append(getCarrierHistories(), rfp.getCarrierHistories())
            .append(getQuoteAlteTiers(), rfp.getQuoteAlteTiers())
            .append(getComments(), rfp.getComments())
            .append(getLargeClaims(), rfp.getLargeClaims())
            .append(getLastUpdated(), rfp.getLastUpdated())
            .append(isBrokerOfRecord(), rfp.isBrokerOfRecord())
            .append(getAdditionalRequests(), rfp.getAdditionalRequests())
            .append(getAlternativeQuote(), rfp.getAlternativeQuote())
            .append(getEap(), rfp.getEap())
            .append(getVisits(), rfp.getVisits())
            .isEquals();
    }

    public boolean isPriorCarrier() {
        return priorCarrier;
    }

    public void setPriorCarrier(boolean priorCarrier) {
        this.priorCarrier = priorCarrier;
    }

    public boolean isBuyUp() {
        return buyUp;
    }

    public void setBuyUp(boolean buyUp) {
        this.buyUp = buyUp;
    }

    public boolean isSelfFunding() {
        return selfFunding;
    }

    public void setSelfFunding(boolean selfFunding) {
        this.selfFunding = selfFunding;
    }

    public boolean isAlongside() {
        return alongside;
    }

    public void setAlongside(boolean alongside) {
        this.alongside = alongside;
    }

    public boolean isTakeOver() {
        return takeOver;
    }

    public Long getRfpId() {
        return rfpId;
    }

    public void setRfpId(Long rfpId) {
        this.rfpId = rfpId;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public String getProduct() {
        return product;
    }

    public void setProduct(String product) {
        this.product = product;
    }

    public String getWaitingPeriod() {
        return waitingPeriod;
    }

    public void setWaitingPeriod(String waitingPeriod) {
        this.waitingPeriod = waitingPeriod;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getCommission() {
        return commission;
    }

    public void setCommission(String commission) {
        this.commission = commission;
    }

    public String getContributionType() {
        return contributionType;
    }

    public Integer getRatingTiers() {
        return ratingTiers;
    }

    public void setRatingTiers(Integer ratingTiers) {
        this.ratingTiers = ratingTiers;
    }

    public Integer getOptionCount() {
        return optionCount;
    }

    public void setOptionCount(Integer optionCount) {
        this.optionCount = optionCount;
    }

    public List<Option> getOptions() {
        return options;
    }

    public void setOptions(List<Option> options) {
        this.options = options;
    }

    public List<CarrierHistory> getCarrierHistories() {
        return carrierHistories;
    }

    public Integer getQuoteAlteTiers() {
        return quoteAlteTiers;
    }

    public void setQuoteAlteTiers(Integer quoteAlteTiers) {
        this.quoteAlteTiers = quoteAlteTiers;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public String getLargeClaims() {
        return largeClaims;
    }

    public void setLargeClaims(String largeClaims) {
        this.largeClaims = largeClaims;
    }

    public Date getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(Date lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public void setCarrierHistories(List<CarrierHistory> carrierHistories) {
        this.carrierHistories = carrierHistories;
    }

    public void setContributionType(String contributionType) {
        this.contributionType = contributionType;
    }

    public void setTakeOver(boolean takeOver) {
        this.takeOver = takeOver;
    }

    public boolean isBrokerOfRecord() {
        return brokerOfRecord;
    }

    public void setBrokerOfRecord(boolean brokerOfRecord) {
        this.brokerOfRecord = brokerOfRecord;
    }

	public Boolean getAlternativeQuote() {
		return alternativeQuote;
	}

	public void setAlternativeQuote(Boolean alternativeQuote) {
		this.alternativeQuote = alternativeQuote;
	}

	public String getAdditionalRequests() {
		return additionalRequests;
	}

	public void setAdditionalRequests(String additionalRequests) {
		this.additionalRequests = additionalRequests;
	}
	
	public Boolean getEap() {
		return eap;
	}

	public void setEap(Boolean eap) {
		this.eap = eap;
	}

	public Integer getVisits() {
		return visits;
	}

	public void setVisits(Integer visits) {
		this.visits = visits;
	}
	
	public List<RFPAttribute> getAttributes() {
        return attributes;
    }

    public void setAttributes(List<RFPAttribute> attributes) {
        this.attributes = attributes;
    }

    public RFP copy() {
	    RFP copy = new RFP();
	    BeanUtils.copyProperties(this, copy, "rfpId", "carrierHistories", "options", "plans", "attributes");
	    if (carrierHistories != null) {
	      copy.setCarrierHistories(new ArrayList<>());
          for (CarrierHistory hist : carrierHistories) {
            CarrierHistory histCopy = hist.copy();
            histCopy.setRfp(copy);
            copy.getCarrierHistories().add(histCopy);
          } 
        }
	    if (options != null) {
          copy.setOptions(new ArrayList<>());
          for (Option opt : options) {
            Option optCopy = opt.copy();
            optCopy.setRfp(copy);
            copy.getOptions().add(optCopy);
          } 
        }
        for (RFPAttribute attribute : attributes) {
          RFPAttribute attributeCopy = attribute.copy();
          attributeCopy.setRfp(copy);
          copy.getAttributes().add(attributeCopy);
        } 
	    return copy; 
	}
}
