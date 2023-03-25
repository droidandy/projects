import React, { PureComponent } from 'react';
import YouTube from 'react-youtube';

export default class Tutorial extends PureComponent {
  render() {
    const opts = {
      height: '315',
      width: '560'
    };

    return (
      <div>
        <div className="text-18 black-text bold-text mb-20">Dear User,</div>
        <div className="layout horizontal sm-wrap">
          <div className="flex sm-full-width sm-mb-20 black-text pt-10 mr-20">
            <div className="mb-30">
              Please watch the quick video adjacent which demonstrates how to place a booking online or via our app, as well as how to manage your personal spend.
            </div>
            <div className="mb-10">Many thanks,</div>
            <div>The Gett Enterprise Team</div>
          </div>
          <YouTube
            videoId="qtJKJUmX4tI"
            opts={ opts }
          />
        </div>
      </div>
    );
  }
}
