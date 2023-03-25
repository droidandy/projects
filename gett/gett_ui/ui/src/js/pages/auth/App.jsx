import React, { PureComponent } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { Icon, Desktop } from 'components';
import { attachAnalytics } from 'components/GoogleAnalytics';
import LogIn, { ForgotPassword, ResetPassword, SetPassword } from 'pages/auth';
import { Service } from 'pages/shared/static';
import Slider from './components/Slider';
import CN from 'classnames';

import 'utils/initializers/addTokenRedirectListener';

import css from './Auth.css';

export default class App extends PureComponent {
  renderAppLayout = () => {
    return (
      <div className={ CN('layout horizontal', css.wrapper) }>
        <div className={ CN('flex layout vertical justified', css.formWrapper) }>
          <Icon icon="LogoOT" width={ 156 } height={ 60 } />
          <div className={ CN(css.form, 'self-center') }>
            <Switch>
              <Route exact path="/" component={ LogIn } />
              <Route path="/forgot" component={ ForgotPassword } />
              <Route path="/reset" component={ ResetPassword } />
              <Route path="/set" component={ SetPassword } />
            </Switch>
          </div>
          <div className="layout horizontal center center-justified wrap grey-text">
            <Link to="/terms-and-conditions" className="grey-text">Terms & Conditions</Link>
            &nbsp;&nbsp;&bull;&nbsp;&nbsp;
            <Link to="/privacy-policy" className="grey-text">Privacy Policy</Link>
            &nbsp;&nbsp;&bull;&nbsp;&nbsp;
            <a className="grey-text" target="_blank" rel="noopener noreferrer" href="https://gett.com/uk/contact-gbs/">Contact Us</a>
          </div>
        </div>
        <Desktop><Slider /></Desktop>
      </div>
    );
  };

  render() {
    return (
      <Router basename="/auth">
        <div>
          { attachAnalytics() }
          <Switch>
            <Route exact path="/privacy-policy" component={ Service } />
            <Route exact path="/terms-and-conditions" component={ Service } />
            <Route path="*" render={ this.renderAppLayout } />
          </Switch>
        </div>
      </Router>
    );
  }
}
