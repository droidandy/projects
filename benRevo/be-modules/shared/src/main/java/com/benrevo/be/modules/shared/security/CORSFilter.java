package com.benrevo.be.modules.shared.security;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.GenericFilterBean;

import static org.springframework.core.Ordered.HIGHEST_PRECEDENCE;
import static org.springframework.http.HttpHeaders.*;

@Component
@Order(HIGHEST_PRECEDENCE)
public class CORSFilter extends GenericFilterBean {

  public CORSFilter() {}

  @Override
  public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
    HttpServletRequest request = (HttpServletRequest) req;
    HttpServletResponse response = (HttpServletResponse) res;

    response.setHeader(ACCESS_CONTROL_ALLOW_ORIGIN, request.getHeader(ORIGIN));
    response.setHeader(ACCESS_CONTROL_ALLOW_CREDENTIALS, "true");
    response.setHeader(ACCESS_CONTROL_ALLOW_METHODS, "POST, PUT, PATCH, GET, OPTIONS, DELETE");
    response.setHeader(ACCESS_CONTROL_MAX_AGE, "3600");
    response.setHeader(ACCESS_CONTROL_ALLOW_HEADERS, "Content-Type, Accept, X-Requested-With, remember-me, Authorization");
    response.setHeader(VARY, "Origin");

    chain.doFilter(req, res);
  }
}
