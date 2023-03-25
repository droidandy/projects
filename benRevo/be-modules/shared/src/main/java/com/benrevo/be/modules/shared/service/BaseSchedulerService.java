package com.benrevo.be.modules.shared.service;

import static org.apache.commons.lang3.time.DateUtils.MILLIS_PER_MINUTE;

import com.benrevo.common.enums.SchedulerTaskRateUnit;
import com.benrevo.common.enums.SchedulerTaskType;
import com.benrevo.common.logging.CustomLogger;
import com.benrevo.data.persistence.entities.ScheduledTask;
import com.benrevo.data.persistence.repository.ScheduledTaskRepository;
import java.util.Calendar;
import java.util.Date;
import java.util.concurrent.atomic.AtomicBoolean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.scheduling.support.CronSequenceGenerator;
import org.springframework.stereotype.Service;

@Service
public abstract class BaseSchedulerService {

    @Autowired
    protected CustomLogger logger;
    
    @Autowired
    private ScheduledTaskRepository scheduledTaskRepository;
    
    private final AtomicBoolean isTaskStarted = new AtomicBoolean(false);

    protected abstract SchedulerTaskType getTaskType();
    
    protected abstract void execute();

    @Scheduled(fixedRate = MILLIS_PER_MINUTE * 5, initialDelay = MILLIS_PER_MINUTE * 5)
    public void checkScheduledTaskAndRun() {
        if(isTaskStarted.compareAndSet(false, true)) {
            try {
                for(ScheduledTask task : scheduledTaskRepository.findByTaskType(getTaskType())) {
                    if(!task.isEnabled()) {
                        continue;
                    }
                    Calendar cal = Calendar.getInstance();
                    final Date executionTime = cal.getTime();
                    
                    boolean isStartTime = false;
                    if(task.getLastExecuted() == null) {
                        isStartTime = true;
                    } else {
                        if(!validateTask(task)) {
                            continue;
                        }
                        int field = -1;
                        switch(task.getRateUnit()) {
                            case DAYS:
                                field = Calendar.DAY_OF_MONTH;
                                break;
                            case HOURS:
                                field = Calendar.HOUR_OF_DAY;
                                break;
                            case MINUTES:
                                field = Calendar.MINUTE;
                                break;
                            case CRON:
                                break;
                            default:
                                throw new RuntimeException("Unsupported task rate_unit: " + task.getRateUnit());
                        }
                        if(task.getRateUnit() != SchedulerTaskRateUnit.CRON) {
                            cal.setTime(task.getLastExecuted());
                            cal.add(field, Integer.parseInt(task.getRate()));
                            if(cal.getTime().before(executionTime)) {
                                isStartTime = true;
                            }
                        } else {
                            CronSequenceGenerator cron = new CronSequenceGenerator(task.getRate());
                            if(cron.next(task.getLastExecuted()).before(executionTime)) {
                                isStartTime = true;
                            }
                        }
                    }
                    if(isStartTime) {
                        try { 
                            execute();
                            task.setLastExecuted(executionTime);
                            scheduledTaskRepository.save(task);
                        } catch (Exception e) {
                            logger.error("Scheduled task execution error", e);
                        }
                    }
                } 
            } finally {
                isTaskStarted.set(false); 
            }
        } else {    
            logger.warn("Task SchedulerService already running another {} task", getTaskType());
        }
    }
    
    private boolean validateTask(ScheduledTask task) {
        if(task.getRateUnit() != SchedulerTaskRateUnit.CRON) {
            try {
                Integer.parseInt(task.getRate());
            } catch(NumberFormatException e) {
                logger.error("Invalid scheduled_task.rate format: {}", task.getRate());
                return false;
            }
        } else {
            if(!CronSequenceGenerator.isValidExpression(task.getRate())) {
                logger.error("Invalid scheduled_task.rate format: {}", task.getRate());
                return false;
            }
        }
        return true;
    }
}
