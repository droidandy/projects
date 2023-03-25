package com.benrevo.be.modules.shared.security;

import com.auth0.client.mgmt.ManagementAPI;
import com.auth0.exception.APIException;
import com.auth0.json.mgmt.users.User;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.impl.NullClaim;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.benrevo.be.modules.shared.access.AccountRole;
import com.benrevo.be.modules.shared.access.BrokerageRole;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.AppMetadata;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.NotAuthorizedException;
import com.benrevo.common.logging.CustomLogger;
import com.benrevo.common.security.AuthenticatedUser;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.repository.BrokerRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.vavr.control.Try;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.List;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import static com.auth0.jwt.algorithms.Algorithm.HMAC256;
import static com.benrevo.common.util.MapBuilder.field;
import static java.util.Arrays.asList;
import static org.apache.commons.lang3.StringUtils.*;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;

@Service
public class TokenAuthenticationService implements InitializingBean {

    private static ObjectMapper mapper = new ObjectMapper();
    private static Algorithm algorithm;

    protected static final String APP_METADATA = "app_metadata";
    protected static final String CLAIM_NAME = "name";
    protected static final String TOKEN_REGEX = "^Bearer\\s.+\\..+\\..+$";

    @Value("${app.carrier}")
    protected String[] appCarrier;

    @Value("${auth0.clientSecret}")
    protected String secret;

    @Value("${auth0.clientId}")
    protected String clientId;

    @Value("${auth0.issuer}")
    protected String issuer;

    @Value("${auth0.app: 'UNKNOWN'}")
    protected String parentApp; // can be ADMIN or anything else

    @Autowired
    protected CustomLogger LOGGER;

    @Autowired
    protected BrokerRepository brokerRepository;

    @Autowired
    protected ManagementAPI mgmtAPI;

    @Override
    public void afterPropertiesSet() throws Exception {
        algorithm = HMAC256(secret.getBytes("UTF-8"));
    }
    
    /**
     * Creates a valid token for the provided brokerage and auth identifiers. Mostly used for
     * testing.
     *
     * @param brokerageId
     *     brokerageId or "broker token"
     * @param authId
     *     authId or "subject"
     * @param carrierAcl
     *     Array of carriers associated with this broker
     * @return
     *     String token (without the "Bearer " prefix)
     */
    public String createTokenForBroker(String brokerageId, String authId, String[] carrierAcl) {
        return createTokenForBroker(brokerageId, authId, new String[] {AccountRole.ADMINISTRATOR.getValue()}, carrierAcl);
    }
    
    /**
     * Creates a valid token for the provided brokerage and auth identifiers. Mostly used for
     * testing.
     *
     * @param brokerageId
     *     brokerageId or "broker token"
     * @param authId
     *     authId or "subject"
     * @param carrierAcl
     *     Array of carriers associated with this broker
     * @param roles
     *     Array of roles for the user (NOT brokerageRole)
     * @return
     *     String token (without the "Bearer " prefix)
     */
    public String createTokenForBroker(String brokerageId, String authId, String[] roles, String[] carrierAcl) {
        return createTokenForBroker(brokerageId, authId, BrokerageRole.SUPERADMIN.getValue(), roles, carrierAcl);
    }

    /**
     * Creates a valid token for the provided brokerage and auth identifiers. Mostly used for
     * testing.
     *
     * @param brokerageId
     *     brokerageId or "broker token"
     * @param authId
     *     authId or "subject"
     * @param carrierAcl
     *     Array of carriers associated with this broker
     * @param brokerRole
     *     brokerageRole for the user
     * @param roles
     *     Array of roles for the user
     * @return
     *     String token (without the "Bearer " prefix)
     */
    public String createTokenForBroker(String brokerageId, String authId, String brokerRole, String[] roles, String[] carrierAcl) {
        if(carrierAcl == null || carrierAcl.length == 0) {
            carrierAcl = appCarrier;
        }

        AppMetadata appMetadata = new AppMetadata.Builder()
            .withBrokerage("FTP Brokerage")
            .withBrokerageRole(brokerRole)
            .withRoles(roles != null ? asList(roles) : null)
            .withBrokerageId(brokerageId)
            .withCarrierAcl(asList(carrierAcl))
            .build();

        return JWT.create()
            .withClaim(
                APP_METADATA,
                Try.of(() -> mapper.writeValueAsString(appMetadata)).getOrNull()
            )
            .withIssuer(issuer)
            .withSubject(authId)
            .withAudience(clientId)
            .sign(algorithm);
    }

    /**
     * Takes a HttpServletRequest and attempts to extract the token from the Authorization header.
     * If successful, it will attempt to validate/verify the token and return a DecodedJWT token.
     *
     * @param request
     *     The incoming request with the Authorization header
     * @return
     *     {@link DecodedJWT}
     */
    public DecodedJWT validateAndExtractToken(final HttpServletRequest request)
        throws JWTVerificationException {

        String authHeader = request != null ? request.getHeader(AUTHORIZATION) : null;

        if(isBlank(authHeader)) {
            throw new NotAuthorizedException("Missing 'Authorization' header");
        } else if(!authHeader.matches(TOKEN_REGEX)) {
            throw new NotAuthorizedException("Authorization header value must be in the format: 'Bearer <TOKEN>'");
        }

        String token = split(authHeader).length > 1 ? split(authHeader)[1].trim() : "";

        return JWT.require(algorithm)
            .withIssuer(issuer)
            .withAudience(clientId)
            .acceptLeeway(5)
            .acceptExpiresAt(5)
            .build()
            .verify(token);
    }

    /**
     * Calls validateAndExtractToken(...) and then attempts to verify the brokerageId from the
     * response's "app_metadata" claim within the decoded token payload.
     *
     * @param request
     *      The incoming request with the Authorization header
     * @return
     *      {@link AuthenticatedUser}
     */
    public AuthenticatedUser getAuthentication(final HttpServletRequest request) {
        AuthenticatedUser authenticatedUser = null;

        try {
            DecodedJWT decodedJWT = validateAndExtractToken(request);

            String authId = decodedJWT.getSubject();
            AppMetadata appMetadata = getUserInfo(authId, decodedJWT);

            if(appMetadata != null) {
                Broker broker = null;
                if (appMetadata.getRoles() != null
                    && (appMetadata.getRoles().contains(AccountRole.IMPLEMENTATION_MANAGER.getValue()))
                ) {
                    broker = brokerRepository.findByName(Constants.ANTHEM_IMPLEMENTATION_MANAGER_BROKE_NAME);
                } else if (appMetadata.getBrokerageId() != null) {
                    broker = brokerRepository.findByBrokerToken(appMetadata.getBrokerageId());
                }

                if(isNotBlank(authId) && broker != null &&
                   userHasEnvironmentAcl(appMetadata.getCarrierAcl()) &&
                    isAdminAppAndUserHasRole(appMetadata.getBrokerageRole())) {

                    AuthenticatedUser.Builder b = new AuthenticatedUser.Builder()
                        .withAuthId(authId)
                        // name = email for auth0 json web tokens
                        .withEmail(decodedJWT.getClaim(CLAIM_NAME).asString())
                        .withPrincipal(decodedJWT.getClaim(CLAIM_NAME).asString())
                        .withBrokerageId(broker.getBrokerId())
                        .withBrokerName(broker.getName())
                        .withBrokerRole(appMetadata.getBrokerageRole())
                        .withRoles(appMetadata.getRoles())
                        .withCarrierAcls(appMetadata.getCarrierAcl())
                        .withAuthenticated(true);

                    if("ADMIN".equals(parentApp)){
                       b.withAuthority(new SimpleGrantedAuthority(appMetadata.getBrokerageRole()));
                    }
                    authenticatedUser = b.build();
                }
            }
        } catch(JWTVerificationException e) {
            LOGGER.errorLog(e.getMessage(), e);
        }

        if(authenticatedUser != null) {
            return authenticatedUser;
        } else {
            throw new NotAuthorizedException();
        }
    }

    private boolean isAdminAppAndUserHasRole(String brokerageRole){
        if(!"ADMIN".equals(parentApp)){
            return true;
        }else if("ADMIN".equals(parentApp)){
            // check to make sure user's role is correct
            if(equalsIgnoreCase(brokerageRole, BrokerageRole.SUPERADMIN.getValue())){
                return true;
            }
        }
        return false;
    }

    /**
     * By default, if no APP_CARRIER environment variable is set, it will default to false and fail
     * validation.
     *
     * @param userAcls
     *     The 'carrierAcl' list from app_metadata
     * @return
     *     true if the user has the acl or app_carrier=all, false otherwise
     */
    public boolean userHasEnvironmentAcl(final List<String> userAcls) {
        return userAcls != null && userAcls
            .stream()
            .anyMatch(
                s -> equalsAnyIgnoreCase(
                    s,
                    appCarrier
                )
            );
    }

    /**
     * Will return the app_metadata associated with the user's authid. WAARNING: this method should
     * only be called AFTER the user has successfully authenticated.
     *
     * @param authId
     *     Auth id of the user
     * @return
     *     {@link AppMetadata} metadata
     */
    protected AppMetadata getUserInfo(String authId, DecodedJWT decodedJWT) {
        try {
            Claim appMetadataClaim = decodedJWT.getClaim(APP_METADATA);

            if(appMetadataClaim == null || appMetadataClaim instanceof NullClaim) {
                // Retrieve the app metadata manually using the auth id
                User u = mgmtAPI.users().get(trim(authId), null).execute();

                return new AppMetadata.Builder().build(u.getAppMetadata());
            } else {
                // Otherwise just extract the claim that was provided
                return appMetadataClaim.as(AppMetadata.class);
            }
        } catch(APIException e) {
            LOGGER.errorLog(
                e.getMessage(),
                e,
                field("description", e.getDescription()),
                field("error", e.getError()),
                field("status_code", e.getStatusCode())
            );

            throw new BaseException(e.getMessage(), e);
        } catch(IOException e) {
            throw new BaseException(e.getMessage(), e);
        }
    }
}
