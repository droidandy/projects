import { fromJS } from 'immutable';
import { selectContact, makeSelectForm } from '../selectors';

describe('selectContact', () => {
  const contactPage = fromJS({
    form: {},
  });
  let mockedState;
  beforeAll(() => {
    mockedState = fromJS({
      contactPage,
    });
  });
  it('should select the contactPage state', () => {
    expect(selectContact(mockedState)).toEqual(contactPage);
  });

  it('should select the form object', () => {
    const selectForm = makeSelectForm();
    expect(selectForm(mockedState)).toEqual(contactPage.get('form').toJS());
  });
});
