package com.benrevo.data.persistence.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "reward")
public class Reward {
	
    @Id 
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column	(name = "reward_id")
	private Long rewardId;

    @Column (name = "activity_id")
    private Long activityId;

    @Column (name = "client_team_id")
    private Long clientTeamId;

    public Reward() {
    }
    
    public Reward(Long activityId, Long clientTeamId) {
        this.activityId = activityId;
        this.clientTeamId = clientTeamId;
    }

    public Long getRewardId() {
        return rewardId;
    }

    public void setRewardId(Long rewardId) {
        this.rewardId = rewardId;
    }

    public Long getActivityId() {
        return activityId;
    }

    public void setActivityId(Long activityId) {
        this.activityId = activityId;
    }

    public Long getClientTeamId() {
        return clientTeamId;
    }

    public void setClientTeamId(Long clientTeamId) {
        this.clientTeamId = clientTeamId;
    }

    
}
