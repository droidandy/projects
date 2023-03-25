package com.benrevo.data.persistence.entities;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

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

import org.hibernate.annotations.Where;

import com.benrevo.common.dto.DocumentDto;

@Entity
@Table(name = "document")
public class Document {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "document_id")
    private Long documentId;

    @ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "carrier_id", nullable = false)
	private Carrier carrier;

	@Column(name = "file_name")
	private String fileName;
    
	@Column(name = "file_extension")
	private String fileExtension;
	
	@Column(name = "mime_type")
    private String mimeType;

	@Column(name = "s3_key")
	private String s3Key;

	@Column(name = "last_updated")
	private Date lastUpdated;

	@OneToMany(mappedBy="document", fetch=FetchType.LAZY, cascade = CascadeType.REMOVE)
	@Where(clause="type='DOCUMENT'")
	private List<DocumentAttribute> attributes = new ArrayList<>();
	
    public Document() {}
    
    public Long getDocumentId() {
		return documentId;
	}

	public void setDocumentId(Long documentId) {
		this.documentId = documentId;
	}

	public Carrier getCarrier() {
		return carrier;
	}

	public void setCarrier(Carrier carrier) {
		this.carrier = carrier;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getFileExtension() {
		return fileExtension;
	}

	public void setFileExtension(String fileExtension) {
		this.fileExtension = fileExtension;
	}

	public String getMimeType() {
        return mimeType;
    }
  
    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    public String getS3Key() {
		return s3Key;
	}

	public void setS3Key(String s3Key) {
		this.s3Key = s3Key;
	}

	public Date getLastUpdated() {
		return lastUpdated;
	}

	public void setLastUpdated(Date lastUpdated) {
		this.lastUpdated = lastUpdated;
	}

	public List<DocumentAttribute> getAttributes() {
		return attributes;
	}

	public void setAttributes(List<DocumentAttribute> attributes) {
		this.attributes = attributes;
	}

	public DocumentDto toDocumentDto(boolean withTags) {
		DocumentDto dto = new DocumentDto();
		dto.setDocumentId(documentId);
		dto.setCarrierId(carrier.getCarrierId());
		dto.setFileName(fileName);
		dto.setFileExtension(fileExtension);
		dto.setMimeType(mimeType);
		dto.setS3Key(s3Key);
		dto.setLastUpdated(lastUpdated);
		if (withTags && !attributes.isEmpty()) {
		    dto.setTags(attributes
			.stream()
			.map(a -> a.getName().getDisplayName())
                	.collect(Collectors.toList()));
		}
		return dto;
	}

	@Override
    public int hashCode() {   
        return Objects.hash(
                documentId, 
                carrier, 
                fileName, 
                fileExtension,
                mimeType,
                s3Key,
				lastUpdated);
        
    }
    
    @Override
    public boolean equals(Object obj) {
        if (obj == this) return true;
        if (!(obj instanceof Document)) {
            return false;
        }
        Document other = (Document) obj;

        return  Objects.equals(documentId, other.documentId) &&
                Objects.equals(carrier, other.carrier) &&
                Objects.equals(fileName, other.fileName) &&
                Objects.equals(fileExtension, other.fileExtension) &&
                Objects.equals(mimeType, other.mimeType) &&
                Objects.equals(s3Key, other.s3Key) &&
				Objects.equals(lastUpdated, other.lastUpdated);
    }
}
