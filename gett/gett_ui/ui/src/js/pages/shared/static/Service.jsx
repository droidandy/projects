import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Tabs } from 'antd';
import { Icon, Desktop } from 'components';
import { TermsOfConditions, PrivacyPolicy } from './components';
import css from './components/style.css';

const { TabPane } = Tabs;

export default class Service extends PureComponent {
  static contextTypes = {
    router: PropTypes.object
  };

  render() {
    const { route, history } = this.context.router;

    return (
      <div className="mt-40">
        <div className="text-center relative">
          <div onClick={ history.goBack } className={ `pointer layout horizontal center ${css.goBack}` }>
            <div className={ `layout horizontal center center-justified text-center mr-20 ${css.circle}` }>
              <Icon icon="MdKeyboardBackspace" className="text-20" />
            </div>
            <Desktop>Back to Gett Business Solutions</Desktop>
          </div>
          <Link className="black-text self-center" to="/">
            <Icon icon="LogoOT" width={ 170 } height={ 50 } />
          </Link>
        </div>
        <div className="layout horizontal center-center mt-40">
          <Tabs defaultActiveKey={ route.match.path } className={ css.tabs }>
            <TabPane tab="Terms & Conditions" key="/terms-and-conditions">
              <TermsOfConditions />
            </TabPane>
            <TabPane tab="Privacy Policy" key="/privacy-policy">
              <PrivacyPolicy />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
