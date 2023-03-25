package com.benrevo.common.params.rfp;

import com.benrevo.common.params.RFPParams;

public class RFPRatesDisability extends RFPParams {

	//Long Term Disability
	double cur_ltd_rate;
	double re_ltd_rate;

	//Short Term Disability
	double cur_std;
	double re_std;
	
	//getter and setters
	public double getCur_ltd_rate() {
		return cur_ltd_rate;
	}
	public void setCur_ltd_rate(double cur_ltd_rate) {
		this.cur_ltd_rate = cur_ltd_rate;
	}
	public double getRe_ltd_rate() {
		return re_ltd_rate;
	}
	public void setRe_ltd_rate(double re_ltd_rate) {
		this.re_ltd_rate = re_ltd_rate;
	}
	public double getCur_std() {
		return cur_std;
	}
	public void setCur_std(double cur_std) {
		this.cur_std = cur_std;
	}
	public double getRe_std() {
		return re_std;
	}
	public void setRe_std(double re_std) {
		this.re_std = re_std;
	}
}
