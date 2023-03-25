import Admin from 'pages/admin/Entry';
import auth from 'utils/auth';
import renderComponent from 'utils/renderComponent';

auth.ifAuthenticated('admin', () => renderComponent(Admin));

if (module.hot) {
  module.hot.accept('pages/admin/Entry', () => {
    const component = require('pages/admin/Entry').default;
    renderComponent(component);
  });
}
