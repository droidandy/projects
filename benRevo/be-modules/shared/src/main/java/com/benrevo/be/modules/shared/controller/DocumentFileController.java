package com.benrevo.be.modules.shared.controller;

import com.benrevo.be.modules.shared.service.DocumentFileService;
import com.benrevo.common.dto.DocumentDto;
import com.benrevo.common.dto.FileDto;
import com.benrevo.common.enums.DocumentAttributeName;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.util.RequestUtils;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Api(basePath = "/v1")
@RestController
@RequestMapping("/v1")
public class DocumentFileController {

    @Autowired
    private DocumentFileService documentFileService;

    @ApiOperation(value = "Download document file by document id",
                  notes = "Download document file by document id")
    @GetMapping(value = "/documents/{id}/download")
    public void download(@PathVariable("id") Long documentId, HttpServletResponse response) {
        FileDto file = documentFileService.download(documentId);
        RequestUtils.prepareFileDownloadResponse(response, file);
    }

    @ApiOperation(value = "Download document file by name",
                  notes = "Download document file by name")
    @GetMapping(value = "/documents/download")
    public void downloadByName(
        @RequestParam("fileName") String fileName,
        HttpServletResponse response
    ) {
        FileDto file;
        // FIXME
        if(StringUtils.containsIgnoreCase(fileName, "Domestic Partner Comparison Chart")) {
            file = new FileDto();
            try {
                InputStream is = this.getClass()
                    .getResourceAsStream("/static/files/Domestic Partner Comparison Chart.pdf");
                byte[] buffer = IOUtils.toByteArray(is);
                file.setType("application/pdf");
                file.setSize((long) buffer.length);
                file.setName("Domestic Partner Comparison Chart.pdf");
                file.setContent(buffer);
            } catch(IOException e) {
                throw new BaseException("Cannot read file: Domestic Partner Comparison Chart.pdf");
            }
        } else {
            file = documentFileService.findDocumentFileByName(fileName);
        }
        RequestUtils.prepareFileDownloadResponse(response, file);
    }

    @ApiOperation(value = "Return documents with specific tags")
    @GetMapping(value = "/documents/search",
                produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<DocumentDto>> getDocumentsByTags(
        @RequestParam(name = "tag", required = false) List<String> tags
    ) {

        List<DocumentAttributeName> enumTags =
            tags != null
            ? tags.stream().map(DocumentAttributeName::getEnum).collect(Collectors.toList())
            : Collections.emptyList();

        return new ResponseEntity<>(
            documentFileService.findDocumentsByTags(enumTags),
            HttpStatus.OK
        );
    }
}
