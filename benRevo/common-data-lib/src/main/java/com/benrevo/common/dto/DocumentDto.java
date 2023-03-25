package com.benrevo.common.dto;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;

public class DocumentDto {

	private Long documentId;

	private Long carrierId;

	private String fileName;
    
	private String fileExtension;
	
	private String mimeType;

	private String s3Key;

	private Date lastUpdated;
	
	private List<String> tags;

	public DocumentDto() {}
    
	public Long getDocumentId() {
		return documentId;
	}

	public void setDocumentId(Long documentId) {
		this.documentId = documentId;
	}

	public Long getCarrierId() {
		return carrierId;
	}

	public void setCarrierId(Long carrierId) {
		this.carrierId = carrierId;
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

  public List<String> getTags() {
    return tags;
  }

  public void setTags(List<String> tags) {
    this.tags = tags;
  }

    @Override
    public int hashCode() {   
        return Objects.hash(
                documentId, 
                carrierId, 
                fileName, 
                fileExtension,
                mimeType,
                s3Key,
                lastUpdated);
        
    }
    
    @Override
    public boolean equals(Object obj) {
        if (obj == this) return true;
        if (!(obj instanceof DocumentDto)) {
            return false;
        }
        DocumentDto other = (DocumentDto) obj;

        return  Objects.equals(documentId, other.documentId) &&
                Objects.equals(carrierId, other.carrierId) &&
                Objects.equals(fileName, other.fileName) &&
                Objects.equals(fileExtension, other.fileExtension) &&
                Objects.equals(mimeType, other.mimeType) &&
                Objects.equals(s3Key, other.s3Key) &&
                Objects.equals(lastUpdated, other.lastUpdated);
    }
}
