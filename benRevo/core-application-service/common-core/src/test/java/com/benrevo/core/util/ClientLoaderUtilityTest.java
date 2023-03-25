package com.benrevo.core.util;

import org.junit.Ignore;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.benrevo.be.modules.shared.controller.AbstractControllerTest;

import java.io.File;
import java.io.FileInputStream;
import java.nio.file.Paths;

@Ignore // This is not actually validating the uploaded plans
//@Transactional(rollbackFor = Exception.class) 
//FIXME: comment out to create client with quotes uploaded in broker account.
//FIXME @Transactional is inherited from AbstractControllerTest
public class ClientLoaderUtilityTest extends AbstractControllerTest {

    @Autowired
    private ClientLoaderUtility clientLoaderUtility;

    private String FILE_NAME = "Anthem_Sample_Client.xml";
    private String CLIENT_NAME = "Sample_Client.xml";
    
    @Override
        public void init() {
    	
    }

    /**
     *
     * @throws Exception
     */
    @Ignore
    @Test
    public void loadClientXmlToAllBrokers() throws Exception {
        String currDir = Paths.get("").toAbsolutePath().toString();
        File file = new File(currDir + "/data/clients/" + FILE_NAME);

        try(FileInputStream fis = new FileInputStream(file)) {
            clientLoaderUtility.loadClientToAllBrokers(fis, CLIENT_NAME);
        }
    }

    @Ignore
    @Test
    public void submitRFPsForClientsWithName() throws Exception {
        clientLoaderUtility.submitRFPsForClientName(CLIENT_NAME);
    }
}
