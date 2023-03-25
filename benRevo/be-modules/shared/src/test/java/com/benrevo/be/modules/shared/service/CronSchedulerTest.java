package com.benrevo.be.modules.shared.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.*;

import java.util.Calendar;
import org.apache.commons.lang3.time.DateUtils;
import org.junit.Test;
import org.springframework.scheduling.support.CronSequenceGenerator;


public class CronSchedulerTest {

    @Test
    public void testEveryFridayOn17_00() {
        CronSequenceGenerator cron = new CronSequenceGenerator("0 0 17 ? * FRI");

        Calendar lastExecuted = Calendar.getInstance();
        lastExecuted.set(Calendar.MILLISECOND, 0);
        lastExecuted.set(Calendar.SECOND, 0);
        lastExecuted.set(Calendar.MINUTE, 59);
        lastExecuted.set(Calendar.HOUR_OF_DAY, 16);
        lastExecuted.set(Calendar.DAY_OF_WEEK, Calendar.FRIDAY);
        
        Calendar expected = Calendar.getInstance();
        expected.set(Calendar.MILLISECOND, 0);
        expected.set(Calendar.SECOND, 0);
        expected.set(Calendar.MINUTE, 0);
        expected.set(Calendar.HOUR_OF_DAY, 17);
        expected.set(Calendar.DAY_OF_WEEK, Calendar.FRIDAY);
        
        // check for cron.next() is immutable and return equal time every call
        assertThat(cron.next(lastExecuted.getTime())).isEqualTo(cron.next(lastExecuted.getTime()));
        
        // check for closest time
        assertThat(cron.next(lastExecuted.getTime())).isEqualTo(expected.getTime());
        
        // update lastExecuted to 17:01:30
        lastExecuted.set(Calendar.SECOND, 30);
        lastExecuted.set(Calendar.MINUTE, 1);
        lastExecuted.set(Calendar.HOUR_OF_DAY, 17);
        
        expected.add(Calendar.DAY_OF_MONTH, 7);
        
        // check for new closest time on next week
        assertThat(cron.next(lastExecuted.getTime())).isEqualTo(expected.getTime());
    }

}
