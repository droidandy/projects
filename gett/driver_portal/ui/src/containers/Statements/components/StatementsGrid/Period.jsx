import React from 'react'
import styled from 'styled-components'
import moment from 'moment'

const format = 'DD-MM-YYYY'

const Period = ({ from, to }) => (
  <Wrapper>
    { moment.utc(from).format(format) } - { moment.utc(to).format(format) }
  </Wrapper>
)

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`

export default Period
