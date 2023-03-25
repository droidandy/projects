import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import { clientsReducerState } from '@benrevo/benrevo-react-clients';
import FinalPresentation from '../';
import FinalPresentationComponent from '../FinalPresentation';
import { initialPresentationMasterState } from './../../reducer/state';

configure({ adapter: new Adapter() });


describe('<FinalPresentation />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      clients: clientsReducerState,
      presentation: initialPresentationMasterState,
    });
    store = mockStore(initialState);
  });

  const showErr = true;
  it('should render the FinalPresentation page', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <FinalPresentation
            baseLink="/test"
            optionsUnSelect={jest.fn()}
            getFinal={jest.fn()}
            carrierName={'test'}
            modalOpen
            showAdditionalBundling
            showKaiserMessage
          />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('input').forEach((node) => {
      node.simulate('click');
    });
    expect(renderedComponent.find('.presentation-final').length).toBe(1);
  });

  it('should render the summaryBundleDiscount and subTotalAnnualCost', () => {
    const medical = {
      selected: 1,
      selectedPlans: [],
      selectedOptionName: 'name',
      totalPlans: 1,
    };
    const dental = {
      selected: 2,
      selectedPlans: [],
      selectedOptionName: 'name1',
      totalPlans: 2,
    };
    const vision = {
      selected: 3,
      selectedPlans: [],
      selectedOptionName: 'name2',
      totalPlans: 3,
    };
    const externalProducts = {};
    const extendedBundleDiscount = {};
    const readonly = true;
    const load = false;
    const discount = {
      subTotalAnnualCost: 100,
      summaryBundleDiscount: 100,
    };
    const totalAll = 200;
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <FinalPresentationComponent
            baseLink="/test"
            optionsUnSelect={jest.fn()}
            getFinal={jest.fn()}
            medical={medical}
            dental={dental}
            vision={vision}
            externalProducts={externalProducts}
            extendedBundleDiscount={extendedBundleDiscount}
            changeExternalProducts={jest.fn()}
            load={load}
            discount={discount}
            readonly={readonly}
            totalAll={totalAll}
            showErr={showErr}
          />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('Checkbox').forEach((node) => {
      node.simulate('change');
    });
    expect(renderedComponent.find('.summaryBundleDiscount').length).toBe(2);
    expect(renderedComponent.find('Message').length).toBe(1);
    expect(renderedComponent.find('.showAction-false').length).toBe(2);
  });

  it('should not render the summaryBundleDiscount and subTotalAnnualCost', () => {
    const medical = {
      selected: 1,
      selectedPlans: [],
      selectedOptionName: 'name',
      totalPlans: 1,
    };
    const dental = {
      selected: 2,
      selectedPlans: [],
      selectedOptionName: 'name1',
      totalPlans: 2,
    };
    const vision = {
      selected: 3,
      selectedPlans: [],
      selectedOptionName: 'name2',
      totalPlans: 3,
    };
    const externalProducts = {};
    const extendedBundleDiscount = {};
    const readonly = true;
    const load = false;
    const discount = {
      subTotalAnnualCost: 0,
      summaryBundleDiscount: 0,
    };
    const totalAll = 0;
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <FinalPresentationComponent
            baseLink="/test"
            optionsUnSelect={jest.fn()}
            getFinal={jest.fn()}
            medical={medical}
            dental={dental}
            vision={vision}
            externalProducts={externalProducts}
            extendedBundleDiscount={extendedBundleDiscount}
            changeExternalProducts={jest.fn()}
            load={load}
            discount={discount}
            readonly={readonly}
            totalAll={totalAll}
          />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('Checkbox').forEach((node) => {
      node.simulate('change');
    });
    expect(renderedComponent.find('.showAction-false').length).toBe(2);
    expect(renderedComponent.find('.summaryBundleDiscount').length).toBe(0);
    expect(renderedComponent.find('.subTotalAnnualCost').length).toBe(0);
  });

  it('should not render medical.totalPlans', () => {
    const medical = {
      selected: 1,
      selectedPlans: [],
      selectedOptionName: 'name',
      totalPlans: 0,
    };
    const dental = {
      selected: 2,
      selectedPlans: [],
      selectedOptionName: 'name1',
      totalPlans: 2,
    };
    const vision = {
      selected: 3,
      selectedPlans: [],
      selectedOptionName: 'name2',
      totalPlans: 3,
    };
    const externalProducts = {};
    const extendedBundleDiscount = {};
    const readonly = true;
    const load = false;
    const discount = {
      subTotalAnnualCost: 10,
      summaryBundleDiscount: 10,
    };
    const totalAll = 20;
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <FinalPresentationComponent
            baseLink="/test"
            optionsUnSelect={jest.fn()}
            getFinal={jest.fn()}
            medical={medical}
            dental={dental}
            vision={vision}
            externalProducts={externalProducts}
            extendedBundleDiscount={extendedBundleDiscount}
            changeExternalProducts={jest.fn()}
            load={load}
            discount={discount}
            readonly={readonly}
            totalAll={totalAll}
          />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('Checkbox').forEach((node) => {
      node.simulate('change');
    });
    expect(renderedComponent.find('.external-products').length).toBe(0);
  });
  it('should render showAction buttons', () => {
    const medical = {
      selected: 1,
      selectedPlans: [],
      selectedOptionName: 'name',
      totalPlans: 1,
    };
    const dental = {
      selected: 2,
      selectedPlans: [],
      selectedOptionName: 'name1',
      totalPlans: 2,
    };
    const vision = {
      selected: 3,
      selectedPlans: [],
      selectedOptionName: 'name2',
      totalPlans: 3,
    };
    const externalProducts = {};
    const extendedBundleDiscount = {};
    const readonly = false;
    const load = false;
    const discount = {
      subTotalAnnualCost: 100,
      summaryBundleDiscount: 100,
    };
    const totalAll = 200;
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <FinalPresentationComponent
            baseLink="/test"
            optionsUnSelect={jest.fn()}
            getFinal={jest.fn()}
            medical={medical}
            dental={dental}
            vision={vision}
            externalProducts={externalProducts}
            extendedBundleDiscount={extendedBundleDiscount}
            changeExternalProducts={jest.fn()}
            load={load}
            discount={discount}
            readonly={readonly}
            totalAll={totalAll}
            showErr={showErr}
          />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('Checkbox').forEach((node) => {
      node.simulate('change');
    });
    expect(renderedComponent.find('.summaryBundleDiscount').length).toBe(2);
    expect(renderedComponent.find('.showAction').length).toBe(2);
  });
});
