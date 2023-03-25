import React, { Component } from 'react'
import styled from 'styled-components'
import pdfjs from 'pdfjs-dist'
import { debounce } from 'lodash'

import { Loader } from 'components/Loader'

import ViewImage from './ViewImage'

class ViewPdf extends Component {
  state = {
    file: null
  }

  componentDidMount() {
    const { file, zoom, rotate, page, onDocumentComplete } = this.props

    this.getPdf({ file, page, zoom, rotate, onDocumentComplete })
  }

  componentWillReceiveProps(newProps) {
    const { zoom, page, rotate } = this.props
    if (zoom !== newProps.zoom ||
    page !== newProps.page ||
    rotate !== newProps.rotate) {
      this.getPdfDebounce()
    }
  }

  render() {
    const { zoomIn, zoomOut, zoom, renderTools, nextPage, previousPage } = this.props
    const { file } = this.state

    return (<ViewPdfWrapper>
      { previousPage && previousPage() }
      {file ? <ViewImage
        file={ file }
        renderTools={ renderTools }
        zoom={ zoom }
        zoomIn={ zoomIn }
        zoomOut={ zoomOut }
      /> : <LoaderStyled />}
      { nextPage && nextPage() }
    </ViewPdfWrapper>
    )
  }

  getPdfDebounce = debounce(() => {
    const { zoom, page, rotate, file } = this.props
    this.getPdf({ zoom, page, rotate, file })
  }, 300)

  getPdf = ({ file, page, zoom, rotate, onDocumentComplete }) => {
    const doc = pdfjs.getDocument(file)
    doc.promise.then((pdf) => {
      if (onDocumentComplete) onDocumentComplete(pdf.numPages)
      pdf.getPage(page).then((page) => {
        const dpiScale = window.devicePixelRatio || 1
        const viewport = page.getViewport(zoom * dpiScale)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.height = viewport.height
        canvas.width = viewport.width
        const renderContext = {
          canvasContext: ctx,
          viewport
        }
        page.render(renderContext).then(() => {
          ctx.globalCompositeOperation = 'destination-over'
          ctx.fillStyle = '#fff'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          this.setState({
            file: canvas.toDataURL()
          })
        })
      })
    }).catch(e => { console.error(e) })
  }
}

const LoaderStyled = styled(Loader)`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
`

const ViewPdfWrapper = styled.div`
  position: relative;
`

export default ViewPdf
