import React, { PureComponent } from 'react';
import YouTube from 'react-youtube';

export default class Welcome extends PureComponent {
  render() {
    const opts = {
      height: '315',
      width: '560'
    };

    return (
      <div>
        <div className="text-18 black-text bold-text mb-20">Welcome to Gett Enterprise,</div>
        <div className="layout horizontal sm-wrap">
          <div className="flex sm-full-width sm-mb-20 black-text pt-10 mr-20">
            <div className="mb-30">
              The only Corporate Transport Solution with full national coverage - including Standard Car, Executive/Chauffeur and Black Taxis. Use the left-hand navigation to organise your rides.
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
