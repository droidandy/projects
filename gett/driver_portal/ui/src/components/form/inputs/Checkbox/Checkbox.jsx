import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { IconCheckMark } from 'components/Icons'

class Checkbox extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    error: PropTypes.string,
    value: PropTypes.bool
  }

  state = {
    value: false
  }

  componentDidMount() {
    const { value } = this.props
    if (value) this.setState({ value })
  }

  componentWillReceiveProps(newProps) {
    const { value } = newProps
    if (value !== this.props.value) this.setState({ value })
  }

  change = (e) => {
    this.setState(state => ({
      value: !state.value
    }), () => this.props.onChange(this.state.value))
  }

  render() {
    const { value } = this.state

    return (
      <Wrapper onClick={ e => e.stopPropagation() }>
        <Input
          type="checkbox"
          checked={ value }
          onChange={ this.change }
        />
        <Tick
          color="#000000"
          checked={ value }
          onClick={ this.change }
        />
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  position: relative;
  width: 16px;
  height: 16px;
  margin: 0;
`

const Tick = styled(IconCheckMark)`
  position: absolute;
  left: 4px;
  top: 4px;
  display: none;

  ${props => props.checked && css`
    display: block;
  `}

  cursor: pointer;
`

const Input = styled.input`
  margin: 0;
  appearance: none;
  border-radius: 2px;
  border: solid 1px #ccd7e1;
  width: 16px;
  height: 16px;
  cursor: pointer;

  &:hover {
    border: solid 1px #fdb725;
  }

  ${props => props.checked && css`
    background-color: #fdb725
  `}
`

export default Checkbox
