import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import Form, { bindState, Input } from 'components/form';
import { Icon } from 'components';
import { post, auth } from 'utils';

import css from './Auth.css';

export default class LogIn extends PureComponent {
  state = {};
  form = null;
  validations = {
    email: ['presence', 'email'],
    password: 'presence'
  };

  authenticate = () => {
    this.form.ifValid(() => {
      post('/sessions', { user: this.state.form })
        .then((response) => {
          auth.accept(response.data);
        }).catch((error) => {
          this.setState({ authError: error.response.data.error });
        });
    });
  };

  render() {
    const { authError } = this.state;

    return (
      <div>
        <div className="text-50 mb-20">Log In</div>
        { authError &&
          <div className={ `pl-15 pr-15 pb-10 pt-10 mb-20 ${css.error}` }>{ authError }</div>
        }
        <Form { ...bindState(this) } ref={ (form) => { this.form = form; } } validations={ this.validations }>
          { $ => (
            <div>
              <div className="relative mb-20">
                <Icon className={ `text-26 grey-text ${css.inputIcon}` } icon="UserIcon" />
                <Input { ...$('email') } onPressEnter={ this.authenticate } placeholder="Email" />
              </div>
              <div className="relative mb-5">
                <Icon className={ `text-26 grey-text ${css.inputIcon}` } icon="MdVpnKey" />
                <Input { ...$('password') } onPressEnter={ this.authenticate } type="password" placeholder="Password" />
              </div>
            </div>
          ) }
        </Form>
        <div className="text-right mb-20">
          <Link to="/forgot" className="grey-text">Forgot password?</Link>
        </div>
        <Button size="large" className="btn-blue block" onClick={ this.authenticate }>
          <span className="text-22">Log In</span>
        </Button>
      </div>
    );
  }
}
