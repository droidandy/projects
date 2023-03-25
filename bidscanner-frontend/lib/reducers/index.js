// @flow
import { reducer as reduxFormReducer } from 'redux-form';
import signInSignUpPageReducer from './signInSignUpPage';
import homePageReducer from './homePage';
import myDealsPageReducer from './my-deals';
import companyDetailsPageReducer from './company-details';

export default {
  signInSignUpPage: signInSignUpPageReducer,
  homePage: homePageReducer,
  myDeals: myDealsPageReducer,
  companyDetailsPage: companyDetailsPageReducer,
  form: reduxFormReducer,
};
