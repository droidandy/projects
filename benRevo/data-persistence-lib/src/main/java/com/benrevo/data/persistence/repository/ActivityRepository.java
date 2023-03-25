package com.benrevo.data.persistence.repository;

import java.util.List;
import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.benrevo.common.enums.ActivityType;
import com.benrevo.data.persistence.entities.Activity;
import com.benrevo.data.persistence.entities.Broker;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
    
    List<Activity> findByClientIdAndTypeAndOptionAndProductAndLatestIsTrue(Long clientId, ActivityType type, String option, String product);

    Activity findByClientIdAndTypeAndOptionAndProductAndCarrierIdAndLatestIsTrue(Long clientId, ActivityType type, String option, String product, Long carrierId);

    List<Activity> findByClientId(Long clientId);

    List<Activity> findByClientIdAndType(Long clientId, ActivityType type);

    List<Activity> findByTypeAndCompletedIsNullOrderByCreated(ActivityType type);
    
    @Query("select distinct ct.broker from Activity a "
        + "inner join Reward r on r.activityId = a.activityId "
        + "inner join ClientTeam ct on ct.id = r.clientTeamId "
        + "where a.type = 'REWARD' and a.completed is not null")
    Set<Broker> findSentRewardBrokers();

}

