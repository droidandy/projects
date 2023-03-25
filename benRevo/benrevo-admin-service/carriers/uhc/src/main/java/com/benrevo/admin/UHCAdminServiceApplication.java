package com.benrevo.admin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;


@SpringBootApplication
@Configuration
@Import(AdminServiceApplication.class)
@ActiveProfiles("uhc")
public class UHCAdminServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(UHCAdminServiceApplication.class, args);
    }
}
