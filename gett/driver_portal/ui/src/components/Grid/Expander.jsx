import React from 'react'
import styled, { css } from 'styled-components'
import { IconCircleArrow } from 'components/Icons'

const Expander = ({ expanded, label, className }) => (
  <Wrapper className={ className }>
    { label && <Text>{expanded ? 'close' : 'open' }</Text> }
    <Icon width={ 20 } height={ 20 } expanded={ expanded } color="#4373d7" />
  </Wrapper>
)

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`

const Icon = styled(IconCircleArrow)`
  margin-left: 10px;
  ${props => props.expanded && css`
    transform: rotate(180deg)
  `}
`

const Text = styled.span`
  font-size: 14px;
  color: #4373d7;
`

export default Expander
