import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import Requests from '../components/Requests';

configure({ adapter: new Adapter() });

describe('<Requests />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
    });
    store = mockStore(initialState);
  });

  const alternativeQuote = '';
  const updateForm = () => {};
  const additionalRequests = '';
  const section = '';

  it('should render the Requests component', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <Requests alternativeQuote={alternativeQuote} updateForm={updateForm} additionalRequests={additionalRequests} section={section} />
      </Provider>
    );

    renderedComponent.find('input[type="radio"]').forEach((node) => {
      node.simulate('change');
    });

    renderedComponent.find('textarea').forEach((node) => {
      node.simulate('change');
    });

    expect(renderedComponent.find('form').length).toBe(2);
  });
});
