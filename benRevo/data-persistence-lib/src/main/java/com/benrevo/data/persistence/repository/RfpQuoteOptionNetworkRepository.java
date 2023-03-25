package com.benrevo.data.persistence.repository;

import com.benrevo.data.persistence.entities.*;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface RfpQuoteOptionNetworkRepository extends CrudRepository<RfpQuoteOptionNetwork, Long> {
	
	RfpQuoteOptionNetwork findByRfpQuoteOptionAndClientPlan(RfpQuoteOption option, ClientPlan clientPlan);

    List<RfpQuoteOptionNetwork> findByRfpQuoteOptionAndRfpQuoteNetwork(RfpQuoteOption option, RfpQuoteNetwork rfpQuoteNetwork);
    
    List<RfpQuoteOptionNetwork> findByRfpQuoteOptionAndNetworkGroup(RfpQuoteOption option, String networkGroup);
	
	@Modifying
    @Query("update RfpQuoteOptionNetwork network set network.selectedRfpQuoteNetworkPlan = ?1 where network.rfpQuoteOptionNetworkId = ?2")
    void setSelectedPlan(RfpQuoteNetworkPlan plan, Long rfpQuoteOptionNetworkId);
	
	@Modifying
    @Query("update RfpQuoteOptionNetwork network set network.selectedRfpQuoteNetworkRxPlan = ?1 where network.rfpQuoteOptionNetworkId = ?2")
    void setSelectedRx(RfpQuoteNetworkPlan pxPlan, Long rfpQuoteOptionNetworkId);

    @Modifying
    @Query("update RfpQuoteOptionNetwork network set network.selectedRfpQuoteNetworkPlan = null where network.selectedRfpQuoteNetworkPlan = ?1")
    void unselectPlan(RfpQuoteNetworkPlan plan);

    @Modifying
    @Query("update RfpQuoteOptionNetwork network set network.selectedRfpQuoteNetworkRxPlan = null where network.selectedRfpQuoteNetworkRxPlan = ?1")
    void unselectRxPlan(RfpQuoteNetworkPlan plan);

    @Modifying
    @Query("update RfpQuoteOptionNetwork network set network.selectedSecondRfpQuoteNetworkPlan = ?1 where network.rfpQuoteOptionNetworkId = ?2")
    void setSelectedSecondPlan(RfpQuoteNetworkPlan plan, Long rfpQBaseRfpServiceuoteOptionNetworkId);

    @Modifying
    @Query("update RfpQuoteOptionNetwork network set network.selectedSecondRfpQuoteNetworkRxPlan = ?1 where network.rfpQuoteOptionNetworkId = ?2")
    void setSelectedSecondRx(RfpQuoteNetworkPlan pxPlan, Long rfpQuoteOptionNetworkId);

    @Modifying
    @Query("update RfpQuoteOptionNetwork network set network.selectedSecondRfpQuoteNetworkPlan = null where network.selectedSecondRfpQuoteNetworkPlan = ?1")
    void unselectSecondPlan(RfpQuoteNetworkPlan plan);

    @Modifying
    @Query("update RfpQuoteOptionNetwork network set network.selectedSecondRfpQuoteNetworkRxPlan = null where network.selectedSecondRfpQuoteNetworkRxPlan = ?1")
    void unselectSecondRxPlan(RfpQuoteNetworkPlan plan);

    void deleteByRfpQuoteOptionNetworkIdIn(List<Long> rfpQuoteOptionNetworkIds);
}
