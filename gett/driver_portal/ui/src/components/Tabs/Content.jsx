import React from 'react'
import { media } from 'components/Media'
import styled, { css } from 'styled-components'

const Content = ({ children, onClick, active, translation, width, animation, pageWidthPerCent, numChildren }) => (
  <Wrapper
    translation={ translation }
    animation={ animation }
    numChildren={ numChildren }
  >
    {
      React.Children.map(children, (child, index) => (
        <Item
          key={ index }
          active={ active === index }
          width={ width }
        >
          {child}
        </Item>
      ))
    }
  </Wrapper>
)

const Wrapper = styled.div`
  position: relative;
  width: ${props => props.numChildren ? props.numChildren * 100 : 100}%;
  display: flex;
  
  ${props => css`
    ${typeof props.translation && css`
      transform: translateX(-${props.translation}%);
      transition-property: ${props.animation ? 'all' : 'none'};
      transition-duration: 0.2s;
    `}
  `}
`

const Item = styled.div`
  height: ${props => props.active ? 'auto' : 0};
  opacity: ${props => props.active ? 1 : 0};
  width: ${props => props.width ? props.width : '100'}%;
  ${props => !props.active && css`
    opacity: 0;
    height: 0;
  `}
  ${media.phoneMedium`
    padding: 0 15px;
  `}
`

export default Content
