import { get, put } from 'utils';

const getPassengerData = passengerId => get(`/passengers/${passengerId}/edit`);

const updatePassengerData = (passengerId, data) => put(`/passengers/${passengerId}`, data);

export default {
  getPassengerData,
  updatePassengerData
};
