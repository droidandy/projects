import React from 'react'
import styled from 'styled-components'

import { IconApproved, IconRejected, IconPending } from 'components/Icons'

export default ({ user }) => {
  if (!user.hasOwnProperty('completed')) {
    return (
      <ReviewSummary>
        <IconPending />
        <span>Pending</span>
      </ReviewSummary>)
  }
  return user.completed
    ? (
      <ReviewSummary>
        <IconApproved />
        <span>Completed</span>
      </ReviewSummary>)
    : (
      <ReviewSummary>
        <IconRejected />
        <span>Failed</span>
      </ReviewSummary>)
}

const ReviewSummary = styled.div`
  height: 20px;
  display: flex;
  align-items: center;
  span{
    margin-left: 15px;
  }
`
