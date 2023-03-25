import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { fromJS, Map, List } from 'immutable';
import { Provider } from 'react-redux';
import { Button } from 'semantic-ui-react';
import configureStore from 'redux-mock-store';
import Dropzone from '../index';

configure({ adapter: new Adapter() });

describe('<Dropzone />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  const baseState = {
    filesSummary: List([]),
    filesCensus: List([]),
    filesCurrentCarriers: List([]),
    planFiles: Map({}),
    filesClaims: List([]),
  };
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      rfpFiles: fromJS({
        common: Map({
          pdf: {},
          totalSize: 10485760,
          totalFiles: 10,
          currentSize: 0,
        }),
        medical: Map({
          ...baseState,
        }),
        dental: Map({
          ...baseState,
        }),
        vision: Map({
          ...baseState,
        }),
        life: Map({
          ...baseState,
        }),
        std: Map({
          ...baseState,
        }),
        ltd: Map({
          ...baseState,
        }),
      }),
    });
    store = mockStore(initialState);
  });

  it('should render the drop zone list', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <Dropzone
          name="planFiles"
          section="medical"
          accept="application/pdf"
          files={[{ name: 'test.pdf' }]}
          multiple={false}
          onRemove={() => {}}
          onDrop={() => {}}
        />
      </Provider>
    );
    expect(renderedComponent.contains(<Button content="Upload summary" icon="plus" labelPosition="right" />)).toEqual(true);
  });

  it('should render the drop zone list', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <Dropzone
          name="planFiles"
          section="medical"
          accept="application/pdf"
          files={[{ name: 'test.pdf' }]}
          multiple={false}
          onRemove={jest.fn()}
          onDrop={jest.fn()}
        />
      </Provider>
    );
    expect(renderedComponent.find('.drop-zone-file-item').length).toEqual(1);
    expect(renderedComponent.find('.drop-zone-inner').length).toEqual(2);

    renderedComponent.find('button').forEach((button) => {
      button.simulate('click');
    });
  });
});
