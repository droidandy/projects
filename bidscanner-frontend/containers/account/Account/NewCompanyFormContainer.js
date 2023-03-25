import { reduxForm, SubmissionError } from 'redux-form';
import { gql, graphql, compose, withApollo } from 'react-apollo';
import { get } from 'lodash';

import Form from 'components/account/Account/NewCompanyForm';
import validate from 'components/account/Account/NewCompanyForm/validate';

const CREATE_COMPANY_MUTATION = gql`
  mutation CreateCompany($input: CompanyInput!) {
    create_company(input: $input) {
      id
    }
  }
`;

const COMPANY_TYPES_QUERY = gql`
  query {
    company_types {
      edges {
        id
        name
      }
    }
  }
`;

const BUSINESS_TYPES_QUERY = gql`
  query {
    business_types {
      edges {
        id
        name
      }
    }
  }
`;

export default compose(
  withApollo,
  graphql(COMPANY_TYPES_QUERY, {
    name: 'companyTypes',
    props: ({ companyTypes }) => ({
      companyTypes: get(companyTypes, 'company_types.edges'),
    }),
  }),
  graphql(BUSINESS_TYPES_QUERY, {
    name: 'businessTypes',
    props: ({ businessTypes }) => ({
      businessTypes: get(businessTypes, 'business_types.edges'),
    }),
  }),
  graphql(CREATE_COMPANY_MUTATION, {
    props: ({ mutate, ownProps: { onCreateCompany } }) => ({
      onSubmit: async ({
        address,
        name,
        website,
        companyType: company_type_id,
        legalBusinessType: business_type_id,
        logo: { bucketId: logo_id },
      }) => {
        try {
          const input = {
            address: address.asObject,
            logo_id,
            name,
            website,
            documents: [],
            company_type_id,
            business_type_id,
            photos: [],
            description: 'some description',
          };

          await mutate({
            variables: {
              input,
            },
          });

          onCreateCompany();
        } catch (err) {
          throw new SubmissionError({
            _error: 'Something has happened, please try again later',
          });
        }
      },
    }),
  }),
  reduxForm({
    form: 'new-company',
    initialValues: {
      logo: null,
    },
    validate,
  })
)(Form);
