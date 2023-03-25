import React from 'react';
import PropTypes from 'prop-types';
import markIcon from './../../../../assets/img/svg/icon-competitive-info.svg';
import renewalIcon from './../../../../assets/img/svg/icon-renewal-mark.svg';
import getColor from './../../../../utils/getColor';

class Ruler extends React.Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    value: PropTypes.number.isRequired,
    maxVal: PropTypes.number.isRequired,
    differences: PropTypes.array.isRequired,
    renewal: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      scaleArr: [],
      scale: null,
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
    let maxVal = props.maxVal;
    if (maxVal === undefined) maxVal = this.props.maxVal || 0;
    const scale = parseInt(maxVal / 5, 10) + 1;
    // console.log('scale = ', scale, 'maxVal = ', maxVal);
    const scaleArr = [];
    for (let i = -5; i <= 5; i += 1) {
      scaleArr.push(i * scale);
    }
    // console.log('maxVal = ', maxVal, 'scale = ', scale, 'scaleArr = ', scaleArr);
    this.setState({ scaleArr, scale });
  }

  setParams(props) {
    const { value, differences } = props;
    const { scale } = this.state;
    const roundRuler = document.getElementById('round-ruler');
    const smallRound = document.getElementById('small-round');
    const centerLine = document.getElementById('center-line');
    const bigRound = document.getElementById('big-round');
    const miniRoundLines = document.getElementsByClassName('line-ruler');
    const elemCount = this.state.scaleArr.length + 1;
    // console.log('settings.values, value = ', value, 'differences = ', differences);

    const itemColor = getColor(value);

    // setting up ruler params
    if (roundRuler && centerLine && bigRound && smallRound) {
      for (let i = 0; i < miniRoundLines.length; i += 1) {
        miniRoundLines[i].style.width = `${roundRuler.offsetWidth / elemCount}px`;
      }
      const elemWidth = (roundRuler.offsetWidth / elemCount) * Math.abs(value / scale);
      // console.log('elemWidth = ', elemWidth, 'elemCount=', elemCount, 'value = ', value, 'roundRuler.offsetWidth = ', roundRuler.offsetWidth);
      // center line
      centerLine.style.width = `${elemWidth}px`;
      if (value < 0) {
        centerLine.style.left = `calc((100% / ${elemCount}) * ${5})`;
      }
      if (!value) {
        centerLine.style.left = `${(roundRuler.offsetWidth / elemCount) * 5}px`;
      }
      if (value > 0) {
        centerLine.style.left = `${((roundRuler.offsetWidth / elemCount) * 5) - elemWidth}px`;
      }
      centerLine.style.backgroundColor = itemColor;
      // big round
      if (value < 0) {
        bigRound.style.left = `${((roundRuler.offsetWidth / elemCount) * 5) + elemWidth}px`;
      }
      if (!value) {
        bigRound.style.left = `${(roundRuler.offsetWidth / elemCount) * 5}px`;
      }
      if (value > 0) {
        bigRound.style.left = `${((roundRuler.offsetWidth / elemCount) * 5) - elemWidth}px`;
      }
      bigRound.style.backgroundColor = itemColor;
      // small round
      smallRound.style.left = `${(roundRuler.offsetWidth / elemCount) * 5}px`;
    }
    // setting up markers params
    const markers = document.getElementsByClassName('mark-icon');
    if (markers && markers.length > 0) {
      for (let i = 0; i < markers.length; i += 1) {
        const diffWidth = (roundRuler.offsetWidth / elemCount) * Math.abs(differences[i] / scale);
        if (differences[i] > 0) {
          markers[i].style.left = `${((roundRuler.offsetWidth / elemCount) * 5) - (diffWidth + 6)}px`;
        } else {
          markers[i].style.left = `${((roundRuler.offsetWidth / elemCount) * 5) + (diffWidth - 6)}px`;
        }
      }
    }
  }

  render() {
    const { scaleArr, scale } = this.state;
    const { value, differences, renewal } = this.props;
    return (
      <div id="ruler" className="ruler-block">
        <div className="round-ruler" id="round-ruler">
          <div id="center-line" className="center-line" />
          <div id="small-round" className="small-round" />
          <div id="big-round" className="big-round"><span className="ruler-data">{value > 0 ? `+${value.toFixed(1)}` : value.toFixed(1)}</span></div>
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
              <div className="mini-round-number">{-item}</div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Ruler;
