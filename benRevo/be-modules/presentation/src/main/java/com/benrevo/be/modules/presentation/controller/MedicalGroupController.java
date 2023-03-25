package com.benrevo.be.modules.presentation.controller;

import com.benrevo.be.modules.presentation.service.MedicalGroupService;
import com.benrevo.common.dto.MedicalGroupDto;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Api(basePath = "/v1")
@RestController
@RequestMapping("/v1")
@PreAuthorize("@checkAccess.hasRole(T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
public class MedicalGroupController {
    @Autowired
    private MedicalGroupService medicalGroupService;

    @ApiOperation(value = "Retrieving all medical groups",
            notes = "Returns the medical group JSON array.")
    @GetMapping(value = "/medical-groups",
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<MedicalGroupDto>> getAll() {
        return new ResponseEntity<>(medicalGroupService.getByCurrentCarrier(), HttpStatus.OK);
    }

    @ApiOperation(value = "Retrieving all medical groups",
        notes = "Returns the medical group JSON array.")
    @GetMapping(value = "/medical-groups/carriers",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, List<MedicalGroupDto>>> getAllAndGroupByIncumbentCarriers() {
        return new ResponseEntity<>(medicalGroupService.groupByIncumbentCarrier(), HttpStatus.OK);
    }
}