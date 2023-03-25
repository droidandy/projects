import { reduxForm, SubmissionError } from 'redux-form';
import { gql, graphql, compose } from 'react-apollo';
import Router from 'next/router';
import { withCookies } from 'react-cookie';

import CreateNewPasswordForm from 'components/create-new-password/CreateNewPassword/CreateNewPasswordForm';
import validate from 'components/create-new-password/CreateNewPassword/CreateNewPasswordForm/validate';

const form = 'createNewPasswordForm';

const changePassword = gql`
  mutation change_password($password: String!) {
    change_password(password: $password) {
      id
    }
  }
`;

export default compose(
  withCookies,
  graphql(changePassword, {
    props: ({ mutate }) => ({
      onSubmit: async ({ password }) => {
        try {
          await mutate({
            variables: {
              password,
            },
          });
          Router.push('/auth/signin', '/signin');
        } catch (e) {
          throw new SubmissionError({ _error: 'Something has happened!' });
        }
      },
    }),
  }),
  reduxForm({
    form,
    validate,
  })
)(CreateNewPasswordForm);
