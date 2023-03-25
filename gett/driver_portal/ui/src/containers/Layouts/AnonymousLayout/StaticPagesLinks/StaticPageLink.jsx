import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const StaticPageLink = ({ bullet, to, children }) => (
  <Wrapper>
    <PageLink to={ to } target="_blank">{ children }</PageLink>
    { bullet && <Bullet> • </Bullet>}
  </Wrapper>
)

const Wrapper = styled.span`
  font-size: 14px;
  color: #9fa0ac;
  text-decoration: none;
  text-align: center;
`

const PageLink = styled(Link)`
  white-space: nowrap;
  font-size: 14px;
  color: #9fa0ac;
  text-decoration: none;
`

const Bullet = styled.span`
  margin: 0px 5px;
`

export default StaticPageLink
