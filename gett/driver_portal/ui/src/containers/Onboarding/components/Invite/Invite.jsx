import React, { Component } from 'react'
import styled from 'styled-components'
import Title from './Title'
import Step from './Step'
import NextButton from './NextButton'

class Invite extends Component {
  state = {
    attrs: {}
  }

  render() {
    const { invite, errors } = this.props

    return (
      <Wrapper>
        <Title invite={ invite } errors={ errors } />
        <Step
          invite={ invite }
          attrs={ this.attrs() }
          errors={ errors }
          onUpdate={ this.update }
        />
        <NextButton
          onClick={ this.next }
          invite={ invite }
          errors={ errors }
        />
      </Wrapper>
    )
  }

  attrs() {
    return { ...this.props.attrs, ...this.state.attrs }
  }

  next = () => {
    this.props.onNext(this.attrs())
  }

  update = (attrs) => {
    this.setState(state => ({
      ...state,
      attrs: { ...state.attrs, ...attrs }
    }))
  }
}

const Wrapper = styled.div`
`

export default Invite
