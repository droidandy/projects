import * as actions from '../actions';
import * as types from './../constants';

describe('Plans actions', () => {
  describe('downloadFile', () => {
    it('has a type of DOWNLOAD_FILE', () => {
      const file = '123';
      const expected = {
        type: types.DOWNLOAD_FILE,
        payload: file,
      };
      expect(actions.downloadFile(file)).toEqual(expected);
    });
  });

  describe('previewQuote', () => {
    it('has a type of PREVIEW_QUOTE', () => {
      const data = {};
      const expected = {
        type: types.PREVIEW_QUOTE,
        payload: data,
      };
      expect(actions.previewQuote(data)).toEqual(expected);
    });
  });

  describe('uploadQuote', () => {
    it('has a type of UPLOAD_QUOTE', () => {
      const data = {};
      const expected = {
        type: types.UPLOAD_QUOTE,
        payload: data,
      };
      expect(actions.uploadQuote(data)).toEqual(expected);
    });
  });

  describe('declineQuote', () => {
    it('has a type of DECLINE', () => {
      const data = {};
      const expected = {
        type: types.DECLINE,
        payload: data,
      };
      expect(actions.declineQuote(data)).toEqual(expected);
    });
  });

  describe('declineApprove', () => {
    it('has a type of DECLINE_APPROVE', () => {
      const expected = {
        type: types.DECLINE_APPROVE,
      };
      expect(actions.declineApprove()).toEqual(expected);
    });
  });

  describe('uploadDentalQuote', () => {
    it('has a type of UPLOAD_DENTAL_QUOTE', () => {
      const type = '123';
      const files = [];
      const category = 'medical';
      const actionType = '345';
      const expected = {
        type: types.UPLOAD_DENTAL_QUOTE,
        payload: { type, files, category, actionType },
      };
      expect(actions.uploadDentalQuote(type, files, category, actionType)).toEqual(expected);
    });
  });

  describe('giveAccessToClient', () => {
    it('has a type of GIVE_ACCESS_TO_CLIENT', () => {
      const brokerId = '123';
      const clientId = '234';
      const expected = {
        type: types.GIVE_ACCESS_TO_CLIENT,
        payload: { brokerId, clientId },
      };
      expect(actions.giveAccessToClient(brokerId, clientId)).toEqual(expected);
    });
  });

  describe('changeSelectedClient', () => {
    it('has a type of CHANGE_SELECTED_CLIENT', () => {
      const path = '123';
      const value = '234';
      const expected = {
        type: types.CHANGE_SELECTED_CLIENT,
        payload: { path, value },
      };
      expect(actions.changeSelectedClient(path, value)).toEqual(expected);
    });
  });

  describe('getFiles', () => {
    it('has a type of FILES_GET', () => {
      const expected = {
        type: types.FILES_GET,
      };
      expect(actions.getFiles()).toEqual(expected);
    });
  });

  describe('getHistory', () => {
    it('has a type of HISTORY_GET', () => {
      const expected = {
        type: types.HISTORY_GET,
      };
      expect(actions.getHistory()).toEqual(expected);
    });
  });

  describe('createNewPlan', () => {
    it('has a type of PLAN_CREATE', () => {
      const section = 'medical';
      const expected = {
        meta: { section },
        type: types.PLAN_CREATE,
      };
      expect(actions.createNewPlan(section)).toEqual(expected);
    });
  });

  describe('updatePlanField', () => {
    it('has a type of PLAN_FIELD_UPDATE', () => {
      const section = 'medical';
      const index1 = '123';
      const index2 = '234';
      const valType = 'name';
      const value = 'value';
      const rxFlag = true;
      const expected = {
        meta: { section },
        payload: { index1, index2, valType, value, rxFlag },
        type: types.PLAN_FIELD_UPDATE,
      };
      expect(actions.updatePlanField(section, index1, index2, valType, value, rxFlag)).toEqual(expected);
    });
  });

  describe('getCarrierHistory', () => {
    it('has a type of GET_CARRIER_HISTORY', () => {
      const section = 'medical';
      const expected = {
        meta: { section },
        type: types.GET_CARRIER_HISTORY,
      };
      expect(actions.getCarrierHistory(section)).toEqual(expected);
    });
  });

  describe('updatePlansPage', () => {
    it('has a type of UPDATE_PLANS_PAGE', () => {
      const expected = {
        type: types.UPDATE_PLANS_PAGE,
      };
      expect(actions.updatePlansPage()).toEqual(expected);
    });
  });

  describe('getPlan', () => {
    it('has a type of PLAN_GET', () => {
      const plans = [];
      const expected = {
        type: types.PLAN_GET,
        payload: plans,
      };
      expect(actions.getPlan(plans)).toEqual(expected);
    });
  });

  describe('getClientPlans', () => {
    it('has a type of CLIENT_PLANS_GET', () => {
      const clientId = '123';
      const expected = {
        type: types.CLIENT_PLANS_GET,
        payload: clientId,
      };
      expect(actions.getClientPlans(clientId)).toEqual(expected);
    });
  });

  describe('changeCurrentCarrier', () => {
    it('has a type of CHANGE_CURRENT_CARRIER', () => {
      const carrierId = '123';
      const index = 1;
      const planType = 'HMO';
      const section = 'medical';
      const expected = {
        meta: {
          section,
        },
        type: types.CHANGE_CURRENT_CARRIER,
        payload: { carrierId, index, planType },
      };
      expect(actions.changeCurrentCarrier(section, carrierId, index, planType)).toEqual(expected);
    });
  });

  describe('changeCurrentNetwork', () => {
    it('has a type of CHANGE_CURRENT_NETWORK', () => {
      const networkId = '123';
      const index = 1;
      const carrierId = '234';
      const planType = 'HMO';
      const section = 'medical';
      const expected = {
        meta: {
          section,
        },
        type: types.CHANGE_CURRENT_NETWORK,
        payload: { networkId, index, carrierId, planType },
      };
      expect(actions.changeCurrentNetwork(section, networkId, index, carrierId, planType)).toEqual(expected);
    });
  });

  describe('saveSummary', () => {
    it('has a type of SUMMARY_SAVE', () => {
      const value = '123';
      const section = 'medical';
      const expected = {
        type: types.SUMMARY_SAVE,
        payload: { value, section },
      };
      expect(actions.saveSummary(value, section)).toEqual(expected);
    });
  });

  describe('getDates', () => {
    it('has a type of DATES_GET', () => {
      const expected = {
        type: types.DATES_GET,
      };
      expect(actions.getDates()).toEqual(expected);
    });
  });

  describe('changeQuoteType', () => {
    it('has a type of CHANGE_QUOTE_TYPE', () => {
      const category = 'medical';
      const value = '123';
      const expected = {
        meta: {
          section: category,
        },
        type: types.CHANGE_QUOTE_TYPE,
        value,
      };
      expect(actions.changeQuoteType(category, value)).toEqual(expected);
    });
  });

  describe('getSummary', () => {
    it('has a type of SUMMARY_GET', () => {
      const expected = {
        type: types.SUMMARY_GET,
      };
      expect(actions.getSummary()).toEqual(expected);
    });
  });

  describe('changeOption1Group', () => {
    it('has a type of CHANGE_OPTION1_GROUP', () => {
      const category = 'medical';
      const planId = '123';
      const networkGroup = '234';
      const expected = {
        meta: {
          section: category,
        },
        type: types.CHANGE_OPTION1_GROUP,
        payload: { planId, networkGroup },
      };
      expect(actions.changeOption1Group(category, planId, networkGroup)).toEqual(expected);
    });
  });

  describe('changeOption1', () => {
    it('has a type of CHANGE_OPTION1', () => {
      const category = 'medical';
      const optionId = '123';
      const planId = '234';
      const rfpQuoteNetwork = '234';
      const expected = {
        meta: {
          section: category,
        },
        type: types.CHANGE_OPTION1,
        payload: { planId, rfpQuoteNetwork, optionId },
      };
      expect(actions.changeOption1(category, planId, rfpQuoteNetwork, optionId)).toEqual(expected);
    });
  });

  describe('changeOption1Match', () => {
    it('has a type of CHANGE_OPTION1_MATCH', () => {
      const category = 'medical';
      const optionId = '123';
      const planId = '234';
      const rfpQuoteNetwork = '234';
      const expected = {
        meta: {
          section: category,
        },
        type: types.CHANGE_OPTION1_MATCH,
        payload: { planId, rfpQuoteNetwork, optionId },
      };
      expect(actions.changeOption1Match(category, planId, rfpQuoteNetwork, optionId)).toEqual(expected);
    });
  });

  describe('getQuoteNetworks', () => {
    it('has a type of QUOTE_NETWORKS_GET', () => {
      const category = 'medical';
      const expected = {
        type: types.QUOTE_NETWORKS_GET,
        payload: [category],
      };
      expect(actions.getQuoteNetworks(category)).toEqual(expected);
    });
  });

  describe('saveOption1', () => {
    it('has a type of OPTION1_SAVE', () => {
      const expected = {
        type: types.OPTION1_SAVE,
      };
      expect(actions.saveOption1()).toEqual(expected);
    });
  });

  describe('sendNotification', () => {
    it('has a type of SEND_NOTIFICATION', () => {
      const expected = {
        type: types.SEND_NOTIFICATION,
      };
      expect(actions.sendNotification()).toEqual(expected);
    });
  });

  describe('approveOnBoarding', () => {
    it('has a type of APPROVE_ON_BOARDING', () => {
      const expected = {
        type: types.APPROVE_ON_BOARDING,
      };
      expect(actions.approveOnBoarding()).toEqual(expected);
    });
  });

  describe('getDifference', () => {
    it('has a type of DIFFERENCE_GET', () => {
      const expected = {
        type: types.DIFFERENCE_GET,
      };
      expect(actions.getDifference()).toEqual(expected);
    });
  });

  describe('changeClientStatus', () => {
    it('has a type of CHANGE_CLIENT_STATUS', () => {
      const newStatus = 'statustest';
      const clientId = '123';
      const expected = {
        type: types.CHANGE_CLIENT_STATUS,
        payload: { newStatus, clientId },
      };
      expect(actions.changeClientStatus(newStatus, clientId)).toEqual(expected);
    });
  });

  describe('updateSelectedPlan', () => {
    it('has a type of UPDATE_SELECTED_PLAN', () => {
      const index = '0';
      const id = '123';
      const key = 'test';
      const value = 'test123';
      const expected = {
        type: types.UPDATE_SELECTED_PLAN,
        payload: { index, id, key, value },
      };
      expect(actions.updateSelectedPlan(index, id, key, value)).toEqual(expected);
    });
  });

  describe('resetPlanChanges', () => {
    it('has a type of RESET_PLAN_CHANGES', () => {
      const expected = {
        type: types.RESET_PLAN_CHANGES,
      };
      expect(actions.resetPlanChanges()).toEqual(expected);
    });
  });
});
