package com.benrevo.be.modules.admin.controller;

import com.benrevo.be.modules.shared.service.SharedClientMemberService;
import com.benrevo.common.dto.ClientMemberDto;
import com.benrevo.common.dto.RestMessageDto;
import com.benrevo.be.modules.admin.service.AdminClientMemberService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;

@Api(basePath = "/admin")
@RestController
@RequestMapping("/admin")
@PreAuthorize("@checkAccess.hasRole(T(CheckAccess).ADMIN_MODULE_ACCESS_ROLES)")
public class AdminClientTeamController{

    @Autowired
    private AdminClientMemberService adminMemberService;

    @Autowired
    private SharedClientMemberService sharedClientMemberService;

    @ApiOperation(value = "Get users belongs to client team by client_id",
            notes = "Returns a sorted list of ClientMemberDto's that belong to given client, sorted by brokerId")
    @GetMapping(value = "/clients/{id}/members",
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<ClientMemberDto>> getClientTeamsByClientId(@PathVariable("id") Long clientId) {
        return new ResponseEntity<>(adminMemberService.getClientTeamsByClientId(clientId), HttpStatus.OK);
    }

    @ApiOperation(value = "Adding a users to the client members team",
        notes = "Return JSON-array of the client members team.")
    @PostMapping(value = "/clients/{id}/members/{brokerId}",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<ClientMemberDto>> addUsersToClientTeam(
        @Valid @RequestBody List<ClientMemberDto> clientMemberDtos,
        @PathVariable("id") Long clientId,
        @PathVariable("brokerId") Long brokerId) {
        try {
            return new ResponseEntity<>(adminMemberService.save(clientMemberDtos, clientId, brokerId), HttpStatus.OK);
        }catch (Exception e){
            throw e;
        }
    }

    @ApiOperation(value = "Remove client team members.",
        notes = "Return message about successfully members deleting.")
    @DeleteMapping(value = "/clients/{id}/members",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RestMessageDto> deleteFromClientTeamById(
        @Valid @RequestBody List<ClientMemberDto> clientMemberDtos,
        @PathVariable("id") Long clientId) {
        sharedClientMemberService.delete(clientMemberDtos, clientId);

        return new ResponseEntity<>(
            new RestMessageDto("Members successfully deleted from client team.", true),
            HttpStatus.OK
        );
    }
    
    @ApiOperation(value = "Creating users from clientTeams that have no authId",
        notes = "Return JSON-array of the created users.")
    @PostMapping(value = "/clients/{id}/createUsers",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<ClientMemberDto>> createUsersFromClientTeams(@PathVariable("id") Long clientId) {
        return new ResponseEntity<>(adminMemberService.createUsersFromClientTeams(clientId), HttpStatus.OK);
    }

}
