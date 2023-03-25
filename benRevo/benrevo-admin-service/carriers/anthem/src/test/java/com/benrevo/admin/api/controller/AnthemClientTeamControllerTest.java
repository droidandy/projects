package com.benrevo.admin.api.controller;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.Test;
import com.benrevo.be.modules.admin.controller.AdminAbstractClientTeamControllerTest;
import com.benrevo.common.dto.MailDto;


public class AnthemClientTeamControllerTest extends AdminAbstractClientTeamControllerTest {

    @Test
    public void anthemCreatingUsersFromClientTeam() throws Exception {
        MailDto mailDto = creatingUsersFromClientTeam();

        assertThat(mailDto.getContent()).containsIgnoringCase("anthem");

    }

}
