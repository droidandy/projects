package com.benrevo.data.persistence.entities;

import javax.persistence.*;

import com.benrevo.common.enums.DocumentAttributeName;

@Entity
@DiscriminatorValue("DOCUMENT")
public class DocumentAttribute extends Attribute {

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name = "ref")
    private Document document;
    
    @Column(name = "name")
    @Enumerated(EnumType.STRING)
    protected DocumentAttributeName name;
    
    public DocumentAttribute() {
    }

    public DocumentAttribute(Document document, DocumentAttributeName name) {
        this.document = document;
        this.name = name;
    }

    public Document getDocument() {
        return document;
    }

    public void setDocument(Document document) {
        this.document = document;
    }

    public DocumentAttributeName getName() {
        return name;
    }

    public void setName(DocumentAttributeName name) {
        this.name = name;
    }
    
}
