package com.benrevo.be.modules.admin.controller;

import com.benrevo.be.modules.admin.service.AdminRfpQuoteSummaryService;
import com.benrevo.common.dto.RestMessageDto;
import com.benrevo.common.dto.RfpQuoteSummaryDto;
import com.benrevo.common.dto.RfpQuoteSummaryShortDto;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * Created by lemdy on 6/13/17.
 */

@Api(basePath = "/admin")
@RestController
@RequestMapping("/admin")
@PreAuthorize("@checkAccess.hasRole(T(CheckAccess).ADMIN_MODULE_ACCESS_ROLES)")
public class AdminRFPQuoteSummaryController {

    @Autowired
    private AdminRfpQuoteSummaryService rfpQuoteSummaryService;

    @ApiOperation(value = "Retrieving an rfp quote summary by quote id",
        notes = "Returns the rfp quote summary JSON object.")
    @GetMapping(value = "/clients/{id}/quotes/summary",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RfpQuoteSummaryShortDto> getRfpQuoteSummaryByQuoteId(@PathVariable("id") Long clientId) {
        return new ResponseEntity<>(rfpQuoteSummaryService.getByClientId(clientId), HttpStatus.OK);
    }

    @ApiOperation(value = "Creating an rfp quote summary",
        notes = "Returns the rfp quote summary JSON object.")
    @PostMapping(value = "/clients/{id}/quotes/summary",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RfpQuoteSummaryDto> createRfpQuoteSummary(@PathVariable("id") Long clientId,
                                                                    @RequestBody RfpQuoteSummaryShortDto dto) {
        return new ResponseEntity<>(rfpQuoteSummaryService.create(clientId, dto), HttpStatus.CREATED);
    }

    @ApiOperation(value = "Updating an rfp quote summary",
        notes = "Returns the rfp quote summary JSON object.")
    @PutMapping(value = "/clients/{id}/quotes/summary",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RfpQuoteSummaryDto> updateRfpQuoteSummary(@PathVariable("id") Long clientId,
                                                                    @RequestBody RfpQuoteSummaryDto dto) {
        return new ResponseEntity<>(rfpQuoteSummaryService.update(clientId, dto), HttpStatus.OK);
    }

    @ApiOperation(value = "Deleting an rfp quote summary",
        notes = "Return result message and operation status.")
    @DeleteMapping(value = "/clients/{id}/quotes/summary",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RestMessageDto> deleteRfpQuoteSummary(@PathVariable("id") Long clientId) {
        rfpQuoteSummaryService.delete(clientId);

        return new ResponseEntity<>(new RestMessageDto("The rfp quote summary was successfully removed", true), HttpStatus.OK);
    }
    
    @ApiOperation(value = "Uploading file as multipart/form-data",
        notes = "Returns the rfp quote summary JSON object")
    @PostMapping(value = "/clients/{id}/quotes/summary/upload",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RfpQuoteSummaryShortDto> upload(@RequestPart("file") MultipartFile file,
            @PathVariable("id") Long clientId, 
            @RequestParam(value = "override", required = false, defaultValue = "false") boolean override) {
        
        return new ResponseEntity<>(rfpQuoteSummaryService.uploadFile(clientId, file, override), HttpStatus.OK);
    }

}
