import React, { Component } from 'react'
import styled from 'styled-components'
import moment from 'moment'

import msToMS from 'utils/msToMS'

class Timer extends Component {
  state = {
    timeSpent: 0,
    timer: null
  }

  componentWillReceiveProps({ run, startTime }) {
    run ? this.startTimer(startTime) : this.stopTimer()
  }

  render() {
    const { run } = this.props
    const { timeSpent } = this.state
    return (
      <Wrapper run={ run }>
        { msToMS(timeSpent) }
      </Wrapper>
    )
  }

  stopTimer = () => {
    const { timer } = this.state
    if (timer) {
      clearInterval(timer)
      this.setState({ timer: null, timeSpent: 0 })
    }
  }

  startTimer = (startTime) => {
    const restoreTimerAt = startTime || moment()
    const initTimer = setInterval(() => {
      this.setState({
        timeSpent: moment.utc().diff(moment(restoreTimerAt))
      })
    }, 1000)
    this.setState({ timer: initTimer })
  }
}

const Wrapper = styled.div`
  font-size: 30px;
  line-height: 40px;
  text-align: center;
  height: 40px;
  color: #8794a0;
  margin-right: 80px;
  visibility: ${({ run }) => run ? 'visible' : 'hidden'}
`

export default Timer
