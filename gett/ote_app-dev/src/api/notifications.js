import { get } from 'utils';

const getRecent = () => get('/messages/recent');

export default {
  getRecent
};
