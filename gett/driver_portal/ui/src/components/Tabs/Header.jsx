import React, { Component } from 'react'
import styled, { css } from 'styled-components'
import { isEmpty, forEach } from 'lodash'
import { media } from 'components/Media'
import { IconInformation } from 'components/Icons'

class Header extends Component {
  items = [];

  state = {
    itemWidth: 100,
    containerWidth: 100
  }

  componentDidMount() {
    const items = this.items
    if (!isEmpty(items) && this.container) {
      let itemWidth = 0
      forEach(items, (node) => {
        itemWidth += node.clientWidth
      })
      itemWidth = itemWidth / items.length
      this.setState({
        itemWidth,
        containerWidth: this.container.clientWidth
      })
    }
    window.addEventListener('resize', this.updateContainerWidth)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateContainerWidth)
  }

  render() {
    const { children, onClick, active, numChildren, pageWidthPerCent, className } = this.props
    const { itemWidth, containerWidth } = this.state

    return (<Wrapper
      innerRef={ node => this.container = node }
      itemWidth={ itemWidth }
      width={ containerWidth }
      numChildren={ numChildren }
      pageWidthPerCent={ pageWidthPerCent }
      active={ active }
    >
      {
        React.Children.map(children, (child, index) => {
          return (
            child && <Item
              innerRef={ node => this.items.push(node) }
              key={ index }
              active={ active === index }
              className={ className }
              onClick={ () => onClick(index) }>
              {child.props.title}
              { child.props.alerticon && <IconInformationStyled color="#f00" /> }
            </Item>
          )
        })
      }
    </Wrapper>
    )
  }

  updateContainerWidth = () => {
    if (this.container) {
      this.setState({
        containerWidth: this.container.clientWidth
      })
    }
  }
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`

const Item = styled.div`
  font-size: 16px;
  padding: 0 30px;
  cursor: pointer;
  color: #a9b1ba;

  ${props => props.active && css`
    border-bottom: 3px solid #eeaf2e;
    padding-bottom: 18px;
    font-weight: 500;
    color: #000;
  `}

  ${media.phoneLarge`
    padding: 0 15px 20px 15px;
  `}
`

const IconInformationStyled = styled(IconInformation)`
  transform: rotate(180deg);
  margin-left: 5px;
  vertical-align: bottom;
`

export default Header
