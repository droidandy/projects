import React, { Component } from 'react'
import { isEmpty, without, map } from 'lodash'
import { media } from 'components/Media'
import styled from 'styled-components'
import moment from 'moment'

const statusLabels = {
  'scheduledAt': 'Pick Up Order',
  'arrivedAt': 'Taxi Arrived',
  'startedAt': 'In Progress',
  'endedAt': 'Order Completed',
  'canceledAt': 'Cancelled'
}

const timeLineStatuses = ['scheduledAt', 'arrivedAt', 'startedAt', 'endedAt', 'canceledAt']

class Timeline extends Component {
  static defaultProps = {
    events: {}
  }

  getTimeLineStatuses() {
    switch (this.props.status) {
      case 'completed':
        return without(timeLineStatuses, 'canceledAt')
      case 'cancelled':
        return without(timeLineStatuses, 'arrivedAt', 'startedAt', 'endedAt')
      case 'cancelled_on_arrival':
        return without(timeLineStatuses, 'startedAt', 'endedAt')
      default:
        return timeLineStatuses
    }
  }

  getStatusTime(status) {
    const { events } = this.props
    return !isEmpty(events) ? moment.utc(events[status]).format('HH:mm MM/DD/YYYY') : ''
  }

  renderPoint = (status) => {
    return (
      <Point key={ status }>
        <Status>{ statusLabels[status] }</Status>
        <Date> { this.getStatusTime(status) } </Date>
      </Point>
    )
  }

  renderPoints() {
    return this.getTimeLineStatuses()
  }

  render() {
    return (
      <Wrapper>
        { map(this.renderPoints(), this.renderPoint) }
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content:space-between;
  border-bottom: solid 1px #d2dadc;

  ${media.phoneSmall`
    flex-direction: column;
    border: none;
  `}
`

const Point = styled.div`
  position: relative;
  text-align: center;
  padding-bottom: 10px;

  &:after {
    position: absolute;
    left: 50%;
    bottom: -6px;
    margin-left: -6px;
    content: '';
    display: block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #f6b530;
  }
  &: before {
    z-index: 1;
    position: absolute;
    left: 50%;
    bottom: -3px;
    margin-left: -3px;
    content: '';
    display: block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #fff;
  }

  ${media.phoneSmall`
    text-align: left;
    padding-left: 15px;
    border-left: 1px solid #d2dadc;
    &:after {
      top: 0;
      left: 0;
    }
    &:before {
      top: 3px;
      left: 0;
    }
    &:last-of-type {
     border:none;
    }
  `}
`

const Status = styled.div`
  color: #000;
  font-size: 14px;
  line-height: 14px;
  margin-bottom: 5px;
  font-weight: bold;
`

const Date = styled.div`
  font-size: 12px;
  margin-bottom: 10px;
  color: #74818f;
`

export default Timeline
