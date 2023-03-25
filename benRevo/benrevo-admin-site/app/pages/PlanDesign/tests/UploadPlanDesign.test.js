import React from 'react';
import { mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import configureStore from '../../../store';
import UploadPlanDesign from '../UploadPlanDesign/UploadPlanDesign';

describe('<UploadPlanDesign />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the UploadPlanDesign component', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <UploadPlanDesign
            carriers={[]}
            selectedCarrier={{}}
            getChanges={() => {}}
            loading={false}
            uploadLoading={false}
            changeCarrier={() => {}}
            changes={{}}
            fileName={''}
            inputYear={2018}
            changeYear={() => {}}
            uploadPlan={() => {}}
          />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.upload-plan').length).toBe(1);
    renderedComponent.find('button').forEach((node) => {
      node.simulate('click');
    });
  });
});
