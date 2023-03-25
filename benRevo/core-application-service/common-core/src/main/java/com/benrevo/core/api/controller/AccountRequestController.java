package com.benrevo.core.api.controller;

import com.benrevo.common.dto.AccountRequestDto;
import com.benrevo.common.dto.RestMessageDto;
import com.benrevo.core.service.AccountRequestService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by ebrandell on 10/13/17 at 1:50 PM.
 */
@Api(basePath = "/v1")
@RestController
@RequestMapping("/v1")
public class AccountRequestController {

  @Autowired
  private AccountRequestService accountRequestService;

  @ApiOperation(value = "Create account request",
      notes = "Return created account request")
  @PostMapping(value = "/accountRequest",
      consumes = MediaType.APPLICATION_JSON_VALUE,
      produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<AccountRequestDto> createAccountRequest(@RequestBody AccountRequestDto dto) {
    return new ResponseEntity<>(
        accountRequestService.create(dto),
        HttpStatus.CREATED
    );
  }

  @ApiOperation(value = "Verify Email",
      notes = "Return 201 status on success")
  @PostMapping(value = "/verifyEmail",
      produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<RestMessageDto> verifyAccountRequest(@RequestParam String verificationCode) {
    accountRequestService.verifyEmail(verificationCode);
    return new ResponseEntity<>(
        new RestMessageDto("The verificationCode was successfully processed", true),
        HttpStatus.CREATED
    );
  }
}
