package com.benrevo.core.api.controller;


import java.io.IOException;
import java.io.InputStream;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.io.IOUtils;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.benrevo.common.dto.FileDto;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.util.RequestUtils;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@Api(basePath = "/v1")
@RestController
@RequestMapping("/v1")
@PreAuthorize("@checkAccess.hasRole(T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
public class UHCRfpQuoteController {

    @ApiOperation(value = "Download Motion Overview.pdf file")
    @GetMapping(value = "/quotes/options/motionOverview")
    public void downloadMotionOverview(HttpServletResponse response) {
        FileDto file = new FileDto();
        try {
            InputStream is = this.getClass().getResourceAsStream("/static/files/Motion Overview.pdf" );
            byte[] buffer = IOUtils.toByteArray(is);
            file.setType(MediaType.APPLICATION_PDF_VALUE);
            file.setSize((long) buffer.length);
            file.setName("Motion Overview.pdf" );
            file.setContent(buffer);
        } catch (IOException e) {
            throw new BaseException("Cannot read file: Motion Overview.pdf");
        }
        RequestUtils.prepareFileDownloadResponse(response, file);
    }

}
