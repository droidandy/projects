import { destroy, post, put } from 'utils';

const createPaymentCard = (passengerId, paymentCard) => (
  post(`/passengers/${passengerId}/payment_cards`, { paymentCard })
);

const makeDefaultPaymentCard = (passengerId, paymentCardId) => (
  put(`/passengers/${passengerId}/payment_cards/${paymentCardId}/make_default`)
);

const removePaymentCard = (passengerId, paymentCardId) => (
  destroy(`/passengers/${passengerId}/payment_cards/${paymentCardId}`)
);

export default {
  createPaymentCard,
  makeDefaultPaymentCard,
  removePaymentCard
};
