package com.benefit.data.test;

import com.google.gson.Gson;

public class PlanSearchParamsTest {

	public static void main(String [] args){
		Gson gson = new Gson();
		
		String payload = "{search:[{id:42,gt:100,lt:200},{id:35,gt:4000},{id:49,lt:3000}]}";
		
		//PlanSearchParams psp = (PlanSearchParams)gson.fromJson(payload, PlanSearchParams.class);
		
		System.out.print("Done");
	}
}
