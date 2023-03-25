import React from 'react'
import styled from 'styled-components'
import { IconArrowAction } from 'components/Icons'
import { Button } from 'components/Button'

const ActionsButton = (props) => {
  const { disabled } = props

  return (
    <Wrapper>
      <Button { ...props } />
      <Icon color={ disabled ? '#ffffff' : '#000000' } />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: relative;
`

const Icon = styled(IconArrowAction)`
  position: absolute;
  right: 15px;
  top: 0;
  bottom: 0;
  margin: auto;
`

export default ActionsButton
