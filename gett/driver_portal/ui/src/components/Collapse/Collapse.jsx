import React, { Component } from 'react'
import styled from 'styled-components'

class Collapse extends Component {
  state = {
    expanded: false
  }

  render() {
    const { expanded, key } = this.state

    return (
      <Wrapper key={ key }>
        {
          this.props.collapsed({
            toggle: this.toggle,
            expanded
          })
        }
        {
          expanded && this.props.expanded({
            toggle: this.toggle,
            expanded
          })
        }
      </Wrapper>
    )
  }

  open = () => {
    this.setState({ expanded: true })
  }

  close = () => {
    this.setState({ expanded: false })
  }

  toggle = () => {
    this.setState(state => ({
      ...state,
      expanded: !state.expanded
    }))
  }
}

const Wrapper = styled.div`
  &:hover {
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.2);
  }
`

export default Collapse
