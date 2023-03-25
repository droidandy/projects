import { reduce } from 'js/redux';

const initialState = {
  salesmen: []
};

export default reduce('app', initialState, (reducer) => {
  reducer('getSalesmenSuccess', (state, salesmen) => {
    return { ...state, salesmen };
  });
});
