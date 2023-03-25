// @flow
import React from 'react';

import Message from 'components/status/Status/Message';

type StatusProps = {
  prevPage?: string,
};

export default ({ prevPage }: StatusProps) => {
  switch (prevPage) {
    case 'signup':
      return (
        <Message
          title="Please, check your email!"
          subtitle="Continue with"
          linkTo="auth/signin"
          linkTitle="Sign In"
        />
      );
    case 'requestnewpassword':
      return (
        <Message
          title="Please, check your email!"
          subtitle="Continue with"
          linkTo="auth/signin"
          linkTitle="Sign In"
        />
      );
    case 'createnewpassword':
      return (
        <Message
          title="Please, check your email!"
          subtitle="Continue with"
          linkTo="auth/signin"
          linkTitle="Sign In"
        />
      );
    default:
      return (
        <Message
          title="Go to account page!"
          subtitle="Continue to"
          linkTo="account"
          linkTitle="Account Page"
        />
      );
  }
};
