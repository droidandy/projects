package com.benrevo.core;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import com.benrevo.common.annotation.UseTestProperties;

// TODO 
// 1) create similar AnthemCoreServiceApplicationTest and use for all tests
// 2) remove application-test.properties from uhc-core-service
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@SpringBootTest(classes = UHCCoreServiceApplication.class)
// load application-test.properties from parent module common-core-service
@UseTestProperties
// override app.carrier only with higher priority when APP CARRIER system env
@TestPropertySource(properties = "app.carrier=UHC")
public @interface UHCCoreServiceApplicationTest {}
