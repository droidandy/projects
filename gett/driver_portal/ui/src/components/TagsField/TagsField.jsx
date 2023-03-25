import React, { Component } from 'react'
import styled from 'styled-components'
import { map, includes, last, isEmpty, isEqual } from 'lodash'
import { IconClose } from 'components/Icons'

class TagsField extends Component {
  state = {
    value: ''
  }

  componentDidMount() {
    this.focusOnInput()
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.tags, nextProps.tags)) {
      this.setState({ value: '' })
    }
  }

  render() {
    const { value } = this.state
    const { placeholder, className, label, errors, onRemove } = this.props

    const tags = map(this.props.tags, (tag, index) => (
      <Tag key={ index }>
        { tag }
        <Remove
          widht={ 10 }
          height={ 10 }
          color="#fff"
          onClick={ () => onRemove(tag) }
        />
      </Tag>
    ))

    return (
      <Container className={ className }>
        { label && <Label>{ label }</Label> }
        <Wrapper onClick={ this.focusOnInput }>
          { tags }
          <Input
            innerRef={ ref => this.textField = ref }
            value={ value }
            onKeyDown={ this.onKeyDown }
            onChange={ this.onChange }
            onBlur={ this.onBlur }
            placeholder={ placeholder }
          />
        </Wrapper>
        {
          !isEmpty(errors) && <Errors>
            { map(errors, (error, index) => <Error key={ index }>{ error }</Error>) }
          </Errors>
        }
      </Container>
    )
  }

  onKeyDown = (event) => {
    const { value } = this.state
    const { keyCode } = event

    const endOfInputKeys = [
      13, // enter
      32, // space
      186, // comma
      188 // semicolon
    ]

    const deleteLastKeys = [
      8 // backspace
    ]

    if (includes(endOfInputKeys, keyCode)) {
      event.preventDefault()
      this.props.onChange(value)
    } else if (includes(deleteLastKeys, keyCode) && isEmpty(value)) {
      this.props.onRemove(last(this.props.tags))
    }
  }

  onBlur = () => {
    this.props.onChange(this.state.value)
  }

  onChange = (event) => {
    this.setState({ value: event.target.value })
  }

  focusOnInput = () => {
    this.textField.focus()
  }
}

const Container = styled.div`
  position: relative;
  margin: 10px 0px;
`

const Label = styled.div`
  width: 100%;
  height: 13px;
  font-size: 10px;
  font-weight: bold;
  text-align: left;
  color: #a9b1ba;
  margin-bottom: 5px;
  text-transform: uppercase;
`

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  border-radius: 4px;
  border: solid 1px #a8a8b5;
  padding: 10px 10px 0px 10px;
  overflow: hidden;
`

const Tag = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background-color: #4373d7;
  height: 30px;
  padding-left: 10px;
  font-size: 14px;
  text-align: left;
  color: #ffffff;
  margin-right: 10px;
  margin-bottom: 10px;
`

const Remove = styled(IconClose)`
  cursor: pointer;
`

const Input = styled.input`
  font-size: 14px;
  border: none;
  outline: 0;
  flex: 1;
  margin-bottom: 10px;
`

const Errors = styled.div`
  margin-top: 5px;
`

const Error = styled.div`
  font-size: 12px;
  text-align: left;
  color: #ff0000;
`

export default TagsField
