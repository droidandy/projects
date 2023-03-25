package com.benrevo.be.modules.shared.configuration;

import java.io.IOException;
import java.nio.charset.Charset;
import java.util.Properties;
import java.util.TimeZone;
import javax.persistence.EntityManagerFactory;
import javax.servlet.MultipartConfigElement;
import javax.sql.DataSource;
import org.apache.velocity.app.VelocityEngine;
import org.apache.velocity.app.event.implement.IncludeRelativePath;
import org.apache.velocity.exception.VelocityException;
import org.apache.velocity.runtime.RuntimeConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.autoconfigure.web.MultipartProperties;
import org.springframework.boot.autoconfigure.web.WebMvcProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.ui.velocity.VelocityEngineFactoryBean;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;
import org.springframework.web.servlet.DispatcherServlet;
import com.benrevo.be.modules.shared.security.JacksonDefaultStringProvider;
import com.benrevo.common.CommonDataConfiguration;
import com.benrevo.data.persistence.PersistanceConfig;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;


@Configuration
@ComponentScan("com.benrevo")
@EnableJpaRepositories("com.benrevo.data.persistence")
@EntityScan("com.benrevo.data.persistence.entities")
@EnableAutoConfiguration
@Import({
    CommonDataConfiguration.class,
    PersistanceConfig.class,
    SharedConfiguration.MultipartAutoConfiguration.class
})
@PropertySource("classpath:application.properties")
public class SharedConfiguration {

    @Bean
    public VelocityEngine velocityEngine() throws VelocityException, IOException {
        VelocityEngineFactoryBean factory = new VelocityEngineFactoryBean();
        Properties props = new Properties();
        props.put("resource.loader", "class");
        props.put("class.resource.loader.class",
            "org.apache.velocity.runtime.resource.loader." + "ClasspathResourceLoader"
        );
        props.put(RuntimeConstants.EVENTHANDLER_INCLUDE, IncludeRelativePath.class.getName());
        factory.setVelocityProperties(props);

        return factory.createVelocityEngine();
    }

    @Configuration
    public static class MappingJackson2HttpMessageConfig {

        @Bean
        public MappingJackson2HttpMessageConverter jacksonHttpMessageConverter() {

            ObjectMapper objectMapper = objectMapper();
            
            MappingJackson2HttpMessageConverter converter =
                new MappingJackson2HttpMessageConverter(objectMapper);
            converter.setDefaultCharset(Charset.forName("UTF-8"));

            return converter;
        }
        
        @Bean
        public ObjectMapper objectMapper() {
            SimpleModule escapingSerializer = new SimpleModule().addSerializer(String.class,
                new JacksonDefaultStringProvider.Serializer()
            )
                .addDeserializer(String.class, new JacksonDefaultStringProvider.Deserializer());

            return Jackson2ObjectMapperBuilder.json()
                .build()
                // TODO: 1) Standardize this and the DTOs to use DATE or STRING (not both)
//                .setDateFormat(getDateTimeInstance(MEDIUM, MEDIUM))
                // TODO: 2) discuss with team
                .setTimeZone(TimeZone.getDefault())
                .registerModule(escapingSerializer);
        }
    }

    @Configuration
    @ConditionalOnClass({
        WebMvcProperties.Servlet.class,
        StandardServletMultipartResolver.class,
        MultipartConfigElement.class
    })
    @ConditionalOnProperty(prefix = "multipart", name = "enabled", matchIfMissing = true)
    @EnableConfigurationProperties(MultipartProperties.class)
    public class MultipartAutoConfiguration {

        @Autowired
        private MultipartProperties multipartProperties = new MultipartProperties();

        @Bean
        @ConditionalOnMissingBean
        public MultipartConfigElement multipartConfigElement() {
            return this.multipartProperties.createMultipartConfig();
        }

        @Bean(name = DispatcherServlet.MULTIPART_RESOLVER_BEAN_NAME)
        @ConditionalOnMissingBean(MultipartResolver.class)
        public StandardServletMultipartResolver multipartResolver() {
            return new StandardServletMultipartResolver();
        }
    }
}
