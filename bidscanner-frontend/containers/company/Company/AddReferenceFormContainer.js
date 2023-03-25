import { reduxForm, SubmissionError } from 'redux-form';
import { gql, graphql, compose } from 'react-apollo';
// import { get } from 'lodash';

import { withProps } from 'recompose';

import Form from 'components/company/Company/AddReferenceForm';
import validate from 'components/company/Company/AddReferenceForm/validate';

const CREATE_PROJECT_MUTATION = gql`
  mutation($input: ProjectInput!) {
    create_project(input: $input) {
      id
    }
  }
`;

// const UPDATE_PROJECT_MUTATION = gql`
//   mutation($id: UUID!, $input: ProjectInput!) {
//     update_project(input: $input) {
//       id
//     }
//   }
// `;

const CURRENCIES_QUERY = gql`
  query {
    currencies {
      edges {
        id
        name
      }
    }
  }
`;

const COUNTRIES_QUERY = gql`
  query {
    countries {
      edges {
        id
        name
        iso_3166_1_alpha_3
      }
    }
  }
`;

export default compose(
  graphql(CURRENCIES_QUERY, {
    name: 'currencies',
  }),
  graphql(COUNTRIES_QUERY, {
    name: 'countries',
  }),
  graphql(CREATE_PROJECT_MUTATION, {
    props: ({ mutate, ownProps: { companyId } }) => ({
      onSubmit: async ({ /* customerName, */ country, projectName, description, year, amount }) => {
        try {
          const input = {
            name: projectName,
            country_id: country,
            description,
            company_id: companyId,
            year,
          };

          if (amount.value) {
            input.value = Number(amount.value);
            input.currency_id = amount.currency;
          }

          await mutate({
            variables: {
              input,
            },
          });
        } catch (err) {
          throw new SubmissionError({ _error: 'Something has happened, please try again later' });
        }
      },
    }),
  }),
  withProps(() => ({
    initialValues: {
      amount: {
        value: '',
        currency: '',
      },
    },
  })),
  reduxForm({
    form: 'add-reference',
    initialValues: {
      amount: { value: '', currency: '' },
    },
    validate,
  })
)(Form);
