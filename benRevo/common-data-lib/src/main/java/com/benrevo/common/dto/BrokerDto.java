package com.benrevo.common.dto;

import static org.apache.commons.lang3.StringUtils.isBlank;

import com.benrevo.common.enums.BrokerLocale;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class BrokerDto {

    private Long id;
    private String name;
    private String address;
    private String city;
    private String state;
    private String zip;
    private BrokerLocale locale;
    @JsonProperty("broker_token")
    private String brokerToken;
    private boolean generalAgent;
    private List<PersonDto> sales;
    private List<PersonDto> presales;
    private PersonDto specialty;
    
    @Deprecated
    private Long salesId;
    @Deprecated
    private String salesFirstName;
    @Deprecated
    private String salesLastName;
    @Deprecated
    private String salesEmail;
    @Deprecated
    private Long presalesId;
    @Deprecated
    private String presalesFirstName;
    @Deprecated
    private String presalesLastName;
    @Deprecated
    private String presalesEmail;
    @Deprecated
    private String specialtyBrokerEmail;
    private String bcc;
    private String producer;
    private String logo;

    public BrokerDto() {
    }

    private BrokerDto(Builder builder) {
        setId(builder.id);
        setName(builder.name);
        setAddress(builder.address);
        setCity(builder.city);
        setState(builder.state);
        setZip(builder.zip);
        setLocale(builder.locale);
        setBrokerToken(builder.brokerToken);
        setGeneralAgent(builder.generalAgent);
        setBcc(builder.bcc);
        setProducer(builder.producer);
        setLogo(builder.logo);
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
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

    public BrokerLocale getLocale() {
        return locale;
    }

    public void setLocale(BrokerLocale locale) {
        this.locale = locale;
    }

    public String getBrokerToken() {
        return brokerToken;
    }

    public void setBrokerToken(String brokerToken) {
        this.brokerToken = brokerToken;
    }

    public boolean isGeneralAgent() {
        return generalAgent;
    }

    public void setGeneralAgent(boolean generalAgent) {
        this.generalAgent = generalAgent;
    }
    @Deprecated
    public String getSalesFirstName() {
        return salesFirstName;
    }
    @Deprecated
    public void setSalesFirstName(String salesFirstName) {
        this.salesFirstName = salesFirstName;
    }
    @Deprecated
    public String getSalesLastName() {
        return salesLastName;
    }
    @Deprecated
    public void setSalesLastName(String salesLastName) {
        this.salesLastName = salesLastName;
    }
    @Deprecated
    public String getSalesEmail() {
        return salesEmail;
    }
    @Deprecated
    public void setSalesEmail(String salesEmail) {
        this.salesEmail = salesEmail;
    }
    @Deprecated
    public Long getSalesId() {
        return salesId;
    }
    @Deprecated
    public void setSalesId(Long salesId) {
        this.salesId = salesId;
    }
    @Deprecated
    public String getPresalesFirstName() {
        return presalesFirstName;
    }
    @Deprecated
    public void setPresalesFirstName(String presalesFirstName) {
        this.presalesFirstName = presalesFirstName;
    }
    @Deprecated
    public String getPresalesLastName() {
        return presalesLastName;
    }
    @Deprecated
    public void setPresalesLastName(String presalesLastName) {
        this.presalesLastName = presalesLastName;
    }
    @Deprecated
    public String getPresalesEmail() {
        return presalesEmail;
    }
    @Deprecated
    public void setPresalesEmail(String presalesEmail) {
        this.presalesEmail = presalesEmail;
    }
    @Deprecated
    public Long getPresalesId() {
        return presalesId;
    }
    @Deprecated
    public void setPresalesId(Long presalesId) {
        this.presalesId = presalesId;
    }
    
    public List<PersonDto> getSales() {
        return sales;
    }
    
    public void setSales(List<PersonDto> sales) {
        this.sales = sales;
    }
    
    public List<PersonDto> getPresales() {
        return presales;
    }
    
    public void setPresales(List<PersonDto> presales) {
        this.presales = presales;
    }
    @Deprecated
    public String getSpecialtyBrokerEmail() {
        return specialtyBrokerEmail;
    }
    @Deprecated
    public void setSpecialtyBrokerEmail(String specialtyBrokerEmail) {
        this.specialtyBrokerEmail = specialtyBrokerEmail;
    }
    
    public PersonDto getSpecialty() {
        return specialty;
    }
    
    public void setSpecialty(PersonDto specialty) {
        this.specialty = specialty;
    }

    public String getBcc() {
        return bcc;
    }

    public void setBcc(String bcc) {
        this.bcc = bcc;
    }

    public String getProducer() {
        return producer;
    }

    public void setProducer(String producer) {
        this.producer = producer;
    }

    public String getLogo() {
        return logo;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

    public String getBrokerageAddress(){
        StringBuilder builder = new StringBuilder();
        if(!isBlank(this.address)){
            builder.append(this.address);
        }

        if(!isBlank(this.city)){
            builder.append(this.city);
        }

        if(!isBlank(this.state)){
            builder.append(this.state);
        }

        if(!isBlank(this.zip)){
            builder.append(this.zip);
        }

        return builder.toString();
    }

    public static final class Builder {

        private long id;
        private String name;
        private String address;
        private String city;
        private String state;
        private String zip;
        private BrokerLocale locale;
        private String brokerToken;
        private boolean generalAgent;
        private String bcc;
        private String producer;
        private String logo;

        public Builder() {
        }

        public Builder withId(long val) {
            id = val;
            return this;
        }

        public Builder withName(String val) {
            name = val;
            return this;
        }

        public Builder withAddress(String val) {
            address = val;
            return this;
        }

        public Builder withCity(String val) {
            city = val;
            return this;
        }

        public Builder withState(String val) {
            state = val;
            return this;
        }

        public Builder withZip(String val) {
            zip = val;
            return this;
        }

        public Builder withBrokerToken(String val) {
            brokerToken = val;
            return this;
        }

        public Builder withGeneralAgent(boolean val) {
            generalAgent = val;
            return this;
        }

        public Builder withLocale(BrokerLocale val) {
            locale = val;
            return this;
        }

        public Builder withBcc(String val) {
            bcc = val;
            return this;
        }

        public Builder withProducer(String val) {
            producer = val;
            return this;
        }

        public Builder withLogo(String val) {
            logo = val;
            return this;
        }

        public BrokerDto build() {
            return new BrokerDto(this);
        }
    }
}
