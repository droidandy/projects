import React from 'react';
import { mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import configureStore from '../../../store';
import Dental from '../Dental/.';
import DentalPlans from '../../../mockapi/_v1_dental.json';

describe('<Dental />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the Medical template component', () => {
    const loading = false;
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Dental
            loading={loading}
            plansTemplates={DentalPlans}
          />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('input').forEach((node) => {
      node.simulate('change');
    });
    renderedComponent.find('button').simulate('click');
    expect(renderedComponent.find('.add-plan-table').length).toBe(1);
  });
});
