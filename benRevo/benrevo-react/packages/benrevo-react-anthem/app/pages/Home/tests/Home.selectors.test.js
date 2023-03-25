import { fromJS } from 'immutable';
import { selectHome, makeSelectForm } from '@benrevo/benrevo-react-core';

describe('selectContact', () => {
  const home = fromJS({
    form: {},
  });
  let mockedState;
  beforeAll(() => {
    mockedState = fromJS({
      home,
    });
  });

  it('should select the home state', () => {
    expect(selectHome(mockedState)).toEqual(home);
  });

  it('should select the form object', () => {
    const selectForm = makeSelectForm();
    expect(selectForm(mockedState)).toEqual(home.get('form').toJS());
  });
});
