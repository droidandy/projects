import React from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

const StaticPagesMenu = ({ isOpen, showContactUs, showTerms }) => {
  const activeStyle = { backgroundColor: '#3D414B', color: '#fff' }
  return (
    <Wrapper isOpen={ isOpen }>
      {
        showTerms &&
        <LinkStyled isopen={ isOpen.toString() } to="/auth/terms" activeStyle={ activeStyle }>
          <LinkText>
            Terms & Conditions
          </LinkText>
        </LinkStyled>
      }
      <LinkStyled isopen={ isOpen.toString() } to="/auth/privacy" activeStyle={ activeStyle }>
        <LinkText>
          Privacy Policy
        </LinkText>
      </LinkStyled>
      {
        showContactUs &&
        <LinkStyled isopen={ isOpen.toString() } to="/auth/contact" activeStyle={ activeStyle }>
          <LinkText>
            Contact Us
          </LinkText>
        </LinkStyled>
      }
      <LinkStyled isopen={ isOpen.toString() } to="/auth/faq" activeStyle={ activeStyle }>
        <LinkText>
          FAQs
        </LinkText>
      </LinkStyled>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 30px 0;
`

const LinkStyled = styled(NavLink)`
  font-family: Roboto;
  font-size: 14px;
  color: #6e7a87;
  text-decoration: none;
  height: 40px;
  display: flex;
  align-items: center;
  
  &:hover {
    background-color: #3D414B;
    color: #fff;
  }
  
  transform: ${props => props.isopen === 'true' ? '0' : 'translate3d(-270px, 0, 0)'};
  transition: transform ${props => props.isopen === 'true' ? '1s' : '1.5s'} ease-in-out;
`

const LinkText = styled.div`
  margin-left: 30px;
`

export default StaticPagesMenu
