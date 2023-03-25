import withPortal from 'components/hocs/withPortal'
import styled, { css } from 'styled-components'

const Overlay = styled.div`
  overflow: hidden;
  position: fixed;
  z-index: 2;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  visibility: ${(props) => props.active ? 'visible' : 'hidden'};
  opacity: ${(props) => props.active ? 1 : 0};
  ${props => props.color && css`
    background-color: ${props.color}
  `}
`

export default withPortal()(Overlay)
