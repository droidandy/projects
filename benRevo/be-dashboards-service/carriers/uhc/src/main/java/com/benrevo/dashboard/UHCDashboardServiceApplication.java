package com.benrevo.dashboard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;


@SpringBootApplication
@Configuration
@Import(DashboardServiceApplication.class)
@ActiveProfiles("uhc")
public class UHCDashboardServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(UHCDashboardServiceApplication.class, args);
    }
}
