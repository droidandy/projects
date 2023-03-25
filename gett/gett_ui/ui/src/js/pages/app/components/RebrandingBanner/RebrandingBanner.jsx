import React, { Component } from 'react';
import { Modal } from 'antd';
import { ButtonLink } from 'components';
import CN from 'classnames';
import moment from 'moment';

import css from './RebrandingBanner.css';

import becomingHeader from 'assets/images/rebranding-header-1.png';
import arrivedHeader from 'assets/images/rebranding-header-2.png';

const enabled = process.env.RAILS_ENV !== 'test_features';

const showData = {
  becoming: {
    check() { return enabled && moment().isBetween('2018-11-20 00:00:00', '2018-11-25 23:59:59'); },
    header: becomingHeader
  },
  arrived: {
    // `false` will be removed before deploy itself to prevent showing "arrived popup"
    // before it has actually arrived
    check() { return false && enabled && moment().isAfter('2018-11-26 00:00:00'); },
    header: arrivedHeader
  }
};

export default class RebrandingPopup extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    for (const key in showData) {
      if (showData[key].check() && !localStorage.getItem(`rebranding-${key}-shown`)) {
        this.state = { showKey: key };
        break;
      }
    }
  }

  close = () => {
    localStorage.setItem(`rebranding-${this.state.showKey}-shown`, true);
    this.setState({ showKey: null });
  };

  renderContent() {
    switch (this.state.showKey) {
      case 'becoming':
        return (
          <div className="layout vertical center">
            <div className="layout vertical center mt-40">
              <div className="text-24 bold-text">
                One Transport is becoming
              </div>
              <div className="text-24 bold-text">
                Gett Business Solutions
              </div>
            </div>
            <div className={ CN('text-center mt-30 mb-40', css.w470) }>
              On November 26th One Transport is getting a new look and feel and a new name - Gett Business Solutions.
              All of our great features and capabilities will stay the same with more exciting additions to come.
            </div>
            <ButtonLink
              href="https://blog.gett.com/gbsfaqs/"
              target="_blank"
              buttonClassName={ CN(css.button, 'mb-40') }
              onClick={ this.close }
            >
              <span className="bold-text black-text">More Info</span>
            </ButtonLink>
          </div>
        );
      case 'arrived':
        return (
          <div className="layout vertical center">
            <div className="text-center mt-30 text-24 bold-text">
              Gett Business Solutions has arrived
            </div>
            <div className="layout vertical center mt-40 mb-40">
              <div>
                Check out our fresh new look!
              </div>
              <div className={ CN('text-center pl-40 pr-30', css.w530) }>
                Gett Business Solutions offers a new standard for corporate ground travel to save time, cut costs,
                and manage complex logistics with peace of mind. Benefit from the best of One Transport as well as the exciting
                new features we have got in the pipeline.
              </div>
            </div>
            <div className="text-center mb-40">
              <span className={ CN('bold-text', css.link) } onClick={ this.close }>
                Stay tuned
              </span>
            </div>
          </div>
        );
      default:
        return null;
    }
  }

  render() {
    const { showKey } = this.state;

    if (!showKey) return null;

    return (
      <Modal
        visible
        title={ null }
        width={ 600 }
        footer={ null }
        className={ css.banner }
        onCancel={ this.close }
        maskClosable={ false }
      >
        <img src={ showData[showKey].header } />
        { this.renderContent() }
      </Modal>
    );
  }
}
