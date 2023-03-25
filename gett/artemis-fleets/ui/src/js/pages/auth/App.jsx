import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { Row, Col } from 'antd';
import LogIn, { ForgotPassword, ResetPassword, SetPassword } from 'pages/auth';
import { Icon } from 'components';

import css from './Auth.css';

export default function App() {
  return (
    <Router basename="/auth">
      <div>
        <div className="pt-10 pb-10 pl-20">
          <Link className="black-text" to="/">
            <Icon icon="LogoOT" className="logo-ot" />
          </Link>
        </div>
        <Row type="flex" className={ css.wrapper }>
          <Col md={ 16 } xs={ 0 } className={ css.banner }>
            <div className={ `black-text p-20 text-20 ${css.text}` }>
              Track you fleet`s performance in real time with our Partner Portal
            </div>
          </Col>
          <Col xs={ 24 } sm={ 8 } className="sand-bg p-20">
            <Row type="flex" justify="center" align="middle" className={ css.formWrapper }>
              <div className={ css.form }>
                <Switch>
                  <Route exact path="/" component={ LogIn } />
                  <Route path="/forgot" component={ ForgotPassword } />
                  <Route path="/reset" component={ ResetPassword } />
                  <Route path="/set" component={ SetPassword } />
                </Switch>
              </div>
            </Row>
          </Col>
        </Row>
      </div>
    </Router>
  );
}
