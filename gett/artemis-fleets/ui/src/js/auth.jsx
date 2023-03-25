import Auth from 'pages/auth/App';
import auth from 'utils/auth';
import renderComponent from 'utils/renderComponent';

auth.isAuthenticated ? location.replace('/') : renderComponent(Auth);

if (module.hot) {
  module.hot.accept('pages/auth/App', () => {
    const component = require('pages/auth/App').default;
    renderComponent(component);
  });
}
