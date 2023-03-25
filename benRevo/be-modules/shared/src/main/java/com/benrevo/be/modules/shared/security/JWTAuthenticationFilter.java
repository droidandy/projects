package com.benrevo.be.modules.shared.security;

import com.benrevo.be.modules.shared.util.ServletUtil;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.logging.CustomLogger;
import com.benrevo.common.security.AuthenticatedUser;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.apache.logging.log4j.ThreadContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.GenericFilterBean;
import org.springframework.web.util.NestedServletException;

import static com.benrevo.be.modules.shared.configuration.SecurityConfig.EXCLUDED_URLS;
import static com.benrevo.be.modules.shared.util.ServletUtil.methodMatches;
import static com.benrevo.be.modules.shared.util.ServletUtil.pathPrefixMatches;
import static java.util.Arrays.asList;
import static org.apache.commons.lang3.StringUtils.*;
import static org.springframework.core.Ordered.HIGHEST_PRECEDENCE;
import static org.springframework.http.HttpMethod.OPTIONS;

/**
 * Handles JWT authentication and MDC logging.
 *
 * CORS filter needs to execute first!
 */
@Component
@Order(HIGHEST_PRECEDENCE + 1)
public class JWTAuthenticationFilter extends GenericFilterBean {

    static final String MDC_AUTHID = "authId";
    static final String MDC_BROKER_ID = "brokerId";
    static final String MDC_BROKER_NAME = "brokerName";

    @Value("${app.env}")
    private String appEnv;

    @Autowired
    private CustomLogger LOGGER;

    @Autowired
    private TokenAuthenticationService authenticationService;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain)
        throws IOException, ServletException {
        try {
            // by default set to "null"
            ThreadContext.put(MDC_AUTHID, "null");
            ThreadContext.put(MDC_BROKER_ID, "null");
            ThreadContext.put(MDC_BROKER_NAME, "null");

            if(!pathPrefixMatches(request, "images") && !methodMatches(request, OPTIONS)) {
                if(equalsAnyIgnoreCase(ServletUtil.getRequestURI(request), EXCLUDED_URLS)){
                    filterChain.doFilter(request, response);

                    return;
                }

                // Ignore swagger locally
                if(containsAny(ServletUtil.getRequestURI(request), "swagger", "api-docs") &&
                   equalsIgnoreCase(appEnv, "local")) {
                    filterChain.doFilter(request, response);

                    return;
                }

                AuthenticatedUser authentication = authenticationService
                    .getAuthentication((HttpServletRequest) request);
                SecurityContextHolder.getContext().setAuthentication(authentication);

                // Update "authId" value if not null after authenticating
                if(authentication != null && isNotBlank(authentication.getName())) {
                    ThreadContext.put(MDC_AUTHID, authentication.getName());
                    ThreadContext.put(
                        MDC_BROKER_ID,
                        String.valueOf(authentication.getDetails())
                    );
                    ThreadContext.put(MDC_BROKER_NAME, authentication.getBrokerName());
                }
            }
            filterChain.doFilter(request, response);
        } catch(BaseException | NestedServletException ex) {
            BaseException e;

            if(ex instanceof BaseException) {
                e = (BaseException) ex;
            } else if (ex.getCause() instanceof BaseException) {
                e = (BaseException) ex.getCause();
            } else {
                throw ex;  
            }
            LOGGER.errorLog(e.getMessage(), e);

            response.setContentType(MediaType.APPLICATION_JSON_UTF8_VALUE);
            ((HttpServletResponse) response).sendError(e.getStatus(), e.getMessage());
        } finally {
            ThreadContext.removeAll(
                asList(
                    MDC_AUTHID,
                    MDC_BROKER_ID,
                    MDC_BROKER_NAME
                )
            );
        }
    }
}
