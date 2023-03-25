import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import Form, { bindState, Input } from 'components/form';
import { Button } from 'components';
import { Modal } from 'antd';
import { post, auth } from 'utils';
import Captcha from 'react-google-recaptcha';
import CN from 'classnames';

import css from './Auth.css';

const realmLabels = {
  admin: 'Back Office',
  app: 'Front Office',
  affiliate: 'Front Office'
};

export default class LogIn extends PureComponent {
  state = {
    showCaptcha: false,
    siteKey: null,
    processing: false
  };
  form = null;
  validations = {
    email: ['presence', 'email'],
    password: {
      presence: { message: 'Please enter your password.' }
    }
  };

  setFormRef = form => this.form = form;

  authenticate = ({ token, realms }) => {
    if (realms.length === 1) {
      auth.accept({ token, realm: realms[0] });
    } else {
      const realmOptions = realms.map((realm) => {
        return {
          realm,
          label: realmLabels[realm],
          handler: () => auth.accept({ token, realm })
        };
      });

      this.setState({ realmOptions });
    }
  };

  tryToAuthenticate(captchaResponse = null) {
    this.form.ifValid(() => {
      this.setState({ processing: true });

      post('/session', { user: { ...this.state.form, captchaResponse } })
        .then(({ data }) => {
          const { showCaptcha, siteKey } = data;

          if (showCaptcha == true) return this.setState({ showCaptcha, siteKey });

          this.authenticate(data);
        })
        .catch((error) => {
          this.setState({ authError: error.response.data.error, processing: false });
        });
    });
  }

  onCaptchaSuccess = (captchaResponse) => {
    this.setState({ showCaptcha: false });
    this.tryToAuthenticate(captchaResponse);
  };

  render() {
    const { authError, realmOptions, showCaptcha, siteKey, processing } = this.state;

    return (
      <div>
        <div className="text-30 mb-40 black-text light-text text-center">Log In</div>
        { authError &&
          <div className={ `pl-15 pr-15 pb-10 pt-10 mb-20 ${css.error}` } data-name="errorMessage">{ authError }</div>
        }
        <Form { ...bindState(this) } ref={ this.setFormRef } validations={ this.validations }>
          { $ => (
            <div>
              <Input
                { ...$('email') }
                disabled={ processing }
                onPressEnter={ () => this.tryToAuthenticate() }
                type="email"
                placeholder="Email"
                className="mb-20"
                icon="Email"
                iconClassName="light-grey-text"
                size="large"
              />
              <Input
                { ...$('password') }
                disabled={ processing }
                onPressEnter={ () => this.tryToAuthenticate() }
                type="password"
                placeholder="Password"
                className="mb-40"
                icon="Password"
                iconClassName="light-grey-text"
                size="large"
              />
            </div>
          ) }
        </Form>
        { showCaptcha && siteKey &&
          <div className="mb-20">
            <Captcha
              sitekey={ siteKey }
              onChange={ this.onCaptchaSuccess }
            />
          </div>
        }
        <div className="layout horizontal center">
          <Button type="primary" size="large" className={ CN('mr-40', css.loginBtn) } disabled={ processing } onClick={ () => this.tryToAuthenticate() }>
            Log In
          </Button>
          <Link to="/forgot" className="blue-text underline bold-text">Forgot password?</Link>
        </div>

        <Modal
          visible={ realmOptions && realmOptions.length > 1 }
          title="Log in"
          closable={ false }
          width={ 580 }
          footer={
            <div className="layout horizontal center-center">
              { realmOptions && realmOptions.map(option => (
                  <Button type={ option.realm === 'app' ? 'primary' : 'secondary' } key={ option.realm } onClick={ option.handler }>{ option.label }</Button>
                ))
              }
            </div>
          }
        >
          <div className="dark-grey-text">
            You have an access to two parts of application: Back and Front offices. Please select an office to be logged in under one
          </div>
        </Modal>
      </div>
    );
  }
}
