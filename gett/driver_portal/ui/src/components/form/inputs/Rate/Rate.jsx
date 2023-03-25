import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { isEmpty } from 'lodash'

import { SelectDropdown } from '../SelectDropdown'

const RATE_VALUES = {
  left: [3, 4, 5],
  right: Array.from(new Array(10).keys())
}

class Rate extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    error: PropTypes.string,
    value: PropTypes.number
  }

  state = {
    leftValue: 0,
    rightValue: 0,
    rightValue2: 0
  }

  componentDidMount() {
    const { value } = this.props
    if (value) this.setValue(value)
  }

  componentWillReceiveProps(newProps) {
    const { value } = newProps
    if (value !== this.props.value) this.setValue(value)
  }

  setValue(value) {
    try {
      const newValue = value.toString().split('.')
      const leftValue = parseFloat(newValue[0])
      const rightValue = !isEmpty(newValue[1]) && newValue[1][0] ? newValue[1][0] : 0
      const rightValue2 = !isEmpty(newValue[1]) && newValue[1][1] ? newValue[1][1] : 0
      this.setState({
        leftValue,
        rightValue,
        rightValue2
      }, () => this.props.onChange(parseFloat(value)))
    } catch (e) {
      console.error(e)
    }
  }

  change = (type) => (value) => {
    this.setState({
      [type]: value
    }, () => {
      const { leftValue, rightValue, rightValue2 } = this.state
      this.props.onChange(parseFloat(`${leftValue}.${rightValue}${rightValue2}`))
    })
  }

  render() {
    const { error, className } = this.props
    const { leftValue, rightValue, rightValue2 } = this.state
    return (
      <div className={ className }>
        <RateWrapper>
          <RateFieldLeft width={ 65 } value={ leftValue > 0 ? leftValue : '0' } values={ RATE_VALUES.left } onChange={ this.change('leftValue') } />
          <Dot>.</Dot>
          <RateField width={ 65 } value={ rightValue > 0 ? rightValue : '0' } values={ RATE_VALUES.right } onChange={ this.change('rightValue') } />
          <RateField width={ 65 } value={ rightValue2 > 0 ? rightValue2 : '0' } values={ RATE_VALUES.right } onChange={ this.change('rightValue2') } />
        </RateWrapper>
        { error && <Error>{ error }</Error> }
      </div>
    )
  }
}

const RateWrapper = styled.div`
  display: flex;
`

const RateField = styled(SelectDropdown)`
  margin: 0 5px;
`

const RateFieldLeft = styled(RateField)`
  margin-left: 0px;
`

const Error = styled.div`
  font-size: 12px;
  text-align: left;
  color: #f00;
  margin-top: 10px;
`

const Dot = styled.div`
  display: flex;
  align-items: flex-end;
`

export default Rate
