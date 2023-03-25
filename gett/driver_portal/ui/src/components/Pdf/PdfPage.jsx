import React, { Component } from 'react'

class PdfScrollPage extends Component {
  componentDidMount() {
    const { pdf, page } = this.props
    pdf.getPage(page).then(this.renderPage)
  }

  componentWillReceiveProps(newProps) {
    const { pdf, page, scale, rotate } = this.props
    if (scale !== newProps.scale || rotate !== newProps.rotate) {
      pdf.getPage(page).then(this.renderPage)
    }
  }

  renderPage = (pdfPage) => {
    if (pdfPage) {
      const canvasContext = this.canvas.getContext('2d')
      const { scale, rotate } = this.props
      const dpiScale = window.devicePixelRatio || 1
      const adjustedScale = scale * dpiScale
      const viewport = pdfPage.getViewport(adjustedScale, rotate)
      this.canvas.style.width = `${viewport.width / dpiScale}px`
      this.canvas.style.height = `${viewport.height / dpiScale}px`
      this.canvas.height = viewport.height
      this.canvas.width = viewport.width
      pdfPage.render({ canvasContext, viewport })
    }
  }

  render() {
    const { className } = this.props
    return (
      <div>
        <canvas ref={ node => { this.canvas = node } } className={ className } />
      </div>
    )
  }
}

export default PdfScrollPage
