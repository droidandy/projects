package com.benrevo.test.api;

import com.benrevo.common.exception.NotFoundException;
import com.benrevo.test.utils.TokenGenerator;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import io.restassured.RestAssured;
import org.testng.annotations.BeforeMethod;

import java.util.HashMap;

public class BaseTest {

    public static Gson gson = new GsonBuilder().serializeNulls().create();
    public static HashMap<String, String> auth;

    /**
     * Sets up the authentication and base URI
     *
     * @throws Exception
     */
    @BeforeMethod(alwaysRun = true)
    public void setup() throws Exception {
        String secret = System.getenv("SECRET");
        auth = TokenGenerator.createAuthMap(secret);

        String baseHost = System.getenv("BENREVO_API_PATH");
        if(baseHost == null) {
            throw new NotFoundException("System environments are not properly set!");
        }

        RestAssured.baseURI = baseHost;
    }
}
