package com.benrevo.admin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;


/**
 * Created by ebrandell on 11/17/17 at 2:06 PM.
 */
@SpringBootApplication
@Configuration
@Import(AdminServiceApplication.class)
@ActiveProfiles("anthem")
public class AnthemAdminServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AnthemAdminServiceApplication.class, args);
    }
}
