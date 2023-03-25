import React from 'react';
import { mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import configureStore from '../../../store';
import Medical from '../Medical/.';
import MedicalPlans from '../../../mockapi/_v1_medical.json';

describe('<Medical />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the Medical template component', () => {
    const loading = false;
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Medical
            loading={loading}
            plansTemplates={MedicalPlans}
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
