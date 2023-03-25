import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { fromJS } from 'immutable';
import { Provider } from 'react-redux';
import { Dropzone } from '@benrevo/benrevo-react-core';
import configureStore from 'redux-mock-store';
import { initialState as stateRFPReducerFiles } from './../../reducerFiles';
import Files from '../components/Files';

configure({ adapter: new Adapter() });

describe('<Files />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      rfpFiles: stateRFPReducerFiles,
    });
    store = mockStore(initialState);
  });

  const filesSummary = [];
  const removeFile = () => {};
  const addFile = () => {};
  const filesClaims = [];
  const section = '';
  const FileNote = () => <div className="field-note">
    <b>Important:</b> Do not upload census here. We will remind you to email the census directly to Test at the end of the RFP section.
  </div>;
  it('should render the Files component', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <Files filesSummary={filesSummary} removeFile={removeFile} addFile={addFile} filesClaims={filesClaims} section={section} FileNote={FileNote} />
      </Provider>
    );

    renderedComponent.find(Dropzone).forEach((node) => {
      node.prop('onRemove')(0);
      node.prop('onDrop')([]);
    });

    expect(renderedComponent.find('.drop-zone').length).toBe(2);
  });
});
