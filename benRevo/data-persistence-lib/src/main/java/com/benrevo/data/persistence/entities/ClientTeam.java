package com.benrevo.data.persistence.entities;


import javax.persistence.*;
import org.springframework.beans.BeanUtils;

@Entity
@Table(name = "client_team")
public class ClientTeam {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    @Column(name = "id")
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "client_id")
    private Client client;

    @ManyToOne(optional = false)
    @JoinColumn(name = "broker_id")
    private Broker broker;

    @Column(name = "auth_id")
    private String authId;

    @Column(name = "email")
    private String email;

    @Column(name = "name")
    private String name;

    public ClientTeam() {
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public Broker getBroker() {
        return broker;
    }

    public void setBroker(Broker broker) {
        this.broker = broker;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAuthId() {
        return authId;
    }

    public void setAuthId(String authId) {
        this.authId = authId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    
    public ClientTeam copy() {
      ClientTeam copy = new ClientTeam();
      BeanUtils.copyProperties(this, copy, "id");
      return copy; 
  }
}
