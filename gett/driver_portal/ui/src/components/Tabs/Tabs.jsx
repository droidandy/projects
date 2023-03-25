import React, { Component } from 'react'
import styled, { css } from 'styled-components'
import { media } from 'components/Media'
import Header from './Header'
import Content from './Content'

class Tabs extends Component {
  state = {
    index: 0,
    translation: 0,
    pageWidthPerCent: 0,
    numChildren: 0,
    clientX: null,
    pageWidth: window.innerWidth,
    animation: true
  }

  componentDidMount() {
    const { active } = this.props
    const numChildren = React.Children.count(this.props.children)
    const pageWidthPerCent = 100 / numChildren
    this.setState({
      pageWidthPerCent,
      numChildren
    }, this.selectActive(active, pageWidthPerCent))
  }

  componentWillReceiveProps(newProps) {
    const { index, pageWidthPerCent } = this.state
    const { active } = newProps
    if (active !== index) {
      this.selectActive(active, pageWidthPerCent)
    }
  }

  render() {
    const { children, delimeter, swipe, className } = this.props
    const { index, translation, pageWidthPerCent, animation, numChildren } = this.state
    return <Wrapper
      onTouchMove={ swipe && this.touchMove }
      onTouchEnd={ swipe && this.touchEnd }
    >
      <Header
        active={ index }
        onClick={ this.select }
        numChildren={ numChildren }
        pageWidthPerCent={ pageWidthPerCent }
        className={ className }
      >
        { children }
      </Header>
      { delimeter && <Delimeter /> }
      <Content
        active={ index }
        translation={ translation }
        width={ pageWidthPerCent }
        animation={ animation }
        numChildren={ numChildren }
      >
        { children }
      </Content>
    </Wrapper>
  }

  select = (index) => {
    this.setState({ index, animation: true }, this.updateTranslation(index))
  }

  selectActive = (index, pageWidthPerCent) => {
    if (index && pageWidthPerCent) {
      const translation = index * pageWidthPerCent
      this.setState({ index, translation })
    }
  }

  updateTranslation(index) {
    const { onChange } = this.props
    const translation = index * this.state.pageWidthPerCent
    this.setState({ translation })
    if (onChange) onChange(index)
  }

  touchMove = (e) => {
    const { numChildren, pageWidth, pageWidthPerCent, index } = this.state
    const clientX = e.changedTouches[0].clientX
    const dx = (clientX - this.state.clientX)
    const dxPerCent = dx / (pageWidth * numChildren) * 100
    let translation = this.state.translation - dxPerCent
    const maxTranslation = pageWidthPerCent * (numChildren - 1)
    let selectedIndex = index
    const previousTranslation = selectedIndex * pageWidthPerCent
    const tippingPoint = pageWidthPerCent * 0.3

    if (!this.state.clientX) {
      return this.setState({
        clientX
      })
    }

    if (translation < 0) {
      translation = 0
    } else if (translation > maxTranslation) {
      translation = maxTranslation
    }

    if (dx > 0 && translation < previousTranslation - tippingPoint) {
      selectedIndex -= 1
    } else if (dx < 0 && translation > previousTranslation + tippingPoint) {
      selectedIndex += 1
    }

    this.setState({
      index: selectedIndex,
      translation,
      clientX,
      animation: false
    })
  }

  touchEnd = (e) => {
    const { index, pageWidthPerCent } = this.state
    const translation = index * pageWidthPerCent
    this.setState({
      index,
      translation,
      clientX: null,
      animation: true
    })
  }
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  ${media.phoneLarge`
  width: ${props => props.numChildren && props.width < (props.itemWidth * props.numChildren) ? props.numChildren * 100 : 100}%;
  justify-content: flex-start;

  ${props => css`
    ${css`
      transform: translateX(-${props.itemWidth / 10 * props.active}%);
      transition-property: all;
      transition-duration: 0.2s;
    `}
  `}
`}

`

const Delimeter = styled.div`
  width: 100%;
  height: 2px;
  background-color: #d2dadc;
  margin-bottom: 40px;

  ${media.phoneLarge`
    margin-bottom: 0px;
  `}
`

export default Tabs
