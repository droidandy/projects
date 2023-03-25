import { find } from 'lodash';
import { all, call, put, select, takeEvery } from 'redux-saga/effects';

// import { history } from '../../../app/app.store';
// from '../../../domains/registration/registration.api';
// import { trackEvent } from '../../../domains/tracking/mixpanel.util';

import { accountAPI } from './account.api';

import { asyncRequest } from '~/common/saga.utils';
import { types, actions } from '~/store/accountReducer';
import { setBusy, showToastError, showToastSuccess } from '~/store/appReducer';

const waitForEtnaFrame = (resolve) => {
  const etnaFrame = document.querySelector('#etnaFrame');
  if (etnaFrame !== null) {
    resolve(etnaFrame);
  } else {
    setTimeout(() => waitForEtnaFrame(resolve), 500);
  }
};

export const settingsSaga = {
  *listAccounts() {
    const accounts = yield asyncRequest(accountAPI.settings.listAccounts, {}, actions.settings.setAccounts, null);
    const selectedAccountId = localStorage && localStorage.getItem('aou.account.selected');
    const selectedAccount = find(accounts, (a) => a.id === parseInt(selectedAccountId, 10)) || accounts[0];
    if (selectedAccount) {
      yield put(actions.settings.setSelectedAccount(selectedAccount, false));
    }
  },

  *setSelectedAccount(action) {
    localStorage.setItem('aou.account.selected', action.account.id);

    const effectiveUserId = localStorage.getItem('EffectiveUserID');
    const isEtnaMobileApp = localStorage && localStorage.getItem('isEtnaMobileApp') === 'true';

    if (!effectiveUserId) {
      if (isEtnaMobileApp) {
        window.location.href = `https://internalNavigation/Account/${action.account.etnaAccountId}`;
      } else {
        const etnaFrame = yield new Promise(waitForEtnaFrame);
        etnaFrame.contentWindow.postMessage(
          { type: 'CHANGE_ACCOUNT', id: action.account.etnaAccountId },
          etnaFrame.src,
        );
      }
    }

    if (action.forceReload) {
      yield put(setBusy(true, true));
      window.location.reload();
    }
  },

  *setBeneficiaries(action) {
    yield put(setBusy(true, true));
    try {
      const updatedAccount = yield call(accountAPI.settings.setAccountFields, {
        beneficiaries: action.beneficiaries,
      });
      yield put(actions.settings.setSelectedAccount(updatedAccount, false));
      // history.push('/account/settings');
      yield put(showToastSuccess('Beneficiaries updated'));
    } catch (e) {
      yield put(showToastError('Unable to update beneficiaries. Please try again later'));
    }
    yield put(setBusy(false));
  },

  // *addAccount(action) {
  //   yield asyncRequest(registrationAPI.submitRegistration, {
  //     addOn: 'true',
  //     accountType: action.accountType,
  //     terms_of_service_agreed: action.termsAgreed,
  //   });
  // },

  *setInvestmentObjective(action) {
    yield put(setBusy(true));
    try {
      yield call(accountAPI.settings.setAccountFields, {
        investmentObjective: action.investmentObjective,
      });
      yield put(showToastSuccess('Investment Objective updated'));
      setTimeout(() => window.location.reload(), 500);
    } catch (e) {
      yield put(showToastError('Unable to update Investment Objective right now. Please try again later'));
    }
    yield put(setBusy(false));
  },
};

export const activitySaga = {
  *fetch() {
    const accountId = yield select((state) => state.account.settings.selectedAccount.id);
    yield asyncRequest(accountAPI.activity.get, { accountId }, actions.activity.set, null);
  },
};

export const documentsSaga = {
  *fetch() {
    const accountId = yield select((state) => state.account.settings.selectedAccount.id);
    yield asyncRequest(accountAPI.documents.get, { accountId }, actions.documents.set, null);
  },
  *downloadDocument(action) {
    const presignedDownloadLink = yield asyncRequest(accountAPI.documents.getLink, action.document, null, null);
    if (localStorage && localStorage.getItem('isEtnaMobileApp') === 'true') {
      window.location.href = `external:${presignedDownloadLink}`;
    } else {
      const newTab = window.open(presignedDownloadLink, '_blank');
      if (newTab != null) newTab.focus();
    }
  },
};

export const institutionsSaga = {
  bankAccounts: {
    *fetch() {
      yield put(setBusy(true));
      try {
        const res = yield call(accountAPI.funding.bankAccounts.get);
        yield put(actions.funding.bankAccounts.set(res));
        yield put(setBusy(false));
      } catch (e) {
        yield put(showToastError(e.message || 'ERROR: Please try again later.', true));
        yield put(setBusy(false));
      }
    },
  },
  brokerageAccounts: {
    *fetch() {
      yield asyncRequest(accountAPI.funding.brokerageAccounts.get, null, actions.funding.brokerageAccounts.set, null);
    },
  },
  clearingFirms: {
    *fetch() {
      yield asyncRequest(accountAPI.funding.clearingFirms.get, null, actions.funding.clearingFirms.set, null);
    },
  },
};

export const transfersSaga = {
  transfers: {
    *fetch(action) {
      const accountId = yield select((state) => state.account.settings.selectedAccount.id);
      yield asyncRequest(
        accountAPI.funding.transfers.get,
        { accountId, range: action && action.range },
        actions.funding.transfers.history.set,
        null,
      );
    },
  },
};

export const fundingSaga = {
  bankAccounts: {
    *createLink({ token, metadata, transactionType }) {
      yield asyncRequest(
        accountAPI.funding.bankAccounts.add,
        { publicToken: token, bankAccount: metadata },
        () => showToastSuccess('Bank account linking in progress.'),
        (e) =>
          // trackEvent(`${transactionType} Account Add Error`, { error: e.data });
          showToastError(e.data, true),
        null,
      );
      yield institutionsSaga.bankAccounts.fetch();
    },
    *cancelLink(action) {
      yield asyncRequest(
        accountAPI.funding.bankAccounts.cancel,
        { relationshipId: action.relationshipId },
        () => showToastSuccess('Bank account link removed'),
        () => showToastError('An error occured. Try again later.'),
      );

      yield institutionsSaga.bankAccounts.fetch();
    },

    *linkReAuthenticated() {
      yield put(setBusy(true, true));
      yield institutionsSaga.bankAccounts.fetch();
      yield put(setBusy(false, true));
      yield put(showToastSuccess('Authenticated'));
    },
  },
  transfers: {
    ach: {
      *create({ form, successNextPage = null }) {
        yield put(setBusy(true, true));
        try {
          yield call(() => accountAPI.funding.ach.submit(form));
          yield put(showToastSuccess('Transfer submitted.'));
          yield put(setBusy(false));
          // history.push(successNextPage);
        } catch (e) {
          // trackEvent(
          //   `Transfer Submission Error - ${
          //     form.direction === 'INCOMING' ? 'Deposit' : 'Withdrawal'
          //   }`,
          //   { error: e.message }
          // );
          yield put(showToastError(e.message, true));
          yield put(setBusy(false));
        }
      },
      cancel: {
        *request(action) {
          yield asyncRequest(
            accountAPI.funding.ach.cancel,
            action.transferId,
            actions.funding.transfers.ach.cancel.success,
            () => showToastError('An error occured. Try again later.'),
          );
        },
        *success() {
          yield put(showToastSuccess('Transfer cancelled.'));
          yield put(actions.funding.transfers.fetch('1W'));
        },
      },
    },
    acat: {
      *create({ values, successNextPage = null }) {
        const transferType = values.transferType === 'FULL_TRANSFER' ? 'Full' : 'Partial';
        yield asyncRequest(
          accountAPI.funding.acat.submit,
          values,
          () => showToastSuccess('Transfer submitted.'),
          (e) =>
            // trackEvent(`Transfer Submission Error - ACATS ${transferType}`, {
            //   error: e.message,
            // });
            showToastError(e.message, true),
          successNextPage,
          true,
        );
      },
    },
  },
  constraints: {
    *fetch() {
      yield asyncRequest(accountAPI.funding.constraints.get, null, actions.funding.constraints.set, null);
    },
  },
};

export default function* accountRootSaga() {
  yield all([
    takeEvery(types.settings.addAccount, settingsSaga.addAccount),
    takeEvery(types.settings.listAccounts, settingsSaga.listAccounts),
    takeEvery(types.settings.setSelectedAccount, settingsSaga.setSelectedAccount),
    takeEvery(types.settings.setInvestmentObjective, settingsSaga.setInvestmentObjective),
    takeEvery(types.settings.setBeneficiaries, settingsSaga.setBeneficiaries),

    takeEvery(types.activity.fetch, activitySaga.fetch),

    takeEvery(types.documents.fetch, documentsSaga.fetch),
    takeEvery(types.documents.downloadDocument, documentsSaga.downloadDocument),

    takeEvery(types.funding.bankAccounts.fetch, institutionsSaga.bankAccounts.fetch),
    takeEvery(types.funding.brokerageAccounts.fetch, institutionsSaga.brokerageAccounts.fetch),
    takeEvery(types.funding.clearingFirms.fetch, institutionsSaga.clearingFirms.fetch),
    takeEvery(types.funding.constraints.fetch, fundingSaga.constraints.fetch),

    takeEvery(types.funding.transfers.fetch, transfersSaga.transfers.fetch),
    takeEvery(types.funding.transfers.ach.create, fundingSaga.transfers.ach.create),
    takeEvery(types.funding.transfers.ach.cancel.request, fundingSaga.transfers.ach.cancel.request),
    takeEvery(types.funding.transfers.ach.cancel.success, fundingSaga.transfers.ach.cancel.success),
    takeEvery(types.funding.transfers.acat.create, fundingSaga.transfers.acat.create),

    takeEvery(types.funding.bankAccounts.createLink, fundingSaga.bankAccounts.createLink),
    takeEvery(types.funding.bankAccounts.cancelLink, fundingSaga.bankAccounts.cancelLink),
    takeEvery(types.funding.bankAccounts.linkReAuthenticated, fundingSaga.bankAccounts.linkReAuthenticated),
  ]);
}
