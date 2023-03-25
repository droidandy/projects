import React from 'react';
import {
  mount,
  configure,
} from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from '../../../../store';
import Enrollment from '..';


configure({ adapter: new Adapter() });

describe('<Enrollment modal />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
    store.dispatch({
      type: 'app/PresentationPage/ENROLLMENT_GET_SUCCESS',
      payload: {
        medical: {
          networks: [
            {
              clientPlanId: 255,
              type: 'HMO',
              planName: 'AAAA',
            },
          ],
          contributions: [
            {
              values: [
                {
                  value: 100,
                },
              ],
              planName: 'Employee Only',
            },
            {
              values: [
                {
                  value: 100,
                },
              ],
              planName: 'Employee + Spouse',
            },
            {
              values: [
                {
                  value: 100,
                },
              ],
              planName: 'Employee + Child(ren)',
            },
            {
              values: [
                {
                  value: 100,
                },
              ],
              planName: 'Employee + Family',
            },
          ],
          total: [
            {
              value: 400,
            },
          ],
        },
        dental: {
          networks: [
            {
              clientPlanId: 256,
              type: 'DHMO',
              planName: 'BBBB',
            },
          ],
          contributions: [
            {
              values: [
                {
                  value: 100,
                },
              ],
              planName: 'Employee Only',
            },
            {
              values: [
                {
                  value: 100,
                },
              ],
              planName: 'Employee + Spouse',
            },
            {
              values: [
                {
                  value: 100,
                },
              ],
              planName: 'Employee + Child(ren)',
            },
            {
              values: [
                {
                  value: 100,
                },
              ],
              planName: 'Employee + Family',
            },
          ],
          total: [
            {
              value: 400,
            },
          ],
        },
        vision: {
          networks: [
            {
              clientPlanId: 257,
              type: 'VISION',
              planName: 'VVV',
            },
          ],
          contributions: [
            {
              values: [
                {
                  value: 100,
                },
              ],
              planName: 'Employee Only',
            },
            {
              values: [
                {
                  value: 100,
                },
              ],
              planName: 'Employee + Spouse',
            },
            {
              values: [
                {
                  value: 100,
                },
              ],
              planName: 'Employee + Child(ren)',
            },
            {
              values: [
                {
                  value: 100,
                },
              ],
              planName: 'Employee + Family',
            },
          ],
          total: [
            {
              value: 400,
            },
          ],
        },
      },
    });
  });
  const params = {
    clientId: '123',
  };
  it('should render Enrollment-modal component', () => {
    const renderedComponent = mount( // eslint-disable-line function-paren-newline
      <Provider store={store}>
        <IntlProvider locale="en">
          <Enrollment params={params} routes={[{}, {}, {}, {}, { path: 'medical' }]} openModal closeModal={jest.fn()} />
        </IntlProvider>
      </Provider>);
    expect(renderedComponent.length).toBe(1);
    expect(renderedComponent.exists()).toBe(true);
    expect(renderedComponent.isEmptyRender()).toBe(false);
  });
});
