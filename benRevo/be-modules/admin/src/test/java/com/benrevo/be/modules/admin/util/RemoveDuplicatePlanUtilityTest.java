package com.benrevo.be.modules.admin.util;

import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

@Ignore
@RunWith(SpringRunner.class)
@SpringBootTest
@Transactional(rollbackFor = Exception.class)
public class RemoveDuplicatePlanUtilityTest {

    private static final Logger logger = LoggerFactory.getLogger(RemoveDuplicatePlanUtilityTest.class);

    @Autowired
    private RemoveDuplicatePlanUtility removeDuplicatePlanUtility;

    @Test
    public void removeDuplicatePlan() {
        int count = removeDuplicatePlanUtility.run();
        logger.info("Completed duplicate plan removal, deleted " + count + " plans.");
    }
}
