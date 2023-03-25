package com.benrevo.be.modules.shared.service;

import static com.benrevo.common.enums.CarrierType.fromString;
import static com.benrevo.common.util.MapBuilder.field;
import static com.benrevo.common.util.StringHelper.normalizeFileName;
import static org.apache.commons.io.FilenameUtils.getExtension;
import static org.apache.commons.io.FilenameUtils.removeExtension;

import com.benrevo.common.dto.DocumentDto;
import com.benrevo.common.dto.FileDto;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.DocumentAttributeName;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.common.util.RequestUtils;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Document;
import com.benrevo.data.persistence.entities.DocumentAttribute;
import com.benrevo.data.persistence.repository.AttributeRepository;
import com.benrevo.data.persistence.repository.CarrierRepository;
import com.benrevo.data.persistence.repository.DocumentRepository;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@Transactional
public class DocumentFileService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private S3FileManager s3FileManager;

    @Autowired
    private CarrierRepository carrierRepository;
    
    @Autowired
    private AttributeRepository attributeRepository;
    
    @Autowired
    private SharedCarrierService carrierService;
    

    @Value("${app.carrier}")
    String[] appCarrier;

    public FileDto findDocumentFileByName(String fileName) {
        return findDocumentFileByNameAndCarrier(fileName, getCurrentEnvCarrier().getCarrierId());
    }

    public FileDto findDocumentFileByNameAndCarrier(String fileName, Long carrierId) {
        Document doc = documentRepository.findByCarrierCarrierIdAndFileName(carrierId, fileName);
        if(doc == null) {
            throw new NotFoundException("Document not found").withFields(field("file_name", fileName), field("carrier_id", carrierId));
        }
        try {
            FileDto fileDto = s3FileManager.download(doc.getS3Key());
            return fileDto;
        } catch(IOException e) {
            throw new BaseException("Could not download file", e).withFields(field("file_name", doc.getFileName()), field("carrier_id", doc.getS3Key())

            );
        }
    }

    public DocumentDto findDocumentByNameAndCarrier(String fileName, Long carrierId) {
        Document doc = documentRepository.findByCarrierCarrierIdAndFileName(carrierId, fileName);
        if(doc == null) {
            return null;
        }
        return doc.toDocumentDto(false);
    }
    
    public List<DocumentDto> findAllCarrierDocuments(Long carrierId) {
        List<Document> docs = documentRepository.findByCarrierCarrierId(carrierId);
        List<DocumentDto> result = new ArrayList<>(docs.size());
        for(Document doc : docs) {
            result.add(doc.toDocumentDto(true));
        }
        return result;
    }

    public FileDto download(Long documentId) {
        Document doc = documentRepository.findOne(documentId);
        if(doc == null) {
            throw new NotFoundException("Document not found").withFields(field("document_id", documentId));
        }
        try {
            return s3FileManager.download(doc.getS3Key());
        } catch(IOException e) {
            throw new BaseException("Could not download file", e).withFields(field("s3Key", doc.getS3Key()), field("document_id", doc.getDocumentId()));
        }
    }

    public static String getDocumentFileLink(Long documentId) {
        return RequestUtils.getServiceBaseURL() + "/v1/documents/" + documentId + "/download";
    }

    public List<DocumentDto> findDocumentsByTags(List<DocumentAttributeName> tags) {
        List<Document> docs;
        docs = documentRepository.findByCarrierIdAndAttributes(getCurrentEnvCarrier().getCarrierId(), tags);
        List<DocumentDto> result = new ArrayList<DocumentDto>(docs.size());
        for(Document doc : docs) {
            result.add(doc.toDocumentDto(true));
        }
        return result;
    }
    
    public List<DocumentDto> findDocumentsByNameOrTags(String fileName, Long carrierId, List<DocumentAttributeName> tags) {
        List<Document> docs;
        if(StringUtils.isBlank(fileName) && tags.isEmpty()) {
            docs = documentRepository.findByCarrierCarrierId(carrierId);
        } else if(StringUtils.isBlank(fileName) && !tags.isEmpty()) {
            docs = documentRepository.findByCarrierIdAndAttributes(carrierId, tags);
        } else if(!StringUtils.isBlank(fileName) && !tags.isEmpty()) {
            fileName = normalizeFileName(fileName);
            docs = documentRepository.findByCarrierIdAndFileNameAndAttributes(carrierId, fileName, tags);
        } else {
            fileName = normalizeFileName(fileName);
            docs = documentRepository.searchByCarrierIdAndFileName(carrierId, fileName);
        }
        List<DocumentDto> result = new ArrayList<>(docs.size());
        for(Document doc : docs) {
            result.add(doc.toDocumentDto(true));
        }
        return result;
    }
    
    public void createTag(Long documentId, List<DocumentAttributeName> enumTags) {
        for(DocumentAttributeName tag : enumTags) {
            DocumentAttribute attribute = attributeRepository
                .findDocumentAttributeByDocumentIdAndName(documentId, tag);
            if(attribute == null) {
                Document doc = documentRepository.findOne(documentId);
                if(doc == null) {
                    throw new NotFoundException("Document not found")
                        .withFields(field("document_id", documentId));
                }
                attributeRepository.save(new DocumentAttribute(doc, tag));
            }
        }
    }

    public void deleteTag(Long documentId, List<DocumentAttributeName> enumTags) {
        for(DocumentAttributeName tag : enumTags) {
            DocumentAttribute attribute = attributeRepository
                .findDocumentAttributeByDocumentIdAndName(documentId, tag);
            if(attribute != null) {
                attributeRepository.delete(attribute);
            }
        }
    }
    public List<String> getAllTags() {
        return Arrays
            .stream(DocumentAttributeName.values())
            .map(DocumentAttributeName::getDisplayName)
            .collect(Collectors.toList());
    }
    
    public DocumentDto uploadDocument(
        MultipartFile file,
        Long carrierId,
        boolean override,
        List<DocumentAttributeName> tags
    ) {
        String s3Key = null;
        Carrier carrier = carrierService.findById(carrierId);
        final String normalizedFileName = normalizeFileName(file.getOriginalFilename());
        final String documentFileName = removeExtension(normalizedFileName);
        Document existDoc = documentRepository.findByCarrierCarrierIdAndFileName(
            carrierId,
            documentFileName
        );
        if(existDoc != null) {
            if(!override) {
                throw new BaseException(String.format("File with name=%s exists", documentFileName))
                    .withFields(field("file_name", documentFileName));
            } else {
                documentRepository.delete(existDoc);
                documentRepository.flush();
                s3FileManager.delete(
                    existDoc.getS3Key(),
                    fromString(existDoc.getCarrier().getName())
                );
            }
        }
        try {
            s3Key = s3FileManager.uploadCommonFile(
                file.getOriginalFilename(),
                file.getInputStream(),
                file.getContentType(),
                file.getSize(),
                CarrierType.valueOf(carrier.getName())
            );
        } catch(IOException e) {
            throw new BaseException("Could not upload file", e)
                .withFields(field("file_name", file.getOriginalFilename()));
        }
        return createDocument(normalizedFileName, file.getContentType(), s3Key, carrier, tags);
    }

    private DocumentDto createDocument(
        String normalizedFileName,
        String contentType,
        String s3Key,
        Carrier carrier,
        List<DocumentAttributeName> tags
    ) {
        // private method, called from uploadDocument() and already with normalized fileName
        Document doc = new Document();
        doc.setCarrier(carrier);
        doc.setFileName(removeExtension(normalizedFileName));
        doc.setFileExtension(getExtension(normalizedFileName));
        doc.setMimeType(contentType);
        doc.setS3Key(s3Key);
        doc.setLastUpdated(new Date());
        doc = documentRepository.save(doc);
        for(DocumentAttributeName tag : tags) {
            attributeRepository.save(new DocumentAttribute(doc, tag));
        }
        DocumentDto dto = doc.toDocumentDto(false);
        dto.setTags(tags.stream()
                        .map(DocumentAttributeName::getDisplayName)
                        .collect(Collectors.toList()));
        return dto;
    }
    
    public void delete(Long documentId) {
        Document doc = documentRepository.findOne(documentId);
        if(doc == null) {
            throw new NotFoundException("Document not found")
                .withFields(field("document_id", documentId));
        }
        s3FileManager.delete(doc.getS3Key(), fromString(doc.getCarrier().getName()));
        documentRepository.delete(doc);
    }

    private Carrier getCurrentEnvCarrier() {
        return carrierRepository.findByName(appCarrier[0]);
    }
}
