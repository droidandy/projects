package com.benrevo.be.modules.client.controller;

import com.benrevo.common.dto.ClientAccountDto;
import com.benrevo.common.dto.ClientMemberDto;
import com.benrevo.common.security.AuthenticatedUser;
import com.benrevo.be.modules.shared.service.Auth0Service;
import com.benrevo.be.modules.client.service.ClientMemberService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import static java.time.ZonedDateTime.now;
import static java.time.format.DateTimeFormatter.ofPattern;

@Api(basePath = "/v1/accounts")
@RestController
@RequestMapping("/v1/accounts")
@PreAuthorize("@checkAccess.hasRole(T(CheckAccess).CLIENT_MODULE_ACCESS_ROLES)")
public class ClientAccountController{

    @Autowired
    private Auth0Service auth0Service;
    
    @Autowired
    private ClientMemberService memberService;

    @ApiOperation(value = "Retrieving brokers for brokerage by brokerage name GET /v1/users?name= ",
        notes = "Return JSON-array of brokers.")
    @GetMapping(value = "/users",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<ClientMemberDto>> getMembersByBrokerId() {
        Long id = (Long) SecurityContextHolder.getContext().getAuthentication().getDetails();

        return new ResponseEntity<>(auth0Service.getUsersIdForBrokerage(id), HttpStatus.OK);
    }

    @ApiOperation(value = "Updating auth0 client user_metadata",
        notes = "Return JSON obj of updated client")
    @PutMapping(value = "/users",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ClientMemberDto> updateClientAccountMetadata(@Valid @RequestBody ClientAccountDto clientAccount) {

        AuthenticatedUser currentUser = (AuthenticatedUser) SecurityContextHolder.getContext().getAuthentication();

        Map<String, Object> metadata = new HashMap<>();
        metadata.put("first_name", clientAccount.getFirstName());
        metadata.put("last_name", clientAccount.getLastName());
        metadata.put("eula_accepted", ofPattern("EEE, d MMM yyyy, h:mm:ss a z").format(now()));

        final String authId = currentUser.getName();
        ClientMemberDto updated = auth0Service.updateClientAccountMetadata(authId, metadata);
        updated.setBrokerageId((Long) currentUser.getDetails());
        
        memberService.updateNameByAuthId(authId, updated.getFullName());

        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

}
