package com.benrevo.dashboard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.PropertySource;
import org.springframework.scheduling.annotation.EnableScheduling;
import com.benrevo.be.modules.shared.configuration.MethodSecurityConfig;
import com.benrevo.be.modules.shared.configuration.RedisConfig;
import com.benrevo.be.modules.shared.configuration.SecurityConfig;
import com.benrevo.be.modules.shared.configuration.SharedConfiguration;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;


@Configuration
@SpringBootApplication
@EnableScheduling
@Import({
    RedisConfig.class,
    SecurityConfig.class,
    MethodSecurityConfig.class,
    SharedConfiguration.class
})
@PropertySource("classpath:application.properties")
public class DashboardServiceApplication {

    @Configuration
    @EnableSwagger2
    @ComponentScan("com.benrevo.dashboard.controller")
    public static class SwaggerConfig {

        @Bean
        public Docket api() {
            return new Docket(DocumentationType.SWAGGER_2).select()
                .apis(RequestHandlerSelectors.any())
                .paths(PathSelectors.any())
                .build();
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(DashboardServiceApplication.class, args);
    }

}
