package com.benrevo.be.modules.shared.controller;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import com.benrevo.be.modules.shared.service.SharedBrokerProgramService;
import com.benrevo.be.modules.shared.service.SharedBrokerService;
import com.benrevo.common.dto.BrokerConfigDto;
import com.benrevo.common.dto.BrokerDto;
import com.benrevo.common.dto.ClientMemberDto;
import com.benrevo.common.dto.ProgramDto;
import com.benrevo.common.dto.RestMessageDto;
import com.benrevo.common.enums.BrokerConfigType;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Api(basePath = "/v1")
@RestController
@RequestMapping("/v1")
public class SharedBrokerController {

    @Autowired
    private SharedBrokerService sharedBrokerService;
    
    @Autowired
    private SharedBrokerProgramService sharedBrokerProgramService;

    @ApiOperation(value = "Retrieving configs for current broker", notes = "Return JSON-array of brokerConfigDto.")
    @GetMapping(value = "/brokers/config", produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<List<BrokerConfigDto>> getConfig(
            @RequestParam(value = "type", required = false) BrokerConfigType type) {
        return new ResponseEntity<>(sharedBrokerService.getBrokerConfigs(type), OK);
    }

    @ApiOperation(value = "Updating or creating configs for current broker", notes = "Return 201 status if success")
    @PutMapping(value = "/brokers/config",
        consumes = APPLICATION_JSON_VALUE,
        produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<RestMessageDto> createOrUpdateConfig(@RequestBody List<BrokerConfigDto> dtos) {
        sharedBrokerService.createOrUpdateBrokerConfigs(dtos);

        return new ResponseEntity<>(new RestMessageDto("The configs were successfully updated/created", true), CREATED);
    }

    @ApiOperation(value = "Broker type identification", 
        notes = "Check if the requested broker is actually a GA and not a typical broker")
    @GetMapping(value = "/brokers/ga", produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<Boolean> getBrokerType() {
        Long id = (Long) SecurityContextHolder.getContext().getAuthentication().getDetails();

        return new ResponseEntity<>(sharedBrokerService.getBrokerType(id), OK);
    }

    @ApiOperation(value = "GA broker access", notes = "Get all brokers the current GA can access")
    @GetMapping(value = "/brokers/ga/access", produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<List<BrokerDto>> getBrokerAccessForGA() {
        Long id = (Long) SecurityContextHolder.getContext().getAuthentication().getDetails();

        return new ResponseEntity<>(sharedBrokerService.getAllBrokersForGA(id), OK);
    }
    
    @ApiOperation(value = "Retrieve available programs for broker")
    @GetMapping(value = "/programs/{brokerId}",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<ProgramDto>> getBrokerPrograms(@PathVariable("brokerId") Long brokerId) {
        return new ResponseEntity<>(sharedBrokerProgramService.getBrokerPrograms(brokerId), HttpStatus.OK);
    }

    @ApiOperation(value = "Retrieve brokerages/brokers only",
        notes = "Return JSON-array of brokerages")
    @GetMapping(value = "/brokers/brokerages",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<BrokerDto>> getBrokerages() {
        return new ResponseEntity<>(sharedBrokerService.getBrokerages(), HttpStatus.OK);
    }

    @ApiOperation(value = "Retrieve general agents only",
        notes = "Return JSON-array of general agents")
    @GetMapping(value = "/brokers/generalAgents",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<BrokerDto>> getGeneralAgents() {
        return new ResponseEntity<>(sharedBrokerService.getGeneralAgents(), HttpStatus.OK);
    }

    @ApiOperation(value = "Retrieve brokerage users",
        notes = "Return JSON-array of brokerage users")
    @GetMapping(value = "/brokers/{brokerId}/users",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<ClientMemberDto>> getBrokerageAuth0Users(@PathVariable("brokerId") Long brokerId) {
        return new ResponseEntity<>(sharedBrokerService.getAuth0Users(brokerId), HttpStatus.OK);
    }

    @ApiOperation(value = "Creates a Brokerage", notes = "Message")
    @PostMapping(value = "/brokers/create",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<BrokerDto> createBrokerage(@RequestBody BrokerDto brokerDto) {
        return new ResponseEntity<>(sharedBrokerService.create(brokerDto), HttpStatus.OK);
    }
}
