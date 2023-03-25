import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { fromJS } from 'immutable';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import configureStore from 'redux-mock-store';
import Tutorial from '../';

configure({ adapter: new Adapter() });

describe('<Tutorial />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({});
    store = mockStore(initialState);
  });

  const images = [
    import('@benrevo/benrevo-react-core/src/assets/img/tutorial/anthem/page2.png'),
    import('@benrevo/benrevo-react-core/src/assets/img/tutorial/anthem/page3.png'),
    import('@benrevo/benrevo-react-core/src/assets/img/tutorial/anthem/page4.png'),
    import('@benrevo/benrevo-react-core/src/assets/img/tutorial/anthem/page5.png'),
    import('@benrevo/benrevo-react-core/src/assets/img/tutorial/anthem/page6.png'),
    import('@benrevo/benrevo-react-core/src/assets/img/tutorial/anthem/page7.png'),
    import('@benrevo/benrevo-react-core/src/assets/img/tutorial/anthem/page8.png'),
  ];
  const tutorial = {
    pages: {
      images,
    },
  };

  it('should render the Tutorial component', () => {
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = () => {};
    }

    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Tutorial tutorial={tutorial} changeUserCount={() => {}} />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('Modal').length).toBe(1);
  });
});
