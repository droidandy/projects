package com.benrevo.be.modules.onboarding.controller;

import com.benrevo.common.dto.AnswerDto;
import com.benrevo.common.dto.RestMessageDto;
import com.benrevo.be.modules.onboarding.service.AnswerService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Api(basePath = "/v1")
@RestController
@RequestMapping("/v1")
@PreAuthorize("@checkAccess.hasRole(T(CheckAccess).ONBOARDING_MODULE_ACCESS_ROLES)")
public class AnswerController {

    @Autowired
    private AnswerService answerService;

    @ApiOperation(value = "Updating or creating the answers",
        notes = "Return 201 status if success")
    @PutMapping(value = "/answers",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(#dto.clientId, T(CheckAccess).ONBOARDING_MODULE_ACCESS_ROLES)")
    public ResponseEntity<RestMessageDto> updateAnswers(@RequestBody AnswerDto dto) {
        answerService.createOrUpdate(dto);

        return new ResponseEntity<>(
            new RestMessageDto("The answers were successfully updated/created", true),
            HttpStatus.CREATED
        );
    }

    @ApiOperation(value = "Get answers for client",
        notes = "Return the JSON array of answers")
    @GetMapping(value = "/answers/{clientId}",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(#clientId, T(CheckAccess).ONBOARDING_MODULE_ACCESS_ROLES)")
    public ResponseEntity<AnswerDto> getAnswers(@PathVariable("clientId") Long clientId) {
        return new ResponseEntity<>(answerService.getAnswers(clientId), HttpStatus.OK);
    }
}