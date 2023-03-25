import { fromJS, Map, List } from 'immutable';
import { createSelector } from 'reselect';
import moment from 'moment';
import {
  RFP_MEDICAL_SECTION,
  RFP_DENTAL_SECTION,
  RFP_VISION_SECTION,
  RFP_LIFE_SECTION,
  RFP_STD_SECTION,
  RFP_LTD_SECTION,
  RFP_MEDICAL_TEXT,
  RFP_DENTAL_TEXT,
  RFP_VISION_TEXT,
  RFP_LIFE_TEXT,
  RFP_STD_TEXT,
  RFP_LTD_TEXT,
  SECTION_LAST_UPDATE,
  RATE_TYPE_COMPOSITE,
  ATTR_VALID_WAIVERS,
  ATTR_INVALID_WAIVERS,
  ATTR_FIXED_UW_COMMENTS,
  ATTR_TEXT_UW_COMMENTS,
  ATTR_KAISER_OR_SIMNSA,
} from './constants';
import { createPlan } from './reducer/state';


/* eslint-disable */


/**
 * Get states
 */

const selectRfpSection = (state, section) => {
  return state.get('rfp').get(section);
};

const selectRfp = () => (state) => {
  return {
    rfp: state.get('rfp'),
    rfpFiles: state.get('rfpFiles'),
    client: state.get('clients').get('current'),
    currentChanged: state.get('clients').get('currentChanged'),
  };
};

const selectRfpCarrier = () => (state) => {
  return {
    rfp: state.get('rfp'),
    carrier: state.get('carrier'),
  };
};

const selectRfpClient = () => (state) => state.get('clients').get('current');

const selectRfpClientChanged = () => (state) => state.get('clients').get('currentChanged');

const selectRfpFiles = () => (state) => state.get('rfpFiles');

const selectState = () => (state) => {
  return state
};

/**
 * Maps RFP client state into response
 */

function generateRfpSubmission(rfpType, state, virgin) {
  const rfp = {};
  const substate = state.rfp.get(rfpType);
  const waitingPeriodSection = state.rfp.get(RFP_MEDICAL_SECTION);
  const id = substate.get('id');
  if (id) {
    rfp.id = id;
  }

  rfp.client_id = state.client.get('id'); //camel case on client id throws a 500
  rfp.alongside = substate.get('alongside');
  rfp.buyUp = (substate.get('buyUp') === 'yes');
  rfp.comments = substate.get('additionalRequests');
  rfp.commission = substate.get('commission');
  rfp.contributionType = substate.get('contributionType');
  rfp.optionCount = substate.get('optionCount');
  rfp.carrierHistories = mappingCarriers(substate.get('carriers'), substate.get('previousCarriers'), id);
  rfp.paymentMethod = substate.get('payType');
  rfp.priorCarrier = (substate.get('previousCarrier') === 'yes');
  rfp.brokerOfRecord = (substate.get('brokerOfRecord') === 'yes');
  rfp.quoteAlteTiers = (substate.get('ratingTiers') === 'N/A') ? 0 : substate.get('ratingTiers');
  rfp.ratingTiers = substate.get('tier');
  rfp.selfFunding = (substate.get('selfFunding') === 'yes');
  rfp.takeOver = substate.get('takeOver');
  rfp.largeClaims = substate.get('diagnosisAndStatus');
  rfp.product = rfpType.toUpperCase();

  if (substate.get('attributes') && substate.get('attributes').size) {
    rfp.attributes = {};

    substate.get('attributes').map((item, i) => {
      if (item && i === ATTR_VALID_WAIVERS) rfp.attributes[i] = item;
      else if (item && i === ATTR_INVALID_WAIVERS) rfp.attributes[i] = item;
      else if (item && i === ATTR_FIXED_UW_COMMENTS) rfp.attributes[i] = item;
      else if (item && i === ATTR_TEXT_UW_COMMENTS) rfp.attributes[i] = item;
      else if (item && i === ATTR_KAISER_OR_SIMNSA) rfp.attributes[i] = item;
    });
  }

  if (rfpType === RFP_LIFE_SECTION || rfpType === RFP_STD_SECTION || rfpType === RFP_LTD_SECTION) {
    rfp.eap = (substate.get('eap') === 'yes');
    rfp.visits = substate.get('visits');
  }

  if (waitingPeriodSection.has('daysAfterHire')) {
    rfp.waitingPeriod = waitingPeriodSection.get('daysAfterHire');
  }

  if (substate.has('plans')) {
    rfp.options = mappingPlan(substate.get('plans'), substate.get('rateType'), virgin);

    if (rfpType === RFP_DENTAL_SECTION || rfpType === RFP_VISION_SECTION) {
      rfp.comments = '';
      substate.get('plans').map((plan, i) => {
        rfp.comments += plan.get('additionalRequests');

        if (i !== substate.get('plans').size - 1 && substate.get('plans').size > 1) {
          rfp.comments += ' ';
        }
      });
    }
  } else rfp.options = [];

  if (substate.has('basicPlan') && substate.get('basicPlan').get('added') && substate.get('basicPlan').get('carrierId')) {
    rfp.basicPlan = mappingLifeStdLtdClassesPlan(substate.get('basicPlan'), 'basicPlan', rfpType);
  }

  if (substate.has('voluntaryPlan') && substate.get('voluntaryPlan').get('added') && substate.get('voluntaryPlan').get('carrierId')) {
    rfp.voluntaryPlan = mappingLifeStdLtdClassesPlan(substate.get('voluntaryPlan'), 'voluntaryPlan', rfpType);
  }

  return rfp;
}

const mappingCarriers = (current, previous, rfpId) => {
  const carriers = [];
  const addCarriers = (list, isCurrent) => {
    list.map((item) => {
      if (item.get('title') || item.get('years')) {
        let elem = {
          current: isCurrent,
          name: item.get('title'),
          years: item.get('years') ? parseInt(item.get('years')) : null,
        };

        if (rfpId) elem.rfpId = rfpId;
        if (item.get('id')) elem.id = item.get('id');

        carriers.push(elem);
      }
    });
  };

  addCarriers(current, true);
  addCarriers(previous, false);

  return carriers;
};

const mappingPlanTiers = (plan, item, tiersTitle, name, virgin) => {
  plan[name].map((tier, i) => {
    if (!virgin) item[`tier${i+1 + tiersTitle}`] = (tier.value === '') ? null : tier.value;
    else item[`tier${i+1 + tiersTitle}`] = 0;
    return true;
  });
};

const mappingPlan = (data, rateType, virgin) => {
  let arr = [];
  let plans = data.toJS();

  plans.map((plan) => {

    let item = {
      label: plan.name,
      planType: plan.title,
      matchCurrent: (plan.likeToMatchCurrent === 'yes'),
      quoteAlt: (plan.alternativeQuote === 'yes'),
      outOfStateContribution: plan.outOfStateAmount,
      outOfStateRenewal: plan.outOfStateRenewal,
      outOfStateRate: plan.outOfStateCurrent,
      outOfStateCensus: plan.outOfStateEnrollment,
      altRequest: plan.additionalRequests,
      selectedNetwork: plan.selectedNetwork,
      selectedCarrier: plan.selectedCarrier,
    };

    if (rateType) {
      item.rateType = rateType;
      if (plan.monthlyBandedPremium) item.monthlyBandedPremium = plan.monthlyBandedPremium.value || null;
      if (plan.oufOfStateMonthlyBandedPremium) item.oufOfStateMonthlyBandedPremium = plan.oufOfStateMonthlyBandedPremium.value || null;
      if (plan.monthlyBandedPremiumRenewal) item.monthlyBandedPremiumRenewal = plan.monthlyBandedPremiumRenewal.value || null;
      if (plan.oufOfStateMonthlyBandedPremiumRenewal) item.oufOfStateMonthlyBandedPremiumRenewal = plan.oufOfStateMonthlyBandedPremiumRenewal.value || null;
    }

    if (plan.rfpId) item.rfpId = plan.rfpId;
    if (plan.id) item.id = plan.id;

    mappingPlanTiers(plan, item, 'Contribution', 'contributionAmount');
    mappingPlanTiers(plan, item, 'Rate', 'currentRates', virgin);
    mappingPlanTiers(plan, item, 'Renewal', 'renewalRates');
    mappingPlanTiers(plan, item, 'Census', 'contributionEnrollment', virgin);

    mappingPlanTiers(plan, item, 'OosContribution', 'outOfStateAmountTiers'); //confirm this is correct field
    mappingPlanTiers(plan, item, 'OosRate', 'outOfStateCurrentTiers', (plan.outOfStateCurrent && virgin) ? virgin : null);
    mappingPlanTiers(plan, item, 'OosRenewal', 'outOfStateRenewalTiers');
    mappingPlanTiers(plan, item, 'OosCensus', 'outOfStateContributionEnrollment', (plan.outOfStateEnrollment && virgin) ? virgin : null);

    arr.push(item);
  });

  return arr;
};

const mappingLifeStdLtdClassesPlan = (data, type, rfpType) => {
  const plan = data.toJS();
  plan.planType = (type === 'basicPlan') ? 'BASIC' : 'VOLUNTARY';
  delete plan.added;

  if (rfpType === RFP_LIFE_SECTION) {
    for (let i = 0; i < plan.classes.length; i += 1) {
      const item = plan.classes[i];

      if (!item.percentage) item.percentage = null;
    }
  }

  if (rfpType === RFP_LTD_SECTION) {
    for (let i = 0; i < plan.classes.length; i += 1) {
      const item = plan.classes[i];

      // item.waiverOfPremium = item.waiverOfPremium === 'yes';
    }
  }

  return plan;
};

/**
 * Maps RFP response state back into client
 */

function generateRfpState(state, data, plans) {
  let rfp = fromJS({});
  let files = null;
  const filesList = [];
  const dateFormat = SECTION_LAST_UPDATE;
  let RATE_TYPE = RATE_TYPE_COMPOSITE;
  let lastDate = 0;
  rfp = rfp.set(RFP_MEDICAL_SECTION, state.rfp.get(RFP_MEDICAL_SECTION));
  rfp = rfp.set(RFP_DENTAL_SECTION, state.rfp.get(RFP_DENTAL_SECTION));
  rfp = rfp.set(RFP_VISION_SECTION, state.rfp.get(RFP_VISION_SECTION));
  rfp = rfp.set(RFP_LIFE_SECTION, state.rfp.get(RFP_LIFE_SECTION));
  rfp = rfp.set(RFP_STD_SECTION, state.rfp.get(RFP_STD_SECTION));
  rfp = rfp.set(RFP_LTD_SECTION, state.rfp.get(RFP_LTD_SECTION));
  data.map((item) => {
    const section = item.product.toLowerCase();
    if (section !== RFP_LIFE_SECTION && section !== RFP_STD_SECTION && section !== RFP_LTD_SECTION && section !== RFP_MEDICAL_SECTION && section !== RFP_DENTAL_SECTION && section !== RFP_VISION_SECTION) return;

    let substate = rfp.get(section);
    const oldPlans = (substate.get('plans')) ? substate.get('plans').toJS() : null;

    if (!substate) return false;

    substate = substate.merge({
      id: item.id,
      clientId: item.clientId,
      alongside: item.alongside,
      buyUp: (item.buyUp) ? 'yes' : 'no',
      additionalRequests: item.comments,
      commission: item.commission ? item.commission.toString() : '',
      optionCount: item.optionCount,
      contributionType: item.contributionType,
      payType: item.paymentMethod,
      previousCarrier: (item.priorCarrier) ? 'yes' : 'no',
      brokerOfRecord: (item.brokerOfRecord) ? 'yes' : 'no',
      ratingTiers: (item.quoteAlteTiers && item.quoteAlteTiers !== '0') ? item.quoteAlteTiers.toString() : 'N/A',
      tier: item.ratingTiers ? item.ratingTiers : 1,
      selfFunding: (item.selfFunding) ? 'yes' : 'no',
      takeOver: item.takeOver,
      diagnosisAndStatus: item.largeClaims,
      lastUpdated: moment(item.lastUpdated).format(dateFormat),
      submissionStatuses: item.submissionStatuses,
      formErrors: substate.get('formErrors'),
      networksLoading: substate.get('networksLoading'),
      attributes: item.attributes,
    });

    if (section === RFP_LIFE_SECTION || section === RFP_STD_SECTION || section === RFP_LTD_SECTION) {
      substate = generateRfpStateAncillary(substate, item, plans[section], section);
    } else {
      if (item.options.length) {
        substate = substate.set('plans', mappingPlanState(item.options, item.ratingTiers, (plans) ? plans[section] : [], oldPlans));
        if (section === RFP_MEDICAL_SECTION) {
          RATE_TYPE = item.options[0].rateType;
        }
      } else {
        let network = 'HMO';

        if (section === RFP_DENTAL_SECTION) network = 'DHMO';
        if (section === RFP_VISION_SECTION) network = 'VISION';

        substate = substate.set('plans', fromJS([createPlan(null, section, 1, network)]));
        substate = substate.set('optionCount', 1);
      }
    }

    substate = substate.merge(mappingCarrierState(item.carrierHistories));

    if (item.waitingPeriod) {
      substate = substate.set('daysAfterHire', item.waitingPeriod);
    }

    if (moment(new Date(lastDate)).isBefore(item.lastUpdated)) lastDate = substate.get('lastUpdated');

    rfp = rfp.set(section, substate);

    if (item.fileInfoList) {
      for (let i = 0; i < item.fileInfoList.length; i += 1) {
        const file = item.fileInfoList[i];
        filesList.push({ file, section},);
      }
    }
  });

  rfp = rfp.setIn(['rates'], state.rfp.get('rates'));
  rfp = rfp.setIn(['rates', 'lastUpdated'], lastDate);
  rfp = rfp.setIn(['medical', 'rateType'], RATE_TYPE);
  rfp = rfp.setIn(['enrollment'], state.rfp.get('enrollment'));
  rfp = rfp.setIn(['enrollment', 'lastUpdated'], lastDate);
  rfp = rfp.setIn(['common', 'requestError'], false);
  rfp = rfp.setIn(['common', 'showErrors'], false);
  rfp = rfp.setIn(['common', 'carriersLoaded'], state.rfp.get('common').get('carriersLoaded'));
  rfp = rfp.setIn(['common', 'dtq'], true);
  // rfp = rfp.setIn(['client', 'formErrors'], Map({}));

  files = createFiles(state.rfpFiles, filesList);

  return { rfp, files };
}

function generateRfpStateAncillary(state, data, plans, section) {
  let maxAgeTo = 0;
  let maxFirstIndex = 0;
  let basicPlan = null;
  let volPlan = null;
  let substate = state;
  substate = substate.set('eap', (data.eap) ? 'yes' : 'no');
  substate = substate.set('visits', data.visits);

  if (plans.length) {
    for (let i = 0; i < plans.length; i += 1) {
      const plan = plans[i];

      if (plan.planType === 'BASIC') basicPlan = plan;
      if (plan.planType === 'VOLUNTARY') volPlan = plan;
    }
  }

  if (basicPlan) {
    substate = substate.set('basicPlan', substate.get('basicPlan').mergeDeep(mappingLifeStdLtdClassesPlanState(basicPlan, 'basicPlan', section)));
  } else substate = substate.setIn(['basicPlan', 'added'], true);

  if (volPlan) {
    substate = substate.set('voluntaryPlan', substate.get('voluntaryPlan').mergeDeep(mappingLifeStdLtdClassesPlanState(volPlan, 'voluntaryPlan', section)));
  } else substate = substate.setIn(['voluntaryPlan', 'added'], true);

  substate.get('voluntaryPlan').get('rates').get('ages').map((item, i) => {
    if (item.get('from') < 30 && item.get('to') > maxAgeTo) {
      maxAgeTo = item.get('to');
      maxFirstIndex = i;
    }
  });

  substate = substate.set('maxFirstIndex', maxFirstIndex);
  substate = substate.set('maxLastIndex', substate.get('voluntaryPlan').get('rates').get('ages').size - 1);

  return substate;
}

const mappingCarrierState = (carriers) => {
  const emptyCarrier = Map({
    title: '',
    years: '',
  });
  const final = {
    carriers: fromJS([]),
    previousCarriers: fromJS([]),
  };

  if (carriers && carriers.length) {
    carriers.map((item) => {
      let elem = Map({
        title: item.name,
        years: item.years || null,
        rfpId: item.rfpId,
        id: item.id,
      });

      if (item.current) final.carriers = final.carriers.push(elem);
      else final.previousCarriers = final.previousCarriers.push(elem);
    });
  }

  if (final.carriers.size === 0) final.carriers = final.carriers.push(emptyCarrier);
  if (final.previousCarriers.size === 0) final.previousCarriers = final.previousCarriers.push(emptyCarrier);

  return final;
};

const mappingPlanState = (data, tiers, rfpPlans, oldPlans) => {
  let arr = List([]);
  data.map((plan, i) => {
    const rfpPlan = getRfpPlan(rfpPlans, plan.id);
    let item = fromJS({
      name: plan.label,
      title: plan.planType || '',
      // matchCurrent: true,
      // quoteAlt: true,
      likeToMatchCurrent: plan.matchCurrent ? 'yes': 'no',
      alternativeQuote: plan.quoteAlt ? 'yes' : 'no',
      additionalRequests: plan.altRequest,
      outOfStateAmount: plan.outOfStateContribution,
      outOfStateRenewal: plan.outOfStateRenewal,
      outOfStateCurrent: plan.outOfStateRate,
      outOfStateEnrollment: plan.outOfStateCensus,
      rfpId: plan.rfpId,
      id: plan.id,
      monthlyBandedPremium: { value: plan.monthlyBandedPremium },
      oufOfStateMonthlyBandedPremium: { value: plan.oufOfStateMonthlyBandedPremium },
      monthlyBandedPremiumRenewal: { value: plan.monthlyBandedPremiumRenewal },
      oufOfStateMonthlyBandedPremiumRenewal: { value: plan.oufOfStateMonthlyBandedPremiumRenewal },
      selectedCarrier: {
        carrierId: rfpPlan.carrierId || (oldPlans && oldPlans[i] && oldPlans[i].selectedCarrier.carrierId),
      },
      selectedNetwork: {
        networkId: rfpPlan.rfpQuoteNetworkId || (oldPlans && oldPlans[i] && oldPlans[i].selectedNetwork.networkId),
      },
    });

    let tierContributions = fromJS([]);
    let tierRates = fromJS([]);
    let tierRenewals = fromJS([]);
    let contributionEnrollment = fromJS([]);
    let tierOosContributions = fromJS([]);
    let tierOosRates = fromJS([]);
    let tierOosRenewals = fromJS([]);
    let tierOosCensus = fromJS([]);

    for (let i = 0; i < tiers; i += 1) {
      let contribution = plan[`tier${i+1}Contribution`];
      if (contribution === undefined) contribution = '';

      let rate = plan[`tier${i+1}Rate`];
      if (rate === undefined) rate = '';

      let renewal = plan[`tier${i+1}Renewal`];
      if (renewal === undefined) renewal = '';

      let census = plan[`tier${i+1}Census`];
      if (census === undefined) census = '';

      let oosContribution = plan[`tier${i+1}OosContribution`];
      if (oosContribution === undefined) oosContribution = '';

      let oosRate = plan[`tier${i+1}OosRate`];
      if (!oosRate === undefined) oosRate = '';

      let oosRenewal = plan[`tier${i+1}OosRenewal`];
      if (oosRenewal === undefined) oosRenewal = '';

      let oosCensus = plan[`tier${i+1}OosCensus`];
      if (oosCensus === undefined) oosCensus = '';

      tierContributions = tierContributions.push(Map({ value: contribution }));
      tierRates = tierRates.push(Map({ value: rate }));
      tierRenewals = tierRenewals.push(Map({ value: renewal }));
      contributionEnrollment = contributionEnrollment.push(Map({ value: census }));
      tierOosContributions = tierOosContributions.push(Map({ value: oosContribution }));
      tierOosRates = tierOosRates.push(Map({ value: oosRate }));
      tierOosRenewals = tierOosRenewals.push(Map({ value: oosRenewal }));
      tierOosCensus = tierOosCensus.push(Map({ value: oosCensus }));
    }

    item = item.set('contributionAmount', tierContributions)
      .set('currentRates', tierRates)
      .set('renewalRates', tierRenewals)
      .set('contributionEnrollment', contributionEnrollment)
      .set('outOfStateAmountTiers', tierOosContributions)
      .set('outOfStateCurrentTiers', tierOosRates)
      .set('outOfStateRenewalTiers', tierOosRenewals)
      .set('outOfStateContributionEnrollment', tierOosCensus);
    const test2 = item.toJS();
    arr = arr.push(item);
  });

  return arr;
};

const mappingLifeStdLtdClassesPlanState = (data, type, rfpType) => {
  const plan = data;

  plan.added = true;

  if (rfpType === RFP_LIFE_SECTION) {
    for (let i = 0; i < plan.classes.length; i += 1) {
      const item = plan.classes[i];

      if (!item.percentage) item.percentage = null;
    }
  }

  if (rfpType === RFP_STD_SECTION) {
    for (let i = 0; i < plan.classes.length; i += 1) {
      const item = plan.classes[i];

      if (!item.waitingPeriodAccident) item.waitingPeriodAccident = null;
      if (!item.waitingPeriodSickness) item.waitingPeriodSickness = null;
    }
  }

  if (rfpType === RFP_LTD_SECTION) {
    for (let i = 0; i < plan.classes.length; i += 1) {
      const item = plan.classes[i];
      // item.waiverOfPremium = (item.waiverOfPremium) ? 'yes' : 'no';

      if (!item.eliminationPeriod) item.eliminationPeriod = null;
    }
  }

  return fromJS(plan);
};

function getRfpPlan (plans, id) {
  for (let m = 0; m < plans.length; m += 1) {
    const plan = plans[m];

    if (plan.optionId === id) {
      return plan;
    }
  }

  return {};
}

/**
 * Maps RFP response state back into client to update
 */

function generateRfpStateToUpdate(state, data) {
  let rfp = fromJS({});
  const dateFormat = SECTION_LAST_UPDATE;
  let RATE_TYPE = RATE_TYPE_COMPOSITE;
  let lastDate = 0;
  rfp = rfp.set(RFP_MEDICAL_SECTION, state.rfp.get(RFP_MEDICAL_SECTION));
  rfp = rfp.set(RFP_DENTAL_SECTION, state.rfp.get(RFP_DENTAL_SECTION));
  rfp = rfp.set(RFP_VISION_SECTION, state.rfp.get(RFP_VISION_SECTION));
  rfp = rfp.set(RFP_LIFE_SECTION, state.rfp.get(RFP_LIFE_SECTION));
  rfp = rfp.set(RFP_STD_SECTION, state.rfp.get(RFP_STD_SECTION));
  rfp = rfp.set(RFP_LTD_SECTION, state.rfp.get(RFP_LTD_SECTION));
  data.map((item) => {
    const section = item.product.toLowerCase();
    if (section !== RFP_LIFE_SECTION && section !== RFP_STD_SECTION && section !== RFP_LTD_SECTION && section !== RFP_MEDICAL_SECTION && section !== RFP_DENTAL_SECTION && section !== RFP_VISION_SECTION) return;
    let substate = rfp.get(section);
    const oldPlans = (substate.get('plans')) ? substate.get('plans').toJS() : null;

    if (!substate) return false;

    substate = substate.merge({
      id: item.id,
      clientId: item.clientId,
      lastUpdated: moment(item.lastUpdated).format(dateFormat),
      submissionStatuses: item.submissionStatuses,
      formErrors: substate.get('formErrors'),
      networksLoading: substate.get('networksLoading'),
      attributes: item.attributes,
    });

    if (section === RFP_MEDICAL_SECTION || section === RFP_DENTAL_SECTION || section === RFP_VISION_SECTION && item.options.length) {
      substate = substate.set('plans', mappingPlanStateToUpdate(item.options, item.ratingTiers, oldPlans));
    } else if (section === RFP_LIFE_SECTION || section === RFP_STD_SECTION || section === RFP_LTD_SECTION) {
    }

    substate = substate.merge(mappingCarrierState(item.carrierHistories));

    if (moment(new Date(lastDate)).isBefore(item.lastUpdated)) lastDate = substate.get('lastUpdated');

    rfp = rfp.set(section, substate);
  });

  rfp = rfp.setIn(['rates'], state.rfp.get('rates'));
  rfp = rfp.setIn(['rates', 'lastUpdated'], lastDate);
  rfp = rfp.setIn(['enrollment'], state.rfp.get('enrollment'));
  rfp = rfp.setIn(['enrollment', 'lastUpdated'], lastDate);
  rfp = rfp.setIn(['common', 'requestError'], false);
  rfp = rfp.setIn(['common', 'carriersLoaded'], state.rfp.get('common').get('carriersLoaded'));
  rfp = rfp.setIn(['common', 'dtq'], true);

  return { rfp };
}

const mappingPlanStateToUpdate = (data, tiers, oldPlans) => {
  data.map((plan, i) => {
    oldPlans[i].id = plan.id;
    oldPlans[i].rfpId = plan.rfpId;
  });

  return fromJS(oldPlans);
};

/**
 * Maps RFP Plans state into response
 */

const selectRfpPlans = (section, data) => createSelector(
  selectRfp(),
  (substate) => {
    const rfp = substate.rfp.get(section).toJS();
    const rfpPlans = data;
    const plans = [];
    if (!rfp.id) {
      console.log('No RFP Id found');
      throw new Error('No RFP Id found');
    }
    for (let i = 0; i < rfpPlans.length; i += 1) {
      const plan = rfpPlans[i];
      if (plan && plan.selectedNetwork.networkId && plan.selectedCarrier.carrierId) {
        plans.push({
          optionId: plan.id,
          nameByNetwork: plan.label || '',
          rfpQuoteNetworkId: plan.selectedNetwork.networkId,
        });
      }
    }

    return { plans, rfpId: rfp.id };
  }
);

/**
 * Selects data for saga - todo Legacy
 */

const selectAllCarriers = (data) => createSelector(
  selectRfp(),
  () => {
    let medical =  [];
    let dental =  [];
    let vision =  [];
    let life =  [];
    let std =  [];
    let ltd =  [];

    for (let i = 0; i < data.medical.length; i += 1) {
      const item = { id: data.medical[i].carrierId, value: data.medical[i].displayName, text: data.medical[i].displayName, name: data.medical[i].name };
      medical.push(item);
    }

    for (let i = 0; i < data.dental.length; i += 1) {
      const item = { id: data.dental[i].carrierId, value: data.dental[i].displayName, text: data.dental[i].displayName, name: data.dental[i].name };
      dental.push(item);
    }

    for (let i = 0; i < data.vision.length; i += 1) {
      const item = { id: data.vision[i].carrierId, value: data.vision[i].displayName, text: data.vision[i].displayName, name: data.vision[i].name };
      vision.push(item);
    }

    for (let i = 0; i < data.life.length; i += 1) {
      const item = { id: data.life[i].carrierId, value: data.life[i].displayName, text: data.life[i].displayName, name: data.life[i].name };
      life.push(item);
    }

    for (let i = 0; i < data.std.length; i += 1) {
      const item = { id: data.std[i].carrierId, value: data.std[i].displayName, text: data.std[i].displayName, name: data.std[i].name };
      std.push(item);
    }

    for (let i = 0; i < data.ltd.length; i += 1) {
      const item = { id: data.ltd[i].carrierId, value: data.ltd[i].displayName, text: data.ltd[i].displayName, name: data.ltd[i].name };
      ltd.push(item);
    }

    return {
      medical,
      dental,
      vision,
      life,
      std,
      ltd,
    }
  }
);

const selectRfpRequest = () => createSelector(
  selectRfp(),
  (substate) => {
    const rfpCommon = substate.rfp.get('common');
    const products = substate.client.get('products');
    const virginCoverage = substate.client.get('virginCoverage').toJS();
    const data = [];
    products.keySeq().forEach((key) => {
      if (products.get(key)) {
        data.push(generateRfpSubmission(key, substate, virginCoverage[key]));
      }
    });

    return {
      rfpComplete: rfpCommon.get('rfpComplete'),
      rfpLastUpdated: rfpCommon.get('rfpLastUpdated'),
      data,
    }
  }
);

const selectClientRequest = () => createSelector(
  selectRfpClient(),
  (substate) => {
    return substate.toJS();
  }
);


const flatten = arr => arr.reduce(
  (acc, val) => acc.concat(
    Array.isArray(val) ? flatten(val) : val
  ),
  []
);

const selectFilesRequest = () => createSelector(
  selectRfpFiles(),
  (substate) => {
    if (!substate) return [];

    let files = substate.toJS();
    let filesToUpload = [];
    Object.keys(files).map((obj) => {
      Object.keys(files[obj]).map((file) => {
        let f = files[obj][file];
        // for some reason plan files is a different structure
        if (file === 'planFiles') {
          let vals = Object.values(f);
          if (typeof vals === 'object') {
            let x = Object.values(vals);
            if (x && x.length >0){
              f = flatten(x);
            }
          }
        }
        if (f.length) {
          for (let i = 0; i < f.length; i += 1) {
            if (!f[i].link) filesToUpload.push(f[i]);
          }
        }
        return file;
      });
      return obj;
    });
    return filesToUpload;
  }
);

function createFiles(state, files) {
  let newState = state;

  for (let i = 0; i < files.length; i += 1) {
    const item = files[i];
    const section = item.section;
    const field = item.file.section;
    const index = item.index;
    let path;

    if (field === 'filesSummary' ||
      field === 'filesCurrentCarriers' ||
      field === 'filesClaims' ||
      field === 'filesCensus') {
      if (index >= 0) {
        path = newState.get(section).get(field).get(index);
        path.link = item.file.link;
        newState = newState.setIn([section, field, index], path);
      }
      else {
        path = newState.get(section).get(field);
        path = path.push(item.file);
        newState = newState.setIn([section, field], path);
      }

    }
    else if (field === 'basePlan') {
      path = newState.get(section).get('planFiles');

      if (!path.has(0)) {
        path = path.set(0, List());
      }

      if (index >= 0) {
        path = path.get(0).get(index);
        path.link = item.file.link;
        newState = newState.setIn([section, 'planFiles', 0, index], path);
      } else {
        path = path.get(0).push(item.file);
        newState = newState.setIn([section, 'planFiles', 0], path);
      }
    }
    else {
      const optionIndex = Number(field.replace(/\D+/g,""));
      path = newState.get(section).get('planFiles');

      if (!path.has(optionIndex)) {
        path = path.set(optionIndex, List());
      }

      if (index >= 0) {
        path = path.get(optionIndex).get(index);
        path.link = item.file.link;
        newState = newState.setIn([section, 'planFiles', optionIndex, index], path);
      } else {
        path = path.get(optionIndex).push(item.file);
        newState = newState.setIn([section, 'planFiles', optionIndex], path);
      }
    }
  }

  return newState;
}

const selectFilesResponse = (files) => createSelector(
  selectRfpFiles(),
  (substate) => {
    return createFiles(substate, files);
  }
);

const selectFileId = (data, section) => createSelector(
  selectRfpFiles(),
  (substate) => {
    let id = null;
    let file = substate.get(section);

    if (data.name) file = file.get(data.name).get(data.index);
    else file = file.get('planFiles').get(data.index).get(data.fileIndex);

    if (file.link) {
      const index = file.link.lastIndexOf('=');
      id = +file.link.substring(index+1, file.link.length);
    }

    return id;
  }
);

const selectRfpState = (data, plans) => createSelector(
  selectRfp(),
  (substate) => {
    return generateRfpState(substate, data, plans);
  }
);

const updateRfpState = (data) => createSelector(
  selectRfp(),
  (substate) => {
    return generateRfpStateToUpdate(substate, data);
  }
);

const selectRfpSelected = () => createSelector(
  selectState(),
  (substate) => {
    const selected = selectSelected(substate);
    const rfp = substate.get('rfp').toJS();
    const ids = [];

    for (let key in selected) {
      if (selected.hasOwnProperty(key) && selected[key]) {
        if (rfp[key].id) ids.push(rfp[key].id);
      }
    }

    return ids;
  }
);


/**
 * Selects data
 */

const selectPlansCarrierList = createSelector(
  selectRfpSection,
  (substate) => {
    const carriers = substate.get('carriers').toJS();
    const carrierList = substate.get('carrierList').toJS();
    const finalCarriers = [];

    for (let i = 0; i < carriers.length; i += 1) {
      for (let j = 0; j < carrierList.length; j += 1) {
        const listItem = carrierList[j];
        if (listItem.text === carriers[i].title) {
          finalCarriers.push({
            key: listItem.id,
            value: listItem.id,
            text: listItem.text,
          });
          break;
        }
      }
    }
    return finalCarriers;
  }
);

const selectSectionTitle = (section) => {
  let title = '';

  switch (section) {
    case RFP_MEDICAL_SECTION:
      title = RFP_MEDICAL_TEXT;
      break;
    case RFP_DENTAL_SECTION:
      title = RFP_DENTAL_TEXT;
      break;
    case RFP_VISION_SECTION:
      title = RFP_VISION_TEXT;
      break;
    case RFP_LIFE_SECTION:
      title = RFP_LIFE_TEXT;
      break;
    case RFP_STD_SECTION:
      title = RFP_STD_TEXT;
      break;
    case RFP_LTD_SECTION:
      title = RFP_LTD_TEXT;
      break;
    default:
      title = '';
      break;
  }

  return title;
};

const selectCarrierYears = createSelector(
  selectRfpSection,
  () => {
    const years = [];

    for (let i = 1; i <= 10; i += 1) {
      years.push({
        key: i,
        value: i,
        text: i,
      });
    }

    return years;
  }
);

const selectSelected = createSelector(
  selectRfpCarrier(),
  selectRfpClient(),
  (substate, client) => {
    const selected = substate.carrier.get('selected').toJS();
    const products = client.get('products').toJS();
    const medicalSubmittedDate = substate.rfp.get('medical').get('submissionStatuses').size;
    const dentalSubmittedDate = substate.rfp.get('dental').get('submissionStatuses').size;
    const visionSubmittedDate = substate.rfp.get('vision').get('submissionStatuses').size;
    const lifeSubmittedDate = substate.rfp.get('life').get('submissionStatuses').size;
    const stdSubmittedDate = substate.rfp.get('std').get('submissionStatuses').size;
    const ltdSubmittedDate = substate.rfp.get('ltd').get('submissionStatuses').size;

    if (medicalSubmittedDate) selected.medical = medicalSubmittedDate > 0;
    if (dentalSubmittedDate) selected.dental = dentalSubmittedDate > 0;
    if (visionSubmittedDate) selected.vision = visionSubmittedDate > 0;
    if (lifeSubmittedDate) selected.life = lifeSubmittedDate > 0;
    if (stdSubmittedDate) selected.std = stdSubmittedDate > 0;
    if (ltdSubmittedDate) selected.ltd = ltdSubmittedDate > 0;

    for (let i = 0; i < Object.keys(products).length; i += 1) {
      const key = Object.keys(products)[i];
      if (!products[key]) selected[key] = false;
    }

    return selected;
  }
);

const selectOtherCarrier = createSelector(
  selectRfpSection,
  (substate) => {
    const carrierList = substate.get('carrierList').toJS();
    let otherCarrier = null;
    for (let j = 0; j < carrierList.length; j += 1) {
      const listItem = carrierList[j];
      if (listItem.name === 'OTHER') {
        otherCarrier = listItem;
        break;
      }
    }

    return otherCarrier;
  }
);

const selectAllPlans = createSelector(
  selectRfp(),
  (substate) => {
    const rfp = substate.rfp;
    const products = substate.client.get('products').toJS();
    const plans = {};

    for (let i = 0; i < Object.keys(products).length; i += 1) {
      const key = Object.keys(products)[i];

      if (products[key] && rfp.get(key).get('plans')) {
        plans[key] = rfp.get(key).get('plans').toJS();
      }
    }

    return plans;
  }
);

const selectNetworksLoading = (section) => createSelector(
  selectRfp(),
  (substate) => substate.rfp.get(section).get('networksLoading'),
);

const selectPendingSave = createSelector(
  selectRfp(),
  (substate) => substate.rfp.get('common').get('pendingSave'),
);

export {
  selectRfpPlans,
  selectAllCarriers,
  selectRfpRequest,
  selectRfp,
  selectClientRequest,
  selectRfpClientChanged,
  selectRfpState,
  updateRfpState,
  selectFilesRequest,
  selectFileId,
  selectFilesResponse,
  selectRfpSelected,
  selectRfpCarrier,
  selectPlansCarrierList,
  selectCarrierYears,
  selectSectionTitle,
  selectSelected,
  selectOtherCarrier,
  selectNetworksLoading,
  selectPendingSave,
  selectAllPlans,
  mappingLifeStdLtdClassesPlanState,
  mappingLifeStdLtdClassesPlan,
  generateRfpStateAncillary,
};
