package com.benrevo.core.api.controller;

import com.benrevo.common.dto.RestMessageDto;
import com.benrevo.common.dto.SignupDto;
import com.benrevo.core.service.email.CoreEmailService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Api(basePath = "/v1")
@RestController
@RequestMapping("/v1")
public class SignUpController {

  @Autowired
  private CoreEmailService emailService;

  @ApiOperation(value = "Signs up a user by sending email inquiry",
      notes = "Signs up a user by sending email inquiry")
  @PostMapping(value = "/signup",
      produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<RestMessageDto> signup(@RequestBody SignupDto dto) {
    emailService.sendSignUpEmail(dto);

    return new ResponseEntity<>(
        new RestMessageDto("Sign-up request received successfully", true),
        HttpStatus.OK
    );
  }
}
