package com.benrevo.common.params.rfp.deprecated;

import com.benrevo.common.params.RFPParams;


/**
 * DEPRECATED: This class should be deleted
 */
public class RFPRates extends RFPParams {
/*
	//Current Rates
	
	int cur_base_tier1;
	int cur_base_tier2;
	int cur_base_tier3;
	int cur_base_tier4;

	int cur_opt1_tier1;
	int cur_opt1_tier2;
	int cur_opt1_tier3;
	int cur_opt1_tier4;

	int cur_opt2_tier1;
	int cur_opt2_tier2;
	int cur_opt2_tier3;
	int cur_opt2_tier4;

	int cur_opt3_tier1;
	int cur_opt3_tier2;
	int cur_opt3_tier3;
	int cur_opt3_tier4;

	int cur_opt4_tier1;
	int cur_opt4_tier2;
	int cur_opt4_tier3;
	int cur_opt4_tier4;

	int cur_opt5_tier1;
	int cur_opt5_tier2;
	int cur_opt5_tier3;
	int cur_opt5_tier4;

	//Renewal Rates

	int re_base_tier1;
	int re_base_tier2;
	int re_base_tier3;
	int re_base_tier4;

	int re_opt1_tier1;
	int re_opt1_tier2;
	int re_opt1_tier3;
	int re_opt1_tier4;

	int re_opt2_tier1;
	int re_opt2_tier2;
	int re_opt2_tier3;
	int re_opt2_tier4;

	int re_opt3_tier1;
	int re_opt3_tier2;
	int re_opt3_tier3;
	int re_opt3_tier4;

	int re_opt4_tier1;
	int re_opt4_tier2;
	int re_opt4_tier3;
	int re_opt4_tier4;

	int re_opt5_tier1;
	int re_opt5_tier2;
	int re_opt5_tier3;
	int re_opt5_tier4;
	
	
	
	public int getCur_base_tier1() {
		return cur_base_tier1;
	}
	public void setCur_base_tier1(int cur_base_tier1) {
		this.cur_base_tier1 = cur_base_tier1;
	}
	public int getCur_base_tier2() {
		return cur_base_tier2;
	}
	public void setCur_base_tier2(int cur_base_tier2) {
		this.cur_base_tier2 = cur_base_tier2;
	}
	public int getCur_base_tier3() {
		return cur_base_tier3;
	}
	public void setCur_base_tier3(int cur_base_tier3) {
		this.cur_base_tier3 = cur_base_tier3;
	}
	public int getCur_base_tier4() {
		return cur_base_tier4;
	}
	public void setCur_base_tier4(int cur_base_tier4) {
		this.cur_base_tier4 = cur_base_tier4;
	}
	public int getCur_opt1_tier1() {
		return cur_opt1_tier1;
	}
	public void setCur_opt1_tier1(int cur_opt1_tier1) {
		this.cur_opt1_tier1 = cur_opt1_tier1;
	}
	public int getCur_opt1_tier2() {
		return cur_opt1_tier2;
	}
	public void setCur_opt1_tier2(int cur_opt1_tier2) {
		this.cur_opt1_tier2 = cur_opt1_tier2;
	}
	public int getCur_opt1_tier3() {
		return cur_opt1_tier3;
	}
	public void setCur_opt1_tier3(int cur_opt1_tier3) {
		this.cur_opt1_tier3 = cur_opt1_tier3;
	}
	public int getCur_opt1_tier4() {
		return cur_opt1_tier4;
	}
	public void setCur_opt1_tier4(int cur_opt1_tier4) {
		this.cur_opt1_tier4 = cur_opt1_tier4;
	}
	public int getCur_opt2_tier1() {
		return cur_opt2_tier1;
	}
	public void setCur_opt2_tier1(int cur_opt2_tier1) {
		this.cur_opt2_tier1 = cur_opt2_tier1;
	}
	public int getCur_opt2_tier2() {
		return cur_opt2_tier2;
	}
	public void setCur_opt2_tier2(int cur_opt2_tier2) {
		this.cur_opt2_tier2 = cur_opt2_tier2;
	}
	public int getCur_opt2_tier3() {
		return cur_opt2_tier3;
	}
	public void setCur_opt2_tier3(int cur_opt2_tier3) {
		this.cur_opt2_tier3 = cur_opt2_tier3;
	}
	public int getCur_opt2_tier4() {
		return cur_opt2_tier4;
	}
	public void setCur_opt2_tier4(int cur_opt2_tier4) {
		this.cur_opt2_tier4 = cur_opt2_tier4;
	}
	public int getCur_opt3_tier1() {
		return cur_opt3_tier1;
	}
	public void setCur_opt3_tier1(int cur_opt3_tier1) {
		this.cur_opt3_tier1 = cur_opt3_tier1;
	}
	public int getCur_opt3_tier2() {
		return cur_opt3_tier2;
	}
	public void setCur_opt3_tier2(int cur_opt3_tier2) {
		this.cur_opt3_tier2 = cur_opt3_tier2;
	}
	public int getCur_opt3_tier3() {
		return cur_opt3_tier3;
	}
	public void setCur_opt3_tier3(int cur_opt3_tier3) {
		this.cur_opt3_tier3 = cur_opt3_tier3;
	}
	public int getCur_opt3_tier4() {
		return cur_opt3_tier4;
	}
	public void setCur_opt3_tier4(int cur_opt3_tier4) {
		this.cur_opt3_tier4 = cur_opt3_tier4;
	}
	public int getCur_opt4_tier1() {
		return cur_opt4_tier1;
	}
	public void setCur_opt4_tier1(int cur_opt4_tier1) {
		this.cur_opt4_tier1 = cur_opt4_tier1;
	}
	public int getCur_opt4_tier2() {
		return cur_opt4_tier2;
	}
	public void setCur_opt4_tier2(int cur_opt4_tier2) {
		this.cur_opt4_tier2 = cur_opt4_tier2;
	}
	public int getCur_opt4_tier3() {
		return cur_opt4_tier3;
	}
	public void setCur_opt4_tier3(int cur_opt4_tier3) {
		this.cur_opt4_tier3 = cur_opt4_tier3;
	}
	public int getCur_opt4_tier4() {
		return cur_opt4_tier4;
	}
	public void setCur_opt4_tier4(int cur_opt4_tier4) {
		this.cur_opt4_tier4 = cur_opt4_tier4;
	}
	public int getCur_opt5_tier1() {
		return cur_opt5_tier1;
	}
	public void setCur_opt5_tier1(int cur_opt5_tier1) {
		this.cur_opt5_tier1 = cur_opt5_tier1;
	}
	public int getCur_opt5_tier2() {
		return cur_opt5_tier2;
	}
	public void setCur_opt5_tier2(int cur_opt5_tier2) {
		this.cur_opt5_tier2 = cur_opt5_tier2;
	}
	public int getCur_opt5_tier3() {
		return cur_opt5_tier3;
	}
	public void setCur_opt5_tier3(int cur_opt5_tier3) {
		this.cur_opt5_tier3 = cur_opt5_tier3;
	}
	public int getCur_opt5_tier4() {
		return cur_opt5_tier4;
	}
	public void setCur_opt5_tier4(int cur_opt5_tier4) {
		this.cur_opt5_tier4 = cur_opt5_tier4;
	}
	public int getRe_base_tier1() {
		return re_base_tier1;
	}
	public void setRe_base_tier1(int re_base_tier1) {
		this.re_base_tier1 = re_base_tier1;
	}
	public int getRe_base_tier2() {
		return re_base_tier2;
	}
	public void setRe_base_tier2(int re_base_tier2) {
		this.re_base_tier2 = re_base_tier2;
	}
	public int getRe_base_tier3() {
		return re_base_tier3;
	}
	public void setRe_base_tier3(int re_base_tier3) {
		this.re_base_tier3 = re_base_tier3;
	}
	public int getRe_base_tier4() {
		return re_base_tier4;
	}
	public void setRe_base_tier4(int re_base_tier4) {
		this.re_base_tier4 = re_base_tier4;
	}
	public int getRe_opt1_tier1() {
		return re_opt1_tier1;
	}
	public void setRe_opt1_tier1(int re_opt1_tier1) {
		this.re_opt1_tier1 = re_opt1_tier1;
	}
	public int getRe_opt1_tier2() {
		return re_opt1_tier2;
	}
	public void setRe_opt1_tier2(int re_opt1_tier2) {
		this.re_opt1_tier2 = re_opt1_tier2;
	}
	public int getRe_opt1_tier3() {
		return re_opt1_tier3;
	}
	public void setRe_opt1_tier3(int re_opt1_tier3) {
		this.re_opt1_tier3 = re_opt1_tier3;
	}
	public int getRe_opt1_tier4() {
		return re_opt1_tier4;
	}
	public void setRe_opt1_tier4(int re_opt1_tier4) {
		this.re_opt1_tier4 = re_opt1_tier4;
	}
	public int getRe_opt2_tier1() {
		return re_opt2_tier1;
	}
	public void setRe_opt2_tier1(int re_opt2_tier1) {
		this.re_opt2_tier1 = re_opt2_tier1;
	}
	public int getRe_opt2_tier2() {
		return re_opt2_tier2;
	}
	public void setRe_opt2_tier2(int re_opt2_tier2) {
		this.re_opt2_tier2 = re_opt2_tier2;
	}
	public int getRe_opt2_tier3() {
		return re_opt2_tier3;
	}
	public void setRe_opt2_tier3(int re_opt2_tier3) {
		this.re_opt2_tier3 = re_opt2_tier3;
	}
	public int getRe_opt2_tier4() {
		return re_opt2_tier4;
	}
	public void setRe_opt2_tier4(int re_opt2_tier4) {
		this.re_opt2_tier4 = re_opt2_tier4;
	}
	public int getRe_opt3_tier1() {
		return re_opt3_tier1;
	}
	public void setRe_opt3_tier1(int re_opt3_tier1) {
		this.re_opt3_tier1 = re_opt3_tier1;
	}
	public int getRe_opt3_tier2() {
		return re_opt3_tier2;
	}
	public void setRe_opt3_tier2(int re_opt3_tier2) {
		this.re_opt3_tier2 = re_opt3_tier2;
	}
	public int getRe_opt3_tier3() {
		return re_opt3_tier3;
	}
	public void setRe_opt3_tier3(int re_opt3_tier3) {
		this.re_opt3_tier3 = re_opt3_tier3;
	}
	public int getRe_opt3_tier4() {
		return re_opt3_tier4;
	}
	public void setRe_opt3_tier4(int re_opt3_tier4) {
		this.re_opt3_tier4 = re_opt3_tier4;
	}
	public int getRe_opt4_tier1() {
		return re_opt4_tier1;
	}
	public void setRe_opt4_tier1(int re_opt4_tier1) {
		this.re_opt4_tier1 = re_opt4_tier1;
	}
	public int getRe_opt4_tier2() {
		return re_opt4_tier2;
	}
	public void setRe_opt4_tier2(int re_opt4_tier2) {
		this.re_opt4_tier2 = re_opt4_tier2;
	}
	public int getRe_opt4_tier3() {
		return re_opt4_tier3;
	}
	public void setRe_opt4_tier3(int re_opt4_tier3) {
		this.re_opt4_tier3 = re_opt4_tier3;
	}
	public int getRe_opt4_tier4() {
		return re_opt4_tier4;
	}
	public void setRe_opt4_tier4(int re_opt4_tier4) {
		this.re_opt4_tier4 = re_opt4_tier4;
	}
	public int getRe_opt5_tier1() {
		return re_opt5_tier1;
	}
	public void setRe_opt5_tier1(int re_opt5_tier1) {
		this.re_opt5_tier1 = re_opt5_tier1;
	}
	public int getRe_opt5_tier2() {
		return re_opt5_tier2;
	}
	public void setRe_opt5_tier2(int re_opt5_tier2) {
		this.re_opt5_tier2 = re_opt5_tier2;
	}
	public int getRe_opt5_tier3() {
		return re_opt5_tier3;
	}
	public void setRe_opt5_tier3(int re_opt5_tier3) {
		this.re_opt5_tier3 = re_opt5_tier3;
	}
	public int getRe_opt5_tier4() {
		return re_opt5_tier4;
	}
	public void setRe_opt5_tier4(int re_opt5_tier4) {
		this.re_opt5_tier4 = re_opt5_tier4;
	}
	*/
}
