import { reduxForm, SubmissionError } from 'redux-form';
import { gql, graphql, compose } from 'react-apollo';
import Router from 'next/router';
import { withCookies } from 'react-cookie';

import CompleteAccountForm from 'components/complete-account/CompleteAccount/CompleteAccountForm';
import validate from 'components/complete-account/CompleteAccount/CompleteAccountForm/validate';

const form = 'completeUserCreationForm';

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

          Router.push('/general/home', '/');
        } catch (e) {
          throw new SubmissionError({ _error: 'Something has happened!' });
        }
      },
    }),
  }),
  reduxForm({
    form,
    validate,
    destroyOnUnmount: false,
  })
)(CompleteAccountForm);
