package com.benrevo.be.modules.admin.controller;

import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.benrevo.be.modules.admin.service.BaseAccountRequestService;
import com.benrevo.common.dto.AccountRequestDto;
import com.benrevo.common.dto.AccountRequestVerificationDto;
import com.benrevo.common.dto.RestMessageDto;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@Api(basePath = "/admin")
@RestController
@RequestMapping("/admin")
@PreAuthorize("@checkAccess.hasRole(T(CheckAccess).ADMIN_MODULE_ACCESS_ROLES)")
public class AccountRequestController {

    @Autowired
    private BaseAccountRequestService baseAccountRequestService;

    @ApiOperation(value = "Approve account request",
    	notes = "Return result message and operation status")
    @PutMapping(value = "/accountRequests/approve",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RestMessageDto> approve(@Valid @RequestBody AccountRequestVerificationDto request) {
        baseAccountRequestService.approve(request);
        return new ResponseEntity<>(new RestMessageDto("The account request were successfully approved", true), HttpStatus.OK);
    }
    
    @ApiOperation(value = "Deny account request",
    	notes = "Return result message and operation status")
    @PutMapping(value = "/accountRequests/deny",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RestMessageDto> deny(@Valid @RequestBody AccountRequestVerificationDto request) {
        baseAccountRequestService.deny(request.getAccountRequestId(), request.getDenyReason());
        return new ResponseEntity<>(new RestMessageDto("The account request were successfully denied", true), HttpStatus.OK);
    }
    
    @ApiOperation(value = "Update account request by id",
    	notes = "Return updated account request")
    @PutMapping(value = "/accountRequests/{id}",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AccountRequestDto> update(@PathVariable("id") Long accountRequestId, 
    		@Valid @RequestBody AccountRequestDto request) {
    	request.setId(accountRequestId);
        return new ResponseEntity<>(baseAccountRequestService.update(request), HttpStatus.OK);
    }
    
    @ApiOperation(value = "Retrieve all new Account Requests",
            notes = "Return JSON-array of Account Requests")
    @GetMapping(value = "/accountRequests/all",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<AccountRequestDto>> getAllAccountRequests() {
        return new ResponseEntity<>(baseAccountRequestService.getAccountRequests(), HttpStatus.OK);
    }
    
    @ApiOperation(value = "Retrieve contacts list",
            notes = "Return JSON-array of contacts")
    @GetMapping(value = "/accountRequests/contacts",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, List<String>>> getAllContacts() {
        return new ResponseEntity<>(baseAccountRequestService.getContacts(), HttpStatus.OK);
    }

}
