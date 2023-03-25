import { destroy, post } from 'utils';

const bindUserDevice = data => post('/user_devices', data);

const removeUserDevice = data => destroy('/user_devices', { data });

export default {
  bindUserDevice,
  removeUserDevice
};
