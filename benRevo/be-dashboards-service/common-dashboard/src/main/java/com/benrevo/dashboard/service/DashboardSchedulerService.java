package com.benrevo.dashboard.service;

import com.benrevo.be.modules.shared.service.BaseSchedulerService;
import com.benrevo.common.enums.SchedulerTaskType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DashboardSchedulerService extends BaseSchedulerService {

    @Autowired
    private DashboardEmailService dashboardEmailService;
    
    @Override
    protected SchedulerTaskType getTaskType() {
        return SchedulerTaskType.REWARDS_EMAIL;
    }

    @Override
    protected void execute() {
        dashboardEmailService.sendRewardsNotification();
    }
}
