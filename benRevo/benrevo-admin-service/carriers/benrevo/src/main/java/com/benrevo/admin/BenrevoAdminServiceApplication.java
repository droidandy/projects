package com.benrevo.admin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;


@SpringBootApplication
@Configuration
@Import(AdminServiceApplication.class)
@ActiveProfiles("benrevo")
public class BenrevoAdminServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(BenrevoAdminServiceApplication.class, args);
    }
}
