package com.benrevo.be.modules.presentation.controller;

import com.benrevo.common.dto.ClientAccountDto;
import com.benrevo.common.dto.RestMessageDto;
import com.benrevo.common.enums.UserAttributeName;
import com.benrevo.common.exception.BadRequestException;
import com.benrevo.common.exception.NotAuthorizedException;
import com.benrevo.common.util.ValidationHelper;
import com.benrevo.common.security.AuthenticatedUser;
import com.benrevo.be.modules.shared.service.Auth0Service;
import com.benrevo.be.modules.shared.service.UserAttributeService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import static com.benrevo.common.util.MapBuilder.field;

@Api(basePath = "/v1/accounts")
@RestController
@RequestMapping("/v1/accounts")
@PreAuthorize("@checkAccess.hasRole(T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
public class PresentationAccountController{

    @Autowired
    private Auth0Service auth0Service;
    
    @Autowired
    private UserAttributeService userAttributeService;
    
    @ApiOperation(value = "Adding a client account to the brokerage",
        notes = "Return result of action and message.")
    @PostMapping(value = "/clients/{id}",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RestMessageDto> addClientAccountToBrokerage(@Valid @RequestBody ClientAccountDto clientAccount, @PathVariable("id") Long clientId) {
        Long brokerId = (Long) SecurityContextHolder.getContext().getAuthentication().getDetails();
        String email = clientAccount.getEmail();

        if(null == email || !ValidationHelper.isEmailValid(email)) {
            throw new BadRequestException("Invalid email provided")
                .withFields(
                    field("email", email)
                );
        }

        auth0Service.createClientAccountForBrokerage(brokerId, email, clientId);

        return new ResponseEntity<>(
            new RestMessageDto("Client account created successfully.", true),
            HttpStatus.OK
        );
    }

    
    @ApiOperation(
        value = "Creating attribute for current user",
        notes = "Return 201 status if success"
    )
    @PostMapping(
        value = "/users/attribute",
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<RestMessageDto> createUserAttribute(@RequestParam(value = "attribute", required = true) UserAttributeName attribute) {

       AuthenticatedUser currentUser = (AuthenticatedUser) SecurityContextHolder.getContext().getAuthentication();

       if(currentUser != null) {
           userAttributeService.saveUserAttribute(currentUser.getName(), attribute);
           return new ResponseEntity<>(
                new RestMessageDto("The attribute was successfully created", true),
                HttpStatus.CREATED
           );
       } else {
           throw new NotAuthorizedException();
       }
    }
    
}
