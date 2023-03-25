import React from 'react'
import styled from 'styled-components'
import {
  IconErrorOutline,
  IconSuccessOutline,
  IconInformationOutline
} from 'components/Icons'

const KindIcon = ({ kind, className }) => {
  switch (kind) {
    case 'error':
      return <IconErrorOutline
        className={ className }
        width={ 20 }
        height={ 20 }
        color="#fff"
      />
    case 'success':
      return <IconSuccessOutline
        className={ className }
        width={ 20 }
        height={ 20 }
        color="#fff"
      />
    case 'info':
      return <IconInformationOutline
        className={ className }
        width={ 20 }
        height={ 20 }
        color="#fff"
      />
    case 'warning':
      return <IconInformationOutline
        className={ className }
        width={ 20 }
        height={ 20 }
        color="#000"
      />
    default:
      return <IconInformationOutline
        className={ className }
        width={ 20 }
        height={ 20 }
        color="#fff"
      />
  }
}

const SystemMessageIcon = styled(KindIcon)`
  min-width: 20px;
`

export default SystemMessageIcon
