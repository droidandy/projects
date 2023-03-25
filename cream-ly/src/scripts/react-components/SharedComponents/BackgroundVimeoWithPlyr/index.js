import React from "react";
import PropTypes from "prop-types";
import Plyr from "plyr";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";

import "plyr/src/sass/plyr.scss";
import "./index.scss";
import { isInViewport } from "@Core/app/analytics/timer";

// function isInViewport(element) {
//   const rect = element.getBoundingClientRect();
//   return (
//     rect.top >= 0 &&
//     rect.left >= 0 &&
//     rect.bottom <=
//       (window.innerHeight || document.documentElement.clientHeight) &&
//     rect.right <= (window.innerWidth || document.documentElement.clientWidth)
//   );
// }
export default class BackgroundVimeoVideo extends React.Component {
  constructor(props) {
    super(props);
    this.playerRef = React.createRef();

    this.player = null;

    this.state = {
      isActive: this.props.isActive,
    };
  }

  handleChangeScroll = () => {
    if (this.state.isActive) return;
    if (!this.player) return;

    if (isInViewport(this.playerRef.current)) {
      this.player.play();
    } else {
      this.player.pause();
    }
  };

  componentDidUpdate() {
    if (this.state.isActive) {
      this.player.volume = this.state.isActive ? 1 : 0;
      this.player.hideControls = false;
    }
  }

  componentDidMount() {
    this.player = new Plyr(this.playerRef.current);
    document.addEventListener("scroll", this.handleChangeScroll);
  }

  componentWillUnmount() {
    document.removeEventListener("scroll", this.handleChangeScroll);
  }

  handleClickIcon = () => {
    this.setState({ isActive: true });
    document.removeEventListener("scroll", this.handleChangeScroll);
  };

  render() {
    //see playerOptions documentation https://github.com/sampotts/plyr#javascript-1
    const playerOptions = {
      debug: true,
      hideControls: true,
      controls: [
        "play",
        "progress",
        "current-time",
        "mute",
        "volume",
        "fullscreen",
      ],
      muted: true,
      volume: 0,
      storage: { enabled: false },
      vimeo: {
        autoplay: true,
        muted: true,
      },
      captions: {
        active: true,
        language: this.props.lang ? this.props.lang : "ru",
        update: false,
      },
      autoplay: true,
    };

    return (
      <div className="backgroundVideo">
        {!this.state.isActive && (
          <div className="video-sound-button" onClick={this.handleClickIcon}>
            <VolumeUpIcon htmlColor="white" fontSize="inherit" />
          </div>
        )}
        <div
          className="plyr__video-embed"
          data-plyr-config={JSON.stringify(playerOptions)}
          data-plyr-provider="vimeo"
          data-plyr-embed-id={String(this.props.vimeoId)}
          ref={this.playerRef}
        />
      </div>
    );
  }
}

BackgroundVimeoVideo.propTypes = {
  isActive: PropTypes.bool,
  vimeoId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

BackgroundVimeoVideo.defaultProps = {
  isActive: false,
};
