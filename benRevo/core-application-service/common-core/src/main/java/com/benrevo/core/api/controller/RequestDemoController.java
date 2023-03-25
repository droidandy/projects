package com.benrevo.core.api.controller;

import com.benrevo.common.dto.RequestDemoDto;
import com.benrevo.common.dto.RestMessageDto;
import com.benrevo.core.service.email.CoreEmailService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

/**
 * Created by elliott on 10/9/17 at 12:30 PM.
 */
@Api(basePath = "/v1")
@RestController
@RequestMapping("/v1")
public class RequestDemoController {

    @Autowired
    private CoreEmailService emailService;

    @ApiOperation(
        value = "Sends an email when a user requests a demo",
        notes = "Sends an email when a user requests a demo"
    )
    @PostMapping(
        value = "/requestDemo",
        consumes = APPLICATION_JSON_VALUE,
        produces = APPLICATION_JSON_VALUE
    )
    public ResponseEntity<RestMessageDto> requestDemo(@Valid @RequestBody RequestDemoDto dto) {
        emailService.sendRequestDemoEmail(dto);

        return new ResponseEntity<>(
            new RestMessageDto("Demo request received successfully", true),
            OK
        );
    }
}
