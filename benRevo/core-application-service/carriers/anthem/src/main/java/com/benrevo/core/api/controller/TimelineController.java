package com.benrevo.core.api.controller;

import java.util.List;
import com.benrevo.core.service.TimelineService;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.benrevo.common.dto.TimelineDto;
import com.benrevo.common.dto.TimelineGroupDto;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@Api(basePath = "/v1")
@RestController
@RequestMapping("/v1")
public class TimelineController {

    @Autowired
    private TimelineService timelineService;

    @ApiOperation(value = "Retrieving the Timelines by carrierId and clientId",
        notes = "Return JSON array of Timelines")
    @GetMapping(value = "/timelines",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkImplManagerAccess(#clientId)")
    public ResponseEntity<List<TimelineGroupDto>> getTimelines(@RequestParam("clientId") Long clientId) {
        return new ResponseEntity<>(timelineService.getTimelinesByClientId(clientId), HttpStatus.OK);
    }
    
    @ApiOperation(value = "Create the default Timelines by carrierId and clientId",
        notes = "Return JSON array of Timelines")
    @PostMapping(value = "/timelines/init",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<TimelineGroupDto>> initTimelines(@RequestBody TimelineDto timeline) {
        return new ResponseEntity<>(timelineService.createTimelinesForClientIdCarrierId(timeline.getClientId()), HttpStatus.OK);
    }

    @ApiOperation(value = "Updating a timeline completed status by timeline_Id",
        notes = "Return JSON obj of update timeline")
    @PutMapping(value = "/timelines/{id}/updateCompleted",
    	consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<TimelineDto> updateCompleted(@PathVariable("id") Long timelineId, @RequestBody TimelineDto timeline) {
        return new ResponseEntity<>(
            timelineService.updateCompleted(
                timelineId, 
                timeline.isCompleted(),
                timeline.isShouldSendNotification() == null ? false : timeline.isShouldSendNotification()
            )
        , HttpStatus.OK);
    }
    
    @ApiOperation(value = "Updating a timeline projected time by timeline_Id",
        notes = "Return JSON obj of update timeline")
    @PutMapping(value = "/timelines/{id}/updateProjectedTime",
    	consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<TimelineDto> updateProjectedTime(@PathVariable("id") Long timelineId, @RequestBody TimelineDto timeline) {
        return new ResponseEntity<>(timelineService.updateProjectedTime(timelineId, timeline.getProjectedTime()), HttpStatus.OK);
    }
}
