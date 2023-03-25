import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import configureStore from '../../../store';
import InfertilityTreatment from './../questions/misc/InfertilityTreatment';

configure({ adapter: new Adapter() });

describe('<InfertilityTreatment />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });
  it('should render the InfertilityTreatment page', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <InfertilityTreatment />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('span').length).toBe(7);
  });
});
