import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import ArkansasHearingAid from '../questions/anthem/misc/ArkansasHearingAid';
import FloridaMammograms from '../questions/anthem/misc/FloridaMammograms';
import GroupElectsToOptOutOfAuthorizing from '../questions/anthem/misc/GroupElectsToOptOutOfAuthorizing';
import InfertilityTreatment from '../questions/anthem/misc/InfertilityTreatment';
import KansasPregnancy from '../questions/anthem/misc/KansasPregnancy';
import SpecialFootwear from '../questions/anthem/misc/SpecialFootwear';
import TexasInVitro from '../questions/anthem/misc/TexasInVitro';
import WaHomeHealth from '../questions/anthem/misc/WaHomeHealth';
import WherePacketsMailedTitle from '../questions/anthem/misc/WherePacketsMailedTitle';

configure({ adapter: new Adapter() });

describe('Misk', () => {
  let store;
  const middlewares = [];
  const mockStore = configureStore(middlewares);

  beforeAll(() => {
    const initialState = fromJS({
    });
    store = mockStore(initialState);
  });

  it('should render the ArkansasHearingAid', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <ArkansasHearingAid />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('.ArkansasHearingAid').length).toBe(1);
  });
  it('should render the FloridaMammograms', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <FloridaMammograms />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('.ArkansasHearingAid').length).toBe(1);
  });
  it('should render the GroupElectsToOptOutOfAuthorizing', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <GroupElectsToOptOutOfAuthorizing />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('.ArkansasHearingAid').length).toBe(1);
  });
  it('should render the InfertilityTreatment', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <InfertilityTreatment />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('.ArkansasHearingAid').length).toBe(1);
  });
  it('should render the KansasPregnancy', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <KansasPregnancy />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('.ArkansasHearingAid').length).toBe(1);
  });
  it('should render the SpecialFootwear', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <SpecialFootwear />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('.ArkansasHearingAid').length).toBe(1);
  });
  it('should render the TexasInVitro', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <TexasInVitro />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('.ArkansasHearingAid').length).toBe(1);
  });
  it('should render the WaHomeHealth', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <WaHomeHealth />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('.ArkansasHearingAid').length).toBe(1);
  });
  it('should render the WherePacketsMailedTitle', () => {
    const client = { address: 'address', city: 'city', state: 'state', zip: 'zip' };
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <WherePacketsMailedTitle client={client} />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('div').length).toBe(2);
  });
});
