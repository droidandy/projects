import React, { Component } from 'react'

class PdfPagePagination extends Component {
  componentDidMount() {
    const { pdf, page } = this.props
    pdf.getPage(page).then(this.renderPage)
  }

  componentWillReceiveProps(newProps) {
    const { pdf, page, scale, rotate } = this.props
    if (scale !== newProps.scale ||
        page !== newProps.page ||
      rotate !== newProps.rotate) {
      pdf.getPage(newProps.page).then(this.renderPage)
    }
  }

  renderPage = (pdfPage) => {
    if (pdfPage) {
      const {
        fillWidth,
        fillHeight,
        rotate,
        scale
      } = this.props

      // We need to create a new canvas every time in order to avoid concurrent rendering
      // in the same canvas, which can lead to distorted or upside-down views.
      const canvas = this.canvas

      // Replace or add the new canvas to the placehloder div set up in the render method.
      const parentElement = this.canvasParent
      const previousCanvas = parentElement.firstChild
      if (previousCanvas) {
        parentElement.replaceChild(canvas, previousCanvas)
      } else {
        parentElement.appendChild(canvas)
      }

      const canvasContext = canvas.getContext('2d')
      canvasContext.globalCompositeOperation = 'destination-over'
      const dpiScale = window.devicePixelRatio || 1
      const newScale = this.calculateScale(scale, fillWidth, fillHeight, pdfPage.view, parentElement)
      const adjustedScale = newScale * dpiScale
      const viewport = pdfPage.getViewport(adjustedScale, rotate)

      canvas.style.width = `${viewport.width / dpiScale}px`
      canvas.style.height = `${viewport.height / dpiScale}px`
      canvas.height = viewport.height / dpiScale
      canvas.width = viewport.width / dpiScale
      pdfPage.render({ canvasContext, viewport })
    }
  }

  calculateScale = (scale, fillWidth, fillHeight, view, parentElement) => {
    if (fillWidth) {
      const pageWidth = view[2] - view[0]
      return parentElement.clientWidth / pageWidth
    }
    if (fillHeight) {
      const pageHeight = view[3] - view[1]
      return parentElement.clientHeight / pageHeight
    }
    return scale
  }

  render() {
    const { className } = this.props
    return (
      <div ref={ (parentDiv) => { this.canvasParent = parentDiv } }>
        <canvas ref={ node => { this.canvas = node } } className={ className } />
      </div>
    )
  }
}

export default PdfPagePagination
