import React, { Component } from 'react'
import styled from 'styled-components'
import { capitalize } from 'lodash'
import { breakpoints } from 'components/Media'
import { IconClose } from 'components/Icons'
import StickyMessageIcon from './StickyMessageIcon'

const defaultTimeout = 3000

class StickyMessage extends Component {
  componentDidMount() {
    const { timeout } = this.props

    if (timeout !== false) {
      this.timeout = setTimeout(this.close, timeout || defaultTimeout)
    }
  }

  componentWillUnmount() {
    this.close()
  }

  render() {
    const { kind, children } = this.props

    return (
      <Wrapper>
        <Close onClick={ this.close } color="#6e7a87" width={ 12 } height={ 12 } />
        <StickyMessageIcon kind={ kind } />
        <Content>
          <Bold>{ `${capitalize(kind)}!` }</Bold>
          { children }
        </Content>
      </Wrapper>
    )
  }

  close = () => {
    this.cleanup()
    this.props.onClose()
  }

  cleanup = () => {
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
  }
}

const Wrapper = styled.div`
  position: relative;
  width: 290px;
  min-height: 70px;
  border-radius: 4px;
  background-color: #ffffff;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  margin-bottom: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 80px;

  ${breakpoints.phoneLarge`
    width: 400px;
    min-height: 90px;
    margin-bottom: 20px;
  `}
`

const Close = styled(IconClose)`
  position: absolute;
  top: 12px;
  right: 12px;
  cursor: pointer;
`

const Content = styled.div`
  flex: 1;
  padding: 10px 20px;
  font-size: 14px;
  line-height: 1.5;
  text-align: left;
  color: #6e7a87;
  font-weight: 400;
`

const Bold = styled.div`
  font-size: 16px;
  font-weight: 500;
  text-align: left;
  color: #000000;
  margin-bottom: 5px;
`

export default StickyMessage
