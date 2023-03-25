package com.benrevo.dashboard.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.reset;

import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.enums.SchedulerTaskRateUnit;
import com.benrevo.common.enums.SchedulerTaskType;
import com.benrevo.data.persistence.entities.ScheduledTask;
import com.benrevo.data.persistence.repository.ScheduledTaskRepository;
import java.util.List;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.mock.mockito.MockReset;

public class DashboardSchedulerServiceTest extends AbstractControllerTest {

    @Autowired
    private ScheduledTaskRepository scheduledTaskRepository;
    
    @Autowired
    private DashboardSchedulerService dashboardSchedulerService;
    
    @MockBean(reset = MockReset.AFTER)
    private DashboardEmailService dashboardEmailService;
    
    @Override
    public void init() throws Exception {
 
    }
    
    @Test
    public void sendRewardsNotificationTask() throws Exception {
        
        ScheduledTask task;
        List<ScheduledTask> tasks = scheduledTaskRepository.findByTaskType(dashboardSchedulerService.getTaskType());
        if(tasks.isEmpty()) {
            task = new ScheduledTask();
            task.setEnabled(true);
            task.setRate("7");
            task.setRateUnit(SchedulerTaskRateUnit.DAYS);
            task.setTaskType(SchedulerTaskType.REWARDS_EMAIL);
            scheduledTaskRepository.save(task);
        } else {
            assertThat(tasks).hasSize(1);
            task = tasks.get(0);
           
        }
        task.setEnabled(true);
        task.setLastExecuted(null);
        task = scheduledTaskRepository.save(task);
        
        dashboardSchedulerService.checkScheduledTaskAndRun();
        
        verify(dashboardEmailService, times(1)).sendRewardsNotification();

        task = scheduledTaskRepository.findOne(task.getScheduledTaskId());
        assertThat(task.getLastExecuted()).isNotNull();
        
        reset(dashboardEmailService);
        
        // check that there was no re-call, because the scheduler interval rate = 7 days
        
        dashboardSchedulerService.checkScheduledTaskAndRun();
        
        verify(dashboardEmailService, times(0)).sendRewardsNotification();

        // disable task and check what dashboardEmailService.execute() not called
        
        task.setEnabled(false);
        task.setLastExecuted(null);
        task = scheduledTaskRepository.save(task);
        
        dashboardSchedulerService.checkScheduledTaskAndRun();
        
        verify(dashboardEmailService, times(0)).sendRewardsNotification();
        
        task = scheduledTaskRepository.findOne(task.getScheduledTaskId());
        assertThat(task.getLastExecuted()).isNull();
    }
}
