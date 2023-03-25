package com.benrevo.common.dto;

import java.util.Date;
import java.util.Objects;

public class AccountRequestDto {

  private Long id;
  private Long brokerId;
  private String brokerName;
  private String brokerPresaleName;
  private String brokerSalesName;
  private String brokerAddress;
  private String brokerCity;
  private String brokerState;
  private String brokerZip;
  private String brokerEmail;
  private String brokerSpecialtyEmail;

  private Long gaId;
  private String gaName;
  private String gaAddress;
  private String gaCity;
  private String gaState;
  private String gaZip;

  private String agentName;
  private String agentEmail;
  private boolean agentVerified;
  private Date created;
  private String brokerRegion;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getBrokerId() {
    return brokerId;
  }

  public void setBrokerId(Long brokerId) {
    this.brokerId = brokerId;
  }

  public String getBrokerName() {
    return brokerName;
  }

  public void setBrokerName(String brokerName) {
    this.brokerName = brokerName;
  }

  public String getBrokerPresaleName() {
	return brokerPresaleName;
  }

  public void setBrokerPresaleName(String brokerPresaleName) {
	this.brokerPresaleName = brokerPresaleName;
  }

  public String getBrokerSalesName() {
	return brokerSalesName;
  }

  public void setBrokerSalesName(String brokerSalesName) {
	this.brokerSalesName = brokerSalesName;
  }

  public String getBrokerAddress() {
    return brokerAddress;
  }

  public void setBrokerAddress(String brokerAddress) {
    this.brokerAddress = brokerAddress;
  }

  public String getBrokerCity() {
    return brokerCity;
  }

  public void setBrokerCity(String brokerCity) {
    this.brokerCity = brokerCity;
  }

  public String getBrokerState() {
    return brokerState;
  }

  public void setBrokerState(String brokerState) {
    this.brokerState = brokerState;
  }

  public String getBrokerZip() {
    return brokerZip;
  }

  public void setBrokerZip(String brokerZip) {
    this.brokerZip = brokerZip;
  }

  public String getBrokerEmail() {
    return brokerEmail;
  }

  public void setBrokerEmail(String brokerEmail) {
    this.brokerEmail = brokerEmail;
  }

  public String getBrokerSpecialtyEmail() {
    return brokerSpecialtyEmail;
  }

  public void setBrokerSpecialtyEmail(String brokerSpecialtyEmail) {
    this.brokerSpecialtyEmail = brokerSpecialtyEmail;
  }

  public Long getGaId() {
    return gaId;
  }

  public void setGaId(Long gaId) {
    this.gaId = gaId;
  }

  public String getGaName() {
    return gaName;
  }

  public void setGaName(String gaName) {
    this.gaName = gaName;
  }

  public String getGaAddress() {
    return gaAddress;
  }

  public void setGaAddress(String gaAddress) {
    this.gaAddress = gaAddress;
  }

  public String getGaCity() {
    return gaCity;
  }

  public void setGaCity(String gaCity) {
    this.gaCity = gaCity;
  }

  public String getGaState() {
    return gaState;
  }

  public void setGaState(String gaState) {
    this.gaState = gaState;
  }

  public String getGaZip() {
    return gaZip;
  }

  public void setGaZip(String gaZip) {
    this.gaZip = gaZip;
  }

  public String getAgentName() {
    return agentName;
  }

  public void setAgentName(String agentName) {
    this.agentName = agentName;
  }

  public String getAgentEmail() {
    return agentEmail;
  }

  public void setAgentEmail(String agentEmail) {
    this.agentEmail = agentEmail;
  }

  public boolean isAgentVerified() {
    return agentVerified;
  }

  public void setAgentVerified(boolean agentVerified) {
    this.agentVerified = agentVerified;
  }

  public Date getCreated() {
    return created;
  }

  public void setCreated(Date created) {
    this.created = created;
  }

  public String getBrokerRegion() {
    return brokerRegion;
  }

  public void setBrokerRegion(String brokerRegion) {
    this.brokerRegion = brokerRegion;
  }

  @Override
  public int hashCode() {
    return Objects.hash(
        id,
        brokerId,
        brokerName,
        brokerPresaleName,
        brokerSalesName,
        brokerAddress,
        brokerCity,
        brokerState,
        brokerZip,
        brokerEmail,
        gaId,
        gaName,
        gaAddress,
        gaCity,
        gaState,
        gaZip,
        agentName,
        agentEmail,
        agentVerified,
        created,
        brokerRegion
    );
  }

  @Override
  public boolean equals(Object obj) {

    if (obj == this) {
      return true;
    }
    if (!(obj instanceof AccountRequestDto)) {
      return false;
    }
    AccountRequestDto other = (AccountRequestDto) obj;

    return Objects.equals(id, other.id) &&
        Objects.equals(agentEmail, other.agentEmail) &&
        Objects.equals(agentName, other.agentName) &&
        Objects.equals(agentVerified, other.agentVerified) &&
        Objects.equals(created, other.created) &&
        Objects.equals(brokerId, other.brokerId) &&
        Objects.equals(gaId, other.gaId) &&
        Objects.equals(brokerName, other.brokerName) &&
        Objects.equals(brokerPresaleName, other.brokerPresaleName) &&
        Objects.equals(brokerSalesName, other.brokerSalesName) &&
        Objects.equals(brokerAddress, other.brokerAddress) &&
        Objects.equals(brokerCity, other.brokerCity) &&
        Objects.equals(brokerEmail, other.brokerEmail) &&
        Objects.equals(brokerState, other.brokerState) &&
        Objects.equals(brokerZip, other.brokerZip) &&
        Objects.equals(gaName, other.gaName) &&
        Objects.equals(gaAddress, other.gaAddress) &&
        Objects.equals(gaCity, other.gaCity) &&
        Objects.equals(gaState, other.gaState) &&
        Objects.equals(gaZip, other.gaZip) &&
        Objects.equals(brokerRegion, other.brokerRegion);
  }
}
