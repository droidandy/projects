package com.benrevo.be.modules.shared.security.logging;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;
import java.util.UUID;
import org.apache.logging.log4j.ThreadContext;
import org.springframework.boot.actuate.trace.TraceProperties;
import org.springframework.boot.actuate.trace.TraceRepository;
import org.springframework.boot.actuate.trace.WebRequestTraceFilter;
import org.springframework.util.AntPathMatcher;

import static java.util.Arrays.stream;

/**
 * Allows us to log HTTP requests in Splunk/Log4j2.
 *
 * This can be disabled by setting the TRACE_LOGGING system property to false.
 */
public class HttpRequestLogFilter extends WebRequestTraceFilter {

    static final String MDC_TID = "tid";
    static final String[] excludedEndpoints = { "/app-status/**" };

    public HttpRequestLogFilter(TraceRepository repository, TraceProperties properties) {
        super(repository, properties);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException {

        try {
            final String requestid = UUID.randomUUID().toString();

            // Add "tid" to MDC
            ThreadContext.put(MDC_TID, requestid);

            super.doFilterInternal(request, response, filterChain);
        } finally {
            ThreadContext.remove(MDC_TID);
        }

    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        return stream(excludedEndpoints)
            .anyMatch(
                exclusion -> new AntPathMatcher().match(
                    exclusion,
                    request.getServletPath()
                )
            );
    }

    @Override
    protected void postProcessRequestHeaders(Map<String, Object> headers) {
        // Post process any request headers to strip sensitive info or strip the header(s) entirely
    }
}
