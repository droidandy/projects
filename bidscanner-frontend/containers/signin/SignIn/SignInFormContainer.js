import { reduxForm, SubmissionError } from 'redux-form';
import { gql, graphql, compose } from 'react-apollo';
import { withCookies } from 'react-cookie';
import Router from 'next/router';
import addDays from 'date-fns/add_days';

import SignInForm from 'components/signin/SignIn/SignInForm';
import validate from 'components/signin/SignIn/SignInForm/validate';

function ValidationError(message) {
  this.validationError = message;
}

const form = 'signInForm';

const signInMutation = gql`
  mutation SignIn($email: String!, $password: String!) {
    signin(login: $email, password: $password) {
      user {
        id
        first_name
        last_name
      }
      auth_token
    }
  }
`;

export default compose(
  withCookies,
  graphql(signInMutation, {
    props: ({ mutate, ownProps: { cookies } }) => ({
      onSubmit: async ({ email, password, stayConnected }) => {
        try {
          const { data: { signin } } = await mutate({
            variables: {
              email,
              password,
            },
          });

          if (signin === null) {
            throw new ValidationError('wrong email or password');
          } else {
            const { auth_token: token } = signin;
            cookies.set('token', token);

            if (stayConnected) {
              cookies.set('valid', 'true', {
                expires: addDays(new Date(), 7),
              });
            } else {
              cookies.set('valid', 'true', {
                expires: addDays(new Date(), 1),
              });
            }
          }

          Router.push('/user/account', '/account');
        } catch (error) {
          if (error.validationError) throw new SubmissionError({ _error: error.validationError });
          else throw new SubmissionError({ _error: 'Something has happened, please try again later' });
        }
      },
    }),
  }),
  reduxForm({
    form,
    validate,
  })
)(SignInForm);
