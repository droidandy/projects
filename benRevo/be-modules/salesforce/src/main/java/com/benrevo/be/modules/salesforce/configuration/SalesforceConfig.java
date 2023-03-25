package com.benrevo.be.modules.salesforce.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.context.annotation.PropertySource;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * Created by ebrandell on 2/8/18 at 11:56 AM.
 */
@Configuration
@EnableAsync
@EnableAspectJAutoProxy
@PropertySource("classpath:sf-application.properties")
public class SalesforceConfig {

}
