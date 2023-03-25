import { fromJS, Map } from 'immutable';

export const initialState = {
};

export const additionalState = fromJS({
  isMatch: true,
  accordionActiveIndex: [false, true, false, false],
  selectedSection: 'medical',
  SelectedIncumbent: Map(),
  SelectedCarriers: Map(),
  comparePlans: {
    allPlansToCompare: [],
    allOptionsToCompare: [],
    currentPlan: {},
    sectionSelected: 'MEDICAL',
    clientPlans: [],
    clientPlansLoading: false,
    clientPlanSelected: null,
    clientPlanCarriers: [],
    clientPlanCarriersSelected: [],
    planFilterChanged: false,
  },
  plansForImportBenefits: [],
  rxPlansForImportBenefits: [],
  benefitsLoading: false,
  medical: {
    providersData: {
      uhc: [],
      anthem: [],
    },
    providersColumns: {
      uhc: {},
      anthem: {},
    },
    newPlan: {
      pnnId: null,
    },
    types: ['HMO', 'PPO', 'HSA', 'RX_PPO', 'RX_HMO'],
    planTypeTemplates: Map(),
    violationNotification: Map(),
    violationModalText: Map(),
    plansForDropDown: Map(),
    optionNameLoading: false,
    matchSelectedRxPlan: Map(),
    matchSelectedPlan: Map(),
    unchangedFirstSelectedRxPlan: Map(),
    unchangedFirstSelectedPlan: Map(),
    unchangedSecondSelectedRxPlan: Map(),
    unchangedSecondSelectedPlan: Map(),
  },
  dental: {
    types: ['DPPO', 'DHMO'],
    planTypeTemplates: Map(),
    violationNotification: Map(),
    violationModalText: Map(),
    plansForDropDown: Map(),
    optionNameLoading: false,
    newPlan: {
      pnnId: null,
    },
    matchSelectedRxPlan: Map(),
    matchSelectedPlan: Map(),
    unchangedFirstSelectedRxPlan: Map(),
    unchangedFirstSelectedPlan: Map(),
    unchangedSecondSelectedRxPlan: Map(),
    unchangedSecondSelectedPlan: Map(),
  },
  vision: {
    types: ['VISION'],
    planTypeTemplates: Map(),
    violationNotification: Map(),
    violationModalText: Map(),
    plansForDropDown: Map(),
    optionNameLoading: false,
    newPlan: {
      pnnId: null,
    },
    matchSelectedRxPlan: Map(),
    matchSelectedPlan: Map(),
    unchangedFirstSelectedRxPlan: Map(),
    unchangedFirstSelectedPlan: Map(),
    unchangedSecondSelectedRxPlan: Map(),
    unchangedSecondSelectedPlan: Map(),
  },
  life: {
    planTypeTemplates: Map(),
  },
  std: {
    planTypeTemplates: Map(),
  },
  ltd: {
    planTypeTemplates: Map(),
  },
  vol_life: {
    planTypeTemplates: Map(),
  },
  vol_std: {
    planTypeTemplates: Map(),
  },
  vol_ltd: {
    planTypeTemplates: Map(),
  },
});
