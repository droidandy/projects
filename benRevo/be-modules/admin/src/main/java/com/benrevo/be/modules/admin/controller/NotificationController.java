package com.benrevo.be.modules.admin.controller;

import com.benrevo.be.modules.admin.service.BaseAdminEmailService;
import com.benrevo.be.modules.admin.service.BaseAdminRfpQuoteService;
import com.benrevo.common.dto.RestMessageDto;
import com.benrevo.common.enums.ClientState;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Api(basePath = "/admin")
@RestController
@RequestMapping("/admin")
@PreAuthorize("@checkAccess.hasRole(T(CheckAccess).ADMIN_MODULE_ACCESS_ROLES)")
public class NotificationController {

    @Autowired
    private BaseAdminEmailService emailService;

    @Autowired
    private BaseAdminRfpQuoteService baseRfpQuoteService;

    @ApiOperation(value = "Sends Email Notification")
    @PostMapping(value = "/notification/{clientState}/{clientId}/{carrierName}")
    public ResponseEntity<RestMessageDto> sendQuoteReadyNotification(
        @PathVariable("clientState") ClientState clientState, 
        @PathVariable("clientId") Long clientId,
        @PathVariable("carrierName") String carrierName) {
    
        emailService.sendEmail(clientState, clientId, carrierName);

        /** https://app.asana.com/0/310271518148409/457379593045101
         * Commenting out this feature for now

        ClientDto client = clientService.getById(clientId);
        List<AttributeName> attrs = client.getAttributes();
        if (CarrierType.ANTHEM_BLUE_CROSS.name().equals(carrierName)
            && attrs != null && attrs.contains(AttributeName.DIRECT_TO_PRESENTATION)) {
            baseRfpQuoteService.createQuotedClientCopyForSales(clientId);
        }

         */

        // Salesforce
        baseRfpQuoteService.updateSalesforce(clientId, clientState);

        return ResponseEntity.ok().body(new RestMessageDto(
            String.format("Quote Ready Notification for client %s sent successfully", clientId), true));
    }

    @ApiOperation(value = "Sends Program Email Notification")
    @PostMapping(value = "/notification/{clientId}/{programId}")
    public ResponseEntity<RestMessageDto> sendProgramQuoteReadyNotification(
        @PathVariable("clientId") Long clientId,
        @PathVariable("programId") Long programId) {

        emailService.sendProgramReadyEmail(clientId, programId);

        return ResponseEntity.ok().body(new RestMessageDto(
            String.format("Quote Ready Notification for client %s sent successfully", clientId), true));
    }

}
