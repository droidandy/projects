import styled from 'styled-components'
import { media } from '../Media'

const DialogFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 50px 0px 40px 0px;
  
  ${media.phoneLarge`
    justify-content: space-between;
    margin: 25px 20px 20px;
  `}
`

export default DialogFooter
