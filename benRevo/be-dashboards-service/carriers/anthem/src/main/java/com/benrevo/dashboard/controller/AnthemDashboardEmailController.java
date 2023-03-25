package com.benrevo.dashboard.controller;

import com.benrevo.common.dto.RestMessageDto;
import com.benrevo.dashboard.service.AnthemDashboardEmailService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;


@Api(basePath = "/dashboard")
@RestController
@RequestMapping("/dashboard")
public class AnthemDashboardEmailController {

    @Autowired
    private AnthemDashboardEmailService emailService;

    @ApiOperation(value = "Send Optimizer to rater",
        notes = "Send Optimizer to rater")
    @PostMapping(value = "/clients/{clientId}/email/optimizer",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RestMessageDto> sendOptimizerToRater(
            @RequestPart(name = "file", required = false) MultipartFile file, 
            @PathVariable("clientId") Long clientId, 
            @RequestParam("personId") Long personId, 
            @RequestParam("note") String note) {
        
        emailService.sendOptimizerToRater(clientId, personId, file, note);

        return new ResponseEntity<>(new RestMessageDto("The Optimizer was successfully sent", true), HttpStatus.CREATED);
    
    }
    
}
