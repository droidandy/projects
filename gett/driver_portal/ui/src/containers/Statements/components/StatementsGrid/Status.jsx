import React from 'react'
import styled from 'styled-components'
import { breakpoints } from 'components/Media'
import { IconSuccess } from 'components/Icons'

const Status = () => (
  <Wrapper>
    <Icon circleColor="#7bc821" tickColor="#fff" />
    <Text>paid</Text>
  </Wrapper>
)

const Wrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: flex-start;

  ${breakpoints.tablet`
    background-color: #7bc821;
    border-radius: 10px;
    justify-content: center;
  `}
`

const Icon = styled(IconSuccess)`
  width: 20px;
  height: 20px;

  ${breakpoints.tablet`
    margin-left: -10px;
  `}
`

const Text = styled.span`
  font-size: 12px;
  font-weight: bold;
  color: #ffffff;
`

export default Status
