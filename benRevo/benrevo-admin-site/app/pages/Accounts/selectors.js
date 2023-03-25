import { createSelector } from 'reselect';

const accountsPage = (state) => state.get('accountsPage');

const selectCurrent = createSelector(
  accountsPage,
  (substate) => {
    const current = substate.get('current').toJS();
    let bcc;
    if (!current.brokerageId) bcc = substate.get('bccEmail');

    return {
      current,
      bcc,
    };
  }
);

const selectReason = createSelector(
  accountsPage,
  (substate) => substate.get('denyReason')
);

const selectGaList = createSelector(
  accountsPage,
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

const selectSalesList = createSelector(
  accountsPage,
  (substate) => {
    const sales = substate.get('sales').toJS();
    const final = [];

    for (let i = 0; i < sales.length; i += 1) {
      const item = sales[i];
      let found = false;

      for (let j = 0; j < final.length; j += 1) {
        if (final[j].text === item) {
          found = true;
          break;
        }
      }

      if (!found) {
        final.push({
          key: item,
          value: item,
          text: item,
        });
      }
    }
    return final;
  }
);

const selectPresalesList = createSelector(
  accountsPage,
  (substate) => {
    const presales = substate.get('presales').toJS();
    const final = [];

    for (let i = 0; i < presales.length; i += 1) {
      const item = presales[i];
      let found = false;

      for (let j = 0; j < final.length; j += 1) {
        if (final[j].text === item) {
          found = true;
          break;
        }
      }

      if (!found) {
        final.push({
          key: item,
          value: item,
          text: item,
        });
      }
    }
    return final;
  }
);

const selectBrokerageList = createSelector(
  accountsPage,
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

const selectGa = createSelector(
  accountsPage,
  (substate) => {
    const list = substate.get('ga').toJS();
    const selected = substate.get('selectedGA');
    let item = {};

    if (selected) {
      for (let i = 0; i < list.length; i += 1) {
        const listItem = list[i];

        if (listItem.id === selected) {
          item = listItem;
          break;
        }
      }
    }

    return item;
  }
);

const selectBrokerage = createSelector(
  accountsPage,
  (substate) => {
    const list = substate.get('brokerages').toJS();
    const selected = substate.get('selectedBrokerage');
    let item = {};

    if (selected) {
      for (let i = 0; i < list.length; i += 1) {
        const listItem = list[i];

        if (listItem.id === selected) {
          item = listItem;
          break;
        }
      }
    }

    return item;
  }
);

export {
  selectCurrent,
  selectGaList,
  selectSalesList,
  selectPresalesList,
  selectBrokerageList,
  selectGa,
  selectBrokerage,
  selectReason,
};
