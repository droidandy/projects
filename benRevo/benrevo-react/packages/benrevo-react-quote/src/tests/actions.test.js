import * as actions from '../actions';
import * as types from '../constants';

describe('presentation actions', () => {
  it('inviteClient', () => {
    const expected = {
      type: types.SEND_INVITE_CLIENT,
      email: 'test',
    };
    expect(actions.inviteClient('test')).toEqual(expected);
  });

  it('getEnrollment', () => {
    const expected = {
      type: types.ENROLLMENT_GET,
    };
    expect(actions.getEnrollment()).toEqual(expected);
  });

  it('getNetworks', () => {
    const expected = {
      meta: {
        section: types.PLAN_TYPE_MEDICAL,
      },
      type: types.OPTION_NETWORK_GET,
      payload: { optionId: 1 },
    };
    expect(actions.getNetworks(types.PLAN_TYPE_MEDICAL, 1)).toEqual(expected);
  });

  it('getContributions', () => {
    const expected = {
      meta: {
        section: types.PLAN_TYPE_MEDICAL,
      },
      type: types.OPTION_CONTRIBUTION_GET,
      payload: { optionId: 1 },
    };
    expect(actions.getContributions(types.PLAN_TYPE_MEDICAL, 1)).toEqual(expected);
  });

  it('saveContributions', () => {
    const expected = {
      meta: {
        section: types.PLAN_TYPE_MEDICAL,
      },
      type: types.OPTION_CONTRIBUTION_SAVE,
      payload: { optionId: 1, index: 0 },
    };
    expect(actions.saveContributions(types.PLAN_TYPE_MEDICAL, 1, 0)).toEqual(expected);
  });

  it('addNetwork', () => {
    const expected = {
      meta: {
        section: types.PLAN_TYPE_MEDICAL,
      },
      type: types.OPTION_NETWORK_ADD,
      payload: { optionId: 1, networkId: 0 },
    };
    expect(actions.addNetwork(types.PLAN_TYPE_MEDICAL, 1, 0)).toEqual(expected);
  });

  it('selectPlan', () => {
    const expected = {
      meta: {
        section: types.PLAN_TYPE_MEDICAL,
      },
      type: types.PLAN_SELECT,
      payload: { planId: 1, networkId: 0 },
    };
    expect(actions.selectPlan(types.PLAN_TYPE_MEDICAL, 1, 0)).toEqual(expected);
  });

  it('submitFinal', () => {
    const expected = {
      meta: {
        section: types.PLAN_TYPE_MEDICAL,
      },
      type: types.SUBMIT_FINAL_SECTIONS,
    };
    expect(actions.submitFinal(types.PLAN_TYPE_MEDICAL)).toEqual(expected);
  });

  it('optionsSelect', () => {
    const expected = {
      meta: {
        section: types.PLAN_TYPE_MEDICAL,
      },
      type: types.OPTIONS_SELECT,
      payload: { optionId: 1 },
    };
    expect(actions.optionsSelect(types.PLAN_TYPE_MEDICAL, 1)).toEqual(expected);
  });

  it('optionsUnSelect', () => {
    const expected = {
      meta: {
        section: types.PLAN_TYPE_MEDICAL,
      },
      type: types.OPTIONS_UNSELECT,
      payload: { optionId: 1 },
    };
    expect(actions.optionsUnSelect(types.PLAN_TYPE_MEDICAL, 1)).toEqual(expected);
  });

  it('setClient', () => {
    const expected = {
      type: types.SET_CLIENT,
      payload: 'test',
    };
    expect(actions.setClient('test')).toEqual(expected);
  });

  it('getCarriers', () => {
    const expected = {
      type: types.CARRIERS_GET,
      payload: { force: true },
    };
    expect(actions.getCarriers(true)).toEqual(expected);
  });

  it('getQuotesCategory', () => {
    const expected = {
      meta: {
        section: 'test',
      },
      type: types.GET_QUOTES_CATEGORY,
    };
    expect(actions.getQuotesCategory('test')).toEqual(expected);
  });

  it('getDocuments', () => {
    const expected = {
      type: types.GET_DOCUMENTS,
    };
    expect(actions.getDocuments()).toEqual(expected);
  });

  it('getFile', () => {
    const expected = {
      type: types.GET_FILE,
      payload: 'test',
    };
    expect(actions.getFile('test')).toEqual(expected);
  });

  it('cancelEnrollment', () => {
    const expected = {
      meta: {
        section: 'test',
      },
      type: types.ENROLLMENT_CANCEL,
    };
    expect(actions.cancelEnrollment('test')).toEqual(expected);
  });

  it('editEnrollment', () => {
    const expected = {
      meta: {
        section: 'test1',
      },
      type: types.ENROLLMENT_EDIT,
      payload: 'test2',
    };
    expect(actions.editEnrollment('test1', 'test2')).toEqual(expected);
  });

  it('saveEnrollment', () => {
    const expected = {
      meta: {
        section: 'test',
      },
      type: types.ENROLLMENT_SAVE,
    };
    expect(actions.saveEnrollment('test')).toEqual(expected);
  });

  it('changeEnrollment', () => {
    const expected = {
      meta: {
        section: 'test1',
      },
      type: types.ENROLLMENT_CHANGE,
      payload: { column: 'test2', index: 'test3', value: 'test4' },
    };
    expect(actions.changeEnrollment('test1', 'test2', 'test3', 'test4')).toEqual(expected);
  });

  it('saveRiderFee', () => {
    const expected = {
      meta: {
        section: 'test',
      },
      type: types.OPTION_RIDER_FEE_SAVE,
      payload: { administrativeFeeId: 1, rfpQuoteOptionNetworkId: 2, optionId: 3 },
    };
    expect(actions.saveRiderFee('test', 1, 2, 3)).toEqual(expected);
  });

  it('getRiderFee', () => {
    const expected = {
      meta: {
        section: 'test',
      },
      type: types.OPTION_RIDER_FEE_GET,
      payload: { carrierId: 1 },
    };
    expect(actions.getRiderFee('test', 1)).toEqual(expected);
  });

  it('changeOptionNetwork', () => {
    const expected = {
      meta: {
        section: 'test',
      },
      type: types.OPTION_NETWORK_CHANGE,
      payload: { optionId: 1, rfpQuoteNetworkId: 2, rfpQuoteOptionNetworkId: 3 },
    };
    expect(actions.changeOptionNetwork('test', 1, 2, 3)).toEqual(expected);
  });

  it('deleteNetwork', () => {
    const expected = {
      meta: {
        section: 'test',
      },
      type: types.OPTION_NETWORK_DELETE,
      payload: { optionId: 1, networkId: 2 },
    };
    expect(actions.deleteNetwork('test', 1, 2)).toEqual(expected);
  });

  it('resetCurrentPage', () => {
    const expected = {
      type: types.RESET_CURRENT_PAGE,
    };
    expect(actions.resetCurrentPage()).toEqual(expected);
  });

  it('downloadQuote', () => {
    const expected = {
      meta: {
        section: 'test1',
      },
      type: types.DOWNLOAD_QUOTE,
      payload: { kaiser: 'test2' },
    };
    expect(actions.downloadQuote('test1', 'test2')).toEqual(expected);
  });

  it('addPlan', () => {
    const expected = {
      meta: {
        section: 'test1',
      },
      type: types.ALTERNATIVE_PLAN_ADD,
      payload: { newPlan: 'test2', networkIndex: 3, multiMode: 'test4' },
    };
    expect(actions.addPlan('test1', 'test2', 3, 'test4')).toEqual(expected);
  });

  it('editPlan', () => {
    const expected = {
      meta: {
        section: 'test1',
      },
      type: types.ALTERNATIVE_PLAN_EDIT,
      payload: { plan: 'test2', rfpQuoteNetworkId: 3, networkIndex: 4, multiMode: 'test5' },
    };
    expect(actions.editPlan('test1', 'test2', 3, 4, 'test5')).toEqual(expected);
  });

  it('deletePlan', () => {
    const expected = {
      meta: {
        section: 'test1',
      },
      type: types.ALTERNATIVE_PLAN_DELETE,
      payload: { rfpQuoteNetworkPlanId: 2, rfpQuoteNetworkId: 3, networkIndex: 4, multiMode: 'test5' },
    };
    expect(actions.deletePlan('test1', 2, 3, 4, 'test5')).toEqual(expected);
  });

  it('saveCurrentPlan', () => {
    const expected = {
      meta: {
        section: 'test1',
      },
      type: types.SAVE_CURRENT_PLAN,
      payload: { plan: 'test2', index: 3 },
    };
    expect(actions.saveCurrentPlan('test1', 'test2', 3)).toEqual(expected);
  });

  it('getNetworksForCompare', () => {
    const expected = {
      meta: { section: 'test' },
      type: types.OPTION_COMPARE_NETWORKS_GET,
    };
    expect(actions.getNetworksForCompare('test')).toEqual(expected);
  });

  it('getDisclaimer', () => {
    const expected = {
      meta: {
        section: 'test',
      },
      payload: { rfpQuoteOptionId: 1 },
      type: types.DISCLAIMER_GET,
    };
    expect(actions.getDisclaimer('test', 1)).toEqual(expected);
  });

  it('setCurrentNetworkName', () => {
    const expected = {
      meta: {
        section: 'test1',
      },
      payload: { networkName: 'test2' },
      type: types.SET_CURRENT_NETWORK_NAME,
    };
    expect(actions.setCurrentNetworkName('test1', 'test2')).toEqual(expected);
  });

  it('changeExternalProducts', () => {
    const expected = {
      payload: { type: 'test', value: 1 },
      type: types.EXTERNAL_PRODUCTS_SELECT,
    };
    expect(actions.changeExternalProducts('test', 1)).toEqual(expected);
  });

  it('createDTPClearValue', () => {
    const expected = {
      type: types.CREATE_DTP_CLEAR_VALUE,
    };
    expect(actions.createDTPClearValue()).toEqual(expected);
  });

  it('getDTPClearValueStatus', () => {
    const expected = {
      type: types.GET_CLEAR_VALUE_STATUS,
    };
    expect(actions.getDTPClearValueStatus()).toEqual(expected);
  });

  it('downloadPlanBenefitsSummary', () => {
    const expected = {
      payload: { summaryFileLink: 'test1', planName: 'test2' },
      type: types.DOWNLOAD_PLAN_BENEFITS_SUMMARY,
    };
    expect(actions.downloadPlanBenefitsSummary('test1', 'test2')).toEqual(expected);
  });

  it('downloadModLetter', () => {
    const expected = {
      type: types.DOWNLOAD_MOD_LETTER,
    };
    expect(actions.downloadModLetter()).toEqual(expected);
  });
});
