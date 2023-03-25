package com.benrevo.be.modules.admin.controller;

import static org.assertj.core.api.Assertions.assertThat;

import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.BrokerDto;
import com.benrevo.common.enums.BrokerLocale;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.repository.BrokerRepository;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MvcResult;

public class AdminBrokerControllerTest extends AbstractControllerTest {

    @Autowired
	private AdminBrokerController adminBrokerController;

	@Autowired
    private BrokerRepository brokerRepository;

    @Before
    @Override
    public void init() {
        initController(adminBrokerController);
    }


    @Test
    public void updateBrokerAddress() throws Exception {
        Broker broker = testEntityHelper.buildTestBroker("addressUdateBroker", BrokerLocale.SOUTH);
        broker = brokerRepository.save(broker);
        assertThat(broker.getSpecialtyEmail()).isNull();

        BrokerDto toUpdate = broker.toBrokerDto();
        toUpdate.setName("new name");
        toUpdate.setAddress("new address");
        toUpdate.setState("new state");
        toUpdate.setCity("new city");
        toUpdate.setZip("new zip");
        toUpdate.setLocale(BrokerLocale.NORTH);
        toUpdate.setSpecialtyBrokerEmail(Constants.BENREVO_DEVSPECIALTY_EMAIL);

        MvcResult result = performPutAndAssertResult(jsonUtils.toJson(toUpdate), null, "/admin/brokers/update");

        BrokerDto updated = jsonUtils.fromJson(result.getResponse().getContentAsString(), BrokerDto.class);

        assertThat(updated).isEqualToIgnoringGivenFields(updated, "specialty");
        assertThat(updated.getSpecialty()).isNotNull();
        assertThat(updated.getSpecialty().getEmail()).isEqualTo(Constants.BENREVO_DEVSPECIALTY_EMAIL);

        flushAndClear();

        broker = brokerRepository.findOne(broker.getBrokerId());

        assertThat(broker.getName()).isEqualTo(toUpdate.getName());
        assertThat(broker.getAddress()).isEqualTo(toUpdate.getAddress());
        assertThat(broker.getState()).isEqualTo(toUpdate.getState());
        assertThat(broker.getCity()).isEqualTo(toUpdate.getCity());
        assertThat(broker.getZip()).isEqualTo(toUpdate.getZip());
        assertThat(broker.getLocale()).isEqualTo(toUpdate.getLocale());
        assertThat(broker.getSpecialtyEmail()).isEqualTo(toUpdate.getSpecialtyBrokerEmail());

    }
}
