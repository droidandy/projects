package com.benrevo.dashboard.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.benrevo.common.dto.ClientAllQuoteDto;
import com.benrevo.common.dto.RestMessageDto;
import com.benrevo.dashboard.service.AnthemDashboardQuotePlansService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@Api(basePath = "/dashboard")
@RestController
@RequestMapping("/dashboard")
public class AnthemDashboardQuotePlansController {

    @Autowired
    private AnthemDashboardQuotePlansService quotePlansService;
    
    @ApiOperation(value = "Get client quotes plans details by clientId",
        notes = "Return the JSON")
    @GetMapping(value = "/client/{clientId}/quotePlans",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ClientAllQuoteDto> getQuotePlans(@PathVariable("clientId") Long clientId) {
        return new ResponseEntity<>(quotePlansService.getAllQuotePlans(clientId), 
                HttpStatus.OK);
    }

    @ApiOperation(value = "Updating quote plans information",
        notes = "Returns quote plans information")
    @PutMapping(value = "/client/{clientId}/quotePlans",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ClientAllQuoteDto> updateQuotePlans(@PathVariable("clientId") Long clientId,
        @RequestBody ClientAllQuoteDto dto) {

        quotePlansService.update(clientId, dto);
        return new ResponseEntity<>( quotePlansService.getAllQuotePlans(clientId),
                HttpStatus.OK );
    }

    @ApiOperation(value = "Send quote ready information",
        notes = "Returns message")
    @PostMapping(value = "/client/{clientId}/quotePlans/send",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RestMessageDto> sendRateBank(@PathVariable("clientId") Long clientId) {

        quotePlansService.sendQuoteReady(clientId);
        return new ResponseEntity<>(new RestMessageDto("Quote ready successfully sent", true),
                HttpStatus.CREATED );
    }
}
