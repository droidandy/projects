import React from 'react'
import styled from 'styled-components'

import { Button } from 'components/Button'
import { DateTime } from 'components/DateTime'

const CheckIn = ({ time, value, onClick }) => (
  <Wrapper>
    {
      time
        ? <DateTime
          value={ time }
        />
        : <ButtonStyled onClick={ onClick }>
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
  border: solid 1px #f6b530;
  background-color: #fff;
`

export default CheckIn
