import { createSelector } from 'reselect';
import { NEW_BUSINESS_TYPE, RENEWAL_TYPE } from './constants';

const selectCurrentClient = () => (state) => state.get('base').get('selectedClient');
const selectBase = () => (state) => state.get('base');
const selectPlans = () => (state) => state.get('plans');
const selectPlansFiles = () => (state) => state.get('plansFiles');
const selectClientPlans = () => (state) => state.get('plans').get('clientPlans').toJS();

const selectClient = () => createSelector(
  selectCurrentClient(),
  (substate) => {
    if (!substate.get('id')) {
      throw new Error('No Client Id found');
    }

    return substate.toJS();
  }
);

const selectInfoForQuote = () => createSelector(
  selectBase(),
  (substate) => {
    const carrier = substate.get('selectedCarrier').toJS();
    const broker = substate.get('currentBroker').toJS();
    const client = substate.get('selectedClient').toJS();
    if (!carrier.carrierId) {
      throw new Error('No Carrier Id found');
    }
    return { carrier, broker, client };
  }
);

const selectQuoteIsEasy = () => createSelector(
  selectPlans(),
  (substate) => {
    const data = {
      medical: substate.get('medical').get('quoteIsEasy'),
      kaiser: substate.get('kaiser').get('quoteIsEasy'),
    };
    return data;
  }
);

const selectLatestsQuoteDates = () => createSelector(
  selectPlans(),
  (substate) => substate.get('quoteDates').toJS()
);

const selectPlansFromSection = (section) => createSelector(
  selectPlans(),
  (substate) => substate.get(section).toJS().plans
);

const selectSummaries = () => createSelector(
  selectPlans(),
  (substate) => {
    const medical = substate.get('summaries').get('medical');
    const dental = substate.get('summaries').get('dental');
    const vision = substate.get('summaries').get('vision');
    const kaiser = substate.get('summaries').get('kaiser');

    return { medical, dental, vision, kaiser };
  }
);

const selectOption1 = () => createSelector(
  selectPlans(),
  (substate) => {
    const selectedQuoteType = substate.get('selectedQuoteType');
    const medicalUse = substate.get('medical').get('option1Use');
    const kaiserUse = substate.get('kaiser').get('option1Use');
    const dentalUse = substate.get('dental').get('option1Use');
    const visionUse = substate.get('vision').get('option1Use');
    const medicalRenewalUse = substate.get('medicalRenewal').get('option1Use');
    const dentalRenewalUse = substate.get('dentalRenewal').get('option1Use');
    const visionRenewalUse = substate.get('visionRenewal').get('option1Use');
    const option1 = {};
    if (medicalUse && selectedQuoteType === NEW_BUSINESS_TYPE) {
      option1.medical = {
        network: substate.get('medical').get('option1').toJS(),
        rfpQuoteId: substate.get('medical').get('quotesLatest'),
        optionType: NEW_BUSINESS_TYPE,
      };
    }
    if (kaiserUse && selectedQuoteType === NEW_BUSINESS_TYPE) {
      option1.kaiser = {
        network: substate.get('kaiser').get('option1').toJS(),
        rfpQuoteId: substate.get('kaiser').get('quotesLatest'),
        optionType: NEW_BUSINESS_TYPE,
      };
    }
    if (dentalUse && selectedQuoteType === NEW_BUSINESS_TYPE) {
      option1.dental = {
        network: substate.get('dental').get('option1').toJS(),
        rfpQuoteId: substate.get('dental').get('quotesLatest'),
        optionType: NEW_BUSINESS_TYPE,
      };
    }
    if (visionUse && selectedQuoteType === NEW_BUSINESS_TYPE) {
      option1.vision = {
        network: substate.get('vision').get('option1').toJS(),
        rfpQuoteId: substate.get('vision').get('quotesLatest'),
        optionType: NEW_BUSINESS_TYPE,
      };
    }
    if (medicalRenewalUse && selectedQuoteType === RENEWAL_TYPE) {
      option1.medical = {
        network: substate.get('medicalRenewal').get('option1').toJS(),
        rfpQuoteId: substate.get('medicalRenewal').get('quotesLatest'),
        optionType: RENEWAL_TYPE,
      };
    }
    if (dentalRenewalUse && selectedQuoteType === RENEWAL_TYPE) {
      option1.dental = {
        network: substate.get('dentalRenewal').get('option1').toJS(),
        rfpQuoteId: substate.get('dentalRenewal').get('quotesLatest'),
        optionType: RENEWAL_TYPE,
      };
    }
    if (visionRenewalUse && selectedQuoteType === RENEWAL_TYPE) {
      option1.vision = {
        network: substate.get('visionRenewal').get('option1').toJS(),
        rfpQuoteId: substate.get('visionRenewal').get('quotesLatest'),
        optionType: RENEWAL_TYPE,
      };
    }
    /* const medical = {
      network: substate.get('medical').get('option1').toJS(),
      rfpQuoteId: substate.get('medical').get('quotesLatest'),
    };
    const kaiser = {
      network: substate.get('kaiser').get('option1').toJS(),
      rfpQuoteId: substate.get('kaiser').get('quotesLatest'),
    };
    const dental = {
      network: substate.get('dental').get('option1').toJS(),
      rfpQuoteId: substate.get('dental').get('quotesLatest'),
    };
    const vision = {
      network: substate.get('vision').get('option1').toJS(),
      rfpQuoteId: substate.get('vision').get('quotesLatest'),
    }; */
    return option1;
  }
);

const selectSummaryLoaded = () => createSelector(
  selectPlans(),
  (substate) => substate.get('summaryLoaded')
);

const selectFiles = () => createSelector(
  selectPlansFiles(),
  (substate) => substate.get('quotes').toJS()
);

const selectPreviewFiles = () => createSelector(
  selectPlansFiles(),
  (substate) => substate.get('preview').toJS()
);

const selectCurrentPlanValid = createSelector(
  selectPlans(),
  (substate) => {
    const medicalPlans = substate.get('medical').get('plans').toJS();
    const dentalPlans = substate.get('dental').get('plans').toJS();
    const visionPlans = substate.get('vision').get('plans').toJS();
    const data = {};
    function checkSection(plans, section) {
      let isValid = true;
      data[section] = {};

      for (let i = 0; i < plans.length; i += 1) {
        const plan = plans[i];

        if (!plan.planName) {
          isValid = false;
        }

        if (!plan.selectedCarrier.carrierId) {
          isValid = false;
        }

        if (!plan.selectedNetwork.networkId) {
          isValid = false;
        }

        for (let j = 0; j < plan.benefits.length; j += 1) {
          const benefit = plan.benefits[j];

          if (!benefit.value && benefit.value !== 0 && !benefit.hidden && checkDependency(benefit, plan.benefits) && ((benefit.valueIn === undefined && benefit.valueOut === undefined) || (benefit.valueIn === null && benefit.valueOut === null))) {
            isValid = false;
          }

          if ((!benefit.valueIn || !benefit.valueOut) && benefit.value === undefined) {
            isValid = false;
          }
        }

        if (plan.rx) {
          for (let j = 0; j < plan.rx.length; j += 1) {
            const rx = plan.rx[j];

            if (!rx.value) {
              isValid = false;
            }
          }
        }
      }

      data[section].valid = isValid;
    }

    if (medicalPlans.length) checkSection(medicalPlans, 'medical');
    if (dentalPlans.length) checkSection(dentalPlans, 'dental');
    if (visionPlans.length) checkSection(visionPlans, 'vision');
    return data;
  }
);

const checkDependency = (field, benefits) => {
  if (!field.dependency) return true;

  for (let i = 0; i < Object.keys(field.dependency).length; i += 1) {
    const sysName = Object.keys(field.dependency)[i];
    const value = field.dependency[sysName];

    for (let j = 0; j < benefits.length; j += 1) {
      const benefit = benefits[j];

      if (sysName === benefit.sysName && (benefit.value === value || benefit.valueIn === value || benefit.valueOut === value)) {
        return true;
      }
    }
  }

  return false;
};

const selectTiers = () => createSelector(
  selectPlans(),
  (subState) => {
    const allData = subState.get('clientPlans').toJS();
    const result = [];
    for (let i = 0; i < allData.length; i += 1) {
      result[i] = [];
      Object.keys(allData[i]).map((key) => {
        if (key.indexOf('tier') !== -1) {
          if (!result[i][key[4] * 1]) result[i][key[4] * 1] = [];
          if (key.indexOf('census') !== -1) result[i][key[4] * 1].census = allData[i][key];
          if (key.indexOf('contribution') !== -1) result[i][key[4] * 1].contribution = allData[i][key];
          if (key.indexOf('rate') !== -1) result[i][key[4] * 1].rate = allData[i][key];
          if (key.indexOf('renewal') !== -1) result[i][key[4] * 1].renewal = allData[i][key];
        }
        return undefined;
      });
    }
    return result;
  }
);

const selectPlanDataChanges = () => createSelector(
  selectPlans(),
  (subState) => {
    const changes = subState.get('changedPlans').toJS();
    const result = [];
    for (let i = 0; i < changes.length; i += 1) {
      if (changes[i] || changes[i] === 0) {
        result.push(changes[i]);
      }
    }
    return result;
  }
);

const selectTeamChanges = () => createSelector(
  selectPlans(),
  (subState) => {
    const deleted = subState.get('removedTeamMembers').toJS();
    const brList = subState.get('brClientTeam').toJS();
    const gaList = subState.get('gaClientTeams').toJS();
    const added = [];
    let addedMembers = [];
    for (let i = 0; i < brList.length; i += 1) {
      if (brList[i].added && brList[i].email) {
        addedMembers.push(brList[i]);
      }
    }
    if (addedMembers.length) added.push(addedMembers);
    for (let i = 0; i < gaList.length; i += 1) {
      addedMembers = [];
      for (let j = 0; j < gaList[i].length; j += 1) {
        if (gaList[i][j].added && gaList[i][j].email) {
          addedMembers.push(gaList[i][j]);
        }
      }
      added.push(addedMembers);
    }

    return {
      deleted,
      added,
    };
  }
);

const checkRenewal = () => createSelector(
  selectPlans(),
  (substate) => (substate.get('selectedQuoteType') === RENEWAL_TYPE)
);

const selectOptionType = () => createSelector(
  selectPlans(),
  (subState) => subState.get('selectedQuoteType')
);

const selectModUploaded = () => createSelector(
  selectPlans(),
  (substate) => (substate.get('modLetterDate'))
);

export {
  selectQuoteIsEasy,
  selectLatestsQuoteDates,
  selectClientPlans,
  selectClient,
  selectSummaries,
  selectOption1,
  selectSummaryLoaded,
  selectInfoForQuote,
  selectPlansFromSection,
  selectFiles,
  selectPreviewFiles,
  selectCurrentPlanValid,
  checkDependency,
  selectTiers,
  selectPlanDataChanges,
  selectTeamChanges,
  checkRenewal,
  selectOptionType,
  selectModUploaded,
};
