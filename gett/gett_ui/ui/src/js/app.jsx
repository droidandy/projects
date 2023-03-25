import App from 'pages/app/Entry';
import auth from 'utils/auth';
import renderComponent from 'utils/renderComponent';

auth.ifAuthenticated('app', () => renderComponent(App));

if (module.hot) {
  module.hot.accept('pages/app/Entry', () => {
    const component = require('pages/app/Entry').default;
    renderComponent(component);
  });
}
