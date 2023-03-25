import React from 'react'
import styled, { css } from 'styled-components'
import { IconClose } from 'components/Icons'

const DialogHeader = ({ text, close, onClose, children, fullscreen, background }) => (
  <Wrapper background={ background }>
    <Text fullscreen={ fullscreen }>{ text || children }</Text>
    {
      close && <Close onClick={ onClose }>
        <IconClose width={ fullscreen ? 30 : 12 } height={ fullscreen ? 30 : 12 } color={ fullscreen ? '#fff' : '#74818f' } />
      </Close>
    }
  </Wrapper>
)

const Wrapper = styled.div`
  position: relative;
  padding: 25px 25px 0px 25px;
  ${props => props.background && css`background: ${props.background}`}
`

const Text = styled.div`
  font-size: 20px;
  font-weight: 500;
  color: #000000;
  
  ${props => props.fullscreen && css`
    color: #fff;
    font-size: 18px;
    text-align: center;
  `}
`

const Close = styled.span`
  position: absolute;
  right: 15px;
  top: 15px;
  padding: 10px;
  cursor: pointer;
`

export default DialogHeader
