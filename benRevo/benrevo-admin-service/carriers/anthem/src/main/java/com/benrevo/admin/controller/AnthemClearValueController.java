package com.benrevo.admin.controller;

import com.benrevo.admin.service.AnthemClearValueService;
import com.benrevo.common.dto.AnthemCVPlanBriefDto;
import com.benrevo.common.dto.AnthemCVRateDto;
import com.benrevo.common.dto.RestMessageDto;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Api(basePath = "/admin")
@RestController
@RequestMapping("/admin")
public class AnthemClearValueController {

    @Autowired
    private AnthemClearValueService anthemClearValueService;

    @ApiOperation(value = "Retrieve Anthem CV rates",
        notes = "Return Anthem CV rates for Medical, Dental and Vision")
    @PostMapping(value = "/anthem/calculate",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AnthemCVPlanBriefDto> calculateAnthemCVRates(@RequestBody AnthemCVRateDto inputDto) {
        return new ResponseEntity<>(anthemClearValueService.calculateAnthemCVRates(inputDto), HttpStatus.OK);
    }


    @ApiOperation(value = "Fully Disqualifies a user from receiving Anthem Clear Value",
        notes = "Returns a status message")
    @PostMapping(value = "/anthem/quote/{disqualificationType}/disqualify/{reasonType}/{clientId}",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RestMessageDto> disqualify(@PathVariable("clientId") Long clientId,
        @PathVariable("disqualificationType") String disqualificationType,
        @PathVariable("reasonType") String reasonType) {

        anthemClearValueService.disqualify(clientId, disqualificationType, reasonType);

        return new ResponseEntity<>(
            new RestMessageDto("Client successfully disqualified", true),
            HttpStatus.OK
        );
    }
}
