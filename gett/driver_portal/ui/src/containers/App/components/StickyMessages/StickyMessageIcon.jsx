import React from 'react'
import styled from 'styled-components'
import {
  IconErrorOutline,
  IconSuccessOutline,
  IconInformationOutline
} from 'components/Icons'

const StickyMessageIcon = ({ kind }) => (
  <KindWrapper kind={ kind }>
    <KindIcon kind={ kind } />
  </KindWrapper>
)

const KindWrapper = ({ kind, children }) => {
  switch (kind) {
    case 'error':
      return <WrapperError>{ children }</WrapperError>
    case 'success':
      return <WrapperSuccess>{ children }</WrapperSuccess>
    case 'info':
      return <WrapperInfo>{ children }</WrapperInfo>
    case 'warning':
      return <WrapperWarning>{ children }</WrapperWarning>
    default:
      return <WrapperInfo>{ children }</WrapperInfo>
  }
}

const KindIcon = ({ kind, className }) => {
  switch (kind) {
    case 'error':
      return <IconErrorOutline
        width={ 34 }
        height={ 34 }
        color="#ff0000"
      />
    case 'success':
      return <IconSuccessOutline
        width={ 34 }
        height={ 34 }
        color="#7ac621"
      />
    case 'info':
      return <IconInformationOutline
        width={ 34 }
        height={ 34 }
        color="#4373d7"
      />
    case 'warning':
      return <IconInformationOutline
        width={ 34 }
        height={ 34 }
        color="#fcb625"
      />
    default:
      return <IconInformationOutline
        width={ 34 }
        height={ 34 }
        color="#4373d7"
      />
  }
}

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const WrapperError = styled(Wrapper)`
  background-color: rgba(255, 0, 0, 0.2);
`

const WrapperSuccess = styled(Wrapper)`
  background-color: rgba(123, 200, 33, 0.2);
`

const WrapperInfo = styled(Wrapper)`
  background-color: rgba(67, 115, 215, 0.2);
`

const WrapperWarning = styled(Wrapper)`
  background-color: rgba(246, 181, 48, 0.2);
`

export default StickyMessageIcon
