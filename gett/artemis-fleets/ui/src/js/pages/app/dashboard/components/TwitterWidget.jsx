import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Timeline } from 'react-twitter-widgets';

// For all possible widget options, please visit https://dev.twitter.com/web/embedded-timelines/parameters

export default class TwitterWidget extends PureComponent {
  static propTypes = {
    sourceType: PropTypes.string,
    username: PropTypes.string,
    height: PropTypes.number,
    chrome: PropTypes.string,
    theme: PropTypes.oneOf(['light', 'dark'])
  };

  static defaultProps = {
    sourceType: 'profile',
    username: 'TfLTravelAlerts',
    height: 320,
    chrome: 'nofooter',
    theme: 'light'
  };

  render() {
    const { sourceType, username, height, chrome, theme } = this.props;

    return (
      <div className="flex sm-full-width border-block mr-20 xs-mr-0 mb-20">
        <Timeline
          dataSource={ { sourceType, screenName: username } }
          options={ { username, height, chrome, theme } }
        />
      </div>
    );
  }
}
