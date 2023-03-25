package com.benrevo.be.modules.shared.service;

import com.auth0.client.auth.AuthAPI;
import com.auth0.client.mgmt.ManagementAPI;
import com.auth0.client.mgmt.filter.UserFilter;
import com.auth0.exception.APIException;
import com.auth0.json.mgmt.users.User;
import com.auth0.json.mgmt.users.UsersPage;
import com.benrevo.be.modules.shared.access.AccountRole;
import com.benrevo.be.modules.shared.access.BrokerageRole;
import com.benrevo.common.dto.ClientMemberDto;
import com.benrevo.common.dto.UserLoginDetailsDto;
import com.benrevo.common.exception.BadRequestException;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.common.logging.CustomLogger;
import com.benrevo.common.util.Secure;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.repository.BrokerRepository;
import com.benrevo.data.persistence.repository.ClientRepository;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.benrevo.common.util.MapBuilder.*;
import static java.lang.String.format;
import static java.util.Arrays.asList;
import static java.util.Arrays.stream;
import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toMap;
import static org.apache.commons.lang3.StringUtils.*;

@SuppressWarnings("Duplicates")
@Service
@Transactional
public class Auth0Service {

    // https://auth0.com/docs/api/management/v2/query-string-syntax
    private static final String SEARCH_ENGINE_VERSION = "v3";
    private static final String Q_FILTER = "+app_metadata.brokerageId:\"%s\"+app_metadata.carrierAcl:%s";
    private static final String Q_CREATE_USER_FILTER = "+app_metadata.brokerageId:\"%s\"+email:\"%s\"+app_metadata.brokerageRole:\"%s\"";
    private static final String Q_USER_NAME_FILTER = "name:\"%s\" || user_metadata.first_name:\"%s\" || user_metadata.last_name:\"%s\"";
    
	@Value("${app.carrier}")
    String[] appCarrier;

    @Value("${auth0.connection}")
    String connection;

    @Autowired
    CustomLogger LOGGER;

    @Autowired
    BrokerRepository brokerRepository;

    @Autowired
    ClientRepository clientRepository;

    @Autowired
    ManagementAPI mgmtAPI;

    @Autowired
    AuthAPI authAPI;
    
    public List<User> getUsersForBrokerage(Long brokerId) {

        try {
            Broker broker = brokerRepository.findOne(brokerId);

            if(broker == null) {
                throw new NotFoundException("Broker not found for given ID")
                    .withFields(
                        field("broker_id", brokerId)
                    );
            }

            UserFilter filter = new UserFilter()
                .withFields(
                    "user_id,name,email,user_metadata,app_metadata", true
                ).withQuery(
                    format(
                        Q_FILTER,
                        broker.getBrokerToken(),
                        stream(appCarrier)
                            .map(s -> "\"" + s + "\"")
                            .collect(
                                joining(" ", "(", ")")
                            )
                    )
                ).withSearchEngine(SEARCH_ENGINE_VERSION);

            return mgmtAPI.users()
                .list(filter)
                .execute()
                .getItems();

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


    public List<ClientMemberDto> getUsersIdForBrokerage(Long brokerId) {
        List<ClientMemberDto> clientMemberDtos = new ArrayList<>();

        List<User> users = getUsersForBrokerage(brokerId);

        if(users != null) {
            users.forEach(
                u -> clientMemberDtos.add(
                    new ClientMemberDto.Builder()
                        .withAuthId(u.getId())
                        .withBrokerageId(brokerId)
                        .withName(u.getName())
                        .withEmail(u.getEmail())
                        .withUserMetadata(u.getUserMetadata())
                        .build()
                )
            );
        }
        
        return clientMemberDtos;
    }
    
    public List<ClientMemberDto> getUsersByName(String fullName) {
        List<ClientMemberDto> clientMemberDtos = new ArrayList<>();

        if(isBlank(fullName)) {
        	return clientMemberDtos;
        }
        fullName = fullName.trim();
        String firstName, lastName;
        String[] names = fullName.split(" ");
        if(names.length > 1) {
        	firstName = names[0];
        	lastName = names[1];
        } else {
        	firstName = fullName;
        	lastName = fullName;
        }
        
        try {
        	
            UserFilter filter = new UserFilter()
                .withFields(
                    "user_id,name,email,user_metadata,app_metadata", true
                ).withQuery(
                    format(
                        Q_USER_NAME_FILTER,
                        fullName,
                        firstName,
                        lastName
                    )
                ).withSearchEngine(SEARCH_ENGINE_VERSION);

            UsersPage users = mgmtAPI.users()
                .list(filter)
                .execute();

            if(users.getItems() != null) {
                users.getItems().forEach(
                    u -> clientMemberDtos.add(
                        new ClientMemberDto.Builder()
                            .withAuthId(u.getId())
                           // .withBrokerageId(brokerId)
                            .withName(u.getName())
                            .withEmail(u.getEmail())
                            .withUserMetadata(u.getUserMetadata())
                            .build()
                    )
                );
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

        return clientMemberDtos;
    }

    public void createClientAccountForBrokerage(Long brokerId, String clientEmail, Long clientId) {
        if(!clientRepository.exists(clientId)) {
            throw new NotFoundException("Client not found")
                .withFields(
                    field("client_id", clientId)
                );
        }

        if(!brokerRepository.exists(brokerId)) {
            throw new NotFoundException("Broker not found")
                .withFields(
                    field("broker_id", brokerId)
                );
        }

        createUserIfNotExists(
                clientEmail, 
                brokerId, 
                BrokerageRole.CLIENT.getValue(), 
                new String[] {AccountRole.BROKER.getValue()} );
    }

    public User createUserIfNotExists(String userEmail, Long brokerId, String brokerageRole, String[] roles) {
        try {
            Broker broker = brokerRepository.findOne(brokerId);

            UserFilter filter = new UserFilter()
                .withFields(
                    "user_id,name,email,user_metadata,app_metadata", true
                )
                .withQuery(
                    format(
                        Q_CREATE_USER_FILTER,
                        broker.getBrokerToken(),
                        userEmail,
                        brokerageRole
                    )
                ).withSearchEngine(SEARCH_ENGINE_VERSION);

            // Get existing users matching the broker token, email and role
            UsersPage users = mgmtAPI.users()
                .list(filter)
                .execute();

            if(users != null && users.getItems() != null && users.getItems().size() == 1) {
                LOGGER.warn("User already exists, skipping creation in Auth0.");

                return users.getItems().get(0);
            } else {
                User clientUser = new User(connection);

                clientUser.setEmail(userEmail);
                clientUser.setPassword(Secure.generateRandomToken());
                clientUser.setAppMetadata(
                    build(
                        entry("brokerageRole", brokerageRole),
                        entry("brokerage", broker.getName()),
                        entry("brokerageId", broker.getBrokerToken()),
                        entry("carrierAcl", asList(appCarrier)),
                        entry("roles", asList(roles))
                    )
                );

                try {
                    return mgmtAPI.users()
                        .create(clientUser)
                        .execute();
                } catch(Exception e) {
                    throw new BaseException(e.getMessage(), e);
                }
            }
        } catch(Exception e) {
            throw new BaseException(e.getMessage(), e);
        }
    }

    /**
     * @deprecated  When a user is created, Auth0 sends 
     *              the password reset email as well. </br>
     *              use {@link #createUserIfNotExists}  
     */
    @Deprecated
    public void createUserAndSendPasswordResetEmail(String userEmail, Long brokerId, String brokerageRole) {
        try {
            Broker broker = brokerRepository.findOne(brokerId);

            User clientUser = new User(connection);

            clientUser.setEmail(userEmail);
            clientUser.setPassword(Secure.generateRandomToken());
            clientUser.setAppMetadata(
                build(
                    entry("brokerageRole", brokerageRole),
                    entry("brokerage", broker.getName()),
                    entry("brokerageId", broker.getBrokerToken()),
                    entry("carrierAcl", asList(appCarrier))
                )
            );

            User r = mgmtAPI.users()
                .create(clientUser)
                .execute();

            if(r.getAppMetadata() != null) {
                Map<String, String> am = r.getAppMetadata()
                    .entrySet()
                    .stream()
                    .collect(
                        toMap(
                            Map.Entry::getKey,
                            e -> defaultString((String) e.getValue(), null)
                        )
                    );

                String newClientEmail = r.getEmail();
                String newClientToken = am.get("brokerageId");
                String newClientRole = am.get("brokerageRole");

                if(StringUtils.equals(userEmail, newClientEmail) &&
                   StringUtils.equals(broker.getBrokerToken(), newClientToken) &&
                   StringUtils.equals(newClientRole, brokerageRole)) {

                    sendPasswordResetEmail(userEmail);

                    LOGGER.infoLog(
                        "Password reset email sent to client",
                        field("broker_id", brokerId),
                        field("client_email", userEmail)
                    );
                } else {
                    throw new BadRequestException(
                        "Error sending password reset email: brokerId and clientEmail mismatch"
                    )
                    .withFields(
                        field("broker_id", brokerId),
                        field("client_email", userEmail)
                    );
                }
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

    public ClientMemberDto updateClientAccountMetadata(String clientAuthId, Map<String, Object> metadata) {
        try {
            User updateUser = new User(connection);
            updateUser.setUserMetadata(metadata);

            User u = mgmtAPI.users()
                .update(clientAuthId, updateUser)
                .execute();

            return new ClientMemberDto.Builder()
                .withAuthId(clientAuthId)
                .withName(u.getName())
                .withEmail(u.getEmail())
                .withUserMetadata(u.getUserMetadata())
                .build();
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

    /**
     * Retrieve the last login and login count for the specified auth id from auth0
     *
     * @param clientAuthId
     *     auth id of the user
     * @return
     *      {@link UserLoginDetailsDto}
     */
    public UserLoginDetailsDto getLoginCount(String clientAuthId) {
        try {
            User u = mgmtAPI.users().get(clientAuthId, null).execute();

            UserLoginDetailsDto dto = new UserLoginDetailsDto.Builder()
                .withLastLogin(u.getLastLogin())
                .withLoginCount(u.getLoginsCount())
                .build();

            return dto;
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

    void sendPasswordResetEmail(String clientEmail) {
        try {
            authAPI.resetPassword(clientEmail, connection)
                .execute();
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

    /**
     * Retrieve the user name for the specified auth id from auth0
     *
     * @param clientAuthId
     *     auth id of the user
     * @return
     *     String user name
     */
    public String getUserName(String clientAuthId) {
        
        try {
            User u = mgmtAPI.users().get(clientAuthId, null).execute();
            String userName = null;
            Map<String, Object> data = u.getUserMetadata();
            if (data != null) {
                String firstName = data.containsKey("first_name") ? (String) data.getOrDefault("first_name", "") : "";
                String lastName = data.containsKey("last_name") ? (String) data.getOrDefault("last_name", "") : "";
                userName = isNotBlank(firstName) && isNotBlank(lastName) ? firstName + " " + lastName : u.getName();
            } else {
                userName = u.getName();
            }
            if (userName == null) {
                userName = u.getEmail();
            }
            
            return userName;

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

    public String getUserEmail(String clientAuthId) {
        try {
            User u = mgmtAPI.users().get(clientAuthId, null).execute();
            if(u != null) {
                return u.getEmail();
            }

        } catch(Exception e) {
            LOGGER.errorLog(e.getMessage(), e);
        }
        return null;
    }

    public ClientMemberDto getUserByAuthId(String clientAuthId) {

        try {
            User u = mgmtAPI.users().get(clientAuthId, null).execute();

            return new ClientMemberDto.Builder()
                .withAuthId(clientAuthId)
                .withName(u.getName())
                .withEmail(u.getEmail())
                .withUserMetadata(u.getUserMetadata())
                .build();

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

    /**
     * Get user
     *
     * @param authId
     * @return
     */
    public User getUserInfo(String authId) {
        try {
            return mgmtAPI.users().get(trim(authId), null).execute();
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

    /**
     * Testing purposes
     */
    public void setMgmtAPI(ManagementAPI mgmtAPI) {
        this.mgmtAPI = mgmtAPI;
    }
}
