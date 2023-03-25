package com.benrevo.core.api.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.data.Offset.offset;
import static com.benrevo.be.modules.shared.service.SharedRfpQuoteService.DENTAL_BUNDLE_DISCOUNT_PERCENT;
import static com.benrevo.common.util.MapBuilder.build;
import static com.benrevo.common.util.MapBuilder.entry;
import static com.benrevo.common.util.MathUtils.getDiscountFactor;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.when;


import com.auth0.client.mgmt.filter.UserFilter;
import com.auth0.exception.Auth0Exception;
import com.auth0.json.mgmt.users.User;
import com.benrevo.be.modules.presentation.controller.RfpQuoteController;
import com.benrevo.be.modules.presentation.service.RfpQuoteService;
import com.benrevo.be.modules.presentation.util.PoiUtil;
import com.benrevo.be.modules.shared.controller.BaseControllerTest;
import com.benrevo.be.modules.shared.service.SharedRfpQuoteService;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.CreateRfpQuoteOptionNetworkDto;
import com.benrevo.common.dto.DeleteRfpQuoteOptionNetworkDto;
import com.benrevo.common.dto.MailDto;
import com.benrevo.common.dto.QuoteOptionDetailsDto;
import com.benrevo.common.dto.QuoteOptionNetworkBriefDto;
import com.benrevo.common.dto.QuoteOptionNetworkRidersDto;
import com.benrevo.common.dto.QuoteOptionPlanDetailsDto;
import com.benrevo.common.dto.QuoteOptionRidersDto;
import com.benrevo.common.dto.QuoteOptionSubmissionDto;
import com.benrevo.common.dto.RestMessageDto;
import com.benrevo.common.dto.RiderDto;
import com.benrevo.common.dto.SelectRfpQuoteOptionNetworkPlanDto;
import com.benrevo.common.dto.UpdateRfpQuoteOptionNetworkDto;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.core.AnthemCoreServiceApplication;
import com.benrevo.core.service.AnthemRfpQuoteService;
import com.benrevo.data.persistence.entities.AdministrativeFee;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientExtProduct;
import com.benrevo.data.persistence.entities.ClientPlan;
import com.benrevo.data.persistence.entities.Network;
import com.benrevo.data.persistence.entities.Plan;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteNetwork;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkCombination;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkPlan;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import com.benrevo.data.persistence.entities.RfpQuoteOptionNetwork;
import com.benrevo.data.persistence.entities.RfpQuoteSummary;
import com.benrevo.data.persistence.entities.Rider;
import com.benrevo.data.persistence.repository.ClientExtProductRepository;
import com.benrevo.data.persistence.repository.RfpQuoteNetworkCombinationRepository;
import com.benrevo.data.persistence.repository.RfpQuoteOptionNetworkRepository;
import com.benrevo.data.persistence.repository.RfpQuoteOptionRepository;
import com.benrevo.data.persistence.repository.RiderRepository;
import java.io.File;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.io.FileUtils;
import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;


@SpringBootTest(classes = AnthemCoreServiceApplication.class)
public class AnthemRfpQuoteControllerTest extends BaseControllerTest {

    @Autowired
    private RfpQuoteController controller;

    @Autowired
    private RfpQuoteOptionNetworkRepository rfpQuoteOptionNetworkRepository;

    @Autowired
    private RfpQuoteOptionRepository rfpQuoteOptionRepository;

    @Autowired
    private RfpQuoteNetworkCombinationRepository rfpQuoteNetworkCombinationRepository;

    @Autowired
    private ClientExtProductRepository clientExtProductRepository;
    
    @Autowired
    private RiderRepository riderRepository;

    @Override
    protected Object getController() {
        return controller;
    }

    @Before
    public void init() throws Auth0Exception {
        User user = new User("test");
        user.setEmail("test@domain.test");
        user.setUserMetadata( build( entry("first_name", "FirstName"), entry("last_name", "LastName") ) );

        when(mgmtAPI.users().get(anyString(), any(UserFilter.class)).execute()).thenReturn(user);
    }
    
    @Test
    public void createRfpQuoteOptionNetwork_CLEAR_VALUE_restrictions() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        RfpQuote rfpQuote =
            testEntityHelper.createTestRfpQuote(client, Constants.ANTHEM_CLEAR_VALUE_CARRIER,
                Constants.MEDICAL, QuoteType.CLEAR_VALUE
            );

        RfpQuoteNetwork hmoQuoteNetwork1 = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HMO");
        RfpQuoteNetwork hmoQuoteNetwork2 = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HMO");

        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "optionName");
        RfpQuoteOptionNetwork rqon1 =
            testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, hmoQuoteNetwork1, null, null, 1L,
                1L, 1L, 1L, Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 10f, 20f, 30f, 40f
            );

        flushAndClear();

        CreateRfpQuoteOptionNetworkDto params = new CreateRfpQuoteOptionNetworkDto();
        params.setRfpQuoteNetworkId(hmoQuoteNetwork2.getRfpQuoteNetworkId());

        String result =
            performPost(HttpStatus.INTERNAL_SERVER_ERROR, "/v1/quotes/options/{id}/addNetwork",
                params, rqo.getRfpQuoteOptionId()
            );
        RestMessageDto resp = gson.fromJson(result, RestMessageDto.class);
        assertThat(resp.isClientMessage()).isTrue();
        assertThat(resp.getMessage()).isEqualTo(
            RfpQuoteService.ANTHEM_CLEAR_VALUE_NETWORKS_RESTRICTION_COUNT);
    }

    @Test
    public void changeRfpQuoteOptionNetwork_CLEAR_VALUE_restrictions() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        RfpQuote rfpQuote =
            testEntityHelper.createTestRfpQuote(client, Constants.ANTHEM_CLEAR_VALUE_CARRIER,
                Constants.MEDICAL, QuoteType.CLEAR_VALUE
            );

        RfpQuoteNetwork rqn1 = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HMO");
        RfpQuoteNetwork rqn2 = testEntityHelper.createTestQuoteNetwork(rfpQuote, "PPO");
        RfpQuoteNetwork rqn3 = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HMO");

        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "optionName");

        RfpQuoteOptionNetwork rqon1 =
            testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, rqn1, null, null, 10L, 15L, 20L,
                25L, "PERCENT", 90f, 90f, 90f, 90f
            );
        RfpQuoteOptionNetwork rqon2 =
            testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, rqn2, null, null, 10L, 15L, 20L,
                25L, "PERCENT", 90f, 90f, 90f, 90f
            );

        flushAndClear();

        UpdateRfpQuoteOptionNetworkDto params =
            new UpdateRfpQuoteOptionNetworkDto(rqon2.getRfpQuoteOptionNetworkId(),
                rqn3.getRfpQuoteNetworkId()
            );

        flushAndClear();

        String result =
            performPut(HttpStatus.INTERNAL_SERVER_ERROR, "/v1/quotes/options/{id}/changeNetwork",
                params, rqo.getRfpQuoteOptionId()
            );
        RestMessageDto resp = gson.fromJson(result, RestMessageDto.class);
        assertThat(resp.isClientMessage()).isTrue();
        assertThat(resp.getMessage()).isEqualTo(
            RfpQuoteService.ANTHEM_CLEAR_VALUE_NETWORKS_RESTRICTION_COUNT);
    }

    @Test
    public void createRfpQuoteOptionNetwork_ANTHEM_restrictions() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());

        // check QuoteType.STANDARD restrictions

        RfpQuote rfpQuote =
            testEntityHelper.createTestRfpQuote(client, Constants.ANTHEM_CARRIER, Constants.MEDICAL,
                QuoteType.STANDARD
            );
        Carrier carrier = rfpQuote.getRfpSubmission().getRfpCarrier().getCarrier();

        Network solutionNetwork = testEntityHelper.createTestNetwork("Solution", "PPO", carrier);

        RfpQuoteNetwork hmo1 = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HMO");
        RfpQuoteNetwork hmo2 = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HMO");
        RfpQuoteNetwork hmo3 = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HMO");
        RfpQuoteNetwork ppo1 = testEntityHelper.createTestQuoteNetwork(rfpQuote, solutionNetwork);
        RfpQuoteNetwork ppo2 = testEntityHelper.createTestQuoteNetwork(rfpQuote, solutionNetwork);
        RfpQuoteNetwork ppo3 = testEntityHelper.createTestQuoteNetwork(rfpQuote, "PPO");
        RfpQuoteNetwork hsa1 = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HSA");
        RfpQuoteNetwork hsa2 = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HSA");

        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "optionName");

        RfpQuoteOptionNetwork rqon1 =
            testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, hmo1, null, null, 10L, 15L, 20L,
                25L, "DOLLAR", 90f, 90f, 90f, 90f
            );
        RfpQuoteOptionNetwork rqon2 =
            testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, hmo2, null, null, 10L, 15L, 20L,
                25L, "DOLLAR", 90f, 90f, 90f, 90f
            );
        RfpQuoteOptionNetwork rqon3 =
            testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, ppo1, null, null, 10L, 15L, 20L,
                25L, "DOLLAR", 90f, 90f, 90f, 90f
            );
        RfpQuoteOptionNetwork rqon4 =
            testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, hsa1, null, null, 10L, 15L, 20L,
                25L, "DOLLAR", 90f, 90f, 90f, 90f
            );

        flushAndClear();

        // 3rd  hmo not allowed
        CreateRfpQuoteOptionNetworkDto params = new CreateRfpQuoteOptionNetworkDto();
        params.setRfpQuoteNetworkId(hmo3.getRfpQuoteNetworkId());

        String result =
            performPost(HttpStatus.INTERNAL_SERVER_ERROR, "/v1/quotes/options/{id}/addNetwork",
                params, rqo.getRfpQuoteOptionId()
            );
        RestMessageDto resp = gson.fromJson(result, RestMessageDto.class);
        String errorMessage =
            String.format(RfpQuoteService.ANTHEM_RESTRICTION_BY_TYPE_AND_NAME, "HMO",
                hmo3.getNetwork().getName()
            );
        assertThat(resp.isClientMessage()).isTrue();
        assertThat(resp.getMessage()).isEqualTo(errorMessage);

        // 2nd hsa not allowed
        params.setRfpQuoteNetworkId(hsa2.getRfpQuoteNetworkId());

        result = performPost(HttpStatus.INTERNAL_SERVER_ERROR, "/v1/quotes/options/{id}/addNetwork",
            params, rqo.getRfpQuoteOptionId()
        );
        resp = gson.fromJson(result, RestMessageDto.class);
        errorMessage = String.format(RfpQuoteService.ANTHEM_RESTRICTION_BY_TYPE_AND_NAME, "HSA",
            hsa2.getNetwork().getName()
        );
        assertThat(resp.isClientMessage()).isTrue();
        assertThat(resp.getMessage()).isEqualTo(errorMessage);

        // only 1 Solution PPO allowed
        params.setRfpQuoteNetworkId(ppo2.getRfpQuoteNetworkId());

        result = performPost(HttpStatus.INTERNAL_SERVER_ERROR, "/v1/quotes/options/{id}/addNetwork",
            params, rqo.getRfpQuoteOptionId()
        );
        resp = gson.fromJson(result, RestMessageDto.class);
        errorMessage = String.format(RfpQuoteService.ANTHEM_RESTRICTION_BY_TYPE_AND_NAME, "PPO",
            ppo2.getNetwork().getName()
        );
        assertThat(resp.isClientMessage()).isTrue();
        assertThat(resp.getMessage()).isEqualTo(errorMessage);

        // but 2 any PPO allowed
        params.setRfpQuoteNetworkId(ppo3.getRfpQuoteNetworkId());
        result =
            performPost("/v1/quotes/options/{id}/addNetwork", params, rqo.getRfpQuoteOptionId());
    }

    @Test
    public void getQuoteOptionNetworksToAdd_CLEAR_VALUE_restrictions() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        RfpQuote rfpQuote =
            testEntityHelper.createTestRfpQuote(client, Constants.ANTHEM_CLEAR_VALUE_CARRIER,
                Constants.MEDICAL, QuoteType.CLEAR_VALUE
            );

        RfpQuoteNetwork hmoQuoteNetwork1 = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HMO");
        RfpQuoteNetwork hmoQuoteNetwork2 = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HMO");
        RfpQuoteNetwork ppoQuoteNetwork1 = testEntityHelper.createTestQuoteNetwork(rfpQuote, "PPO");
        RfpQuoteNetwork ppoQuoteNetwork2 = testEntityHelper.createTestQuoteNetwork(rfpQuote, "PPO");
        RfpQuoteNetwork hsaQuoteNetwork1 = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HSA");
        RfpQuoteNetwork hsaQuoteNetwork2 = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HSA");

        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "optionName");
        RfpQuoteOptionNetwork rqon1 =
            testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, hmoQuoteNetwork1, null, null, 1L,
                1L, 1L, 1L, Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 10f, 20f, 30f, 40f
            );
        RfpQuoteOptionNetwork rqon2 =
            testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, ppoQuoteNetwork2, null, null, 1L,
                1L, 1L, 1L, Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 10f, 20f, 30f, 40f
            );

        flushAndClear();

        String result =
            performGet("/v1/quotes/options/{id}/networks", EMPTY, rqo.getRfpQuoteOptionId());

        QuoteOptionNetworkBriefDto[] dtos =
            gson.fromJson(result, QuoteOptionNetworkBriefDto[].class);
        assertThat(dtos.length).isEqualTo(2); // 2 HSA only

        Set<Long> networks = Arrays.stream(dtos).map(n -> n.getId()).collect(Collectors.toSet());
        assertThat(networks).containsExactlyInAnyOrder(
            hsaQuoteNetwork1.getRfpQuoteNetworkId(), hsaQuoteNetwork2.getRfpQuoteNetworkId());
    }

    @Test
    public void getQuoteOptionNetworksToAdd_Group() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());

        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(client, Constants.ANTHEM_CARRIER,
            Constants.MEDICAL
        );
        Carrier carrier = rfpQuote.getRfpSubmission().getRfpCarrier().getCarrier();

        RfpQuoteNetworkCombination dualCombination =
            new RfpQuoteNetworkCombination(carrier, "Dual", 2);
        dualCombination = rfpQuoteNetworkCombinationRepository.save(dualCombination);

        Network traditionalNetwork =
            testEntityHelper.createTestNetwork("Traditional Network", "HMO", carrier);
        Network selectNetwork =
            testEntityHelper.createTestNetwork("Select Network", "HMO", carrier);

        RfpQuoteNetwork traditionalDualQuoteNetwork =
            testEntityHelper.createTestQuoteNetwork(rfpQuote, traditionalNetwork, dualCombination);
        RfpQuoteNetwork selectDualQuoteNetwork =
            testEntityHelper.createTestQuoteNetwork(rfpQuote, selectNetwork, dualCombination);

        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "optionName");

        flushAndClear();

        // test Dual Traditional Network combination

        // select one of combined networks
        RfpQuoteOptionNetwork rqon1_1 =
            testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, traditionalDualQuoteNetwork, null,
                null, 1L, 1L, 1L, 1L, Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 10f, 20f, 30f, 40f
            );
        rqon1_1.setNetworkGroup("Group1");
        rqon1_1 = rfpQuoteOptionNetworkRepository.save(rqon1_1);
        RfpQuoteOptionNetwork rqon1_2 =
            testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, traditionalDualQuoteNetwork, null,
                null, 1L, 1L, 1L, 1L, Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 10f, 20f, 30f, 40f
            );
        rqon1_2.setNetworkGroup("Group1");
        rqon1_2 = rfpQuoteOptionNetworkRepository.save(rqon1_2);

        flushAndClear();

        String result =
            performGet("/v1/quotes/options/{id}/networks", EMPTY, rqo.getRfpQuoteOptionId());

        QuoteOptionNetworkBriefDto[] dtos =
            gson.fromJson(result, QuoteOptionNetworkBriefDto[].class);
        assertThat(dtos.length).isEqualTo(1); // 1 from dual combination (selectDualQuoteNetwork)

        assertThat(dtos[0].getId()).isEqualTo(selectDualQuoteNetwork.getRfpQuoteNetworkId());
    }

    @Test
    public void getQuoteOptionNetworksToAdd() throws Exception {
        Client client = testEntityHelper.createTestClient();
        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(client, Constants.ANTHEM_CARRIER,
            Constants.MEDICAL
        );
        Carrier carrier = rfpQuote.getRfpSubmission().getRfpCarrier().getCarrier();
        Carrier kaiserCarrier =
            testEntityHelper.createTestCarrier(Constants.KAISER_CARRIER, "Kaiser");

        RfpQuoteNetworkCombination singleCombination =
            new RfpQuoteNetworkCombination(carrier, "Single", 1);
        singleCombination = rfpQuoteNetworkCombinationRepository.save(singleCombination);

        RfpQuoteNetworkCombination dualCombination =
            new RfpQuoteNetworkCombination(carrier, "Dual", 2);
        dualCombination = rfpQuoteNetworkCombinationRepository.save(dualCombination);

        RfpQuoteNetworkCombination tripleCombination =
            new RfpQuoteNetworkCombination(carrier, "Triple", 3);
        tripleCombination = rfpQuoteNetworkCombinationRepository.save(tripleCombination);

        Network kaiserNetwork =
            testEntityHelper.createTestNetwork("Kiser network", "HMO", kaiserCarrier);
        Network traditionalNetwork =
            testEntityHelper.createTestNetwork("Traditional Network", "HMO", carrier);
        Network selectNetwork =
            testEntityHelper.createTestNetwork("Select Network", "HMO", carrier);
        Network vivityNetwork =
            testEntityHelper.createTestNetwork("Vivity Network", "HMO", carrier);
        Network priorityNetwork =
            testEntityHelper.createTestNetwork("Priority Select Network", "HMO", carrier);

        Network aLaCarteNetwork =
            testEntityHelper.createTestNetwork("aLaCarte network", "PPO", carrier);

        RfpQuoteNetwork aLaCarteQuoteNetwork =
            testEntityHelper.createTestQuoteNetwork(rfpQuote, aLaCarteNetwork);
        RfpQuoteNetwork kaiserQuoteNetwork =
            testEntityHelper.createTestQuoteNetwork(rfpQuote, kaiserNetwork);

        RfpQuoteNetwork traditionalSingleQuoteNetwork =
            testEntityHelper.createTestQuoteNetwork(rfpQuote, traditionalNetwork,
                singleCombination
            );
        RfpQuoteNetwork traditionalDualQuoteNetwork =
            testEntityHelper.createTestQuoteNetwork(rfpQuote, traditionalNetwork, dualCombination);
        RfpQuoteNetwork traditionalTripleQuoteNetwork =
            testEntityHelper.createTestQuoteNetwork(rfpQuote, traditionalNetwork,
                tripleCombination
            );

        RfpQuoteNetwork selectSingleQuoteNetwork =
            testEntityHelper.createTestQuoteNetwork(rfpQuote, selectNetwork, singleCombination);
        RfpQuoteNetwork selectDualQuoteNetwork =
            testEntityHelper.createTestQuoteNetwork(rfpQuote, selectNetwork, dualCombination);

        RfpQuoteNetwork vivitySingleQuoteNetwork =
            testEntityHelper.createTestQuoteNetwork(rfpQuote, vivityNetwork, singleCombination);
        RfpQuoteNetwork vivityTripleQuoteNetwork =
            testEntityHelper.createTestQuoteNetwork(rfpQuote, vivityNetwork, tripleCombination);

        RfpQuoteNetwork priorityTripleQuoteNetwork =
            testEntityHelper.createTestQuoteNetwork(rfpQuote, priorityNetwork, tripleCombination);

        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "optionName");
        RfpQuoteOptionNetwork rqon1 =
            testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, aLaCarteQuoteNetwork, null, null,
                1L, 1L, 1L, 1L, Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 10f, 20f, 30f, 40f
            );
        RfpQuoteOptionNetwork rqon2 =
            testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, kaiserQuoteNetwork, null, null,
                1L, 1L, 1L, 1L, Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 10f, 20f, 30f, 40f
            );

        flushAndClear();

        // test Kaiser filtering and Single combination selected

        token = createToken(client.getBroker().getBrokerToken());
        String result =
            performGet("/v1/quotes/options/{id}/networks", EMPTY, rqo.getRfpQuoteOptionId());

        QuoteOptionNetworkBriefDto[] dtos =
            gson.fromJson(result, QuoteOptionNetworkBriefDto[].class);
        // 1 aLaCarte + 3 from single combination (traditionalSingleQuoteNetwork, selectSingleQuoteNetwork, vivitySingleQuoteNetwork)
        assertThat(dtos.length).isEqualTo(4);

        Set<Long> networks = Arrays.stream(dtos).map(n -> n.getId()).collect(Collectors.toSet());
        assertThat(networks).containsExactlyInAnyOrder(aLaCarteQuoteNetwork.getRfpQuoteNetworkId(),
            traditionalSingleQuoteNetwork.getRfpQuoteNetworkId(),
            selectSingleQuoteNetwork.getRfpQuoteNetworkId(),
            vivitySingleQuoteNetwork.getRfpQuoteNetworkId()
        );

        // test Dual Traditional Network combination

        // select one of combined networks
        RfpQuoteOptionNetwork rqon3 =
            testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, traditionalDualQuoteNetwork, null,
                null, 1L, 1L, 1L, 1L, Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 10f, 20f, 30f, 40f
            );

        flushAndClear();

        result = performGet("/v1/quotes/options/{id}/networks", EMPTY, rqo.getRfpQuoteOptionId());

        dtos = gson.fromJson(result, QuoteOptionNetworkBriefDto[].class);
        assertThat(dtos.length).isEqualTo(
            2); // 1 aLaCarte + 1 from dual combination (selectDualQuoteNetwork)

        networks = Arrays.stream(dtos).map(n -> n.getId()).collect(Collectors.toSet());
        assertThat(networks).containsExactlyInAnyOrder(
            aLaCarteQuoteNetwork.getRfpQuoteNetworkId(),
            selectDualQuoteNetwork.getRfpQuoteNetworkId()
        );

        // test Triple Network combination

        // select one of combined networks
        rfpQuoteOptionNetworkRepository.delete(rqon3);
        RfpQuoteOptionNetwork rqon4 =
            testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, traditionalTripleQuoteNetwork,
                null, null, 1L, 1L, 1L, 1L, Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 10f, 20f, 30f,
                40f
            );
        RfpQuoteOptionNetwork rqon5 =
            testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, vivityTripleQuoteNetwork, null,
                null, 1L, 1L, 1L, 1L, Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 10f, 20f, 30f, 40f
            );

        flushAndClear();

        result = performGet("/v1/quotes/options/{id}/networks", EMPTY, rqo.getRfpQuoteOptionId());

        dtos = gson.fromJson(result, QuoteOptionNetworkBriefDto[].class);
        assertThat(dtos.length).isEqualTo(
            2); // 1 aLaCarte + 1 from triple combination (priorityTripleQuoteNetwork)

        networks = Arrays.stream(dtos).map(n -> n.getId()).collect(Collectors.toSet());
        assertThat(networks).containsExactlyInAnyOrder(
            aLaCarteQuoteNetwork.getRfpQuoteNetworkId(),
            priorityTripleQuoteNetwork.getRfpQuoteNetworkId()
        );
    }

    @Test
    public void getQuoteOptionNetworksToAdd_HighLowHMO() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());

        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(client, Constants.ANTHEM_CARRIER,
            Constants.MEDICAL
        );
        Carrier carrier = rfpQuote.getRfpSubmission().getRfpCarrier().getCarrier();

        RfpQuoteNetworkCombination singleCombination =
            new RfpQuoteNetworkCombination(carrier, "Single", 1);
        singleCombination = rfpQuoteNetworkCombinationRepository.save(singleCombination);

        RfpQuoteNetworkCombination dualCombination =
            new RfpQuoteNetworkCombination(carrier, "Dual HMO Traditional", 2);
        dualCombination = rfpQuoteNetworkCombinationRepository.save(dualCombination);

        Network aLaCarteNetwork =
            testEntityHelper.createTestNetwork("aLaCarte network", "HMO", carrier);
        RfpQuoteNetwork aLaCarteQuoteNetwork =
            testEntityHelper.createTestQuoteNetwork(rfpQuote, aLaCarteNetwork);

        Network traditionalNetwork =
            testEntityHelper.createTestNetwork("Traditional Network", "HMO", carrier);
        RfpQuoteNetwork traditionalSingleQuoteNetwork =
            testEntityHelper.createTestQuoteNetwork(rfpQuote, traditionalNetwork,
                singleCombination
            );
        RfpQuoteNetwork traditionalDualQuoteNetwork =
            testEntityHelper.createTestQuoteNetwork(rfpQuote, traditionalNetwork, dualCombination);

        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "optionName");
        RfpQuoteOptionNetwork rqon1 =
            testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, aLaCarteQuoteNetwork, null, null,
                1L, 1L, 1L, 1L, Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 10f, 20f, 30f, 40f
            );

        flushAndClear();

        // test aLaCarte network selected and Single Combination avaliable

        String result =
            performGet("/v1/quotes/options/{id}/networks", EMPTY, rqo.getRfpQuoteOptionId());

        QuoteOptionNetworkBriefDto[] dtos =
            gson.fromJson(result, QuoteOptionNetworkBriefDto[].class);
        // 1 aLaCarte + 1 from single combination (traditionalSingleQuoteNetwork)
        assertThat(dtos.length).isEqualTo(2);

        Set<Long> networks = Arrays.stream(dtos).map(n -> n.getId()).collect(Collectors.toSet());
        assertThat(networks).containsExactlyInAnyOrder(
            aLaCarteQuoteNetwork.getRfpQuoteNetworkId(),
            traditionalSingleQuoteNetwork.getRfpQuoteNetworkId()
        );

        // select one from Single Combination networks
        RfpQuoteOptionNetwork rqon2 =
            testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, traditionalSingleQuoteNetwork,
                null, null, 1L, 1L, 1L, 1L, Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 10f, 20f, 30f,
                40f
            );

        // test Dual Traditional Network combination avaliable

        flushAndClear();

        result = performGet("/v1/quotes/options/{id}/networks", EMPTY, rqo.getRfpQuoteOptionId());

        dtos = gson.fromJson(result, QuoteOptionNetworkBriefDto[].class);
        assertThat(dtos.length).isEqualTo(
            2); // 1 aLaCarte + 1 from dual combination (selectDualQuoteNetwork)

        networks = Arrays.stream(dtos).map(n -> n.getId()).collect(Collectors.toSet());
        assertThat(networks).containsExactlyInAnyOrder(aLaCarteQuoteNetwork.getRfpQuoteNetworkId(),
            traditionalDualQuoteNetwork.getRfpQuoteNetworkId()
        );

        // select two of combined networks
        rfpQuoteOptionNetworkRepository.delete(rqon2);
        RfpQuoteOptionNetwork rqon3 =
            testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, traditionalDualQuoteNetwork, null,
                null, 1L, 1L, 1L, 1L, Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 10f, 20f, 30f, 40f
            );
        RfpQuoteOptionNetwork rqon4 =
            testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, traditionalDualQuoteNetwork, null,
                null, 1L, 1L, 1L, 1L, Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 10f, 20f, 30f, 40f
            );

        // test No combined Networks avaliable

        flushAndClear();

        result = performGet("/v1/quotes/options/{id}/networks", EMPTY, rqo.getRfpQuoteOptionId());

        dtos = gson.fromJson(result, QuoteOptionNetworkBriefDto[].class);
        assertThat(dtos.length).isEqualTo(1); // 1 aLaCarte

        networks = Arrays.stream(dtos).map(n -> n.getId()).collect(Collectors.toSet());
        assertThat(networks).containsExactlyInAnyOrder(aLaCarteQuoteNetwork.getRfpQuoteNetworkId());
    }

    @Test
    public void getQuoteOptionNetworksToAdd_HighLowPPO() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());

        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(client, Constants.ANTHEM_CARRIER,
            Constants.MEDICAL
        );
        Carrier carrier = rfpQuote.getRfpSubmission().getRfpCarrier().getCarrier();

        RfpQuoteNetworkCombination singleCombination =
            new RfpQuoteNetworkCombination(carrier, "Single", 1);
        singleCombination = rfpQuoteNetworkCombinationRepository.save(singleCombination);

        RfpQuoteNetworkCombination dualCombination =
            new RfpQuoteNetworkCombination(carrier, "Dual HMO Traditional", 2);
        dualCombination = rfpQuoteNetworkCombinationRepository.save(dualCombination);

        Network ppoNetwork = testEntityHelper.createTestNetwork("PPO Network", "PPO", carrier);
        RfpQuoteNetwork ppoPremierQuoteNetwork =
            testEntityHelper.createTestQuoteNetwork(rfpQuote, ppoNetwork, dualCombination);
        RfpQuoteNetwork ppoNonPremierQuoteNetwork =
            testEntityHelper.createTestQuoteNetwork(rfpQuote, ppoNetwork, dualCombination);

        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "optionName");
        RfpQuoteOptionNetwork rqon1 =
            testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, ppoPremierQuoteNetwork, null,
                null, 1L, 1L, 1L, 1L, Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 10f, 20f, 30f, 40f
            );

        flushAndClear();

        // test Non-Premier networks avaliable

        String result =
            performGet("/v1/quotes/options/{id}/networks", EMPTY, rqo.getRfpQuoteOptionId());

        QuoteOptionNetworkBriefDto[] dtos =
            gson.fromJson(result, QuoteOptionNetworkBriefDto[].class);
        assertThat(dtos.length).isEqualTo(2); // 2 from dual combination (ppoNonPremierQuoteNetwork)

        Set<Long> networks = Arrays.stream(dtos).map(n -> n.getId()).collect(Collectors.toSet());
        assertThat(networks).containsExactlyInAnyOrder(
            ppoPremierQuoteNetwork.getRfpQuoteNetworkId(),
            ppoNonPremierQuoteNetwork.getRfpQuoteNetworkId()
        );

        // select second network from Dual combination
        RfpQuoteOptionNetwork rqon2 =
            testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, ppoNonPremierQuoteNetwork, null,
                null, 1L, 1L, 1L, 1L, Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 10f, 20f, 30f, 40f
            );

        flushAndClear();

        // test No combined Networks avaliable

        result = performGet("/v1/quotes/options/{id}/networks", EMPTY, rqo.getRfpQuoteOptionId());

        dtos = gson.fromJson(result, QuoteOptionNetworkBriefDto[].class);
        assertThat(dtos).isEmpty();
    }

    @Test
    public void createRfpQuoteOptionNetwork() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        ClientPlan cp1 =
            testEntityHelper.createTestClientPlan("client plan", client, "BLUE_SHIELD", "HMO");
        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(client, Constants.ANTHEM_CARRIER,
            Constants.MEDICAL
        );
        Carrier carrier = rfpQuote.getRfpSubmission().getRfpCarrier().getCarrier();

        Network traditionalNetwork =
            testEntityHelper.createTestNetwork("Traditional Network", "HMO", carrier);
        Network selectNetwork =
            testEntityHelper.createTestNetwork("Select Network", "HMO", carrier);
        Network vivityNetwork =
            testEntityHelper.createTestNetwork("Vivity Network", "HMO", carrier);
        Network aLaCarteNetwork =
            testEntityHelper.createTestNetwork("aLaCarte network", "PPO", carrier);

        RfpQuoteNetworkCombination singleCombination =
            new RfpQuoteNetworkCombination(carrier, "Single", 1);
        singleCombination = rfpQuoteNetworkCombinationRepository.save(singleCombination);

        RfpQuoteNetworkCombination dualCombination =
            new RfpQuoteNetworkCombination(carrier, "Dual", 2);
        dualCombination = rfpQuoteNetworkCombinationRepository.save(dualCombination);

        RfpQuoteNetworkCombination tripleCombination =
            new RfpQuoteNetworkCombination(carrier, "Triple", 3);
        tripleCombination = rfpQuoteNetworkCombinationRepository.save(tripleCombination);

        RfpQuoteNetwork traditionalSingleQuoteNetwork =
            testEntityHelper.createTestQuoteNetwork(rfpQuote, traditionalNetwork,
                singleCombination
            );
        RfpQuoteNetwork traditionalDualQuoteNetwork =
            testEntityHelper.createTestQuoteNetwork(rfpQuote, traditionalNetwork, dualCombination);
        RfpQuoteNetwork traditionalTripleQuoteNetwork =
            testEntityHelper.createTestQuoteNetwork(rfpQuote, traditionalNetwork,
                tripleCombination
            );

        RfpQuoteNetwork selectDualQuoteNetwork =
            testEntityHelper.createTestQuoteNetwork(rfpQuote, selectNetwork, dualCombination);
        RfpQuoteNetwork selectTripleQuoteNetwork =
            testEntityHelper.createTestQuoteNetwork(rfpQuote, selectNetwork, tripleCombination);

        RfpQuoteNetwork vivityTripleQuoteNetwork =
            testEntityHelper.createTestQuoteNetwork(rfpQuote, vivityNetwork, tripleCombination);

        RfpQuoteNetwork aLaCarteQuoteNetwork =
            testEntityHelper.createTestQuoteNetwork(rfpQuote, aLaCarteNetwork);

        Plan testPlan = testEntityHelper.createTestPlan(
            rfpQuote.getRfpSubmission().getRfpCarrier().getCarrier());
        Plan testRxPlan = testEntityHelper.createTestPlan(
            rfpQuote.getRfpSubmission().getRfpCarrier().getCarrier());
        PlanNameByNetwork selectedPnn =
            testEntityHelper.createTestPlanNameByNetwork(testPlan, traditionalNetwork);
        PlanNameByNetwork selectedRxPnn =
            testEntityHelper.createTestPlanNameByNetwork(testRxPlan, traditionalNetwork);

        RfpQuoteNetworkPlan singleTraditionalPlan =
            testEntityHelper.createTestRfpQuoteNetworkPlan(selectedPnn,
                traditionalSingleQuoteNetwork, 100f, 120f, 140f, 160f
            );
        RfpQuoteNetworkPlan singleTraditionalRxPlan =
            testEntityHelper.createTestRfpQuoteNetworkPlan(selectedRxPnn,
                traditionalSingleQuoteNetwork, 100f, 120f, 140f, 160f
            );
        RfpQuoteNetworkPlan dualTraditionalPlan =
            testEntityHelper.createTestRfpQuoteNetworkPlan(selectedPnn, traditionalDualQuoteNetwork,
                100f, 120f, 140f, 160f
            );
        RfpQuoteNetworkPlan dualTraditionalRxPlan =
            testEntityHelper.createTestRfpQuoteNetworkPlan(selectedRxPnn,
                traditionalDualQuoteNetwork, 100f, 120f, 140f, 160f
            );
        RfpQuoteNetworkPlan dualSelectPlan =
            testEntityHelper.createTestRfpQuoteNetworkPlan(selectedPnn, selectDualQuoteNetwork,
                100f, 120f, 140f, 160f
            );
        RfpQuoteNetworkPlan dualSelectRxPlan =
            testEntityHelper.createTestRfpQuoteNetworkPlan(selectedRxPnn, selectDualQuoteNetwork,
                100f, 120f, 140f, 160f
            );
        RfpQuoteNetworkPlan tripleTraditionalPlan =
            testEntityHelper.createTestRfpQuoteNetworkPlan(selectedPnn,
                traditionalTripleQuoteNetwork, 100f, 120f, 140f, 160f
            );
        RfpQuoteNetworkPlan tripleTraditionalRxPlan =
            testEntityHelper.createTestRfpQuoteNetworkPlan(selectedRxPnn,
                traditionalTripleQuoteNetwork, 100f, 120f, 140f, 160f
            );
        RfpQuoteNetworkPlan tripleSelectPlan =
            testEntityHelper.createTestRfpQuoteNetworkPlan(selectedPnn, selectTripleQuoteNetwork,
                100f, 120f, 140f, 160f
            );
        RfpQuoteNetworkPlan tripleSelectRxPlan =
            testEntityHelper.createTestRfpQuoteNetworkPlan(selectedRxPnn, selectTripleQuoteNetwork,
                100f, 120f, 140f, 160f
            );

        RfpQuoteOption option = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "optionName");
        RfpQuoteOptionNetwork rqon1 =
            testEntityHelper.createTestRfpQuoteOptionNetwork(option, traditionalSingleQuoteNetwork,
                singleTraditionalPlan, cp1, 10L, 15L, 20L, 25L, "DOALLAR", 90f, 90f, 90f, 90f
            );
        rqon1.setSelectedRfpQuoteNetworkRxPlan(singleTraditionalRxPlan);
        rqon1 = rfpQuoteOptionNetworkRepository.save(rqon1);

        RfpQuoteOptionNetwork rqon3 =
            testEntityHelper.createTestRfpQuoteOptionNetwork(option, aLaCarteQuoteNetwork, null,
                null, 10L, 15L, 20L, 25L, "DOALLAR", 90f, 90f, 90f, 90f
            );
        rqon3 = rfpQuoteOptionNetworkRepository.save(rqon3);

        flushAndClear();

        // create new option network for Dual combination

        CreateRfpQuoteOptionNetworkDto params =
            new CreateRfpQuoteOptionNetworkDto(selectDualQuoteNetwork.getRfpQuoteNetworkId());
        String result =
            performPost("/v1/quotes/options/{id}/addNetwork", params, option.getRfpQuoteOptionId());

        assertThat(result).isNotEmpty();
        Long selectNetworkRfpQuoteOptionNetworkId = Long.parseLong(result);

        // set selected plan for created network
        RfpQuoteOptionNetwork rqon2 =
            rfpQuoteOptionNetworkRepository.findOne(selectNetworkRfpQuoteOptionNetworkId);

        rqon2.setSelectedRfpQuoteNetworkPlan(dualSelectPlan);
        rqon2.setSelectedRfpQuoteNetworkRxPlan(dualSelectRxPlan);
        rqon2 = rfpQuoteOptionNetworkRepository.save(rqon2);

        flushAndClear();

        option = rfpQuoteOptionRepository.findOne(option.getRfpQuoteOptionId());

        assertThat(option.getRfpQuoteOptionNetworks()).hasSize(3);
        for(RfpQuoteOptionNetwork optNetwork : option.getRfpQuoteOptionNetworks()) {
            if(optNetwork.getRfpQuoteOptionNetworkId().equals(rqon1.getRfpQuoteOptionNetworkId())) {
                // single Traditional should be replaced by dual Traditional
                assertThat(optNetwork.getRfpQuoteNetwork().getRfpQuoteNetworkId()).isEqualTo(
                    traditionalDualQuoteNetwork.getRfpQuoteNetworkId());
                // check replaced selected plans and rx
                assertThat(optNetwork.getSelectedRfpQuoteNetworkPlan()
                    .getRfpQuoteNetworkPlanId()).isEqualTo(
                    dualTraditionalPlan.getRfpQuoteNetworkPlanId());
                assertThat(optNetwork.getSelectedRfpQuoteNetworkRxPlan().getRfpQuoteNetworkPlanId())
                    .isEqualTo(dualTraditionalRxPlan.getRfpQuoteNetworkPlanId());
            } else if(optNetwork.getRfpQuoteOptionNetworkId()
                .equals(rqon2.getRfpQuoteOptionNetworkId())) {
                assertThat(optNetwork.getRfpQuoteNetwork().getRfpQuoteNetworkId()).isEqualTo(
                    selectDualQuoteNetwork.getRfpQuoteNetworkId());
            } else {
                assertThat(optNetwork.getRfpQuoteNetwork().getRfpQuoteNetworkId()).isEqualTo(
                    aLaCarteQuoteNetwork.getRfpQuoteNetworkId());
            }
        }

        // create new option network for Triple combination

        params.setRfpQuoteNetworkId(vivityTripleQuoteNetwork.getRfpQuoteNetworkId());
        result =
            performPost("/v1/quotes/options/{id}/addNetwork", params, option.getRfpQuoteOptionId());

        flushAndClear();

        option = rfpQuoteOptionRepository.findOne(option.getRfpQuoteOptionId());

        assertThat(option.getRfpQuoteOptionNetworks()).hasSize(4);
        for(RfpQuoteOptionNetwork optNetwork : option.getRfpQuoteOptionNetworks()) {
            if(optNetwork.getRfpQuoteOptionNetworkId().equals(rqon1.getRfpQuoteOptionNetworkId())) {
                // dual Traditional should be replaced by triple Traditional
                assertThat(optNetwork.getRfpQuoteNetwork().getRfpQuoteNetworkId()).isEqualTo(
                    traditionalTripleQuoteNetwork.getRfpQuoteNetworkId());
                // check replaced selected plans and rx
                assertThat(optNetwork.getSelectedRfpQuoteNetworkPlan()
                    .getRfpQuoteNetworkPlanId()).isEqualTo(
                    tripleTraditionalPlan.getRfpQuoteNetworkPlanId());
                assertThat(optNetwork.getSelectedRfpQuoteNetworkRxPlan().getRfpQuoteNetworkPlanId())
                    .isEqualTo(tripleTraditionalRxPlan.getRfpQuoteNetworkPlanId());
            } else if(optNetwork.getRfpQuoteOptionNetworkId()
                .equals(selectNetworkRfpQuoteOptionNetworkId)) {
                // dual Select should be replaced by triple Select
                assertThat(optNetwork.getRfpQuoteNetwork().getRfpQuoteNetworkId()).isEqualTo(
                    selectTripleQuoteNetwork.getRfpQuoteNetworkId());
                // check replaced selected plans and rx
                assertThat(optNetwork.getSelectedRfpQuoteNetworkPlan()
                    .getRfpQuoteNetworkPlanId()).isEqualTo(
                    tripleSelectPlan.getRfpQuoteNetworkPlanId());
                assertThat(optNetwork.getSelectedRfpQuoteNetworkRxPlan().getRfpQuoteNetworkPlanId())
                    .isEqualTo(tripleSelectRxPlan.getRfpQuoteNetworkPlanId());
            } else if(optNetwork.getRfpQuoteOptionNetworkId()
                .equals(rqon3.getRfpQuoteOptionNetworkId())) {
                assertThat(optNetwork.getRfpQuoteNetwork().getRfpQuoteNetworkId()).isEqualTo(
                    aLaCarteQuoteNetwork.getRfpQuoteNetworkId());
            } else { // vivity network
                assertThat(optNetwork.getRfpQuoteNetwork().getRfpQuoteNetworkId()).isEqualTo(
                    vivityTripleQuoteNetwork.getRfpQuoteNetworkId());
            }
        }

        // read option with added networks

        result = performGet("/v1/quotes/options/{id}", EMPTY, option.getRfpQuoteOptionId());

        QuoteOptionDetailsDto dto = gson.fromJson(result, QuoteOptionDetailsDto.class);

        assertThat(dto.getDetailedPlans()).hasSize(4);

        for(QuoteOptionPlanDetailsDto detail : dto.getDetailedPlans()) {
            if(detail.getRfpQuoteOptionNetworkId().equals(rqon1.getRfpQuoteOptionNetworkId())) {
                // current and updated triple combination plans
                assertThat(detail.getNetworkName()).isEqualTo(traditionalNetwork.getName());
                assertThat(detail.getCurrentPlan().getName()).isEqualTo(cp1.getPnn().getName());
                assertThat(detail.getNewPlan().getName()).isEqualTo(
                    tripleTraditionalPlan.getPnn().getName());
            } else if(detail.getRfpQuoteOptionNetworkId()
                .equals(selectNetworkRfpQuoteOptionNetworkId)) {
                // updated triple combination plans but missing client plan
                assertThat(detail.getNetworkName()).isEqualTo(selectNetwork.getName());
                assertThat(detail.getCurrentPlan()).isNull();
                assertThat(detail.getNewPlan().getName()).isEqualTo(
                    tripleSelectPlan.getPnn().getName());
            } else if(detail.getRfpQuoteOptionNetworkId()
                .equals(rqon3.getRfpQuoteOptionNetworkId())) {
                // added network but not selected plan
                assertThat(detail.getNetworkName()).isEqualTo(aLaCarteNetwork.getName());
                assertThat(detail.getCurrentPlan()).isNull();
                assertThat(detail.getNewPlan()).isNull();
            } else {
                // added network but not selected plan
                assertThat(detail.getNetworkName()).isEqualTo(vivityNetwork.getName());
                assertThat(detail.getCurrentPlan()).isNull();
                assertThat(detail.getNewPlan()).isNull();
            }
        }
    }

    @Test
    public void deleteRfpQuoteOptionNetwork() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());

        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(client, Constants.ANTHEM_CARRIER,
            Constants.MEDICAL
        );
        Carrier carrier = rfpQuote.getRfpSubmission().getRfpCarrier().getCarrier();

        Network traditionalNetwork =
            testEntityHelper.createTestNetwork("Traditional Network", "HMO", carrier);
        Network selectNetwork =
            testEntityHelper.createTestNetwork("Select Network", "HMO", carrier);
        Network vivityNetwork =
            testEntityHelper.createTestNetwork("Vivity Network", "HMO", carrier);
        Network aLaCarteNetwork =
            testEntityHelper.createTestNetwork("aLaCarte network", "PPO", carrier);

        // duplicates to emulate real case from dev db
        RfpQuoteNetworkCombination singleCombination1 =
            new RfpQuoteNetworkCombination(carrier, "Single duplicate 1", 1);
        singleCombination1 = rfpQuoteNetworkCombinationRepository.save(singleCombination1);
        RfpQuoteNetworkCombination singleCombination2 =
            new RfpQuoteNetworkCombination(carrier, "Single duplicate 2", 1);
        singleCombination2 = rfpQuoteNetworkCombinationRepository.save(singleCombination2);
        RfpQuoteNetworkCombination singleCombination =
            new RfpQuoteNetworkCombination(carrier, "Single", 1);
        singleCombination = rfpQuoteNetworkCombinationRepository.save(singleCombination);

        RfpQuoteNetworkCombination dualCombination =
            new RfpQuoteNetworkCombination(carrier, "Dual", 2);
        dualCombination = rfpQuoteNetworkCombinationRepository.save(dualCombination);

        RfpQuoteNetworkCombination tripleCombination =
            new RfpQuoteNetworkCombination(carrier, "Triple", 3);
        tripleCombination = rfpQuoteNetworkCombinationRepository.save(tripleCombination);

        RfpQuoteNetwork traditionalSingleQuoteNetwork =
            testEntityHelper.createTestQuoteNetwork(rfpQuote, traditionalNetwork,
                singleCombination
            );
        RfpQuoteNetwork traditionalDualQuoteNetwork =
            testEntityHelper.createTestQuoteNetwork(rfpQuote, traditionalNetwork, dualCombination);
        RfpQuoteNetwork traditionalTripleQuoteNetwork =
            testEntityHelper.createTestQuoteNetwork(rfpQuote, traditionalNetwork,
                tripleCombination
            );

        RfpQuoteNetwork selectDualQuoteNetwork =
            testEntityHelper.createTestQuoteNetwork(rfpQuote, selectNetwork, dualCombination);
        RfpQuoteNetwork selectTripleQuoteNetwork =
            testEntityHelper.createTestQuoteNetwork(rfpQuote, selectNetwork, tripleCombination);

        RfpQuoteNetwork vivityTripleQuoteNetwork =
            testEntityHelper.createTestQuoteNetwork(rfpQuote, vivityNetwork, tripleCombination);

        RfpQuoteNetwork aLaCarteQuoteNetwork =
            testEntityHelper.createTestQuoteNetwork(rfpQuote, aLaCarteNetwork);

        Plan testPlan = testEntityHelper.createTestPlan(
            rfpQuote.getRfpSubmission().getRfpCarrier().getCarrier());
        Plan testRxPlan = testEntityHelper.createTestPlan(
            rfpQuote.getRfpSubmission().getRfpCarrier().getCarrier());
        PlanNameByNetwork selectedPnn =
            testEntityHelper.createTestPlanNameByNetwork(testPlan, traditionalNetwork);
        PlanNameByNetwork selectedRxPnn =
            testEntityHelper.createTestPlanNameByNetwork(testRxPlan, traditionalNetwork);

        RfpQuoteNetworkPlan singleTraditionalPlan =
            testEntityHelper.createTestRfpQuoteNetworkPlan(selectedPnn,
                traditionalSingleQuoteNetwork, 100f, 120f, 140f, 160f
            );
        RfpQuoteNetworkPlan singleTraditionalRxPlan =
            testEntityHelper.createTestRfpQuoteNetworkPlan(selectedRxPnn,
                traditionalSingleQuoteNetwork, 100f, 120f, 140f, 160f
            );
        RfpQuoteNetworkPlan dualTraditionalPlan =
            testEntityHelper.createTestRfpQuoteNetworkPlan(selectedPnn, traditionalDualQuoteNetwork,
                100f, 120f, 140f, 160f
            );
        RfpQuoteNetworkPlan dualTraditionalRxPlan =
            testEntityHelper.createTestRfpQuoteNetworkPlan(selectedRxPnn,
                traditionalDualQuoteNetwork, 100f, 120f, 140f, 160f
            );
        RfpQuoteNetworkPlan dualSelectPlan =
            testEntityHelper.createTestRfpQuoteNetworkPlan(selectedPnn, selectDualQuoteNetwork,
                100f, 120f, 140f, 160f
            );
        RfpQuoteNetworkPlan dualSelectRxPlan =
            testEntityHelper.createTestRfpQuoteNetworkPlan(selectedRxPnn, selectDualQuoteNetwork,
                100f, 120f, 140f, 160f
            );
        RfpQuoteNetworkPlan tripleTraditionalPlan =
            testEntityHelper.createTestRfpQuoteNetworkPlan(selectedPnn,
                traditionalTripleQuoteNetwork, 100f, 120f, 140f, 160f
            );
        RfpQuoteNetworkPlan tripleTraditionalRxPlan =
            testEntityHelper.createTestRfpQuoteNetworkPlan(selectedRxPnn,
                traditionalTripleQuoteNetwork, 100f, 120f, 140f, 160f
            );
        RfpQuoteNetworkPlan tripleSelectPlan =
            testEntityHelper.createTestRfpQuoteNetworkPlan(selectedPnn, selectTripleQuoteNetwork,
                100f, 120f, 140f, 160f
            );
        RfpQuoteNetworkPlan tripleSelectRxPlan =
            testEntityHelper.createTestRfpQuoteNetworkPlan(selectedRxPnn, selectTripleQuoteNetwork,
                100f, 120f, 140f, 160f
            );
        RfpQuoteNetworkPlan tripleVivityPlan =
            testEntityHelper.createTestRfpQuoteNetworkPlan(selectedPnn, vivityTripleQuoteNetwork,
                100f, 120f, 140f, 160f
            );
        RfpQuoteNetworkPlan tripleVivityRxPlan =
            testEntityHelper.createTestRfpQuoteNetworkPlan(selectedRxPnn, vivityTripleQuoteNetwork,
                100f, 120f, 140f, 160f
            );

        RfpQuoteOption option = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "optionName");
        RfpQuoteOptionNetwork rqon1 =
            testEntityHelper.createTestRfpQuoteOptionNetwork(option, traditionalTripleQuoteNetwork,
                tripleTraditionalPlan, null, 10L, 15L, 20L, 25L, "DOALLAR", 90f, 90f, 90f, 90f
            );
        rqon1.setSelectedRfpQuoteNetworkRxPlan(tripleTraditionalRxPlan);
        rqon1 = rfpQuoteOptionNetworkRepository.save(rqon1);

        RfpQuoteOptionNetwork rqon2 =
            testEntityHelper.createTestRfpQuoteOptionNetwork(option, selectTripleQuoteNetwork,
                tripleSelectPlan, null, 10L, 15L, 20L, 25L, "DOALLAR", 90f, 90f, 90f, 90f
            );
        rqon2.setSelectedRfpQuoteNetworkRxPlan(tripleSelectRxPlan);
        rqon2 = rfpQuoteOptionNetworkRepository.save(rqon2);

        RfpQuoteOptionNetwork rqon3 =
            testEntityHelper.createTestRfpQuoteOptionNetwork(option, vivityTripleQuoteNetwork,
                tripleVivityPlan, null, 10L, 15L, 20L, 25L, "DOALLAR", 90f, 90f, 90f, 90f
            );
        rqon3.setSelectedRfpQuoteNetworkRxPlan(tripleVivityRxPlan);
        rqon3 = rfpQuoteOptionNetworkRepository.save(rqon3);

        RfpQuoteOptionNetwork rqon4 =
            testEntityHelper.createTestRfpQuoteOptionNetwork(option, aLaCarteQuoteNetwork, null,
                null, 10L, 15L, 20L, 25L, "DOALLAR", 90f, 90f, 90f, 90f
            );
        rqon4 = rfpQuoteOptionNetworkRepository.save(rqon4);

        flushAndClear();

        // check updating to Dual combination after deleting Vivity Network

        DeleteRfpQuoteOptionNetworkDto params = new DeleteRfpQuoteOptionNetworkDto();
        params.setRfpQuoteOptionNetworkId(rqon3.getRfpQuoteOptionNetworkId());

        String result = performDelete("/v1/quotes/options/deleteNetwork", params);

        flushAndClear();

        option = rfpQuoteOptionRepository.findOne(option.getRfpQuoteOptionId());

        assertThat(option.getRfpQuoteOptionNetworks()).hasSize(3);
        for(RfpQuoteOptionNetwork optNetwork : option.getRfpQuoteOptionNetworks()) {
            if(optNetwork.getRfpQuoteOptionNetworkId().equals(rqon1.getRfpQuoteOptionNetworkId())) {
                // triple Traditional should be replaced by dual Traditional
                assertThat(optNetwork.getRfpQuoteNetwork().getRfpQuoteNetworkId()).isEqualTo(
                    traditionalDualQuoteNetwork.getRfpQuoteNetworkId());
                // check replaced selected plans and rx
                assertThat(optNetwork.getSelectedRfpQuoteNetworkPlan()
                    .getRfpQuoteNetworkPlanId()).isEqualTo(
                    dualTraditionalPlan.getRfpQuoteNetworkPlanId());
                assertThat(optNetwork.getSelectedRfpQuoteNetworkRxPlan().getRfpQuoteNetworkPlanId())
                    .isEqualTo(dualTraditionalRxPlan.getRfpQuoteNetworkPlanId());
            } else if(optNetwork.getRfpQuoteOptionNetworkId()
                .equals(rqon2.getRfpQuoteOptionNetworkId())) {
                // triple Select should be replaced by dual Select
                assertThat(optNetwork.getRfpQuoteNetwork().getRfpQuoteNetworkId()).isEqualTo(
                    selectDualQuoteNetwork.getRfpQuoteNetworkId());
                // check replaced selected plans and rx
                assertThat(optNetwork.getSelectedRfpQuoteNetworkPlan()
                    .getRfpQuoteNetworkPlanId()).isEqualTo(
                    dualSelectPlan.getRfpQuoteNetworkPlanId());
                assertThat(optNetwork.getSelectedRfpQuoteNetworkRxPlan().getRfpQuoteNetworkPlanId())
                    .isEqualTo(dualSelectRxPlan.getRfpQuoteNetworkPlanId());
            } else {
                // aLaCarde should not updated
                assertThat(optNetwork.getRfpQuoteNetwork().getRfpQuoteNetworkId()).isEqualTo(
                    aLaCarteQuoteNetwork.getRfpQuoteNetworkId());
            }
        }

        // check updating to Single combination after deleting Select Network

        params.setRfpQuoteOptionNetworkId(rqon2.getRfpQuoteOptionNetworkId());
        result = performDelete("/v1/quotes/options/deleteNetwork", params);

        flushAndClear();

        option = rfpQuoteOptionRepository.findOne(option.getRfpQuoteOptionId());

        assertThat(option.getRfpQuoteOptionNetworks()).hasSize(2);
        for(RfpQuoteOptionNetwork optNetwork : option.getRfpQuoteOptionNetworks()) {
            if(optNetwork.getRfpQuoteOptionNetworkId().equals(rqon1.getRfpQuoteOptionNetworkId())) {
                assertThat(optNetwork.getRfpQuoteOptionNetworkId()).isEqualTo(
                    rqon1.getRfpQuoteOptionNetworkId());
                // dual Traditional should be replaced by single Traditional
                assertThat(optNetwork.getRfpQuoteNetwork().getRfpQuoteNetworkId()).isEqualTo(
                    traditionalSingleQuoteNetwork.getRfpQuoteNetworkId());
                // check replaced selected plans and rx
                assertThat(optNetwork.getSelectedRfpQuoteNetworkPlan()
                    .getRfpQuoteNetworkPlanId()).isEqualTo(
                    singleTraditionalPlan.getRfpQuoteNetworkPlanId());
                assertThat(optNetwork.getSelectedRfpQuoteNetworkRxPlan().getRfpQuoteNetworkPlanId())
                    .isEqualTo(singleTraditionalRxPlan.getRfpQuoteNetworkPlanId());
            } else {
                // aLaCarde should not updated
                assertThat(optNetwork.getRfpQuoteNetwork().getRfpQuoteNetworkId()).isEqualTo(
                    aLaCarteQuoteNetwork.getRfpQuoteNetworkId());
            }
        }

        // check NOT updating aLaCarte after deleting Traditional Network

        params.setRfpQuoteOptionNetworkId(rqon1.getRfpQuoteOptionNetworkId());
        result = performDelete("/v1/quotes/options/deleteNetwork", params);

        flushAndClear();

        option = rfpQuoteOptionRepository.findOne(option.getRfpQuoteOptionId());

        assertThat(option.getRfpQuoteOptionNetworks()).hasSize(1);
        for(RfpQuoteOptionNetwork optNetwork : option.getRfpQuoteOptionNetworks()) {
            if(optNetwork.getRfpQuoteOptionNetworkId().equals(rqon4.getRfpQuoteOptionNetworkId())) {
                // aLaCarde should not updated
                assertThat(optNetwork.getRfpQuoteNetwork().getRfpQuoteNetworkId()).isEqualTo(
                    aLaCarteQuoteNetwork.getRfpQuoteNetworkId());
                assertThat(optNetwork.getSelectedRfpQuoteNetworkPlan()).isNull();
                assertThat(optNetwork.getSelectedRfpQuoteNetworkRxPlan()).isNull();
            }
        }
    }

    @Test
    public void selectRfpQuoteOptionNetworkPlan_ClearValue() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());

        RfpQuote rfpQuote =
            testEntityHelper.createTestRfpQuote(client, Constants.ANTHEM_CARRIER, Constants.MEDICAL,
                QuoteType.CLEAR_VALUE
            );

        RfpQuoteNetwork rqn = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HMO");
        RfpQuoteNetworkPlan selectedPlan =
            testEntityHelper.createTestRfpQuoteNetworkPlan("test quote plan", rqn, 100f, 120f, 140f,
                160f
            );

        //used to test that selection for both networks is updated to this plan.
        RfpQuoteNetworkPlan newSelectionPlan =
            testEntityHelper.createTestRfpQuoteNetworkPlan("test quote plan 2", rqn, 101f, 121f,
                141f, 161f
            );

        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "optionName");
        RfpQuoteOptionNetwork rqon =
            testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, rqn, selectedPlan, null, 10L, 15L,
                20L, 25L, "PERCENT", 90f, 90f, 90f, 90f
            );
        RfpQuoteOptionNetwork rqon2 =
            testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, rqn, selectedPlan, null, 10L, 15L,
                20L, 25L, "PERCENT", 90f, 90f, 90f, 90f
            );

        flushAndClear();

        // check same plan is selected for both HMO networks
        RfpQuoteOptionNetwork storedRqon =
            rfpQuoteOptionNetworkRepository.findOne(rqon.getRfpQuoteOptionNetworkId());
        assertThat(
            storedRqon.getSelectedRfpQuoteNetworkPlan().getRfpQuoteNetworkPlanId()).isEqualTo(
            selectedPlan.getRfpQuoteNetworkPlanId());
        RfpQuoteOptionNetwork storedRqon2 =
            rfpQuoteOptionNetworkRepository.findOne(rqon2.getRfpQuoteOptionNetworkId());
        assertThat(
            storedRqon2.getSelectedRfpQuoteNetworkPlan().getRfpQuoteNetworkPlanId()).isEqualTo(
            selectedPlan.getRfpQuoteNetworkPlanId());

        //setup DTO for API call, set the first network to new plan
        SelectRfpQuoteOptionNetworkPlanDto params = new SelectRfpQuoteOptionNetworkPlanDto();
        params.setRfpQuoteNetworkPlanId(newSelectionPlan.getRfpQuoteNetworkPlanId());
        params.setRfpQuoteOptionNetworkId(rqon.getRfpQuoteOptionNetworkId());

        String result = performPut("/v1/quotes/options/selectNetworkPlan", params);
        RestMessageDto dto = gson.fromJson(result, RestMessageDto.class);
        assertThat(dto.isSuccess()).isTrue();

        flushAndClear();

        //both network should have same plan selected
        storedRqon = rfpQuoteOptionNetworkRepository.findOne(rqon.getRfpQuoteOptionNetworkId());
        assertThat(
            storedRqon.getSelectedRfpQuoteNetworkPlan().getRfpQuoteNetworkPlanId()).isEqualTo(
            newSelectionPlan.getRfpQuoteNetworkPlanId());
        storedRqon2 = rfpQuoteOptionNetworkRepository.findOne(rqon2.getRfpQuoteOptionNetworkId());
        assertThat(
            storedRqon2.getSelectedRfpQuoteNetworkPlan().getRfpQuoteNetworkPlanId()).isEqualTo(
            newSelectionPlan.getRfpQuoteNetworkPlanId());

        //do the reverse to the second network, should get us back to what we started with
        params = new SelectRfpQuoteOptionNetworkPlanDto();
        params.setRfpQuoteNetworkPlanId(selectedPlan.getRfpQuoteNetworkPlanId());
        params.setRfpQuoteOptionNetworkId(rqon2.getRfpQuoteOptionNetworkId()); //second network

        result = performPut("/v1/quotes/options/selectNetworkPlan", params);
        dto = gson.fromJson(result, RestMessageDto.class);
        assertThat(dto.isSuccess()).isTrue();

        flushAndClear();

        storedRqon = rfpQuoteOptionNetworkRepository.findOne(rqon.getRfpQuoteOptionNetworkId());
        assertThat(
            storedRqon.getSelectedRfpQuoteNetworkPlan().getRfpQuoteNetworkPlanId()).isEqualTo(
            selectedPlan.getRfpQuoteNetworkPlanId());
        storedRqon2 = rfpQuoteOptionNetworkRepository.findOne(rqon2.getRfpQuoteOptionNetworkId());
        assertThat(
            storedRqon2.getSelectedRfpQuoteNetworkPlan().getRfpQuoteNetworkPlanId()).isEqualTo(
            selectedPlan.getRfpQuoteNetworkPlanId());
    }

    @Test
    public void submitQuoteOptions() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());

        RfpQuote medicalQuote =
            testEntityHelper.createTestRfpQuote(client, "ANTHEM_BLUE_CROSS", Constants.MEDICAL, QuoteType.CLEAR_VALUE);
        RfpQuoteOption medicalOption =
            testEntityHelper.createTestRfpQuoteOption(medicalQuote, "medical option");
        RfpQuoteNetwork medicalNetwork = 
            testEntityHelper.createTestQuoteNetwork(medicalQuote, "HMO");
        RfpQuoteNetworkPlan medicalNetworkPlan = 
            testEntityHelper.createTestRfpQuoteNetworkPlan("test medical plan", medicalNetwork, 10f, 11f, 12f, 13f);
        RfpQuoteOptionNetwork medicalOptNetwork = 
            testEntityHelper.createTestRfpQuoteOptionNetwork(medicalOption, medicalNetwork, medicalNetworkPlan, null, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);

        RfpQuote dentalQuote =
            testEntityHelper.createTestRfpQuote(client, "UHC", Constants.DENTAL, QuoteType.EASY);
        RfpQuoteOption dentalOption =
            testEntityHelper.createTestRfpQuoteOption(dentalQuote, "dental option");

        RfpQuote visionQuote =
            testEntityHelper.createTestRfpQuote(client, "BLUE_SHIELD", Constants.VISION, QuoteType.STANDARD);
        RfpQuoteOption visionOption =
            testEntityHelper.createTestRfpQuoteOption(visionQuote, "vision option");

        flushAndClear();

        QuoteOptionSubmissionDto params = new QuoteOptionSubmissionDto();
        params.setClientId(client.getClientId());
        params.setMedicalQuoteOptionId(medicalOption.getRfpQuoteOptionId());

        String result = performPost("/v1/quotes/options/submit", params);
        QuoteOptionSubmissionDto resp = gson.fromJson(result, QuoteOptionSubmissionDto.class);
        assertThat(resp.getErrorMessage()).isEqualTo(
            RfpQuoteService.ANTHEM_CLEAR_VALUE_SUBMISSION_RULES_RESTRICTION_COUNT);
        assertThat(resp.isSubmissionSuccessful()).isFalse();

        params.setDentalQuoteOptionId(dentalOption.getRfpQuoteOptionId());
        result = performPost("/v1/quotes/options/submit", params);

        resp = gson.fromJson(result, QuoteOptionSubmissionDto.class);
        assertThat(resp.getErrorMessage()).isEqualTo(
            String.format(RfpQuoteService.ANTHEM_CLEAR_VALUE_SUBMISSION_RULES_RESTRICTION_TYPE,
                dentalOption.getRfpQuote().getQuoteType()
            ));
        assertThat(resp.isSubmissionSuccessful()).isFalse();

        params.setDentalQuoteOptionId(null);
        params.setVisionQuoteOptionId(visionOption.getRfpQuoteOptionId());
        //		result = performPost("/v1/quotes/options/submit", params);

        //		resp = jsonUtils.fromJson(result, QuoteOptionSubmissionDto.class);
        //		assertThat(resp.getErrorMessage()).isNull();
        //		assertThat(resp.isSubmissionSuccessful()).isTrue();

        // check for total discount of external products

        testEntityHelper.createTestClientExtProduct(client, Constants.STD);

        params.setDentalQuoteOptionId(null);
        params.setVisionQuoteOptionId(null);
        result = performPost("/v1/quotes/options/submit", params);

        resp = gson.fromJson(result, QuoteOptionSubmissionDto.class);
        assertThat(resp.getErrorMessage()).isEqualTo(
            RfpQuoteService.ANTHEM_CLEAR_VALUE_SUBMISSION_RULES_RESTRICTION_COUNT);
        assertThat(resp.isSubmissionSuccessful()).isFalse();

        // sum of STD and LTD = 1%, submission allowed

        testEntityHelper.createTestClientExtProduct(client, Constants.LTD);
        result = performPost("/v1/quotes/options/submit", params);

        resp = gson.fromJson(result, QuoteOptionSubmissionDto.class);
        assertThat(resp.getErrorMessage()).isNull();
        assertThat(resp.isSubmissionSuccessful()).isTrue();

        List<ClientExtProduct> products =
            clientExtProductRepository.findByClientId(params.getClientId());
        assertThat(products).isNotEmpty();
        
        // test send was called 
        ArgumentCaptor<MailDto> mailCaptor = ArgumentCaptor.forClass(MailDto.class);
        Mockito.verify(smtpMailer, Mockito.times(2)).send(mailCaptor.capture());
        
        List<MailDto> mailDtos = mailCaptor.getAllValues();
        
        MailDto mailToCarrier = mailDtos.get(0);
        MailDto mailToUser = mailDtos.get(1);
        
        assertThat(mailToCarrier.getSubject()).contains(client.getClientName());
        
        assertThat(mailToUser.getRecipient()).isEqualTo("test@domain.test");
        assertThat(mailToUser.getSubject()).contains(client.getClientName());
        assertThat(mailToUser.getContent()).contains("FirstName LastName");
        
        // uncomment for manual testing
        //File html1 = new File("testAnthemNewSaleNotification.html");
        //FileUtils.writeByteArrayToFile(html1, mailToCarrier.getContent().getBytes());
        //File html2 = new File("testAnthemNewSaleNotificationRecord.html");
        //FileUtils.writeByteArrayToFile(html2, mailToUser.getContent().getBytes());
    }
    
    @Test
    public void getQuoteOptionRiders_SpecialRiders() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());

        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(client, "ANTHEM_BLUE_CROSS", Constants.MEDICAL);
        RfpQuoteNetwork rqn = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HMO");
        RfpQuoteNetworkPlan rqnp = testEntityHelper.createTestRfpQuoteNetworkPlan("test medical plan", rqn, 10f, 11f, 12f, 13f);
        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "Option 1");
        RfpQuoteOptionNetwork rqon = testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, rqn, rqnp, null, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);

        flushAndClear();

        String result = performGet("/v1/quotes/options/{id}/riders", EMPTY, rqo.getRfpQuoteOptionId());
           
        List<Rider> specialRiders = riderRepository.findByRiderMetaCategory(AnthemRfpQuoteService.ANTHEM_4TIER_SPECIAL_RIDER_CATEGORY);
        // "Hearing Aids" and "Infertility Treatment"
        assertThat(specialRiders).hasSize(2);
        
        QuoteOptionRidersDto dto = gson.fromJson(result, QuoteOptionRidersDto.class);

        // special riders should be returned by default (they are not selected and not linked to quote network)
        assertThat(dto.getNetworkRidersDtos()).hasSize(1);
        assertThat(dto.getNetworkRidersDtos().get(0).getRiders()).extracting(RiderDto::getRiderCode)
            .containsExactly(specialRiders.get(0).getRiderMeta().getCode(), specialRiders.get(1).getRiderMeta().getCode());
    }
    
    @Test
    public void testSpecialRiderImpactToPlanCost() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());

        ClientPlan cpHmo = testEntityHelper.createTestClientPlan("hmo client plan", client, "BLUE_SHIELD", "HMO");
        
        RfpQuote medicalQuote = testEntityHelper.createTestRfpQuote(client, CarrierType.ANTHEM_BLUE_CROSS.name(), Constants.MEDICAL);
        RfpQuoteNetwork medicalNetwork = testEntityHelper.createTestQuoteNetwork(medicalQuote, "HMO");
        RfpQuoteNetworkPlan plan = testEntityHelper.createTestRfpQuoteNetworkPlan("test medical plan", medicalNetwork, 10f, 11f, 12f, 13f);
        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(medicalQuote, "medical option");
        RfpQuoteOptionNetwork rqon = testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, medicalNetwork, plan, cpHmo, 10L, 15L, 20L, 25L, "DOLLAR", 90f, 90f, 90f, 90f);

        // add and select Dental to get Bundle Discount
        RfpQuote rfpQuoteDental = testEntityHelper.createTestRfpQuote(client, CarrierType.ANTHEM_BLUE_CROSS.name(), Constants.DENTAL);
        RfpQuoteNetwork rqnDental = testEntityHelper.createTestQuoteNetwork(rfpQuoteDental, "DHMO");
        RfpQuoteNetworkPlan rqnpDental = testEntityHelper.createTestRfpQuoteNetworkPlan("test quote plan Dental", rqnDental, 100f, 120f, 140f, 160f);
        RfpQuoteOption rqoDental = testEntityHelper.createTestRfpQuoteOption(rfpQuoteDental, "optionName Dental");
        RfpQuoteOptionNetwork rqonDental = testEntityHelper.createTestRfpQuoteOptionNetwork(rqoDental, rqnDental, rqnpDental, cpHmo, 10L, 15L, 20L, 25L, "DOLLAR", 90f, 90f, 90f, 90f);
        
        List<Rider> specialRiders = riderRepository.findByRiderMetaCategory(AnthemRfpQuoteService.ANTHEM_4TIER_SPECIAL_RIDER_CATEGORY);
        // "Hearing Aids" and "Infertility Treatment"
        assertThat(specialRiders).hasSize(2);
        Rider specialRider = specialRiders.get(0);
        
        rqon.getSelectedRiders().add(specialRider);
        rfpQuoteOptionNetworkRepository.save(rqon);
        
        flushAndClear();

        QuoteOptionDetailsDto quoteOption1Dto = gson.fromJson(
            performGet("/v1/quotes/options/{id}", EMPTY, rqo.getRfpQuoteOptionId()), QuoteOptionDetailsDto.class);

        assertThat(quoteOption1Dto.getDetailedPlans()).hasSize(1);
        QuoteOptionPlanDetailsDto planDetails = quoteOption1Dto.getDetailedPlans().get(0);

        float discountFactor = getDiscountFactor(DENTAL_BUNDLE_DISCOUNT_PERCENT);
        
        // NOTE: Bundling discounts are applied AFTER the cost is added to the plan. 
        // THIS IS DIFFERENT then how other rider cost is calculated
        Float expectedTotalWithRiders = (rqon.getTier1Census() * (plan.getTier1Rate() + specialRider.getTier1Rate()) * discountFactor)
                + (rqon.getTier2Census() * (plan.getTier2Rate() + specialRider.getTier2Rate()) * discountFactor)
                + (rqon.getTier3Census() * (plan.getTier3Rate() + specialRider.getTier3Rate()) * discountFactor)
                + (rqon.getTier4Census() * (plan.getTier4Rate() + specialRider.getTier4Rate()) * discountFactor);
        assertThat(planDetails.getNewPlan().getTotal())
            .isEqualTo(expectedTotalWithRiders, offset(0.005f));

        // unselect rider and check calculations
        rqon.getSelectedRiders().remove(specialRider);
        rfpQuoteOptionNetworkRepository.save(rqon);
        
        quoteOption1Dto = gson.fromJson(
            performGet("/v1/quotes/options/{id}", EMPTY, rqo.getRfpQuoteOptionId()), QuoteOptionDetailsDto.class);
        planDetails = quoteOption1Dto.getDetailedPlans().get(0);
        
        Float expectedTotalWithoutRiders = (rqon.getTier1Census() * plan.getTier1Rate() * discountFactor)
                + (rqon.getTier2Census() * plan.getTier2Rate() * discountFactor)
                + (rqon.getTier3Census() * plan.getTier3Rate() * discountFactor)
                + (rqon.getTier4Census() * plan.getTier4Rate() * discountFactor);
        assertThat(planDetails.getNewPlan().getTotal())
            .isEqualTo(expectedTotalWithoutRiders, offset(0.005f));
    }
    
    @Test
    public void poiUtilTest() {
        String medicalNotes = "TEST\n\n-Medical";
        Client client = testEntityHelper.createTestClient();
        RfpQuoteSummary rqs = testEntityHelper.createTestRfpQuoteSummary(client);
        rqs.setMedicalNotes(medicalNotes);
        PoiUtil util = new PoiUtil();
        Map<String, String> data = util.prepareSummaryPageData(client, rqs);
        
        assertThat(data.get("DISCOUNT VISION")).isEqualTo("1.0");
        assertThat(data.get("DISCOUNT DENTAL")).isEqualTo("1.0");
        assertThat(data.get("DISCOUNT LIFE")).isEqualTo("1.0");
        assertThat(data.get("DISCOUNT STD")).isEqualTo("0.5");
        assertThat(data.get("DISCOUNT LTD")).isEqualTo("0.5");
        assertThat(data.get("DISCOUNT SUM")).isEqualTo("4.0");
        assertThat(data.get("MEDICAL SUMMARY")).isEqualTo(medicalNotes);
    }
}
