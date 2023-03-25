import React, { Component } from 'react'
import styled from 'styled-components'

import { IconZoomIn, IconZoomOut, IconArrow } from 'components/Icons'

import ViewPdf from './ViewPdf'
import ViewImage from './ViewImage'

const IMAGE_MIMETYPES = ['bmp', 'jpg', 'jpeg', 'png', 'tiff']
const DEFAULT_ZOOM = 0.5
const DEFAULT_ZOOM_STEP = 0.1
const DEFAULT_ROTATE_ANGLE = 90

class Viewer extends Component {
  state = {
    type: null,
    zoom: DEFAULT_ZOOM,
    fileUrl: {},
    rotate: 0,
    page: 1,
    numPages: false
  }

  componentDidMount() {
    const file = this.handleCheckFileType({ ...this.props })
    this.setState({
      ...this.props,
      ...file
    })
  }

  componentWillReceiveProps(newProps) {
    if (newProps.fileUrl !== this.props.fileUrl) {
      const file = this.handleCheckFileType({ ...newProps })
      this.setState({
        ...newProps,
        ...file
      })
    }
  }

  render() {
    const { type, zoom, fileUrl, rotate, page, numPages } = this.state
    return (
      <Wrapper>
        {type && type === 'pdf' && <ViewPdf
          fillWidth
          file={ fileUrl }
          zoom={ zoom }
          zoomIn={ this.zoomIn }
          zoomOut={ this.zoomOut }
          rotate={ rotate }
          page={ page }
          nextPage={ numPages && page < numPages && this.renderNextPage }
          previousPage={ numPages && page > 1 && this.renderPreviousPage }
          renderTools={ this.renderTools }
          onDocumentComplete={ this.onDocumentComplete }
        />
        }
        {type && type === 'image' && <ViewImage
          file={ fileUrl }
          zoom={ zoom }
          zoomIn={ this.zoomIn }
          zoomOut={ this.zoomOut }
          rotate={ rotate }
          renderTools={ this.renderTools } />
        }
      </Wrapper>
    )
  }

  // check document type from BE
  handleCheckFileType = ({ fileUrl, contentType }) => {
    if (!fileUrl) return { type: '', filename: '' }
    let format = ''
    if (contentType === 'application/pdf') format = 'pdf'
    else if (typeof contentType === 'string' && contentType.indexOf('image') !== -1) format = 'image'
    else if (!contentType) {
      const parts = fileUrl.split('.')
      format = parts[parts.length - 1]
    }
    const filename = fileUrl.substring(fileUrl.lastIndexOf('/') + 1)
    if (format === 'pdf') {
      return { type: format, filename }
    } else if (IMAGE_MIMETYPES.includes(format) || format === 'image') {
      return { type: 'image', filename }
    }
    return null
  }

  renderTools = () => {
    return (
      <ToolsWrapper>
        {/* <IconWrapper onClick={ this.rotate }> */}
        {/* <IconRotate height={ 16 } width={ 16 } color={ '#d2dadc' } /> */}
        {/* </IconWrapper> */}
        <IconWrapper onClick={ this.zoomIn }>
          <IconZoomIn height={ 16 } width={ 16 } color={ '#d2dadc' } />
        </IconWrapper>
        <IconWrapper onClick={ this.zoomOut }>
          <IconZoomOut height={ 16 } width={ 16 } color={ '#d2dadc' } />
        </IconWrapper>
      </ToolsWrapper>
    )
  }

  renderPreviousPage = () => {
    return (
      <PreviousPageWrapper onClick={ this.previousPage }>
        <IconArrow width={ 4 } height={ 8 } />
      </PreviousPageWrapper>
    )
  }

  renderNextPage = () => {
    return (
      <NextPageWrapper onClick={ this.nextPage }>
        <IconArrowNext width={ 4 } height={ 8 } />
      </NextPageWrapper>
    )
  }

  zoomIn = () => {
    this.setState(state => ({
      ...state,
      zoom: state.zoom + DEFAULT_ZOOM_STEP
    }))
  }

  zoomOut = () => {
    this.setState(state => ({
      ...state,
      zoom: state.zoom - DEFAULT_ZOOM_STEP
    }))
  }

  rotate = () => {
    this.setState(state => ({
      ...state,
      rotate: state.rotate < 360 ? state.rotate + DEFAULT_ROTATE_ANGLE : 0
    }))
  }

  onDocumentComplete = (pages) => {
    const { numPages } = this.state
    if (!numPages && pages > 1) this.setState({ numPages: pages })
  }

  nextPage = () => {
    this.setState(state => ({
      ...state,
      page: state.page < state.numPages ? state.page + 1 : state.page
    }))
  }

  previousPage = () => {
    this.setState(state => ({
      ...state,
      page: state.page > 0 ? state.page - 1 : state.page
    }))
  }
}

const Wrapper = styled.div`
  flex: 3;
  outline: solid 1px #d1d1d1;
  max-height: 564px;
  max-width: 710px;
  min-height: 100px;
`

const IconWrapper = styled.div`
  padding: 5px;
  border: solid 1px #d2dadc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 10px;
  
  &:hover {
    background-color: #f6b530;
  }
`

const ToolsWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  position: absolute;
  margin: auto;
  top: 40px;
  right: 30px;
  width: 30px;
  height: auto;
`

const PreviousPageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 30px;
  border: solid 1px #d2dadc;
  border-radius: 50%;
  cursor: pointer;
  height: 30px;
  width: 30px;
  z-index: 1;
  
  &:hover {
    background-color: #f6b530;
  }
`

const NextPageWrapper = styled(PreviousPageWrapper)`
  top: 50%;
  left: auto;
  right: 30px;
`

const IconArrowNext = styled(IconArrow)`
  transform: rotate(180deg);
`

export default Viewer
