import { reduce } from 'js/redux';
import { map } from 'lodash';
import update from 'update-js';

const initialState = {
  list: {
    items: [],
    pagination: {
      current: 1,
      pageSize: 10
    },
    query: {
      page: 1,
      search: ''
    },
    can: {},
    statistics: {}
  },
  currentStats: {},
  formData: {
    bookers: [],
    workRoles: [],
    departments: [],
    paymentCards: [],
    memberRoles: [],
    can: {},
    favoriteAddresses: [],
    companyPaymentTypes: []
  },
  changeLog: []
};

export default reduce('passengers', initialState, (reducer) => {
  reducer('setQuery', (state, query) => {
    if (query && query !== state.list.query) {
      return update(state, 'list.query', query);
    }
    return state;
  });

  reducer('getPassengersSuccess', (state, data) => {
    return update.assign(state, 'list', data);
  });

  reducer('getStats', (state) => {
    return { ...state, currentStats: initialState.currentStats };
  });

  reducer('getStatsSuccess', (state, currentStats) => {
    return { ...state, currentStats };
  });

  reducer('getFormDataSuccess', (state, formData) => {
    return { ...state, formData };
  });

  reducer('createFavoriteAddressSuccess', (state, favoriteAddress) => {
    return update.add(state, 'formData.favoriteAddresses', favoriteAddress);
  });

  reducer('updateFavoriteAddressSuccess', (state, favoriteAddress) => {
    return update(state, `formData.favoriteAddresses.{id:${favoriteAddress.id}}`, favoriteAddress);
  });

  reducer('destroyFavoriteAddressSuccess', (state, favoriteAddressId) => {
    return update.remove(state, `formData.favoriteAddresses.{id:${favoriteAddressId}}`);
  });

  reducer('createPaymentCard', (state) => {
    return update(state, 'formData.loading', true);
  });

  reducer('createPaymentCardSuccess', (state, paymentCard) => {
    return update(state, {
      'formData.loading': false,
      'formData.paymentCards': [...state.formData.paymentCards, paymentCard]
    });
  });

  reducer('createPaymentCardFailure', (state) => {
    return update(state, 'formData.loading', false);
  });

  reducer('makeDefaultPaymentCardSuccess', (state, paymentCardId) => {
    return update.with(state, 'formData.paymentCards', (cards) => {
      return map(cards, card => ({ ...card, default: card.id === paymentCardId }));
    });
  });

  reducer('destroyPaymentCardSuccess', (state, paymentCardId) => {
    return update.remove(state, `formData.paymentCards.{id:${paymentCardId}}`);
  });

  reducer('getLogSuccess', (state, changeLog) => {
    return { ...state, changeLog };
  });

  reducer('inviteAllSuccess', (state, data) => {
    const { statistics } = state.list;
    const leftToInvite = statistics.yetToInvite - data.invitedMembersCount;

    return update(state, {
      'list.statistics.yetToInvite': leftToInvite, // this should be 0
      'list.can.inviteAllPassengers': false
    });
  });

  reducer('toggleCurrentMemberPassengerSuccess', (state, passenger) => {
    return update(state, `list.items.{id:${passenger.id}}`, passenger);
  });
});
