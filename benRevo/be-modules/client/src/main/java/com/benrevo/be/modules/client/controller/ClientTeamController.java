package com.benrevo.be.modules.client.controller;

import com.benrevo.be.modules.shared.service.SharedClientMemberService;
import com.benrevo.common.dto.ClientMemberDto;
import com.benrevo.common.dto.RestMessageDto;
import com.benrevo.be.modules.client.service.ClientMemberService;
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

@Api(basePath = "/v1")
@RestController
@RequestMapping("/v1")
@PreAuthorize("@checkAccess.hasRole(T(CheckAccess).CLIENT_MODULE_ACCESS_ROLES)")
public class ClientTeamController{

    @Autowired
    private ClientMemberService memberService;

    @Autowired
    private SharedClientMemberService sharedClientMemberService;

    @ApiOperation(value = "Adding a users to the client members team",
        notes = "Return JSON-array of the client members team.")
    @PostMapping(value = "/clients/{id}/members",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(#clientId, T(CheckAccess).CLIENT_MODULE_ACCESS_ROLES)")
    public ResponseEntity<List<ClientMemberDto>> addUsersToClientTeam(
        @Valid @RequestBody List<ClientMemberDto> clientMemberDtos,
        @PathVariable("id") Long clientId) {
        return new ResponseEntity<>(memberService.save(clientMemberDtos, clientId), HttpStatus.OK);
    }

    @ApiOperation(value = "Get users belongs to client team by client_id",
        notes = "Return JSON-array of the client's team members .")
    @GetMapping(value = "/clients/{id}/members",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(#clientId, T(CheckAccess).CLIENT_MODULE_ACCESS_ROLES)")
    public ResponseEntity<List<ClientMemberDto>> getClientTeamByClientId(@PathVariable("id") Long clientId) {
        return new ResponseEntity<>(sharedClientMemberService.getByClientId(clientId), HttpStatus.OK);
    }

    @ApiOperation(value = "Remove client team members.",
        notes = "Return message about successfully members deleting.")
    @DeleteMapping(value = "/clients/{id}/members",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(#clientId, T(CheckAccess).CLIENT_MODULE_ACCESS_ROLES)")
    public ResponseEntity<RestMessageDto> deleteFromClientTeamById(
        @Valid @RequestBody List<ClientMemberDto> clientMemberDtos,
        @PathVariable("id") Long clientId) {
        memberService.delete(clientMemberDtos, clientId);

        return new ResponseEntity<>(
            new RestMessageDto("Members successfully deleted from client team.", true),
            HttpStatus.OK
        );
    }
}