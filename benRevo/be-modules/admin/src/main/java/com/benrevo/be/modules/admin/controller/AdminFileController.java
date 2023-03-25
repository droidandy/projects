package com.benrevo.be.modules.admin.controller;

import com.benrevo.be.modules.admin.service.AdminFileService;
import com.benrevo.common.dto.FileInfoDto;
import com.benrevo.common.exception.BaseException;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import org.apache.commons.io.IOUtils;

@Api(basePath = "/admin")
@RestController
@RequestMapping("/admin")
@PreAuthorize("@checkAccess.hasRole(T(CheckAccess).ADMIN_MODULE_ACCESS_ROLES)")
public class AdminFileController{

    @Autowired
    private AdminFileService fileService;

    @ApiOperation(value = "Retrieves all files uploaded by client",
        notes = "Retrieves all files uploaded by client")
    @GetMapping(value = "/files/{clientId}",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<FileInfoDto>> getFilesByClientId(@PathVariable("clientId") Long clientId) throws IOException {
        return new ResponseEntity<>(fileService.getFilesByClientId(clientId), HttpStatus.OK);
    }


    @ApiOperation(value = "Download file by file id",
        notes = "Download file by file id")
    @GetMapping(value = "/file")
    public void download(@RequestParam("id") Long fileId, @RequestParam("carrierName") String carrierName, HttpServletResponse response) {
        try {
            InputStream is = new ByteArrayInputStream(fileService.download(fileId, carrierName));
            IOUtils.copy(is, response.getOutputStream());
            response.flushBuffer();
        } catch(IOException e) {
            throw new BaseException("IOError writing file to output stream", e);
        }

    }
}
