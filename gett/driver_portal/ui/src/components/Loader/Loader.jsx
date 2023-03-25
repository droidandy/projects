import React from 'react'
import styled, { keyframes } from 'styled-components'

const Loader = ({ props, className, color }) => {
  return (
    <Wrapper className={ className }>
      <Dot1 color={ color } />
      <Dot2 color={ color } />
      <Dot3 color={ color } />
    </Wrapper>
  )
}

Loader.defaultProps = {
  color: '#FDB924'
}

const scale = keyframes`
  0% {
    transform: scale(1);
    opacity: 1; }
  45% {
    transform: scale(0.1);
    opacity: 0.7; }
  80% {
    transform: scale(1);
    opacity: 1;
  }
`

const Wrapper = styled.div`
  margin: 0 auto;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 10px 0px;
  width: 200px;
  justify-content: center;
`

const Dot = styled.div`
  height: 15px;
  width: 15px;
  background-color: ${props => props.color ? props.color : '#000'};
  border-radius: 100%;
  margin: 0px 2px;

  animation-fill-mode: both;
`

const Dot1 = styled(Dot)`
  animation: ${scale} .75s -.24s infinite cubic-bezier(.2,.68,.18,1.08);
`

const Dot2 = styled(Dot)`
  animation: ${scale} .75s -.12s infinite cubic-bezier(.2,.68,.18,1.08);
`

const Dot3 = styled(Dot)`
  animation: ${scale} .75s 0s infinite cubic-bezier(.2,.68,.18,1.08);
`

export default Loader
