import { destroy, post, put } from 'utils';

const createAddress = (passengerId, passengerAddress) => (
  post(`/passengers/${passengerId}/addresses`, { passengerAddress })
);

const updateAddress = (passengerId, addressId, passengerAddress) => (
  put(`/passengers/${passengerId}/addresses/${addressId}`, { passengerAddress })
);

const removeAddress = (passengerId, addressId) => destroy(`/passengers/${passengerId}/addresses/${addressId}`);

export default {
  createAddress,
  updateAddress,
  removeAddress
};
