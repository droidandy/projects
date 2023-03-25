import { put, post } from 'utils';

const forgotPassword = params => put('/user/forgot_password', params);

const trackUserLocation = location => post('/user_locations', location);

const passGuide = () => put('/user/pass_guide');

export default {
  forgotPassword,
  trackUserLocation,
  passGuide
};
