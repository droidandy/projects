package com.benrevo.be.modules.shared.configuration;

import com.auth0.client.auth.AuthAPI;
import com.auth0.client.mgmt.ManagementAPI;
import com.auth0.json.auth.TokenHolder;
import com.benrevo.be.modules.shared.access.BrokerageRole;
import com.benrevo.be.modules.shared.security.JWTAuthenticationFilter;
import com.benrevo.be.modules.shared.security.logging.HttpRequestLogFilter;
import com.benrevo.be.modules.shared.security.logging.HttpRequestLogRepository;
import com.benrevo.common.exception.BaseException;
import com.google.common.collect.ImmutableSet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.actuate.trace.TraceProperties;
import org.springframework.boot.actuate.trace.WebRequestTraceFilter;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Scope;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration
    .WebSecurityConfigurerAdapter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import static org.apache.commons.lang3.StringUtils.equalsIgnoreCase;
import static org.springframework.beans.factory.config.BeanDefinition.SCOPE_PROTOTYPE;
import static org.springframework.boot.actuate.trace.TraceProperties.Include.*;
import static org.springframework.context.annotation.ScopedProxyMode.TARGET_CLASS;

@Configuration
@EnableWebSecurity(debug = false)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    public static final String[] EXCLUDED_URLS = {
        "/v1/signup",
        "/v1/contactus",
        "/v1/requestDemo",
        "/v1/accountRequest",
        "/v1/verifyEmail",
        "/health"
    };

    // TODO: fix this so it's not only available locally, but still secure publicly
    public static final String[] SWAGGER_EXCLUSIONS = {
        "/swagger-ui.html",
        "/swagger-resources",
        "/webjars/springfox-swagger-ui",
        "/v2/api-docs"
    };

    @Value("${app.env}")
    protected String appEnv;

    @Value("${auth0.be.clientId}")
    protected String clientId;

    @Value("${auth0.be.clientSecret}")
    protected String secret;

    @Value("${auth0.be.domain}")
    protected String domain;

    @Value("${auth0.be.audience}")
    protected String audience;

    @Autowired
    protected JWTAuthenticationFilter jwtAuthenticationFilter;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable()
            .authorizeRequests()
            .antMatchers(HttpMethod.OPTIONS, "/v1/**")
            .permitAll();

        http.csrf().disable()
            .authorizeRequests()
            .antMatchers(EXCLUDED_URLS)
            .permitAll();

        http.csrf().disable()
            .authorizeRequests()
            .antMatchers(HttpMethod.OPTIONS, "/admin/**")
            .permitAll();

        http.csrf().disable()
            .addFilterAfter(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .authorizeRequests()
            .antMatchers("/admin/**")
            .authenticated()
            .anyRequest()
            .hasAuthority(BrokerageRole.SUPERADMIN.getValue());

        // Ignore swagger restrictions locally
        if(equalsIgnoreCase(appEnv, "local")) {
            http.csrf().disable()
                .authorizeRequests()
                .antMatchers(SWAGGER_EXCLUSIONS)
                .permitAll();
        }

        http.csrf().disable()
            .addFilterAfter(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .authorizeRequests()
            .antMatchers("/v1/**")
            .authenticated()
            .anyRequest()
            .permitAll();
    }

    @Bean
    @Primary
    @ConditionalOnProperty(name = "http.logging.enabled", havingValue = "true")
    public WebRequestTraceFilter getHttpRequestLogFilter(@Autowired HttpRequestLogRepository tr) {
        TraceProperties tp = new TraceProperties();

        // Modify this to exclude any sensitive info
        tp.setInclude(
            ImmutableSet.of(
                REQUEST_HEADERS,
                RESPONSE_HEADERS,
                //COOKIES,
                //AUTHORIZATION_HEADER,
                ERRORS,
                TIME_TAKEN,
                PARAMETERS,
                REMOTE_ADDRESS,
                QUERY_STRING,
                PATH_INFO,
                PATH_TRANSLATED
            )
        );

        return new HttpRequestLogFilter(tr, tp);
    }

    /*
     * Uses proxyMode = TARGET_CLASS to ensure a new instance is return every time, regardless
     * of injection point.
     */
    @Bean
    @Scope(scopeName = SCOPE_PROTOTYPE, proxyMode = TARGET_CLASS)
    public ManagementAPI getManagementAPI() {
        try {
            TokenHolder t = new AuthAPI(domain, clientId, secret)
                .requestToken(audience)
                .execute();

            return new ManagementAPI(domain, t.getAccessToken());
        } catch(Exception e) {
            throw new BaseException(e.getMessage(), e);
        }
    }

    /*
     * Uses proxyMode = TARGET_CLASS to ensure a new instance is return every time, regardless
     * of injection point.
     */
    @Bean
    @Scope(scopeName = SCOPE_PROTOTYPE, proxyMode = TARGET_CLASS)
    public AuthAPI getAuthAPI() {
        return new AuthAPI(domain, clientId, secret);
    }
}
