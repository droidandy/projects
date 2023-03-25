import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

class Counter extends React.Component {
  static propTypes = {
    total: PropTypes.number.isRequired,
    onPrev: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      mainIndex: 0,
      count: 0,
    };
    this.setButtonsColor = this.setButtonsColor.bind(this);
  }

  setCount(value) {
    this.setState({ count: value });
  }

  clear() {
    this.setState({ mainIndex: 0 });
  }

  updateCount(direct) {
    if (direct === 'next') this.setState({ mainIndex: this.state.mainIndex += 1 });
    else this.setState({ mainIndex: this.state.mainIndex -= 1 });
  }

  setButtonsColor(from, to, total) {
    if (this.leftButton && this.rightButton) {
      if (from === 1) {
        this.leftButton.ref.style.backgroundColor = '#f5f8f9';
        this.leftButton.ref.style.color = '#676767';
      } else {
        this.leftButton.ref.style.backgroundColor = '#0099cc';
        this.leftButton.ref.style.color = 'white';
      }
      if (to === total) {
        this.rightButton.ref.style.backgroundColor = '#f5f8f9';
        this.rightButton.ref.style.color = '#676767';
      } else {
        this.rightButton.ref.style.backgroundColor = '#0099cc';
        this.rightButton.ref.style.color = 'white';
      }
    }
  }

  render() {
    const { total, onPrev, onNext } = this.props;
    const { mainIndex, count } = this.state;
    let to = (total >= count) ? (mainIndex * count) + count : total;
    let from = (mainIndex * count) + 1;

    if (to > total) to = total;
    if (from > to) from = to;

    if (to < 0) to = 0;
    if (from < 0) from = 0;

    this.setButtonsColor(from, to, total);

    return (
      <div>
        <span>Showing {from} - {to} of {total < 0 ? 0 : total} PLANS</span>
        <Button as={'a'} ref={(c) => { this.leftButton = c; }} className="left" circular icon="chevron left" size="medium" onClick={onPrev} />
        <Button as={'a'} ref={(c) => { this.rightButton = c; }} className="right" circular icon="chevron right" size="medium" onClick={onNext} />
      </div>
    );
  }
}

export default Counter;
