import React from 'react'
import styled from 'styled-components'

import { Button } from 'components/Button'

const Assign = ({ time, value, onClick, disabled, agent }) => (
  <Wrapper>
    {
      agent
        ? agent.name
        : <ButtonStyled onClick={ onClick } disabled={ time || disabled }>
          { value }
        </ButtonStyled>
    }
  </Wrapper>
)

const Wrapper = styled.div`
  display: flex;
`

const ButtonStyled = styled(Button)`
  width: 90px;
  height: 30px;
`

export default Assign
