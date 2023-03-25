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
public class BrokerLoaderUtilityTest extends AbstractControllerTest {

    @Autowired
    private BrokerLoaderUtility brokerLoaderUtility;

    private String fileName = "Benrevo_Employees_Test_Brokerages.xls";
    
    @Override
	public void init() {
    	
    }
    
    @Ignore
    @Test
    public void loadBroker() throws Exception {
        String currDir = Paths.get("").toAbsolutePath().toString();
        File file = new File(currDir + "/data/" + fileName);
        try(FileInputStream fis = new FileInputStream(file)) {
            brokerLoaderUtility.loadBroker(fis);
        } 
    
    }

    @Ignore
    @Test
    public void loadUser() throws Exception {
        String currDir = Paths.get("").toAbsolutePath().toString();
        File file = new File(currDir + "/data/" + fileName);
        try(FileInputStream fis = new FileInputStream(file)) {
            brokerLoaderUtility.loadUser(fis, null);
        } 

    }
}
