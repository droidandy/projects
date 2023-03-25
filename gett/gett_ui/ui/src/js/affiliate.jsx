import Affiliate from 'pages/affiliate/Entry';
import auth from 'utils/auth';
import renderComponent from 'utils/renderComponent';

auth.ifAuthenticated('affiliate', () => renderComponent(Affiliate));

if (module.hot) {
  module.hot.accept('pages/affiliate/Entry', () => {
    const component = require('pages/affiliate/Entry').default;
    renderComponent(component);
  });
}
