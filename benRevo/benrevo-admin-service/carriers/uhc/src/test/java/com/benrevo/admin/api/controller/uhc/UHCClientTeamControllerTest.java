package com.benrevo.admin.api.controller.uhc;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.Test;
import com.benrevo.be.modules.admin.controller.AdminAbstractClientTeamControllerTest;
import com.benrevo.common.dto.MailDto;


public class UHCClientTeamControllerTest extends AdminAbstractClientTeamControllerTest {

    @Test
    public void uhcCreatingUsersFromClientTeam() throws Exception {
        MailDto mailDto = creatingUsersFromClientTeam();

        assertThat(mailDto.getContent()).containsIgnoringCase("uhc");

    }

}
