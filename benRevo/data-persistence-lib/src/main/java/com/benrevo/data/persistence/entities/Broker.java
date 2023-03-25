package com.benrevo.data.persistence.entities;

import com.benrevo.common.dto.BrokerDto;
import com.benrevo.common.dto.PersonDto;
import com.benrevo.common.enums.BrokerLocale;
import com.benrevo.common.enums.PersonType;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.util.ObjectMapperUtils;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.Table;
import javax.persistence.Transient;
import org.apache.commons.lang3.StringUtils;

@Entity
@Table(name = "broker")
public class Broker {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "broker_id")
  private Long brokerId;

  @Column(name = "name")
  private String name;

  @Column(name = "address")
  private String address;

  @Column(name = "city")
  private String city;

  @Column(name = "state")
  private String state;

  @Column(name = "zip")
  private String zip;

  @Column(name = "broker_token")
  private String brokerToken;
 
  @OneToMany(mappedBy = "broker", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
  private List<BrokerPersonRelation> persons = new ArrayList<>();

  @OrderBy("id DESC")
  @OneToMany(mappedBy = "broker", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
  private List<Client> clients;

  @OrderBy("id DESC")
  @OneToMany(mappedBy = "broker", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
  private List<ClientTeam> clientTeamMembers;

  @Column(name = "locale")
  @Enumerated(EnumType.STRING)
  private BrokerLocale locale;

  @Column(name = "bcc")
  private String bcc;

  @Column(name = "general_agent")
  private boolean generalAgent;

  @Column(name = "producer")
  private String producer;

    @Column(name = "logo")
    private String logo;

  public Broker() {
  }

  public Broker(
      String name,
      String address,
      String city,
      String state,
      String zip,
      String brokerToken
  ) {
    this.name = name;
    this.address = address;
    this.city = city;
    this.state = state;
    this.zip = zip;
    this.brokerToken = brokerToken;
  }

  public List<ClientTeam> getClientTeam() {
    return clientTeamMembers;
  }

  public void setClientTeam(List<ClientTeam> clientTeamMembers) {
    this.clientTeamMembers = clientTeamMembers;
  }

  public Long getBrokerId() {
    return brokerId;
  }

  public void setBrokerId(Long brokerId) {
    this.brokerId = brokerId;
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

  public String getBrokerToken() {
    return brokerToken;
  }

  public void setBrokerToken(String brokerToken) {
    this.brokerToken = brokerToken;
  }

  public List<Client> getClients() {
    return clients;
  }

  public void setClients(List<Client> clients) {
    this.clients = clients;
  }
  
    @Deprecated // TODO process list of sales
    @Transient
    public String getSalesFirstName() {
        List<Person> sales = getSales();
        if(!sales.isEmpty()) {
            return sales.get(0).getFirstName();
        }
        return null;
    }

    @Deprecated // TODO process list of sales
    @Transient
    public String getSalesFullName() {
        List<Person> sales = getSales();
        if(!sales.isEmpty()) {
            return sales.get(0).getFullName();
        }
        return null;
    }

    @Deprecated // TODO process list of sales
    @Transient
    public String getSalesEmail() {
        List<Person> sales = getSales();
        if(!sales.isEmpty()) {
            return sales.get(0).getEmail();
        }
        return null;
    }

    @Deprecated // TODO process list of presales
    @Transient
    public String getPresalesFirstName() {
        List<Person> presales = getPresales();
        if(!presales.isEmpty()) {
            return presales.get(0).getFirstName();
        }
        return null;
    }
    
    @Deprecated // TODO process list of presales
    @Transient
    public String getPresalesFullName() {
        List<Person> presales = getPresales();
        if(!presales.isEmpty()) {
            return presales.get(0).getFullName();
        }
        return null;
    }
    
    @Deprecated // TODO process list of presales
    @Transient
    public String getPresalesEmail() {
        List<Person> presales = getPresales();
        if(!presales.isEmpty()) {
            return presales.get(0).getEmail();
        }
        return null;
    }
    
    @Transient
    public String getSpecialtyEmail() {
        return getSpecialtyEmail(PersonType.SPECIALTY);
    }
    
    @Transient
    public String getSpecialtyEmail(PersonType personType) {
        if(personType != PersonType.SPECIALTY && personType != PersonType.SPECIALTY_RENEWAL) {
            throw new IllegalArgumentException("Specialty person should have SPECIALTY or SPECIALTY_RENEWAL type");
        }
        if(!persons.isEmpty()) {
            for(BrokerPersonRelation bpr : persons) {
                if(bpr.getPerson().getType() == PersonType.SPECIALTY) {
                    return bpr.getPerson().getEmail();
                }
            }
        }
        return null;
    }

  public BrokerLocale getLocale() {
    return locale;
  }

  public void setLocale(BrokerLocale locale) {
    this.locale = locale;
  }

  public String getBcc() {
    return bcc;
  }

  public void setBcc(String bcc) {
    this.bcc = bcc;
  }

  public boolean isGeneralAgent() {
    return generalAgent;
  }

  public void setGeneralAgent(boolean generalAgent) {
    this.generalAgent = generalAgent;
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
    
    public List<BrokerPersonRelation> getPersons() {
        return persons;
    }
    
    @Transient
    public List<Person> getSales() {
        return getSales(PersonType.SALES);
    }
    
    @Transient
    public List<Person> getSales(PersonType personType) {
        if(personType != PersonType.SALES && personType != PersonType.SALES_RENEWAL) {
            throw new IllegalArgumentException("Sales person should have SALES or SALES_RENEWAL type");
        }
        List<Person> sales = new ArrayList<>();
        if(!persons.isEmpty()) {
            for(BrokerPersonRelation bpr : persons) {
                if(bpr.getPerson().getType() == personType) {
                    sales.add(bpr.getPerson());
                }
            }
        }
        return sales;
    }
    
    @Transient
    public void addSalePerson(Person person) {
        addPerson(person, PersonType.SALES);
    }

    public void addPerson(Person person, PersonType personType) {
        if(person.getType() != personType) {
            throw new BaseException(StringUtils.capitalize(personType.name().toLowerCase()) 
                + " person should have " + personType.name() + " type");
        }
        Person exist = persons.stream()
            .map(BrokerPersonRelation::getPerson)
            .filter(p -> p.equals(person))
            .findFirst().orElse(null);
        if(exist == null) {
            persons.add(new BrokerPersonRelation(this, person));
        }
    }
    
    @Transient
    public void setSales(Person sales) {
        setSales(sales == null ? Collections.emptyList() : Collections.singletonList(sales));
    } 
    
    @Transient
    public void setSales(List<Person> sales) {
        setPersons(sales, PersonType.SALES);
    } 

    @Transient
    public List<Person> getPresales() {
        List<Person> presales = new ArrayList<>();
        if(!persons.isEmpty()) {
            for(BrokerPersonRelation bpr : persons) {
                if(bpr.getPerson().getType() == PersonType.PRESALES) {
                    presales.add(bpr.getPerson());
                }
            }
        }
        return presales;
    }
    
    @Transient
    public void addSpecialtyPerson(Person person) {
        addPerson(person, PersonType.SPECIALTY);
    }
  
    @Transient
    public void addPresalePerson(Person person) {
        addPerson(person, PersonType.PRESALES);
    }
    
    @Transient
    public void setPresales(Person presales) {
        setPresales(presales == null ? Collections.emptyList() : Collections.singletonList(presales));
    }

    @Transient
    public void setPresales(List<Person> presales) {
        setPersons(presales, PersonType.PRESALES);
    } 
    
    @Transient
    public void setSpecialty(Person specialty) {
        setPersons(specialty == null ? Collections.emptyList() : Collections.singletonList(specialty), PersonType.SPECIALTY);
    }
    
    private void setPersons(List<Person> newPersons, PersonType personType) {
        persons.removeIf(bpr -> bpr.getPerson().getType() == personType
            && !newPersons.contains(bpr.getPerson()));
        for(Person newPerson : newPersons) {
            addPerson(newPerson, personType);
        }
    } 

  @Override
  public int hashCode() {
    return new org.apache.commons.lang3.builder.HashCodeBuilder(1, 31)
        .append(getBrokerId())
        .append(getAddress())
        .append(getBcc())
        .append(getBrokerToken())
        .append(getCity())
        .append(getLocale())
        .append(getName())
        .append(getState())
        .append(getZip())
        .toHashCode();
  }

  @Override
  public boolean equals(Object obj) {
    if (this == obj) {
      return true;
    }
    if (obj == null || getClass() != obj.getClass()) {
      return false;
    }
    Broker other = (Broker) obj;

    return new org.apache.commons.lang3.builder.EqualsBuilder()
        .append(getBrokerId(), other.getBrokerId())
        .append(getAddress(), other.getAddress())
        .append(getBcc(), other.getBcc())
        .append(getBrokerToken(), other.getBrokerToken())
        .append(getCity(), other.getCity())
        .append(getLocale(), other.getLocale())
        .append(getName(), other.getName())
        .append(getState(), other.getState())
        .append(getZip(), other.getZip())
        .isEquals();
  }

    public BrokerDto toBrokerDto() {
        BrokerDto dto = new BrokerDto();
        dto.setId(brokerId);
        dto.setName(name);
        dto.setAddress(address);
        dto.setCity(city);
        dto.setState(state);
        dto.setZip(zip);
        dto.setLocale(locale);
        dto.setBrokerToken(brokerToken);
        dto.setGeneralAgent(generalAgent);
        List<Person> sales = getSales();
        if(!sales.isEmpty()) {
            Person sale = sales.get(0);
            dto.setSalesId(sale.getPersonId());
            dto.setSalesEmail(sale.getEmail());
            dto.setSalesFirstName(sale.getFirstName());
            dto.setSalesLastName(sale.getLastName());
            List<PersonDto> salesDtos = ObjectMapperUtils.mapAll(sales, PersonDto.class);
            dto.setSales(salesDtos);
        }
        List<Person> presales = getPresales();
        if(!presales.isEmpty()) {
            Person presale = presales.get(0);
            dto.setPresalesId(presale.getPersonId());
            dto.setPresalesEmail(presale.getEmail());
            dto.setPresalesFirstName(presale.getFirstName());
            dto.setPresalesLastName(presale.getLastName());
            List<PersonDto> presalesDtos = ObjectMapperUtils.mapAll(presales, PersonDto.class);
            dto.setPresales(presalesDtos);
        }
        for(BrokerPersonRelation bpr : persons) {
            if(bpr.getPerson().getType() == PersonType.SPECIALTY) {
                PersonDto specialtyDto = ObjectMapperUtils.map(bpr.getPerson(), PersonDto.class);
                dto.setSpecialty(specialtyDto);
                dto.setSpecialtyBrokerEmail(specialtyDto.getEmail());
                break;
            }
        }
       
        dto.setLogo(logo);
        dto.setProducer(producer);

        return dto;
    }

  @Override
  public String toString() {
    return "Broker{" +
        "brokerId=" + brokerId +
        ", name='" + name + '\'' +
        ", address='" + address + '\'' +
        ", city='" + city + '\'' +
        ", state='" + state + '\'' +
        ", locale='" + locale + '\'' +
        ", zip='" + zip + '\'' +
        ", brokerToken='" + brokerToken + '\'' +
        ", clients=" + clients +
        '}';
  }
}
