/**
 * The global state selectors
 */
import { fromJS, Map, List } from 'immutable';
import { createSelector } from 'reselect';
import { createRFPPlan, mappingLifeStdLtdClassesPlan, generateRfpStateAncillary } from '@benrevo/benrevo-react-rfp';
import {
  RFP_MEDICAL_SECTION,
  RFP_DENTAL_SECTION,
  RFP_VISION_SECTION,
  RFP_LIFE_SECTION,
  RFP_STD_SECTION,
  RFP_LTD_SECTION,
  RATE_TYPE_COMPOSITE,
  PERCENT,
  DOLLAR,
  PERCENT_SIGN,
  DOLLAR_SIGN,
  VOLUNTARY_SIGN,
} from './constants';

const selectRfpBroker = (state) => state.get('rfpBroker');
const selectRfp = (state) => state.get('rfp');
const selectApp = (state) => state.get('app');
const selectCurrentClient = (state) => state.get('clients').get('current');

const makeSelectCarriers = createSelector(
  selectRfpBroker,
  (substate) => {
    const selectedCarriers = substate.get('selectedCarriers').toJS();
    const carrierEmailList = substate.get('carrierEmailList').toJS();
    const submissions = substate.get('submissions').toJS();
    const customCarriersEmails = substate.get('customCarriersEmails').toJS();
    const data = [];

    for (let i = 0; i < Object.keys(selectedCarriers).length; i += 1) {
      const key = Object.keys(selectedCarriers)[i];
      const product = selectedCarriers[key];

      for (let j = 0; j < Object.keys(product).length; j += 1) {
        const carrier = product[Object.keys(product)[j]];
        const submission = getSubmission(submissions, carrier.carrierId, key);
        let isAdd = true;
        let customEmails = [];
        if (customCarriersEmails[carrier.carrierId]) customEmails = customCarriersEmails[carrier.carrierId];

        for (let m = 0; m < data.length; m += 1) {
          const storedCarrier = data[m];

          if (storedCarrier.carrier.carrierId === carrier.carrierId) {
            isAdd = false;
            storedCarrier.products.push({ product: key, date: submission.submissionDate });
            break;
          }
        }

        if (isAdd) {
          data.push({
            carrier,
            emails: getEmails(carrierEmailList, carrier.carrierId),
            customEmails,
            products: [{ product: key, date: submission.submissionDate }],
          });
        }
      }
    }

    return data;
  }
);

const selectRfpData = createSelector(
  selectRfpBroker,
  selectRfp,
  makeSelectCarriers,
  (substate, rfp, data) => {
    const products = substate.get('selectedProducts').toJS();
    const response = [];

    for (let m = 0; m < data.length; m += 1) {
      const carrier = data[m];
      const item = { carrierId: carrier.carrier.carrierId, emails: carrier.customEmails, rfpIds: [] };
      let isAdd = false;

      for (let i = 0; i < carrier.products.length; i += 1) {
        const { product, date } = carrier.products[i];
        const rfpProduct = rfp.get(product).toJS();

        if (!date && products[carrier.carrier.carrierId] && products[carrier.carrier.carrierId][product]) {
          item.rfpIds.push(rfpProduct.id);
          isAdd = true;
        }
      }

      if (isAdd) response.push(item);
    }

    return response;
  }
);

function getEmails(list, carrierId) {
  for (let i = 0; i < list.length; i += 1) {
    const item = list[i];
    if (item.carrierId === carrierId) return item.emails;
  }

  return [];
}

function getSubmission(list, carrierId, product) {
  for (let i = 0; i < list.length; i += 1) {
    const item = list[i];
    if (item.carrierId === carrierId && item.product === product.toUpperCase()) return item;
  }

  return {};
}

/**
 * Maps Current Option client state into response
 */

function generateCurrentOptionSubmission(rfpType, state, clientState, ancillaryType) {
  const rfp = {};
  const substate = state.get(rfpType);

  rfp.clientId = clientState.get('id');
  rfp.ratingTiers = substate.get('tier');
  rfp.product = rfpType.toUpperCase();

  if (rfpType === RFP_LIFE_SECTION || rfpType === RFP_STD_SECTION || rfpType === RFP_LTD_SECTION) {
    rfp.eap = (substate.get('eap') === 'yes');
    rfp.visits = substate.get('visits');
  }

  if (substate.has('plans')) {
    rfp.optionPlans = mappingPlan(substate.get('plans'), substate.get('rateType'), substate.get('contributionType'));
  } else rfp.optionPlans = [];

  if (substate.has('basicPlan') && ancillaryType === 'basicPlan') {
    rfp.plan = mappingLifeStdLtdClassesPlan(substate.get('basicPlan'), ancillaryType, rfpType);
  }

  if (substate.has('voluntaryPlan') && ancillaryType === 'voluntaryPlan') {
    rfp.plan = mappingLifeStdLtdClassesPlan(substate.get('voluntaryPlan'), ancillaryType, rfpType);
  }

  return rfp;
}

const mappingPlanTiers = (plan, item, tiersTitle, name) => {
  const elem = item;
  plan[name].map((tier, i) => {
    elem[`tier${i + 1 + tiersTitle}`] = (tier.value === '') ? null : tier.value;
    return true;
  });
};

const mappingPlan = (data, rateType, contributionType) => {
  const arr = [];
  const plans = data.toJS();

  plans.map((plan) => {
    const item = {
      incumbentPlanName: plan.name,
      incumbentPlanType: plan.title,
      outOfStateContribution: plan.outOfStateAmount,
      outOfStateRenewal: plan.outOfStateRenewal,
      outOfStateRate: plan.outOfStateCurrent,
      outOfStateEnrollment: plan.outOfStateEnrollment,
      incumbentPlanId: plan.incumbentPlanId, // todo: TEMP!!
      incumbentNetworkId: plan.selectedNetwork.networkId,
      carrierId: plan.selectedCarrier.carrierId,
    };

    if (contributionType === PERCENT_SIGN) item.erContributionFormat = PERCENT;
    else if (contributionType === DOLLAR_SIGN) item.erContributionFormat = DOLLAR;
    else item.erContributionFormat = VOLUNTARY_SIGN;

    if (rateType) {
      item.rateType = rateType;
      if (plan.monthlyBandedPremium) item.monthlyBandedPremium = plan.monthlyBandedPremium.value || null;
      if (plan.oufOfStateMonthlyBandedPremium) item.oufOfStateMonthlyBandedPremium = plan.oufOfStateMonthlyBandedPremium.value || null;
      if (plan.monthlyBandedPremiumRenewal) item.monthlyBandedPremiumRenewal = plan.monthlyBandedPremiumRenewal.value || null;
      if (plan.oufOfStateMonthlyBandedPremiumRenewal) item.oufOfStateMonthlyBandedPremiumRenewal = plan.oufOfStateMonthlyBandedPremiumRenewal.value || null;
    }

    if (plan.id) item.planId = plan.id;

    mappingPlanTiers(plan, item, 'Contribution', 'contributionAmount');
    mappingPlanTiers(plan, item, 'Rate', 'currentRates');
    mappingPlanTiers(plan, item, 'Renewal', 'renewalRates');
    mappingPlanTiers(plan, item, 'Enrollment', 'contributionEnrollment');

    mappingPlanTiers(plan, item, 'OosContribution', 'outOfStateAmountTiers');
    mappingPlanTiers(plan, item, 'OosRate', 'outOfStateCurrentTiers');
    mappingPlanTiers(plan, item, 'OosRenewal', 'outOfStateRenewalTiers');
    mappingPlanTiers(plan, item, 'OosEnrollment', 'outOfStateContributionEnrollment');

    arr.push(item);

    return true;
  });

  return arr;
};

/**
 * Maps Current Option response state back into client
 */

function generateCurrentOptionState(state, item, section) {
  let rfp = fromJS({});
  let RATE_TYPE = RATE_TYPE_COMPOSITE;
  rfp = rfp.set(section, state.get(section));
  let substate = rfp.get(section);
  if (!substate) return false;

  let contributionType = substate.get('contributionType');

  if (item.optionPlans.length) {
    if (item.optionPlans[0].erContributionFormat === PERCENT) contributionType = PERCENT_SIGN;
    else if (item.optionPlans[0].erContributionFormat === DOLLAR) contributionType = DOLLAR_SIGN;
    else contributionType = VOLUNTARY_SIGN;
  }

  // item.ratingTiers = 4;

  substate = substate.merge({
    clientId: item.clientId,
    contributionType,
    optionCount: item.optionPlans.length,
    tier: item.ratingTiers ? item.ratingTiers : 1,
    formErrors: substate.get('formErrors'),
    networksLoading: substate.get('networksLoading'),
  });

  if (item.optionPlans.length) {
    substate = substate.set('plans', mappingPlanState(item.optionPlans, item.ratingTiers));
    if (section === RFP_MEDICAL_SECTION) {
      RATE_TYPE = item.optionPlans[0].rateType;
    }
  } else {
    let network = 'HMO';

    if (section === RFP_DENTAL_SECTION) network = 'DHMO';
    if (section === RFP_VISION_SECTION) network = 'VISION';

    substate = substate.set('plans', fromJS([createRFPPlan(null, section, 1, network)]));
    substate = substate.set('optionCount', 1);
  }

  rfp = rfp.set(section, substate);

  if (section === RFP_MEDICAL_SECTION) rfp = rfp.setIn([RFP_MEDICAL_SECTION, 'rateType'], RATE_TYPE);
  return { rfp };
}

function generateCurrentAncillaryOptionState(state, data, section) {
  let rfp = fromJS({});
  rfp = rfp.set(section, state.get(section));
  let substate = rfp.get(section);
  if (!substate) return false;

  substate = substate.merge({
    formErrors: substate.get('formErrors'),
  });

  substate = generateRfpStateAncillary(substate, data, data.plans, section);

  rfp = rfp.set(section, substate);

  return { rfp };
}

const mappingPlanState = (data, tiers) => {
  let arr = List([]);
  data.map((plan) => {
    let item = fromJS({
      name: plan.incumbentPlanName,
      title: plan.incumbentPlanType || '',
      outOfStateAmount: plan.outOfStateContribution,
      outOfStateRenewal: plan.outOfStateRenewal,
      outOfStateCurrent: plan.outOfStateRate,
      outOfStateEnrollment: plan.outOfStateEnrollment,
      monthlyBandedPremium: { value: plan.monthlyBandedPremium },
      oufOfStateMonthlyBandedPremium: { value: plan.oufOfStateMonthlyBandedPremium },
      id: plan.planId,
      incumbentPlanId: plan.incumbentPlanId, // todo: TEMP!!
      selectedCarrier: {
        carrierId: plan.carrierId,
      },
      selectedNetwork: {
        networkId: plan.incumbentNetworkId,
      },
    });

    let tierContributions = fromJS([]);
    let tierRates = fromJS([]);
    let tierRenewals = fromJS([]);
    let contributionEnrollment = fromJS([]);
    let tierOosContributions = fromJS([]);
    let tierOosRates = fromJS([]);
    let tierOosRenewals = fromJS([]);
    let tierOosEnrollment = fromJS([]);

    for (let i = 0; i < tiers; i += 1) {
      let contribution = plan[`tier${i + 1}Contribution`];
      if (contribution === undefined) contribution = '';

      let rate = plan[`tier${i + 1}Rate`];
      if (rate === undefined) rate = '';

      let renewal = plan[`tier${i + 1}Renewal`];
      if (renewal === undefined) renewal = '';

      let enrollment = plan[`tier${i + 1}Enrollment`];
      if (enrollment === undefined) enrollment = '';

      let oosContribution = plan[`tier${i + 1}OosContribution`];
      if (oosContribution === undefined) oosContribution = '';

      let oosRate = plan[`tier${i + 1}OosRate`];
      if (!oosRate === undefined) oosRate = '';

      let oosRenewal = plan[`tier${i + 1}OosRenewal`];
      if (oosRenewal === undefined) oosRenewal = '';

      let oosEnrollment = plan[`tier${i + 1}OosEnrollment`];
      if (oosEnrollment === undefined) oosEnrollment = '';

      tierContributions = tierContributions.push(Map({ value: contribution }));
      tierRates = tierRates.push(Map({ value: rate }));
      tierRenewals = tierRenewals.push(Map({ value: renewal }));
      contributionEnrollment = contributionEnrollment.push(Map({ value: enrollment }));
      tierOosContributions = tierOosContributions.push(Map({ value: oosContribution }));
      tierOosRates = tierOosRates.push(Map({ value: oosRate }));
      tierOosRenewals = tierOosRenewals.push(Map({ value: oosRenewal }));
      tierOosEnrollment = tierOosEnrollment.push(Map({ value: oosEnrollment }));
    }

    item = item.set('contributionAmount', tierContributions)
      .set('currentRates', tierRates)
      .set('renewalRates', tierRenewals)
      .set('contributionEnrollment', contributionEnrollment)
      .set('outOfStateAmountTiers', tierOosContributions)
      .set('outOfStateCurrentTiers', tierOosRates)
      .set('outOfStateRenewalTiers', tierOosRenewals)
      .set('outOfStateContributionEnrollment', tierOosEnrollment);
    arr = arr.push(item);

    return true;
  });

  return arr;
};

const selectCurrentOptionState = (data, section) => createSelector(
  selectRfp,
  (substate) => {
    if (section === RFP_LIFE_SECTION || section === RFP_STD_SECTION || section === RFP_LTD_SECTION) {
      return generateCurrentAncillaryOptionState(substate, data, section);
    }

    return generateCurrentOptionState(substate, data, section);
  }
);

const selectCurrentOptionRequest = (section, ancillaryType) => createSelector(
  selectRfp,
  selectCurrentClient,
  (substate, clientState) => generateCurrentOptionSubmission(section, substate, clientState, ancillaryType)
);

const selectBenefitsFromSection = (section) => createSelector(
  selectRfp,
  (substate) => ({ plans: substate.get(section).get('benefits').toJS(), clientPlans: substate.get(section).get('plans').toJS() })
);

export {
  createSelector,
  selectApp,
  makeSelectCarriers,
  selectRfpData,
  selectCurrentOptionState,
  generateCurrentAncillaryOptionState,
  selectCurrentOptionRequest,
  selectBenefitsFromSection,
};
