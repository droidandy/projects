import { createSelector } from 'reselect';

const selectClearValuePage = () => (state) => state.get('clearValuePage');

const selectClearValue = () => createSelector(
  selectClearValuePage(),
  (substate) => {
    const data = {
      ratingTiers: substate.get('ratingTiers'),
      sicCode: substate.get('sicCode'),
      predominantCounty: substate.get('predominantCounty'),
      effectiveDate: substate.get('effectiveDate'),
      averageAge: substate.get('averageAge'),
      paymentMethod: substate.get('medicalPaymentMethod'),
      dentalPaymentMethod: substate.get('dentalPaymentMethod'),
      commission: substate.get('commission'),
      dentalCommission: substate.get('dentalCommission'),
      turnOnMedical1Percent: substate.get('turnOnMedical1Percent') === 'yes',
    };
    return data;
  }
);

export {
  selectClearValue,
};
