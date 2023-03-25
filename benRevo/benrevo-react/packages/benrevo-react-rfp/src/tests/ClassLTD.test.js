import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { fromJS } from 'immutable';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import configureStore from 'redux-mock-store';
import ClassLTD from '../LifeStdLtdOptions/components/ClassLTD';
import { selectOptions } from '../LifeStdLtdOptions/selectors';

configure({ adapter: new Adapter() });

describe('<ClassLTD />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
    });
    store = mockStore(initialState);
  });

  const item = {
    conditionExclusion: 'Other',
    occupationDefinition: 'Other',
    abuseLimitation: 'Other',
  };
  const section = 'ltd';
  const i = 0;
  const dropdownOptions = selectOptions();

  it('should render the ClassLTD', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <ClassLTD key={i} section={section} type="basicPlan" item={item} updatePlan={jest.fn()} index={i} dropdownOptions={dropdownOptions} />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('Radio').forEach((node) => {
      node.simulate('change');
    });
    renderedComponent.find('Dropdown').forEach((node) => {
      node.simulate('change');
    });
    renderedComponent.find('input').forEach((node) => {
      node.simulate('change');
    });
    expect(renderedComponent.find('.life-std-ltd-class').length).toBe(2);
    expect(renderedComponent.find('.abuseLimitation').length).toBe(2);
    expect(renderedComponent.find('.occupationDefinition').length).toBe(2);
    expect(renderedComponent.find('.conditionExclusion').length).toBe(2);
  });
});
