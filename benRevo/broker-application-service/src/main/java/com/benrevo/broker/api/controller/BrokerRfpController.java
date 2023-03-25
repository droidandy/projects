package com.benrevo.broker.api.controller;

import com.benrevo.broker.service.BrokerRfpService;
import com.benrevo.common.dto.RfpSubmissionDto;
import com.benrevo.common.dto.RfpSubmissionStatusDto;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Api(basePath = "/broker")
@RestController
@RequestMapping("/broker")
public class BrokerRfpController{

	@Autowired
    private BrokerRfpService brokerRfpService;

    @ApiOperation(value = "Client's RFPs submission",
        notes = "Returns statuses array of RFP submission to carriers")
    @PostMapping(value = "/clients/{id}/rfps/submit",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    //@PreAuthorize("@checkAccess.checkBrokerage(#clientId, T(CheckAccess).RFP_MODULE_ACCESS_ROLES)")
    public ResponseEntity<List<RfpSubmissionStatusDto>> submitRFPs(@PathVariable("id") Long clientId,
        @RequestBody List<RfpSubmissionDto> rfpSubmissionDtos) {

        List<RfpSubmissionStatusDto> result = brokerRfpService.submitRFPs(clientId, rfpSubmissionDtos);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
