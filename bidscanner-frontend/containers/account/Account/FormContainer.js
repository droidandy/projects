import { reduxForm, SubmissionError } from 'redux-form';
import { gql, graphql, compose } from 'react-apollo';
import { withProps } from 'recompose';
import validate from 'components/account/Account/Form/validate';
import { isValidNumber } from 'libphonenumber-js';
import { get } from 'lodash';
import Router from 'next/router';

import addressDataToString from 'utils/addressDataToString';
import addressDataToAddressInput from 'utils/addressDataToAddressInput';

import Form from 'components/account/Account/Form';

// queries
const ME_QUERY = gql`
  query {
    me {
      id
      portfolios {
        id
        name
        subcategories {
          name
          id
        }
      }
      phone_number {
        id
        number
      }
      address {
        id
        postal_code
        street_number
        street_name
        city
        country {
          id
          iso_3166_1_alpha_2
        }
        region {
          id
        }
      }
    }
  }
`;

// location {
//   latitude
//   longitude
// }

const MACROCATEGORIES_QUERY = gql`
  query {
    macrocategories {
      edges {
        display_order
        id
        name
        categories {
          display_order
          id
          name
          subcategories {
            id
            name
          }
        }
      }
    }
  }
`;

const COMPANIES_QUERY = gql`
  query Companies($query: String) {
    companies(approval: APPROVAL_ALL, query: $query) {
      edges {
        id
        name
        user {
          id
        }
      }
    }
  }
`;

const MY_COMPANY_APPLICATIONS_QUERY = gql`
  query {
    my_company_applications {
      edges {
        id
        accepted_at
        rejected_at
        company {
          name
        }
      }
    }
  }
`;

const MY_COMPANY_INVITATIONS_QUERY = gql`
  query {
    my_company_invitations {
      edges {
        id
        accepted_at
        rejected_at
        company {
          name
        }
      }
    }
  }
`;

// mutations

const CHANGE_USER_ADDRESS_MUTATION = gql`
  mutation ChangeUserAddress($input: AddressInput!) {
    change_user_address(input: $input) {
      id
    }
  }
`;

const REJECT_COMPANY_INVITATION_MUTATION = gql`
  mutation RejectCompanyInvitation($invitationId: UUID!) {
    reject_company_invitation(id: $invitationId) {
      id
      rejected_at
      accepted_at
    }
  }
`;

const ACCEPT_COMPANY_INVITATION_MUTATION = gql`
  mutation AcceptCompanyInvitation($invitationId: UUID!) {
    accept_company_invitation(id: $invitationId) {
      id
      rejected_at
      accepted_at
    }
  }
`;

const UPDATE_PORTFOLIO_MUTATION = gql`
  mutation UpdatePortfolio($portfolioId: UUID!, $input: PortfolioInput!) {
    update_portfolio(id: $portfolioId, input: $input) {
      id
    }
  }
`;

const CREATE_PHONE_NUMBER_MUTATION = gql`
  mutation CreatePhoneNumber($phoneNumber: String!) {
    create_phone_number(number: $phoneNumber) {
      id
    }
  }
`;

const CHANGE_PHONE_NUMBER_MUTATION = gql`
  mutation ChangePhoneNumber($phoneId: UUID!) {
    change_phone_number(id: $phoneId) {
      id
    }
  }
`;

export default compose(
  // the main query basically with all information which is displayed on page
  graphql(ME_QUERY, {
    name: 'me',
  }),
  // the data are used for [macrocategories -> categories -> subcategories] dropdowns
  graphql(MACROCATEGORIES_QUERY, {
    name: 'macrocategories',
    props: ({ macrocategories }) => ({
      macrocategories: get(macrocategories, 'macrocategories.edges'),
    }),
  }),
  // application & invitation queries
  graphql(MY_COMPANY_APPLICATIONS_QUERY, {
    name: 'applications',
    props: ({ applications }) => ({
      applications: get(applications, 'my_company_applications.edges'),
      refetchApplications: get(applications, 'refetch'),
    }),
  }),
  graphql(MY_COMPANY_INVITATIONS_QUERY, {
    name: 'invitations',
    props: ({ invitations }) => ({
      invitations: get(invitations, 'my_company_invitations.edges'),
    }),
  }),
  // populating values of the form through initialValues prop
  // creating new props which are used later
  withProps(({ me }) => {
    const portfolios = get(me, 'me.portfolios');
    const phone = get(me, 'me.phone_number.number');
    const userId = get(me, 'me.id');

    const address = get(me, 'me.address');
    // to have the ability to submit this value
    const asObject = addressDataToAddressInput(address);

    // [0] & [1] because we have only -buy- & -sell- portfolios
    const sellSubcategories = get(portfolios, '[0].subcategories', []);
    const buySubcategories = get(portfolios, '[1].subcategories', []);

    const sellPortfolioId = get(portfolios, '[0].id');
    const buyPortfolioId = get(portfolios, '[1].id');

    return {
      initialValues: {
        sellCategories: sellSubcategories || [],
        buyCategories: buySubcategories || [],
        phone,
        address: {
          asObject,
          asString: address ? addressDataToString(address) : '',
        },
      },
      // for update portfolio mutation
      sellPortfolioId,
      buyPortfolioId,
      // for filtering out user's companies
      userId,
      // to decide to change phone number or to create one
      currentPhoneNumber: phone,
    };
  }),
  // companies
  graphql(COMPANIES_QUERY, {
    name: 'companies',
    props: ({ companies }) => ({
      companies: get(companies, 'companies.edges') || [],
      refetchCompanies: get(companies, 'refetch'),
    }),
  }),
  graphql(UPDATE_PORTFOLIO_MUTATION, {
    name: 'updatePortfolio',
    props: ({ updatePortfolio, ownProps: { sellPortfolioId, buyPortfolioId } }) => ({
      onSellPortfolioUpdate: async subcategories => {
        try {
          await updatePortfolio({
            variables: {
              portfolioId: sellPortfolioId,
              input: {
                subcategories,
              },
            },
          });
        } catch (e) {
          throw new Error('Something has happened during the update of sell portfolio');
        }
      },
      onBuyPortfolioUpdate: async subcategories => {
        try {
          await updatePortfolio({
            variables: {
              portfolioId: buyPortfolioId,
              input: {
                subcategories,
              },
            },
          });
        } catch (e) {
          throw new Error('Something has happened during the update of buy portfolio');
        }
      },
    }),
  }),
  graphql(CHANGE_USER_ADDRESS_MUTATION, {
    name: 'changeUserAddress',
    props: ({ changeUserAddress }) => ({
      onChangeUserAddress: async address => {
        try {
          await changeUserAddress({
            variables: {
              input: address,
            },
          });
        } catch (err) {
          switch (err.name) {
            case 'AddressError':
              throw new SubmissionError({ _error: err.message, address: err.message });
            default:
              throw new SubmissionError({ _error: 'Something has happened, please try again later' });
          }
        }
      },
    }),
  }),
  // working with invitations
  graphql(ACCEPT_COMPANY_INVITATION_MUTATION, {
    name: 'acceptCompanyInvitation',
    props: ({ acceptCompanyInvitation }) => ({
      onAcceptCompanyInvitation: async invitationId => {
        try {
          await acceptCompanyInvitation({
            variables: {
              invitationId,
            },
          });
        } catch (e) {
          throw new Error('Something has happened during the accepting of the invitation');
        }
      },
    }),
  }),
  graphql(REJECT_COMPANY_INVITATION_MUTATION, {
    name: 'rejectCompanyInvitation',
    props: ({ rejectCompanyInvitation }) => ({
      onRejectCompanyInvitation: async invitationId => {
        try {
          await rejectCompanyInvitation({
            variables: {
              invitationId,
            },
          });
        } catch (e) {
          throw new Error('Something has happened during the rejecting of the invitation');
        }
      },
    }),
  }),
  // the mutation is used during initial phone number binding (user don't have phone number yet)
  graphql(CREATE_PHONE_NUMBER_MUTATION, {
    name: 'createPhoneNumber',
    props: ({ createPhoneNumber }) => ({
      // will overwrite the mutation
      createPhoneNumber: async phoneNumber => {
        if (!isValidNumber(phoneNumber)) {
          throw new Error('Please use correct phone number');
        }
        try {
          return await createPhoneNumber({
            variables: {
              phoneNumber,
            },
          });
        } catch (e) {
          throw new Error('Creation of phone number was unsuccessful');
        }
      },
    }),
  }),
  // the mutation is used to update the current phone number
  graphql(CHANGE_PHONE_NUMBER_MUTATION, {
    name: 'changePhoneNumber',
    props: ({ changePhoneNumber, ownProps: { createPhoneNumber } }) => ({
      onChangePhoneNumber: async newPhoneNumber => {
        if (!isValidNumber(newPhoneNumber)) {
          throw new Error('Please use correct phone number');
        }
        const mutationResult = await createPhoneNumber(newPhoneNumber);
        const newPhoneNumberId = get(mutationResult, 'data.create_phone_number.id');
        try {
          await changePhoneNumber({
            variables: {
              phoneId: newPhoneNumberId,
            },
          });
        } catch (err) {
          throw new Error('Changing the phone number was unsuccessful');
        }
      },
    }),
  }),
  // creation of factory to use different submit behaviours for different fields
  withProps(
    ({
      onSellPortfolioUpdate,
      onBuyPortfolioUpdate,
      onChangeUserAddress,
      onChangePhoneNumber,
      createPhoneNumber,
      currentPhoneNumber,
    }) => ({
      onSubmit: async formValues => {
        const { address, phone } = formValues;
        let { buyCategories, sellCategories } = formValues;

        try {
          // in order
          try {
            // TODO: fix location problems
            await onChangeUserAddress({
              ...address.asObject,
              location: {
                longitude: 1.0,
                latitude: 1.0,
              },
            });
          } catch (err) {
            throw new SubmissionError({
              address: err.message,
              _error: err.message,
            });
          }

          try {
            sellCategories = sellCategories || [];
            const subcategories = sellCategories.map(v => v.id);
            await onSellPortfolioUpdate(subcategories);
          } catch (err) {
            throw new SubmissionError({
              sellCategories: err.message,
              _error: err.message,
            });
          }

          try {
            buyCategories = buyCategories || [];
            const subcategories = buyCategories.map(v => v.id);
            await onBuyPortfolioUpdate(subcategories);
          } catch (err) {
            throw new SubmissionError({
              buyCategories: err.message,
              _error: err.message,
            });
          }

          try {
            // if user returns back his current phone number
            if (currentPhoneNumber === phone) {
              await Promise.resolve;
              // if user doesn't have any number yet
            } else if (currentPhoneNumber) {
              await onChangePhoneNumber(phone);
              // user already has one, wants to change
            } else {
              await createPhoneNumber(phone);
            }

            Router.push('/private/account/profile/company');
          } catch (err) {
            throw new SubmissionError({
              phone: err.message,
              _error: err.message,
            });
          }
        } catch (err) {
          throw err;
        }
      },
    })
  ),
  reduxForm({
    form: 'my-account',
    validate,
  })
)(Form);
