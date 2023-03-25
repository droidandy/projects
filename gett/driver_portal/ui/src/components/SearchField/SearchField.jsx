import React, { PureComponent } from 'react'
import styled, { css } from 'styled-components'
import { IconSearch, IconClear } from 'components/Icons'
import { media } from '../Media'

class SearchField extends PureComponent {
  state = {
    hovered: false
  }

  render() {
    const {
      value,
      type,
      onChange,
      className,
      label,
      disabled,
      borderRadius,
      clear
    } = this.props

    const dark = this.state.hovered

    return (
      <Container className={ className }>
        <Wrapper>
          { label && <Label>{ label }</Label> }
          <Prefix><IconSearch color="#a8a8b5" /></Prefix>
          <Input
            borderRadius={ borderRadius }
            innerRef={ node => this.input = node }
            type={ type }
            disabled={ disabled }
            prefix={ <IconSearch color="#a8a8b5" /> }
            placeholder="Type to search"
            onChange={ event => onChange && onChange(event.target.value) }
            value={ value }
          />
          { value && value.length > 0 && clear && (
            <Sufix
              onMouseEnter={ this.dark }
              onMouseLeave={ this.light }
              onClick={ clear }
            >
              <IconClear color={ dark ? '#74818f' : '#d2dadc' } />
            </Sufix>
          )
          }
        </Wrapper>
      </Container>
    )
  }

  dark = () => {
    this.setState({ hovered: true })
  }

  light = () => {
    this.setState({ hovered: false })
  }
}

const Container = styled.div`
  margin: 10px 0px;
`

const Wrapper = styled.div`
  position: relative;
  width: 100%;
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

const IWrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Prefix = styled(IWrapper)`
  left: 16px;
`

const Sufix = styled(IWrapper)`
  right: 16px;
  cursor: pointer;
`

const Input = styled.input`
  height: 40px;
  border-radius: ${props => props.borderRadius ? props.borderRadius : '4px'};
  border: none;
  min-width: 255px;
  padding: 0px 10px;
  width: 100%;
  font-size: 14px;

  ${props => props.prefix && css`
    min-width: 200px;
    padding-left: 56px;
  `}

  &::placeholder {
    font-size: 14px;
    text-align: left;
    color: #a9b1ba;
    font-weight: 300;
  }
  
  ${media.phoneLarge`
    font-size: 16px;
  `}
  
`

export default SearchField
