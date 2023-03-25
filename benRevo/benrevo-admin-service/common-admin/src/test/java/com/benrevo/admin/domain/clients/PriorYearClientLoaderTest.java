package com.benrevo.admin.domain.clients;

import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Paths;

@Ignore
@RunWith(SpringRunner.class)
@SpringBootTest
@Transactional(rollbackFor = Exception.class) //comment out to create client with quotes uploaded in broker account.
public class PriorYearClientLoaderTest {

    @Autowired
    private PriorYearClientLoader priorYearClientLoader;

    @Test
    public void runPriorYearClientLoader() throws IOException{

        String currDir = Paths.get("").toAbsolutePath().toString();
        File myFile = new File(currDir + "/data/clients/UHC/2017/priorYearClients.xlsx"); // file not checked in, sensitive information
        FileInputStream fis = new FileInputStream(myFile);

        priorYearClientLoader.run(fis);
    }
}
