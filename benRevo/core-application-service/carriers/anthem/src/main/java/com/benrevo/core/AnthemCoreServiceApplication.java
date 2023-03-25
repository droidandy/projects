package com.benrevo.core;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;


/**
 * Created by ebrandell on 11/18/17 at 7:01 PM.
 */
@SpringBootApplication
@Configuration
@Import(CoreServiceApplication.class)
@ActiveProfiles("anthem")
public class AnthemCoreServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AnthemCoreServiceApplication.class, args);
    }
}
