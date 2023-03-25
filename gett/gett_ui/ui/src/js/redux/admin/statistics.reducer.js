import { reduce } from 'js/redux';

const initialState = {
  active: [],
  future: [],
  cancelled: [],
  credit: [],
  account: [],
  cash: [],
  affiliateMonthly: [],
  affiliateDaily: [],
  enterpriseMonthly: [],
  enterpriseDaily: []
};

export default reduce('bookings', initialState, (reducer) => {
  reducer('getStatisticsSuccess', (state, data) => {
    return { ...state, ...data };
  });
});
