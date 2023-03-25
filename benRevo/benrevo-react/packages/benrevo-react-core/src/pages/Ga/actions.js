import {
  CHANGE_GA_FORM,
  VERIFY_GA_AGENT_EMAIL,
  CREATE_GA_AGENT_ACCOUNT,
  CLEAR_FORM,
  CHECK_IF_GA,
} from './constants';

export function changeForm(section, path, value) {
  return {
    type: CHANGE_GA_FORM,
    payload: { section, path, value },
  };
}

export function formSubmit() {
  return {
    type: CREATE_GA_AGENT_ACCOUNT,
    payload: {},
  };
}

export function verifyAgentEmail(verificationCode) {
  return {
    type: VERIFY_GA_AGENT_EMAIL,
    payload: verificationCode,
  };
}

export function clearForm() {
  return {
    type: CLEAR_FORM,
  };
}

export function checkIfGA() {
  return {
    type: CHECK_IF_GA,
  };
}
