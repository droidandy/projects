package com.benrevo.dashboard.controller;

import static java.util.Objects.isNull;

import com.benrevo.common.dto.ClientRateBankDto;
import com.benrevo.common.dto.RestMessageDto;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.util.JsonUtils;
import com.benrevo.dashboard.service.AnthemDashboardRateBankService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@Api(basePath = "/dashboard")
@RestController
@RequestMapping("/dashboard")
public class AnthemDashboardRateBankController {

    @Autowired
    private JsonUtils jsonUtils;

    @Autowired
    private AnthemDashboardRateBankService anthemDashboardRateBankService;

    @ApiOperation(value = "Get client rate bank details by clientId and quote type",
        notes = "Return the JSON")
    @GetMapping(value = "/client/{clientId}/rateBank/{quoteType}",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ClientRateBankDto> getClientDetails(
            @PathVariable("clientId") Long clientId,
            @PathVariable("quoteType") QuoteType quoteType) {
        return new ResponseEntity<>(anthemDashboardRateBankService.getRateBankDetails(clientId, quoteType), HttpStatus.OK);
    }

    @ApiOperation(value = "Updating rate bank information",
        notes = "Returns client rate bank information")
    @PutMapping(value = "/client/{clientId}/rateBank/{quoteType}/update",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ClientRateBankDto> updateRateBank(@PathVariable("clientId") Long clientId,
        @PathVariable("quoteType") QuoteType quoteType,
        @RequestBody ClientRateBankDto dto) {

        anthemDashboardRateBankService.update(clientId, quoteType, dto);
        return new ResponseEntity<>(
            anthemDashboardRateBankService.getRateBankDetails(clientId, quoteType),
            HttpStatus.OK
        );
    }

    @ApiOperation(value = "Send rate bank information",
        notes = "Returns message")
    @PostMapping(value = "/client/{clientId}/rateBank/{quoteType}/send",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RestMessageDto> sendRateBank(@PathVariable("clientId") Long clientId,
        @PathVariable("quoteType") QuoteType quoteType,
        @RequestParam("note") String note,
        @RequestParam(name = "files", required = false) List<MultipartFile> files) {


        anthemDashboardRateBankService.sendRateBank(clientId, quoteType, note, files);
        return new ResponseEntity<>(
            new RestMessageDto("Rate bank approval email successfully sent", true),
            HttpStatus.OK
        );
    }
}
