import React from 'react';
import { mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import configureStore from '../../../store';
import ViewPlanDesign from '../ViewPlanDesign/ViewPlanDesign';

describe('<ViewPlanDesign />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the ViewPlanDesign component', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <ViewPlanDesign
            carriers={[]}
            selectedCarrier={{}}
            viewLoading={false}
            changeCarrier={jest.fn()}
            getPlanDesign={jest.fn()}
            getPlanTypes={jest.fn()}
            planTypeList={[]}
            planType={''}
            inputYear={2018}
            changeYear={jest.fn()}
            uploadPlan={jest.fn()}
            planDesignData={[]}
            benefitNames={[]}
            changePlanType={jest.fn()}
          />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.view-plan').length).toBe(1);
    renderedComponent.find('button').forEach((node) => {
      node.simulate('click');
    });
  });
});
