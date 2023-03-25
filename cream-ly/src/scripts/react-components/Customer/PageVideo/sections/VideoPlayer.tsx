//@ts-nocheck
import React, { Component } from "react";
import VimeoVideo from "@Components/SharedComponents/VimeoVideo";
import { translate } from "@Core/i18n";

@translate({}, "PageCustomerVideo")
export default class VideoPlayer extends Component {
  state = {
    selectedVideoPartNumber: this.props.selectedVideoPartNumber
      ? this.props.selectedVideoPartNumber
      : 0,
    isAutoPlay: false,
  };

  handleSelectCurrentPart(index) {
    this.setState({
      selectedVideoPartNumber: index,
      isAutoPlay: true,
    });
  }

  componentDidUpdate(prevProp, prevState) {
    if (prevProp.videoPartsTimingsList != this.props.videoPartsTimingsList) {
      this.setState({
        selectedVideoPartNumber: 0,
        isAutoPlay: false,
      });
    }
  }

  getVimeoId() {
    const parts = this.props.videoPartsTimingsList;
    const partNum = this.state.selectedVideoPartNumber;
    if (!parts || !parts[partNum] || !parts[partNum].videoN)
      return this.props.vimeoList[0];

    return this.props.vimeoList[parts[partNum].videoN - 1];
  }

  getStartTimeInSeconds() {
    const parts = this.props.videoPartsTimingsList;
    const partNum = this.state.selectedVideoPartNumber;
    if (!parts || !parts[partNum] || !parts[partNum].time) return 0;

    const timeInFormat_MMSS = parts[partNum].time;
    const timeSplit = timeInFormat_MMSS.split(":");
    if (!Array.isArray(timeSplit) || timeSplit.length != 2) return 0;

    const startTime = Number(timeSplit[0]) * 60 + Number(timeSplit[1]);

    return startTime;
  }

  render() {
    const playerId = "videoPlayer" + this.props.handle;

    return (
      <div className="VideoPlayer">
        {!!this.props.videoPartsNamesList.length && (
          <>
            <p>{this.t("videoPartsIntro")}</p>
            <div className="list-group videoParts">
              {this.props.videoPartsNamesList.map((partName, index) => (
                <div
                  key={index}
                  className={`list-group-item ${this.state
                    .selectedVideoPartNumber === index && "active"}`}
                >
                  <a
                    href={"#" + playerId}
                    onClick={() => this.handleSelectCurrentPart(index)}
                  >
                    {partName}
                  </a>
                </div>
              ))}
            </div>
          </>
        )}
        <div id={playerId}>
          <VimeoVideo
            time={this.getStartTimeInSeconds()}
            isAutoPlay={this.state.isAutoPlay}
            vimeoId={this.getVimeoId()}
          />
        </div>
      </div>
    );
  }
}
