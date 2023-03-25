import React from 'react'
import styled from 'styled-components'

const ExpirationWarning = () => {
  return (
    <div>
      Some of your documents are due to expire soon. Please upload the new versions
      <LinkStyled href="/documents">here</LinkStyled>
    </div>
  )
}

const LinkStyled = styled.a`
  color: #fff;
  font-weight: bold;
  margin-left: 5px;
`

export default ExpirationWarning
