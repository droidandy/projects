import React from 'react'
import styled from 'styled-components'
import { capitalize } from 'lodash'

const SystemMessageText = ({ kind, children, showKind }) => {
  return (
    <Wrapper>
      { kind && showKind && <Bold>{`${capitalize(kind)}!`}</Bold> } { children }
    </Wrapper>
  )
}

SystemMessageText.defaultProps = {
  showKind: true
}

const Wrapper = styled.div`
  margin-left: 15px;
  text-align: left;
`

const Bold = styled.span`
  font-weight: 500;
`

export default SystemMessageText
