package com.benrevo.dashboard.service;

import static com.benrevo.common.util.MapBuilder.field;
import static java.lang.String.format;
import static java.util.Optional.ofNullable;
import static java.util.Comparator.comparing;
import static org.apache.commons.lang3.StringUtils.isEmpty;

import com.benrevo.be.modules.presentation.service.RfpQuoteService;
import com.benrevo.be.modules.shared.service.Auth0Service;
import com.benrevo.be.modules.shared.service.SharedActivityService;
import com.benrevo.common.dto.ActivityClientTeamDto;
import com.benrevo.common.dto.ActivityDto;
import com.benrevo.common.dto.ClientDetailsDto;
import com.benrevo.common.dto.ClientMemberDto;
import com.benrevo.common.dto.QuoteOptionBriefDto;
import com.benrevo.common.dto.QuoteOptionListDto;
import com.benrevo.common.dto.RewardDetailsDto;
import com.benrevo.common.dto.RewardsInfoDto;
import com.benrevo.common.enums.ActivityType;
import com.benrevo.common.enums.AttributeName;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.CompetitiveInfoOption;
import com.benrevo.common.enums.ProbabilityOption;
import com.benrevo.common.enums.QuoteState;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.NotAuthorizedException;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.data.persistence.entities.Activity;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientTeam;
import com.benrevo.data.persistence.entities.ExtClientAccess;
import com.benrevo.data.persistence.entities.Reward;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.repository.ActivityRepository;
import com.benrevo.data.persistence.repository.AttributeRepository;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.ClientTeamRepository;
import com.benrevo.data.persistence.repository.ExtClientAccessRepository;
import com.benrevo.data.persistence.repository.RewardRepository;
import com.benrevo.data.persistence.repository.RfpQuoteRepository;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ClientDetailsService {
    
    private static final Integer DEFAULT_REWARD_POINTS = Integer.valueOf(100);

    @Autowired
    private RewardRepository rewardRepository;

    @Autowired
    protected ActivityRepository activityRepository;
    
    @Autowired
    private ClientRepository clientRepository;
    
    @Autowired
    private RfpQuoteService rfpQuoteService;
    
    @Autowired
    private RfpQuoteRepository rfpQuoteRepository;
    
    @Autowired
    private ClientTeamRepository clientTeamRepository;
    
    @Autowired
    private SharedActivityService sharedActivityService;
    
    @Autowired
    private ExtClientAccessRepository extClientAccessRepository;
    
    @Autowired
    private AttributeRepository attributeRepository;
    
    @Autowired
    private Auth0Service auth0Service;

    public ClientDetailsDto getClientDetails(Long clientId, String product) {
        
        Client client = clientRepository.findOne(clientId);
        if(client == null) {
            throw new NotFoundException("No Client found").withFields(field("clientId", clientId));
        }

        ClientDetailsDto result = new ClientDetailsDto();
        result.setClientId(client.getClientId());
        result.setClientName(client.getClientName());
        result.setEffectiveDate(client.getEffectiveDate());
        result.setEmployeeCount(client.getParticipatingEmployees());
        result.setBrokerName(client.getBroker().getName());
        result.setSalesName(client.getSalesFullName());
        result.setClientState(client.getClientState());
 
        // Get GA from external access list
        extClientAccessRepository
            .findByClient(client)
            .stream()
            .map(access -> access.getExtBroker().getName())
            .filter(name -> !StringUtils.containsIgnoreCase(name, "Benrevo GA"))
            .findFirst()
            .ifPresent(name -> result.setGaName(name));
        
        // mark as viewed
        client.getAttributes()
            .stream()
            .filter(a -> a.getName() == AttributeName.NOT_VIEWED_IN_DASHBOARD)
            .findFirst()
            .ifPresent(a -> attributeRepository.delete(a));
        
        RfpQuote rfpQuote = rfpQuoteRepository
            .findByClientIdAndCategory(clientId, product)
            .stream()
            .findFirst().orElse(null);
        if(rfpQuote != null) {
            result.setDateUploaded(rfpQuote.getUpdated());
        }
        
        ofNullable(activityRepository
            .findByClientIdAndTypeAndOptionAndProductAndCarrierIdAndLatestIsTrue(
                    clientId, ActivityType.PROBABILITY, null, null, null))
                            .ifPresent(activity -> result.setProbability(activity.getValue()));

        /* 3 type of difference on UI: 
         * COMPETITIVE_INFO.DIFFERENCE
         * OPTION1_RELEASED
         * RENEWAL_ADDED // to show Renewal marker
         */
       
        result.setDifferences(getDifferences(clientId, product));

        ofNullable( activityRepository
            .findByClientIdAndTypeAndOptionAndProductAndCarrierIdAndLatestIsTrue(clientId, ActivityType.OPTION1_RELEASED, null, product, null))
            .ifPresent(activity -> {
                result.getDifferences().add(toDto(activity));
            });
        ofNullable( activityRepository
            .findByClientIdAndTypeAndOptionAndProductAndCarrierIdAndLatestIsTrue(clientId, ActivityType.RENEWAL_ADDED, null, product, null))
            .ifPresent(activity -> {
                result.getDifferences().add(toDto(activity));
            });

        QuoteOptionListDto optionList = rfpQuoteService.getQuoteOptions(clientId, product);
        
        result.setOptions(optionList.getOptions());
        
        ofNullable(optionList.getCurrentOption())
                .ifPresent( c -> {
                    result.setCurrentCarrierName(c.getCarrier());
                    result.setQuoteType(c.getQuoteType());
                });
        
        if(rfpQuote == null || rfpQuote.getQuoteType() == QuoteType.CLEAR_VALUE) {
            /* NOTE: see the SharedRfpQuoteService.processDeclinedQuote() for details
             * Examples: 
             * 1) client has 2 quotes: STANDARD and CLEAR_VALUE quotes.
             * - If these quotes were declined, the rfpQuote will have quoteType = CLEAR_VALUE, 
             * because CLEAR_VALUE quote cannot be moved to DECLINED (different decline process applied to it)
             * 2) client has 1 quote: STANDARD
             * - If this quote was changed to DECLINED, the rfpQuote will be = null,
             * because findByClientIdAndCategory query is not return DECLINED quotes
             * 
             * So, we try to find additional DECLINED quote options
            */
            List<RfpQuote> declinedQuotes = rfpQuoteRepository.findByClientIdAndCategoryAndQuoteType(clientId, product, QuoteType.DECLINED); 
            if(!declinedQuotes.isEmpty()) {
                for(RfpQuote declinedQuote : declinedQuotes) {
                    float currentTotalAnnualPremium = optionList.getCurrentOption() != null ? optionList.getCurrentOption().getTotalAnnualPremium() : 0f;
                    List<QuoteOptionBriefDto> declinedOptions = rfpQuoteService.getQuoteOptions(
                        declinedQuote.getRfpQuoteId(), currentTotalAnnualPremium);
                    for(QuoteOptionBriefDto o : declinedOptions) {
                        // if needed to mark declined options on UI
                        o.setQuoteState(QuoteState.DECLINED);
                    } 
                    result.getOptions().addAll(declinedOptions);
                    if(declinedQuote.getUpdated() != null) {
                        result.setDateUploaded(declinedQuote.getUpdated());
                    }
                }
                // override QuoteType
                result.setQuoteType(QuoteType.DECLINED);
            }
        }
        // hide Renewal option
        result.getOptions().removeIf(o -> o.getName().equals(RfpQuoteService.RENEWAL_OPTION_NAME));

        // finally add link to carrierOwnedClient
        if(!isEmpty(client.getClientToken()) && !client.isCarrierOwned()){
            Client carrierOwnedClient = clientRepository.findByClientTokenAndClientIdNot(client.getClientToken(), clientId);
            if(carrierOwnedClient != null) {
                result.setCarrierOwnedClientId(carrierOwnedClient.getClientId());
                result.setClientToken(client.getClientToken());
            }
        }
        return result;
    }

    public ActivityDto getActivity(Long activityId) {

        Activity activity = activityRepository.findOne(activityId);
        
        ActivityDto activityDto = toDto(activity);
        activityDto.setClientId(activity.getClientId());
        activityDto.setCompleted(activity.getCompleted() != null ? true: null);
        activityDto.setNotes(activity.getNotes());
        
        prepareActivityOptions(activityDto, activity);
        
        return activityDto;
    }

    public void deleteActivity(Long activityId) {
        
        Activity activity = activityRepository.findOne(activityId);
        if(activity == null){
            throw new NotFoundException(
                format("Activity to delete not found; activity_id=%s", activityId)
            );
        }

        // restrict deleting completed activity
        ofNullable(activity.getCompleted())
                .ifPresent(f -> { throw new NotAuthorizedException("Can't delete completed activity")
                        .withFields(field("activity_id", activityId)); });
        
        if (Boolean.TRUE.equals(activity.getLatest())) {
            // find previous and set latest=true for it
            activityRepository.findByClientId(activity.getClientId())
                .stream()
                .filter(prev -> {
                    return !Objects.equals(prev.getActivityId(), activity.getActivityId())
                            && Objects.equals(prev.getType(), activity.getType())
                            && Objects.equals(prev.getOption(), activity.getOption())
                            && Objects.equals(prev.getProduct(), activity.getProduct())
                            && Objects.equals(prev.getCarrierId(), activity.getCarrierId());})
                .max(comparing(Activity::getCreated))
                .ifPresent(prev -> {
                    prev.setLatest(true); 
                });
        }
        
        if(activity.getType().equals(ActivityType.REWARD)) {
            List<Reward> rewards = rewardRepository.findByActivityId(activityId);
            rewardRepository.delete(rewards);
        }

        activityRepository.delete(activity);
    }

    public ActivityDto getNewActivity(Long clientId, ActivityType type) {

        ActivityDto activityDto = new ActivityDto();
        activityDto.setType(type);
        activityDto.setClientId(clientId);
        
        prepareActivityOptions(activityDto, null);
        
        return activityDto;
    }

    private void prepareActivityOptions(ActivityDto activityDto, Activity activity) {
        switch(activityDto.getType()) {
            case COMPETITIVE_INFO:
                activityDto.setOptions(Arrays.stream(CompetitiveInfoOption.values())
                    .map(value -> new ActivityDto.Option( value.name(), value.getDisplayName(), 
                            activity != null && value.name().equals(activity.getOption())))
                    .collect(Collectors.toList()));
                break;
            case PROBABILITY:
                activityDto.setOptions(Arrays.stream(ProbabilityOption.values())
                    .map(value -> new ActivityDto.Option( value.name(), value.name(), 
                            activity != null && value.name().equals(activity.getValue())))
                    .collect(Collectors.toList()));
                break;
            case REWARD:
                // fill team members
                activityDto.setClientTeams(rewardRepository
                            .findActivityClientTeamByClientIdAndActivityId(
                                    activityDto.getClientId(), activityDto.getActivityId()));
                break;
            default:
                break;
        }
    }

    public void create(ActivityDto activityDto) {
        
        Activity activity = sharedActivityService.save(
                new Activity(
                    activityDto.getClientId(),
                    activityDto.getType(),
                    // set default value (points) for REWARD Activity
                    (activityDto.getType() == ActivityType.REWARD ? DEFAULT_REWARD_POINTS.toString() : activityDto.getValue()),
                    activityDto.getNotes())
                .option(activityDto.getOption())
                .product(activityDto.getProduct())
                .carrierId(activityDto.getCarrierId()));

        if (activity.getType().equals(ActivityType.REWARD)) {
            // save rewarded client team
            // check for duplicates
            Set<Long> newClientTeamIds = ofNullable(activityDto.getClientTeamIds())
                    .map(List::stream)
                    .orElseGet(Stream::empty)
                    .collect(Collectors.toSet());
            
            for (Long newClientTeamId : newClientTeamIds) {
                // add new record
                rewardRepository.save(new Reward(activity.getActivityId(), newClientTeamId));
            }
        }
    }
    
    public void setActivityCompleted(Long activityId, Date completed) {
        Activity activity = ofNullable(activityRepository.findOne(activityId))
            .orElseThrow(() -> new NotFoundException("Activity not found")
                .withFields(field("activity_id", activityId)));
           
        if(completed != null && activity.getCompleted() != null) {
            throw new NotAuthorizedException("activity already completed")
                .withFields(field("activity_id", activityId));
        }
        activity.setCompleted(completed);
        
        activityRepository.save(activity);
    }
    
    public void update(ActivityDto activityDto) {
        Activity activity = ofNullable(activityRepository.findOne(activityDto.getActivityId()))
                .orElseThrow(() -> new NotFoundException("Activity not found")
                        .withFields(field("activity_id", activityDto.getActivityId())));
        
        // restrict updating completed activity
        ofNullable(activity.getCompleted())
                .ifPresent(f -> { throw new NotAuthorizedException("Can't update completed activity")
                        .withFields(field("activity_id", activityDto.getActivityId())); });
        
        activity.setUpdated(new Date());
        activity.setValue(activityDto.getValue());
        activity.setNotes(activityDto.getNotes());
        activity.setOption(activityDto.getOption());
        activity.setProduct(activityDto.getProduct());
        activity.setCarrierId(activityDto.getCarrierId());

        sharedActivityService.validate(activity);

        // update rewarded client team
        if (activity.getType().equals(ActivityType.REWARD)) {
            
            Set<Long> newClientTeamIds = ofNullable(activityDto.getClientTeamIds())
                    .map(List::stream)
                    .orElseGet(Stream::empty)
                    .collect(Collectors.toSet());
            
            for (Reward oldReward : rewardRepository.findByActivityId(activity.getActivityId())) {
                // remove existing records from SET
                if (!newClientTeamIds.remove(oldReward.getClientTeamId())) {
                    // current reward was not in new list, so remove it
                    rewardRepository.delete(oldReward);
                }
            }
            
            // if something left in SET
            for (Long newClientTeamId : newClientTeamIds) {
                // add new record
                rewardRepository.save(new Reward(activity.getActivityId(), newClientTeamId));
            }
            
        }

    }

    public List<ActivityDto> getAllActivities(Long clientId) {

        return activityRepository.findByClientId(clientId)
            .stream()
            .map(activity -> {
                ActivityDto activityDto = toDto(activity);
                activityDto.setCreated(activity.getCreated());  
                if(activity.getType().equals(ActivityType.REWARD)) {
                    activityDto.setNotes(buildRewardActivityNote(activity.getClientId(), activity.getActivityId()));
                } else {
                    activityDto.setNotes(activity.getNotes());
                }
                return activityDto; 
             })
            .collect(Collectors.toList());  
    }
    
    private String buildRewardActivityNote(Long clientId, Long activityId) {
        List<ActivityClientTeamDto> teamList = rewardRepository
            .findActivityClientTeamByClientIdAndActivityId(clientId, activityId);
        if(teamList.isEmpty()) {
            return null;
        }
        String names = teamList.stream()
            .filter(t -> t.isSelected())
            .map(t -> t.getName()).collect(Collectors.joining(", "));
        return names.isEmpty() ? null : "100 reward points sent to " + names;
    }
    
    public List<RewardsInfoDto> getRewardsInfoDto() {
        List<RewardsInfoDto> rewards = rewardRepository.findRewardActivitiesInfo();
        return rewards;
    }
    
    public List<RewardDetailsDto> getLastRewardsDetails(/*Long clientId*/) {
       
        List<Activity> lastRewards = activityRepository
            .findByTypeAndCompletedIsNullOrderByCreated(ActivityType.REWARD);
        List<RewardDetailsDto> result = new ArrayList<>();
        
        Set<Broker> prevRewardBrokers = activityRepository.findSentRewardBrokers();
        
        for(Activity activity : lastRewards) {
            List<Reward> rewards = rewardRepository.findByActivityId(activity.getActivityId());
            if(rewards.isEmpty()) {
                // should be checked in Activity  creation
                continue;
            }

            for(Reward reward : rewards) {
                ClientTeam cTeam = clientTeamRepository.findOne(reward.getClientTeamId());
                if(cTeam.getAuthId() == null) {
                    throw new BaseException("Client team member auth0_id is null")
                        .withFields(field("reward_id", reward.getRewardId()), field("member_email", cTeam.getEmail()));
                }
                ClientMemberDto user = auth0Service.getUserByAuthId(cTeam.getAuthId());
                
                RewardDetailsDto details = new RewardDetailsDto();
                details.setActivityId(activity.getActivityId());
                details.setCreated(activity.getCreated());
                details.setParticipantId(user.getEmail());
                details.setFirstName(user.getFirstName());
                details.setLastName(user.getLastName());
                details.setEmail(user.getEmail());
                details.setPoints(activity.getValue() == null ? DEFAULT_REWARD_POINTS : Integer.parseUnsignedInt(activity.getValue())); 
                Broker broker = cTeam.getBroker();
                details.setBrokerageName(broker.getName());
                details.setAddress(broker.getAddress());
                details.setCity(broker.getCity());
                details.setState(broker.getState());
                details.setZip(broker.getZip());
                details.setFirstReward(!prevRewardBrokers.contains(broker));
                
                result.add(details);
            } 
        }
        return result;
    }
    
    public List<ActivityDto> getDifferences(Long clientId, String product) {

        return activityRepository
                .findByClientIdAndTypeAndOptionAndProductAndLatestIsTrue(
                        clientId, ActivityType.COMPETITIVE_INFO, CompetitiveInfoOption.DIFFERENCE.name(), product)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());

    }

    public ActivityDto getProbability(Long clientId) {
        
        return ofNullable(activityRepository
                .findByClientIdAndTypeAndOptionAndProductAndCarrierIdAndLatestIsTrue(clientId, ActivityType.PROBABILITY, null, null, null))
                .map(this::toDto)
                .orElseGet(ActivityDto::new);
    }
    
    protected ActivityDto toDto(Activity activity) {
        ActivityDto activityDto = new ActivityDto();
        activityDto.setActivityId(activity.getActivityId());
        activityDto.setType(activity.getType());
        activityDto.setOption(activity.getOption());
        activityDto.setValue(activity.getValue());
        activityDto.setCarrierId(activity.getCarrierId());
        activityDto.setProduct(activity.getProduct());
        return activityDto;
    }

}
