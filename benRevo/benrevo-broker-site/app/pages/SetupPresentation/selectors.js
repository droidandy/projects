import { createSelector } from 'reselect';

const selectSetupPresentation = (state) => state.get('setupPresentation');

const selectNewAlternative = () => createSelector(
  selectSetupPresentation,
  () => {
    const column = [
      {
        bundlingDiscounts: [],
        percentage: 0,
        productsOptions: [],
        total: 0,
      },
    ];

    return column;
  }
);

const selectDiscounts = (index) => createSelector(
  selectSetupPresentation,
  (substate) => {
    const alternative = substate.get('alternatives').get(index);
    const bundlingDiscounts = alternative.get('bundlingDiscounts').toJS();
    const presentationOptionId = alternative.get('presentationOptionId');
    let send = true;
    const data = {
      presentationOptionId,
      bundlingDiscounts: [],
    };

    for (let i = 0; i < bundlingDiscounts.length; i += 1) {
      const item = bundlingDiscounts[i];

      if (item.product && item.discount) {
        data.bundlingDiscounts.push(item);
      } else send = false;
    }

    return { data, send };
  }
);

export {
  selectNewAlternative,
  selectDiscounts,
};
