package com.benrevo.data.persistence.entities;

import java.util.Date;

import javax.persistence.*;

import com.benrevo.common.dto.AccountRequestDto;

@Entity
@Table(name = "account_request")
public class AccountRequest {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "account_request_id")
    private Long accountRequestId;

    @Column(name = "broker_id")
    private Long brokerId;

    @Column(name = "broker_name")
    private String brokerName;
    
    @Column(name = "broker_presale_name")
    private String brokerPresaleName;
    
    @Column(name = "broker_sales_name")
    private String brokerSalesName;

    @Column(name = "broker_address")
    private String brokerAddress;

    @Column(name = "broker_city")
    private String brokerCity;

    @Column(name = "broker_state")
    private String brokerState;

    @Column(name = "broker_zip")
    private String brokerZip;

    @Column(name = "broker_email")
    private String brokerEmail;
    
    @Column(name = "broker_specialty_email")
    private String brokerSpecialtyEmail;

    @Column(name = "ga_id")
    private Long gaId;

    @Column(name = "ga_name")
    private String gaName;

    @Column(name = "ga_address")
    private String gaAddress;

    @Column(name = "ga_city")
    private String gaCity;

    @Column(name = "ga_state")
    private String gaState;

    @Column(name = "ga_zip")
    private String gaZip;

    @Column(name = "agent_full_name")
    private String agentName;

    @Column(name = "agent_email")
    private String agentEmail;
    
    @Column(name = "verification_code")
    private String verificationCode;

    @Column(name = "agent_verified")
    private boolean agentVerified;

    @Column(name = "approve")
    private boolean approve;

    @Column(name = "deny")
    private boolean deny;
    
    @Column(name = "deny_reason")
    private String denyReason;
    
    @Column(name = "action_by")
    private String actionBy;
    
    @Column(name = "created")
    private Date created;
    
    @Column(name = "broker_region")
    private String brokerRegion;

    public AccountRequest() {}

    public Long getAccountRequestId() {
        return accountRequestId;
    }

    public void setAccountRequestId(Long accountRequestId) {
        this.accountRequestId = accountRequestId;
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

    public String getVerificationCode() {
        return verificationCode;
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }

    public boolean getAgentVerified() {
		return agentVerified;
	}

	public void setAgentVerified(boolean agentVerified) {
		this.agentVerified = agentVerified;
	}

	public boolean getApprove() {
        return approve;
    }

    public void setApprove(boolean approve) {
        this.approve = approve;
    }

    public boolean getDeny() {
        return deny;
    }

    public void setDeny(boolean deny) {
        this.deny = deny;
    }

    public String getDenyReason() {
        return denyReason;
    }

    public void setDenyReason(String denyReason) {
        this.denyReason = denyReason;
    }

    public String getActionBy() {
        return actionBy;
    }

    public void setActionBy(String actionBy) {
        this.actionBy = actionBy;
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

    public AccountRequestDto toAccountRequestDto() {
        AccountRequestDto dto = new AccountRequestDto();
        
        dto.setId(accountRequestId);
        dto.setBrokerId(brokerId);
        dto.setBrokerName(brokerName);
        dto.setBrokerPresaleName(brokerPresaleName);
        dto.setBrokerSalesName(brokerSalesName);
        dto.setBrokerAddress(brokerAddress);
        dto.setBrokerCity(brokerCity);
        dto.setBrokerEmail(brokerEmail);
        dto.setBrokerSpecialtyEmail(brokerSpecialtyEmail);
        dto.setBrokerState(brokerState);
        dto.setBrokerZip(brokerZip);
        dto.setGaId(gaId);
        dto.setGaName(gaName);
        dto.setGaAddress(gaAddress);
        dto.setGaCity(gaCity);
        dto.setGaState(gaState);
        dto.setGaZip(gaZip);
        dto.setAgentName(agentName);
        dto.setAgentEmail(agentEmail);
        dto.setAgentVerified(agentVerified);
        dto.setCreated(created);
        dto.setBrokerRegion(brokerRegion);
        
        return dto;
    }
    
    public void fromAccountRequestDto(AccountRequestDto dto) {
        setAccountRequestId(dto.getId());
        setBrokerId(dto.getBrokerId());
        setBrokerName(dto.getBrokerName());
        setBrokerPresaleName(dto.getBrokerPresaleName());
        setBrokerSalesName(dto.getBrokerSalesName());
        setBrokerAddress(dto.getBrokerAddress());
        setBrokerCity(dto.getBrokerCity());
        setBrokerEmail(dto.getBrokerEmail());
        setBrokerSpecialtyEmail(dto.getBrokerSpecialtyEmail());
        setBrokerState(dto.getBrokerState());
        setBrokerZip(dto.getBrokerZip());
        setGaId(dto.getGaId());
        setGaName(dto.getGaName());
        setGaAddress(dto.getGaAddress());
        setGaCity(dto.getGaCity());
        setGaState(dto.getGaState());
        setGaZip(dto.getGaZip());
        setAgentName(dto.getAgentName());
        setAgentEmail(dto.getAgentEmail());
        setAgentVerified(dto.isAgentVerified());
        setCreated(dto.getCreated());
        setBrokerRegion(dto.getBrokerRegion());
    }
}
