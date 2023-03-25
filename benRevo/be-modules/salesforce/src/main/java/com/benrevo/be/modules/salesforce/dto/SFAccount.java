package com.benrevo.be.modules.salesforce.dto;

import com.benrevo.be.modules.salesforce.enums.AccountType;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.be.modules.salesforce.annotation.SFLookup;
import com.benrevo.be.modules.salesforce.annotation.SFLookup.SFCondition;
import com.benrevo.be.modules.salesforce.annotation.SFLookup.SFField;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

import static com.benrevo.be.modules.salesforce.enums.SalesforceObject.Account;
import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL;


/**
 * Created by ebrandell on 11/9/17 at 3:23 PM.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(NON_NULL)
@SFLookup(
    @SFField(
        property = "id",
        columns = {"id"},
        sobject = Account,
        conditions = {
            @SFCondition(key = "name", op = "=", values = {"currentName","name"}),
            @SFCondition(key = "carrier__c", op = "=", values = "carrier"),
            @SFCondition(key = "type", op = "=", values = "type"),
            @SFCondition(key = "test__c", op = "=", values = "test")
        }
    )
)
public class SFAccount extends SFBase {

    // Standard fields
    @JsonIgnore
    String id;
    @JsonProperty("AccountNumber")
    String accountNumber;
    @JsonProperty("Owner")
    String owner;
    @JsonProperty("RecordTypeId")
    String recordTypeId;
    @JsonProperty("Site")
    String site;
    @JsonProperty("AccountSource")
    String accountSource;
    @JsonProperty("AnnualRevenue")
    String annualRevenue;
    @JsonProperty("BillingAddress")
    String billingAddress;
    @JsonProperty("CreatedById")
    String createdById;
    @JsonProperty("Jigsaw")
    String jigsaw;
    @JsonProperty("Description")
    String description;
    @JsonProperty("NumberOfEmployees")
    String numberOfEmployees;
    @JsonProperty("Fax")
    String fax;
    @JsonProperty("Industry")
    String industry;
    @JsonProperty("LastModifiedBy")
    String lastModifiedBy;
    @JsonProperty("Ownership")
    String ownership;
    @JsonProperty("Parent")
    String parent;
    @JsonProperty("Phone")
    String phone;
    @JsonProperty("Rating")
    String rating;
    @JsonProperty("ShippingAddress")
    String shippingAddress;
    @JsonProperty("Sic")
    String sic;
    @JsonProperty("SicDesc")
    String sicDesc;
    @JsonProperty("TickerSymbol")
    String tickerSymbol;
    @JsonProperty("Type")
    AccountType type;
    @JsonProperty("Website")
    String website;

    public SFAccount() {}

    @JsonIgnore
    private SFAccount(Builder builder) {
        setsObjectType(Account);
        setId(builder.id);
        setCurrentName(builder.currentName);
        setName(builder.name);
        setAccountNumber(builder.accountNumber);
        setOwner(builder.owner);
        setRecordTypeId(builder.recordTypeId);
        setSite(builder.site);
        setAccountSource(builder.accountSource);
        setAnnualRevenue(builder.annualRevenue);
        setBillingAddress(builder.billingAddress);
        setCreatedById(builder.createdById);
        setJigsaw(builder.jigsaw);
        setDescription(builder.description);
        setNumberOfEmployees(builder.numberOfEmployees);
        setFax(builder.fax);
        setIndustry(builder.industry);
        setLastModifiedBy(builder.lastModifiedBy);
        setOwnership(builder.ownership);
        setParent(builder.parent);
        setPhone(builder.phone);
        setRating(builder.rating);
        setShippingAddress(builder.shippingAddress);
        setSic(builder.sic);
        setSicDesc(builder.sicDesc);
        setCarrier(builder.carrier);
        setTest(builder.test);
        setTickerSymbol(builder.tickerSymbol);
        setType(builder.type);
        setWebsite(builder.website);
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public String getRecordTypeId() {
        return recordTypeId;
    }

    public void setRecordTypeId(String recordTypeId) {
        this.recordTypeId = recordTypeId;
    }

    public String getSite() {
        return site;
    }

    public void setSite(String site) {
        this.site = site;
    }

    public String getAccountSource() {
        return accountSource;
    }

    public void setAccountSource(String accountSource) {
        this.accountSource = accountSource;
    }

    public String getAnnualRevenue() {
        return annualRevenue;
    }

    public void setAnnualRevenue(String annualRevenue) {
        this.annualRevenue = annualRevenue;
    }

    public String getBillingAddress() {
        return billingAddress;
    }

    public void setBillingAddress(String billingAddress) {
        this.billingAddress = billingAddress;
    }

    public String getCreatedById() {
        return createdById;
    }

    public void setCreatedById(String createdById) {
        this.createdById = createdById;
    }

    public String getJigsaw() {
        return jigsaw;
    }

    public void setJigsaw(String jigsaw) {
        this.jigsaw = jigsaw;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getNumberOfEmployees() {
        return numberOfEmployees;
    }

    public void setNumberOfEmployees(String numberOfEmployees) {
        this.numberOfEmployees = numberOfEmployees;
    }

    public String getFax() {
        return fax;
    }

    public void setFax(String fax) {
        this.fax = fax;
    }

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public String getLastModifiedBy() {
        return lastModifiedBy;
    }

    public void setLastModifiedBy(String lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
    }

    public String getOwnership() {
        return ownership;
    }

    public void setOwnership(String ownership) {
        this.ownership = ownership;
    }

    public String getParent() {
        return parent;
    }

    public void setParent(String parent) {
        this.parent = parent;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getRating() {
        return rating;
    }

    public void setRating(String rating) {
        this.rating = rating;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public String getSic() {
        return sic;
    }

    public void setSic(String sic) {
        this.sic = sic;
    }

    public String getSicDesc() {
        return sicDesc;
    }

    public void setSicDesc(String sicDesc) {
        this.sicDesc = sicDesc;
    }

    public String getTickerSymbol() {
        return tickerSymbol;
    }

    public void setTickerSymbol(String tickerSymbol) {
        this.tickerSymbol = tickerSymbol;
    }

    public AccountType getType() {
        return type;
    }

    public void setType(AccountType type) {
        this.type = type;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public static final class Builder {

        private String id;
        private String currentName;
        private String name;
        private String accountNumber;
        private String owner;
        private String recordTypeId;
        private String site;
        private String accountSource;
        private String annualRevenue;
        private String billingAddress;
        private String createdById;
        private String jigsaw;
        private String description;
        private String numberOfEmployees;
        private String fax;
        private String industry;
        private String lastModifiedBy;
        private String ownership;
        private String parent;
        private String phone;
        private String rating;
        private String shippingAddress;
        private String sic;
        private String sicDesc;
        private Boolean test;
        private CarrierType carrier;
        private String tickerSymbol;
        private AccountType type;
        private String website;

        public Builder() {}

        public Builder withId(String val) {
            id = val;
            return this;
        }

        public Builder withCurrentName(String val) {
            currentName = val;
            return this;
        }

        public Builder withName(String val) {
            name = val;
            return this;
        }

        public Builder withAccountNumber(String val) {
            accountNumber = val;
            return this;
        }

        public Builder withOwner(String val) {
            owner = val;
            return this;
        }

        public Builder withRecordTypeId(String val) {
            recordTypeId = val;
            return this;
        }

        public Builder withSite(String val) {
            site = val;
            return this;
        }

        public Builder withAccountSource(String val) {
            accountSource = val;
            return this;
        }

        public Builder withAnnualRevenue(String val) {
            annualRevenue = val;
            return this;
        }

        public Builder withBillingAddress(String val) {
            billingAddress = val;
            return this;
        }

        public Builder withCreatedById(String val) {
            createdById = val;
            return this;
        }

        public Builder withJigsaw(String val) {
            jigsaw = val;
            return this;
        }

        public Builder withDescription(String val) {
            description = val;
            return this;
        }

        public Builder withNumberOfEmployees(String val) {
            numberOfEmployees = val;
            return this;
        }

        public Builder withFax(String val) {
            fax = val;
            return this;
        }

        public Builder withIndustry(String val) {
            industry = val;
            return this;
        }

        public Builder withLastModifiedBy(String val) {
            lastModifiedBy = val;
            return this;
        }

        public Builder withOwnership(String val) {
            ownership = val;
            return this;
        }

        public Builder withParent(String val) {
            parent = val;
            return this;
        }

        public Builder withPhone(String val) {
            phone = val;
            return this;
        }

        public Builder withRating(String val) {
            rating = val;
            return this;
        }

        public Builder withShippingAddress(String val) {
            shippingAddress = val;
            return this;
        }

        public Builder withSic(String val) {
            sic = val;
            return this;
        }

        public Builder withSicDesc(String val) {
            sicDesc = val;
            return this;
        }

        public Builder withTest(Boolean val) {
            test = val;
            return this;
        }

        public Builder withCarrierPlatform(CarrierType val) {
            carrier = val;
            return this;
        }

        public Builder withTickerSymbol(String val) {
            tickerSymbol = val;
            return this;
        }

        public Builder withType(AccountType val) {
            type = val;
            return this;
        }

        public Builder withWebsite(String val) {
            website = val;
            return this;
        }

        public SFAccount build() {
            return new SFAccount(this);
        }
    }

    @Override
    public boolean equals(Object o) {
        if(this == o) { return true; }

        if(!(o instanceof SFAccount)) { return false; }

        SFAccount that = (SFAccount) o;

        return new EqualsBuilder()
            .append(getId(), that.getId())
            .append(getCurrentName(), that.getCurrentName())
            .append(getName(), that.getName())
            .append(getAccountNumber(), that.getAccountNumber())
            .append(getOwner(), that.getOwner())
            .append(getRecordTypeId(), that.getRecordTypeId())
            .append(getSite(), that.getSite())
            .append(getAccountSource(), that.getAccountSource())
            .append(getAnnualRevenue(), that.getAnnualRevenue())
            .append(getBillingAddress(), that.getBillingAddress())
            .append(getCreatedById(), that.getCreatedById())
            .append(getJigsaw(), that.getJigsaw())
            .append(getDescription(), that.getDescription())
            .append(getNumberOfEmployees(), that.getNumberOfEmployees())
            .append(getFax(), that.getFax())
            .append(getIndustry(), that.getIndustry())
            .append(getLastModifiedBy(), that.getLastModifiedBy())
            .append(getOwnership(), that.getOwnership())
            .append(getParent(), that.getParent())
            .append(getPhone(), that.getPhone())
            .append(getRating(), that.getRating())
            .append(getShippingAddress(), that.getShippingAddress())
            .append(getSic(), that.getSic())
            .append(getSicDesc(), that.getSicDesc())
            .append(getTest(), that.getTest())
            .append(getCarrier(), that.getCarrier())
            .append(getTickerSymbol(), that.getTickerSymbol())
            .append(getType(), that.getType())
            .append(getWebsite(), that.getWebsite())
            .isEquals();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder(17, 37)
            .append(getId())
            .append(getCurrentName())
            .append(getName())
            .append(getAccountNumber())
            .append(getOwner())
            .append(getRecordTypeId())
            .append(getSite())
            .append(getAccountSource())
            .append(getAnnualRevenue())
            .append(getBillingAddress())
            .append(getCreatedById())
            .append(getJigsaw())
            .append(getDescription())
            .append(getNumberOfEmployees())
            .append(getFax())
            .append(getIndustry())
            .append(getLastModifiedBy())
            .append(getOwnership())
            .append(getParent())
            .append(getPhone())
            .append(getRating())
            .append(getShippingAddress())
            .append(getSic())
            .append(getSicDesc())
            .append(getTest())
            .append(getCarrier())
            .append(getTickerSymbol())
            .append(getType())
            .append(getWebsite())
            .toHashCode();
    }
}
