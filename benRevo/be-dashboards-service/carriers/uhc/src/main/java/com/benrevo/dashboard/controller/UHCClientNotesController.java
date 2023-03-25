package com.benrevo.dashboard.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.benrevo.common.dto.ClientNotesDto;
import com.benrevo.common.dto.RestMessageDto;
import com.benrevo.dashboard.service.UHCClientNotesService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@Api(basePath = "/dashboard")
@RestController
@RequestMapping("/dashboard")
public class UHCClientNotesController {

    @Autowired
    private UHCClientNotesService clientNotesService;

    @ApiOperation(value = "Retrieving a client notes by client id",
        notes = "Returns JSON object.")
    @GetMapping(value = "/clients/{id}/clientNotes",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ClientNotesDto> getClientNotesByClientId(
            @PathVariable("id") Long clientId) {
        return new ResponseEntity<>(clientNotesService.getByClientId(clientId), HttpStatus.OK);
    }

    @ApiOperation(value = "Creating or update an client history note",
        notes = "Returns JSON object.")
    @PostMapping(value = "/clients/{id}/clientNotes",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RestMessageDto> createOrUpdateClientNotes(
            @PathVariable("id") Long clientId, 
            @RequestBody ClientNotesDto dto) {
            clientNotesService.createOrUpdate(clientId, dto);
        return new ResponseEntity<>(new RestMessageDto("The client notes was successfully created/updated", true), HttpStatus.OK);

    }

}
