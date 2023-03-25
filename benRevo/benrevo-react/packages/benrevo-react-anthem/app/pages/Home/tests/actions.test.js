import {
  HomeChangeForm,
  HomeFormSubmit,
  CHANGE_FORM,
  FORM_SUBMIT,
} from '@benrevo/benrevo-react-core';

describe('Home actions', () => {
  it('CHANGE_FORM', () => {
    const expected = {
      type: CHANGE_FORM,
      payload: { key: 'firstName', value: '1' },
    };
    expect(HomeChangeForm('firstName', '1')).toEqual(expected);
  });
  it('FORM_SUBMIT', () => {
    const expected = {
      type: FORM_SUBMIT,
    };
    expect(HomeFormSubmit()).toEqual(expected);
  });
});
