import { createReducer } from '@reduxjs/toolkit';

/**
 * Action Types
 */
export const actionTypes = {
  profile: {
    fetch: 'USERS/PROFILE/FETCH',
    fetchConfig: 'USERS/PROFILE/FETCHCONFIGURATION',
    set: 'USERS/PROFILE/SET',
    setConfig: 'USERS/PROFILE/SETCONFIGURATION',
    setAccountData: 'USERS/PROFILE/SETACCOUNTDATA',
    setPrivacyState: 'USERS/PROFILE/SETPRIVACYSTATE',
    setPrivacyInDb: 'USERS/PROFILE/SETPRIVACYINDB',
    setNickname: 'USERS/PROFILE/SETNICKNAME',
    setIncome: 'USERS/PROFILE/SETINCOME',
    setInvestExp: 'USERS/PROFILE/SETINVESTEXP',
    setLiqNetworth: 'USERS/PROFILE/SETLIQNETWORTH',
    setEmployStatus: 'USERS/PROFILE/SETEMPLOYSTATUS',
    setPhonenumber: 'USERS/PROFILE/SETPHONENUMBER',
    setEmail: 'USERS/PROFILE/SETEMAIL',
    setResidentialAddress: 'USERS/PROFILE/SETRESIDENTIALADDRESS',
    setMailingAddress: 'USERS/PROFILE/SETMAILINGADDRESS',
  },
  registrationStatus: {
    set: 'USERS/REGISTRATION_STATUS/SET',
  },
  avatar: {
    set: 'USERS/AVATAR/SET',
    setTimestamp: 'USERS/AVATAR/SET_TIMESTAMP',
  },
  password: {
    set: 'USERS/PASSWORD/SET',
  },
};

/**
 * Action Creators
 */
export const actions = {
  profile: {
    fetch: () => ({ type: actionTypes.profile.fetch }),
    fetchConfig: () => ({ type: actionTypes.profile.fetchConfig }),
    set: (userProfile, isAdmin) => ({ type: actionTypes.profile.set, userProfile, isAdmin }),
    setConfig: (configData) => ({ type: actionTypes.profile.setConfig, configData }),
    setAccountData: (accountData) => ({ type: actionTypes.profile.setAccountData, accountData }),
    setPrivacyInDb: (privacyFlag) => ({ type: actionTypes.profile.setPrivacyInDb, privacyFlag }),
    setPrivacyState: (privacyFlag) => ({ type: actionTypes.profile.setPrivacyState, privacyFlag }),
    setNickname: (nickname) => ({ type: actionTypes.profile.setNickname, nickname }),
    setIncome: (income, account) => ({ type: actionTypes.profile.setIncome, income, account }),
    setInvestExp: (investExp, account) => ({ type: actionTypes.profile.setInvestExp, investExp, account }),
    setLiqNetworth: (liqNetworth, account) => ({ type: actionTypes.profile.setLiqNetworth, liqNetworth, account }),
    setEmployStatus: (employStatus, account) => ({ type: actionTypes.profile.setEmployStatus, employStatus, account }),
    setPhonenumber: (phone, account) => ({ type: actionTypes.profile.setPhonenumber, phone, account }),
    setEmail: (email, account) => ({ type: actionTypes.profile.setEmail, email, account }),
    setResidentialAddress: (address) => ({ type: actionTypes.profile.setResidentialAddress, address }),
    setMailingAddress: (address) => ({ type: actionTypes.profile.setMailingAddress, address }),
  },
  registrationStatus: {
    set: (registrationStatus) => ({ type: actionTypes.registrationStatus.set, registrationStatus }),
  },
  avatar: {
    set: (file) => ({ type: actionTypes.avatar.set, file }),
    setTimestamp: (timestamp) => ({ type: actionTypes.avatar.setTimestamp, timestamp }),
  },
  password: {
    set: (oldPassword, newPassword) => ({ type: actionTypes.password.set, oldPassword, newPassword }),
  },
};

/**
 * Initial State
 */
const initialState = {
  profile: {},
  registrationStatus: null,
};

/**
 * Reducer
 */

export default createReducer(initialState, {
  [actionTypes.registrationStatus.set]: (state, action) => {
    state.registrationStatus = action.registrationStatus;
  },
  [actionTypes.profile.set]: (state, action) => {
    state.profile = action.userProfile.attributes;
    // @ts-ignore
    state.profile.username = action.userProfile.username;
    // @ts-ignore
    state.profile.isPrivate = action.userProfile.attributes.isPrivate;
    // @ts-ignore
    state.profile.mfaEnabled = action.userProfile.mfaEnabled;
    // @ts-ignore
    state.profile.isAdmin = action.isAdmin;
  },
  [actionTypes.profile.setConfig]: (state, action) => {
    // @ts-ignore
    state.config = action.configData;
  },
  [actionTypes.profile.setAccountData]: (state, action) => {
    // @ts-ignore
    state.profile.account_data = action.accountData;
  },
  [actionTypes.avatar.setTimestamp]: (state, action) => {
    // @ts-ignore
    state.avatarTimestamp = action.timestamp;
  },
  [actionTypes.profile.setPrivacyState]: (state, action) => {
    // @ts-ignore
    state.profile.isPrivate = action.privacyFlag;
  },
  [actionTypes.profile.nickname]: (state, action) => {
    // @ts-ignore
    state.profile.nickname = action.nickname;
  },
});
