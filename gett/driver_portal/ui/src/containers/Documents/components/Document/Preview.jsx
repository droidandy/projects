import React, { Component } from 'react'
import styled from 'styled-components'
import { Dialog, DialogHeader, DialogBody } from 'components/Dialog'
import { media } from 'components/Media'

import PreviewPdf from './PreviewPdf'
import PreviewImage from './PreviewImage'

class Preview extends Component {
  render() {
    const { active, onClose, title, file, type, zoom, zoomIn, zoomOut } = this.props

    return (
      <DialogStyled
        onClose={ onClose }
        active={ active }
        nowidth
        fullscreen
        type={ type && type === 'pdf' }
        scrollable={ type && type === 'pdf' }>
        <DialogHeader close header>
          { title }
        </DialogHeader>
        <DialogBody scrollable={ type && type === 'pdf' }>
          {type && type === 'pdf' && <PreviewPdf file={ file } zoom={ zoom } zoomIn={ zoomIn } zoomOut={ zoomOut } />}
          {type && type === 'image' && <PreviewImage file={ file } />}
        </DialogBody>
      </DialogStyled>
    )
  }
}

const DialogStyled = styled(Dialog)`
  transform: translate(-50%, 0%);
  top: 90px;
  
  ${props => props.type && media.phoneLarge`
    width: 90%;
  `}
`

export default Preview
