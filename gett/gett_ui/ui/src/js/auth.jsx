import Auth from 'pages/auth/App';
import auth from 'utils/auth';
import renderComponent from 'utils/renderComponent';

auth.ifNotAuthenticated(() => {
  renderComponent(Auth);
  auth.alertIfCannotAuthenticate();
});

if (module.hot) {
  module.hot.accept('pages/auth/App', () => {
    const component = require('pages/auth/App').default;
    renderComponent(component);
  });
}
