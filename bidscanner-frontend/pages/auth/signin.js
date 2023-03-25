// @flow
import SignInContainer from 'containers/signin/SignInContainer';
import withData from 'lib/withData';
import Router from 'next/router';

const SignInPage = () => <SignInContainer />;

SignInPage.getInitialProps = ctx => {
  if (ctx.query['auth-token']) {
    if (process.browser) {
      Router.push(`/password/create?auth-token=${ctx.query['auth-token']}&completed=${ctx.query.completed}&success=${ctx.query.success}`, `/completeaccount?auth-token=${ctx.query['auth-token']}&completed=${ctx.query.completed}&success=${ctx.query.success}`);
    } else {
      ctx.res.redirect(`/completeaccount?auth-token=${ctx.query['auth-token']}&completed=${ctx.query.completed}&success=${ctx.query.success}`);
    }

    return {};
  }

  return {};
};

export default withData(SignInPage);
