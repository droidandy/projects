import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import { clientsReducerState } from '@benrevo/benrevo-react-clients';
import {
  selectClientRequest,
  selectFilesRequest,
  selectRfpClientChanged,
  selectRfpRequest,
  selectRfpState,
} from '../selectors';
import { FETCH_RFP_SUCCEEDED } from '../constants';
import { addPlanFile } from '../actions';
import { initialRfpMasterState } from './../reducer/state';

describe('send to carrier selector', () => {
  let mockedState;
  let finalRfp;
  const rfp = [
    {
      id: '1',
      client_id: undefined,
      product: 'MEDICAL',
      paymentMethod: '%',
      contributionType: '%',
      commission: '11',
      brokerOfRecord: false,
      priorCarrier: true,
      ratingTiers: 1,
      optionCount: 1,
      waitingPeriod: 'Date of hire',
      carrierHistories: [],
      options: [
        {
          id: '1',
          rfpId: '1',
          label: '',
          planType: '',
          tier1Contribution: 1,
          outOfStateContribution: false,
          outOfStateCensus: false,
          outOfStateRate: false,
          tier1OosContribution: null,
          tier1Rate: null,
          tier1OosRate: null,
          tier1Renewal: null,
          tier1Census: null,
          tier1OosCensus: null,
          outOfStateRenewal: false,
          tier1OosRenewal: null,
          matchCurrent: true,
          quoteAlt: true,
          monthlyBandedPremium: null,
          monthlyBandedPremiumRenewal: null,
          oufOfStateMonthlyBandedPremium: null,
          oufOfStateMonthlyBandedPremiumRenewal: null,
          rateType: 'COMPOSITE',
          altRequest: undefined,
          selectedCarrier: { carrierId: null },
          selectedNetwork: { networkId: null },
        },
      ],
      buyUp: true,
      selfFunding: true,
      alongside: false,
      takeOver: false,
      largeClaims: '',
      quoteAlteTiers: '',
      comments: '',
    },
    {
      id: '2',
      client_id: undefined,
      product: 'DENTAL',
      contributionType: '%',
      carrierHistories: [],
      paymentMethod: '%',
      commission: '',
      brokerOfRecord: false,
      priorCarrier: false,
      ratingTiers: 1,
      optionCount: 1,
      waitingPeriod: 'Date of hire',
      options: [
        {
          id: '2',
          rfpId: '2',
          label: '',
          planType: 'DHMO',
          tier1Contribution: null,
          outOfStateContribution: false,
          tier1OosContribution: null,
          tier1Rate: null,
          tier1OosRate: null,
          tier1Renewal: null,
          tier1Census: null,
          tier1OosCensus: null,
          outOfStateRenewal: false,
          outOfStateCensus: false,
          outOfStateRate: false,
          tier1OosRenewal: null,
          matchCurrent: false,
          quoteAlt: false,
          altRequest: '',
          selectedCarrier: { carrierId: null },
          selectedNetwork: { networkId: null },
        },
      ],
      buyUp: false,
      selfFunding: false,
      alongside: undefined,
      takeOver: undefined,
      largeClaims: undefined,
      quoteAlteTiers: '1',
      comments: undefined,
    },
    {
      id: '3',
      client_id: undefined,
      product: 'VISION',
      carrierHistories: [],
      contributionType: '%',
      paymentMethod: '%',
      commission: '',
      brokerOfRecord: false,
      priorCarrier: false,
      ratingTiers: 1,
      optionCount: 1,
      waitingPeriod: 'Date of hire',
      options: [
        {
          id: '3',
          rfpId: '3',
          label: '',
          planType: 'VISION',
          tier1Contribution: null,
          outOfStateContribution: false,
          outOfStateCensus: false,
          tier1OosContribution: null,
          tier1Rate: null,
          tier1OosRate: null,
          tier1Renewal: null,
          tier1Census: null,
          tier1OosCensus: null,
          outOfStateRenewal: false,
          tier1OosRenewal: null,
          matchCurrent: false,
          outOfStateRate: false,
          quoteAlt: false,
          altRequest: '',
          selectedCarrier: { carrierId: null },
          selectedNetwork: { networkId: null },
        },
      ],
      buyUp: false,
      selfFunding: false,
      alongside: undefined,
      takeOver: undefined,
      largeClaims: undefined,
      quoteAlteTiers: '1',
      comments: undefined,
    },
  ];
  const rfpOutput = [
    ...rfp,
    /* {
      client_id: undefined,
      contributionType: undefined,
      largeClaims: undefined,
      alongside: undefined,
      optionCount: undefined,
      quoteAlteTiers: undefined,
      ratingTiers: undefined,
      takeOver: undefined,
      visits: undefined,
      buyUp: false,
      comments: '',
      commission: '',
      carrierHistories: [],
      options: [],
      paymentMethod: '%',
      priorCarrier: true,
      brokerOfRecord: true,
      selfFunding: false,
      product: 'LIFE',
      eap: false,
      waitingPeriod: 'Date of hire',
      basicPlan: {
        planType: 'BASIC',
        classes: [{
          name: '',
          waiverOfPremium: true,
          deathBenefit: true,
          conversion: true,
          portability: true,
          percentage: null,
        }],
        rates: { currentADD: null, currentLife: null, renewalADD: null, renewalLife: null },
      },
      voluntaryPlan: {
        planType: 'VOLUNTARY',
        classes: [{
          name: '',
          waiverOfPremium: true,
          deathBenefit: true,
          conversion: true,
          portability: true,
          percentage: null,
        }],
        rates: {
          employee: true,
          employeeT: true,
          spouse: true,
          rateChildADD: null,
          rateChildLife: null,
          rateEmpADD: null,
          rateSpouseADD: null,
          spouseBased: 'Employee Age',
          ages: [
            { from: 0, to: 29, currentEmp: null, currentEmpT: null, currentSpouse: null, renewalEmp: null, renewalEmpT: null, renewalSpouse: null },
            { from: 30, to: 34, currentEmp: null, currentEmpT: null, currentSpouse: null, renewalEmp: null, renewalEmpT: null, renewalSpouse: null },
            { from: 35, to: 39, currentEmp: null, currentEmpT: null, currentSpouse: null, renewalEmp: null, renewalEmpT: null, renewalSpouse: null },
            { from: 40, to: 44, currentEmp: null, currentEmpT: null, currentSpouse: null, renewalEmp: null, renewalEmpT: null, renewalSpouse: null },
            { from: 45, to: 49, currentEmp: null, currentEmpT: null, currentSpouse: null, renewalEmp: null, renewalEmpT: null, renewalSpouse: null },
            { from: 50, to: 54, currentEmp: null, currentEmpT: null, currentSpouse: null, renewalEmp: null, renewalEmpT: null, renewalSpouse: null },
            { from: 55, to: 59, currentEmp: null, currentEmpT: null, currentSpouse: null, renewalEmp: null, renewalEmpT: null, renewalSpouse: null },
            { from: 60, to: 64, currentEmp: null, currentEmpT: null, currentSpouse: null, renewalEmp: null, renewalEmpT: null, renewalSpouse: null },
            { from: 65, to: 69, currentEmp: null, currentEmpT: null, currentSpouse: null, renewalEmp: null, renewalEmpT: null, renewalSpouse: null },
            { from: 70, to: null, currentEmp: null, currentEmpT: null, currentSpouse: null, renewalEmp: null, renewalEmpT: null, renewalSpouse: null },
          ],
        },
      },
    },
    {
      client_id: undefined,
      buyUp: false,
      comments: '',
      commission: '',
      contributionType: undefined,
      largeClaims: undefined,
      alongside: undefined,
      optionCount: undefined,
      quoteAlteTiers: undefined,
      ratingTiers: undefined,
      takeOver: undefined,
      visits: undefined,
      carrierHistories: [],
      options: [],
      paymentMethod: '%',
      priorCarrier: true,
      brokerOfRecord: true,
      selfFunding: false,
      product: 'STD',
      eap: false,
      waitingPeriod: 'Date of hire',
      basicPlan: {
        classes: [{ name: '', waitingPeriodAccident: null, waitingPeriodSickness: null }],
        rates: { current: null, renewal: null },
        planType: 'BASIC',
      },
      voluntaryPlan: {
        classes: [{
          name: '',
          waitingPeriodAccident: null,
          waitingPeriodSickness: null,
          conditionExclusion: '',
          conditionExclusionOther: '',
        }],
        rates: {
          ages: [{ from: 0, to: 29, current: null, renewal: null }, {
            from: 30,
            to: 34,
            current: null,
            renewal: null,
          }, { from: 35, to: 39, current: null, renewal: null }, {
            from: 40,
            to: 44,
            current: null,
            renewal: null,
          }, { from: 45, to: 49, current: null, renewal: null }, {
            from: 50,
            to: 54,
            current: null,
            renewal: null,
          }, { from: 55, to: 59, current: null, renewal: null }, {
            from: 60,
            to: 64,
            current: null,
            renewal: null,
          }, { from: 65, to: 69, current: null, renewal: null }, {
            from: 70,
            to: null,
            current: null,
            renewal: null,
          }],
        },
        planType: 'VOLUNTARY',
      },
    }, {
      client_id: undefined,
      contributionType: undefined,
      largeClaims: undefined,
      alongside: undefined,
      optionCount: undefined,
      quoteAlteTiers: undefined,
      ratingTiers: undefined,
      takeOver: undefined,
      buyUp: false,
      comments: '',
      commission: '',
      carrierHistories: [],
      options: [],
      paymentMethod: '%',
      priorCarrier: true,
      brokerOfRecord: true,
      selfFunding: false,
      product: 'LTD',
      eap: true,
      visits: 1,
      waitingPeriod: 'Date of hire',
      basicPlan: {
        classes: [{
          abuseLimitation: '',
          eliminationPeriod: null,
          premiumsPaid: true,
          name: '',
          abuseLimitationOther: '',
          occupationDefinitionOther: '',
          conditionExclusion: '',
          conditionExclusionOther: '',
          occupationDefinition: '',
        }],
        rates: {
          current: null,
          renewal: null,
        },
        planType: 'BASIC',
      },
      voluntaryPlan: {
        classes: [{
          abuseLimitation: '',
          eliminationPeriod: null,
          premiumsPaid: true,
          name: '',
          abuseLimitationOther: '',
          occupationDefinitionOther: '',
          conditionExclusion: '',
          conditionExclusionOther: '',
          occupationDefinition: '',
        }],
        rates: {
          ages: [{ from: 0, to: 29, current: null, renewal: null }, {
            from: 30,
            to: 34,
            current: null,
            renewal: null,
          }, { from: 35, to: 39, current: null, renewal: null }, {
            from: 40,
            to: 44,
            current: null,
            renewal: null,
          }, { from: 45, to: 49, current: null, renewal: null }, {
            from: 50,
            to: 54,
            current: null,
            renewal: null,
          }, { from: 55, to: 59, current: null, renewal: null }, {
            from: 60,
            to: 64,
            current: null,
            renewal: null,
          }, { from: 65, to: 69, current: null, renewal: null }, {
            from: 70,
            to: null,
            current: null,
            renewal: null,
          }],
        },
        planType: 'VOLUNTARY',
      },
    }, */
  ];

  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      rfp: initialRfpMasterState,
      clients: clientsReducerState,
    });
    store = mockStore(initialState);

    const rfpState = selectRfpState(rfp);
    finalRfp = rfpState(store.getState());
    store.dispatch({ type: FETCH_RFP_SUCCEEDED, payload: finalRfp.rfp });
    mockedState = store.getState();
  });

  it('selectRfpRequest should return an rfp product.', () => {
    const rfpSelector = selectRfpRequest();
    rfp[0].quoteAlteTiers = 0;
    const data = {
      rfpComplete: undefined,
      rfpLastUpdated: undefined,
      data: rfpOutput,
    };
    expect(rfpSelector(mockedState)).toEqual(data);
  });

  it('selectClientRequest should return an client.', () => {
    const clientSelector = selectClientRequest();
    const client = {
      address: '',
      addressComplementary: '',
      brokerId: null,
      businessType: '',
      city: '',
      clientName: '',
      clientState: '',
      contactAddress: '',
      contactCity: '',
      contactEmail: '',
      contactFax: '',
      contactName: '',
      contactPhone: '',
      contactState: '',
      contactTitle: '',
      contactZip: '',
      dateQuestionnaireCompleted: '',
      domesticPartner: '',
      dueDate: '',
      effectiveDate: '',
      employeeCount: '',
      employeeTotal: '',
      fedTaxId: '',
      imageUrl: '',
      lastVisited: '',
      membersCount: '',
      cobraCount: '',
      minimumHours: '',
      orgType: '',
      outToBidReason: '',
      participatingEmployees: '',
      policyNumber: '',
      retireesCount: '',
      averageAge: '',
      sicCode: '',
      predominantCounty: '',
      state: '',
      website: '',
      zip: '',
      attributes: [],
      products: {
        medical: true,
        dental: true,
        vision: true,
        life: false,
        std: false,
        ltd: false,
      },
      virginCoverage: {
        medical: false,
        dental: false,
        vision: false,
        life: false,
        std: false,
        ltd: false,
      },
      declinedOutside: false,
      isNew: undefined,
    };
    expect(clientSelector(mockedState)).toEqual(client);
  });

  it('should select the selectRfpClientChanged', () => {
    const clientChangedSelector = selectRfpClientChanged();

    expect(clientChangedSelector(mockedState)).toEqual(false);
  });

  it('should select the selectFilesRequest', () => {
    const clientChangedSelector = selectFilesRequest();
    const parts = [
      new Blob(['you construct a file...'], { type: 'text/plain' }),
      ' Same way as you do with blob',
      new Uint16Array([33]),
    ];
    const file = new File(parts, 'sample.txt', {
      lastModified: new Date(0),
      type: 'overide/mimetype',
    });

    const files = [file];
    store.dispatch(addPlanFile('medical', files, 0));
    expect(clientChangedSelector(mockedState)).toEqual([]);
  });
});

