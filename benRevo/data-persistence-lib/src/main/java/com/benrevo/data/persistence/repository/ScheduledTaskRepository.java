package com.benrevo.data.persistence.repository;

import com.benrevo.common.enums.SchedulerTaskType;
import com.benrevo.data.persistence.entities.ScheduledTask;
import java.util.List;
import org.springframework.data.repository.CrudRepository;

public interface ScheduledTaskRepository extends CrudRepository<ScheduledTask, Long> {
    List<ScheduledTask> findByTaskType(SchedulerTaskType taskType);
}

