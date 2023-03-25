import {Selector} from 'testcafe';

export default class PlanDentalTab {
    constructor() {
        this.oralExamination = Selector("#ORAL_EXAMINATION");
        this.adultProphylaxisCleaning = Selector("#ADULT_PROPHY");
        this.childProphylaxisCleaning = Selector("#CHILD_PROPHY");
        this.silverFillingOneSurface = Selector("#SILVER_FILL_1_SURFACE");
        this.whiteFillingOneSurfaceAnterior = Selector("#WHITE_FILL_1_SURFACE_ANTERIOR");
        this.molarRootCanal = Selector("#MOLAR_ROOT_CANAL");
        this.perioMaintenance = Selector("#PERIO_MAINTAINANCE");
        this.simpleExtractionEruptedTooth = Selector("#SIMPLE_EXTRACTION_ERUPTED_TOOTH");
        this.othodontiaServicesAdults = Selector("#ORTHO_SERVICES_ADULTS");
        this.orthodontiaServicesChildren = Selector("#ORTHO_SERVICES_CHILDREN");
    }

}