import React from 'react';
import PropTypes from 'prop-types';
import getColor from './../../../utils/getColor';

class RoundRuler extends React.Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    value: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      pageNumber: 1,
      total: 1,
    };
  }

  componentDidMount() {
    this.setParams(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setParams(nextProps);
  }

  setParams(props) {
    const { settings, index, value } = props;
    const bigRound = document.getElementById(`big-round-${index}`);
    const centerLine = document.getElementById(`center-line-${index}`);
    let unit = 0;
    const itemColor = getColor(value);
    if (bigRound) {
      if (value === 0) {
        bigRound.style.left = '60px';
      }
      if (value < 0) {
        unit = 60 / settings.less.length;
        bigRound.style.left = `${60 + (unit * (settings.less.indexOf(value) + 1))}px`;
      }
      if (value > 0) {
        unit = 60 / settings.above.length;
        bigRound.style.left = `${unit * settings.above.indexOf(value)}px`;
      }
      bigRound.style.backgroundColor = itemColor;
    }
    if (centerLine) {
      if (value < 0) {
        unit = 44 / settings.less.length;
        centerLine.style.width = `${unit * (settings.less.indexOf(value) + 1)}px`;
        centerLine.style.left = '84px';
      }
      if (value === 0) {
        centerLine.style.width = '0px';
      }
      if (value > 0) {
        unit = 44 / settings.above.length;
        centerLine.style.width = `${44 - (unit * settings.above.indexOf(value))}px`;
        centerLine.style.left = `${36 + (unit * settings.above.indexOf(value))}px`;
      }
      centerLine.style.backgroundColor = itemColor;
    }
  }

  render() {
    const { value, index } = this.props;
    return (
      <div id={`round-ruler-${index}`} className="round-ruler">
        <div id={`center-line-${index}`} className="center-line" />
        <div id={`small-round-${index}`} className="small-round" />
        <div id={`big-round-${index}`} className="big-round"><span>{value > 0 ? `+${value.toFixed(1)}` : value.toFixed(1)}</span></div>
      </div>
    );
  }
}

export default RoundRuler;
