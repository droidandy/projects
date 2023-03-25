package com.benrevo.common.dto;

import com.benrevo.common.enums.AttributeName;
import com.benrevo.common.enums.ClientState;
import java.util.List;
import java.util.Objects;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;

@XmlRootElement(name = "client")
@XmlAccessorType(XmlAccessType.FIELD)
public class ClientDto {

  @XmlTransient
  private Long id;
  private String clientName;
  @XmlTransient
  private Long brokerId;
  @XmlTransient
  private Long gaId;
  private String brokerName;
  private Long employeeCount;
  private Long eligibleEmployees;
  private Long participatingEmployees;
  private String sicCode;
  private String address;
  private String addressComplementary;
  private String city;
  private String state;
  private String zip;
  private String imageUrl;
  private String website;
  private Long minimumHours;
  private String effectiveDate;
  private String dueDate;
  private String domesticPartner;
  private String lastVisited;
  private String policyNumber;
  private String dateQuestionnaireCompleted;
  private String contactName;
  private String contactTitle;
  private String contactAddress;
  private String contactCity;
  private String contactState;
  private String contactZip;
  private String contactPhone;
  private String contactFax;
  private String contactEmail;
  private String businessType;
  private String orgType;
  private String fedTaxId;
  private ClientState clientState;
  private Integer membersCount;
  private Integer retireesCount;
  private Integer cobraCount;
  private String outToBidReason;
  private Boolean declinedOutside;
  private Boolean submittedRfpSeparately;
  private Boolean carrierOwned;
  private String dba;
  private String clientToken;


  @XmlTransient
  private List<ClientMemberDto> clientMembers;
  private String predominantCounty;
  private Float averageAge;

  private List<RfpDto> rfps;
  private List<ExtProductDto> rfpProducts;
  private List<ExtProductDto> extProducts;

  @XmlTransient
  private List<AttributeName> attributes;

  public ClientDto() {
  }

  public Integer getMembersCount() {
    return membersCount;
  }

  public void setMembersCount(Integer membersCount) {
    this.membersCount = membersCount;
  }

  public Integer getRetireesCount() {
    return retireesCount;
  }

  public void setRetireesCount(Integer retireesCount) {
    this.retireesCount = retireesCount;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getClientName() {
    return clientName;
  }

  public void setClientName(String clientName) {
    this.clientName = clientName;
  }

  public Long getBrokerId() {
    return brokerId;
  }

  public void setBrokerId(Long brokerId) {
    this.brokerId = brokerId;
  }

  public Long getGaId() {
    return gaId;
  }

  public void setGaId(Long gaId) {
    this.gaId = gaId;
  }

  public String getBrokerName() {
    return brokerName;
  }

  public void setBrokerName(String brokerName) {
    this.brokerName = brokerName;
  }

  public Long getEmployeeCount() {
    return employeeCount;
  }

  public void setEmployeeCount(Long employeeCount) {
    this.employeeCount = employeeCount;
  }

  public String getAddress() {
    return address;
  }

  public void setAddress(String address) {
    this.address = address;
  }

  public String getAddressComplementary() {
    return addressComplementary;
  }

  public void setAddressComplementary(String addressComplementary) {
    this.addressComplementary = addressComplementary;
  }

  public String getCity() {
    return city;
  }

  public void setCity(String city) {
    this.city = city;
  }

  public String getState() {
    return state;
  }

  public void setState(String state) {
    this.state = state;
  }

  public String getZip() {
    return zip;
  }

  public void setZip(String zip) {
    this.zip = zip;
  }

  public String getImageUrl() {
    return imageUrl;
  }

  public void setImageUrl(String imageUrl) {
    this.imageUrl = imageUrl;
  }

  public String getSicCode() {
    return sicCode;
  }

  public void setSicCode(String sicCode) {
    this.sicCode = sicCode;
  }

  public String getWebsite() {
    return website;
  }

  public void setWebsite(String website) {
    this.website = website;
  }

  public Long getMinimumHours() {
    return minimumHours;
  }

  public void setMinimumHours(Long minimumHours) {
    this.minimumHours = minimumHours;
  }

  public String getEffectiveDate() {
    return effectiveDate;
  }

  public void setEffectiveDate(String effectiveDate) {
    this.effectiveDate = effectiveDate;
  }

  public String getDueDate() {
    return dueDate;
  }

  public void setDueDate(String dueDate) {
    this.dueDate = dueDate;
  }

  public String getLastVisited() {
    return lastVisited;
  }

  public void setLastVisited(String lastVisited) {
    this.lastVisited = lastVisited;
  }

  public Long getParticipatingEmployees() {
    return participatingEmployees;
  }

  public void setParticipatingEmployees(Long participatingEmployees) {
    this.participatingEmployees = participatingEmployees;
  }

  public String getDomesticPartner() {
    return domesticPartner;
  }

  public void setDomesticPartner(String domesticPartner) {
    this.domesticPartner = domesticPartner;
  }

  public String getPolicyNumber() {
    return policyNumber;
  }

  public void setPolicyNumber(String policyNumber) {
    this.policyNumber = policyNumber;
  }

  public String getDateQuestionnaireCompleted() {
    return dateQuestionnaireCompleted;
  }

  public void setDateQuestionnaireCompleted(String dateQuestionnaireCompleted) {
    this.dateQuestionnaireCompleted = dateQuestionnaireCompleted;
  }

  public String getContactName() {
    return contactName;
  }

  public void setContactName(String contactName) {
    this.contactName = contactName;
  }

  public String getContactTitle() {
    return contactTitle;
  }

  public void setContactTitle(String contactTitle) {
    this.contactTitle = contactTitle;
  }

  public String getContactAddress() {
    return contactAddress;
  }

  public void setContactAddress(String contactAddress) {
    this.contactAddress = contactAddress;
  }

  public String getContactCity() {
    return contactCity;
  }

  public void setContactCity(String contactCity) {
    this.contactCity = contactCity;
  }

  public String getContactState() {
    return contactState;
  }

  public void setContactState(String contactState) {
    this.contactState = contactState;
  }

  public String getContactZip() {
    return contactZip;
  }

  public void setContactZip(String contactZip) {
    this.contactZip = contactZip;
  }

  public String getContactPhone() {
    return contactPhone;
  }

  public void setContactPhone(String contactPhone) {
    this.contactPhone = contactPhone;
  }

  public String getContactFax() {
    return contactFax;
  }

  public void setContactFax(String contactFax) {
    this.contactFax = contactFax;
  }

  public String getContactEmail() {
    return contactEmail;
  }

  public void setContactEmail(String contactEmail) {
    this.contactEmail = contactEmail;
  }

  public String getBusinessType() {
    return businessType;
  }

  public void setBusinessType(String businessType) {
    this.businessType = businessType;
  }

  public String getOrgType() {
    return orgType;
  }

  public void setOrgType(String orgType) {
    this.orgType = orgType;
  }

  public String getFedTaxId() {
    return fedTaxId;
  }

  public void setFedTaxId(String fedTaxId) {
    this.fedTaxId = fedTaxId;
  }

  public ClientState getClientState() {
    return clientState;
  }

  public void setClientState(ClientState clientState) {
    this.clientState = clientState;
  }

  public String getOutToBidReason() {
    return outToBidReason;
  }

  public void setOutToBidReason(String outToBidReason) {
    this.outToBidReason = outToBidReason;
  }

  public List<ClientMemberDto> getClientMembers() {
    return clientMembers;
  }

  public void setClientMembers(List<ClientMemberDto> clientMembers) {
    this.clientMembers = clientMembers;
  }

  public Integer getCobraCount() {
    return cobraCount;
  }

  public void setCobraCount(Integer cobraCount) {
    this.cobraCount = cobraCount;
  }

  public Long getEligibleEmployees() {
    return eligibleEmployees;
  }

  public void setEligibleEmployees(Long eligibleEmployees) {
    this.eligibleEmployees = eligibleEmployees;
  }

  public String getPredominantCounty() {
    return predominantCounty;
  }

  public void setPredominantCounty(String predominantCounty) {
    this.predominantCounty = predominantCounty;
  }

  public Float getAverageAge() {
    return averageAge;
  }

  public void setAverageAge(Float averageAge) {
    this.averageAge = averageAge;
  }

  public List<RfpDto> getRfps() {
    return rfps;
  }

  public void setRfps(List<RfpDto> rfps) {
    this.rfps = rfps;
  }

  public List<ExtProductDto> getRfpProducts() {
    return rfpProducts;
  }

  public void setRfpProducts(List<ExtProductDto> rfpProducts) {
    this.rfpProducts = rfpProducts;
  }

  public List<ExtProductDto> getExtProducts() {
    return extProducts;
  }  
    
  public void setExtProducts(List<ExtProductDto> extProducts) {
    this.extProducts = extProducts;
  }

  public Boolean isDeclinedOutside() {
    return declinedOutside;
  }

  public void setDeclinedOutside(Boolean declinedOutside) {
    this.declinedOutside = declinedOutside;
  }

    public Boolean getSubmittedRfpSeparately() {
        return submittedRfpSeparately;
    }

    public void setSubmittedRfpSeparately(Boolean submittedRfpSeparately) {
        this.submittedRfpSeparately = submittedRfpSeparately;
    }

    public List<AttributeName> getAttributes() {
    return attributes;
  }

  public void setAttributes(List<AttributeName> attributes) {
    this.attributes = attributes;
  }


    public Boolean getCarrierOwned() {
        return carrierOwned;
    }

    public void setCarrierOwned(Boolean carrierOwned) {
        this.carrierOwned = carrierOwned;
    }

    public String getDba() {
        return dba;
    }

    public void setDba(String dba) {
        this.dba = dba;
    }

    public String getClientToken() {
        return clientToken;
    }

    public void setClientToken(String clientToken) {
        this.clientToken = clientToken;
    }

    @Override
  public boolean equals(Object o) {
    if (this == o)
      return true;
    if (o == null || getClass() != o.getClass())
      return false;

    ClientDto that = (ClientDto) o;

    return Objects.equals(this.address, that.address) &&
        Objects.equals(this.addressComplementary, that.addressComplementary) &&
        Objects.equals(this.attributes, that.attributes) &&
        Objects.equals(this.averageAge, that.averageAge) &&
        Objects.equals(this.brokerId, that.brokerId) &&
        Objects.equals(this.brokerName, that.brokerName) &&
        Objects.equals(this.businessType, that.businessType) &&
        Objects.equals(this.city, that.city) &&
        Objects.equals(this.clientMembers, that.clientMembers) &&
        Objects.equals(this.clientName, that.clientName) &&
        Objects.equals(this.clientState, that.clientState) &&
        Objects.equals(this.cobraCount, that.cobraCount) &&
        Objects.equals(this.contactAddress, that.contactAddress) &&
        Objects.equals(this.contactCity, that.contactCity) &&
        Objects.equals(this.contactEmail, that.contactEmail) &&
        Objects.equals(this.contactFax, that.contactFax) &&
        Objects.equals(this.contactName, that.contactName) &&
        Objects.equals(this.contactPhone, that.contactPhone) &&
        Objects.equals(this.contactState, that.contactState) &&
        Objects.equals(this.contactTitle, that.contactTitle) &&
        Objects.equals(this.contactZip, that.contactZip) &&
        Objects.equals(this.dateQuestionnaireCompleted, that.dateQuestionnaireCompleted) &&
        Objects.equals(this.declinedOutside, that.declinedOutside) &&
        Objects.equals(this.carrierOwned, that.carrierOwned) &&
        Objects.equals(this.submittedRfpSeparately, that.submittedRfpSeparately) &&
        Objects.equals(this.domesticPartner, that.domesticPartner) &&
        Objects.equals(this.dueDate, that.dueDate) &&
        Objects.equals(this.effectiveDate, that.effectiveDate) &&
        Objects.equals(this.eligibleEmployees, that.eligibleEmployees) &&
        Objects.equals(this.employeeCount, that.employeeCount) &&
        Objects.equals(this.fedTaxId, that.fedTaxId) &&
        Objects.equals(this.id, that.id) &&
        Objects.equals(this.imageUrl, that.imageUrl) &&
        Objects.equals(this.lastVisited, that.lastVisited) &&
        Objects.equals(this.membersCount, that.membersCount) &&
        Objects.equals(this.minimumHours, that.minimumHours) &&
        Objects.equals(this.orgType, that.orgType) &&
        Objects.equals(this.outToBidReason, that.outToBidReason) &&
        Objects.equals(this.participatingEmployees, that.participatingEmployees) &&
        Objects.equals(this.policyNumber, that.policyNumber) &&
        Objects.equals(this.predominantCounty, that.predominantCounty) &&
        Objects.equals(this.retireesCount, that.retireesCount) &&
        Objects.equals(this.rfpProducts, that.rfpProducts) &&
        Objects.equals(this.rfps, that.rfps) &&
        Objects.equals(this.sicCode, that.sicCode) &&
        Objects.equals(this.state, that.state) &&
        Objects.equals(this.website, that.website) &&
        Objects.equals(this.zip, that.zip) &&
        Objects.equals(this.dba, that.dba) &&
        Objects.equals(this.clientToken, that.clientToken);
  }

  @Override
  public int hashCode() {
    return Objects.hash(address, addressComplementary, attributes, averageAge, brokerId, brokerName,
        businessType, city, clientMembers, clientName, clientState,
        cobraCount, contactAddress, contactCity, contactEmail, contactFax,
        contactName, contactPhone, contactState, contactTitle, contactZip,
        dateQuestionnaireCompleted, declinedOutside, carrierOwned, submittedRfpSeparately, domesticPartner, dueDate, effectiveDate,
        eligibleEmployees, employeeCount, fedTaxId, id, imageUrl,
        lastVisited, membersCount, minimumHours, orgType, outToBidReason,
        participatingEmployees, policyNumber, predominantCounty, retireesCount, rfpProducts,
        rfps, sicCode, state, website, zip, dba, clientToken);
  }
}
