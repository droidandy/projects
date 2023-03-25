package com.benefit.data.model.factory;

import java.util.List;

import com.benefit.data.loader.BenefitDBLoader;
import com.benefit.data.model.carrier.Network;

public class NetworkFactory {
	
	//private HashMap<String, Integer> networkMap = new HashMap<String, Integer>();
	private List<Network> networkList;
	private static NetworkFactory factory = null;
	
	private NetworkFactory() {  
		loadNetworks();
	}
	
	private void loadNetworks() {
		BenefitDBLoader db = new BenefitDBLoader();
		networkList = db.getNetworks();
		db.close();
	}

	public Network getNetworkByCarrierAndName(String carrier, String name) {
		for(int index = 0; index < networkList.size(); index++) {
			//if(networkList.get(index).getCarrierId())
		}
		return null;
	}

	public static NetworkFactory getInstance() {
		if(null == factory){
			factory = new NetworkFactory();
		}
		return factory;
	}
	
	
	
}
