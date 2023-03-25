import React, { Children, Component } from 'react'
import styled, { css } from 'styled-components'
import { media } from '../Media'
import { Overlay } from '../Overlay'
import withPortal from '../hocs/withPortal'

class Dialog extends Component {
  static defaultProps = {
    closeOnEsc: true,
    closeOnOverlayClick: true,
    width: 700
  }

  componentWillMount() {
    document.addEventListener('keydown', this.keyDown)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keyDown)
  }

  render() {
    const { active, children, width, fullscreen, nowidth, scrollable, className } = this.props

    return (
      <Overlay color={ 'rgba(77, 77, 77, 0.7)' } active={ active } onClick={ this.overlayClick }>
        {fullscreen && Children.map(children, child => {
          if (child.props.header) {
            return React.cloneElement(child, {
              onClose: this.close,
              fullscreen
            })
          }
        })}
        <Wrapper
          onClick={ e => e.stopPropagation() }
          width={ width }
          fullscreen={ fullscreen }
          nowidth={ nowidth }
          scrollable={ scrollable }
          className={ className }
        >
          {
            Children.map(children, child => {
              if (fullscreen && child.props.header) return
              return React.cloneElement(child, {
                onClose: this.close,
                fullscreen
              })
            })
          }
        </Wrapper>
      </Overlay>
    )
  }

  close = () => {
    this.props.onClose && this.props.onClose()
  }

  overlayClick = (e) => {
    const { closeOnOverlayClick } = this.props

    if (closeOnOverlayClick) {
      e.stopPropagation()
      this.close()
    }
  }

  keyDown = ({ code }) => {
    const { closeOnEsc } = this.props

    if (closeOnEsc && code === 'Escape') {
      this.close()
    }
  }
}

const Wrapper = styled.div`
  position: fixed;
  z-index: 2;
  top: 50%;
  transition: top .3s;
  left: 50%;
  transform: translate(-50%, -50%);
  width: ${props => props.nowidth ? '' : (props.width ? `${props.width}px` : '90%')};
  max-width: 1000px;
  margin: auto;
  padding: 0;
  background: #fff;
  border-radius: 4px;
  
  ${props => !props.fullscreen && media.phoneLarge`
    width: 100%;
    height: 100%;
    top: 50%;
    border-radius: 0;
    overflow-y: auto;
  `}
  
  ${props => props.scrollable && css`
     height: 80%;
     overflow-y: auto;
  `}
`

export default withPortal()(Dialog)
