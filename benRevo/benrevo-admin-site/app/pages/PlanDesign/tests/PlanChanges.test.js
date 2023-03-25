import React from 'react';
import { mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import configureStore from '../../../store';
import PlanChanges from '../UploadPlanDesign/components/PlanChanges';

describe('<PlanChanges />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the PlanChanges component with two tables, one for added and one for removed', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <PlanChanges
            changes={{ added: ['test'], removed: ['test'], updated: [] }}
          />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.plan-design-changes-tables').length).toBe(1);
    expect(renderedComponent.find('.data-table').length).toBe(2);
  });

  it('should render the PlanChanges component with one table for updated', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <PlanChanges
            changes={{ added: [], removed: [], updated: [{ changedBenefits: [] }] }}
          />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.plan-design-changes-tables').length).toBe(1);
    expect(renderedComponent.find('.data-table').length).toBe(1);
  });
});
