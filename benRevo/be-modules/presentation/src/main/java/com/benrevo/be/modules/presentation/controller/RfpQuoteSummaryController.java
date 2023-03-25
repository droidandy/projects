package com.benrevo.be.modules.presentation.controller;

import com.benrevo.be.modules.presentation.service.RfpQuoteSummaryService;
import com.benrevo.common.dto.FileDto;
import com.benrevo.common.dto.RestMessageDto;
import com.benrevo.common.dto.RfpQuoteSummaryDto;
import com.benrevo.common.dto.RfpQuoteSummaryShortDto;
import com.benrevo.common.exception.BaseException;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Api(basePath = "/v1")
@RestController
@RequestMapping("/v1")
@PreAuthorize("@checkAccess.hasRole(T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
public class RfpQuoteSummaryController {

    @Autowired
    private RfpQuoteSummaryService rfpQuoteSummaryService;

    @ApiOperation(value = "Retrieving an rfp quote summary by quote id",
        notes = "Returns the rfp quote summary JSON object.")
    @GetMapping(value = "/clients/{id}/quotes/summary",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(#clientId, T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<RfpQuoteSummaryShortDto> getRfpQuoteSummaryByQuoteId(
            @PathVariable("id") Long clientId) {
        return new ResponseEntity<>(rfpQuoteSummaryService.getByClientId(clientId), HttpStatus.OK);
    }

    @ApiOperation(value = "Creating an rfp quote summary",
        notes = "Returns the rfp quote summary JSON object.")
    @PostMapping(value = "/clients/{id}/quotes/summary",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(#clientId, T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<RfpQuoteSummaryDto> createRfpQuoteSummary(
            @PathVariable("id") Long clientId, 
            @RequestBody RfpQuoteSummaryShortDto dto) {
        return new ResponseEntity<>(rfpQuoteSummaryService.create(clientId, dto), HttpStatus.CREATED);
    }

    @ApiOperation(value = "Updating an rfp quote summary",
        notes = "Returns the rfp quote summary JSON object.")
    @PutMapping(value = "/clients/{id}/quotes/summary",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(#clientId, T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<RfpQuoteSummaryDto> updateRfpQuoteSummary(
            @PathVariable("id") Long clientId,
            @RequestBody RfpQuoteSummaryDto dto) {
        return new ResponseEntity<>(rfpQuoteSummaryService.update(clientId, dto), HttpStatus.OK);
    }

    @ApiOperation(value = "Deleting an rfp quote summary",
        notes = "Return result message and operation status.")
    @DeleteMapping(value = "/clients/{id}/quotes/summary",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(#clientId, T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<RestMessageDto> deleteRfpQuoteSummary(@PathVariable("id") Long clientId) {
        rfpQuoteSummaryService.delete(clientId);
        return new ResponseEntity<>(new RestMessageDto("The rfp quote summary was successfully removed", true), HttpStatus.OK);
    }
    
    @ApiOperation("Download rfp quote summary file")
    @GetMapping(value = "/clients/{id}/quotes/summary/file")
    @PreAuthorize("@checkAccess.checkBrokerage(#clientId, T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public void getQuoteFile(@PathVariable("id") Long clientId, HttpServletResponse response) {
        
        try {
            FileDto result = rfpQuoteSummaryService.downloadFile(clientId);
            response.setContentType(result.getType());
            response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + result.getName()+"\"");
            response.setHeader("Access-Control-Expose-Headers", "Content-Length, Content-Disposition");
            response.setContentLength(result.getSize().intValue());
            response.getOutputStream().write(result.getContent());
            response.getOutputStream().flush();
        } catch(Exception e) {
            throw new BaseException(e.getMessage(), e);
        }

    }

}
