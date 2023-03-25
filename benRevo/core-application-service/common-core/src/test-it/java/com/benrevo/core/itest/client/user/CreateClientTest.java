package com.benrevo.core.itest.client.user;

import static com.benrevo.common.Constants.DENTAL;
import static com.benrevo.common.Constants.MEDICAL;
import static com.benrevo.common.Constants.VISION;
import static com.benrevo.core.itest.util.DataConstants.THE_CLIENT_EXTERNAL_PRODUCTS_SUCCESSFULLY_SET;
import static com.benrevo.core.itest.util.DataConstants.THE_CLIENT_HAS_JUST_BEEN_ARCHIVED;
import static com.benrevo.core.itest.util.DataConstants.THE_CLIENT_HAS_JUST_BEEN_UN_ARCHIVED;
import static com.benrevo.core.itest.util.DataConstants.THE_POST_SALES_DOCUMENTS_WERE_SUCCESSFULLY_SENT;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_CLIENT_NOT_FOUND;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FORBIDDEN;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_INCORRECT_EXT_PRODUCT_NAME;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_REQUIRED_REQUEST_BODY_IS_MISSING;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.CLIENT_NAME_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.ID_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.CLIENTS_CLIENT_ID_ARCHIVE_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.CLIENTS_CLIENT_ID_EXT_PRODUCTS_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.CLIENTS_CLIENT_ID_POSTSALES_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.CLIENTS_CLIENT_ID_RFPS_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.CLIENTS_CLIENT_ID_UNARCHIVE_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.CLIENTS_PATH;
import static io.github.benas.randombeans.api.EnhancedRandom.random;
import static io.restassured.RestAssured.given;
import static io.restassured.http.ContentType.JSON;
import static io.restassured.mapper.ObjectMapperType.GSON;
import static java.util.Arrays.asList;
import static java.util.Collections.singletonList;
import static org.apache.commons.lang3.ArrayUtils.toArray;
import static org.apache.commons.lang3.StringUtils.EMPTY;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import com.benrevo.common.dto.ClientDto;
import com.benrevo.common.dto.ExtProductDto;
import com.benrevo.common.dto.RfpDto;
import com.benrevo.common.enums.AttributeName;
import com.benrevo.core.AbstractBaseIt;
import com.benrevo.core.itest.util.DataConstants;
import java.util.Arrays;
import java.util.List;
import org.subethamail.wiser.Wiser;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;


/**
 * The  Create client  api test.
 */
public class CreateClientTest extends AbstractBaseIt {

    private List<String> extProduct;
    private ClientDto newClient;
    private Wiser wiser;

    @BeforeClass
    public void setUp() {
        extProduct = Arrays.asList(MEDICAL, DENTAL, VISION);
        newClient = random(ClientDto.class, "id", "brokerId", "clientMembers", "rfps", "zip");
        ExtProductDto extProductDto = random(ExtProductDto.class);
        extProductDto.setName(MEDICAL);
        newClient.setRfpProducts(singletonList(extProductDto));

        wiser = new Wiser();
        wiser.setPort(2500);
        wiser.setHostname("localhost");
        wiser.start();

    }

    @AfterClass
    public void tearDown() {
        wiser.stop();
    }

    @Test(description = "POST /v1/clients Creating a new client")
    public void testCreateNewClient() {

        given().spec(baseSpec())
            .contentType(JSON)
            .body(newClient)
            .post(CLIENTS_PATH)
            .then()
            .body(ID_BODY_PATH, notNullValue(), CLIENT_NAME_BODY_PATH,
                equalTo(newClient.getClientName())
            )
            .statusCode(CREATED.value());
    }

    // FIXME: 10/4/2017 NOT YET, temporary this test is disabled.
    @Test(description = "POST /v1/clients Creating a new client with attribute name",
        enabled = false)
    public void testCreateNewClientWithAttribute() {
        newClient.setAttributes(singletonList(AttributeName.DIRECT_TO_PRESENTATION));
        ClientDto createdClient = given().spec(baseSpec())
            .contentType(JSON)
            .body(newClient)
            .post(CLIENTS_PATH)
            .then()
            .statusCode(CREATED.value())
            .extract()
            .as(ClientDto.class);

        assertThat(createdClient.getAttributes()).hasSize(1);
        assertThat(createdClient.getAttributes().get(0)).isEqualTo(
            AttributeName.DIRECT_TO_PRESENTATION.toString());
    }

    @Test(description = "POST /v1/clients Creating a new client with attribute name. Unauthorized.")
    public void testCreateNewClientWithAttributeUnauthorized() {

        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .body(newClient)
            .post(CLIENTS_PATH)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));

    }

    @Test(description = "POST /v1/clients Creating a new client body is empty")
    public void testCreateNewClientInvalidBody() {

        given().spec(baseSpec())
            .contentType(JSON)
            .body(EMPTY)
            .post(CLIENTS_PATH)
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_REQUIRED_REQUEST_BODY_IS_MISSING));
    }

    @Test(description = "POST /v1/clients/{clientId}/archive Archives the client")
    public void testArchivesTheClient() {

        given().spec(baseSpec())
            .contentType(JSON)
            .post(CLIENTS_CLIENT_ID_ARCHIVE_PATH, getClientIdL())
            .then()
            .body(MESSAGE_BODY_PATH, equalTo(THE_CLIENT_HAS_JUST_BEEN_ARCHIVED))
            .statusCode(CREATED.value());
    }

    @Test(description = "POST /v1/clients/{clientId}/archive Archives the client not found client id")
    public void testArchivesTheClientInvalidClientId() {

        given().spec(baseSpec())
            .contentType(JSON)
            .post(CLIENTS_CLIENT_ID_ARCHIVE_PATH, DataConstants.NOT_FOUND_ID)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_CLIENT_NOT_FOUND));
    }

    @Test(description = "POST /v1/clients/{clientId}/archive Archives the client forbidden client id")
    public void testArchivesTheClientForbidden() {

        given().spec(baseSpec())
            .contentType(JSON)
            .post(CLIENTS_CLIENT_ID_ARCHIVE_PATH, DataConstants.FORBIDDEN_CLIENT_ID)
            .then()
            .statusCode(FORBIDDEN.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_FORBIDDEN));
    }

    @Test(description = "POST /v1/clients/{clientId}/archive Archives the client invalid format client id")
    public void testArchivesTheClientInvalidFormat() {

        given().spec(baseSpec())
            .contentType(JSON)
            .post(CLIENTS_CLIENT_ID_ARCHIVE_PATH, DataConstants.INVALID_FORMAT)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));
    }

    @Test(description = "POST /v1/clients/{clientId}/archive Archives the client Unauthorized")
    public void testArchivesTheClientUnauthorized() {

        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .post(CLIENTS_CLIENT_ID_ARCHIVE_PATH, DataConstants.INVALID_FORMAT)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_UNAUTHORIZED));
    }

    @Test(description = "POST /v1/clients/{clientId}/unarchive Un-archives the client")
    public void testUnArchivesTheClient() {

        given().spec(baseSpec())
            .contentType(JSON)
            .post(CLIENTS_CLIENT_ID_UNARCHIVE_PATH, getClientIdL())
            .then()
            .body(MESSAGE_BODY_PATH, equalTo(THE_CLIENT_HAS_JUST_BEEN_UN_ARCHIVED))
            .statusCode(CREATED.value());
    }

    @Test(description = "POST /v1/clients/{clientId}/unarchive Un-archives the client not found client id")
    public void testUnArchivesTheClientInvalidClientId() {

        given().spec(baseSpec())
            .contentType(JSON)
            .post(CLIENTS_CLIENT_ID_UNARCHIVE_PATH, DataConstants.NOT_FOUND_ID)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_CLIENT_NOT_FOUND));
    }

    @Test(description = "POST /v1/clients/{clientId}/unarchive Un-archives the client invalid format")
    public void testUnArchivesTheClientInvalidFormatId() {

        given().spec(baseSpec())
            .contentType(JSON)
            .post(CLIENTS_CLIENT_ID_UNARCHIVE_PATH, DataConstants.INVALID_FORMAT)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));
    }

    @Test(description = "POST /v1/clients/{clientId}/unarchive Un-archives the client forbidden client id")
    public void testUnArchivesTheClientForbidden() {

        given().spec(baseSpec())
            .contentType(JSON)
            .post(CLIENTS_CLIENT_ID_UNARCHIVE_PATH, DataConstants.FORBIDDEN_CLIENT_ID)
            .then()
            .statusCode(FORBIDDEN.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_FORBIDDEN));
    }

    @Test(description = "POST /v1/clients/{clientId}/unarchive Un-archives the client. Unauthorized.")
    public void testUnArchivesTheClientUnauthorized() {

        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .post(CLIENTS_CLIENT_ID_UNARCHIVE_PATH, DataConstants.FORBIDDEN_CLIENT_ID)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));
    }

    // TODO: 10/19/2017 wiser ?
    @Test(description = "POST /v1/clients/{clientId}/postsales Send post sales documents",
        enabled = false)
    public void testSendPostSalesDocuments() {
        String[] excludedFields = toArray("id", "options.id", "carrierHistories");

        RfpDto one = er.nextObject(RfpDto.class, excludedFields);
        RfpDto two = er.nextObject(RfpDto.class, excludedFields);
        RfpDto three = er.nextObject(RfpDto.class, excludedFields);

        one.setId(null);
        one.setProduct(MEDICAL);
        one.setClientId(getClientIdL());
        two.setId(null);
        two.setProduct(DENTAL);
        two.setClientId(getClientIdL());
        three.setId(null);
        three.setProduct(VISION);
        three.setClientId(getClientIdL());

        given().spec(baseSpec())
            .contentType(JSON)
            .body(asList(one, two, three), GSON)
            .post(CLIENTS_CLIENT_ID_RFPS_PATH, 1L)
            .then()
            .statusCode(CREATED.value());

        given().spec(baseSpec())
            .contentType(JSON)
            .post(CLIENTS_CLIENT_ID_POSTSALES_PATH, getClientIdL())
            .then()
            .body(MESSAGE_BODY_PATH, equalTo(THE_POST_SALES_DOCUMENTS_WERE_SUCCESSFULLY_SENT))
            .statusCode(CREATED.value());
    }

    @Test(description = "POST /v1/clients/{clientId}/postsales Send post sales documents not found client id")
    public void testSendPostSalesDocumentsInvalidClientId() {

        given().spec(baseSpec())
            .contentType(JSON)
            .post(CLIENTS_CLIENT_ID_POSTSALES_PATH, DataConstants.NOT_FOUND_ID)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_CLIENT_NOT_FOUND));
    }

    @Test(description = "POST /v1/clients/{clientId}/postsales Send post sales documents forbidden client id")
    public void testSendPostSalesDocumentsForbidden() {

        given().spec(baseSpec())
            .contentType(JSON)
            .post(CLIENTS_CLIENT_ID_POSTSALES_PATH, DataConstants.FORBIDDEN_CLIENT_ID)
            .then()
            .statusCode(FORBIDDEN.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_FORBIDDEN));
    }

    @Test(description = "POST /v1/clients/{clientId}/postsales Send post sales documents invalid format client id")
    public void testSendPostSalesDocumentsInvalidFormat() {

        given().spec(baseSpec())
            .contentType(JSON)
            .post(CLIENTS_CLIENT_ID_POSTSALES_PATH, DataConstants.INVALID_FORMAT)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));
    }

    @Test(description = "POST /v1/clients/{clientId}/postsales Send post sales documents. Unauthorized.")
    public void testSendPostSalesDocumentsUnauthorized() {

        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .post(CLIENTS_CLIENT_ID_POSTSALES_PATH, DataConstants.INVALID_FORMAT)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));
    }

    @Test(description = "POST /v1/clients/{clientId}/extProducts Set client external products")
    public void testSetClientExternalProducts() {

        given().spec(baseSpec())
            .contentType(JSON)
            .body(extProduct)
            .post(CLIENTS_CLIENT_ID_EXT_PRODUCTS_PATH, getClientIdL())
            .then()
            .body(MESSAGE_BODY_PATH, equalTo(THE_CLIENT_EXTERNAL_PRODUCTS_SUCCESSFULLY_SET))
            .statusCode(CREATED.value());
    }

    @Test(description = "POST /v1/clients/{clientId}/extProducts Set client external products")
    public void testSetClientExternalProductsIncorrectExtProduct() {

        given().spec(baseSpec())
            .contentType(JSON)
            .body(singletonList(DataConstants.INVALID_FORMAT))
            .post(CLIENTS_CLIENT_ID_EXT_PRODUCTS_PATH, getClientIdL())
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(MESSAGE_BODY_PATH, equalTo(ERROR_INCORRECT_EXT_PRODUCT_NAME));
    }

    @Test(description = "POST /v1/clients/{clientId}/extProducts Set client external products not found client id")
    public void testSetClientExternalProductsInvalidClientId() {

        given().spec(baseSpec())
            .contentType(JSON)
            .body(extProduct)
            .post(CLIENTS_CLIENT_ID_EXT_PRODUCTS_PATH, DataConstants.NOT_FOUND_ID)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_CLIENT_NOT_FOUND));
    }

    @Test(description = "POST /v1/clients/{clientId}/extProducts Set client external products forbidden client id")
    public void testSetClientExternalProductsForbidden() {

        given().spec(baseSpec())
            .contentType(JSON)
            .body(extProduct)
            .post(CLIENTS_CLIENT_ID_EXT_PRODUCTS_PATH, DataConstants.FORBIDDEN_CLIENT_ID)
            .then()
            .statusCode(FORBIDDEN.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_FORBIDDEN));
    }

    @Test(description = "POST /v1/clients/{clientId}/extProducts Set client external products empty body")
    public void testSetClientExternalProductsExtProductBodyEmpty() {

        given().spec(baseSpec())
            .contentType(JSON)
            .body(EMPTY)
            .post(CLIENTS_CLIENT_ID_EXT_PRODUCTS_PATH, getClientIdL())
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_REQUIRED_REQUEST_BODY_IS_MISSING));
    }

    @Test(description = "POST /v1/clients/{clientId}/extProducts Set client external products invalid format client id")
    public void testSetClientExternalProductsExtProductInvalidFormat() {

        given().spec(baseSpec())
            .contentType(JSON)
            .body(extProduct)
            .post(CLIENTS_CLIENT_ID_EXT_PRODUCTS_PATH, DataConstants.INVALID_FORMAT)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));
    }

    @Test(description = "POST /v1/clients/{clientId}/extProducts Set client external products. Unauthorized.")
    public void testSetClientExternalProductsExtProductUnauthorized() {

        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .body(extProduct)
            .post(CLIENTS_CLIENT_ID_EXT_PRODUCTS_PATH, DataConstants.INVALID_FORMAT)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));
    }

}
