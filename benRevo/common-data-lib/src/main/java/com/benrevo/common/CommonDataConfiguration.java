package com.benrevo.common;

import com.benrevo.common.logging.CustomLogger;

import java.util.concurrent.Executor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.InjectionPoint;
import org.springframework.context.annotation.*;
import org.springframework.core.task.SimpleAsyncTaskExecutor;
import org.springframework.scheduling.annotation.EnableAsync;

import static org.springframework.beans.factory.config.BeanDefinition.SCOPE_PROTOTYPE;


@Configuration
@EnableAsync
@EnableAspectJAutoProxy
@ComponentScan("com.benrevo.common")
public class CommonDataConfiguration {

    @Bean
    @Primary
    @Scope(SCOPE_PROTOTYPE)
    public CustomLogger customLogger(InjectionPoint injectionPoint) {
        return CustomLogger.create(injectionPoint.getMember().getDeclaringClass().getName());
    }

    @Bean
    @Scope(SCOPE_PROTOTYPE)
    public Logger defaultLogger(InjectionPoint injectionPoint) {
        return LogManager.getLogger(injectionPoint.getMember().getDeclaringClass().getName());
    }

    @Bean
    public Executor asyncExecutor() {
        SimpleAsyncTaskExecutor executor = new SimpleAsyncTaskExecutor();
        executor.setConcurrencyLimit(50);

        return executor;
    }
}
