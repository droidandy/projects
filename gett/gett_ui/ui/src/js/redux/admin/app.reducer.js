import { reduce } from 'js/redux';
const initialState = {
  companies: [],
  session: {
    can: {}
  }
};

export default reduce('app', initialState, (reducer) => {
  reducer('getCompaniesLookupSuccess', (state, companies) => {
    return { ...state, companies };
  });

  reducer('getSessionSuccess', (state, session) => {
    return { ...state, session };
  });
});
