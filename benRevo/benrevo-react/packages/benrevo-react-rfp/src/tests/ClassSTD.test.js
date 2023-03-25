import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { fromJS } from 'immutable';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import configureStore from 'redux-mock-store';
import ClassSTD from '../LifeStdLtdOptions/components/ClassSTD';
import { selectOptions } from '../LifeStdLtdOptions/selectors';

configure({ adapter: new Adapter() });

describe('<ClassSTD />', () => {
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
  };
  const section = 'std';
  const i = 0;
  const dropdownOptions = selectOptions();

  it('should render the ClassSTD', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <ClassSTD key={i} section={section} type="voluntaryPlan" item={item} updatePlan={jest.fn()} index={i} dropdownOptions={dropdownOptions} />
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
    expect(renderedComponent.find('.conditionExclusion').length).toBe(2);
    expect(renderedComponent.find('.voluntaryPlan').length).toBe(2);
  });
});
