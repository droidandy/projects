import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import { TwitterTimeline } from './TwitterTimeline';
import Widget from './Widget';
import CN from 'classnames';

import css from './Widget.css';

// For all possible widget options, please visit https://dev.twitter.com/web/embedded-timelines/parameters

export default class TwitterWidget extends PureComponent {
  static propTypes = {
    sourceType: PropTypes.string,
    username: PropTypes.string,
    height: PropTypes.number,
    tweetLimit: PropTypes.number,
    chrome: PropTypes.string,
    theme: PropTypes.oneOf(['light', 'dark']),
    showReplies: PropTypes.bool,
    lang: PropTypes.string
  };

  static defaultProps = {
    sourceType: 'profile',
    username: 'TfLTravelAlerts',
    height: 368,
    theme: 'light',
    tweetLimit: 6,
    showReplies: false,
    lang: 'en'
  };

  componentWillUnmount() {
    this.timelineRef.current.childNodes[0].remove();
  }

  timelineRef = createRef();

  render() {
    const { sourceType, username, tweetLimit, showReplies, lang, height, theme } = this.props;

    return (
      <Widget title="Tweets" className={ CN(css.widget25, 'hidden-overflow') }>
          <div ref={ this.timelineRef }>
            <TwitterTimeline
              dataSource={ { sourceType, screenName: username, tweetLimit, showReplies, lang } }
              options={ { username, height, theme } }
            />
          </div>
      </Widget>
    );
  }
}
