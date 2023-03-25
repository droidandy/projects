import React from 'react'
import styled, { css } from 'styled-components'
import { breakpoints, sizes } from 'components/Media'

const Wrapper = ({ children, src, bg, onClick }) => {
  return (
    <Body src={ src } bg={ bg } onClick={ onClick }>
      { children }
    </Body>
  )
}

export default Wrapper

const Body = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  background: #fff;
  margin:0 0 20px 0;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  min-width: 290px;
   
  ${props => props.onClick && css`
    cursor: pointer;
  `}

  ${props => props.src && css`
    color: #fff;
    background-image: url(${props => props.src});
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 50% 50%;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  `}

  ${props => props.bg && css`
    color: #fff;
    background-color: ${props => props.bg};
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  `}
  
  ${breakpoints.desktopMediumLarge`
    flex: 0 1 calc(20% - 16px);

    &:not(:nth-child(5n)) {
      margin:0 20px 20px 0;
    }
  `}
  
  @media (max-width: ${sizes.desktopMediumLarge}px) and (min-width: ${sizes.desktopMedium}px) {
    flex: 0 1 calc(25% - 15px);
    
    &:not(:nth-child(4n)) {
      margin:0 20px 20px 0;
    }
  }

  
  @media (max-width: ${sizes.desktopMedium}px) and (min-width: ${sizes.desktopSmall}px) {
    flex: 0 1 calc(33% - 13.3px);
    
    &:not(:nth-child(3n)) {
      margin:0 20px 20px 0;
    }
  }

  @media (max-width: ${sizes.desktopSmall}px) and (min-width: ${sizes.phoneMedium}px) {

    flex: 0 1 calc(50% - 10px);
    
    &:not(:nth-child(2n)) {
      margin:0 20px 20px 0;
    }
  }
  
  @media (max-width: ${sizes.phoneMedium}px) {
    flex: 0 1 100%;
    margin-right: 0;
  }
`
