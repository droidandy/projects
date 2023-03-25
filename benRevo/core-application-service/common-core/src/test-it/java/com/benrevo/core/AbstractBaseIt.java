package com.benrevo.core;

import ch.vorburger.mariadb4j.DB;
import ch.vorburger.mariadb4j.springframework.MariaDB4jSpringService;
import com.benrevo.be.modules.shared.security.TokenAuthenticationService;
import com.benrevo.be.modules.shared.test.TestEntityHelper;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.core.AbstractBaseIt.IntegrationTestConfig;
import io.github.benas.randombeans.api.EnhancedRandom;
import io.restassured.builder.RequestSpecBuilder;
import io.restassured.specification.RequestSpecification;
import liquibase.integration.spring.SpringLiquibase;

import javax.annotation.PostConstruct;
import javax.sql.DataSource;
import java.sql.Driver;
import java.util.Properties;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.jackson.JacksonAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.*;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.Environment;
import org.springframework.core.env.MutablePropertySources;
import org.springframework.core.env.PropertiesPropertySource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.SimpleDriverDataSource;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.jdbc.SqlConfig;
import org.springframework.test.context.jdbc.SqlConfig.TransactionMode;
import org.springframework.test.context.jdbc.SqlGroup;
import org.springframework.test.context.jdbc.SqlScriptsTestExecutionListener;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.test.context.support.DirtiesContextBeforeModesTestExecutionListener;
import org.springframework.test.context.support.DirtiesContextTestExecutionListener;
import org.springframework.test.context.testng.AbstractTransactionalTestNGSpringContextTests;
import org.springframework.test.context.transaction.TransactionalTestExecutionListener;

import static com.benrevo.common.enums.CarrierType.*;
import static com.benrevo.core.AbstractBaseIt.IntegrationTestConfig.ResourceFiles.CHANGELOG;
import static com.benrevo.core.AbstractBaseIt.IntegrationTestConfig.ResourceFiles.TEST_SEED;
import static io.github.benas.randombeans.EnhancedRandomBuilder.aNewEnhancedRandomBuilder;
import static java.lang.Class.forName;
import static java.lang.String.format;
import static java.util.Arrays.stream;
import static org.apache.commons.lang3.ArrayUtils.toArray;
import static org.apache.commons.lang3.StringUtils.isNotBlank;
import static org.springframework.beans.factory.config.BeanDefinition.SCOPE_PROTOTYPE;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.test.context.jdbc.Sql.ExecutionPhase.AFTER_TEST_METHOD;
import static org.springframework.test.context.jdbc.Sql.ExecutionPhase.BEFORE_TEST_METHOD;

@RunWith(SpringRunner.class)
@ActiveProfiles("integration")
@SpringBootTest(
    classes = IntegrationTestConfig.class,
    webEnvironment = RANDOM_PORT
)
@TestExecutionListeners(
    inheritListeners = false,
    listeners = {
        TransactionalTestExecutionListener.class,
        SqlScriptsTestExecutionListener.class,
        DirtiesContextBeforeModesTestExecutionListener.class,
        DependencyInjectionTestExecutionListener.class,
        DirtiesContextTestExecutionListener.class
    }
)
@SqlConfig(transactionMode = TransactionMode.DEFAULT)
@SqlGroup({
    @Sql(executionPhase = BEFORE_TEST_METHOD, scripts = "classpath:sql/setup.sql"),
    @Sql(executionPhase = AFTER_TEST_METHOD, scripts = "classpath:sql/teardown.sql")
})
@TestPropertySource("classpath:application-integration.properties")
public abstract class AbstractBaseIt extends AbstractTransactionalTestNGSpringContextTests {

    private static final String LOCALHOST = "http://localhost";

    @Autowired
    protected TestEntityHelper testEntityHelper;
    // Define groups here as necessary
    public interface Groups {
        String RFP = "rfp";
        String Client = "client";
    }

    @Value("${test.client1.brokerage.id}")
    protected String client1BrokerageId;

    @Value("${test.client2.brokerage.id}")
    protected String client2BrokerageId;

    @Value("${auth0.test.authId}")
    protected String testAuthId;

    @Value("${local.server.port}")
    protected int serverPort;

    @Autowired
    protected EnhancedRandom er;

    @Autowired
    protected JdbcTemplate jdbcTemplate;

    @Autowired
    private TokenAuthenticationService authService;

    /**
     * Retrieve the base {@link RequestSpecification} for all future calls.
     *
     * @return
     *     {@link RequestSpecification}
     */
    protected RequestSpecification baseSpec(String brokerageToken, String authId, CarrierType ... carrierAcl) {
        return new RequestSpecBuilder()
            .setBaseUri(LOCALHOST)
            .setPort(serverPort)
            .setBasePath("/v1")
            .addHeader(
                AUTHORIZATION,
                format(
                    "Bearer %s",
                    authService.createTokenForBroker(
                        isNotBlank(brokerageToken) ? brokerageToken : client1BrokerageId,
                        isNotBlank(authId) ? authId : testAuthId,
                        carrierAcl != null && carrierAcl.length != 0
                            ? stream(carrierAcl).map(Enum::name).toArray(String[]::new)
                            : toArray(UHC.name(), ANTHEM_BLUE_CROSS.name(), OTHER.name())
                    )
                )
            )
            .build();
    }

    /**
     * Overloaded. Can leave off second parameter.
     */
    protected RequestSpecification baseSpec(String brokerageToken, CarrierType ... carrierAcl) {
        return baseSpec(brokerageToken, null, carrierAcl);
    }

    /**
     * Overloaded. Can leave off carrierAcl.
     */
    protected RequestSpecification baseSpec(CarrierType ... carrierAcl) {
        return baseSpec(null, null, carrierAcl);
    }

    public Long getBrokerIdL() {
        return 2L;
    }

    public Long getClientIdL() {
        return 1L;
    }

    public Long getRfpCarrierId() {
        return 1L;
    }

    public Long getClientRpf() {

        return 1L;
    }

    public Long getNewClientIdL() {
        return 1L;
    }

    public RequestSpecification unauthorizedSpec() {
        return new RequestSpecBuilder()
                .setBaseUri(LOCALHOST)
                .setPort(serverPort)
                .setBasePath("/v1")
                .addHeader(AUTHORIZATION, "Bearer eyJ.eyJ.eyJ")
                .build()
                ;
    }
    /**
     * Configuration class for the integration tests
     */
    @Configuration
    @Import(CoreServiceApplication.class)
    @EnableAutoConfiguration(exclude = JacksonAutoConfiguration.class)
    public static class IntegrationTestConfig {

        public enum ResourceFiles {
            CHANGELOG("db/changelog/db.changelog-master.xml"),
            TEST_SEED("db/schema_v2_test_seed.sql");

            public final String location;

            ResourceFiles(String s) {
                this.location = s;
            }
        }

        private final String SCHEMA = "br_dev";

        @Value("${spring.datasource.username:root}")
        private String username;

        @Value("${spring.datasource.password:root}")
        private String password;

        @Value("${spring.datasource.port:1234}")
        private int port;

        @Autowired
        private Environment env;

        @PostConstruct
        public void initIt() throws Exception {
          // changing parameters for testing
          // Because of the way the aws.properties file is loaded, changing the settings with @TestPropertySource does not work
          Properties properties = new Properties();
          properties.setProperty("aws.ses.host", "localhost");
          properties.setProperty("aws.ses.port", "2500");
          properties.setProperty("aws.ses.auth", "false");
          properties.setProperty("aws.ses.tls", "false");
          MutablePropertySources ps = ((ConfigurableEnvironment) env).getPropertySources();
          ps.addFirst(new PropertiesPropertySource("test", properties));
        }

        @Bean
        @Scope(SCOPE_PROTOTYPE)
        public EnhancedRandom enhancedRandom() {
            return aNewEnhancedRandomBuilder()
                .collectionSizeRange(1, 20)
                .randomizationDepth(10)
                .build();
        }

        @Bean("database")
        public MariaDB4jSpringService mariaDb() throws Exception {
            MariaDB4jSpringService mariaDb = new MariaDB4jSpringService();
            mariaDb.setDefaultPort(port);

            return mariaDb;
        }

        @Primary
        @Bean("datasource")
        @DependsOn(value = { "database" })
        @SuppressWarnings("Duplicates")
        public DataSource dataSource(MariaDB4jSpringService mariaDb, DataSourceProperties dsProps) throws Exception {
            mariaDb.getDB().createDB(SCHEMA);

            SimpleDriverDataSource dataSource = new SimpleDriverDataSource();

            dataSource.setDriverClass(getDriverClass(dsProps.determineDriverClassName()));
            dataSource.setUrl(dsProps.getUrl());
            dataSource.setUsername(dsProps.getUsername());
            dataSource.setPassword(dsProps.getPassword());
            dataSource.setSchema(SCHEMA);

            return dataSource;
        }

        @Bean("liquibase")
        @DependsOn(value = { "database", "datasource" })
        @SuppressWarnings("Duplicates")
        public SpringLiquibase liquibase(DataSource ds) {
            SpringLiquibase sl = new SpringLiquibase();

            sl.setIgnoreClasspathPrefix(true);
            sl.setChangeLog("classpath:" + CHANGELOG.location);
            sl.setDefaultSchema(SCHEMA);
            sl.setDataSource(ds);
            sl.setDropFirst(false);
            sl.setShouldRun(true);

            return sl;
        }

        @Bean("seeddata")
        @DependsOn(value ={ "database", "datasource", "liquibase" })
        public DB seedData(MariaDB4jSpringService mariaDb) throws Exception {
            mariaDb.getDB().source(TEST_SEED.location, username, password, SCHEMA);

            return mariaDb.getDB();
        }

        private Class<Driver> getDriverClass(String className) {
            try {
                return (Class<Driver>) forName(className);
            } catch (ClassNotFoundException e) {
                throw new RuntimeException(e);
            }
        }
    }
}
