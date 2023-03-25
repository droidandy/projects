import { reduxForm, SubmissionError } from 'redux-form';
import { gql, graphql, compose } from 'react-apollo';
import Router from 'next/router';

import RequestNewPasswordForm from 'components/request-new-password/RequestNewPassword/RequestNewPasswordForm';
import validate from 'components/request-new-password/RequestNewPassword/RequestNewPasswordForm/validate';

const form = 'requestNewPasswordForm';

const forgotPassword = gql`
  mutation forgot_password($email: String!) {
    forgot_password(email: $email)
  }
`;

export default compose(
  graphql(forgotPassword, {
    props: ({ mutate }) => ({
      onSubmit: async ({ email }) => {
        try {
          await mutate({
            variables: {
              email,
            },
          });
          Router.push('/system/status?after=requestnewpassword');
        } catch (e) {
          throw new SubmissionError({ _error: 'Something has happened, try again later!' });
        }
      },
    }),
  }),
  reduxForm({
    form,
    validate,
  })
)(RequestNewPasswordForm);
