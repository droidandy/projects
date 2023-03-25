import {
  CHANGE_GA_FORM,
  VERIFY_GA_AGENT_EMAIL,
  CREATE_GA_AGENT_ACCOUNT,
  CLEAR_FORM,
} from './../constants';
import {
  changeForm,
  formSubmit,
  verifyAgentEmail,
  clearForm,
} from './../actions';

describe('Ga actions', () => {
  const section = 'medical';
  const path = '123';
  const value = '234';
  it('changeForm', () => {
    expect(changeForm(section, path, value)).toEqual({ type: CHANGE_GA_FORM, payload: { section, path, value } });
  });

  it('formSubmit', () => {
    expect(formSubmit()).toEqual({ type: CREATE_GA_AGENT_ACCOUNT, payload: { } });
  });

  it('verifyAgentEmail', () => {
    const verificationCode = '123123123';
    expect(verifyAgentEmail(verificationCode)).toEqual({ type: VERIFY_GA_AGENT_EMAIL, payload: verificationCode });
  });

  it('clearForm', () => {
    expect(clearForm()).toEqual({ type: CLEAR_FORM });
  });
});
