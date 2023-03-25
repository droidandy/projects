import React, { Component } from 'react'
import styled, { css } from 'styled-components'

class Cropper extends Component {
  state = {
    dragging: false,
    image: {},
    mouse: {
      x: null,
      y: null
    },
    preview: null,
    zoom: 1
  }

  componentDidMount() {
    this.prepareImage(this.props.image)

    window.addEventListener('mousemove', this.handleMouseMove, false)
    window.addEventListener('mouseup', this.handleMouseUp, false)
    if (this.canvas) {
      this.canvas.addEventListener('mousedown', this.handleMouseDown, false)
    }
    document.onselectstart = e => this.preventSelection(e)
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.handleMouseMove, false)
    window.removeEventListener('mouseup', this.handleMouseUp, false)
    if (this.canvas) {
      this.canvas.removeEventListener('mousedown', this.handleMouseDown, false)
    }
  }

  componentWillReceiveProps(newProps) {
    const { apply } = newProps
    if (this.props.image !== newProps.image) {
      this.prepareImage(newProps.image)
    }
    if (apply && apply !== this.props.apply) {
      this.handleCrop()
    }
  }

  componentDidUpdate() {
    const { width, height, type } = this.props
    const { image } = this.state

    if (image && this.canvas) {
      const context = this.canvas.getContext('2d')
      context.clearRect(0, 0, width, height)
      this.addImageToCanvas(context, image, type)
    }
  }

  render() {
    const { width, height, min, max, defaultValue, step } = this.props
    const { zoom } = this.state
    const rangeValue = (zoom - min) / (max - min)

    return (
      <div>
        <Wrapper>
          <canvas
            ref={ node => this.canvas = node }
            width={ width }
            height={ height } />
          <Range
            type="range"
            onChange={ this.handleZoomUpdate }
            width={ width }
            min={ min }
            max={ max }
            step={ step }
            defaultValue={ defaultValue }
            rangeValue={ rangeValue }
          />
        </Wrapper>
      </div>
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
      this.setState({
        dragging: false,
        image: scaledImage,
        preview: this.toDataURL() })
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

  addImageToCanvas(context, image, type) {
    if (!image || !image.resource) return
    const { zoom } = this.state
    const { height, width } = this.props

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

    context.globalAlpha = 0.5
    context.drawImage(image.resource, x, y, image.width * zoom, image.height * zoom)

    context.beginPath()
    if (type === 'circle') {
      context.arc(width / 2, height / 2, height / 2, 0, 2 * Math.PI)
      context.lineWidth = 0
      context.stroke()

      context.clip()
    } else if (type === 'rectangle') {
      context.rect(20, 20, width - 40, height - 40)
      context.lineWidth = 0
      context.stroke()

      context.clip()
    }

    context.globalAlpha = 1
    context.drawImage(image.resource, x, y, image.width * zoom, image.height * zoom)

    context.restore()
  }

  boundedCoords(x, y, dx, dy) {
    const newX = x - dx
    const newY = y - dy
    const { image: { width, height }, zoom } = this.state

    const scaledWidth = width * zoom
    const dw = (scaledWidth - width) / 2
    if (newX - dw > 0) {
      x = dw
    } else if (-newX < (scaledWidth - this.props.width) / 2) {
      x = newX
    }

    const scaledHeight = height * zoom
    const dh = (scaledHeight - height) / 2
    if (newY - dh > 0) {
      y = dh
    } else if (-newY < (scaledHeight - this.props.height) / 2) {
      y = newY
    }

    return { x, y }
  }

  preventSelection = (e) => {
    if (this.state.dragging) {
      e.preventDefault()
      return false
    }
  }

  handleCrop() {
    this.props.onCrop(this.toDataURL())
  }

  handleMouseMove = (e) => {
    if (!this.state.dragging) return
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
    this.setState({
      dragging: false,
      preview: this.toDataURL()
    })
  }

  handleMouseDown = () => {
    this.setState(state => ({
      ...state,
      dragging: true,
      mouse: {
        x: null,
        y: null
      }
    }))
  }

  handleZoomUpdate = (e) => {
    this.setState({ zoom: e.target.value })
  }
}

Cropper.defaultProps = {
  min: 1,
  max: 3,
  defaultValue: 1,
  width: 500,
  height: 350,
  type: 'circle',
  step: 0.01
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Range = styled.input`
   height: 8px;
   margin-top: 35px;
   border-radius: 6px;
   cursor: pointer;
   width: ${props => props.width ? `${props.width / 2}px` : '100%'};
   
  ${props => props.rangeValue && css`
    background-image: -webkit-gradient(linear, left top, right top, color-stop(${props.rangeValue}, #f6b530), color-stop(${props.rangeValue}, #e9f1f2));
  `}
  
  -webkit-appearance: none;
  &::-webkit-slider-thumb {
    width: 20px;
    height: 20px;
    border-radius: 20px;
    background-color: #ffffff;
    box-shadow: 0 2px 1px 0 rgba(0, 0, 0, 0.03);
    border: solid 1px #e4e5ec;
    cursor: pointer;
    -webkit-appearance: none;
  }
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 20px;
    background-color: #ffffff;
    box-shadow: 0 2px 1px 0 rgba(0, 0, 0, 0.03);
    border: solid 1px #e4e5ec;
    cursor: pointer;
    -webkit-appearance: none;
  }
  
  &:focus {
    outline: none;
  }
`

export default Cropper
