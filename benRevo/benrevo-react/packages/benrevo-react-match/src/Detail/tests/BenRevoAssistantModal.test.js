import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure, shallow } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import { QuoteState } from '@benrevo/benrevo-react-quote';
import { Button } from 'semantic-ui-react';
import clientsReducerState from './../../reducer/clientsReducerState';
import { additionalState } from './../../reducer/state';
import BenRevoAssistantModal from './../components/BenRevoAssistantModal';
export const finalQuoteState = QuoteState.mergeDeep(additionalState);

configure({ adapter: new Adapter() });

describe('<BenRevoAssistantModal />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      presentation: finalQuoteState.setIn(['medical', 'openedOption'], fromJS({ detailedPlans: [{ type: 'test' }] })),
      clients: clientsReducerState,
    });
    store = mockStore(initialState);
  });

  const section = 'medical';
  const params = {
    clientId: 1,
  };

  it('should render the BenRevoAssistantModal', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <BenRevoAssistantModal section={section} params={params} modalOpened />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('.input').forEach((node) => {
      node.simulate('change');
    });

    expect(renderedComponent.find('.presentation-modal').length).toBe(1);
  });

  it('should render the BenRevoAssistantModal opened and test button clicks', () => {
    const testAction = jest.fn();
    const renderedComponent = shallow(
      <BenRevoAssistantModal section={section} params={params} store={store} modalOpened />
    ).dive();

    renderedComponent.setState({ actions: { testAction } });
    expect(renderedComponent.find('.content-inner').length).toBe(1);

    renderedComponent.find(Button).last().simulate('click');
    expect(testAction).toBeCalled();

    renderedComponent.find('.cancel-modal-button').forEach((node) => {
      node.simulate('click');
    });

    expect(renderedComponent.find('.content-inner').length).toBe(1);
  });

  it('should test clicking the close icon', () => {
    const renderedComponent = shallow(
      <BenRevoAssistantModal section={section} params={params} store={store} modalOpened />
    ).dive();

    expect(renderedComponent.find('.content-inner').length).toBe(1);

    renderedComponent.find('.close').forEach((node) => {
      node.simulate('click');
    });

    expect(renderedComponent.find('.content-inner').length).toBe(1);
  });

  it('should test networkChange', () => {
    const renderedComponent = shallow(
      <BenRevoAssistantModal section={section} params={params} store={store} modalOpened />
    ).dive();

    renderedComponent.instance().networkChange(1, { rfpQuoteOptionNetworkId: 1 }, 0);
    // TODO
  });
});
