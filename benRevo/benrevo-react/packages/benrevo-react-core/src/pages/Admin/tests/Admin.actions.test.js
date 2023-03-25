import {
  CHANGE_DISCLOSURE,
  DISCLOSURE_CANCEL,
  DISCLOSURE_SUBMIT,
  GET_CONFIG,
} from './../constants';
import {
  changeForm,
  cancelForm,
  formSubmit,
  getConfig,
} from './../actions';

describe('Admin actions', () => {
  it('changeForm', () => {
    expect(changeForm('test')).toEqual({ type: CHANGE_DISCLOSURE, payload: { value: 'test' } });
  });

  it('cancelForm', () => {
    expect(cancelForm('test')).toEqual({ type: DISCLOSURE_CANCEL, payload: { value: 'test' } });
  });

  it('changeForm', () => {
    expect(formSubmit()).toEqual({ type: DISCLOSURE_SUBMIT });
  });

  it('changeForm', () => {
    expect(getConfig()).toEqual({ type: GET_CONFIG });
  });
});
