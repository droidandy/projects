package com.benrevo.be.modules.onboarding.controller;

import com.benrevo.common.dto.QuestionDto;
import com.benrevo.common.dto.RestMessageDto;
import com.benrevo.be.modules.onboarding.service.QuestionService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Api(basePath = "/v1")
@RestController
@RequestMapping("/v1")
@PreAuthorize("@checkAccess.hasRole(T(CheckAccess).ONBOARDING_MODULE_ACCESS_ROLES)")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @ApiOperation(value = "Retrieving a question by question id",
        notes = "Returns the question JSON object.")
    @GetMapping(value = "/questions/{id}",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<QuestionDto> getQuestionById(@PathVariable("id") Long questionId) {
        return new ResponseEntity<>(questionService.getById(questionId), HttpStatus.OK);
    }

    @ApiOperation(value = "Creating an array of questions",
        notes = "Returns the JSON array of the created questions.")
    @PostMapping(value = "/questions",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<QuestionDto>> createQuestions(@RequestBody List<QuestionDto> dtoList) {
        return new ResponseEntity<>(questionService.create(dtoList), HttpStatus.CREATED);
    }

    @ApiOperation(value = "Updating the questions",
        notes = "Returns the JSON array of the updated questions.")
    @PutMapping(value = "/questions",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<QuestionDto>> updateQuestions(@RequestBody List<QuestionDto> dtoList) {
        return new ResponseEntity<>(questionService.update(dtoList), HttpStatus.OK);
    }

    @ApiOperation(value = "Deleting the questions",
        notes = "Returns the JSON object with success flag and message.")
    @DeleteMapping(value = "/questions",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RestMessageDto> deleteQuestions(@RequestBody List<Long> ids) {
        questionService.delete(ids);

        return new ResponseEntity<>(
            new RestMessageDto("The questions were successfully deleted", true),
            HttpStatus.OK
        );
    }
}