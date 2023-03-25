import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure, shallow } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import { QuoteState, ATTRIBUTES_CONTRACT_LENGTH } from '@benrevo/benrevo-react-quote';
import clientsReducerState from './../../reducer/clientsReducerState';
import { additionalState } from './../../reducer/state';
import Alternatives from './../components/Alternatives';
import mockDetailedPlan from './detailedPlan.json';
export const finalQuoteState = QuoteState.mergeDeep(additionalState);

configure({ adapter: new Adapter() });

describe('<Alternatives />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;
  const appReducerState = {
    loading: false,
    error: false,
    currentUser: false,
    showMobileNav: false,
    checkingRole: true,
    rfpcarriers: {
      medical: [],
      dental: [],
      vision: [],
    },
  };

  beforeAll(() => {
    const initialState = fromJS({
      presentation: finalQuoteState,
      clients: clientsReducerState,
      app: appReducerState,
    });
    store = mockStore(initialState);
  });

  const section = 'medical';
  const params = {
    clientId: 1,
  };

  const detailedPlan = { rfpQuoteOptionNetworkId: 1 };
  const planIndex = 0;

  it('should render the Alternatives', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Alternatives
            section={section}
            detailedPlan={detailedPlan}
            planIndex={planIndex}
            openModal={jest.fn()}
            params={params}
          />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('.input').forEach((node) => {
      node.simulate('change');
    });
    expect(renderedComponent.find('.alternatives-short').length).toBe(2);
  });

  it('should render the Alternatives', () => {
    const plans = [{ attributes: [{ sysName: 'test', name: 'name' }, { sysName: ATTRIBUTES_CONTRACT_LENGTH, name: 'name2' }] }];
    const initialState = fromJS({
      presentation: finalQuoteState.setIn(['medical', 'alternativesPlans'], fromJS({ plans })),
      clients: clientsReducerState,
      app: appReducerState,
    });
    store = mockStore(initialState);
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Alternatives
            section={section}
            detailedPlan={mockDetailedPlan}
            planIndex={planIndex}
            openModal={jest.fn()}
            params={params}
          />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('.input').forEach((node) => {
      node.simulate('change');
    });
    expect(renderedComponent.find('.alternatives-short').length).toBe(2);
    expect(renderedComponent.find('.additional.swap').length).toBe(2);
    expect(renderedComponent.find('.alternatives-table-column').length).toBe(3);
  });

  it('should set position state to newSelected', () => {
    const initialState = fromJS({
      presentation: finalQuoteState,
      clients: clientsReducerState,
      app: appReducerState,
    });
    store = mockStore(initialState);
    const renderedComponent = shallow(
      <Alternatives
        section={section}
        detailedPlan={mockDetailedPlan}
        planIndex={planIndex}
        openModal={jest.fn()}
        params={params}
        store={store}
      />
    ).dive();
    renderedComponent.setProps({ multiMode: true });
    renderedComponent.instance().openModalClick();
    expect(renderedComponent.state('showNewPlan')).toBe(true);
    expect(renderedComponent.state('position')).toBe('newSelected');
  });

  it('should set position state to newAlt', () => {
    const initialState = fromJS({
      presentation: finalQuoteState
        .setIn(['medical', 'alternativesPlans'], fromJS({ plans: ['test', 'test2'] })),
      clients: clientsReducerState,
      app: appReducerState,
    });
    store = mockStore(initialState);
    const renderedComponent = shallow(
      <Alternatives
        section={section}
        detailedPlan={mockDetailedPlan}
        planIndex={planIndex}
        openModal={jest.fn()}
        params={params}
        store={store}
      />
    ).dive();
    renderedComponent.setProps({ multiMode: true });
    renderedComponent.instance().altEmptyClick();
    expect(renderedComponent.state('showNewPlan')).toBe(true);
    expect(renderedComponent.state('position')).toBe('newAlt');
  });

  it('should call openModal with planList as the argument', () => {
    const initialState = fromJS({
      presentation: finalQuoteState.setIn(['medical', 'alternativesPlans'], fromJS({ plans: ['test', 'test2', 'test3'] })),
      clients: clientsReducerState,
      app: appReducerState,
    });
    store = mockStore(initialState);
    const openModal = jest.fn();
    const renderedComponent = shallow(
      <Alternatives
        section={section}
        detailedPlan={mockDetailedPlan}
        planIndex={planIndex}
        openModal={openModal}
        params={params}
        store={store}
      />
    ).dive();
    renderedComponent.setProps({ multiMode: false });
    renderedComponent.instance().altEmptyClick();
    expect(openModal).toBeCalledWith('planList');

    renderedComponent.setProps({ multiMode: true });
    renderedComponent.instance().altEmptyClick();
    expect(openModal).toBeCalledWith('planList');
  });

  it('test cancelAdding and editPlan state changes, than should call editAltPlan', () => {
    const initialState = fromJS({
      presentation: finalQuoteState,
      clients: clientsReducerState,
      app: appReducerState,
    });
    store = mockStore(initialState);
    const openModal = jest.fn();
    const renderedComponent = shallow(
      <Alternatives
        section={section}
        detailedPlan={mockDetailedPlan}
        planIndex={planIndex}
        openModal={openModal}
        params={params}
        store={store}
      />
    ).dive();
    renderedComponent.instance().setState({ showNewPlan: true, altPlanEditing: true, selectedPlanEditing: true });
    renderedComponent.instance().cancelAdding('test', 'n/a');
    expect(renderedComponent.state('showNewPlan')).toBe(false);

    renderedComponent.instance().cancelAdding('edit', 'n/a');
    expect(renderedComponent.state('altPlanEditing')).toBe(false);

    renderedComponent.instance().cancelAdding('edit', 'selected');
    expect(renderedComponent.state('selectedPlanEditing')).toBe(false);

    renderedComponent.instance().editPlan({ selected: true });
    expect(renderedComponent.state('selectedPlanEditing')).toBe(true);

    renderedComponent.instance().editPlan({ selected: false });
    expect(renderedComponent.state('altPlanEditing')).toBe(true);

    renderedComponent.instance().savePlan({ selected: false });
    const actions = store.getActions();
    const lastAction = actions[actions.length - 1];
    expect(lastAction.type).toBe('app/PresentationPage/ALTERNATIVE_PLAN_EDIT');
  });

  it('test accordionClick', () => {
    const initialState = fromJS({
      presentation: finalQuoteState,
      clients: clientsReducerState,
      app: appReducerState,
    });
    store = mockStore(initialState);
    const openModal = jest.fn();
    const renderedComponent = shallow(
      <Alternatives
        section={section}
        detailedPlan={mockDetailedPlan}
        planIndex={planIndex}
        openModal={openModal}
        params={params}
        store={store}
      />
    ).dive();
    renderedComponent.setState({ accordionActiveIndex: [false, false, false] });
    renderedComponent.instance().accordionClick('open');
    expect(renderedComponent.state('accordionActiveIndex')).toEqual([true, true, true]);

    renderedComponent.instance().accordionClick('close');
    expect(renderedComponent.state('accordionActiveIndex')).toEqual([false, false, false]);

    renderedComponent.instance().accordionClick(1);
    expect(renderedComponent.state('accordionActiveIndex')).toEqual([false, true, false]);
    const actions = store.getActions();
    const lastAction = actions[actions.length - 1];
    expect(lastAction.type).toBe('app/PresentationBroker/CHANGE_ACCORDION_INDEX');
  });
});
