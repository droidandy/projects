import React from 'react';
import PropTypes from 'prop-types';
import markIcon from './../../../../assets/img/svg/icon-competitive-info.svg';
import renewalIcon from './../../../../assets/img/svg/icon-renewal-mark.svg';
import getColor from './../../../../utils/getColor';

class TwoRuler extends React.Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    value: PropTypes.number.isRequired,
    maxVal: PropTypes.number.isRequired,
    differences: PropTypes.array.isRequired,
    renewal: PropTypes.array.isRequired,
    startValue: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      scaleArr: [],
      scale: null,
      overlap: false,
    };

    this.setScale = this.setScale.bind(this);
  }

  componentDidMount() {
    this.setScale(this.props);
    window.addEventListener('resize', this.setScale);
  }

  componentWillReceiveProps(nextProps) {
    this.setScale(nextProps);
  }

  componentDidUpdate() {
    this.setParams(this.props);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setScale);
  }


  setScale(props) {
    // TODO CHANGE SCALE, maxVal and minVal!!!!
    let maxVal = props.maxVal;
    if (maxVal === undefined) maxVal = this.props.maxVal || 0;
    const scale = parseInt(maxVal / 5, 10) + 1;

    const scaleArr = [];
    for (let i = -5; i <= 5; i += 1) {
      scaleArr.push(i * scale);
    }
    // console.log('maxVal = ', maxVal, 'scale = ', scale, 'scaleArr = ', scaleArr);
    this.setState({ scaleArr, scale });
  }

  setParams(props) {
    const { startValue, value, differences } = props;
    const { scale } = this.state;
    const roundRuler = document.getElementById('round-ruler');
    const centerLine = document.getElementById('center-line');
    const bigRound = document.getElementById('big-round');
    const bigRoundStart = document.getElementById('big-round-starting');
    const miniRoundLines = document.getElementsByClassName('line-ruler');
    const elemCount = this.state.scaleArr.length + 1;
    // console.log('settings.values, value = ', value, 'differences = ', differences);

    const itemColor = getColor(startValue < value ? 21 : -1);
    let bigRoundLeft = 0;
    let bigRoundStartLeft = 0;

    // setting up ruler params
    if (roundRuler && centerLine && bigRound && bigRoundStart) {
      for (let i = 0; i < miniRoundLines.length; i += 1) {
        miniRoundLines[i].style.width = `${roundRuler.offsetWidth / elemCount}px`;
      }
      const elemWidth = (roundRuler.offsetWidth / elemCount) * Math.abs(value / scale);
      // console.log('elemWidth = ', elemWidth, 'elemCount=', elemCount, 'value = ', value, 'roundRuler.offsetWidth = ', roundRuler.offsetWidth, 'scale = ', scale);
      // big round
      if (value < 0) {
        bigRoundLeft = ((roundRuler.offsetWidth / elemCount) * 5) - elemWidth;
      }
      if (!value) {
        bigRoundLeft = (roundRuler.offsetWidth / elemCount) * 5;
      }
      if (value > 0) {
        bigRoundLeft = ((roundRuler.offsetWidth / elemCount) * 5) + elemWidth;
      }
      bigRound.style.left = `${bigRoundLeft}px`;
      bigRound.style.top = '-39px'; // fix for renewal view
      bigRound.style.backgroundColor = itemColor;

      // starting big round
      const startElemWidth = (roundRuler.offsetWidth / elemCount) * Math.abs(startValue / scale);
      if (startValue < 0) {
        bigRoundStartLeft = ((roundRuler.offsetWidth / elemCount) * 5) - startElemWidth;
      }
      if (!startValue) {
        bigRoundStartLeft = (roundRuler.offsetWidth / elemCount) * 5;
      }
      if (startValue > 0) {
        bigRoundStartLeft = ((roundRuler.offsetWidth / elemCount) * 5) + startElemWidth;
      }
      bigRoundStart.style.left = `${bigRoundStartLeft}px`;

      // center line
      centerLine.style.width = `${Math.abs(bigRoundStartLeft - bigRoundLeft)}px`;
      centerLine.style.left = bigRoundStartLeft < bigRoundLeft ? `${bigRoundStartLeft}px` : `${bigRoundLeft}px`;
      centerLine.style.backgroundColor = itemColor;
    }
    // setting up markers params
    const markers = document.getElementsByClassName('mark-icon');
    if (markers && markers.length > 0) {
      for (let i = 0; i < markers.length; i += 1) {
        const diffWidth = (roundRuler.offsetWidth / elemCount) * Math.abs(differences[i] / scale);
        if (differences[i] > 0) {
          markers[i].style.left = `${((roundRuler.offsetWidth / elemCount) * 5) + (diffWidth - 6)}px`;
        } else {
          markers[i].style.left = `${((roundRuler.offsetWidth / elemCount) * 5) - (diffWidth + 6)}px`;
        }
      }
    }
    if ((Math.abs(bigRoundStartLeft - bigRoundLeft) < 60) !== this.state.overlap) {
      this.setState({ overlap: (Math.abs(bigRoundStartLeft - bigRoundLeft) < 60) });
    }
  }

  render() {
    const { scaleArr, scale, overlap } = this.state;
    const { value, differences, renewal, startValue } = this.props;
    return (
      <div id="ruler" className="ruler-block" style={{ marginTop: '60px' }}>
        <div className="round-ruler" id="round-ruler">
          <div id="center-line" className="center-line" />
          <div id="big-round-starting" className="big-round-starting">
            { !overlap && <span className="ruler-label" id="starting-label">Starting {startValue < 0 ? 'Decrease' : 'Increase'}</span> }
            <span className="ruler-data">{startValue > 0 ? `${startValue.toFixed(1)}` : startValue.toFixed(1)}</span>
          </div>
          <div id="big-round" className="big-round">
            <span className="ruler-label">Current {value < 0 ? 'Decrease' : 'Increase'}</span>
            <span className="ruler-data">{value.toFixed(1)}</span>
          </div>
        </div>
        <div className="markers-block">
          { differences.map((diff, key) =>
            <img src={markIcon} alt="markIcon" className="mark-icon" key={key} />
          )}
          { renewal.map((diff, key) =>
            <img src={renewalIcon} alt="markIcon" className="mark-icon" key={key} />
          )}
        </div>
        <div className="lines-block">
          {!isNaN(scale) && scaleArr.map((item, key) =>
            <div key={key} className="line-ruler">
              <div className="mini-round" />
              <div className="mini-round-line" />
              <div className="mini-round-number">{item}</div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default TwoRuler;
