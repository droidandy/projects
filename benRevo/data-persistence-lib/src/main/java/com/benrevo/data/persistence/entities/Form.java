package com.benrevo.data.persistence.entities;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.List;

@Entity
@Table(name = "form")
public class Form {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name = "form_id")
    private Long formId;

    @Column	(name = "name")
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "carrier_id", nullable = false)
    private Carrier carrier;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "form", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FormQuestion> formQuestions;

    public Long getFormId() {
        return formId;
    }

    public void setFormId(Long formId) {
        this.formId = formId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Carrier getCarrier() {
        return carrier;
    }

    public void setCarrier(Carrier carrier) {
        this.carrier = carrier;
    }

    public List<FormQuestion> getFormQuestions() {
        return formQuestions;
    }

    public void setFormQuestions(List<FormQuestion> formQuestions) {
        this.formQuestions = formQuestions;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Form)) return false;

        Form form = (Form) o;

        if (!carrier.equals(form.carrier)) return false;
        if (!formId.equals(form.formId)) return false;
        if (!name.equals(form.name)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = formId.hashCode();
        result = 31 * result + name.hashCode();
        result = 31 * result + carrier.hashCode();
        return result;
    }
}