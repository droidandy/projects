import { get, post } from 'utils';

const login = user => (
  post('/session', { user })
);

const getCurrentUser = () => (
  get('/session')
);

export default {
  login,
  getCurrentUser
};
