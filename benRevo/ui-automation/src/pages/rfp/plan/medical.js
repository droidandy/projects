import {Selector} from 'testcafe';

export default class PlanMedicalTab {
    constructor() {
        this.deductible = Selector("#INDIVIDUAL_DEDUCTIBLE");
        this.oopLimit = Selector("#INDIVIDUAL_OOP_LIMIT");
        this.pcp = Selector("#PCP");
        this.specialist = Selector("#SPECIALIST");
        this.inpatientHospital = Selector("#INPATIENT_HOSPITAL");
        this.inpatientCopayType = Selector("[name='IP_COPAY_TYPE_0'] input");
        this.outpatientSurgery = Selector("#OUTPATIENT_SURGERY");
        this.emergencyRoom = Selector("#EMERGENCY_ROOM");
        this.urgentCare = Selector("#URGENT_CARE");
        this.deductibleType = Selector("[name='DEDUCTIBLE_TYPE_0'] input");
        this.combineMedRxDeductible = Selector("[name='COMBINE_MED_RX_DEDUCTIBLE_0'] input");
        this.rxIndividualDeductible = Selector("#RX_INDIVIDUAL_DEDUCTIBLE");
        this.rxFamilyDeductible = Selector("#RX_FAMILY_DEDUCTIBLE");
        this.memberCopayTier1 = Selector("#MEMBER_COPAY_TIER_1");
        this.memberCopayTier2 = Selector("#MEMBER_COPAY_TIER_2");
        this.memberCopayTier3 = Selector("#MEMBER_COPAY_TIER_3");
        this.memberCopayTier4 = Selector("#MEMBER_COPAY_TIER_4");
        this.mailOrder = Selector("#MAIL_ORDER");
    }

}