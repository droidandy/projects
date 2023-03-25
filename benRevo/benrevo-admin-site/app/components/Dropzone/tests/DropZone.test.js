import React from 'react';
import { mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import configureStore from '../../../store';
import Dropzone from '../index';

describe('<Dropzone />', () => {
  let store;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the drop zone list', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <Dropzone
          accept="pdf"
          multiple={false}
          tagList={[]}
          tags={{}}
          files={[]}
          onDrop={() => {}}
          onRemove={() => {}}
          onChangeTags={() => {}}
        />
      </Provider>
    );
    expect(renderedComponent.find('.select-files').length).toBe(1);
  });

  it('should render the drop zone files', () => {
    const files = [
      { name: '123' },
      { name: '234' },
    ];
    const renderedComponent = mount(
      <Provider store={store}>
        <Dropzone
          accept="pdf"
          multiple={false}
          tagList={[]}
          tags={{}}
          files={files}
          onDrop={() => {}}
          onRemove={() => {}}
          onChangeTags={() => {}}
        />
      </Provider>
    );
    renderedComponent.find('button').forEach((node) => {
      node.simulate('click');
    });
    renderedComponent.find('Dropdown').forEach((node) => {
      node.simulate('change');
    });
    renderedComponent.find('Dropzone').forEach((node) => {
      node.simulate('drop');
    });
    expect(renderedComponent.find('.drop-zone-file-item').length).toBe(2);
  });
});
