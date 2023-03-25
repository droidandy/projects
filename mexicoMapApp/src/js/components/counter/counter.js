/**
 * Created by developercomputer on 11.12.15.
 */
import React, { Component, PropTypes } from "react"
import Radium from "radium"
import styles from "./style.js"


@Radium
class Counter extends Component {
  render() {
    const { increment, decrement, reset, counter } = this.props;
    return (
        <p style={styles.primary}>
          Clicked: {counter} times
          {' '}
          <button onClick={increment}>+</button>
          {' '}
          <button onClick={decrement}>-</button>
          {' '}
          <button onClick={reset}>Reset</button>
        </p>
    )
  }
}

Counter.propTypes = {
  increment: PropTypes.func.isRequired,
  decrement: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  counter: PropTypes.number.isRequired
};

export default Counter