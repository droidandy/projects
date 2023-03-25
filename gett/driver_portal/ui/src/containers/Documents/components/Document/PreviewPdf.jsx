import React, { Component } from 'react'
import styled from 'styled-components'

import { PDF } from 'components/Pdf'
import { Loader } from 'components/Loader'

import { IconZoomIn, IconZoomOut, IconDownload } from 'components/Icons'

class PreviewPdf extends Component {
  renderTools = () => {
    const { file, zoomIn, zoomOut } = this.props
    return (
      <ToolsWrapper>
        <IconWrapper onClick={ zoomIn }>
          <IconZoomIn height={ 20 } width={ 20 } color={ '#ffffff' } />
        </IconWrapper>
        <IconWrapper onClick={ zoomOut }>
          <IconZoomOut height={ 20 } width={ 20 } color={ '#ffffff' } />
        </IconWrapper>
        <Download download href={ file } >
          <IconDownload height={ 20 } width={ 20 } color={ '#ffffff' } />
        </Download>
      </ToolsWrapper>
    )
  }

  render() {
    const { file, zoom } = this.props
    return (
      <div>
        <PDFStyled
          Loader={ LoaderStyled }
          file={ file }
          scale={ zoom }
        />
        { this.renderTools() }
      </div>
    )
  }
}

const IconWrapper = styled.div`
  width: 33%;
  padding: 5px;
  border-right: 1px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`

const ToolsWrapper = styled.div`
  display: flex;
  align-items: center;
  position: fixed;
  width: 162px;
  height: 50px;
  margin: auto;
  left: 0;
  right: 0;
  opacity: 0.8;
  border-radius: 10px;
  background-color: #000000;
  bottom: 15%;
`

const Download = styled.a`
  margin: auto;
`

const LoaderStyled = styled(Loader)`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
`

const PDFStyled = styled(PDF)`
  padding: 10px;
`

export default PreviewPdf
