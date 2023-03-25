import { get, post } from 'utils';

const createCompanySignupRequest = company => post('/company/create_signup_request', { company });

const getCompanySettings = () => get('company/settings');

export default {
  createCompanySignupRequest,
  getCompanySettings
};
