import { reduxForm, SubmissionError } from 'redux-form';
import { gql, graphql, compose } from 'react-apollo';

import Form from 'components/company/Company/AddCertificateForm';
import validate from 'components/company/Company/AddCertificateForm/validate';

const CREATE_CERTIFICATE_MUTATION = gql`
  mutation CreateCertificate($input: CertificateInput!) {
    create_certificate(input: $input) {
      id
    }
  }
`;

const INSTITUTIONS_QUERY = gql`
  query {
    institutions {
      edges {
        id
        name
      }
    }
  }
`;

const CERTIFICATIONS_QUERY = gql`
  query {
    certifications {
      edges {
        id
        name
      }
    }
  }
`;

export default compose(
  graphql(CERTIFICATIONS_QUERY, {
    name: 'certifications',
  }),
  graphql(INSTITUTIONS_QUERY, {
    name: 'institutions',
  }),
  graphql(CREATE_CERTIFICATE_MUTATION, {
    props: ({ mutate, ownProps: { companyId, countryId, onCertificateAdded } }) => ({
      onSubmit: async ({ certification, institution, number, issueDate, expiryDate }) => {
        try {
          const input = {
            company_id: companyId,
            country_id: countryId,
            certification_id: certification,
            institution_id: institution,
            number,
            issued_at: issueDate,
            expires_at: expiryDate,
            documents: [],
          };

          await mutate({
            variables: {
              input,
            },
          });

          onCertificateAdded();
        } catch (err) {
          throw new SubmissionError({ _error: 'Something has happened, please try again later' });
        }
      },
    }),
  }),
  reduxForm({
    form: 'add-certificate',
    initialValues: {},
    validate,
  })
)(Form);
