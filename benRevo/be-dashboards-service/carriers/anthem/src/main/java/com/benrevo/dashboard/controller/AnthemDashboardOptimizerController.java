package com.benrevo.dashboard.controller;

import static com.benrevo.common.Constants.HTTP_HEADER_CONTENT_TYPE_XLS;
import static java.lang.String.format;

import com.benrevo.common.exception.BaseException;
import com.benrevo.dashboard.service.AnthemDashboardEmailService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@Api(basePath = "/dashboard")
@RestController
@RequestMapping("/dashboard")
public class AnthemDashboardOptimizerController {

    @Autowired
    private AnthemDashboardEmailService anthemDashboardEmailService;

    @ApiOperation(value = "Generates optimizer for all rfp types",
        notes = "Returns an optimizer for all rfp types")
    @GetMapping(value = "/clients/{id}/optimizer/download/",
        produces = HTTP_HEADER_CONTENT_TYPE_XLS)
    public void generateOptimizer(@PathVariable("id") Long clientId,
        HttpServletResponse response) {

        writeDataToResponse(anthemDashboardEmailService.getOptimizer(clientId),
            anthemDashboardEmailService.getOptimizerFileName(clientId), response, HTTP_HEADER_CONTENT_TYPE_XLS);
    }

    private void writeDataToResponse(byte[] data, String fileName, HttpServletResponse response, String contentType) {
        try {
            response.setContentType(contentType);
            response.setHeader(HttpHeaders.CONTENT_DISPOSITION, format("attachment; filename=%s",
                fileName));
            response.setContentLength(data.length);
            response.getOutputStream().write(data);
            response.getOutputStream().flush();
        } catch(Exception e) {
            throw new BaseException(e.getMessage(), e);
        }
    }
    
}
