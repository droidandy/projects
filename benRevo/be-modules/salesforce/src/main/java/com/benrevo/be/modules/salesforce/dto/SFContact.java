package com.benrevo.be.modules.salesforce.dto;

import com.benrevo.be.modules.salesforce.annotation.SFLookup;
import com.benrevo.be.modules.salesforce.annotation.SFLookup.SFCondition;
import com.benrevo.be.modules.salesforce.annotation.SFLookup.SFField;
import com.benrevo.be.modules.salesforce.enums.AccountType;
import com.benrevo.be.modules.salesforce.enums.ContactType;
import com.benrevo.common.enums.CarrierType;
import com.fasterxml.jackson.annotation.*;

import java.util.Date;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

import static com.benrevo.be.modules.salesforce.enums.SalesforceObject.Account;
import static com.benrevo.be.modules.salesforce.enums.SalesforceObject.Contact;
import static com.fasterxml.jackson.annotation.JsonFormat.Shape.STRING;
import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL;

/**
 * Created by ebrandell on 2/9/18 at 12:34 PM.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(NON_NULL)
@SFLookup({
    @SFField(
        property = "id",
        columns = "id",
        sobject = Contact,
        conditions = {
            @SFCondition(key = "email", op = "=", values = "email"),
            @SFCondition(key = "carrier__c", op = "=", values = "carrier"),
            @SFCondition(key = "test__c", op = "=", values = "test")
        }
    ),
    @SFField(
        property = "accountId",
        columns = "id",
        sobject = Account,
        conditions = {
            @SFCondition(key = "name", op = "=", values = "accountName"),
            @SFCondition(key = "type", op = "=", values = "accountType"),
            @SFCondition(key = "carrier__c", op = "=", values = "carrier"),
            @SFCondition(key = "test__c", op = "=", values = "test")
        }
    )
})
public class SFContact extends SFBase {

    @JsonIgnore
    String id;
    @JsonProperty("AccountId")
    String accountId;
    @JsonIgnore
    String accountName; // based off CarrierType.displayName
    @JsonIgnore
    AccountType accountType;
    @JsonProperty("AssistantName")
    String assistantName;
    @JsonProperty("AssistantPhone")
    String assistantPhone;
    @JsonProperty("Birthdate")
    @JsonFormat(shape = STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    Date birthdate;
    @JsonProperty("OwnerId")
    String ownerId;
    @JsonProperty("RecordTypeId")
    String recordTypeId;
    @JsonProperty("CreatedById")
    String createdById;
    @JsonProperty("Department")
    String department;
    @JsonProperty("Description")
    String description;
    @JsonProperty("DoNotCall")
    Boolean doNotCall;
    @JsonProperty("Email")
    String email;
    @JsonProperty("HasOptedOutOfEmail")
    Boolean hasOptedOutOfEmail;
    @JsonProperty("Fax")
    String fax;
    @JsonProperty("HasOptedOutOfFax")
    String hasOptedOutOfFax;
    @JsonProperty("HomePhone")
    String homePhone;
    @JsonProperty("LastModifiedById")
    String lastModifiedById;
    @JsonProperty("LastCURequestDate")
    @JsonFormat(shape = STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    Date lastStayInTouchDate;
    @JsonProperty("LastCUUpdateDate")
    @JsonFormat(shape = STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    Date lastStayInTouchSaveDate;
    @JsonProperty("LeadSource")
    String leadSource;
    @JsonProperty("MailingAddress")
    String mailingAddress;
    @JsonProperty("MobilePhone")
    String mobilePhone;
    @JsonProperty("Name")
    String name;
    @JsonProperty("OtherAddress")
    String otherAddress;
    @JsonProperty("OtherPhone")
    String otherPhone;
    @JsonProperty("Phone")
    String phone;
    @JsonProperty("ReportsToId")
    String reportsToId;
    @JsonProperty("Title")
    String title;
    @JsonProperty("Type")
    ContactType type;

    // Custom fields
    @JsonProperty("Carrier_Platform__c")
    CarrierType carrierPlatform;
    @JsonProperty("Insurance_carrier__c")
    CarrierType insuranceCarrier;

    public SFContact() {}

    @JsonIgnore
    private SFContact(Builder builder) {
        setsObjectType(Contact);
        setId(builder.id);
        setAccountId(builder.accountId);
        setAccountName(builder.accountName);
        setAccountType(builder.accountType);
        setAssistantName(builder.assistantName);
        setAssistantPhone(builder.assistantPhone);
        setBirthdate(builder.birthdate);
        setOwnerId(builder.ownerId);
        setRecordTypeId(builder.recordTypeId);
        setCreatedById(builder.createdById);
        setDepartment(builder.department);
        setDescription(builder.description);
        setDoNotCall(builder.doNotCall);
        setEmail(builder.email);
        setHasOptedOutOfEmail(builder.hasOptedOutOfEmail);
        setFax(builder.fax);
        setHasOptedOutOfFax(builder.hasOptedOutOfFax);
        setHomePhone(builder.homePhone);
        setLastModifiedById(builder.lastModifiedById);
        setLastStayInTouchDate(builder.lastStayInTouchDate);
        setLastStayInTouchSaveDate(builder.lastStayInTouchSaveDate);
        setLeadSource(builder.leadSource);
        setMailingAddress(builder.mailingAddress);
        setMobilePhone(builder.mobilePhone);
        setName(builder.name);
        setOtherAddress(builder.otherAddress);
        setOtherPhone(builder.otherPhone);
        setPhone(builder.phone);
        setReportsToId(builder.reportsToId);
        setTitle(builder.title);
        setType(builder.type);
        setCarrierPlatform(builder.carrierPlatform);
        setInsuranceCarrier(builder.insuranceCarrier);
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAccountId() {
        return accountId;
    }

    public void setAccountId(String accountId) {
        this.accountId = accountId;
    }

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    public AccountType getAccountType() {
        return accountType;
    }

    public void setAccountType(AccountType accountType) {
        this.accountType = accountType;
    }

    public String getAssistantName() {
        return assistantName;
    }

    public void setAssistantName(String assistantName) {
        this.assistantName = assistantName;
    }

    public String getAssistantPhone() {
        return assistantPhone;
    }

    public void setAssistantPhone(String assistantPhone) {
        this.assistantPhone = assistantPhone;
    }

    public Date getBirthdate() {
        return birthdate;
    }

    public void setBirthdate(Date birthdate) {
        this.birthdate = birthdate;
    }

    public String getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(String ownerId) {
        this.ownerId = ownerId;
    }

    public String getRecordTypeId() {
        return recordTypeId;
    }

    public void setRecordTypeId(String recordTypeId) {
        this.recordTypeId = recordTypeId;
    }

    public String getCreatedById() {
        return createdById;
    }

    public void setCreatedById(String createdById) {
        this.createdById = createdById;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getDoNotCall() {
        return doNotCall;
    }

    public void setDoNotCall(Boolean doNotCall) {
        this.doNotCall = doNotCall;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Boolean getHasOptedOutOfEmail() {
        return hasOptedOutOfEmail;
    }

    public void setHasOptedOutOfEmail(Boolean hasOptedOutOfEmail) {
        this.hasOptedOutOfEmail = hasOptedOutOfEmail;
    }

    public String getFax() {
        return fax;
    }

    public void setFax(String fax) {
        this.fax = fax;
    }

    public String getHasOptedOutOfFax() {
        return hasOptedOutOfFax;
    }

    public void setHasOptedOutOfFax(String hasOptedOutOfFax) {
        this.hasOptedOutOfFax = hasOptedOutOfFax;
    }

    public String getHomePhone() {
        return homePhone;
    }

    public void setHomePhone(String homePhone) {
        this.homePhone = homePhone;
    }

    public String getLastModifiedById() {
        return lastModifiedById;
    }

    public void setLastModifiedById(String lastModifiedById) {
        this.lastModifiedById = lastModifiedById;
    }

    public Date getLastStayInTouchDate() {
        return lastStayInTouchDate;
    }

    public void setLastStayInTouchDate(Date lastStayInTouchDate) {
        this.lastStayInTouchDate = lastStayInTouchDate;
    }

    public Date getLastStayInTouchSaveDate() {
        return lastStayInTouchSaveDate;
    }

    public void setLastStayInTouchSaveDate(Date lastStayInTouchSaveDate) {
        this.lastStayInTouchSaveDate = lastStayInTouchSaveDate;
    }

    public String getLeadSource() {
        return leadSource;
    }

    public void setLeadSource(String leadSource) {
        this.leadSource = leadSource;
    }

    public String getMailingAddress() {
        return mailingAddress;
    }

    public void setMailingAddress(String mailingAddress) {
        this.mailingAddress = mailingAddress;
    }

    public String getMobilePhone() {
        return mobilePhone;
    }

    public void setMobilePhone(String mobilePhone) {
        this.mobilePhone = mobilePhone;
    }

    public String getOtherAddress() {
        return otherAddress;
    }

    public void setOtherAddress(String otherAddress) {
        this.otherAddress = otherAddress;
    }

    public String getOtherPhone() {
        return otherPhone;
    }

    public void setOtherPhone(String otherPhone) {
        this.otherPhone = otherPhone;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getReportsToId() {
        return reportsToId;
    }

    public void setReportsToId(String reportsToId) {
        this.reportsToId = reportsToId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public ContactType getType() {
        return type;
    }

    public void setType(ContactType type) {
        this.type = type;
    }

    public CarrierType getCarrierPlatform() {
        return carrierPlatform;
    }

    public void setCarrierPlatform(CarrierType carrierPlatform) {
        this.carrierPlatform = carrierPlatform;
    }

    public CarrierType getInsuranceCarrier() {
        return insuranceCarrier;
    }

    public void setInsuranceCarrier(CarrierType insuranceCarrier) {
        this.insuranceCarrier = insuranceCarrier;
    }

    public static final class Builder {

        private String id;
        private String accountId;
        private String accountName;
        private AccountType accountType;
        private String assistantName;
        private String assistantPhone;
        private Date birthdate;
        private String ownerId;
        private String recordTypeId;
        private String createdById;
        private String department;
        private String description;
        private Boolean doNotCall;
        private String email;
        private Boolean hasOptedOutOfEmail;
        private String fax;
        private String hasOptedOutOfFax;
        private String homePhone;
        private String lastModifiedById;
        private Date lastStayInTouchDate;
        private Date lastStayInTouchSaveDate;
        private String leadSource;
        private String mailingAddress;
        private String mobilePhone;
        private String name;
        private String otherAddress;
        private String otherPhone;
        private String phone;
        private String reportsToId;
        private String title;
        private ContactType type;
        private CarrierType carrierPlatform;
        private CarrierType insuranceCarrier;

        public Builder() {}

        public Builder withId(String val) {
            id = val;
            return this;
        }

        public Builder withAccountId(String val) {
            accountId = val;
            return this;
        }

        public Builder withAccountName(String val) {
            accountName = val;
            return this;
        }

        public Builder withAccountType(AccountType val) {
            accountType = val;
            return this;
        }

        public Builder withAssistantName(String val) {
            assistantName = val;
            return this;
        }

        public Builder withAssistantPhone(String val) {
            assistantPhone = val;
            return this;
        }

        public Builder withBirthdate(Date val) {
            birthdate = val;
            return this;
        }

        public Builder withOwnerId(String val) {
            ownerId = val;
            return this;
        }

        public Builder withRecordTypeId(String val) {
            recordTypeId = val;
            return this;
        }

        public Builder withCreatedById(String val) {
            createdById = val;
            return this;
        }

        public Builder withDepartment(String val) {
            department = val;
            return this;
        }

        public Builder withDescription(String val) {
            description = val;
            return this;
        }

        public Builder withDoNotCall(Boolean val) {
            doNotCall = val;
            return this;
        }

        public Builder withEmail(String val) {
            email = val;
            return this;
        }

        public Builder withHasOptedOutOfEmail(Boolean val) {
            hasOptedOutOfEmail = val;
            return this;
        }

        public Builder withFax(String val) {
            fax = val;
            return this;
        }

        public Builder withHasOptedOutOfFax(String val) {
            hasOptedOutOfFax = val;
            return this;
        }

        public Builder withHomePhone(String val) {
            homePhone = val;
            return this;
        }

        public Builder withLastModifiedById(String val) {
            lastModifiedById = val;
            return this;
        }

        public Builder withLastStayInTouchDate(Date val) {
            lastStayInTouchDate = val;
            return this;
        }

        public Builder withLastStayInTouchSaveDate(Date val) {
            lastStayInTouchSaveDate = val;
            return this;
        }

        public Builder withLeadSource(String val) {
            leadSource = val;
            return this;
        }

        public Builder withMailingAddress(String val) {
            mailingAddress = val;
            return this;
        }

        public Builder withMobilePhone(String val) {
            mobilePhone = val;
            return this;
        }

        public Builder withName(String val) {
            name = val;
            return this;
        }

        public Builder withOtherAddress(String val) {
            otherAddress = val;
            return this;
        }

        public Builder withOtherPhone(String val) {
            otherPhone = val;
            return this;
        }

        public Builder withPhone(String val) {
            phone = val;
            return this;
        }

        public Builder withReportsToId(String val) {
            reportsToId = val;
            return this;
        }

        public Builder withTitle(String val) {
            title = val;
            return this;
        }

        public Builder withType(ContactType val) {
            type = val;
            return this;
        }

        public Builder withCarrierPlatform(CarrierType val) {
            carrierPlatform = val;
            return this;
        }

        public Builder withInsuranceCarrier(CarrierType val) {
            insuranceCarrier = val;
            return this;
        }

        public SFContact build() {
            return new SFContact(this);
        }
    }

    @Override
    public boolean equals(Object o) {
        if(this == o) {
            return true;
        }

        if(!(o instanceof SFContact)) {
            return false;
        }

        SFContact sfContact = (SFContact) o;

        return new EqualsBuilder()
            .append(getId(), sfContact.getId())
            .append(getAccountId(), sfContact.getAccountId())
            .append(getAccountName(), sfContact.getAccountName())
            .append(getAccountType(), sfContact.getAccountType())
            .append(getAssistantName(), sfContact.getAssistantName())
            .append(getAssistantPhone(), sfContact.getAssistantPhone())
            .append(getBirthdate(), sfContact.getBirthdate())
            .append(getOwnerId(), sfContact.getOwnerId())
            .append(getRecordTypeId(), sfContact.getRecordTypeId())
            .append(getCreatedById(), sfContact.getCreatedById())
            .append(getDepartment(), sfContact.getDepartment())
            .append(getDescription(), sfContact.getDescription())
            .append(getDoNotCall(), sfContact.getDoNotCall())
            .append(getEmail(), sfContact.getEmail())
            .append(getHasOptedOutOfEmail(), sfContact.getHasOptedOutOfEmail())
            .append(getFax(), sfContact.getFax())
            .append(getHasOptedOutOfFax(), sfContact.getHasOptedOutOfFax())
            .append(getHomePhone(), sfContact.getHomePhone())
            .append(getLastModifiedById(), sfContact.getLastModifiedById())
            .append(getLastStayInTouchDate(), sfContact.getLastStayInTouchDate())
            .append(getLastStayInTouchSaveDate(), sfContact.getLastStayInTouchSaveDate())
            .append(getLeadSource(), sfContact.getLeadSource())
            .append(getMailingAddress(), sfContact.getMailingAddress())
            .append(getMobilePhone(), sfContact.getMobilePhone())
            .append(getName(), sfContact.getName())
            .append(getOtherAddress(), sfContact.getOtherAddress())
            .append(getOtherPhone(), sfContact.getOtherPhone())
            .append(getPhone(), sfContact.getPhone())
            .append(getReportsToId(), sfContact.getReportsToId())
            .append(getTitle(), sfContact.getTitle())
            .append(getType(), sfContact.getType())
            .append(getCarrierPlatform(), sfContact.getCarrierPlatform())
            .append(getInsuranceCarrier(), sfContact.getInsuranceCarrier())
            .isEquals();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder(17, 37)
            .append(getId())
            .append(getAccountId())
            .append(getAccountName())
            .append(getAccountType())
            .append(getAssistantName())
            .append(getAssistantPhone())
            .append(getBirthdate())
            .append(getOwnerId())
            .append(getRecordTypeId())
            .append(getCreatedById())
            .append(getDepartment())
            .append(getDescription())
            .append(getDoNotCall())
            .append(getEmail())
            .append(getHasOptedOutOfEmail())
            .append(getFax())
            .append(getHasOptedOutOfFax())
            .append(getHomePhone())
            .append(getLastModifiedById())
            .append(getLastStayInTouchDate())
            .append(getLastStayInTouchSaveDate())
            .append(getLeadSource())
            .append(getMailingAddress())
            .append(getMobilePhone())
            .append(getName())
            .append(getOtherAddress())
            .append(getOtherPhone())
            .append(getPhone())
            .append(getReportsToId())
            .append(getTitle())
            .append(getType())
            .append(getCarrierPlatform())
            .append(getInsuranceCarrier())
            .toHashCode();
    }
}
