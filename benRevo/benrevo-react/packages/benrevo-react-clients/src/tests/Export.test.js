import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import ExportClient from '../Export/ExportClient';
configure({ adapter: new Adapter() });

describe('<ExportClient  />', () => {
  const client = {
    id: '123',
  };
  it('should render the Export', () => {
    const renderedComponent = shallow(
      <ExportClient client={client} carrierName={'Anthem'} exportClient={jest.fn()} />
    );
    expect(renderedComponent.find('.clients').length).toBe(1);
  });
});
