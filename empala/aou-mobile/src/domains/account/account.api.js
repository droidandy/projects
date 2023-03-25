import { API } from 'aws-amplify';

import { unwrapError } from '~/common/api.utils';

const API_NAME = 'allofus';

export const accountAPI = {
  settings: {
    listAccounts: () => API.get(API_NAME, '/accounts', {}),
    setAccountFields: async (body) => API.put(API_NAME, '/account', { body }).catch(unwrapError),
  },

  activity: {
    get: () => API.get(API_NAME, '/account-activity', {}),
  },
  documents: {
    get: () => API.get(API_NAME, '/account-documents', {}),
    getLink: (document) => API.get(API_NAME, `/account-documents/${document.id}/link`, {}),
  },

  funding: {
    transfers: {
      get: ({ range }) => API.get(API_NAME, '/transfers', { queryStringParameters: { range } }),
    },
    constraints: {
      get: () => API.get(API_NAME, '/transfers/constraints', {}),
    },
    ach: {
      submit: (form) => API.post(API_NAME, '/transfers/ach', { body: form }).catch(unwrapError),
      cancel: (transferId) => API.post(API_NAME, `/transfers/ach/${transferId}/cancel`, { body: {} }),
    },
    acat: {
      submit: (data) => API.post(API_NAME, '/transfers/acat', { body: data }).catch(unwrapError),
    },
    bankAccounts: {
      get: () => API.get(API_NAME, '/bank-accounts', {}).catch(unwrapError),
      add: ({ publicToken, bankAccount }) =>
        API.post(API_NAME, '/bank-account', {
          body: { publicToken, bankAccount },
        }).catch(unwrapError),
      cancel: ({ relationshipId }) =>
        API.post(API_NAME, '/bank-account/cancel', {
          body: { relationshipId },
        }),
    },
    brokerageAccounts: {
      get: () => API.get(API_NAME, '/brokerage-account', {}),
    },
    clearingFirms: {
      get: () => API.get(API_NAME, '/transfers/acat/dtc', {}),
    },
  },
};
