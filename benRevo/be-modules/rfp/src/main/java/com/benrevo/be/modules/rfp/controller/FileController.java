package com.benrevo.be.modules.rfp.controller;

import com.benrevo.be.modules.shared.service.SharedFileService;
import com.benrevo.common.dto.FileDto;
import com.benrevo.common.dto.FileInfoDto;
import com.benrevo.common.dto.RestMessageDto;
import com.benrevo.be.modules.rfp.service.FileService;
import com.benrevo.common.exception.BaseException;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import static com.benrevo.common.util.MapBuilder.field;

@Api(basePath = "/v1")
@RestController
@RequestMapping("/v1")
@PreAuthorize("@checkAccess.hasRole(T(CheckAccess).RFP_MODULE_ACCESS_ROLES)")
public class FileController{

    @Autowired
    private FileService fileService;

    @Autowired
    private SharedFileService sharedFileService;

    @ApiOperation(value = "Uploading file as multipart/form-data",
        notes = "Return string with upload status.")
    @PostMapping(value = "/rfp/{id}/files/{section}/upload",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@rfpIdResolver.resolveClientId(#id), T(CheckAccess).RFP_MODULE_ACCESS_ROLES)")
    public ResponseEntity<FileInfoDto> fileUpload(@RequestPart("file") MultipartFile file,
                                                  @PathVariable("id") Long id, @PathVariable("section") String section) throws IOException {
        return new ResponseEntity<>(fileService.create(file, id, section), HttpStatus.OK);
    }

    @ApiOperation(value = "Retrieving the rfp's files by rfp_id",
        notes = "Return JSON array of the rfp's files.")
    @GetMapping(value = "/rfps/{id}/files",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@rfpIdResolver.resolveClientId(#rfpId), T(CheckAccess).RFP_MODULE_ACCESS_ROLES)")
    public ResponseEntity<List<FileDto>> getFileByRfpId(@PathVariable("id") Long rfpId) {
        return new ResponseEntity<>(fileService.getFilesByRfpId(rfpId), HttpStatus.OK);
    }

    @ApiOperation(value = "Change status to deleted by file_id",
        notes = "Return message and Status 204 if success.")
    @DeleteMapping(value = "/file/{id}",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@rfpFileIdResolver.resolveClientId(#fileId), T(CheckAccess).RFP_MODULE_ACCESS_ROLES)")
    public ResponseEntity<RestMessageDto> markDeleted(@PathVariable("id") Long fileId) {
        sharedFileService.markDeleted(fileId);

        return new ResponseEntity<>(new RestMessageDto("File successfully deleted", true), HttpStatus.NO_CONTENT);
    }

    @ApiOperation(value = "Download file by file id",
        notes = "Download file by file id")
    @GetMapping(value = "/file")
    @PreAuthorize("@checkAccess.checkBrokerage(@rfpFileIdResolver.resolveClientId(#fileId), T(CheckAccess).RFP_MODULE_ACCESS_ROLES)")
    public void download(@RequestParam("id") Long fileId, HttpServletResponse response) {
        try {
            InputStream is = new ByteArrayInputStream(fileService.download(fileId));
            IOUtils.copy(is, response.getOutputStream());
            response.flushBuffer();
        } catch(IOException e) {
            throw new BaseException("IOError writing file to output stream", e)
                .withFields(
                    field("file_id", fileId)
                );
        }

    }

}
