import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Marker } from 'components/GoogleMap';

export default class LiveMarker extends PureComponent {
  static propTypes = {
    positions: PropTypes.array
  };

  static defaultProps = {
    positions: []
  };

  state = {
    currentPositionIndex: 0
  };

  componentDidMount() {
    this.animateNextPosition();
  }

  componentDidUpdate(prevProps) {
    const { positions } = this.props;
    if (positions !== prevProps.positions) {
      this.clearAnimationTimeout();
      this.setState({ currentPositionIndex: 0 }, this.animateNextPosition);
    }
  }

  componentWillUnmount() {
    this.clearAnimationTimeout();
  }

  animateNextPosition = () => {
    const { positions } = this.props;
    const { currentPositionIndex } = this.state;

    if (currentPositionIndex < positions.length - 1) {
      this.animationTimeout = setTimeout(() => {
        this.setState(state => (
          { currentPositionIndex: state.currentPositionIndex + 1 }
        ), this.animateNextPosition);
      }, 5000 / positions.length);
    }
  };

  clearAnimationTimeout() {
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }
  }

  getCurrentPosition() {
    return this.props.positions[this.state.currentPositionIndex];
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const { positions, ...rest } = this.props;
    const position = this.getCurrentPosition();

    return (
      <div>
        { position && <Marker position={ position } { ...rest } /> }
      </div>
    );
  }
}
