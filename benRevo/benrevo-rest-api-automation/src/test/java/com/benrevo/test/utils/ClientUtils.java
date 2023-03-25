package com.benrevo.test.utils;

import com.benrevo.common.Constants;
import com.benrevo.common.dto.ClientDto;
import com.benrevo.test.api.BaseTest;
import io.restassured.http.ContentType;

import java.util.Random;

public class ClientUtils extends BaseTest {
	
// These fields have not been added to the random client generator yet
//	    private String imageUrl;
//	    private String website;
//	    private String lastVisited;
//	    private String policyNumber;
//	    private String dateQuestionnaireCompleted;
//	    private String contactName;
//	    private String contactTitle;
//	    private String contactAddress;
//	    private String contactCity;
//	    private String contactState;
//	    private String contactZip;
//	    private String contactPhone;
//	    private String contactFax;
//	    private String contactEmail;
//	    private String businessType;
//	    private String orgType;
//	    private String fedTaxId;
//	    private List<ClientMemberDto> clientMembers;
	
	private static final Random RANDOM = new Random();
	
	public static ClientDto getRandomClient() {
		
		ClientDto clientDto = new ClientDto();
		clientDto.setClientName("Automation Test"+RANDOM.nextInt(9999));
//		clientDto.setBrokerId(new Long(7));
		clientDto.setEmployeeCount(new Long(RANDOM.nextInt(949)+50));
		clientDto.setParticipatingEmployees(clientDto.getEmployeeCount());
		clientDto.setEligibleEmployees(clientDto.getEmployeeCount());
		clientDto.setSicCode(Integer.toString(RANDOM.nextInt(999)));
		clientDto.setAddress("23 Some St.");
		clientDto.setCity("San Diego");
		clientDto.setState("California");
		clientDto.setZip("92111");
		clientDto.setMinimumHours(new Long(RANDOM.nextInt(20)+20));
		clientDto.setEffectiveDate(CommonUtils.getLastUpdatedTimeStamp(Constants.DATE_FORMAT));
		clientDto.setDueDate(CommonUtils.getLastUpdatedTimeStamp(Constants.DATE_FORMAT));
		clientDto.setDomesticPartner("Broad");
		clientDto.setClientState("RFP_STARTED");
		clientDto.setSitusState("California");
		clientDto.setMembersCount(new Integer(clientDto.getEmployeeCount().intValue()));
		clientDto.setRetireesCount(new Integer(0));
		clientDto.setCobraCount(new Integer(0));
		clientDto.setOutToBidReason("Cheaper insurance for all!");
		
		return clientDto;
	}
	
	public static BenrevoResponse createClient() {
		ClientDto clientDto = getRandomClient();
		String clientJson = gson.toJson(clientDto);

		// Post a new client and return the response in order to get the client ID
		BenrevoResponse response = new RequestUtil.Post()
				.withBody(clientJson)
				.withHeaders(auth)
				.withContentType(ContentType.JSON)
				.withUrl("/clients")
				.execute();

		return response;
	}

}