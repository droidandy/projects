package com.benrevo.be.modules.admin.controller;

import com.benrevo.be.modules.admin.service.BrokerProgramService;
import com.benrevo.common.dto.CreateProgramQuoteDto;
import com.benrevo.common.dto.PlanNameByNetworkDto;
import com.benrevo.common.dto.ProgramDto;
import com.benrevo.common.dto.RfpQuoteDto;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import javax.validation.Valid;

@Api(basePath = "/admin")
@RestController
@RequestMapping("/admin")
@PreAuthorize("@checkAccess.hasRole(T(CheckAccess).ADMIN_MODULE_ACCESS_ROLES)")
public class BrokerProgramController {

    @Autowired
    private BrokerProgramService brokerProgramService;

    @ApiOperation(value = "Retrieve program plans")
    @GetMapping(value = "/programs/{id}/plans",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<PlanNameByNetworkDto>> getProgramPlans(@PathVariable("id") Long programId) {
        return new ResponseEntity<>(brokerProgramService.getProgramPlans(programId), HttpStatus.OK);
    }
    
    @ApiOperation(value = "Update program plans (remove old plans and add new ones)")
    @PutMapping(value = "/programs/{id}/plans",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<PlanNameByNetworkDto>> updateProgramPlans(@PathVariable("id") Long programId, @RequestBody List<PlanNameByNetworkDto> pnns) {
        return new ResponseEntity<>(brokerProgramService.updateProgramPlans(programId, pnns), HttpStatus.OK);
    }
    
    @ApiOperation(value = "Create quote for programs")
    @PostMapping(value = "/programs/createQuotes",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<RfpQuoteDto>> createQuotes(@Valid @RequestBody List<CreateProgramQuoteDto> params) {
        return new ResponseEntity<>(brokerProgramService.createQuotes(params), HttpStatus.CREATED);
    }
}
