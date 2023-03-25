package com.benrevo.broker.api.controller;

import com.benrevo.broker.service.ValidationService;
import com.benrevo.common.dto.ValidationDto;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Api(basePath = "/broker")
@RestController
@RequestMapping("/broker")
public class ValidationController {

    @Autowired
    private ValidationService validationService;

    @ApiOperation(value = "Validates the client details sections",
        notes = "Validates the client details sections")
    @PostMapping(value = "/validate",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(#clientId, T(CheckAccess).CLIENT_MODULE_ACCESS_ROLES)")
    public ResponseEntity<ValidationDto> validateClientDetails(@RequestParam(name = "clientId", required = false) Long clientId) {
        return new ResponseEntity<>(validationService.getClientDetailsStatus(clientId), HttpStatus.OK);
    }
}
