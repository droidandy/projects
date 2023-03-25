import React from 'react'
import styled from 'styled-components'

import { Button } from 'components/Button'
import { getStatusIcon } from 'containers/BoAlerts/utils'
import { DateTime } from 'components/DateTime'

const Identify = ({ time, value, onClick }) => (
  <Wrapper>
    {
      time
        ? <Status>
          <Icon>
            { getStatusIcon('approved') }
          </Icon>
          <DateTime
            value={ time }
          />
        </Status>
        : <ButtonStyled onClick={ onClick }>
          { value }
        </ButtonStyled>
    }
  </Wrapper>
)

const Wrapper = styled.div`
  display: flex;
`

const Status = styled.div`
  display: flex;
  align-items: center;
`

const Icon = styled.div`
  margin-right: 10px;
`

const ButtonStyled = styled(Button)`
  width: 90px;
  height: 30px;
  border: solid 1px #f6b530;
  background-color: #fff;
  margin-right: 10px;
`

export default Identify
