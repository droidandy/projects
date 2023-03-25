import { createSelector } from 'reselect';

const selectRfpCarriers = (state, section) => state.get('app').get('carriers').get(section);
const selectRfpCarriersAll = (state) => state.get('app').get('carriers');
const selectRfpSection = (state, section) => state.get('rfp').get(section);
const selectClientInfo = (state) => state.get('rfp').get('clientInfo');
const selectClient = (state) => state.get('clients').get('current');
const selectRfp = (state) => state.get('rfp');
const uploadQuote = (state) => state.get('rfp').get('uploadQuote');

const selectCarrierList = createSelector(
  selectRfpCarriers,
  (substate) => {
    const carriers = substate.toJS();
    const finalCarriers = [];

    for (let i = 0; i < carriers.length; i += 1) {
      const carrier = carriers[i];
      finalCarriers.push({
        id: carrier.carrierId,
        value: carrier.displayName,
        text: carrier.displayName,
        name: carrier.name,
      });
    }
    return finalCarriers;
  }
);

const selectOtherCarrier = createSelector(
  selectRfpCarriers,
  (substate) => {
    const carrierList = substate.toJS();
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

const selectPlansCarrierList = createSelector(
  selectRfpCarriers,
  selectRfpSection,
  (substate, rfpSubState) => {
    const carriers = rfpSubState.get('carriers').toJS();
    const carrierList = substate.toJS();
    const finalCarriers = [];

    for (let i = 0; i < carriers.length; i += 1) {
      for (let j = 0; j < carrierList.length; j += 1) {
        const listItem = carrierList[j];
        if (listItem.displayName === carriers[i].title) {
          finalCarriers.push({
            key: listItem.carrierId,
            value: listItem.carrierId,
            text: listItem.displayName,
          });
          break;
        }
      }
    }
    return finalCarriers;
  }
);

const selectCarrierById = (carrierId, section) => createSelector(
  selectRfpCarriersAll,
  (substate) => {
    const carrierList = substate.get(section).toJS();
    for (let j = 0; j < carrierList.length; j += 1) {
      const carrier = carrierList[j];

      if (carrier.carrierId === carrierId) return carrier;
    }

    return {};
  }
);

const selectBenefitsFromSection = (section) => createSelector(
  selectRfp,
  (substate) => ({ plans: substate.get(section).get('benefits').toJS(), clientPlans: substate.get(section).get('plans').toJS(), rfpId: substate.get(section).get('id') })
);

const selectSelectedBenefits = (section) => createSelector(
  selectRfp,
  (substate) => substate.get(section).get('selectedBenefits').toJS()
);

const selectRaters = createSelector(
  selectRfp,
  (substate) => {
    const raters = substate.get('rater').get('raters').toJS();
    const final = [];

    for (let i = 0; i < raters.length; i += 1) {
      const rater = raters[i];
      final.push({
        id: rater.personId,
        value: rater.personId,
        text: rater.fullName,
      });
    }
    return final;
  }
);

const uploadQuoteSelector = createSelector(
  uploadQuote,
  (substate) => substate.toJS()
);

const selectRaterData = createSelector(
  selectRfp,
  (substate) => {
    const note = substate.get('rater').get('note');
    const selectedRater = substate.get('rater').get('selectedRater');

    return {
      note,
      selectedRater,
    };
  }
);

const selectNewBrokerFields = createSelector(
  selectClientInfo,
  (substate) => {
    const newBrokerFields = substate.get('newBroker').toJS();
    return newBrokerFields;
  }
);

const selectClientChanges = createSelector(
  selectClientInfo,
  (substate) => {
    const selectedBC = substate.get('selectedBC').toJS();
    const deletedBC = substate.get('deletedBC').toJS();
    const selectedGAC = substate.get('selectedGAC').toJS();
    const deletedGAC = substate.get('deletedGAC').toJS();
    const newBrokerContacts = substate.get('newBrokerContacts').toJS();
    const newGAContacts = substate.get('newGAContacts').toJS();

    const addedMembers = [];
    const deletedMembers = [];
    // add selected broker contacts to changes
    if (selectedBC.length) {
      for (let i = 0; i < selectedBC.length; i += 1) {
        if (selectedBC[i].added) {
          addedMembers.push(selectedBC[i]);
        }
      }
    }
    // add selected GA contacts to changes
    if (selectedGAC.length) {
      for (let i = 0; i < selectedGAC.length; i += 1) {
        if (selectedGAC[i].added) {
          addedMembers.push(selectedGAC[i]);
        }
      }
    }
    // add new broker contacts to changes
    for (let i = 0; i < newBrokerContacts.length; i += 1) {
      if (newBrokerContacts[i].email) {
        addedMembers.push(newBrokerContacts[i]);
      }
    }
    // add new GA contacts to changes
    for (let i = 0; i < newGAContacts.length; i += 1) {
      if (newGAContacts[i].email) {
        addedMembers.push(newGAContacts[i]);
      }
    }
    // add deleted members to deleted
    for (let i = 0; i < deletedBC.length; i += 1) {
      deletedMembers.push(deletedBC[i]);
    }
    for (let i = 0; i < deletedGAC.length; i += 1) {
      deletedMembers.push(deletedGAC[i]);
    }

    return {
      addedMembers,
      deletedMembers,
    };
  }
);

const selectDefaultBroker = createSelector(
  selectClient,
  (substate) => {
    const client = substate.toJS();
    return {
      broker: client.brokerId,
      GA: client.gaId,
    };
  }
);

const selectCurrentClientId = createSelector(
  selectClient,
  (substate) => {
    const client = substate.toJS();
    return client.id;
  }
);

const selectProducerValue = createSelector(
  selectClientInfo,
  (substate) => {
    const producer = substate.get('producer').toJS();
    return producer;
  }
);

const selectCurrentBroker = createSelector(
  selectClientInfo,
  (substate) => {
    const currBroker = substate.get('selectedBroker').toJS();
    return currBroker;
  }
);

const selectDiscounts = createSelector(
  selectRfp,
  (substate) => {
    const send = substate.get('send').toJS();
    return {
      medicalDiscount: send.medicalDiscount,
      dentalDiscount: send.dentalDiscount,
      visionDiscount: send.visionDiscount,
      lifeDiscount: send.lifeDiscount,
    };
  }
);

const selectSummaries = createSelector(
  selectRfp,
  (substate) => {
    const medical = substate.get('send').get('summaries').get('medical');
    const dental = substate.get('send').get('summaries').get('dental');
    const vision = substate.get('send').get('summaries').get('vision');

    return { medical, dental, vision };
  }
);

const selectSummaryLoaded = createSelector(
  selectRfp,
  (substate) => substate.get('send').get('summaryLoaded')
);

const selectRFPIds = createSelector(
  selectRfp,
  selectClient,
  (rfp, clientState) => {
    const products = clientState.get('products').toJS();
    const rfpIds = [];

    for (let i = 0; i < Object.keys(products).length; i += 1) {
      const key = Object.keys(products)[i];

      if (products[key] && rfp.get(key).get('id')) {
        rfpIds.push(rfp.get(key).get('id'));
      }
    }

    return rfpIds;
  }
);

export {
  selectCarrierList,
  selectOtherCarrier,
  selectPlansCarrierList,
  selectCarrierById,
  selectBenefitsFromSection,
  selectNewBrokerFields,
  selectDefaultBroker,
  selectClientChanges,
  selectCurrentClientId,
  selectSelectedBenefits,
  selectRaters,
  uploadQuoteSelector,
  selectRaterData,
  selectProducerValue,
  selectCurrentBroker,
  selectDiscounts,
  selectSummaries,
  selectSummaryLoaded,
  selectRFPIds,
};
