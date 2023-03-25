import React from 'react';
import {
  mount,
  configure,
  shallow,
} from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import Section from '../Section';
import configureStore from '../../../../store';
import SectionStore from '..';


configure({ adapter: new Adapter() });

describe('<SectionStore />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
    store.dispatch({
      type: 'app/PresentationPage/OPTIONS_GET_SUCCESS',
      payload: {
        category: 'MEDICAL',
        currentOption: {
          id: null,
          name: 'Current',
          displayName: null,
          carrier: 'Aetna',
          totalAnnualPremium: 4800,
          percentDifference: 0,
          planTypes: [
            'HMO',
          ],
          plans: [
            {
              name: 'AAA',
              type: 'HMO',
            },
          ],
          selected: false,
          quoteType: 'STANDARD',
          quoteState: null,
          optionType: 'OPTION',
          complete: false,
          category: null,
        },
        options: [
          {
            id: 553,
            name: 'Renewal',
            displayName: 'Renewal',
            carrier: 'Aetna',
            totalAnnualPremium: 0,
            percentDifference: -100,
            planTypes: [
              'HMO',
            ],
            plans: [
              {
                name: 'AAA',
                type: 'HMO',
              },
            ],
            selected: false,
            quoteType: 'STANDARD',
            quoteState: null,
            optionType: 'RENEWAL',
            complete: false,
            category: null,
          },
          {
            id: 554,
            name: 'Option 1',
            displayName: 'Option 1',
            carrier: 'Sharp Health Plans',
            totalAnnualPremium: 71760,
            percentDifference: 1395,
            planTypes: [
              'HMO',
            ],
            plans: [
              {
                name: 'name2',
                type: 'HMO',
              },
            ],
            selected: false,
            quoteType: 'STANDARD',
            quoteState: null,
            optionType: 'OPTION',
            complete: false,
            category: null,
          },
        ],
      },
      meta: {
        section: 'medical',
      },
    });
  });
  const params = {
    clientId: '123',
  };
  it('should render the Section component', () => {
    const renderedComponent = mount( // eslint-disable-line function-paren-newline
      <Provider store={store}>
        <IntlProvider locale="en">
          <SectionStore params={params} routes={[{}, {}, {}, {}, { path: 'medical' }]} />
        </IntlProvider>
      </Provider>);

    expect(renderedComponent.find(Section).length).toBe(1);
  });
});


describe('<Section />', () => {
  test('should render Quote component for testing quote-delete buttons', () => {
    const wrapper = shallow(
      <Section
        getAnotherOptions={jest.fn()}
        loading={false}
        loadingOptions={false}
        section="medical"
        routes={[{}, {}, {}, {}, {}]}
        current={{
          current: {
            percentDifference: 0,
            plans: [
              {
                name: 'AAA',
                type: 'HMO',
              },
              {
                name: 'AAA',
                type: 'HMO',
              },
            ],
            name: 'Current',
            displayName: null,
            optionType: 'OPTION',
            planTypes: [
              'HMO',
              'HMO',
            ],
            totalAnnualPremium: 9600,
            quoteState: null,
            quoteType: 'STANDARD',
            carrier: 'Cigna',
            complete: false,
            id: 'current',
            selected: false,
            category: null,
          },
        }}
        options={
          [
            {
              percentDifference: -100,
              plans: [
                {
                  name: 'AAA',
                  type: 'HMO',
                },
              ],
              name: 'Renewal',
              displayName: 'Renewal',
              optionType: 'RENEWAL',
              planTypes: [
                'HMO',
              ],
              totalAnnualPremium: 0,
              quoteState: null,
              quoteType: 'STANDARD',
              carrier: 'Aetna',
              complete: false,
              id: 553,
              selected: false,
              category: null,
            },
            {
              percentDifference: 1395,
              plans: [
                {
                  name: 'name2',
                  type: 'HMO',
                },
              ],
              name: 'Option 1',
              displayName: 'Option 1',
              optionType: 'OPTION',
              planTypes: [
                'HMO',
              ],
              totalAnnualPremium: 71760,
              quoteState: null,
              quoteType: 'STANDARD',
              carrier: 'Sharp Health Plans',
              complete: false,
              id: 554,
              selected: false,
              category: null,
            },
            {
              percentDifference: 1395,
              plans: [
                {
                  name: 'name2',
                  type: 'HMO',
                },
              ],
              name: 'Option 1',
              displayName: 'Option 1',
              optionType: 'OPTION',
              planTypes: [
                'HMO',
              ],
              totalAnnualPremium: 71760,
              quoteState: null,
              quoteType: 'STANDARD',
              carrier: 'Sharp Health Plans',
              complete: false,
              id: 554,
              selected: false,
              category: null,
            },
          ]
        }
        load={false}
        client={{
          current: {
            rfpProducts: [
              {
                extProductId: 4,
                name: 'MEDICAL',
                displayName: 'Medical',
                discount: null,
                discountPercent: null,
                virginGroup: false,
              },
              {
                extProductId: 5,
                name: 'DENTAL',
                displayName: 'Dental',
                discount: null,
                discountPercent: null,
                virginGroup: false,
              },
              {
                extProductId: 6,
                name: 'VISION',
                displayName: 'Vision',
                discount: null,
                discountPercent: null,
                virginGroup: false,
              },
            ],
            fedTaxId: null,
            contactZip: null,
            employeeCount: null,
            zip: null,
            minimumHours: null,
            averageAge: null,
            dueDate: null,
            dba: null,
            products: {
              medical: true,
              dental: true,
              vision: true,
              life: false,
              std: false,
              ltd: false,
            },
            brokerName: 'Lemdy Brokerage House',
            extProducts: null,
            retireesCount: null,
            clientState: 'RFP Started',
            participatingEmployees: null,
            domesticPartner: null,
            cobraCount: null,
            city: null,
            contactCity: null,
            contactName: null,
            predominantCounty: null,
            carrierOwned: false,
            clientToken: '7c1b0fdb-0691-4a75-b4d4-db6865430050',
            contactPhone: null,
            clientMembers: [
              {
                lastName: null,
                brokerageId: 6,
                authId: 'auth0|5aa95de78bd5067ff5770a3a',
                brokerName: 'Lemdy Brokerage House',
                fullName: 'lemdy.orakwue+dev.broker@benrevo.com',
                id: 188,
                firstName: null,
                email: 'lemdy.orakwue+dev.broker@benrevo.com',
                generalAgent: false,
              },
            ],
            addressComplementary: null,
            eligibleEmployees: null,
            contactState: null,
            submittedRfpSeparately: false,
            state: null,
            imageUrl: null,
            brokerId: 6,
            contactAddress: null,
            lastVisited: null,
            address: null,
            virginCoverage: {
              medical: false,
              dental: false,
              vision: false,
              life: false,
              std: false,
              ltd: false,
            },
            effectiveDate: '6/30/2018',
            gaId: null,
            clientName: 'Test Create Plan',
            dateQuestionnaireCompleted: null,
            membersCount: null,
            attributes: [],
            declinedOutside: false,
            rfps: null,
            outToBidReason: null,
            contactTitle: null,
            sicCode: null,
            businessType: null,
            website: null,
            id: 233,
            policyNumber: null,
            contactEmail: null,
            contactFax: null,
            orgType: null,
          },
        }}
        rfpCarriers={{
          medical: [
            {
              rfpCarrierId: 4,
              category: 'MEDICAL',
              endpoint: null,
              carrier: {
                logoUrl: '//dev-api-app.benrevo.com/images/AETNA.png',
                networks: null,
                originalImageUrl: '//dev-api-app.benrevo.com/images/original/AETNA.png',
                name: 'AETNA',
                amBestRating: 'A',
                displayName: 'Aetna',
                carrierId: 1,
                logoWKaiserUrl: '//dev-api-app.benrevo.com/images/AETNA_KAISER.png',
                originalImageKaiserUrl: '//dev-api-app.benrevo.com/images/original/AETNA_KAISER.png',
              },
            },
          ],
          dental: [
            {
              rfpCarrierId: 11,
              category: 'DENTAL',
              endpoint: null,
              carrier: {
                logoUrl: '//dev-api-app.benrevo.com/images/AETNA.png',
                networks: null,
                originalImageUrl: '//dev-api-app.benrevo.com/images/original/AETNA.png',
                name: 'AETNA',
                amBestRating: 'A',
                displayName: 'Aetna',
                carrierId: 1,
                logoWKaiserUrl: '//dev-api-app.benrevo.com/images/AETNA_KAISER.png',
                originalImageKaiserUrl: '//dev-api-app.benrevo.com/images/original/AETNA_KAISER.png',
              },
            },
          ],
          vision: [
            {
              rfpCarrierId: 32,
              category: 'VISION',
              endpoint: null,
              carrier: {
                logoUrl: '//dev-api-app.benrevo.com/images/AETNA.png',
                networks: null,
                originalImageUrl: '//dev-api-app.benrevo.com/images/original/AETNA.png',
                name: 'AETNA',
                amBestRating: 'A',
                displayName: 'Aetna',
                carrierId: 1,
                logoWKaiserUrl: '//dev-api-app.benrevo.com/images/AETNA_KAISER.png',
                originalImageKaiserUrl: '//dev-api-app.benrevo.com/images/original/AETNA_KAISER.png',
              },
            },
          ],
        }
        }
        getOptions={() => {}}
        initOptions={() => {}}
        optionsDelete={() => {}}
        changeCurrentPage={() => {}}
        changePage={() => {}}
        getPlansTemplates={() => {}}
        violationNotification={{}}
      />);
    expect(wrapper.find('div').length).toBe(8);
    wrapper.setProps({ loading: true });
    expect(wrapper.find('div').length).toBe(3);
  });
});
