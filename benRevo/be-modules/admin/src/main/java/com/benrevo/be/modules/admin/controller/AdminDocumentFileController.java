package com.benrevo.be.modules.admin.controller;

import com.benrevo.be.modules.shared.service.DocumentFileService;
import com.benrevo.common.dto.DocumentDto;
import com.benrevo.common.dto.FileDto;
import com.benrevo.common.dto.RestMessageDto;
import com.benrevo.common.enums.DocumentAttributeName;
import com.benrevo.common.util.RequestUtils;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

import javax.servlet.http.HttpServletResponse;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Api(basePath = "/admin")
@RestController
@RequestMapping("/admin")
@PreAuthorize("@checkAccess.hasRole(T(CheckAccess).ADMIN_MODULE_ACCESS_ROLES)")
public class AdminDocumentFileController {

    @Autowired
    private DocumentFileService documentFileService;

    @ApiOperation(value = "Download document file by document id",
        notes = "Download document file by document id")
    @GetMapping(value = "/documents/{id}/download",
    	produces = MediaType.APPLICATION_JSON_VALUE)
    public void download(@PathVariable("id") Long documentId, HttpServletResponse response) {
        FileDto file = documentFileService.download(documentId);
        RequestUtils.prepareFileDownloadResponse(response, file);
    }
    
    @ApiOperation(value = "Delete document by document id",
        notes = "Return result message and operation status")
    @DeleteMapping(value = "/documents/{id}")
    public ResponseEntity<RestMessageDto> delete(@PathVariable("id") Long documentId) {
        documentFileService.delete(documentId);
    	return new ResponseEntity<>(new RestMessageDto("The document were successfully deleted", true), HttpStatus.OK);
    }
    
    @ApiOperation(value = "Return carrier documents with names like 'fileName' param or with specific tags",
        notes = "Used partial case insensitive search by file name or by tags")
    @GetMapping(value = "/documents/search",
     	produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<DocumentDto>> getDocuments(@RequestParam("carrierId") Long carrierId,
        @RequestParam(name = "fileName", required = false) String fileName,
        @RequestParam(name = "tag", required = false) List<String> tags ) {
        
        List<DocumentAttributeName> enumTags = 
                tags != null 
                ? tags.stream().map(DocumentAttributeName::getEnum).collect(Collectors.toList()) 
                : Collections.emptyList();
                
    	return new ResponseEntity<>(documentFileService.findDocumentsByNameOrTags(fileName, carrierId, enumTags), HttpStatus.OK);
    }
    
    @ApiOperation(value = "Return all carrier documents by carrier id",
        notes = "Return all carrier documents by carrier id")
    @GetMapping(value = "/documents",
     	produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<DocumentDto>> getDocuments(@RequestParam("carrierId") Long carrierId) {
    	return new ResponseEntity<>(documentFileService.findAllCarrierDocuments(carrierId), HttpStatus.OK);
    }
    
    @ApiOperation(value = "Uploading file as multipart/form-data",
        notes = "Return string with upload status")
    @PostMapping(value = "/documents/upload/{carrierId}",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DocumentDto> upload(@RequestPart("file") MultipartFile file,
    		@PathVariable("carrierId") Long carrierId, 
    		@RequestParam(value = "override", required = false, defaultValue = "false") boolean override,
    		@RequestParam(name = "tag", required = false) List<String> tags
    		){
        
        List<DocumentAttributeName> enumTags = 
                tags != null 
                ? tags.stream().map(DocumentAttributeName::getEnum).collect(Collectors.toList()) 
                : Collections.emptyList();
                
        return new ResponseEntity<>(documentFileService.uploadDocument(file, carrierId, override, enumTags), HttpStatus.CREATED);
    }
    
    @ApiOperation(value = "Return tags of documents",
        notes = "Return all possible document tags")
    @GetMapping(value = "/documents/tags",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<String>> getAllTags() {
        return new ResponseEntity<>(documentFileService.getAllTags(), HttpStatus.OK);
    }
    
    @ApiOperation(value = "Create tag to document",
        notes = "Message")
    @PostMapping(value = "/documents/tags/create",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RestMessageDto> createTag(
            @RequestParam("documentId") Long documentId,
            @RequestParam("tags") List<String> tags) {

        List<DocumentAttributeName> enumTags =
            tags != null
                ? tags.stream().map(DocumentAttributeName::getEnum).collect(Collectors.toList())
                : Collections.emptyList();
        
                documentFileService.createTag(documentId, enumTags);

        return new ResponseEntity<>(
            new RestMessageDto("Tag successfully created", true),
            HttpStatus.OK
        );
    }

    @ApiOperation(value = "Delete tag from document",
        notes = "Message")
    @DeleteMapping(value = "/documents/tags/delete",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RestMessageDto> deleteTag(
            @RequestParam("documentId") Long documentId,
            @RequestParam("tags") List<String> tags) {

        List<DocumentAttributeName> enumTags =
            tags != null
                ? tags.stream().map(DocumentAttributeName::getEnum).collect(Collectors.toList())
                : Collections.emptyList();

                documentFileService.deleteTag(documentId, enumTags);

        return new ResponseEntity<>(
            new RestMessageDto("Tag successfully deleted", true),
            HttpStatus.OK
        );
    }

}
