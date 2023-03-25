import { createReducer } from '@reduxjs/toolkit';
import { isEmpty } from 'lodash';

import { SettingsType, FundingType } from '~/types/account';

/**
 * Action Types
 */
export const types = {
  settings: {
    listAccounts: 'ACCOUNT/SETTINGS/LIST_ACCOUNTS',
    setSelectedAccount: 'ACCOUNT/SETTINGS/SET_SELECTED',
    setAccounts: 'ACCOUNT/SETTINGS/SET_ACCOUNTS',
    addAccount: 'ACCOUNT/SETTINGS/ADD_ACCOUNT',
    setAccountTypeToAdd: 'ACCOUNT/SETTINGS/SET_ACCOUNT_TO_ADD',
    setInvestmentObjective: 'ACCOUNT/SETTINGS/SET_INVESTMENT_OBJECTIVE',
    setBeneficiaries: 'ACCOUNT/SETTINGS/SET_BENEFICIARIES',
  },
  activity: {
    fetch: 'ACCOUNT/ACTIVITY/REQUESTED',
    set: 'ACCOUNT/ACTIVITY/SET',
  },
  documents: {
    fetch: 'ACCOUNT/DOCUMENTS/REQUESTED',
    set: 'ACCOUNT/DOCUMENTS/SET',
    downloadDocument: 'ACCOUNT/DOCUMENTS/DOWNLOAD',
  },
  funding: {
    constraints: {
      fetch: 'ACCOUNT/FUNDING/CONSTRAINTS/FETCH',
      set: 'ACCOUNT/FUNDING/CONSTRAINTS/SET',
    },
    ach: {
      selectAccount: 'ACCOUNT/FUNDING/ACH/SELECT_ACCOUNT',
      preSubmit: 'ACCOUNT/FUNDING/ACH/PRE_SUBMIT',
    },
    acat: {
      selectAccount: 'ACCOUNT/FUNDING/ACAT/SELECT_ACCOUNT',
      preSubmit: 'ACCOUNT/FUNDING/ACAT/PRE_SUBMIT',
      cleanupFormData: 'ACCOUNT/FUNDING/ACAT/CLEANUP_FORM_DATA',
    },
    bankAccounts: {
      fetch: 'BANK/ACCOUNTS/REQUESTED',
      set: 'BANK/ACCOUNTS/SET',
      createLink: 'BANK/LINK/CREATE',
      cancelLink: 'BANK/LINK/CANCEL',
      setPublicToken: 'BANK/LINK/PUBLICTOKEN/SET',
      linkReAuthenticated: 'BANK/LINK/RE_AUTHENTICATED',
    },
    brokerageAccounts: {
      fetch: 'BROKERAGE/ACCOUNTS/REQUESTED',
      set: 'BROKERAGE/ACCOUNTS/SET',
    },
    transfers: {
      fetch: 'FUNDING/FETCH_TRANSFERS',
      history: {
        fetch: 'FUNDING/HISTORY/FETCH',
        set: 'FUNDING/HISTORY/SET',
      },
      ach: {
        set: 'FUNDING/SET_ACH_TRANSFERS',
        create: 'FUNDING/CREATE_ACH_TRANSFER',
        cancel: {
          request: 'FUNDING/CANCEL_ACH_TRANSFER/REQUEST',
          success: 'FUNDING/CANCEL_ACH_TRANSFER/REQUEST/SUCCESS',
        },
      },
      acat: {
        set: 'FUNDING/SET_ACAT_TRANSFERS',
        create: 'FUNDING/CREATE_ACAT_TRANSFER',
      },
    },
    clearingFirms: {
      set: 'FUNDING/SET_CLEARING_FIRMS',
      fetch: 'FUNDING/FETCH_CLEARING_FIRMS',
    },
  },
};

/**
 * Action Creators
 */
export const actions = {
  settings: {
    listAccounts: () => ({ type: types.settings.listAccounts }),
    setSelectedAccount: (account, forceReload = true) => ({
      type: types.settings.setSelectedAccount,
      account,
      forceReload,
    }),
    setAccounts: (accounts) => ({ type: types.settings.setAccounts, accounts }),
    setAccountTypeToAdd: (account) => ({ type: types.settings.setAccountTypeToAdd, account }),
    addAccount: (accountType, termsAgreed) => ({ type: types.settings.addAccount, accountType, termsAgreed }),
    setInvestmentObjective: (investmentObjective) => ({
      type: types.settings.setInvestmentObjective,
      investmentObjective,
    }),
    setBeneficiaries: (beneficiaries) => ({ type: types.settings.setBeneficiaries, beneficiaries }),
  },
  activity: {
    fetch: () => ({ type: types.activity.fetch }),
    set: (accountActivity) => ({ type: types.activity.set, accountActivity }),
  },
  documents: {
    fetch: () => ({ type: types.documents.fetch }),
    set: (documents) => ({ type: types.documents.set, documents }),
    downloadDocument: (document) => ({ type: types.documents.downloadDocument, document }),
  },
  funding: {
    ach: {
      selectAccount: (bankAccount) => ({ type: types.funding.ach.selectAccount, bankAccount }),
      preSubmit: (data) => ({ type: types.funding.ach.preSubmit, data }),
    },
    constraints: {
      fetch: () => ({ type: types.funding.constraints.fetch }),
      set: (constraints) => ({ type: types.funding.constraints.set, constraints }),
    },
    acat: {
      selectBrokerAccount: (brokerAccount) => ({ type: types.funding.acat.selectAccount, brokerAccount }),
      preSubmit: (data) => ({ type: types.funding.acat.preSubmit, data }),
      cleanupFormData: () => ({ type: types.funding.acat.cleanupFormData }),
    },
    bankAccounts: {
      fetch: () => ({ type: types.funding.bankAccounts.fetch }),
      set: (bankAccounts) => ({ type: types.funding.bankAccounts.set, bankAccounts }),
      createLink: (token, metadata, transactionType) => ({
        type: types.funding.bankAccounts.createLink,
        token,
        metadata,
        transactionType,
      }),
      cancelLink: (relationshipId) => ({ type: types.funding.bankAccounts.cancelLink, relationshipId }),
      setPublicToken: (publicToken) => ({ type: types.funding.bankAccounts.setPublicToken, publicToken }),
      linkReAuthenticated: () => ({ type: types.funding.bankAccounts.linkReAuthenticated }),
    },
    brokerageAccounts: {
      fetch: () => ({ type: types.funding.brokerageAccounts.fetch }),
      set: (brokerageAccount) => ({ type: types.funding.brokerageAccounts.set, brokerageAccount }),
    },
    transfers: {
      fetch: (range) => ({ type: types.funding.transfers.fetch, range }),
      history: {
        set: (history) => ({ type: types.funding.transfers.history.set, history }),
      },
      ach: {
        set: (achTransfers) => ({ type: types.funding.transfers.ach.set, achTransfers }),
        create: (form, isDeposit, successNextPage = null) => ({
          type: types.funding.transfers.ach.create,
          form,
          isDeposit,
          successNextPage,
        }),
        cancel: {
          request: (transferId) => ({ type: types.funding.transfers.ach.cancel.request, transferId }),
          success: () => ({ type: types.funding.transfers.ach.cancel.success }),
        },
      },
      acat: {
        set: (acatTransfers) => ({ type: types.funding.transfers.acat.set, acatTransfers }),
        create: (values, successNextPage) => ({ type: types.funding.transfers.acat.create, values, successNextPage }),
      },
    },
    clearingFirms: {
      fetch: () => ({ type: types.funding.clearingFirms.fetch }),
      set: (clearingFirms) => ({ type: types.funding.clearingFirms.set, clearingFirms }),
    },
  },
};

/**
 * Initial State
 */
export const initialState: { settings: SettingsType; funding: FundingType } = {
  settings: {
    accounts: [],
    selectedAccount: {},
    accountTypeToAdd: null,
  },
  activity: {
    items: [],
  },
  documents: {
    items: [],
  },
  funding: {
    ach: {
      form: {
        bankAccount: null,
        amount: null,
      },
    },
    acat: {
      form: {
        brokerAccount: null,
        assets: null,
        amount: null,
      },
    },
    publicToken: null,
    history: {
      items: [],
      range: undefined,
    },
    bankAccounts: [],
    brokerageAccounts: {},
    clearingFirms: [],
    constraints: { ira: { contributions: [] } },
  },
  isAccountFunded: true,
};

/**
 * Reducer
 */
export default createReducer(initialState, {
  /* Settings */
  [types.settings.setAccounts]: (state, action) => {
    state.settings.accounts = action.accounts;
  },
  [types.settings.setSelectedAccount]: (state, action) => {
    state.settings.selectedAccount = action.account;
  },
  [types.settings.setAccountTypeToAdd]: (state, action) => {
    state.settings.accountTypeToAdd = action.account;
  },

  /* Activity */
  [types.activity.set]: (state, action) => {
    state.activity = action.accountActivity;
    state.isAccountFunded = !isEmpty(action.accountActivity.items);
  },

  /* Documents */
  [types.documents.set]: (state, action) => {
    state.documents = action.documents;
  },

  /* Funding - ACH */
  [types.funding.ach.selectAccount]: (state, action) => {
    state.funding.ach.form.bankAccount = action.bankAccount;
  },
  [types.funding.ach.preSubmit]: (state, action) => {
    state.funding.ach.form = { ...state.funding.ach.form, ...action.data };
  },

  /* Funding - ACAT */
  [types.funding.acat.selectAccount]: (state, action) => {
    state.funding.acat.form.brokerAccount = action.brokerAccount;
  },
  [types.funding.acat.preSubmit]: (state, action) => {
    state.funding.acat.form = { ...state.funding.acat.form, ...action.data };
  },
  [types.funding.acat.cleanupFormData]: (state) => {
    Object.keys(state.funding.acat.form).forEach((k) => (state.funding.acat.form[k] = undefined));
  },

  /** Funding - Financial Institutions */
  [types.funding.bankAccounts.set]: (state, action) => {
    state.funding.bankAccounts = action.bankAccounts;
  },
  [types.funding.bankAccounts.setPublicToken]: (state, action) => {
    state.funding.publicToken = action.publicToken;
  },
  [types.funding.brokerageAccounts.set]: (state, action) => {
    state.funding.brokerageAccounts = action.brokerageAccount;
  },
  [types.funding.constraints.set]: (state, action) => {
    state.funding.constraints = action.constraints;
  },
  [types.funding.clearingFirms.set]: (state, action) => {
    state.funding.clearingFirms = action.clearingFirms;
  },

  /** Funding - Transfers */
  [types.funding.transfers.history.set]: (state, action) => {
    state.funding.history.items = action.history.transfers;
    state.funding.history.range = action.history.range;
  },
});
