import React from 'react'
import styled from 'styled-components'
import StaticPageLink from './StaticPageLink'

const StaticPagesLinks = () => (
  <Wrapper>
    <StaticPageLink bullet to="/auth/privacy">Privacy Policy</StaticPageLink>
    <StaticPageLink to="/auth/faq">FAQ</StaticPageLink>
  </Wrapper>
)

const Wrapper = styled.div`
  text-align: center;
  width: 100%;
`

export default StaticPagesLinks
