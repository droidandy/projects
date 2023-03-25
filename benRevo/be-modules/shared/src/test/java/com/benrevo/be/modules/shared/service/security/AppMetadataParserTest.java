package com.benrevo.be.modules.shared.service.security;

import static com.auth0.jwt.algorithms.Algorithm.HMAC256;
import static org.assertj.core.api.Assertions.assertThat;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.benrevo.common.dto.AppMetadata;
import org.junit.Test;


public class AppMetadataParserTest {

    @Test
    public void testRolesArrayDeserialization() throws Exception {
        Algorithm algorithm = HMAC256("secret".getBytes("UTF-8"));
        
        // decode roles array
        String token = JWT.create()
            .withClaim("app_metadata", "{\"roles\":[\"role1\", \"role2\"]}")
            .sign(algorithm);
        
        DecodedJWT decodedJWT = JWT.require(algorithm).build().verify(token);
        
        AppMetadata appMetadata = decodedJWT.getClaim("app_metadata").as(AppMetadata.class);
        assertThat(appMetadata.getRoles()).contains("role1", "role2"); 
        
        // decode roles single string as array 
        token = JWT.create()
            .withClaim("app_metadata", "{\"roles\":\"singleStringRole\"}")
            .sign(algorithm);
        
        decodedJWT = JWT.require(algorithm).build().verify(token);
        
        appMetadata = decodedJWT.getClaim("app_metadata").as(AppMetadata.class);
        assertThat(appMetadata.getRoles()).contains("singleStringRole"); 
    }

}
