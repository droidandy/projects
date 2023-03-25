package com.benrevo.common.params.rfp.deprecated;

import com.benrevo.common.params.RFPParams;

/**
 * DEPRECATED: This class should be deleted
 */
public class RFPVisionParams extends RFPParams{

	/*
	//Vision Page 1
	private String visionPaidMethod;
	private String visionPaidPercent;
	private String visionCurrCarrier;
	private String visionCurrCarrierYears;
	private String visionPriSelection;
	private String visionPrevCarrier;
	private String visionPrevCarrierYears;

	//Vision Page 2
	private String visionTierMethod;
	private String visionMedicalPlan1;
	private String visionMedicalPlan2;
	private String visionMedicalPlan3;
	private String visionMedicalPlan4;
	private String visionMedicalPlan5;
	private String visionMedicalPlan6;
	private String visionMatchCurrent;
	private String visionAlternative;

	//Vision Page 3
	private String visionContriPlan;
	private String visionBaseplan_t1;
	private String visionBaseplan_t2;
	private String visionBaseplan_t3;
	private String visionBaseplan_t4;
	private String visionPlan1_t1;
	private String visionPlan1_t2;
	private String visionPlan1_t3;
	private String visionPlan1_t4;
	private String visionPlan2_t1;
	private String visionPlan2_t2;
	private String visionPlan2_t3;
	private String visionPlan2_t4;
	private String visionPlan3_t1;
	private String visionPlan3_t2;
	private String visionPlan3_t3;
	private String visionPlan3_t4;
	private String visionPlan4_t1;
	private String visionPlan4_t2;
	private String visionPlan4_t3;
	private String visionPlan4_t4;
	private String visionPlan5_t1;
	private String visionPlan5_t2;
	private String visionPlan5_t3;
	private String visionPlan5_t4;
	private String visionPlan6_t1;
	private String visionPlan6_t2;
	private String visionPlan6_t3;
	private String visionPlan6_t4;
	private String visionBaseplan_opt;

	//Vision Page 4
	private String vision4MatchCurrent;
	private String optionImages;
	private String visionExams;
	private String visionMaterial;
	private String visionFrames;
	private String visionExamsCopay1;
	private String visionExamsCopay2;
	private String visionMaterialCopay1;
	private String visionMaterialCopay2;
	private String visionExam1;
	private String visionExam2;
	private String visionSingleVision1;
	private String visionSingleVision2;
	private String visionSingleVision3;
	private String visionBioFocal1;
	private String visionBioFocal2;
	private String visionTriFocal1;
	private String visionTriFocal2;
	private String LentiLenses1;
	private String LentiLenses2;
	private String visionContactLenses1;
	private String visionContactLenses2;
	private String visionContactLenses3;
	private String visionContactThera1;
	private String visionContactThera2;
	private String visionFrameRetails1;
	private String visionFrameRetails2;
	private String visionFrameRetails3;
	private String vision4MatchCurrentAlt;
	public String getVisionPaidMethod() {
		return visionPaidMethod;
	}
	public void setVisionPaidMethod(String visionPaidMethod) {
		this.visionPaidMethod = visionPaidMethod;
	}
	public String getVisionPaidPercent() {
		return visionPaidPercent;
	}
	public void setVisionPaidPercent(String visionPaidPercent) {
		this.visionPaidPercent = visionPaidPercent;
	}
	public String getVisionCurrCarrier() {
		return visionCurrCarrier;
	}
	public void setVisionCurrCarrier(String visionCurrCarrier) {
		this.visionCurrCarrier = visionCurrCarrier;
	}
	public String getVisionCurrCarrierYears() {
		return visionCurrCarrierYears;
	}
	public void setVisionCurrCarrierYears(String visionCurrCarrierYears) {
		this.visionCurrCarrierYears = visionCurrCarrierYears;
	}
	public String getVisionPriSelection() {
		return visionPriSelection;
	}
	public void setVisionPriSelection(String visionPriSelection) {
		this.visionPriSelection = visionPriSelection;
	}
	public String getVisionPrevCarrier() {
		return visionPrevCarrier;
	}
	public void setVisionPrevCarrier(String visionPrevCarrier) {
		this.visionPrevCarrier = visionPrevCarrier;
	}
	public String getVisionPrevCarrierYears() {
		return visionPrevCarrierYears;
	}
	public void setVisionPrevCarrierYears(String visionPrevCarrierYears) {
		this.visionPrevCarrierYears = visionPrevCarrierYears;
	}
	public String getVisionTierMethod() {
		return visionTierMethod;
	}
	public void setVisionTierMethod(String visionTierMethod) {
		this.visionTierMethod = visionTierMethod;
	}
	public String getVisionMedicalPlan1() {
		return visionMedicalPlan1;
	}
	public void setVisionMedicalPlan1(String visionMedicalPlan1) {
		this.visionMedicalPlan1 = visionMedicalPlan1;
	}
	public String getVisionMedicalPlan2() {
		return visionMedicalPlan2;
	}
	public void setVisionMedicalPlan2(String visionMedicalPlan2) {
		this.visionMedicalPlan2 = visionMedicalPlan2;
	}
	public String getVisionMedicalPlan3() {
		return visionMedicalPlan3;
	}
	public void setVisionMedicalPlan3(String visionMedicalPlan3) {
		this.visionMedicalPlan3 = visionMedicalPlan3;
	}
	public String getVisionMedicalPlan4() {
		return visionMedicalPlan4;
	}
	public void setVisionMedicalPlan4(String visionMedicalPlan4) {
		this.visionMedicalPlan4 = visionMedicalPlan4;
	}
	public String getVisionMedicalPlan5() {
		return visionMedicalPlan5;
	}
	public void setVisionMedicalPlan5(String visionMedicalPlan5) {
		this.visionMedicalPlan5 = visionMedicalPlan5;
	}
	public String getVisionMedicalPlan6() {
		return visionMedicalPlan6;
	}
	public void setVisionMedicalPlan6(String visionMedicalPlan6) {
		this.visionMedicalPlan6 = visionMedicalPlan6;
	}
	public String getVisionMatchCurrent() {
		return visionMatchCurrent;
	}
	public void setVisionMatchCurrent(String visionMatchCurrent) {
		this.visionMatchCurrent = visionMatchCurrent;
	}
	public String getVisionAlternative() {
		return visionAlternative;
	}
	public void setVisionAlternative(String visionAlternative) {
		this.visionAlternative = visionAlternative;
	}
	public String getVisionContriPlan() {
		return visionContriPlan;
	}
	public void setVisionContriPlan(String visionContriPlan) {
		this.visionContriPlan = visionContriPlan;
	}
	public String getVisionBaseplan_t1() {
		return visionBaseplan_t1;
	}
	public void setVisionBaseplan_t1(String visionBaseplan_t1) {
		this.visionBaseplan_t1 = visionBaseplan_t1;
	}
	public String getVisionBaseplan_t2() {
		return visionBaseplan_t2;
	}
	public void setVisionBaseplan_t2(String visionBaseplan_t2) {
		this.visionBaseplan_t2 = visionBaseplan_t2;
	}
	public String getVisionBaseplan_t3() {
		return visionBaseplan_t3;
	}
	public void setVisionBaseplan_t3(String visionBaseplan_t3) {
		this.visionBaseplan_t3 = visionBaseplan_t3;
	}
	public String getVisionBaseplan_t4() {
		return visionBaseplan_t4;
	}
	public void setVisionBaseplan_t4(String visionBaseplan_t4) {
		this.visionBaseplan_t4 = visionBaseplan_t4;
	}
	public String getVisionPlan1_t1() {
		return visionPlan1_t1;
	}
	public void setVisionPlan1_t1(String visionPlan1_t1) {
		this.visionPlan1_t1 = visionPlan1_t1;
	}
	public String getVisionPlan1_t2() {
		return visionPlan1_t2;
	}
	public void setVisionPlan1_t2(String visionPlan1_t2) {
		this.visionPlan1_t2 = visionPlan1_t2;
	}
	public String getVisionPlan1_t3() {
		return visionPlan1_t3;
	}
	public void setVisionPlan1_t3(String visionPlan1_t3) {
		this.visionPlan1_t3 = visionPlan1_t3;
	}
	public String getVisionPlan1_t4() {
		return visionPlan1_t4;
	}
	public void setVisionPlan1_t4(String visionPlan1_t4) {
		this.visionPlan1_t4 = visionPlan1_t4;
	}
	public String getVisionPlan2_t1() {
		return visionPlan2_t1;
	}
	public void setVisionPlan2_t1(String visionPlan2_t1) {
		this.visionPlan2_t1 = visionPlan2_t1;
	}
	public String getVisionPlan2_t2() {
		return visionPlan2_t2;
	}
	public void setVisionPlan2_t2(String visionPlan2_t2) {
		this.visionPlan2_t2 = visionPlan2_t2;
	}
	public String getVisionPlan2_t3() {
		return visionPlan2_t3;
	}
	public void setVisionPlan2_t3(String visionPlan2_t3) {
		this.visionPlan2_t3 = visionPlan2_t3;
	}
	public String getVisionPlan2_t4() {
		return visionPlan2_t4;
	}
	public void setVisionPlan2_t4(String visionPlan2_t4) {
		this.visionPlan2_t4 = visionPlan2_t4;
	}
	public String getVisionPlan3_t1() {
		return visionPlan3_t1;
	}
	public void setVisionPlan3_t1(String visionPlan3_t1) {
		this.visionPlan3_t1 = visionPlan3_t1;
	}
	public String getVisionPlan3_t2() {
		return visionPlan3_t2;
	}
	public void setVisionPlan3_t2(String visionPlan3_t2) {
		this.visionPlan3_t2 = visionPlan3_t2;
	}
	public String getVisionPlan3_t3() {
		return visionPlan3_t3;
	}
	public void setVisionPlan3_t3(String visionPlan3_t3) {
		this.visionPlan3_t3 = visionPlan3_t3;
	}
	public String getVisionPlan3_t4() {
		return visionPlan3_t4;
	}
	public void setVisionPlan3_t4(String visionPlan3_t4) {
		this.visionPlan3_t4 = visionPlan3_t4;
	}
	public String getVisionPlan4_t1() {
		return visionPlan4_t1;
	}
	public void setVisionPlan4_t1(String visionPlan4_t1) {
		this.visionPlan4_t1 = visionPlan4_t1;
	}
	public String getVisionPlan4_t2() {
		return visionPlan4_t2;
	}
	public void setVisionPlan4_t2(String visionPlan4_t2) {
		this.visionPlan4_t2 = visionPlan4_t2;
	}
	public String getVisionPlan4_t3() {
		return visionPlan4_t3;
	}
	public void setVisionPlan4_t3(String visionPlan4_t3) {
		this.visionPlan4_t3 = visionPlan4_t3;
	}
	public String getVisionPlan4_t4() {
		return visionPlan4_t4;
	}
	public void setVisionPlan4_t4(String visionPlan4_t4) {
		this.visionPlan4_t4 = visionPlan4_t4;
	}
	public String getVisionPlan5_t1() {
		return visionPlan5_t1;
	}
	public void setVisionPlan5_t1(String visionPlan5_t1) {
		this.visionPlan5_t1 = visionPlan5_t1;
	}
	public String getVisionPlan5_t2() {
		return visionPlan5_t2;
	}
	public void setVisionPlan5_t2(String visionPlan5_t2) {
		this.visionPlan5_t2 = visionPlan5_t2;
	}
	public String getVisionPlan5_t3() {
		return visionPlan5_t3;
	}
	public void setVisionPlan5_t3(String visionPlan5_t3) {
		this.visionPlan5_t3 = visionPlan5_t3;
	}
	public String getVisionPlan5_t4() {
		return visionPlan5_t4;
	}
	public void setVisionPlan5_t4(String visionPlan5_t4) {
		this.visionPlan5_t4 = visionPlan5_t4;
	}
	public String getVisionPlan6_t1() {
		return visionPlan6_t1;
	}
	public void setVisionPlan6_t1(String visionPlan6_t1) {
		this.visionPlan6_t1 = visionPlan6_t1;
	}
	public String getVisionPlan6_t2() {
		return visionPlan6_t2;
	}
	public void setVisionPlan6_t2(String visionPlan6_t2) {
		this.visionPlan6_t2 = visionPlan6_t2;
	}
	public String getVisionPlan6_t3() {
		return visionPlan6_t3;
	}
	public void setVisionPlan6_t3(String visionPlan6_t3) {
		this.visionPlan6_t3 = visionPlan6_t3;
	}
	public String getVisionPlan6_t4() {
		return visionPlan6_t4;
	}
	public void setVisionPlan6_t4(String visionPlan6_t4) {
		this.visionPlan6_t4 = visionPlan6_t4;
	}
	public String getVisionBaseplan_opt() {
		return visionBaseplan_opt;
	}
	public void setVisionBaseplan_opt(String visionBaseplan_opt) {
		this.visionBaseplan_opt = visionBaseplan_opt;
	}
	public String getVision4MatchCurrent() {
		return vision4MatchCurrent;
	}
	public void setVision4MatchCurrent(String vision4MatchCurrent) {
		this.vision4MatchCurrent = vision4MatchCurrent;
	}
	public String getOptionImages() {
		return optionImages;
	}
	public void setOptionImages(String optionImages) {
		this.optionImages = optionImages;
	}
	public String getVisionExams() {
		return visionExams;
	}
	public void setVisionExams(String visionExams) {
		this.visionExams = visionExams;
	}
	public String getVisionMaterial() {
		return visionMaterial;
	}
	public void setVisionMaterial(String visionMaterial) {
		this.visionMaterial = visionMaterial;
	}
	public String getVisionFrames() {
		return visionFrames;
	}
	public void setVisionFrames(String visionFrames) {
		this.visionFrames = visionFrames;
	}
	public String getVisionExamsCopay1() {
		return visionExamsCopay1;
	}
	public void setVisionExamsCopay1(String visionExamsCopay1) {
		this.visionExamsCopay1 = visionExamsCopay1;
	}
	public String getVisionExamsCopay2() {
		return visionExamsCopay2;
	}
	public void setVisionExamsCopay2(String visionExamsCopay2) {
		this.visionExamsCopay2 = visionExamsCopay2;
	}
	public String getVisionMaterialCopay1() {
		return visionMaterialCopay1;
	}
	public void setVisionMaterialCopay1(String visionMaterialCopay1) {
		this.visionMaterialCopay1 = visionMaterialCopay1;
	}
	public String getVisionMaterialCopay2() {
		return visionMaterialCopay2;
	}
	public void setVisionMaterialCopay2(String visionMaterialCopay2) {
		this.visionMaterialCopay2 = visionMaterialCopay2;
	}
	public String getVisionExam1() {
		return visionExam1;
	}
	public void setVisionExam1(String visionExam1) {
		this.visionExam1 = visionExam1;
	}
	public String getVisionExam2() {
		return visionExam2;
	}
	public void setVisionExam2(String visionExam2) {
		this.visionExam2 = visionExam2;
	}
	public String getVisionSingleVision1() {
		return visionSingleVision1;
	}
	public void setVisionSingleVision1(String visionSingleVision1) {
		this.visionSingleVision1 = visionSingleVision1;
	}
	public String getVisionSingleVision2() {
		return visionSingleVision2;
	}
	public void setVisionSingleVision2(String visionSingleVision2) {
		this.visionSingleVision2 = visionSingleVision2;
	}
	public String getVisionSingleVision3() {
		return visionSingleVision3;
	}
	public void setVisionSingleVision3(String visionSingleVision3) {
		this.visionSingleVision3 = visionSingleVision3;
	}
	public String getVisionBioFocal1() {
		return visionBioFocal1;
	}
	public void setVisionBioFocal1(String visionBioFocal1) {
		this.visionBioFocal1 = visionBioFocal1;
	}
	public String getVisionBioFocal2() {
		return visionBioFocal2;
	}
	public void setVisionBioFocal2(String visionBioFocal2) {
		this.visionBioFocal2 = visionBioFocal2;
	}
	public String getVisionTriFocal1() {
		return visionTriFocal1;
	}
	public void setVisionTriFocal1(String visionTriFocal1) {
		this.visionTriFocal1 = visionTriFocal1;
	}
	public String getVisionTriFocal2() {
		return visionTriFocal2;
	}
	public void setVisionTriFocal2(String visionTriFocal2) {
		this.visionTriFocal2 = visionTriFocal2;
	}
	public String getLentiLenses1() {
		return LentiLenses1;
	}
	public void setLentiLenses1(String lentiLenses1) {
		LentiLenses1 = lentiLenses1;
	}
	public String getLentiLenses2() {
		return LentiLenses2;
	}
	public void setLentiLenses2(String lentiLenses2) {
		LentiLenses2 = lentiLenses2;
	}
	public String getVisionContactLenses1() {
		return visionContactLenses1;
	}
	public void setVisionContactLenses1(String visionContactLenses1) {
		this.visionContactLenses1 = visionContactLenses1;
	}
	public String getVisionContactLenses2() {
		return visionContactLenses2;
	}
	public void setVisionContactLenses2(String visionContactLenses2) {
		this.visionContactLenses2 = visionContactLenses2;
	}
	public String getVisionContactLenses3() {
		return visionContactLenses3;
	}
	public void setVisionContactLenses3(String visionContactLenses3) {
		this.visionContactLenses3 = visionContactLenses3;
	}
	public String getVisionContactThera1() {
		return visionContactThera1;
	}
	public void setVisionContactThera1(String visionContactThera1) {
		this.visionContactThera1 = visionContactThera1;
	}
	public String getVisionContactThera2() {
		return visionContactThera2;
	}
	public void setVisionContactThera2(String visionContactThera2) {
		this.visionContactThera2 = visionContactThera2;
	}
	public String getVisionFrameRetails1() {
		return visionFrameRetails1;
	}
	public void setVisionFrameRetails1(String visionFrameRetails1) {
		this.visionFrameRetails1 = visionFrameRetails1;
	}
	public String getVisionFrameRetails2() {
		return visionFrameRetails2;
	}
	public void setVisionFrameRetails2(String visionFrameRetails2) {
		this.visionFrameRetails2 = visionFrameRetails2;
	}
	public String getVisionFrameRetails3() {
		return visionFrameRetails3;
	}
	public void setVisionFrameRetails3(String visionFrameRetails3) {
		this.visionFrameRetails3 = visionFrameRetails3;
	}
	public String getVision4MatchCurrentAlt() {
		return vision4MatchCurrentAlt;
	}
	public void setVision4MatchCurrentAlt(String vision4MatchCurrentAlt) {
		this.vision4MatchCurrentAlt = vision4MatchCurrentAlt;
	}
	*/
}
