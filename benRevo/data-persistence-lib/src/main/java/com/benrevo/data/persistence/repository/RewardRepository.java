package com.benrevo.data.persistence.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.benrevo.common.dto.ActivityClientTeamDto;
import com.benrevo.common.dto.RewardsInfoDto;
import com.benrevo.data.persistence.entities.Reward;

public interface RewardRepository extends JpaRepository<Reward, Long> {

    @Query(value = "select new com.benrevo.common.dto.ActivityClientTeamDto("
            + "ct.id, "
            + "CONCAT("
            +     "CASE WHEN ct.name IS NULL OR TRIM(ct.name) = '' "
            +         "THEN ct.email "
            +         "ELSE ct.name "
            +     "END, "
            +     "CASE WHEN ct.broker.generalAgent = TRUE "
            +         "THEN CONCAT(' (', ct.broker.name, ')') "
            +         "ELSE '' "
            +     "END "
            + "), "
            + "r.activityId is not null) "
            + "from ClientTeam ct "
            + "left join Reward r on ct.id = r.clientTeamId "
            + "and r.activityId = :activityId "
            + "where ct.client.clientId = :clientId")
    List<ActivityClientTeamDto> findActivityClientTeamByClientIdAndActivityId(
            @Param("clientId") Long clientId, 
            @Param("activityId") Long activityId);
    
    @Query(value = "select new com.benrevo.common.dto.RewardsInfoDto("
            + "case "
            +   "when ct.name is null or trim(ct.name) = '' then ct.email "
            +   "else ct.name "
            + "end, "
            + "ct.client.clientName, "
            + "ct.client.clientId, "
            + "a.created, "
            + "cast(a.value as integer), "
            + "a.completed is not null) "
            + "from Activity a "
            + "inner join Reward r on r.activityId = a.activityId "
            + "inner join ClientTeam ct on ct.id = r.clientTeamId "
            + "where a.type = 'REWARD' "
            + "order by ct.name, a.created")
    List<RewardsInfoDto> findRewardActivitiesInfo();
    
    List<Reward> findByActivityId(Long activityId);
    
}

