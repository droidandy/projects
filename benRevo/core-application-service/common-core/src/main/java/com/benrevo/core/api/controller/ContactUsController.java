package com.benrevo.core.api.controller;

import com.benrevo.common.dto.ContactUsDto;
import com.benrevo.common.dto.RestMessageDto;
import com.benrevo.core.service.email.CoreEmailService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Api(basePath = "/v1")
@RestController
@RequestMapping("/v1")
public class ContactUsController {

    @Autowired
    private CoreEmailService emailService;

    @ApiOperation(value = "Sends a contact request email to us",
        notes = "Sends a contact request email to us")
    @PostMapping(value = "/contactus",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RestMessageDto> contactUs(@Valid @RequestBody ContactUsDto dto) {
        emailService.sendContactUsEmail(dto);

        return new ResponseEntity<>(
            new RestMessageDto("Contact request received successfully", true),
            HttpStatus.OK
        );
    }
}
