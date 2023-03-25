import React from 'react'
import { call, put } from 'redux-saga/effects'
import api from 'api'
import { LoggedAsUser } from '../components/LoggedAsUser'
import { ExpirationWarning } from '../components/ExpirationWarning'
import { loadCurrentUserSuccess, loadCurrentUserFail, showSystemMessage } from '../actions'

function * saga({ history, url }) {
  try {
    const { data: currentUser } = yield call(api().get, '/session')

    if (currentUser) {
      yield put(loadCurrentUserSuccess({ currentUser: currentUser }))
    } else {
      yield put(loadCurrentUserFail())
    }
    if (history && url) {
      yield call(history.push, url)
    }
    if (localStorage.getItem('adminToken')) {
      yield put(showSystemMessage({
        text: <LoggedAsUser fullName={ `${currentUser.firstName} ${currentUser.lastName}` } />,
        closeable: false,
        kind: 'backToOffice',
        showKind: false
      }))
    }
    if (currentUser.onboardingCompleted && currentUser.documentsExpirationWarning) {
      yield put(showSystemMessage({
        kind: 'error',
        text: <ExpirationWarning />,
        showKind: false
      }))
    }
  } catch (error) {
    yield put(loadCurrentUserFail())
  }
}

export default saga
