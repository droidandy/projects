package com.benrevo.dashboard.controller;

import com.benrevo.common.dto.ActivityDto;
import com.benrevo.common.dto.ClientDetailsDto;
import com.benrevo.common.dto.RestMessageDto;
import com.benrevo.common.enums.ActivityType;
import com.benrevo.dashboard.service.ClientDetailsService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Api(basePath = "/dashboard")
@RestController
@RequestMapping("/dashboard")
public class ClientDetailsController {

    @Autowired
    private ClientDetailsService clientDetailsService;

    @ApiOperation(value = "Get client details by clientId and Product",
        notes = "Return the JSON")
    @GetMapping(value = "/client/{clientId}/details/{product}",
        produces = MediaType.APPLICATION_JSON_VALUE)
    // FIXME access control
    public ResponseEntity<ClientDetailsDto> getClientDetails(
            @PathVariable("clientId") Long clientId,
            @PathVariable("product") String product) {
        return new ResponseEntity<>(clientDetailsService.getClientDetails(clientId, product), HttpStatus.OK);
    }

    @ApiOperation(value = "Creating an activity",
        notes = "Return 201 status if success")
    @PutMapping(value = "/client/{clientId}/activities/create",
        produces = MediaType.APPLICATION_JSON_VALUE)
    // FIXME access control
    public ResponseEntity<RestMessageDto> createActivity(@PathVariable("clientId") Long clientId, @RequestBody ActivityDto dto) {
        dto.setClientId(clientId);
        dto.setActivityId(null);
        clientDetailsService.create(dto);

        return new ResponseEntity<>(
            new RestMessageDto("The activity was successfully updated/created", true),
            HttpStatus.CREATED
        );
    }

    @ApiOperation(value = "Updating an activity",
            notes = "Return 200 status if success")
    @PutMapping(value = "/activities/{activityId}/update",
        produces = MediaType.APPLICATION_JSON_VALUE)
    // FIXME access control
    public ResponseEntity<RestMessageDto> updateActivity(@PathVariable("activityId") Long activityId, @RequestBody ActivityDto dto) {
        dto.setActivityId(activityId);
        clientDetailsService.update(dto);

        return new ResponseEntity<>(
            new RestMessageDto("The activity was successfully updated/created", true),
            HttpStatus.OK
        );
    }
    
    @ApiOperation(value = "Get activity by Id",
        notes = "Return the JSON of activity")
    @GetMapping(value = "/activities/{activityId}",
        produces = MediaType.APPLICATION_JSON_VALUE)
    // FIXME access control
    public ResponseEntity<ActivityDto> getActivity(@PathVariable("activityId") Long activityId) {
        return new ResponseEntity<>(clientDetailsService.getActivity(activityId), HttpStatus.OK);
    }

    @ApiOperation(value = "Delete activity by Id",
        notes = "Returns a message about deletion")
    @DeleteMapping(value = "/activities/{activityId}",
        produces = MediaType.APPLICATION_JSON_VALUE)
    // FIXME access control
    public ResponseEntity<RestMessageDto> deleteActivity(@PathVariable("activityId") Long activityId) {

        clientDetailsService.deleteActivity(activityId);
        return new ResponseEntity<>(
            new RestMessageDto("The activity was successfully deleted", true),
            HttpStatus.OK
        );
    }
    
    
    @ApiOperation(value = "Get differences for client by product",
        notes = "Return the JSON array of activities")
    @GetMapping(value = "/client/{clientId}/differences/{product}",
        produces = MediaType.APPLICATION_JSON_VALUE)
    // FIXME access control
    public ResponseEntity<List<ActivityDto>> getDifferences(
            @PathVariable("clientId") Long clientId,
            @PathVariable("product") String product) {
        return new ResponseEntity<>(clientDetailsService.getDifferences(clientId, product), HttpStatus.OK);
    }

    @ApiOperation(value = "Get probability for client",
            notes = "Return the JSON array of activities")
    @GetMapping(value = "/client/{clientId}/probability",
        produces = MediaType.APPLICATION_JSON_VALUE)
    // FIXME access control
    public ResponseEntity<ActivityDto> getProbability(@PathVariable("clientId") Long clientId) {
        return new ResponseEntity<>(clientDetailsService.getProbability(clientId), HttpStatus.OK);
    }
    
    @ApiOperation(value = "Get activities for client",
            notes = "Return the JSON array of activities")
    @GetMapping(value = "/client/{clientId}/activities",
        produces = MediaType.APPLICATION_JSON_VALUE)
    // FIXME access control
    public ResponseEntity<List<ActivityDto>> getActivities(@PathVariable("clientId") Long clientId) {
        return new ResponseEntity<>(clientDetailsService.getAllActivities(clientId), HttpStatus.OK);
    }
    
    @ApiOperation(value = "Get new activity for client",
            notes = "Return the JSON of empty activity")
    @GetMapping(value = "/client/{clientId}/activities/{activityType}",
        produces = MediaType.APPLICATION_JSON_VALUE)
    // FIXME access control
    public ResponseEntity<ActivityDto> getNewActivity(@PathVariable("clientId") Long clientId, @PathVariable("activityType") ActivityType activityType) {
        return new ResponseEntity<>(clientDetailsService.getNewActivity(clientId, activityType), HttpStatus.OK);
    }

}
