import { reduce } from 'js/redux';

const initialState = {
  company: {},
  email: '',
  role: '',
  id: undefined,
  data: {
  },
};

export default reduce('settings', initialState, function(reducer) {
  reducer('getCompanySuccess', (state, data) => {
    return { ...state, company: data };
  });

  reducer('getCurrentSessionSuccess', (state, { email, role, id }) => {
    return { ...state, email, role, id };
  });

  reducer('getCompanySettingsSuccess', (state, data) => {
    return { ...state, data };
  });
});
