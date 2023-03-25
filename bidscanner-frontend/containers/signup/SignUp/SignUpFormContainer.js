import { reduxForm, SubmissionError } from 'redux-form';
import { gql, graphql, compose } from 'react-apollo';
import Router from 'next/router';

import SignUp from 'components/signup/SignUp/SignUpForm';
import validate from 'components/signup/SignUp/SignUpForm/validate';

const form = 'signUpForm';

const signUp = gql`
  mutation SignUp($email: String!, $firstName: String!, $lastName: String!) {
    signup(email: $email, first_name: $firstName, last_name: $lastName) {
      updated_at
      id
    }
  }
`;

export default compose(
  graphql(signUp, {
    props: ({ mutate }) => ({
      onSubmit: async ({ email, firstName, lastName }) => {
        try {
          await mutate({
            variables: {
              email,
              firstName,
              lastName,
            },
          });
          Router.push('/system/status?after=signup');
        } catch (e) {
          throw new SubmissionError({ _error: 'Something has happened, please try again later' });
        }
      },
    }),
  }),
  reduxForm({
    form,
    validate,
  })
)(SignUp);
