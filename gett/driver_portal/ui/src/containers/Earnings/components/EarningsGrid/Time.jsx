import React from 'react'
import styled from 'styled-components'
import moment from 'moment'

import { IconTime } from 'components/Icons'
import { media } from 'components/Media'

const Time = ({ value }) => (
  <Wrapper>
    <IconTimeStyled width={ 16 } height={ 16 } color="#d2dadc" />
    { moment.utc(value).format('HH:mm') }
  </Wrapper>
)

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`

const IconTimeStyled = styled(IconTime)`
  margin-right: 15px;

  ${media.phoneLarge`
    margin-right: 5px;
  `}

  ${media.phoneSmall`
    margin-right: 0;
  `}
`

export default Time
