import * as types from './constants';

export function getAnswers() {
  return {
    type: types.ANSWERS_GET,
  };
}

export function saveAnswers(page) {
  return {
    type: types.ANSWERS_SAVE,
    page,
  };
}

export function answersSendMail(page) {
  return {
    type: types.ANSWERS_SEND_MAIL,
    page,
  };
}

export function getQuestionnaire() {
  return {
    type: types.FILE_QUESTIONNAIRE,
  };
}

export function changeValue(key, value, values) {
  return {
    type: types.CHANGE_VALUE,
    payload: { key, value, values },
  };
}

export function deleteKey(key) {
  return {
    type: types.DELETE_KEY,
    payload: { key },
  };
}

export function getFile(fileName) {
  return {
    type: types.GET_FILE,
    payload: fileName,
  };
}

export function changeShowDisclosure(show) {
  return {
    type: types.CHANGE_SHOW_DISCLOSURE,
    payload: show,
  };
}

export function changeShowErrors(value) {
  return {
    type: types.CHANGE_SHOW_ERRORS,
    payload: value,
  };
}

export function setError(key, message) {
  return {
    type: types.SET_ERROR,
    payload: { key, message },
  };
}

export function deleteError(key) {
  return {
    type: types.DELETE_ERROR,
    payload: { key },
  };
}
