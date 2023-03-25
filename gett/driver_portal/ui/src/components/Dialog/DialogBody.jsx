import styled, { css } from 'styled-components'
import { media } from '../Media'

const DialogBody = styled.div`
  ${props => !props.fullscreen && css`
    padding: 25px 50px 0px 50px;
  `}
  
  ${props => !props.fullscreen && media.phoneLarge`
    padding: 25px 20px 0px 20px;
  `}
  
  ${props => props.scrollable && css`
    overflow-y: auto;
    height: 100%;
  `}
`

export default DialogBody
