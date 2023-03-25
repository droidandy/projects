package com.benrevo.be.modules.shared.configuration;

import org.aopalliance.intercept.MethodInvocation;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.expression.spel.support.StandardTypeLocator;
import org.springframework.security.access.expression.method.DefaultMethodSecurityExpressionHandler;
import org.springframework.security.access.expression.method.MethodSecurityExpressionHandler;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.method.configuration.GlobalMethodSecurityConfiguration;
import org.springframework.security.core.Authentication;

/**
 * Created by ebrandell on 1/15/18 at 12:41 PM.
 */
@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true, proxyTargetClass = true)
public class MethodSecurityConfig extends GlobalMethodSecurityConfiguration {

    @Bean
    @Primary
    public MethodSecurityExpressionHandler securityExpressionHandler () {

        DefaultMethodSecurityExpressionHandler handler = new DefaultMethodSecurityExpressionHandler() {

            @Override
            public StandardEvaluationContext createEvaluationContextInternal(Authentication auth, MethodInvocation mi) {
                StandardEvaluationContext standardEvaluationContext = super.createEvaluationContextInternal(auth, mi);
                ((StandardTypeLocator) standardEvaluationContext.getTypeLocator()).registerImport("com.benrevo.be.modules.shared.access");
                return standardEvaluationContext;
            }
        };

        // to remove default prefix 'ROLE_'
        handler.setDefaultRolePrefix("");

        return handler;
    }
}
