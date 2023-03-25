import React from "react";
import PropTypes from "prop-types";
import Player from "@vimeo/player";

export default class VimeoVideo extends React.Component {
  state = {
    isPlaying: false,
  };

  constructor(props) {
    super(props);
    this.iframeRef = React.createRef();
    this.vimeoPlayer = null;
  }

  componentDidMount() {
    this.vimeoPlayer = new Player(this.iframeRef.current);

    this.vimeoPlayer.on("play", () => {
      this.setState({ isPlaying: true });
    });
    this.vimeoPlayer.on("pause", () => {
      this.setState({ isPlaying: false });
    });
    this.vimeoPlayer.on("ended", () => {
      this.setState({ isPlaying: false });
    });
  }

  componentDidUpdate(prevProp, prevState) {
    if (prevProp.time != this.props.time) {
      this.vimeoPlayer.setCurrentTime(this.props.time);
    }
  }

  getHashTagTime() {
    const timeInSeconds = this.props.time ? this.props.time : 0;
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds - minutes * 60;

    return `#t=${minutes}m${seconds}s`;
  }

  render() {
    const vimeoId = String(this.props.vimeoId);
    const isAutoPlay = this.props.isAutoPlay ? 1 : 0;
    const lang = this.props.lang ? this.props.lang : "ru";

    const timeHashTag = this.getHashTagTime();

    const vimeoSource = `https://player.vimeo.com/video/${vimeoId}?autoplay=${isAutoPlay}&loop=0&texttrack=${lang}${timeHashTag}`;

    return (
      <div className="video-wrapper">
        <iframe
          ref={this.iframeRef}
          id={"vimeo" + vimeoId}
          src={vimeoSource}
          allow="autoplay; fullscreen"
          allowFullScreen=""
        />
      </div>
    );
  }
}

VimeoVideo.propTypes = {
  isAutoPlay: PropTypes.bool,
  time: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  vimeoId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
