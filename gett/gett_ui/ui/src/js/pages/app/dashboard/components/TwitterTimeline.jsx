import React, { PureComponent } from 'react';
import { Timeline } from 'react-twitter-widgets';

export class TwitterTimeline extends PureComponent {
  render() {
    return <Timeline { ...this.props } />;
  }
}
