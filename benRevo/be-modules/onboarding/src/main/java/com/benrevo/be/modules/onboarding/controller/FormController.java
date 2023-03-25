package com.benrevo.be.modules.onboarding.controller;

import com.benrevo.common.dto.CreateFormDto;
import com.benrevo.common.dto.FormDto;
import com.benrevo.common.dto.RestMessageDto;
import com.benrevo.common.dto.UpdateFormDto;
import com.benrevo.be.modules.onboarding.service.FormService;
import com.benrevo.be.modules.onboarding.service.PostSalesDocumentService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;

@Api(basePath = "/v1")
@RestController
@RequestMapping("/v1")
@PreAuthorize("@checkAccess.hasRole(T(CheckAccess).ONBOARDING_MODULE_ACCESS_ROLES)")
public class FormController {

    @Autowired
    private FormService formService;
    
    @Autowired
    private PostSalesDocumentService postSalesDocumentService;

    @ApiOperation(value = "Retrieving a form by form id",
        notes = "Returns the form JSON object.")
    @GetMapping(value = "/forms/{id}",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<FormDto> getFormById(@PathVariable("id") @NotNull Long formId) {
        return new ResponseEntity<>(formService.getById(formId), HttpStatus.OK);
    }

    @ApiOperation(value = "Creating an array of forms",
        notes = "Returns the JSON array of the created forms.")
    @PostMapping(value = "/forms",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<FormDto>> createForms(@RequestBody List<CreateFormDto> dtoList) {
        return new ResponseEntity<>(formService.create(dtoList), HttpStatus.CREATED);
    }

    @ApiOperation(value = "Updating the forms",
        notes = "Returns the JSON array of the updated forms.")
    @PutMapping(value = "/forms",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<FormDto>> updateForms(@RequestBody List<UpdateFormDto> dtoList) {
        return new ResponseEntity<>(
            formService.update(dtoList),
            HttpStatus.OK
        );
    }

    @ApiOperation(value = "Deleting the forms",
        notes = "Returns the JSON object with success flag and message.")
    @DeleteMapping(value = "/forms",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RestMessageDto> deleteForms(@RequestBody List<Long> ids) {
        formService.delete(ids);

        return new ResponseEntity<>(
            new RestMessageDto("The forms were successfully deleted", true),
            HttpStatus.OK
        );
    }
    
    @ApiOperation(value = "Get available form list",
        notes = "Get available form list")
    @GetMapping(value = "/clients/{clientId}/forms")
    @PreAuthorize("@checkAccess.checkBrokerage(#clientId, T(CheckAccess).ONBOARDING_MODULE_ACCESS_ROLES)")
    public ResponseEntity<Map<String, String>> getAvailableFormList(@PathVariable("clientId") Long clientId) {
        
        return new ResponseEntity<>(postSalesDocumentService.getAvailableFormList(clientId), HttpStatus.OK);
    }


}
