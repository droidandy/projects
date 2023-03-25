package com.benrevo.core.api.controller;


import com.benrevo.be.modules.shared.service.pptx.BasePptxPresentationService;
import com.benrevo.common.Constants;
import com.benrevo.common.exception.BaseException;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@Api(basePath = "/v1")
@RestController
@RequestMapping("/v1")
@PreAuthorize("@checkAccess.hasRole(T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
public class UHCPresentationController {

    @Autowired
    private BasePptxPresentationService basePptxPresentationService;

    @ApiOperation(value = "Download PowerPointPresentation file",
        notes = "Return pptx file")
    @GetMapping(value = "/presentation/file/powerPoint/")
    public void downloadPowerPointPresentationFileFromCarrier(@RequestParam(name = "clientId") Long clientId, HttpServletResponse response) {

        byte[] result = basePptxPresentationService.getByClientId(clientId);

        try {
            response.setContentType(Constants.HTTP_HEADER_CONTENT_TYPE_PPTX);
            response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=presentation.pptx");
            response.setContentLength(result.length);
            response.getOutputStream().write(result);
            response.getOutputStream().flush();
        } catch(Exception e) {
            throw new BaseException(e.getMessage(), e);
        }
    }
}
