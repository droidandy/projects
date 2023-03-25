package com.benrevo.be.modules.shared.controller;

import com.auth0.json.mgmt.users.User;
import com.benrevo.be.modules.shared.service.Auth0Service;
import com.benrevo.be.modules.shared.service.UserAttributeService;
import com.benrevo.common.dto.AppMetadata;
import com.benrevo.common.dto.UserLoginDetailsDto;
import com.benrevo.common.dto.UserMetadata;
import com.benrevo.common.dto.UserStatusDto;
import com.benrevo.common.exception.NotAuthorizedException;
import com.benrevo.common.security.AuthenticatedUser;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.repository.BrokerRepository;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.benrevo.common.util.MapBuilder.field;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@Api(basePath = "/v1/accounts")
@RestController
@RequestMapping("/v1/accounts")
public class SharedAccountController{

    @Autowired
    private Auth0Service auth0Service;
    
    @Autowired
    private UserAttributeService userAttributeService;

    @Autowired
    private BrokerRepository brokerRepository;
    
    @ApiOperation(
        value = "Retrieve login count from auth0 for user authid",
        notes = "Returns the login count as an integer or 0"
    )
    @GetMapping(
        value = "/users/loginCount",
        produces = APPLICATION_JSON_VALUE
    )
    public ResponseEntity<UserLoginDetailsDto> getClientLoginCount() {
        AuthenticatedUser currentUser = (AuthenticatedUser) SecurityContextHolder.getContext().getAuthentication();

        if(currentUser != null) {
            return new ResponseEntity<>(
                auth0Service.getLoginCount(currentUser.getName()),
                HttpStatus.OK
            );
        } else {
            throw new NotAuthorizedException();
        }
    }

    @ApiOperation(
        value = "Retrieve the app_metadata for a user given the user authid (provided via authorization header)",
        notes = "Returns a JSON representation of the user's auth0 app_metadata"
    )
    @GetMapping(
        value = "/users/userInfo",
        produces = APPLICATION_JSON_VALUE
    )
    public ResponseEntity<AuthenticatedUser> getUserInfo() {
        AuthenticatedUser currentUser = (AuthenticatedUser) SecurityContextHolder.getContext().getAuthentication();

        if(currentUser != null) {
            User u = auth0Service.getUserInfo(currentUser.getName());

            if(u != null) {
                currentUser.setEmail(u.getEmail());

                UserMetadata um = new UserMetadata.Builder().build(u.getUserMetadata());
                AppMetadata am = new AppMetadata.Builder().build(u.getAppMetadata());

                if(um != null) {
                    currentUser.setFirstName(um.getFirstName());
                    currentUser.setLastName(um.getLastName());
                }

                if(am != null) {
                    currentUser.setRoles(am.getRoles());
                }

                // set brokerage logo
                Long brokerId = (Long) currentUser.getDetails();

                Broker broker = brokerRepository.findOne(brokerId);
                if(broker == null) {
                    throw new NotAuthorizedException().withFields(field("broker_id", brokerId));
                }
                currentUser.setBrokerageLogo(broker.getLogo());
            }

            return new ResponseEntity<>(
                currentUser,
                HttpStatus.OK
            );
        } else {
            throw new NotAuthorizedException();
        }
    }
    
    @ApiOperation(
        value = "Retrieve status for user authid",
        notes = "Returns the userStatusDto"
    )
    @GetMapping(
        value = "/users/status",
        produces = APPLICATION_JSON_VALUE
    )
    public ResponseEntity<UserStatusDto> getUserStatus() {
        AuthenticatedUser currentUser = (AuthenticatedUser) SecurityContextHolder.getContext().getAuthentication();

        if(currentUser != null) {
            return new ResponseEntity<>(
                userAttributeService.getStatusByAuthId(currentUser.getName()),
                HttpStatus.OK
            );
        } else {
            throw new NotAuthorizedException();
        }
    }
    
    
}
