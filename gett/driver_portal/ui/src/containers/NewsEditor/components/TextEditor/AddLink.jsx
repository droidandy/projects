import React, { Component } from 'react'
import styled from 'styled-components'

import { TextField } from 'components/TextField'
import { Button } from 'components/Button'

class AddLink extends Component {
  componentDidMount() {
    this.props.getLinkFromChild(this.addLink)
  }

  render() {
    const { top, left, text, handleClickApply, handleAddLinkChange } = this.props
    return <Wrapper top={ top - 193 } left={ left } innerRef={ node => this.addLink = node }>
      <InputContainer>
        <Label> Text:</Label>
        <Text
          onChange={ (value) => handleAddLinkChange('text', value) }
          height={ 30 }
          value={ text }
        />
      </InputContainer>
      <Container>
        <InputContainer>
          <Label>Link:</Label>
          <Text
            onChange={ (value) => handleAddLinkChange('link', value) }
            height={ 30 }
            blur={ (value) => handleAddLinkChange('link', value) }
          />
        </InputContainer>
        <ApplyButton onClick={ handleClickApply }>Apply</ApplyButton>
      </Container>
    </Wrapper>
  }
}

const Wrapper = styled.div`
  position: absolute;
  width: 460px;
  border-radius: 4px;
  background-color: #ffffff;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  top: ${props => props.top ? props.top : 26}px;
  left: ${props => props.left ? props.left : 16}px;
`

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const InputContainer = styled.div`
  display:flex;
  align-items: center;
`

const Label = styled.div`
  font-family: Roboto;
  font-size: 12px;
  margin: 0 12px 0 10px;
`

const Text = styled(TextField)`
  width: 290px;
  border-radius: 4px;
`

const ApplyButton = styled(Button)`
  width: 100px;
  height: 30px;
  border-radius: 4px;
  background-color: #f6b530;
  margin-right: 12px;
`

export default AddLink
