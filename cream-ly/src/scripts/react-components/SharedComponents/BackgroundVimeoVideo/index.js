import React from "react";
import PropTypes from "prop-types";
import Player from "@vimeo/player";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";

import "./index.scss";

function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
export default class BackgroundVimeoVideo extends React.Component {
  constructor(props) {
    super(props);
    this.iframeRef = React.createRef();

    this.vimeoPlayer = null;

    this.state = {
      isActive: this.props.isActive,
      time: this.props.time,
    };
  }

  handleChangeScroll = () => {
    if (this.state.isActive) return;

    if (isInViewport(this.iframeRef.current)) {
      this.vimeoPlayer.play();
    } else {
      this.vimeoPlayer.pause();
    }
  };

  componentDidMount() {
    this.vimeoPlayer = new Player(this.iframeRef.current);
    this.vimeoPlayer.ready().then(() => {
      this.vimeoPlayer.setMuted(!this.state.isActive);
      this.vimeoPlayer.setColor("#52aea2");

      document.addEventListener("scroll", this.handleChangeScroll);
    });
  }

  componentWillUnmount() {
    document.removeEventListener("scroll", this.handleChangeScroll);
  }

  handleClickIcon = () => {
    this.setState({ isActive: true });
    this.vimeoPlayer.setMuted(false);
    this.vimeoPlayer.setVolume(1);

    document.removeEventListener("scroll", this.handleChangeScroll);
  };

  getSource = () => {
    const getHashTagTime = (time) => {
      const timeInSeconds = time || 0;
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = timeInSeconds - minutes * 60;

      return `#t=${minutes}m${seconds}s`;
    };

    const source = new URL(
      `https://player.vimeo.com/video/${String(this.props.vimeoId)}`
    );
    source.hash = getHashTagTime(this.state.time);
    source.searchParams.append(
      "texttrack",
      this.props.lang ? this.props.lang : "ru"
    );
    source.searchParams.append("controls", "1");
    source.searchParams.append("muted", "1");
    source.searchParams.append("autoplay", "1");

    return source;
  };

  render() {
    return (
      <div className="video-wrapper">
        {!this.state.isActive && (
          <div className="video-sound-button" onClick={this.handleClickIcon}>
            <VolumeUpIcon htmlColor="white" fontSize="inherit" />
          </div>
        )}
        <iframe
          className="active"
          ref={this.iframeRef}
          src={this.getSource()}
          allow="autoplay"
          allowFullScreen=""
        />
      </div>
    );
  }
}

BackgroundVimeoVideo.propTypes = {
  isActive: PropTypes.bool,
  time: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  vimeoId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

BackgroundVimeoVideo.defaultProps = {
  isActive: false,
  time: 0,
};
