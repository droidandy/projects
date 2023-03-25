import {
  changeForm,
  formSubmit,
} from '../actions';
import {
  CHANGE_FORM,
  FORM_SUBMIT,
} from '../constants';

describe('Home actions', () => {
  it('CHANGE_FORM', () => {
    const expected = {
      type: CHANGE_FORM,
      payload: { key: 'name', value: '1' },
    };
    expect(changeForm('name', '1')).toEqual(expected);
  });

  it('FORM_SUBMIT', () => {
    const expected = {
      type: FORM_SUBMIT,
    };
    expect(formSubmit()).toEqual(expected);
  });
});
