import React from 'react'
import styled from 'styled-components'

import { Button } from 'components/Button'

const Confirm = ({ assign, cancel, name, agentName }) => (
  <Wrapper>
    <Text>
      {
        `Are you sure you want to assign ${name} to ${agentName}`
      }
    </Text>
    <Buttons>
      <ButtonStyled onClick={ assign }>
        Yes
      </ButtonStyled>
      <ButtonCancel onClick={ cancel }>
        No
      </ButtonCancel>
    </Buttons>
  </Wrapper>
)

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #fff;
  border-radius: 4px;
  margin-bottom: 5px;
  height: 60px;
`

const Text = styled.div`
  font-size: 14px;
  max-width: 300px;
`

const Buttons = styled.div`
  display: flex;
`

const ButtonStyled = styled(Button)`
  width: 80px;
  height: 30px;
  margin-left: 20px;
`

const ButtonCancel = styled(ButtonStyled)`
  background: transparent;
  border: solid 1px #f6b530;

  &:hover {
    color: #000;
    border: 0;
  }
`

export default Confirm
