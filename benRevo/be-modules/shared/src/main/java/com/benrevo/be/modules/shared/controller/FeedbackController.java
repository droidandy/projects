package com.benrevo.be.modules.shared.controller;

import com.benrevo.be.modules.shared.service.FeedbackService;
import com.benrevo.common.dto.FeedbackDto;
import com.benrevo.common.dto.RestMessageDto;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@Api(basePath = "/v1")
@RestController
@RequestMapping("/v1")
public class FeedbackController {
    
    @Autowired
    private FeedbackService feedbackService;

    @ApiOperation(value = "Create new person",
        notes = "Return created person object")
    @PostMapping(value = "/sendFeedback",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RestMessageDto> sendFeedback(@Valid @RequestBody FeedbackDto dto) {
        feedbackService.sendFeedback(dto);
        return new ResponseEntity<>(new RestMessageDto("The feedback was successfully sent", true), HttpStatus.OK);
    }
}
