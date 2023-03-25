import React, { Component } from 'react'
import styled from 'styled-components'

import validate from './validation'

class PasswordComplexity extends Component {
  state = {
    body: null,
    label: null
  }

  componentDidMount() {
    this.setState({ ...this.getGraph(validate(this.props.value)) })
  }

  componentDidUpdate(prevProps) {
    const { value } = this.props
    if (prevProps.value !== value) {
      this.setState({ ...this.getGraph(validate(value)) })
    }
  }

  getGraph(type) {
    const graph = {}
    switch (type) {
      case 'weak':
        graph.body = <Weak />
        graph.label = 'Weak'
        break
      case 'fair':
        graph.body = <Fair />
        graph.label = 'Fair'
        break
      case 'good':
        graph.body = <Good />
        graph.label = 'Good'
        break
      case 'strong':
        graph.body = <Strong />
        graph.label = 'Strong'
        break
      default:
        graph.body = null
        graph.label = null
        break
    }

    return graph
  }

  render() {
    const { body, label } = this.state

    return (
      <Wrapper>
        <Graph>
          {body}
        </Graph>
        <Label>
          {label}
        </Label>
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
`

const Weak = styled.div`
  width: 25%;
  height: 12px;
  border-radius: 6px;
  background-color: #ff0000;
`

const Fair = styled.div`
  width: 50%;
  height: 12px;
  border-radius: 6px;
  background-color: #f6b530;
`

const Good = styled.div`
  width: 75%;
  height: 12px;
  border-radius: 6px;
  background-color: #4373d7;
`

const Strong = styled.div`
  width: 100%;
  height: 12px;
  border-radius: 6px;
  background-color: #6bc11a;
`

const Graph = styled.div`
  width: 70%;
  height: 12px;
  border-radius: 6px;
  background-color: #e9f1f2;
`

const Label = styled.div`
  width: 30%;
  align-self: flex-end;
  font-size: 12px;
  text-align: right;
`

export default PasswordComplexity
