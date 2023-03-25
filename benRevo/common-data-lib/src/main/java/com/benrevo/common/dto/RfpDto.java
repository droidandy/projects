package com.benrevo.common.dto;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlTransient;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import com.benrevo.common.dto.ancillary.AncillaryPlanDto;
import com.benrevo.common.enums.RFPAttributeName;

@XmlAccessorType(XmlAccessType.FIELD)
public class RfpDto {
    @XmlTransient
    private Long id;
    @XmlTransient
    private Long clientId;
    private String product;
    private String waitingPeriod;
    private String paymentMethod;
    private String commission;
    private String contributionType;
    private boolean priorCarrier;
    private Integer ratingTiers;
    private Integer optionCount;
    private List<OptionDto> options;
    private List<CarrierHistoryDto> carrierHistories;
    private boolean buyUp;
    private boolean selfFunding;
    private boolean alongside;
    private boolean takeOver;
    private Integer quoteAlteTiers;
    private String comments;
    private String lastUpdated;
    private String largeClaims;
    private boolean brokerOfRecord;
    private List<RfpSubmissionStatusDto> submissionStatuses = new ArrayList<>();
    private Boolean alternativeQuote;
    private String additionalRequests;
    private Boolean eap;
    private Integer visits;
    
    // only for xml import/export
    private List<AncillaryPlanDto> ancillaryPlans;
    
    @XmlTransient
    private List<FileInfoDto> fileInfoList;
    
    @XmlTransient
    private Map<RFPAttributeName, String> attributes = new HashMap<>();

    public RfpDto(){}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public List<OptionDto> getOptions() {
        return options;
    }

    public void setOptions(List<OptionDto> options) {
        this.options = options;
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

    public boolean isPriorCarrier() {
        return priorCarrier;
    }

    public void setPriorCarrier(boolean priorCarrier) {
        this.priorCarrier = priorCarrier;
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

    public void setTakeOver(boolean takeOver) {
        this.takeOver = takeOver;
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

    public String getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(String lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public List<CarrierHistoryDto> getCarrierHistories() {
        return carrierHistories;
    }

    public void setCarrierHistories(List<CarrierHistoryDto> carrierHistories) {
        this.carrierHistories = carrierHistories;
    }

    public List<FileInfoDto> getFileInfoList() {
        return fileInfoList;
    }

    public void setFileInfoList(List<FileInfoDto> fileInfoList) {
        this.fileInfoList = fileInfoList;
    }

    public String getContributionType() {
        return contributionType;
    }

    public void setContributionType(String contributionType) {
        this.contributionType = contributionType;
    }
    public boolean isBrokerOfRecord() {
        return brokerOfRecord;
    }

    public void setBrokerOfRecord(boolean brokerOfRecord) {
        this.brokerOfRecord = brokerOfRecord;
    }

    public List<RfpSubmissionStatusDto> getSubmissionStatuses() {
        return submissionStatuses;
    }

    public void setSubmissionStatuses(
        List<RfpSubmissionStatusDto> submissionStatuses) {
        this.submissionStatuses = submissionStatuses;
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

	public Map<RFPAttributeName, String> getAttributes() {
        return attributes;
    }

    public void setAttributes(Map<RFPAttributeName, String> attributes) {
        this.attributes = attributes;
    }
    
    public List<AncillaryPlanDto> getAncillaryPlans() {
        return ancillaryPlans;
    }
    
    public void setAncillaryPlans(List<AncillaryPlanDto> ancillaryPlans) {
        this.ancillaryPlans = ancillaryPlans;
    }

    @Override
    public boolean equals(Object o) {
        if(this == o) {
            return true;
        }

        if(!(o instanceof RfpDto)) {
            return false;
        }

        RfpDto rfpDto = (RfpDto) o;

        return new EqualsBuilder()
            .append(isPriorCarrier(), rfpDto.isPriorCarrier())
            .append(isBuyUp(), rfpDto.isBuyUp())
            .append(isSelfFunding(), rfpDto.isSelfFunding())
            .append(isAlongside(), rfpDto.isAlongside())
            .append(isTakeOver(), rfpDto.isTakeOver())
            .append(getId(), rfpDto.getId())
            .append(getClientId(), rfpDto.getClientId())
            .append(getProduct(), rfpDto.getProduct())
            .append(getWaitingPeriod(), rfpDto.getWaitingPeriod())
            .append(getPaymentMethod(), rfpDto.getPaymentMethod())
            .append(getCommission(), rfpDto.getCommission())
            .append(getContributionType(), rfpDto.getContributionType())
            .append(getRatingTiers(), rfpDto.getRatingTiers())
            .append(getOptionCount(), rfpDto.getOptionCount())
            .append(getOptions(), rfpDto.getOptions())
            .append(getCarrierHistories(), rfpDto.getCarrierHistories())
            .append(getQuoteAlteTiers(), rfpDto.getQuoteAlteTiers())
            .append(getComments(), rfpDto.getComments())
            .append(getLastUpdated(), rfpDto.getLastUpdated())
            .append(getLargeClaims(), rfpDto.getLargeClaims())
            .append(getFileInfoList(), rfpDto.getFileInfoList())
            .append(isBrokerOfRecord(), rfpDto.isBrokerOfRecord())
            .append(getAdditionalRequests(), rfpDto.getAdditionalRequests())
            .append(getAlternativeQuote(), rfpDto.getAlternativeQuote())
            .append(getEap(), rfpDto.getEap())
            .append(getVisits(), rfpDto.getVisits())
            .isEquals();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder(17, 37)
            .append(getId())
            .append(getClientId())
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
            .append(getLastUpdated())
            .append(getLargeClaims())
            .append(getFileInfoList())
            .append(isBrokerOfRecord())
            .append(getAdditionalRequests())
            .append(getAlternativeQuote())
            .append(getEap())
            .append(getVisits())
            .toHashCode();
    }
}
