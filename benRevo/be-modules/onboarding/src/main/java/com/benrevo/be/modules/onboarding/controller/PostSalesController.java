package com.benrevo.be.modules.onboarding.controller;

import com.benrevo.be.modules.onboarding.service.PostSalesDocumentService;
import com.benrevo.be.modules.onboarding.service.email.OnboardingEmailService;
import com.benrevo.common.dto.RestMessageDto;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import javax.servlet.http.HttpServletResponse;


@Api(basePath = "/v1")
@RestController
@RequestMapping("/v1")
@PreAuthorize("@checkAccess.hasRole(T(CheckAccess).ONBOARDING_MODULE_ACCESS_ROLES)")
public class PostSalesController {

    @Autowired
    private PostSalesDocumentService postSalesDocumentService;

    @Autowired
    private OnboardingEmailService emailService;

    @ApiOperation(value = "Download the document by client id and document code",
            notes = "Download the document by client id and document code")
    @GetMapping(value = "/files/{code}")
    @PreAuthorize("@checkAccess.checkBrokerage(#clientId, T(CheckAccess).ONBOARDING_MODULE_ACCESS_ROLES)")
    public void getDocument(@PathVariable("code") String code, @RequestParam("clientId") Long clientId, HttpServletResponse response) {
        postSalesDocumentService.download(
                response,
                postSalesDocumentService.getDocument(code, clientId)
        );
    }

    @ApiOperation(value = "Send post sales documents",
        notes = "Send post sales documents")
    @PostMapping(value = "/clients/{clientId}/postsales")
    @PreAuthorize("@checkAccess.checkBrokerage(#clientId, T(CheckAccess).ONBOARDING_MODULE_ACCESS_ROLES)")
    public ResponseEntity<RestMessageDto> sendPostSalesDocuments(@PathVariable("clientId") Long clientId) {
        emailService.sendPostSalesNotification(clientId);

        return new ResponseEntity<>(new RestMessageDto("The post sales documents were successfully sent", true), HttpStatus.CREATED);
    }
    
}
