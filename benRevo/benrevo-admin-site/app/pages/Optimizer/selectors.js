import { createSelector } from 'reselect';

const selectBase = () => (state) => state.get('base');
const selectOptimizer = (state) => state.get('optimizerPage');

const selectInfo = () => createSelector(
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

const selectOptimizerInfo = createSelector(
  selectOptimizer,
  (substate) => {
    const data = { brokerage: {} };
    const selectedBrokerage = substate.get('selectedBrokerage').toJS();
    const client = substate.get('client').toJS();
    const selectedGA = substate.get('selectedGA');
    const overrideClient = substate.get('overrideClient');
    const newClientName = substate.get('newClientName');
    const addressInfo = substate.get('addressInfo').toJS();
    const brokerage = substate.get('brokerage').toJS();
    const possibleEmail = substate.get('bccEmail');

    if (selectedBrokerage.id) {
      data.brokerage.id = selectedBrokerage.id;
    }

    if (selectedGA) {
      data.gaBrokerage = { id: selectedGA };
    }

    data.overrideClient = overrideClient;

    if (overrideClient) data.clientId = client.id;

    if (newClientName && !overrideClient) {
      data.newClientName = newClientName;
    }

    if (!brokerage.id && possibleEmail.length > 0) {
      data.brokerage.bcc = possibleEmail;
    }

    return {
      data,
      addressInfo,
      client,
    };
  }
);

const selectGaList = createSelector(
  selectOptimizer,
  (substate) => {
    const ga = substate.get('ga').toJS();
    const finalGa = [];

    for (let i = 0; i < ga.length; i += 1) {
      const item = ga[i];
      finalGa.push({
        key: item.id,
        value: item.id,
        text: item.name,
      });
    }
    return finalGa;
  }
);

const selectBrokerageList = createSelector(
  selectOptimizer,
  (substate) => {
    const brokerages = substate.get('brokerages').toJS();
    const finalBrokerages = [];

    for (let i = 0; i < brokerages.length; i += 1) {
      const item = brokerages[i];
      finalBrokerages.push({
        key: item.id,
        value: item.id,
        text: item.name,
      });
    }
    return finalBrokerages;
  }
);

const selectProducts = createSelector(
  selectOptimizer,
  (substate) => {
    const products = substate.get('products');
    const renewals = substate.get('renewals');
    const final = [];

    products.keySeq().forEach((key) => {
      if (products.get(key)) {
        final.push({ category: key.toUpperCase(), renewal: renewals.get(key).toString() });
      }
    });

    return final;
  }
);

export {
  selectInfo,
  selectGaList,
  selectBrokerageList,
  selectOptimizerInfo,
  selectProducts,
};
