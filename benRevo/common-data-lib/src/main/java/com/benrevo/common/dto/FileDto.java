package com.benrevo.common.dto;

public class FileDto {
    private Long clientFileUploadId;
    private Long rfpId;
    private String s3Key;
    private byte[] content;
    private String name;
    private String type;
    private String created;
    private String section;
    private boolean deleted;
    private Long size;

    public FileDto() {
    }

    public Long getClientFileUploadId() {
        return clientFileUploadId;
    }

    public void setClientFileUploadId(Long clientFileUploadId) {
        this.clientFileUploadId = clientFileUploadId;
    }

    public Long getRfpId() {
        return rfpId;
    }

    public void setRfpId(Long rfpId) {
        this.rfpId = rfpId;
    }

    public String getS3Key() {
        return s3Key;
    }

    public void setS3Key(String s3Key) {
        this.s3Key = s3Key;
    }

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getCreated() {
        return created;
    }

    public void setCreated(String created) {
        this.created = created;
    }

    public String getSection() {
        return section;
    }

    public void setSection(String section) {
        this.section = section;
    }

    public byte[] getContent() {
        return content;
    }

    public void setContent(byte[] content) {
        this.content = content;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getSize() {
        return size;
    }

    public void setSize(Long size) {
        this.size = size;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        FileDto fileDto = (FileDto) o;

        if (deleted != fileDto.deleted) return false;
        if (!clientFileUploadId.equals(fileDto.clientFileUploadId)) return false;
        if (!rfpId.equals(fileDto.rfpId)) return false;
        return s3Key.equals(fileDto.s3Key);

    }

    @Override
    public int hashCode() {
        int result = clientFileUploadId.hashCode();
        result = 31 * result + rfpId.hashCode();
        result = 31 * result + s3Key.hashCode();
        result = 31 * result + (deleted ? 1 : 0);
        return result;
    }

}
