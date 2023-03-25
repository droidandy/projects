package com.benrevo.core.itest.client.team;


import static io.github.benas.randombeans.api.EnhancedRandom.random;

import com.benrevo.common.dto.ClientMemberDto;
import com.benrevo.core.AbstractBaseIt;
import java.util.List;
import org.testng.annotations.BeforeClass;


/**
 * The type Client team base test.
 */
public class ClientTeamBaseTest extends AbstractBaseIt {

    ClientMemberDto teamMemberFirst;
    ClientMemberDto teamMemberSecond;
    List teamMemberList;


    @BeforeClass(alwaysRun = true)
    public void setUpClientTeam() {

        teamMemberFirst = random(ClientMemberDto.class);
        teamMemberFirst.setBrokerageId(getBrokerIdL());
        teamMemberSecond = random(ClientMemberDto.class);
        teamMemberSecond.setBrokerageId(getBrokerIdL());
    }

}


