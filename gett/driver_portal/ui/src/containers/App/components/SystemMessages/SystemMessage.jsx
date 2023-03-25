import React from 'react'
import styled from 'styled-components'
import { IconClose } from 'components/Icons'
import SystemMessageIcon from './SystemMessageIcon'
import SystemMessageText from './SystemMessageText'

const SystemMessage = (props) => {
  const { kind } = props

  switch (kind) {
    case 'error':
      return <Error { ...props } />
    case 'success':
      return <Success { ...props } />
    case 'info':
      return <Info { ...props } />
    case 'warning':
      return <Warning { ...props } />
    case 'backToOffice':
      return <Info { ...props } />
    default:
      return <Info { ...props } />
  }
}

const Message = ({ kind, className, children, onClose, closeable, showKind }) => (
  <div className={ className }>
    <Wrapper>
      <SystemMessageIcon kind={ kind } />
      <SystemMessageText showKind={ showKind } kind={ kind }>{ children }</SystemMessageText>
    </Wrapper>
    { closeable && <Close onClick={ onClose } width={ 12 } height={ 12 } color="#fff" /> }
  </div>
)

Message.defaultProps = {
  closeable: true
}

const Common = styled(Message)`
  position: relative;
  z-index: 2;
  font-size: 14px;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  width: 100%;
  padding: 10px 20px 10px 20px;
  line-height: 19px;
`

const Wrapper = styled.div`
  flex: 1;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Close = styled(IconClose)`
  cursor: pointer;
`

const Error = styled(Common)`
  background-color: #ff0000;
`

const Success = styled(Common)`
  background-color: #7bc821;
`

const Info = styled(Common)`
  background-color: #4373d7;
`

const Warning = styled(Common)`
  background-color: #f6b530;
  color: #000;
`

export default SystemMessage
