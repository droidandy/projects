import {Selector} from 'testcafe';

export default class PlanVisionTab {
    constructor() {
        this.examsFrequency = Selector("#EXAMS_FREQUENCY");
        this.lensesFrequency = Selector("#LENSES_FREQUENCY");
        this.framesFrequency = Selector("#FRAMES_FREQUENCY");
        this.contactsFrequency = Selector("#CONTACTS_FREQUENCY");
        this.examCopay = Selector("#EXAM_COPAY");
        this.materialsCopay = Selector("#MATERIALS_COPAY");
        this.contactsAllowance = Selector("#CONTACTS_ALLOWANCE");
        this.frameAllowance = Selector("#FRAME_ALLOWANCE");

    }

}