package com.benrevo.common.util;

import org.springframework.http.HttpHeaders;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import com.benrevo.common.dto.FileDto;
import com.benrevo.common.exception.BaseException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class RequestUtils {

    private RequestUtils() {
    }

    public static String getServiceBaseURL() {
        StringBuilder url = new StringBuilder();
        ServletRequestAttributes sra = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

        if(sra != null) {
            HttpServletRequest req = sra.getRequest();
            url.append("//").append(req.getServerName()); // used relative protocol
            
            if(req.getServerPort() > 0 && req.getServerPort() != 80 && req.getServerPort() != 443) {
                url.append(':').append(req.getServerPort());
            }
        }

        return url.toString();
    }
    
  public static void prepareFileDownloadResponse(HttpServletResponse response, FileDto file) {
    try {
      response.setContentType(file.getType());
      response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"");
      response.setHeader("Access-Control-Expose-Headers", "Content-Length, Content-Disposition");
      response.setContentLength(file.getSize().intValue());
      response.getOutputStream().write(file.getContent());
      response.getOutputStream().flush();
    } catch (Exception e) {
      throw new BaseException("Error writing file to output stream", e);
    }
  }
}
