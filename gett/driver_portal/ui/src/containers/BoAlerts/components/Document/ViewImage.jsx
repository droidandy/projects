import React, { Component } from 'react'
import styled from 'styled-components'

class ViewImage extends Component {
  dragging = false
  state = {
    image: {},
    mouse: {
      x: null,
      y: null
    }
  }

  static defaultProps = {
    width: 710,
    height: 564,
    zoom: 1
  }

  componentDidMount() {
    this.prepareImage(this.props.file)

    window.addEventListener('mousemove', this.handleMouseMove, false)
    window.addEventListener('mouseup', this.handleMouseUp, false)
    if (this.canvas) {
      this.canvas.addEventListener('mousedown', this.handleMouseDown, false)
      this.canvas.addEventListener('mouseout', this.handleMouseUp, false)
    }
    document.onselectstart = e => this.preventSelection(e)
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.handleMouseMove, false)
    window.removeEventListener('mouseup', this.handleMouseUp, false)
    if (this.canvas) {
      this.canvas.removeEventListener('mousedown', this.handleMouseDown, false)
      this.canvas.removeEventListener('mouseout', this.handleMouseUp, false)
    }
  }

  componentDidUpdate(prevProps) {
    const { width, height, file } = this.props
    const { image } = this.state
    if (prevProps.file !== file) {
      this.prepareImage(file)
    }
    if (image && this.canvas) {
      const context = this.canvas.getContext('2d')
      context.clearRect(0, 0, width, height)
      this.addImageToCanvas(context, image)
    }
  }

  render() {
    const { width, height, renderTools } = this.props

    return (
      <Wrapper>
        <canvas
          ref={ node => this.canvas = node }
          width={ width }
          height={ height } />
        { renderTools() }
      </Wrapper>
    )
  }

  fitImageToCanvas(width, height) {
    let scaledHeight, scaledWidth
    const canvasAspectRatio = this.props.height / this.props.width
    const imageAspectRatio = height / width

    if (canvasAspectRatio > imageAspectRatio) {
      scaledHeight = this.props.height
      let scaleRatio = scaledHeight / height
      scaledWidth = width * scaleRatio
    } else {
      scaledWidth = this.props.width
      let scaleRatio = scaledWidth / width
      scaledHeight = height * scaleRatio
    }

    return { width: scaledWidth, height: scaledHeight }
  }

  prepareImage(imageUri) {
    if (!imageUri) return
    const image = new Image()
    /* eslint-disable no-useless-escape */
    if (!imageUri.match(/^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i)) {
      image.crossOrigin = 'anonymous'
    }
    /* eslint-enable no-useless-escape */
    image.onload = () => {
      const scaledImage = this.fitImageToCanvas(image.width, image.height)
      scaledImage.resource = image
      scaledImage.x = 0
      scaledImage.y = 0
      this.dragging = false
      this.setState({ image: scaledImage }, this.toDataURL)
    }
    image.src = imageUri
  }

  toDataURL() {
    const { image: { resource, x, y, height, width } } = this.state
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    canvas.width = this.props.width
    canvas.height = this.props.height

    this.addImageToCanvas(context, {
      resource,
      x,
      y,
      height,
      width
    })

    return canvas.toDataURL()
  }

  addImageToCanvas(context, image) {
    if (!image || !image.resource) return
    const { height, width, zoom, rotate } = this.props

    context.save()
    context.globalCompositeOperation = 'destination-over'

    const scaledWidth = this.state.image.width * zoom
    const scaledHeight = this.state.image.height * zoom

    let x = image.x - (scaledWidth - this.state.image.width) / 2
    let y = image.y - (scaledHeight - this.state.image.height) / 2

    x = Math.min(x, 0)
    y = Math.min(y, 0)
    y = scaledHeight + y >= height ? y : (y + (height - (scaledHeight + y))) / 2
    x = scaledWidth + x >= width ? x : (x + (width - (scaledWidth + x))) / 2

    context.rotate(rotate * (Math.PI / 180))

    context.drawImage(image.resource, x, y, image.width * zoom, image.height * zoom)

    context.restore()
  }

  boundedCoords(x, y, dx, dy) {
    const newX = x - dx
    const newY = y - dy
    const { width, height, zoom } = this.props

    const scaledWidth = this.state.image.width * zoom
    const dw = (scaledWidth - this.state.image.width) / 2
    if (newX - dw > 0) {
      x = dw
    } else if (-newX < (scaledWidth - width) / 2) {
      x = newX
    }

    const scaledHeight = this.state.image.height * zoom
    const dh = (scaledHeight - this.state.image.height) / 2
    if (newY - dh > 0) {
      y = dh
    } else if (-newY < (scaledHeight - height) / 2) {
      y = newY
    }

    return { x, y }
  }

  preventSelection = (e) => {
    if (this.dragging) {
      e.preventDefault()
      return false
    }
  }

  handleMouseMove = (e) => {
    if (!this.dragging) return
    const { image: { x, y } } = this.state

    const mouseX = e.clientX
    const mouseY = e.clientY

    const image = { ...this.state.image }

    if (this.state.mouse.x && this.state.mouse.y) {
      const dx = this.state.mouse.x - mouseX
      const dy = this.state.mouse.y - mouseY

      const bounded = this.boundedCoords(x, y, dx, dy)

      image.x = bounded.x
      image.y = bounded.y
    }

    this.setState(state => ({
      ...state,
      image,
      mouse: {
        x: mouseX,
        y: mouseY
      }
    }))
  }

  handleMouseUp = () => {
    this.dragging = false
    document.body.style.cursor = 'auto'
    this.toDataURL()
  }

  handleMouseDown = () => {
    this.dragging = true
    document.body.style.cursor = 'move'
    this.setState(state => ({
      ...state,
      mouse: {
        x: null,
        y: null
      }
    }))
  }
}

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

export default ViewImage
