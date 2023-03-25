import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import { shallow, configure } from 'enzyme';
import configureStore from 'redux-mock-store';
import { translationMessages } from './../../../i18n';
import LocaleToggle, { mapDispatchToProps } from '../index';
import { changeLocale } from '../../LanguageProvider/actions';
import LanguageProvider from '../../LanguageProvider';

configure({ adapter: new Adapter() });

describe('<LocaleToggle />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({

    });
    store = mockStore(initialState);
  });
  it('should render the default language messages', () => {
    const renderedComponent = shallow(
      <Provider store={store}>
        <LanguageProvider messages={translationMessages}>
          <LocaleToggle />
        </LanguageProvider>
      </Provider>
    );
    expect(renderedComponent.contains(<LocaleToggle />)).toBe(true);
  });

  describe('mapDispatchToProps', () => {
    describe('onLocaleToggle', () => {
      it('should be injected', () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        expect(result.onLocaleToggle).toBeDefined();
      });

      it('should dispatch changeLocale when called', () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        const locale = 'de';
        const evt = { target: { value: locale } };
        result.onLocaleToggle(evt, { value: locale });
        expect(dispatch).toHaveBeenCalledWith(changeLocale(locale));
      });
    });
  });
});
