import { reduxForm, SubmissionError } from 'redux-form';
import { gql, graphql, compose } from 'react-apollo';
import Dialog from 'components/account/Account/CompanyReqDialogContent';
import { get } from 'lodash';

const COMPANY_QUERY = gql`
  query Company($id: UUID!) {
    company(id: $id) {
      id
      name
      business_type {
        id
        name
      }
      user {
        id
        first_name
        last_name
        profile_photo {
          images {
            bucket_key
          }
        }
      }
      logo {
        id
        images {
          bucket_key
        }
      }
    }
  }
`;

const CREATE_COMPANY_APPLICATION_MUTATION = gql`
  mutation CreateCompanyApplication($companyId: UUID!) {
    create_company_application(id: $companyId) {
      id
    }
  }
`;

export default compose(
  graphql(COMPANY_QUERY, {
    name: 'company',
    options: ({ selectedCompany }) => ({
      variables: {
        id: selectedCompany.id,
      },
    }),
    props: ({ company }) => {
      const loading = get(company, 'loading');

      const companyLogoBucketKey = get(company, 'company.logo.images[0].bucket_key');
      const companyName = get(company, 'company.name');
      const businessType = get(company, 'company.business_type.name');

      const firstName = get(company, 'company.user.first_name');
      const lastName = get(company, 'company.user.last_name');
      const avatarBucketKey = get(company, 'company.user.profile_photo.images[0].bucket_key');

      return {
        loading,

        companyName,
        businessType,
        companyLogoBucketKey,

        firstName,
        lastName,
        avatarBucketKey,
      };
    },
  }),
  graphql(CREATE_COMPANY_APPLICATION_MUTATION, {
    props: ({ mutate, ownProps: { onSendRequest, selectedCompany } }) => ({
      onSubmit: async () => {
        try {
          await mutate({
            variables: {
              companyId: selectedCompany.id,
            },
          });
          onSendRequest();
        } catch (err) {
          throw new SubmissionError({ _error: 'Something has happened, please try again later' });
        }
      },
    }),
  }),
  reduxForm({
    form: 'create-company-request',
  })
)(Dialog);
