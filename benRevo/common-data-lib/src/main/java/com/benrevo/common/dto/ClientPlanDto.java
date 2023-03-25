package com.benrevo.common.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ClientPlanDto {

  private Long clientPlanId;
  private Long clientId;
  private Long pnnId;
  private Long rxPnnId;
  private Long tier1Census;
  private Long tier2Census;
  private Long tier3Census;
  private Long tier4Census;
  private Float tier1Rate;
  private Float tier2Rate;
  private Float tier3Rate;
  private Float tier4Rate;
  private Float tier1Renewal;
  private Float tier2Renewal;
  private Float tier3Renewal;
  private Float tier4Renewal;
  private String erContributionFormat;
  private Float tier1ErContribution;
  private Float tier2ErContribution;
  private Float tier3ErContribution;
  private Float tier4ErContribution;
  private boolean outOfState;
  private Long optionId;
  private String planType;
  private String planName;
  private boolean isKaiser;
  private String carrierName;
  private Long ancillaryPlanId;

  public ClientPlanDto() {
  }

  @JsonProperty("client_plan_id")
  public Long getClientPlanId() {
    return clientPlanId;
  }

  public void setClientPlanId(Long clientPlanId) {
    this.clientPlanId = clientPlanId;
  }

  @JsonProperty("client_id")
  public Long getClientId() {
    return clientId;
  }

  public void setClientId(Long clientId) {
    this.clientId = clientId;
  }

  @JsonProperty("pnn_id")
  public Long getPnnId() {
    return pnnId;
  }

  public void setPnnId(Long pnnId) {
    this.pnnId = pnnId;
  }

  @JsonProperty("tier1_census")
  public Long getTier1Census() {
    return tier1Census;
  }

  public void setTier1Census(Long tier1Census) {
    this.tier1Census = tier1Census;
  }

  @JsonProperty("tier2_census")
  public Long getTier2Census() {
    return tier2Census;
  }

  public void setTier2Census(Long tier2Census) {
    this.tier2Census = tier2Census;
  }

  @JsonProperty("tier3_census")
  public Long getTier3Census() {
    return tier3Census;
  }

  public void setTier3Census(Long tier3Census) {
    this.tier3Census = tier3Census;
  }

  @JsonProperty("tier4_census")
  public Long getTier4Census() {
    return tier4Census;
  }

  public void setTier4Census(Long tier4Census) {
    this.tier4Census = tier4Census;
  }

  @JsonProperty("tier1_rate")
  public Float getTier1Rate() {
    return tier1Rate;
  }

  public void setTier1Rate(Float tier1Rate) {
    this.tier1Rate = tier1Rate;
  }

  @JsonProperty("tier2_rate")
  public Float getTier2Rate() {
    return tier2Rate;
  }

  public void setTier2Rate(Float tier2Rate) {
    this.tier2Rate = tier2Rate;
  }

  @JsonProperty("tier3_rate")
  public Float getTier3Rate() {
    return tier3Rate;
  }

  public void setTier3Rate(Float tier3Rate) {
    this.tier3Rate = tier3Rate;
  }

  @JsonProperty("tier4_rate")
  public Float getTier4Rate() {
    return tier4Rate;
  }

  public void setTier4Rate(Float tier4Rate) {
    this.tier4Rate = tier4Rate;
  }

  @JsonProperty("tier1_renewal")
  public Float getTier1Renewal() {
    return tier1Renewal;
  }

  public void setTier1Renewal(Float tier1Renewal) {
    this.tier1Renewal = tier1Renewal;
  }

  @JsonProperty("tier2_renewal")
  public Float getTier2Renewal() {
    return tier2Renewal;
  }

  public void setTier2Renewal(Float tier2Renewal) {
    this.tier2Renewal = tier2Renewal;
  }

  @JsonProperty("tier3_renewal")
  public Float getTier3Renewal() {
    return tier3Renewal;
  }

  public void setTier3Renewal(Float tier3Renewal) {
    this.tier3Renewal = tier3Renewal;
  }

  @JsonProperty("tier4_renewal")
  public Float getTier4Renewal() {
    return tier4Renewal;
  }

  public void setTier4Renewal(Float tier4Renewal) {
    this.tier4Renewal = tier4Renewal;
  }

  @JsonProperty("er_contribution_format")
  public String getErContributionFormat() {
    return erContributionFormat;
  }

  public void setErContributionFormat(String erContributionFormat) {
    this.erContributionFormat = erContributionFormat;
  }

  @JsonProperty("tier1_er_contribution")
  public Float getTier1ErContribution() {
    return tier1ErContribution;
  }

  public void setTier1ErContribution(Float tier1ErContribution) {
    this.tier1ErContribution = tier1ErContribution;
  }

  @JsonProperty("tier2_er_contribution")
  public Float getTier2ErContribution() {
    return tier2ErContribution;
  }

  public void setTier2ErContribution(Float tier2ErContribution) {
    this.tier2ErContribution = tier2ErContribution;
  }

  @JsonProperty("tier3_er_contribution")
  public Float getTier3ErContribution() {
    return tier3ErContribution;
  }

  public void setTier3ErContribution(Float tier3ErContribution) {
    this.tier3ErContribution = tier3ErContribution;
  }

  @JsonProperty("tier4_er_contribution")
  public Float getTier4ErContribution() {
    return tier4ErContribution;
  }

  public void setTier4ErContribution(Float tier4ErContribution) {
    this.tier4ErContribution = tier4ErContribution;
  }

  @JsonProperty("rx_pnn_id")
  public Long getRxPnnId() {
    return rxPnnId;
  }

  public void setRxPnnId(Long rxPnnId) {
    this.rxPnnId = rxPnnId;
  }

  public String getPlanType() {
    return planType;
  }

  public void setPlanType(String planType) {
    this.planType = planType;
  }

  public String getPlanName() {
    return planName;
  }

  public void setPlanName(String planName) {
    this.planName = planName;
  }

  public boolean getIsKaiser() {
    return isKaiser;
  }

  public void setIsKaiser(boolean isKaiser) {
    this.isKaiser = isKaiser;
  }

  @JsonProperty("out_of_state")
  public boolean getOutOfState() {
    return outOfState;
  }

  public void setOutOfState(boolean outOfState) {
    this.outOfState = outOfState;
  }

  @JsonProperty("option_id")
  public Long getOptionId() {
    return optionId;
  }

  public void setOptionId(Long optionId) {
    this.optionId = optionId;
  }

  public String getCarrierName() {
    return carrierName;
  }

  public void setCarrierName(String carrierName) {
    this.carrierName = carrierName;
  }

  public Long getAncillaryPlanId() {
     return ancillaryPlanId;
  }

  public void setAncillaryPlanId(Long ancillaryPlanId) {
    this.ancillaryPlanId = ancillaryPlanId;
  }
}
