import { reduxForm, SubmissionError } from 'redux-form';
import { gql, graphql, compose } from 'react-apollo';

import Form from 'components/company/Company/InviteUserForm';
import validate from 'components/company/Company/InviteUserForm/validate';

const CREATE_COMPANY_INVITATION = gql`
  mutation($email: String!, $companyId: UUID!) {
    create_company_invitation(admin: true, email: $email, id: $companyId) {
      id
    }
  }
`;

export default compose(
  graphql(CREATE_COMPANY_INVITATION, {
    props: ({ mutate, ownProps: { companyId, onSuccess } }) => ({
      onSubmit: async ({ email }) => {
        try {
          await mutate({
            variables: {
              email,
              companyId,
            },
          });
          onSuccess();
        } catch (err) {
          throw new SubmissionError({ _error: 'Something has happened, please try again later' });
        }
      },
    }),
  }),
  reduxForm({
    form: 'invite-user',
    validate,
  })
)(Form);
