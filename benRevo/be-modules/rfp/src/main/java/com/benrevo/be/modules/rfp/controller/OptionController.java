package com.benrevo.be.modules.rfp.controller;

import com.benrevo.common.dto.OptionDto;
import com.benrevo.be.modules.rfp.service.OptionService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Api(basePath = "/v1")
@RestController
@RequestMapping("/v1")
@PreAuthorize("@checkAccess.hasRole(T(CheckAccess).RFP_MODULE_ACCESS_ROLES)")
public class OptionController {

    @Autowired
    private OptionService optionService;

    @ApiOperation(value = "Retrieving the options for rfp by rfp_id",
        notes = "Return JSON array of rfp's options.")
    @GetMapping(value = "/rfps/{id}/options",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@rfpIdResolver.resolveClientId(#rfpId), T(CheckAccess).RFP_MODULE_ACCESS_ROLES)")
    public ResponseEntity<List<OptionDto>> getOptionByRpfId(@PathVariable("id") Long rfpId) {
        return new ResponseEntity<>(optionService.getOptionsByRfpId(rfpId), HttpStatus.OK);
    }
}