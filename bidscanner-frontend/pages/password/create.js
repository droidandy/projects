// @flow
import CompleteAccountContainer from 'containers/complete-account/CompleteAccountContainer';
import withData from 'lib/withData';
import Router from 'next/router';

const CompleteAccountPage = () => <CompleteAccountContainer />;

CompleteAccountPage.getInitialProps = (ctx, cookies) => {
  if (!ctx.query['auth-token']) {
    ctx.res.redirect('/404');

    return {};
  }

  cookies.set('token', ctx.query['auth-token']);

  if (ctx.query.completed && ctx.query.completed === 'true') {
    if (process.browser) {
      Router.push('/user/account', '/account');
    } else {
      ctx.res.redirect('/account');
    }
  }

  return {};
};

export default withData(CompleteAccountPage);
