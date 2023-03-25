package com.benrevo.core.itest.util.base;

import static com.benrevo.core.itest.util.DataConstants.LOCALHOST;

import com.benrevo.core.AbstractBaseIt;
import org.subethamail.wiser.Wiser;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;


public class SmtpMailServerBase extends AbstractBaseIt {

    protected Wiser wiser;

    @BeforeClass
    public void setUp() {
        wiser = new Wiser();
        wiser.setPort(2500);
        wiser.setHostname(LOCALHOST);
        wiser.start();
    }

    @AfterClass
    public void tearDown() {
        wiser.stop();
    }
}
