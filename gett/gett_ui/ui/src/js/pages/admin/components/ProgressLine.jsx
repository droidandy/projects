import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CN from 'classnames';
import { Progress } from 'antd';
import { faye, urlFor } from 'utils';

export default class ProgressLine extends Component {
  static propTypes = {
    channel : PropTypes.string,
    initialMessage: PropTypes.object
  };

  state = {
    progress: this.props.initialMessage ? this.props.initialMessage.data.progress : 0,
  };

  componentDidMount() {
    this.subscription = faye.on(this.props.channel, (message) => {
      const { progress, downloadPath } = message.data;
      this.setState({ progress, downloadPath });
    });
  }

  componentWillUnmount() {
    this.subscription.cancel();
  }

  render() {
    const { progress, downloadPath } = this.state;
    return (
      <div className={ CN('pr-5 full-width', { 'mb-10': progress < 100 }) }>
        <Progress percent={ progress } strokeWidth={ 4 } />
        { progress === 100 &&
          <div className="mt-10">
            <a className="text-12 bold-text blue-link" onClick={ urlFor.download('/api' + downloadPath) }>Click to download</a>
          </div>
        }
      </div>
    );
  }
}
