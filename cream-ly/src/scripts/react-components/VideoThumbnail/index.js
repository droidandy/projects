import React from "react";
import "./index.scss";
export default class VideoThumbnail extends React.Component {
  render() {
    return (
      <div
        className="ComponentVideoThumbnail"
        style={{
          backgroundImage: `url(https://i.vimeocdn.com/video/${this.props.vimeoId}-d_640x360?r=pad)`,
        }}
      >
        <a href={this.props.url} onClick={this.props.onClick}>
          {this.props.icon ? (
            <div className="playButton"></div>
          ) : (
            <div className="noPlayButton">&nbsp;</div>
          )}
        </a>
      </div>
    );
  }
}
