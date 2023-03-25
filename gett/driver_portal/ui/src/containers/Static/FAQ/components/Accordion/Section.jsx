import React, { Component } from 'react'
import { Circle } from 'containers/Static/components/Circle'
import { IconArrow } from 'components/Icons'
import styled from 'styled-components'

export default class Section extends Component {
  state = {
    opened: false,
    maxHeight: 0
  }

  componentDidMount() {
    this.setState({ maxHeight: this.content.children[0].clientHeight })
  }

  onSelect = () => {
    this.setState(state => ({ opened: !state.opened }))
  }

  render() {
    const { title, children, index } = this.props
    const { opened, maxHeight } = this.state

    return (
      <Wrapper>
        <Header onClick={ this.onSelect }>
          <Circle active={ opened } number={ index + 1 } />
          <Title>{ title }</Title>
          <IconHolder>
            { opened
              ? <OffArrow color="#74818f" width={ 4 } height={ 8 } />
              : <OnArrow color="#74818f" width={ 4 } height={ 8 } />
            }
          </IconHolder>
        </Header>
        <Content maxHeight={ maxHeight } innerRef={ content => this.content = content } active={ opened }>
          { children }
        </Content>
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  background: #fff;
  padding: 10px 10px 10px 15px;
  margin-bottom: 10px;
`
const Header = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 16px;
  background: #fff;
  font-weight: bold;
`
const Title = styled.span`
  margin-left: 20px;
`

const IconHolder = styled.div`
  flex-shrink: 0;
  text-align: center;
  width: 24px;
  height: 24px;
  margin-left: auto;
  border-radius: 50%;
  border: 1px solid #d2dadc;
`
const OffArrow = styled(IconArrow)`
  transform: rotate(-270deg);
`
const OnArrow = styled(IconArrow)`
  transform: rotate(-90deg);
`

const Content = styled.div`
  max-height: 0;
  transition: max-height 0.3s linear;
  overflow: hidden;
  margin-left: 50px;
  font-size: 14px;

  ${props => props.active && `max-height: ${props.maxHeight}px`};
`
